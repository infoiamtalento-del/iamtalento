import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Play, Plus, Download, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { employerMenuItems } from "./employerMenu";
import type { ProView, ProDrawerState } from "./proTypes";
import type { ProApplication, ProJob, ProUser } from "@/data/proData";
import { formatINR } from "@/data/proData";
import type { EmployerDemoState } from "@/data/employerDemo";
import { ProEmployerAdvertise } from "./ProEmployerAdvertise";
import { ProEmployerSettings } from "./ProEmployerSettings";
import { ProEmployerAssessments } from "./ProEmployerAssessments";
import "./employer-workspace.css";

interface Props { view: ProView; user: ProUser; jobs: ProJob[]; applications: ProApplication[]; state: EmployerDemoState; onChange: (state: EmployerDemoState) => void; onNavigate: (view: ProView) => void; onOpenDrawer: (drawer: ProDrawerState) => void; onToast: (message: string) => void; onSamplePayment: (description: string) => void; onUpdateUser?: (user: ProUser) => void }
export function ProEmployerDemoServices({ view, user, jobs, applications, state, onChange, onNavigate, onOpenDrawer, onToast, onSamplePayment, onUpdateUser }: Props) {
  const [name, setName] = useState("");
  const [appId, setAppId] = useState("");
  const entry = employerMenuItems.find(item => item.id === view);
  if (!entry) return null;
  const Icon = entry.icon;
  if (view === "advertise") return <ProEmployerAdvertise state={state} onChange={onChange} onNavigate={onNavigate} onToast={onToast} />;
  if (view === "settings") return <ProEmployerSettings user={user} state={state} onChange={onChange} onUpdateUser={onUpdateUser} onToast={onToast} />;
  const apps = applications.filter(a => jobs.some(j => j.id === a.jid && j.by === user.email));
  if (view === "employer-assessments") return <ProEmployerAssessments state={state} applications={apps} onChange={onChange} onBack={() => onNavigate("account")} onToast={onToast} />;
  const create = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const candidate = apps.find(a => String(a.id) === appId);
    if (!candidate) return;
    const id = Date.now();
    if (view === "interviews" && candidate) onChange({ ...state, aiInterviews: [{ id, name: name.trim(), candidate: candidate.name, status: "Ready" }, ...state.aiInterviews] });
    setName(""); onToast("Demo record created. No invitation or payment was sent.");
  };
  const downloadInvoice = (id: string, description: string, amount: number) => {
    const url = URL.createObjectURL(new Blob([`SAMPLE RECEIPT — NOT A TAX INVOICE\n${id}\n${user.cp?.name || user.name}\n${description}\nSample amount: ${formatINR(amount)}\nNo payment charged.`], { type: "text/plain" }));
    const link = document.createElement("a"); link.href = url; link.download = `sample-${id}.txt`; link.click(); URL.revokeObjectURL(url);
  };
  return <div className="employer-workspace space-y-5"><header className="workspace-header"><div><span className="workspace-eyebrow"><Icon size={14} />Employer workspace</span><h1 className="workspace-heading">{entry.label}</h1><p className="workspace-description">{view === "interviews" ? "Technical screening sessions and scheduled candidate interviews." : view === "subscription" ? "Your sample plan and included hiring credits." : view === "payment-history" ? "Sample transactions and downloadable demo receipts." : "Role-specific assessments and candidate results."}</p></div></header>
    {view === "interviews" && <>
      <form className="workspace-panel grid items-end gap-4 sm:grid-cols-3" onSubmit={create}><label className="workspace-field"><span>Session title</span><Input aria-label="Session or campaign title" required placeholder="React technical screening" value={name} onChange={e => setName(e.target.value)} /></label><label className="workspace-field"><span>Candidate</span><select aria-label="Choose candidate" required value={appId} onChange={e => setAppId(e.target.value)}><option value="">Select applicant</option>{apps.map(a => <option key={a.id} value={a.id}>{a.name} · {jobs.find(j => j.id === a.jid)?.t}</option>)}</select></label><Button type="submit"><Plus />{view === "interviews" ? "Create AI interview" : "Invite to assessment"}</Button></form>
      <section className="workspace-panel space-y-4">
        {view === "interviews" && state.aiInterviews.map(record => <div key={record.id} className="flex flex-wrap items-center gap-4 border-b border-border pb-4"><div className="mr-auto"><h2 className="text-sm font-bold">{record.name}</h2><p className="mt-2 text-xs text-muted-foreground">{record.candidate} · {record.status}{record.score !== undefined ? ` · ${record.score}% · Strong communication, review technical depth` : ""}</p></div>{record.status !== "Completed" && <Button variant="outline" onClick={() => { onChange({ ...state, aiInterviews: state.aiInterviews.map(r => r.id === record.id ? { ...r, status: "Completed", score: 82 } : r) }); onToast("Simulated AI interview completed. Sample report ready."); }}><Play />Run demo interview</Button>}</div>)}
      </section>
    </>}
    {view === "interviews" && <section className="workspace-panel"><h2 className="mb-5 flex items-center gap-2 text-base font-bold"><CalendarDays className="text-primary" />Scheduled interviews</h2>{apps.filter(a => a.iv && a.st === "Interview").map(a => <div key={a.id} className="flex flex-wrap items-center gap-4 border-b border-border py-4"><div className="mr-auto"><p className="text-sm font-semibold">{a.name}</p><p className="mt-2 text-xs text-muted-foreground">{a.iv?.replace("T", " · ")} · {jobs.find(j => j.id === a.jid)?.t}</p></div><Button variant="outline" onClick={() => onOpenDrawer({ type: "applicant", id: a.id })}>Manage interview<ArrowRight /></Button></div>)}<Button className="mt-5" variant="outline" onClick={() => onNavigate("pipe")}>Schedule from pipeline<ArrowRight /></Button></section>}
    {view === "subscription" && <div className="grid gap-5 sm:grid-cols-3">{["Starter", "Growth", "Enterprise"].map((plan, i) => <section className="workspace-panel" key={plan}><h2 className="text-lg font-bold">{plan}</h2><p className="my-4 text-xs text-muted-foreground">Sample allowance · {[5, 25, 100][i]} jobs · {[50, 250, 1000][i]} screening credits</p><Button disabled={state.plan === plan} onClick={() => { onChange({ ...state, plan }); onSamplePayment(`${plan} plan activation (demo)`); }}>{state.plan === plan ? "Current demo plan" : "Activate demo plan"}</Button><p className="mt-3 text-[11px] text-muted-foreground">No payment charged.</p></section>)}</div>}
    {view === "payment-history" && <section className="workspace-panel">{(user.wal?.hist || []).map(tx => <div key={tx.id} className="flex flex-wrap items-center gap-4 border-b border-border py-5"><div className="mr-auto"><h2 className="text-sm font-bold">{tx.desc}</h2><p className="mt-2 text-xs text-muted-foreground">{tx.id} · {new Date(tx.at).toLocaleDateString("en-GB")} · Sample transaction</p></div><span className="text-sm font-semibold">{formatINR(tx.amt)}</span><Button variant="outline" onClick={() => downloadInvoice(tx.id, tx.desc, tx.amt)}><Download />Sample receipt</Button></div>)}</section>}
  </div>;
}