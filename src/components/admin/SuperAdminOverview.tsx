import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  IndianRupee,
  Wallet,
  ShieldAlert,
  GraduationCap,
  CheckCircle2,
  ArrowUpRight,
  Database,
  Headphones,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/data/proData";
import type { SuperAdminSnapshot } from "@/services/admin/superAdminData";
import type { InspectedEntity } from "./SuperAdminInspector";

export type AdminSectionId =
  | "overview"
  | "candidates"
  | "employers"
  | "kyc"
  | "jobs"
  | "applications"
  | "assessments"
  | "proctoring"
  | "billing"
  | "wallets"
  | "learning"
  | "support"
  | "system";

interface Props {
  snapshot: SuperAdminSnapshot;
  onNavigate: (section: AdminSectionId) => void;
  onInspect: (entity: InspectedEntity) => void;
  onApproveEmployer: (id: string) => void;
  onApproveJob: (id: string) => void;
  onClearProctorFlag: (id: string) => void;
}

const GROWTH_SERIES = [
  { month: "Jun", revenueK: 185, candidates: 620, hires: 18 },
  { month: "Jul", revenueK: 240, candidates: 890, hires: 27 },
  { month: "Aug", revenueK: 310, candidates: 1240, hires: 39 },
  { month: "Sep", revenueK: 428, candidates: 1710, hires: 54 },
  { month: "Oct", revenueK: 560, candidates: 2380, hires: 71 },
  { month: "Nov", revenueK: 745, candidates: 3190, hires: 96 },
];

