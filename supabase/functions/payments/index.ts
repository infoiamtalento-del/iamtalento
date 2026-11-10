// Razorpay payments: create gateway order, verify checkout signature, webhook.
// Secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
// Supabase injects SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

const json = (body: unknown, status = 200, req?: Request) =>
  new Response(JSON.stringify(body), { status, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });

const enc = new TextEncoder();
async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  try {
    // ---- Webhook (no user JWT; authenticated by HMAC) ----
    if (action === "webhook") {
      const raw = await req.text();
      const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
      const given = req.headers.get("x-razorpay-signature") ?? "";
      if (!secret || !safeEqual(await hmacHex(secret, raw), given)) return json({ error: "Invalid signature" }, 401);

      const event = JSON.parse(raw);
      if (event.event === "payment.captured" || event.event === "order.paid") {
        const payment = event.payload?.payment?.entity;
        const gatewayOrderId = payment?.order_id ?? event.payload?.order?.entity?.id;
        const { data: order } = await admin.from("payment_orders").select("id, total_amount")
          .eq("gateway", "razorpay").eq("gateway_order_id", gatewayOrderId).maybeSingle();
        if (order) {
          // Never trust the amount on the wire: it must match what we priced.
          if (payment && Math.round(Number(order.total_amount) * 100) !== Number(payment.amount)) {
            await admin.from("payment_orders").update({ status: "failed", metadata: { reason: "amount_mismatch" } }).eq("id", order.id);
            return json({ error: "Amount mismatch" }, 400);
          }
          const { error } = await admin.rpc("fulfill_payment_order", { p_order: order.id, p_payment_id: payment?.id ?? null });
          if (error) return json({ error: error.message }, 500);
        }
      }
      return json({ received: true });
    }

    // ---- User-authenticated actions ----
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);
    const body = await req.json().catch(() => ({}));

    if (action === "create") {
      if (!keyId || !keySecret) return json({ error: "Payments are not configured" }, 503);
      // RLS guarantees the caller can only read their own order.
      const { data: order, error } = await userClient.from("payment_orders").select("*").eq("id", body.orderId).single();
      if (error || !order) return json({ error: "Order not found" }, 404);
      if (order.status === "entitled") return json({ alreadyPaid: true, order });
      if (Number(order.total_amount) <= 0) return json({ error: "Nothing to pay" }, 400);

      let gatewayOrderId = order.gateway_order_id as string | null;
      if (!gatewayOrderId) {
        const rp = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Basic " + btoa(`${keyId}:${keySecret}`) },
          body: JSON.stringify({
            amount: Math.round(Number(order.total_amount) * 100),
            currency: order.currency,
            receipt: order.id,
            notes: { order_id: order.id, user_id: order.user_id, item_type: order.item_type },
          }),
        });
        const created = await rp.json();
        if (!rp.ok) return json({ error: created?.error?.description ?? "Gateway error" }, 502);
        gatewayOrderId = created.id;
        await admin.from("payment_orders").update({ gateway: "razorpay", gateway_order_id: gatewayOrderId, status: "authorized" }).eq("id", order.id);
      }
      return json({ keyId, gatewayOrderId, amount: Math.round(Number(order.total_amount) * 100), currency: order.currency, orderId: order.id });
    }

    if (action === "verify") {
      if (!keySecret) return json({ error: "Payments are not configured" }, 503);
      const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
      const { data: order } = await userClient.from("payment_orders").select("id, gateway_order_id").eq("id", orderId).single();
      if (!order || order.gateway_order_id !== razorpay_order_id) return json({ error: "Order mismatch" }, 400);
      const expected = await hmacHex(keySecret, `${razorpay_order_id}|${razorpay_payment_id}`);
      if (!safeEqual(expected, String(razorpay_signature))) return json({ error: "Invalid payment signature" }, 400);
      const { data, error } = await admin.rpc("fulfill_payment_order", { p_order: order.id, p_payment_id: razorpay_payment_id });
      if (error) return json({ error: error.message }, 500);
      return json({ order: data });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
