import { db, rpc, currentUserId, BackendError } from "@/services/db";
import { supabase } from "@/integrations/supabase/client";

export interface WalletTx {
  id: string;
  at: number;
  type: "credit" | "debit";
  amt: number;
  desc: string;
  via: string;
  st: string;
  bal: number;
}

export interface WalletState {
  id: string;
  bal: number;
  hist: WalletTx[];
}

export interface PaymentOrder {
  id: string;
  item_type: string;
  item_ref: string | null;
  base_amount: number;
  discount_amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
  status: string;
  gateway: string;
  invoice_number: string | null;
  created_at: string;
}

export async function fetchWallet(): Promise<WalletState | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const wallet = await rpc<{ id: string; balance: number }>("get_or_create_my_wallet");
  const { data, error } = await db
    .from("wallet_ledger_entries")
    .select("id, entry_type, amount, balance_after, reason, reference_type, created_at")
    .eq("wallet_id", wallet.id)
    .order("id", { ascending: false })
    .limit(100);
  if (error) throw error;
  return {
    id: wallet.id,
    bal: Number(wallet.balance),
    hist: (data as { id: number; entry_type: "credit" | "debit"; amount: number; balance_after: number; reason: string; reference_type: string | null; created_at: string }[]).map((r) => ({
      id: `TX${r.id}`,
      at: new Date(r.created_at).getTime(),
      type: r.entry_type,
      amt: Number(r.amount),
      desc: r.reason,
      via: r.reference_type === "payment_order" ? "Razorpay" : r.reference_type === "referral" ? "Referral" : "Wallet",
      st: "Success",
      bal: Number(r.balance_after),
    })),
  };
}

export async function fetchOrders(): Promise<PaymentOrder[]> {
  const { data, error } = await db.from("payment_orders").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return data as PaymentOrder[];
}

export interface CreateOrderInput {
  itemType: "assessment_journey" | "course" | "mentor_session" | "hackathon_ticket" | "wallet_topup";
  itemId?: string;
  couponCode?: string;
  buyerState?: string;
  buyerGstin?: string;
  amount?: number;
  gateway?: "razorpay" | "wallet";
  idempotencyKey?: string;
}

export const createOrder = (i: CreateOrderInput) =>
  rpc<PaymentOrder>("create_payment_order", {
    p_item_type: i.itemType,
    p_item_id: i.itemId ?? null,
    p_coupon_code: i.couponCode ?? null,
    p_buyer_state: i.buyerState ?? null,
    p_buyer_gstin: i.buyerGstin ?? null,
    p_idempotency_key: i.idempotencyKey ?? crypto.randomUUID(),
    p_gateway: i.gateway ?? "razorpay",
    p_amount: i.amount ?? null,
  });

export const payOrderWithWallet = (orderId: string) => rpc<PaymentOrder>("pay_order_with_wallet", { p_order: orderId });
export const validateCoupon = (code: string, itemType: string, amount: number) =>
  rpc<{ valid: boolean; discount: number; message: string }[]>("validate_coupon", { p_code: code, p_item_type: itemType, p_amount: amount }).then((r) => r[0]);
export const claimReferral = (code: string) => rpc<string>("claim_referral", { p_code: code });

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void };
  }
}

const loadRazorpay = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new BackendError("Could not load the payment gateway."));
    document.body.appendChild(s);
  });

/** Opens Razorpay checkout for an order and resolves once the server has verified payment. */
export async function payWithRazorpay(order: PaymentOrder, prefill?: { name?: string; email?: string; contact?: string }): Promise<PaymentOrder> {
  if (order.status === "entitled") return order;
  const { data, error } = await supabase.functions.invoke("payments?action=create", { body: { orderId: order.id } });
  if (error || data?.error) throw new BackendError(data?.error ?? error?.message ?? "Payment could not be started.");
  if (data.alreadyPaid) return data.order as PaymentOrder;
  await loadRazorpay();

  return new Promise<PaymentOrder>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.gatewayOrderId,
      name: "IAmTalento",
      description: order.item_ref ?? "Purchase",
      prefill,
      theme: { color: "#002C66" },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const verified = await supabase.functions.invoke("payments?action=verify", { body: { orderId: order.id, ...response } });
        if (verified.error || verified.data?.error) reject(new BackendError(verified.data?.error ?? "Payment verification failed."));
        else resolve(verified.data.order as PaymentOrder);
      },
      modal: { ondismiss: () => reject(new BackendError("Payment cancelled.")) },
    });
    rzp.on("payment.failed", () => reject(new BackendError("Payment failed. You were not charged.")));
    rzp.open();
  });
}
