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
    const url = URL.createObjectURL(new Blob([`SAMPLE RECEIPT, NOT A TAX INVOICE\n${id}\n${user.cp?.name || user.name}\n${description}\nSample amount: ${formatINR(amount)}\nNo payment charged.`], { type: "text/plain" }));
    const link = document.createElement("a"); link.href = url; link.download = `sample-${id}.txt`; link.click(); URL.revokeObjectURL(url);
  };

  const corporateTracks = [
    { title: "Generative AI & LLM Systems Engineering", duration: "8 Weeks", level: "Advanced", enrolled: 18, rate: "92%", skills: ["PyTorch", "LangChain", "RAG", "Vector DBs"] },
    { title: "Modern Full-Stack React & Performance Architecture", duration: "6 Weeks", level: "Intermediate", enrolled: 15, rate: "88%", skills: ["React 19", "Next.js", "Web Vitals", "Edge APIs"] },
    { title: "Cloud Native DevOps & Kubernetes Scalability", duration: "10 Weeks", level: "Advanced", enrolled: 10, rate: "95%", skills: ["Docker", "Kubernetes", "Terraform", "AWS"] },
    { title: "Distributed System Design & Microservices", duration: "8 Weeks", level: "Advanced", enrolled: 5, rate: "100%", skills: ["Kafka", "Redis", "System Architecture", "Security"] },
  ];

  const transactions = (user.wal?.hist && user.wal.hist.length > 0) ? user.wal.hist : [
    { id: "INV-2026-001", at: Date.now() - 86400000 * 3, desc: "Annual ATS Enterprise Suite License", amt: 45000 },
    { id: "INV-2026-002", at: Date.now() - 86400000 * 12, desc: "Technical Assessment Library Access (50 Seats)", amt: 12500 },
    { id: "INV-2026-003", at: Date.now() - 86400000 * 25, desc: "Featured Job Promotion Booster Pack", amt: 4999 },
  ];

  return <div className="employer-workspace space-y-5"><header className="workspace-header"><div><span className="workspace-eyebrow"><Icon size={14} />Workspace service</span><h1 className="workspace-heading">{entry.label}</h1><p className="workspace-description">{view === "corporate-learning" ? "Enterprise workforce upskilling tracks, proctored cohort training, and skill verification." : view === "interviews" ? "Technical screening sessions and scheduled candidate interviews." : view === "subscription" ? "Your sample plan and included hiring credits." : view === "payment-history" ? "Sample transactions, billing history, and downloadable invoices." : "Role-specific assessments and candidate results."}</p></div></header>
    {view === "corporate-learning" && (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <section className="workspace-panel !p-4">
            <p className="text-xs text-muted-foreground">Active Cohorts</p>
            <p className="text-2xl font-bold mt-1">3 Cohorts</p>
            <span className="text-[11px] text-emerald-600 font-semibold">● In Progress</span>
          </section>
          <section className="workspace-panel !p-4">
            <p className="text-xs text-muted-foreground">Learners Enrolled</p>
            <p className="text-2xl font-bold mt-1">48 Members</p>
            <span className="text-[11px] text-primary font-semibold">Engineering & Product</span>
          </section>
          <section className="workspace-panel !p-4">
            <p className="text-xs text-muted-foreground">Verified Credentials</p>
            <p className="text-2xl font-bold mt-1">142 Issued</p>
            <span className="text-[11px] text-emerald-600 font-semibold">94% Pass Rate</span>
          </section>
          <section className="workspace-panel !p-4">
            <p className="text-xs text-muted-foreground">Industry Readiness</p>
            <p className="text-2xl font-bold mt-1">91.4%</p>
            <span className="text-[11px] text-emerald-600 font-semibold">+14% vs Peer Avg</span>
          </section>
        </div>

        <section className="workspace-panel">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold">Standardized Team Curriculums</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Role-aligned technical curricula designed with industry experts.</p>
            </div>
            <Button size="sm" onClick={() => onToast("Cohort request submitted. Our team will reach out with the enterprise syllabus.")}>
              <Plus />Request Custom Cohort
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {corporateTracks.map(t => (
              <div key={t.title} className="rounded-xl border border-border p-4 bg-card/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">{t.level}</span>
                    <span className="text-xs text-muted-foreground">{t.duration}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-2">{t.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.skills.map(s => <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{s}</span>)}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/80 pt-3">
                  <span className="text-xs text-muted-foreground">{t.enrolled} enrolled · {t.rate} completion</span>
                  <Button size="sm" variant="outline" onClick={() => onToast(`Enrolled team members in "${t.title}".`)}>
                    Assign to Team
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )}
    {view === "interviews" && <>
      <form className="workspace-panel grid items-end gap-4 sm:grid-cols-3" onSubmit={create}><label className="workspace-field"><span>Session title</span><Input aria-label="Session or campaign title" required placeholder="React technical screening" value={name} onChange={e => setName(e.target.value)} /></label><label className="workspace-field"><span>Candidate</span><select aria-label="Choose candidate" required value={appId} onChange={e => setAppId(e.target.value)}><option value="">Select applicant</option>{apps.map(a => <option key={a.id} value={a.id}>{a.name} · {jobs.find(j => j.id === a.jid)?.t}</option>)}</select></label><Button type="submit"><Plus />{view === "interviews" ? "Create AI interview" : "Invite to assessment"}</Button></form>
      <section className="workspace-panel space-y-4">
        {view === "interviews" && state.aiInterviews.map(record => <div key={record.id} className="flex flex-wrap items-center gap-4 border-b border-border pb-4"><div className="mr-auto"><h2 className="text-sm font-bold">{record.name}</h2><p className="mt-2 text-xs text-muted-foreground">{record.candidate} · {record.status}{record.score !== undefined ? ` · ${record.score}% · Strong communication, review technical depth` : ""}</p></div>{record.status !== "Completed" && <Button variant="outline" onClick={() => { onChange({ ...state, aiInterviews: state.aiInterviews.map(r => r.id === record.id ? { ...r, status: "Completed", score: 82 } : r) }); onToast("Simulated AI interview completed. Sample report ready."); }}><Play />Run demo interview</Button>}</div>)}
      </section>
    </>}
    {view === "interviews" && <section className="workspace-panel"><h2 className="mb-5 flex items-center gap-2 text-base font-bold"><CalendarDays className="text-primary" />Scheduled interviews</h2>{apps.filter(a => a.iv && a.st === "Interview").map(a => <div key={a.id} className="flex flex-wrap items-center gap-4 border-b border-border py-4"><div className="mr-auto"><p className="text-sm font-semibold">{a.name}</p><p className="mt-2 text-xs text-muted-foreground">{a.iv?.replace("T", " · ")} · {jobs.find(j => j.id === a.jid)?.t}</p></div><Button variant="outline" onClick={() => onOpenDrawer({ type: "applicant", id: a.id })}>Manage interview<ArrowRight /></Button></div>)}<Button className="mt-5" variant="outline" onClick={() => onNavigate("pipe")}>Schedule from pipeline<ArrowRight /></Button></section>}
    {view === "subscription" && <div className="grid gap-5 sm:grid-cols-3">{["Starter", "Growth", "Enterprise"].map((plan, i) => <section className="workspace-panel" key={plan}><h2 className="text-lg font-bold">{plan}</h2><p className="my-4 text-xs text-muted-foreground">Sample allowance · {[5, 25, 100][i]} jobs · {[50, 250, 1000][i]} screening credits</p><Button disabled={state.plan === plan} onClick={() => { onChange({ ...state, plan }); onSamplePayment(`${plan} plan activation (demo)`); }}>{state.plan === plan ? "Current demo plan" : "Activate demo plan"}</Button><p className="mt-3 text-[11px] text-muted-foreground">No payment charged.</p></section>)}</div>}
    {view === "payment-history" && <section className="workspace-panel">{transactions.map(tx => <div key={tx.id} className="flex flex-wrap items-center gap-4 border-b border-border py-5"><div className="mr-auto"><h2 className="text-sm font-bold">{tx.desc}</h2><p className="mt-2 text-xs text-muted-foreground">{tx.id} · {new Date(tx.at).toLocaleDateString("en-GB")} · Verified Invoice</p></div><span className="text-sm font-semibold">{formatINR(tx.amt)}</span><Button variant="outline" onClick={() => downloadInvoice(tx.id, tx.desc, tx.amt)}><Download />Download Invoice</Button></div>)}</section>}
  </div>;
}