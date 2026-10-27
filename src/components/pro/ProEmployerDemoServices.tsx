import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Plus,
  Download,
  CalendarDays,
  FileText,
  Printer,
  Eye,
  ShieldCheck,
  Building2,
  CreditCard,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { employerMenuItems, employeeMenuItems } from "./employerMenu";
import type { ProView, ProDrawerState } from "./proTypes";
import type { ProApplication, ProJob, ProUser } from "@/data/proData";
import { formatINR } from "@/data/proData";
import type { EmployerDemoState } from "@/data/employerDemo";
import { ProEmployerAdvertise } from "./ProEmployerAdvertise";
import { ProEmployerSettings } from "./ProEmployerSettings";
import { ProEmployerAssessments } from "./ProEmployerAssessments";
import {
  buildDetailedInvoicesForUser,
  downloadDetailedInvoicePdf,
  type DetailedInvoiceItem,
} from "@/utils/invoicePdf";
import "./employer-workspace.css";

interface Props {
  view: ProView;
  user: ProUser;
  jobs: ProJob[];
  applications: ProApplication[];
  state: EmployerDemoState;
  onChange: (state: EmployerDemoState) => void;
  onNavigate: (view: ProView) => void;
  onOpenDrawer: (drawer: ProDrawerState) => void;
  onToast: (message: string) => void;
  onSamplePayment: (description: string) => void;
  onUpdateUser?: (user: ProUser) => void;
}

