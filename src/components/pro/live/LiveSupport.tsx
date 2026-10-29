import React, { useState } from "react";
import { LifeBuoy, Plus, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProHero } from "../ProHero";
import { useAsync } from "@/hooks/useAsync";
import { createTicket, fetchTickets, replyTicket } from "@/services/candidate/platform";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

const CATEGORIES = ["General", "Billing", "Assessments", "Jobs", "Profile", "Technical"];
const badge: Record<string, string> = { open: "bg-amber-100 text-amber-800", pending: "bg-blue-100 text-blue-800", resolved: "bg-emerald-100 text-emerald-800", closed: "bg-slate-100 text-slate-700" };

export const LiveSupport: React.FC<{ onToast: (m: string) => void }> = ({ onToast }) => {
  const { data: tickets, loading, reload } = useAsync(fetchTickets);
  const [open, setOpen] = useState<string | null>(null);
  const [form, setForm] = useState({ category: "General", subject: "", body: "" });
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try { await fn(); onToast(ok); await reload(); return true; }
    catch (e) { onToast(backendErrorMessage(e)); return false; }
    finally { setBusy(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.subject.trim().length < 3 || !form.body.trim()) return onToast("Add a subject and describe the problem.");
    if (await run(() => createTicket(form.category.toLowerCase(), form.subject, form.body), "Ticket created. We usually reply within one working day.")) setForm({ ...form, subject: "", body: "" });
  };

  return (
    <div className="space-y-6">
      <ProHero icon={<LifeBuoy />} title="Help & Support" subtitle="Raise a ticket and follow the conversation with our team." />
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <p className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> New ticket</p>
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input value={form.subject} maxLength={200} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="h-10 rounded-lg border border-border bg-background px-3 text-sm" />
        </div>
        <textarea value={form.body} maxLength={5000} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4} placeholder="Describe what happened" className="w-full rounded-lg border border-border bg-background p-3 text-sm" />
        <Button type="submit" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit ticket"}</Button>
      </form>

      <div className="space-y-3">
        {loading && !tickets ? <p className="text-sm text-muted-foreground">Loading tickets…</p> : null}
        {tickets?.length === 0 && <p className="text-sm text-muted-foreground">No tickets yet.</p>}
        {tickets?.map((t) => {
          const msgs = (t.support_messages ?? []).slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
          return (
            <div key={t.id} className="rounded-2xl border border-border bg-card">
              <button type="button" onClick={() => setOpen(open === t.id ? null : t.id)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span><span className="block text-sm font-semibold">{t.subject}</span><span className="text-xs text-muted-foreground">{t.category} · {new Date(t.created_at).toLocaleDateString("en-IN")}</span></span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${badge[t.status] ?? badge.open}`}>{t.status}</span>
              </button>
              {open === t.id && (
                <div className="border-t border-border p-4 space-y-3">
                  {msgs.map((m) => (
                    <div key={m.id} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.is_staff ? "bg-primary/10" : "ml-auto bg-secondary"}`}>
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{m.is_staff ? "Support" : "You"} · {new Date(m.created_at).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                  {t.status !== "closed" && (
                    <div className="flex gap-2">
                      <input value={reply} maxLength={5000} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply" className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm" />
                      <Button size="sm" disabled={busy || !reply.trim()} onClick={async () => { if (await run(() => replyTicket(t.id, reply), "Reply sent.")) setReply(""); }}><Send className="h-3.5 w-3.5" /></Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
