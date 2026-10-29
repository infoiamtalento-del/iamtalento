import React from "react";
import { ReceiptText, Download } from "lucide-react";
import { ProHero } from "../ProHero";
import { useAsync } from "@/hooks/useAsync";
import { fetchOrders, type PaymentOrder } from "@/services/candidate/wallet";

const inr = (n: number) => "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const tone: Record<string, string> = {
  entitled: "bg-emerald-100 text-emerald-800", captured: "bg-emerald-100 text-emerald-800", created: "bg-amber-100 text-amber-800",
  authorized: "bg-blue-100 text-blue-800", failed: "bg-red-100 text-red-800", cancelled: "bg-slate-100 text-slate-700", refunded: "bg-purple-100 text-purple-800",
};
const label = (s: string) => (s === "entitled" ? "paid" : s);

function printReceipt(o: PaymentOrder) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=720,height=800");
  if (!w) return;
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
  w.document.write(`<html><head><title>${esc(o.invoice_number ?? "Receipt")}</title><style>body{font:14px system-ui;padding:32px;color:#0f172a}td{padding:6px 0}table{width:100%;border-collapse:collapse}.r{text-align:right}hr{border:0;border-top:1px solid #cbd5e1}</style></head><body>
    <h2>IAmTalento</h2><p>Tax invoice ${esc(o.invoice_number ?? "(pending)")} · ${new Date(o.created_at).toLocaleDateString("en-IN")}</p><hr>
    <table><tr><td>${esc(o.item_ref ?? o.item_type)}</td><td class="r">${inr(o.base_amount)}</td></tr>
    ${Number(o.discount_amount) > 0 ? `<tr><td>Discount</td><td class="r">-${inr(o.discount_amount)}</td></tr>` : ""}
    ${Number(o.cgst) > 0 ? `<tr><td>CGST</td><td class="r">${inr(o.cgst)}</td></tr><tr><td>SGST</td><td class="r">${inr(o.sgst)}</td></tr>` : ""}
    ${Number(o.igst) > 0 ? `<tr><td>IGST</td><td class="r">${inr(o.igst)}</td></tr>` : ""}
    <tr><td><b>Total</b></td><td class="r"><b>${inr(o.total_amount)}</b></td></tr></table><hr><p>Status: ${esc(label(o.status))} · Paid via ${esc(o.gateway)}</p>
    <script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
}

export const LivePayments: React.FC = () => {
  const { data: orders, loading, error } = useAsync(fetchOrders);
  return (
    <div className="space-y-6">
      <ProHero icon={<ReceiptText />} title="Payment history" subtitle="Every purchase with GST breakdown and a printable invoice." />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && !orders ? <p className="text-sm text-muted-foreground">Loading…</p> : orders?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No purchases yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground"><tr className="border-b border-border"><th className="p-3">Date</th><th>Item</th><th>Invoice</th><th>GST</th><th>Total</th><th>Status</th><th /></tr></thead>
            <tbody>
              {orders?.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="max-w-[240px] truncate">{o.item_ref ?? o.item_type}</td>
                  <td className="whitespace-nowrap text-xs">{o.invoice_number ?? "-"}</td>
                  <td className="whitespace-nowrap">{inr(Number(o.cgst) + Number(o.sgst) + Number(o.igst))}</td>
                  <td className="whitespace-nowrap font-semibold">{inr(o.total_amount)}</td>
                  <td><span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${tone[o.status] ?? tone.created}`}>{label(o.status)}</span></td>
                  <td className="pr-3 text-right">{o.status === "entitled" && o.item_type !== "wallet_topup" && <button type="button" aria-label="Print invoice" onClick={() => printReceipt(o)} className="text-primary hover:underline"><Download className="h-4 w-4" /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