export function ProEmployerDemoServices({
  view,
  user,
  jobs,
  applications,
  state,
  onChange,
  onNavigate,
  onOpenDrawer,
  onToast,
  onSamplePayment,
  onUpdateUser,
}: Props) {
  const [name, setName] = useState("");
  const [appId, setAppId] = useState("");
  const entry =
    employerMenuItems.find((item) => item.id === view) ||
    employeeMenuItems.find((item) => item.id === view);

  const detailedInvoices = buildDetailedInvoicesForUser(user);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    () => detailedInvoices[0]?.id || ""
  );

  if (!entry) return null;
  const Icon = entry.icon;

  if (view === "advertise")
    return (
      <ProEmployerAdvertise
        state={state}
        onChange={onChange}
        onNavigate={onNavigate}
        onToast={onToast}
      />
    );
  if (view === "settings")
    return (
      <ProEmployerSettings
        user={user}
        state={state}
        onChange={onChange}
        onUpdateUser={onUpdateUser}
        onToast={onToast}
      />
    );

  const apps = applications.filter((a) =>
    jobs.some((j) => j.id === a.jid && j.by === user.email)
  );
  if (view === "employer-assessments")
    return (
      <ProEmployerAssessments
        state={state}
        applications={apps}
        onChange={onChange}
        onBack={() => onNavigate("account")}
        onToast={onToast}
      />
    );

  const create = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const candidate = apps.find((a) => String(a.id) === appId);
    if (!candidate) return;
    const id = Date.now();
    if (view === "interviews" && candidate)
      onChange({
        ...state,
        aiInterviews: [
          { id, name: name.trim(), candidate: candidate.name, status: "Ready" },
          ...state.aiInterviews,
        ],
      });
    setName("");
    onToast("Demo record created. No invitation or payment was sent.");
  };

  const corporateTracks = [
    {
      title: "Generative AI & LLM Systems Engineering",
      duration: "8 Weeks",
      level: "Advanced",
      enrolled: 18,
      rate: "92%",
      skills: ["PyTorch", "LangChain", "RAG", "Vector DBs"],
    },
    {
      title: "Modern Full-Stack React & Performance Architecture",
      duration: "6 Weeks",
      level: "Intermediate",
      enrolled: 15,
      rate: "88%",
      skills: ["React 19", "Next.js", "Web Vitals", "Edge APIs"],
    },
    {
      title: "Cloud Native DevOps & Kubernetes Scalability",
      duration: "10 Weeks",
      level: "Advanced",
      enrolled: 10,
      rate: "95%",
      skills: ["Docker", "Kubernetes", "Terraform", "AWS"],
    },
    {
      title: "Distributed System Design & Microservices",
      duration: "8 Weeks",
      level: "Advanced",
      enrolled: 5,
      rate: "100%",
      skills: ["Kafka", "Redis", "System Architecture", "Security"],
    },
  ];

  const activeInvoice: DetailedInvoiceItem =
    detailedInvoices.find((inv) => inv.id === selectedInvoiceId) ||
    detailedInvoices[0];

  const totalBase = detailedInvoices.reduce((s, i) => s + i.baseAmount, 0);
  const totalTax = detailedInvoices.reduce(
    (s, i) => s + i.cgstAmount + i.sgstAmount,
    0
  );
  const totalBilled = detailedInvoices.reduce((s, i) => s + i.totalAmount, 0);
  const isEmployer = user.role === "employer";

  return (
    <div className="employer-workspace space-y-5">
      <header className="workspace-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="workspace-eyebrow">
            <Icon size={14} />
            {isEmployer ? "Employer Billing & Services" : "Employee Billing & Services"}
          </span>
          <h1 className="workspace-heading">{entry.label}</h1>
          <p className="workspace-description">
            {view === "corporate-learning"
              ? "Enterprise workforce upskilling tracks, proctored cohort training, and skill verification."
              : view === "interviews"
              ? "Technical screening sessions and scheduled candidate interviews."
              : view === "subscription"
              ? "Your sample plan and included hiring credits."
              : view === "payment-history"
              ? isEmployer
                ? "Detailed GST tax invoices, corporate billing breakdown, and downloadable PDF sample invoices."
                : "Detailed candidate membership invoices, assessment fee receipts, and downloadable PDF sample invoices."
              : "Role-specific assessments and candidate results."}
          </p>
        </div>
        {view === "payment-history" && activeInvoice && (
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print Invoice
            </Button>
            <Button
              size="sm"
              onClick={() => {
                downloadDetailedInvoicePdf(activeInvoice);
                onToast(`Downloaded ${activeInvoice.invoiceNo}.pdf`);
              }}
              className="gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] text-white text-xs font-bold cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Download Sample PDF ({activeInvoice.invoiceNo}.pdf)
            </Button>
          </div>
        )}
      </header>

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
                <p className="text-xs text-muted-foreground mt-0.5">
                  Role-aligned technical curricula designed with industry experts.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  onToast("Cohort request submitted. Our team will reach out with the enterprise syllabus.")
                }
              >
                <Plus />
                Request Custom Cohort
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {corporateTracks.map((t) => (
                <div
                  key={t.title}
                  className="rounded-xl border border-border p-4 bg-card/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">
                        {t.level}
                      </span>
                      <span className="text-xs text-muted-foreground">{t.duration}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-2">{t.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/80 pt-3">
                    <span className="text-xs text-muted-foreground">
                      {t.enrolled} enrolled · {t.rate} completion
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToast(`Enrolled team members in "${t.title}".`)}
                    >
                      Assign to Team
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {view === "interviews" && (
        <>
          <form
            className="workspace-panel grid items-end gap-4 sm:grid-cols-3"
            onSubmit={create}
          >
            <label className="workspace-field">
              <span>Session title</span>
              <Input
                aria-label="Session or campaign title"
                required
                placeholder="React technical screening"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="workspace-field">
              <span>Candidate</span>
              <select
                aria-label="Choose candidate"
                required
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
              >
                <option value="">Select applicant</option>
                {apps.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {jobs.find((j) => j.id === a.jid)?.t}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit">
              <Plus />
              Create AI interview
            </Button>
          </form>
          <section className="workspace-panel space-y-4">
            {state.aiInterviews.map((record) => (
              <div
                key={record.id}
                className="flex flex-wrap items-center gap-4 border-b border-border pb-4"
              >
                <div className="mr-auto">
                  <h2 className="text-sm font-bold">{record.name}</h2>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {record.candidate} · {record.status}
                    {record.score !== undefined
                      ? ` · ${record.score}% · Strong communication, review technical depth`
                      : ""}
                  </p>
                </div>
                {record.status !== "Completed" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onChange({
                        ...state,
                        aiInterviews: state.aiInterviews.map((r) =>
                          r.id === record.id
                            ? { ...r, status: "Completed", score: 82 }
                            : r
                        ),
                      });
                      onToast("Simulated AI interview completed. Sample report ready.");
                    }}
                  >
                    <Play />
                    Run demo interview
                  </Button>
                )}
              </div>
            ))}
          </section>
          <section className="workspace-panel">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold">
              <CalendarDays className="text-primary" />
              Scheduled interviews
            </h2>
            {apps
              .filter((a) => a.iv && a.st === "Interview")
              .map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-4 border-b border-border py-4"
                >
                  <div className="mr-auto">
                    <p className="text-sm font-semibold">{a.name}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {a.iv?.replace("T", " · ")} · {jobs.find((j) => j.id === a.jid)?.t}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => onOpenDrawer({ type: "applicant", id: a.id })}
                  >
                    Manage interview
                    <ArrowRight />
                  </Button>
                </div>
              ))}
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => onNavigate("pipe")}
            >
              Schedule from pipeline
              <ArrowRight />
            </Button>
          </section>
        </>
      )}

      {view === "subscription" && (
        <div className="grid gap-5 sm:grid-cols-3">
          {["Starter", "Growth", "Enterprise"].map((plan, i) => (
            <section className="workspace-panel" key={plan}>
              <h2 className="text-lg font-bold">{plan}</h2>
              <p className="my-4 text-xs text-muted-foreground">
                Sample allowance · {[5, 25, 100][i]} jobs · {[50, 250, 1000][i]} screening credits
              </p>
              <Button
                disabled={state.plan === plan}
                onClick={() => {
                  onChange({ ...state, plan });
                  onSamplePayment(`${plan} plan activation (demo)`);
                }}
              >
                {state.plan === plan ? "Current demo plan" : "Activate demo plan"}
              </Button>
              <p className="mt-3 text-[11px] text-muted-foreground">No payment charged.</p>
            </section>
          ))}
        </div>
      )}

      {view === "payment-history" && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <section className="workspace-panel !p-4">
              <span className="text-xs text-muted-foreground">
                {isEmployer ? "Total Billed (Incl. GST)" : "Total Paid (Incl. GST)"}
              </span>
              <p className="text-2xl font-bold text-primary mt-1">{formatINR(totalBilled)}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                {detailedInvoices.length} Verified Tax Invoices
              </span>
            </section>
            <section className="workspace-panel !p-4">
              <span className="text-xs text-muted-foreground">Taxable Base Value</span>
              <p className="text-2xl font-bold text-foreground mt-1">{formatINR(totalBase)}</p>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                SAC 998314 / 998519 Services
              </span>
            </section>
            <section className="workspace-panel !p-4">
              <span className="text-xs text-muted-foreground">
                {isEmployer ? "GST Input Tax Credit (18%)" : "GST Breakup (9% CGST + 9% SGST)"}
              </span>
              <p className="text-2xl font-bold text-foreground mt-1">{formatINR(totalTax)}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                GSTIN: 29AABCI9482K1Z5
              </span>
            </section>
            <section className="workspace-panel !p-4">
              <span className="text-xs text-muted-foreground">Invoice Format</span>
              <p className="text-2xl font-bold text-foreground mt-1">PDF (A4 GST)</p>
              <span className="text-[11px] text-primary font-semibold mt-0.5 block">
                Instant .pdf Download & Print
              </span>
            </section>
          </div>

          {/* Detailed Invoices Table */}
          <section className="workspace-panel space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Receipt className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {isEmployer
                      ? "Employer Corporate Tax Invoices & Billing Ledger"
                      : "Employee / Candidate Tax Invoices & Payment Receipts"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Click &quot;Preview PDF&quot; to inspect the full sample invoice below, or click &quot;Download PDF&quot; to save the{" "}
                    <code>.pdf</code> file.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-xs">
                GST Compliant Sample Format
              </Badge>
            </div>

            <div className="divide-y divide-border">
              {detailedInvoices.map((inv) => {
                const isSelected = inv.id === activeInvoice?.id;
                return (
                  <div
                    key={inv.id}
                    className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-3 rounded-xl transition-colors ${
                      isSelected ? "bg-primary/5 border border-primary/25" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#002C66] text-white">
                          {inv.invoiceNo}
                        </span>
                        <h3 className="text-sm font-bold text-foreground">{inv.title}</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{inv.subtitle}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span>
                          Issued: <strong className="text-foreground">{inv.date}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          SAC: <strong className="text-foreground">{inv.sacCode}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Base: <strong className="text-foreground">{formatINR(inv.baseAmount)}</strong> + GST (18%):{" "}
                          <strong className="text-foreground">
                            {formatINR(inv.cgstAmount + inv.sgstAmount)}
                          </strong>
                        </span>
                        <span>·</span>
                        <span>
                          Via: <strong className="text-foreground">{inv.paymentMethod}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <div className="text-left lg:text-right mr-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                          Total (Incl. GST)
                        </span>
                        <span className="text-base font-extrabold text-foreground">
                          {formatINR(inv.totalAmount)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => setSelectedInvoiceId(inv.id)}
                        className="gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          downloadDetailedInvoicePdf(inv);
                          onToast(`Downloaded detailed PDF invoice: ${inv.invoiceNo}.pdf`);
                        }}
                        className="gap-1.5 rounded-xl border-primary/40 text-primary hover:bg-primary/10 text-xs font-bold cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" /> Download PDF (.pdf)
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= DETAILED SAMPLE PDF INVOICE LIVE PREVIEW ================= */}
          {activeInvoice && (
            <section className="workspace-panel space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Detailed PDF Invoice Sample Format Preview — {activeInvoice.invoiceNo}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Exact A4 GST Tax Invoice layout generated when you download{" "}
                      <code>IAmTalento-Invoice-{activeInvoice.invoiceNo}.pdf</code>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print / Save PDF
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      downloadDetailedInvoicePdf(activeInvoice);
                      onToast(`Downloaded ${activeInvoice.invoiceNo}.pdf`);
                    }}
                    className="gap-1.5 rounded-xl bg-[#FB923C] hover:bg-[#F97316] text-white text-xs font-bold cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download .PDF File
                  </Button>
                </div>
              </div>

              {/* A4 Invoice Paper Sheet */}
              <div className="mx-auto max-w-4xl rounded-2xl border-2 border-border bg-white text-slate-900 shadow-lg overflow-hidden">
                {/* Top Navy Banner */}
                <div className="bg-[#002C66] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-lg sm:text-xl font-extrabold tracking-tight">
                      IAMTALENTO TECHNOLOGIES PRIVATE LIMITED
                    </div>
                    <div className="text-xs text-white/85 font-medium">
                      {isEmployer
                        ? "Enterprise Recruiter Studio & Autonomous Talent Intelligence Platform"
                        : "Talento Pro Verified Candidate & Career Acceleration Hub"}
                    </div>
                    <div className="text-[11px] text-white/75 pt-1 font-mono">
                      GSTIN: 29AABCI9482K1Z5 &nbsp;|&nbsp; CIN: U72900KA2024PTC182940 &nbsp;|&nbsp; PAN: AABCI9482K
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl bg-[#FB923C] px-4 py-2.5 text-center text-white shadow-sm">
                    <div className="text-sm font-extrabold tracking-wider uppercase">TAX INVOICE</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-white/95">
                      Original for Recipient
                    </div>
                  </div>
                </div>

                {/* Invoice Meta Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border-b border-slate-200 px-6 py-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Invoice Number
                    </span>
                    <span className="font-mono font-bold text-[#002C66] text-sm mt-0.5 block">
                      {activeInvoice.invoiceNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Invoice Date
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{activeInvoice.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Due Date
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{activeInvoice.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Payment Status
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> PAID (VERIFIED)
                    </span>
                  </div>
                </div>

                {/* Supplier & Buyer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 border-b border-slate-200 text-xs">
                  <div className="rounded-xl border border-slate-200 p-4 space-y-1.5 bg-slate-50/50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#002C66] border-b border-slate-200 pb-1.5 mb-2">
                      Supplier / Issued By
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      IAmTalento Technologies Pvt. Ltd.
                    </div>
                    <div className="text-slate-600">Level 8, Prestige Trade Tower, Palace Road</div>
                    <div className="text-slate-600">Bengaluru, Karnataka - 560001, India</div>
                    <div className="font-semibold text-slate-800 pt-1">
                      GSTIN: 29AABCI9482K1Z5 · State Code: 29 (KA)
                    </div>
                    <div className="text-slate-500">Billing Desk: billing@iamtalento.com</div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 space-y-1.5 bg-slate-50/50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#002C66] border-b border-slate-200 pb-1.5 mb-2">
                      {isEmployer
                        ? "Billed To (Employer Corporate Account)"
                        : "Billed To (Employee / Candidate Account)"}
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      {activeInvoice.billedTo.organization || activeInvoice.billedTo.name}
                    </div>
                    <div className="text-slate-600">
                      Attn: {activeInvoice.billedTo.name} ({activeInvoice.billedTo.customerCode})
                    </div>
                    <div className="text-slate-600">{activeInvoice.billedTo.address}</div>
                    <div className="font-semibold text-slate-800 pt-1">
                      {activeInvoice.billedTo.gstinOrPan}
                    </div>
                    <div className="text-slate-500">Email: {activeInvoice.billedTo.email}</div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#002C66] text-white">
                          <th className="py-3 px-4 font-bold">#</th>
                          <th className="py-3 px-4 font-bold">Service Description & Plan Details</th>
                          <th className="py-3 px-4 font-bold">SAC Code</th>
                          <th className="py-3 px-4 font-bold">Qty / Cycle</th>
                          <th className="py-3 px-4 font-bold text-right">Unit Price</th>
                          <th className="py-3 px-4 font-bold text-right">Taxable Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {activeInvoice.lineItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-3.5 px-4 font-bold text-slate-700">{idx + 1}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{item.description}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Billing Cycle: {activeInvoice.billingCycle}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-700">{item.sac}</td>
                            <td className="py-3.5 px-4 text-slate-700">{item.qty}</td>
                            <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                              {formatINR(item.unitPrice)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                              {formatINR(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Payment Metadata + Tax Calculation Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#002C66] border-b border-slate-200 pb-1.5">
                        Payment & Settlement Metadata
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-slate-500 block">Payment Method</span>
                          <strong className="text-slate-900">{activeInvoice.paymentMethod}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Gateway Reference ID</span>
                          <strong className="font-mono text-slate-900">{activeInvoice.transactionRef}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Place of Supply</span>
                          <strong className="text-slate-900">Karnataka (29), India</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Reverse Charge</span>
                          <strong className="text-slate-900">No (Standard GST)</strong>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                      <div className="p-4 space-y-2.5 bg-white">
                        <div className="flex justify-between text-slate-600">
                          <span>Taxable Base Amount</span>
                          <strong className="text-slate-900">{formatINR(activeInvoice.baseAmount)}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>CGST ({activeInvoice.cgstRate}%)</span>
                          <strong className="text-slate-900">{formatINR(activeInvoice.cgstAmount)}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>SGST ({activeInvoice.sgstRate}%)</span>
                          <strong className="text-slate-900">{formatINR(activeInvoice.sgstAmount)}</strong>
                        </div>
                      </div>
                      <div className="bg-[#002C66] text-white px-4 py-3.5 flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wider text-xs">Total Invoice Amount</span>
                        <span className="text-base font-extrabold text-[#FB923C]">
                          {formatINR(activeInvoice.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Declaration & Signatory */}
                  <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[11px] text-slate-500">
                    <div className="space-y-1 max-w-xl">
                      <div className="font-bold text-[#002C66]">DECLARATION & TERMS:</div>
                      <p>
                        1. This is a computer-generated GST tax invoice sample issued by IAmTalento Technologies Pvt. Ltd.
                      </p>
                      <p>
                        2. All amounts are in INR inclusive of 9% CGST and 9% SGST under SAC {activeInvoice.sacCode}.
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="font-bold text-[#002C66]">For IAmTalento Technologies Pvt. Ltd.</div>
                      <div className="mt-4 font-semibold text-slate-700">Authorized Digital Signatory</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}