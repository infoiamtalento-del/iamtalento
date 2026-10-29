// Signs a candidate's CIR credential with Ed25519 so employers can verify it offline.
// Secrets: CREDENTIAL_SIGNING_KEY (base64 PKCS8 Ed25519 private key), CREDENTIAL_KEY_ID (optional label)
//   generate once:  openssl genpkey -algorithm ed25519 -outform DER | base64
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const b64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const bytesToB64 = (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b)));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: u } = await userClient.auth.getUser();
    if (!u?.user) return json({ error: "Unauthorized" }, 401);

    const { reportId } = await req.json();
    // RLS: the caller can only see their own credential.
    const { data: cred } = await userClient.from("verifiable_credentials")
      .select("id, payload_hash, signature").eq("cir_report_id", reportId).maybeSingle();
    if (!cred) return json({ error: "Credential not found" }, 404);
    if (cred.signature) return json({ signed: true });

    const pk = Deno.env.get("CREDENTIAL_SIGNING_KEY");
    if (!pk) return json({ error: "Signing key not configured" }, 503);
    const key = await crypto.subtle.importKey("pkcs8", b64ToBytes(pk), { name: "Ed25519" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("Ed25519", key, new TextEncoder().encode(cred.payload_hash));

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await admin.from("verifiable_credentials").update({
      signature: bytesToB64(sig),
      signing_key_id: Deno.env.get("CREDENTIAL_KEY_ID") ?? "v1",
    }).eq("id", cred.id);
    return json({ signed: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