export const SuperAdminOverview: React.FC<Props> = ({
  snapshot,
  onNavigate,
  onInspect,
  onApproveEmployer,
  onApproveJob,
  onClearProctorFlag,
}) => {
  const verifiedCandidates = snapshot.candidates.filter((c) => c.kycStatus === "verified").length;
  const avgCir = snapshot.candidates.length
    ? Math.round(
        snapshot.candidates.reduce((s, c) => s + c.cirScore, 0) / snapshot.candidates.length
      )
    : 0;

  const pendingEmployers = snapshot.employers.filter((e) => e.verificationStatus === "pending");
  const pendingJobs = snapshot.jobs.filter((j) => j.status === "pending_review");
  const flaggedAssessments = snapshot.assessments.filter((a) => a.status === "Flagged");
  const openTickets = snapshot.tickets.filter((t) => t.status !== "resolved");

  const capturedTx = snapshot.transactions.filter((t) => t.status === "captured");
  const grossRevenue = capturedTx.reduce((s, t) => s + t.netTotalInr, 0);
  const totalGst = capturedTx.reduce((s, t) => s + t.gstInr, 0);
  const totalMrr = snapshot.employers.reduce((s, e) => s + e.mrrInr, 0);
  const totalWalletFloat = snapshot.wallets.reduce((s, w) => s + w.balanceInr, 0);

  const funnelStages = ["Applied", "Shortlisted", "Interview", "Offer", "Hired"].map((stage) => ({
    stage,
    count: snapshot.applications.filter((a) => a.stage === stage).length,
  }));

  const kpis = [
    {
      label: "Total Candidates",
      value: snapshot.candidates.length.toLocaleString(),
      sub: `${snapshot.liveProfilesCount} Live DB · ${verifiedCandidates} KYC Verified · Avg CIR ${avgCir}`,
      icon: Users,
      accent: "text-[#002C66] bg-[#002C66]/10",
      target: "candidates" as AdminSectionId,
    },
    {
      label: "Employers & Tenants",
      value: snapshot.employers.length.toLocaleString(),
      sub: `${snapshot.liveEmployersCount} Live DB · ${pendingEmployers.length} Pending KYB`,
      icon: Building2,
      accent: "text-indigo-700 bg-indigo-500/10",
      target: "employers" as AdminSectionId,
    },
    {
      label: "Jobs & Moderation",
      value: snapshot.jobs.length.toLocaleString(),
      sub: `${snapshot.jobs.filter((j) => j.status === "active").length} Active · ${pendingJobs.length} Awaiting Approval`,
      icon: Briefcase,
      accent: "text-sky-700 bg-sky-500/10",
      target: "jobs" as AdminSectionId,
    },
    {
      label: "ATS Applications",
      value: snapshot.applications.length.toLocaleString(),
      sub: `${snapshot.applications.filter((a) => a.stage === "Interview").length} Interviews · ${snapshot.applications.filter((a) => a.stage === "Hired" || a.stage === "Offer").length} Offers/Hires`,
      icon: FileText,
      accent: "text-emerald-700 bg-emerald-500/10",
      target: "applications" as AdminSectionId,
    },
    {
      label: "Captured Revenue (GMV)",
      value: formatINR(grossRevenue),
      sub: `MRR ${formatINR(totalMrr)} · GST ${formatINR(totalGst)}`,
      icon: IndianRupee,
      accent: "text-emerald-700 bg-emerald-500/10",
      target: "billing" as AdminSectionId,
    },
    {
      label: "Platform Wallet Float",
      value: formatINR(totalWalletFloat),
      sub: `${snapshot.wallets.length} Active Escrow Ledger Accounts`,
      icon: Wallet,
      accent: "text-amber-700 bg-amber-500/10",
      target: "wallets" as AdminSectionId,
    },
    {
      label: "CIR & 30-Layer Proctor",
      value: `${snapshot.assessments.length} Sessions`,
      sub: `${snapshot.assessments.filter((a) => a.status === "Issued").length} Credentials Issued · ${flaggedAssessments.length} Flagged`,
      icon: GraduationCap,
      accent: "text-rose-700 bg-rose-500/10",
      target: "proctoring" as AdminSectionId,
    },
    {
      label: "Support & Ops SLA",
      value: `${openTickets.length} Open`,
      sub: `${snapshot.auditLogs.length} Audit Events · ${snapshot.tableHealth.length} DB Domains`,
      icon: Headphones,
      accent: "text-[#FB923C] bg-[#FB923C]/15",
      target: "support" as AdminSectionId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top 8 Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={() => onNavigate(kpi.target)}
              className="group rounded-2xl border border-border bg-card p-4 text-left shadow-2xs hover:border-[#002C66]/40 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground group-hover:text-[#002C66] transition-colors">
                  Inspect
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#002C66] dark:text-foreground">
                {kpi.value}
              </p>
              <p className="mt-1 text-[11px] font-medium text-muted-foreground truncate">
                {kpi.sub}
              </p>
            </button>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-display text-base font-bold text-[#002C66] dark:text-foreground">
                Platform Revenue (₹K) &amp; Verified Candidate Velocity
              </h3>
              <p className="text-xs text-muted-foreground">
                6-month SaaS subscriptions, wallet credits, CIR assessments &amp; candidate signups
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-[11px]">
              Synced {new Date(snapshot.syncedAt).toLocaleTimeString()}
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenueK"
                  name="Revenue (₹ Thousands)"
                  stroke="#002C66"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#002C66" }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="candidates"
                  name="Verified Candidates"
                  stroke="#FB923C"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FB923C" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
          <div className="mb-4">
            <h3 className="font-display text-base font-bold text-[#002C66] dark:text-foreground">
              Global ATS Stage Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              Live candidate progression across all employer pipelines
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelStages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" width={78} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Applications" fill="#002C66" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Actionable Moderation Queues (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Employer KYB */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                Employer KYB Queue (CIN / GSTIN)
              </h3>
              <Badge className="bg-amber-500/15 text-amber-800 border-amber-300 text-[11px]">
                {pendingEmployers.length} Pending
              </Badge>
            </div>
            <div className="space-y-2.5">
              {pendingEmployers.length ? (
                pendingEmployers.map((emp) => (
                  <div
                    key={emp.id}
                    className="rounded-xl border border-border p-3 bg-muted/20 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{emp.companyName}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {emp.employerCode} · GSTIN {emp.gstin}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer"
                        onClick={() => onApproveEmployer(emp.id)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Verify KYB
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] cursor-pointer"
                        onClick={() => onInspect({ kind: "employer", data: emp })}
                      >
                        Full Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-700 font-medium py-6 text-center">
                  ✓ All employer KYB submissions verified!
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("kyc")}
            className="mt-3 w-full text-xs text-primary cursor-pointer"
          >
            Open Full KYC &amp; KYB Center →
          </Button>
        </div>

        {/* Pending Job Moderation */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                Job Moderation Queue
              </h3>
              <Badge className="bg-sky-500/15 text-sky-800 border-sky-300 text-[11px]">
                {pendingJobs.length} Held
              </Badge>
            </div>
            <div className="space-y-2.5">
              {pendingJobs.length ? (
                pendingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-border p-3 bg-muted/20 space-y-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground truncate">{job.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {job.companyName} · ₹{job.salaryMinLpa}–{job.salaryMaxLpa}L · {job.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer"
                        onClick={() => onApproveJob(job.id)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Approve Live
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] cursor-pointer"
                        onClick={() => onInspect({ kind: "job", data: job })}
                      >
                        Inspect JD
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-700 font-medium py-6 text-center">
                  ✓ Zero jobs waiting in moderation queue!
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("jobs")}
            className="mt-3 w-full text-xs text-primary cursor-pointer"
          >
            Manage All {snapshot.jobs.length} Jobs →
          </Button>
        </div>

        {/* Proctoring Integrity Alerts */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                30-Layer Proctoring Flags
              </h3>
              <Badge className="bg-rose-500/15 text-rose-800 border-rose-300 text-[11px]">
                {flaggedAssessments.length} Flagged
              </Badge>
            </div>
            <div className="space-y-2.5">
              {flaggedAssessments.length ? (
                flaggedAssessments.map((att) => (
                  <div
                    key={att.id}
                    className="rounded-xl border border-rose-200/80 bg-rose-500/5 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground truncate">{att.candidateName}</p>
                      <span className="font-mono text-[11px] font-bold text-rose-700">
                        Trust {att.proctorTrustScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {att.layersTriggered.join(" · ")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-7 text-[11px] bg-[#002C66] hover:bg-[#001F4D] text-white cursor-pointer"
                        onClick={() => onClearProctorFlag(att.id)}
                      >
                        Clear &amp; Issue CIR
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] cursor-pointer"
                        onClick={() => onInspect({ kind: "assessment", data: att })}
                      >
                        Telemetry
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-700 font-medium py-6 text-center">
                  ✓ All proctored sessions reviewed!
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("proctoring")}
            className="mt-3 w-full text-xs text-primary cursor-pointer"
          >
            Open 30-Layer Proctoring Console →
          </Button>
        </div>
      </div>

      {/* Database Schema Health + Live Audit Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#002C66]" />
              <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                Postgres / Supabase Schema Inventory &amp; Row Sync
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] cursor-pointer"
              onClick={() => onNavigate("system")}
            >
              System &amp; DB Explorer
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3">Schema Table</th>
                  <th className="py-2 px-3">Domain</th>
                  <th className="py-2 px-3">Live DB Rows</th>
                  <th className="py-2 px-3">Total Managed</th>
                  <th className="py-2 pl-3">RLS &amp; Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {snapshot.tableHealth.map((tb) => (
                  <tr key={tb.tableName} className="hover:bg-muted/30">
                    <td className="py-2 pr-3 font-mono font-semibold text-foreground">{tb.tableName}</td>
                    <td className="py-2 px-3 text-muted-foreground">{tb.domain}</td>
                    <td className="py-2 px-3 font-mono font-semibold">
                      {tb.liveRows === null ? "RLS Guarded" : tb.liveRows}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-[#002C66] dark:text-foreground">
                      {tb.totalManagedRows}
                    </td>
                    <td className="py-2 pl-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <ShieldAlert className="h-3 w-3" />
                        {tb.syncStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#FB923C]" />
              <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                Live Platform Audit Stream
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("system")}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
          <div className="space-y-2.5">
            {snapshot.auditLogs.slice(0, 5).map((log) => (
              <button
                key={log.id}
                type="button"
                onClick={() => onInspect({ kind: "audit", data: log })}
                className="w-full rounded-xl border border-border p-3 text-left hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#002C66] dark:text-foreground">
                    {log.action}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      log.severity === "critical"
                        ? "bg-rose-500/15 text-rose-700"
                        : log.severity === "warning"
                          ? "bg-amber-500/15 text-amber-800"
                          : "bg-slate-500/10 text-slate-700"
                    }`}
                  >
                    {log.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{log.details}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/80">
                  {log.actorName} ({log.actorRole}) · {new Date(log.timestamp).toLocaleTimeString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
