import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
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
  { month: "Jun", revenueK: 185, baselineK: 148 },
  { month: "Jul", revenueK: 240, baselineK: 176 },
  { month: "Aug", revenueK: 310, baselineK: 215 },
  { month: "Sep", revenueK: 428, baselineK: 290 },
  { month: "Oct", revenueK: 560, baselineK: 380 },
  { month: "Nov", revenueK: 745, baselineK: 495 },
];

export const SuperAdminOverview: React.FC<Props> = ({
  snapshot,
  onNavigate,
  onInspect,
  onApproveEmployer,
  onApproveJob,
  onClearProctorFlag,
}) => {
  const activeCandidates = snapshot.candidates.filter((c) => !c.archived);
  const verifiedCandidates = activeCandidates.filter((c) => c.kycStatus === "verified").length;

  const pendingEmployers = snapshot.employers.filter(
    (e) => !e.archived && e.verificationStatus === "pending"
  );
  const incompleteEmployers = snapshot.employers.filter(
    (e) => !e.archived && e.profileCompletion < 100
  );
  const pendingJobs = snapshot.jobs.filter((j) => j.status === "pending_review");
  const flaggedAssessments = snapshot.assessments.filter((a) => a.status === "Flagged");
  const openTickets = snapshot.tickets.filter((t) => t.status !== "resolved");

  const capturedTx = snapshot.transactions.filter((t) => t.status === "captured");
  const grossRevenue = capturedTx.reduce((s, t) => s + t.netTotalInr, 0);
  const totalMrr = snapshot.employers.reduce((s, e) => s + e.mrrInr, 0);
  const totalWalletFloat = snapshot.wallets.reduce((s, w) => s + w.balanceInr, 0);

  const funnelStages = ["Applied", "Shortlisted", "Interview", "Offer", "Hired"].map((stage) => {
    const count = snapshot.applications.filter((a) => a.stage === stage).length;
    const total = Math.max(1, snapshot.applications.length);
    return {
      stage,
      count,
      share: Math.round((count / total) * 100),
    };
  });

  const featuredAttempt = snapshot.assessments[0];

  const primaryStats = [
    {
      label: "Total candidates",
      value: activeCandidates.length.toLocaleString("en-IN"),
      delta: "+18% vs October",
      positive: true,
      meta: `${verifiedCandidates} identity verified`,
      target: "candidates" as AdminSectionId,
    },
    {
      label: "Employers & tenants",
      value: snapshot.employers.filter((e) => !e.archived).length.toLocaleString("en-IN"),
      delta: `${pendingEmployers.length} awaiting KYB`,
      positive: pendingEmployers.length === 0,
      meta: `${incompleteEmployers.length} incomplete setup`,
      target: "employers" as AdminSectionId,
    },
    {
      label: "Captured revenue (GMV)",
      value: formatINR(grossRevenue),
      delta: "+33% vs October",
      positive: true,
      meta: `MRR ${formatINR(totalMrr)}`,
      target: "billing" as AdminSectionId,
    },
    {
      label: "Escrow wallet float",
      value: formatINR(totalWalletFloat),
      delta: `${openTickets.length} open support`,
      positive: true,
      meta: `${snapshot.wallets.length} active ledgers`,
      target: "wallets" as AdminSectionId,
    },
  ];

  const cohortMetrics = [
    {
      label: "Hackathon participants",
      val: activeCandidates.filter((c) => c.hackathonParticipated).length,
      note: "Code Arena Season 4",
      target: "candidates" as AdminSectionId,
    },
    {
      label: "Networking registrants",
      val: activeCandidates.filter((c) => c.networkingRegistered).length,
      note: "City chapter mixers",
      target: "candidates" as AdminSectionId,
    },
    {
      label: "1-time vs retest takers",
      val: `${activeCandidates.filter((c) => c.totalTestAttempts === 1).length} / ${activeCandidates.filter((c) => c.totalTestAttempts >= 2).length}`,
      note: "Single attempt vs 2+ retests",
      target: "candidates" as AdminSectionId,
    },
    {
      label: "Multi-domain (2+ tests)",
      val: activeCandidates.filter((c) => c.domainsChosen.length >= 2).length,
      note: "Cross-domain assessed",
      target: "candidates" as AdminSectionId,
    },
    {
      label: "Active freelancers",
      val: activeCandidates.filter((c) => c.freelancerStatus !== "Full-Time Only").length,
      note: `${activeCandidates.filter((c) => c.availabilityStatus === "Actively looking").length} job seeking`,
      target: "candidates" as AdminSectionId,
    },
    {
      label: "Incomplete company profiles",
      val: incompleteEmployers.length,
      note: "Missing mandatory setup",
      target: "employers" as AdminSectionId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Row 1: Asymmetric Grid — 4 Pure Stat Numbers + Tactile CIR Credential Specimen (Moment #2) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {primaryStats.map((stat) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => onNavigate(stat.target)}
              className="group rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5 text-left hover:border-[#002C66]/35 transition-colors duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-normal text-[#4b5565] dark:text-[#a3a9b8]">
                  {stat.label}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-[#6b7487] group-hover:text-[#111827] dark:group-hover:text-white transition-colors duration-150"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mt-3 text-[28px] leading-none font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums">
                {stat.value}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                <span
                  className={`font-mono tabular-nums ${
                    stat.positive ? "text-[#16a34a]" : "text-[#c2410c]"
                  }`}
                >
                  {stat.delta}
                </span>
                <span className="text-[#6b7487] truncate">{stat.meta}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tactile Verifiable CIR Credential Object (Moment #2) */}
        {featuredAttempt && (
          <div
            onClick={() => onInspect({ kind: "assessment", data: featuredAttempt })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onInspect({ kind: "assessment", data: featuredAttempt });
              }
            }}
            className="xl:col-span-4 rounded-xl bg-[#002C66] text-white p-5 border border-[#001D44] shadow-[0_8px_24px_rgba(0,29,68,0.12)] flex flex-col justify-between cursor-pointer hover:bg-[#002659] transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4cc38a]" />
                  <span className="text-xs text-blue-200/90">Latest issued CIR credential</span>
                </div>
                <p className="mt-1.5 text-base font-medium text-white">
                  {featuredAttempt.candidateName}
                </p>
                <p className="text-xs text-blue-200/80">{featuredAttempt.domainTrack}</p>
              </div>
              <div className="text-right">
                <span className="text-[28px] leading-none font-medium text-white tabular-nums">
                  {featuredAttempt.overallCirScore}
                </span>
                <span className="block mt-1 font-mono text-[11px] text-blue-200/80 tabular-nums">
                  {featuredAttempt.percentile}th pct
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="block text-blue-200/70">Aptitude</span>
                <span className="mt-0.5 block font-mono text-white tabular-nums">
                  {featuredAttempt.coreAptitudeScore}/100
                </span>
              </div>
              <div>
                <span className="block text-blue-200/70">Coding</span>
                <span className="mt-0.5 block font-mono text-white tabular-nums">
                  {featuredAttempt.codingScore}/100
                </span>
              </div>
              <div>
                <span className="block text-blue-200/70">Proctor trust</span>
                <span className="mt-0.5 block font-mono text-[#4cc38a] tabular-nums">
                  {featuredAttempt.proctorTrustScore}%
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-blue-200/75">
              <span>{featuredAttempt.credentialToken}</span>
              <span>30/30 layers clean</span>
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Cohort Strip (Clean Tabular Figures, Zero Decorative Icons) */}
      <div className="rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="text-[15px] font-medium text-[#111827] dark:text-[#eef0f5]">
            Cohort participation &amp; onboarding readiness
          </h2>
          <span className="text-xs text-[#6b7487]">
            Select any figure to filter the directory
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cohortMetrics.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.target)}
              className="rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#1a1e28] p-3 text-left hover:border-[#002C66]/35 transition-colors duration-150 cursor-pointer"
            >
              <p className="text-xs text-[#4b5565] dark:text-[#a3a9b8] truncate">{item.label}</p>
              <p className="mt-1.5 text-xl font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums">
                {item.val}
              </p>
              <p className="mt-1 text-xs text-[#6b7487] truncate">{item.note}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Row 3: Primary Chart (Moment #1, 2/3 Width) + Compact Ranked ATS Stage List (1/3 Width) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-[13px] text-[#4b5565] dark:text-[#a3a9b8]">
                Gross platform volume
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-[28px] leading-none font-medium text-[#111827] dark:text-[#eef0f5] tabular-nums">
                  ₹7,45,000
                </span>
                <span className="font-mono text-xs text-[#16a34a] tabular-nums">
                  +33.0% vs October
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6b7487]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ea580c]" />
                Current run-rate
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#94a3b8]" />
                Prior quarter baseline
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_SERIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(17,24,39,0.07)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7487", fontFamily: "ui-monospace, monospace" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}k`}
                  tick={{ fontSize: 12, fill: "#6b7487", fontFamily: "ui-monospace, monospace" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid rgba(17,24,39,0.1)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="baselineK"
                  name="Prior baseline (₹k)"
                  stroke="#94a3b8"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenueK"
                  name="Captured volume (₹k)"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "#ea580c", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranked Horizontal Stage Breakdown List (Not a Second Competing Chart) */}
        <div className="xl:col-span-4 rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-medium text-[#111827] dark:text-[#eef0f5]">
                  ATS pipeline stages
                </h3>
                <p className="mt-0.5 text-xs text-[#6b7487]">
                  {snapshot.applications.length} total applications tracked
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("applications")}
                className="text-xs font-medium text-[#002C66] dark:text-blue-300 hover:underline cursor-pointer"
              >
                Open ATS
              </button>
            </div>

            <div className="space-y-4">
              {funnelStages.map((row) => (
                <div key={row.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#111827] dark:text-[#eef0f5] font-medium">
                      {row.stage}
                    </span>
                    <span className="font-mono text-[#6b7487] tabular-nums">
                      {row.count} ({row.share}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded bg-[#eceff4] dark:bg-[#1a1e28] overflow-hidden">
                    <div
                      className="h-full rounded bg-[#002C66]"
                      style={{ width: `${Math.max(6, row.share)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#111827]/[0.08] dark:border-white/[0.08] flex items-center justify-between text-xs text-[#6b7487]">
            <span>Active job listings</span>
            <span className="font-mono text-[#111827] dark:text-[#eef0f5] tabular-nums">
              {snapshot.jobs.filter((j) => j.status === "active").length} live / {pendingJobs.length} held
            </span>
          </div>
        </div>
      </div>

      {/* Row 4: Moderation Queues (3 Clean Hairline Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Employer KYB */}
        <div className="rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-medium text-[#111827] dark:text-[#eef0f5]">
                Employer KYB queue
              </h3>
              <span className="font-mono text-xs text-[#6b7487] tabular-nums">
                {pendingEmployers.length} pending
              </span>
            </div>
            <div className="space-y-2">
              {pendingEmployers.length ? (
                pendingEmployers.map((emp) => (
                  <div
                    key={emp.id}
                    className="rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#1a1e28] p-3 space-y-2"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                        {emp.companyName}
                      </p>
                      <p className="font-mono text-xs text-[#6b7487] tabular-nums">
                        {emp.employerCode} · GSTIN {emp.gstin}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 rounded-lg bg-[#002C66] hover:bg-[#001F4D] text-white text-xs font-medium gap-1.5 cursor-pointer"
                        onClick={() => onApproveEmployer(emp.id)}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Verify KYB
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs font-medium cursor-pointer"
                        onClick={() => onInspect({ kind: "employer", data: emp })}
                      >
                        Inspect
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6b7487] py-6 text-center">
                  All employer KYB filings reviewed
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("kyc")}
            className="mt-4 pt-3 border-t border-[#111827]/[0.08] dark:border-white/[0.08] text-left text-xs font-medium text-[#002C66] dark:text-blue-300 hover:underline cursor-pointer"
          >
            Open KYC &amp; KYB directory
          </button>
        </div>

        {/* Pending Job Moderation */}
        <div className="rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-medium text-[#111827] dark:text-[#eef0f5]">
                Job moderation queue
              </h3>
              <span className="font-mono text-xs text-[#6b7487] tabular-nums">
                {pendingJobs.length} held
              </span>
            </div>
            <div className="space-y-2">
              {pendingJobs.length ? (
                pendingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#1a1e28] p-3 space-y-2"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-[#6b7487] tabular-nums">
                        {job.companyName} · ₹{job.salaryMinLpa}–{job.salaryMaxLpa}L · {job.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 rounded-lg bg-[#002C66] hover:bg-[#001F4D] text-white text-xs font-medium gap-1.5 cursor-pointer"
                        onClick={() => onApproveJob(job.id)}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Approve live
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs font-medium cursor-pointer"
                        onClick={() => onInspect({ kind: "job", data: job })}
                      >
                        Inspect JD
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6b7487] py-6 text-center">
                  No jobs waiting in moderation
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("jobs")}
            className="mt-4 pt-3 border-t border-[#111827]/[0.08] dark:border-white/[0.08] text-left text-xs font-medium text-[#002C66] dark:text-blue-300 hover:underline cursor-pointer"
          >
            Manage all {snapshot.jobs.length} jobs
          </button>
        </div>

        {/* Proctoring Integrity Alerts */}
        <div className="rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-medium text-[#111827] dark:text-[#eef0f5]">
                30-layer proctoring flags
              </h3>
              <span className="font-mono text-xs text-[#dc2626] tabular-nums">
                {flaggedAssessments.length} flagged
              </span>
            </div>
            <div className="space-y-2">
              {flaggedAssessments.length ? (
                flaggedAssessments.map((att) => (
                  <div
                    key={att.id}
                    className="rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#1a1e28] p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                        {att.candidateName}
                      </p>
                      <span className="font-mono text-xs text-[#dc2626] tabular-nums">
                        Trust {att.proctorTrustScore}%
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7487] line-clamp-1">
                      {att.layersTriggered.join(" · ")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 rounded-lg bg-[#002C66] hover:bg-[#001F4D] text-white text-xs font-medium cursor-pointer"
                        onClick={() => onClearProctorFlag(att.id)}
                      >
                        Clear &amp; issue CIR
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs font-medium cursor-pointer"
                        onClick={() => onInspect({ kind: "assessment", data: att })}
                      >
                        Telemetry
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6b7487] py-6 text-center">
                  All proctored sessions clear
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("proctoring")}
            className="mt-4 pt-3 border-t border-[#111827]/[0.08] dark:border-white/[0.08] text-left text-xs font-medium text-[#002C66] dark:text-blue-300 hover:underline cursor-pointer"
          >
            Open proctoring telemetry
          </button>
        </div>
      </div>

      {/* Row 5: Schema Inventory + Audit Stream */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-medium text-[#111827] dark:text-[#eef0f5]">
              Postgres schema inventory
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("system")}
              className="text-xs font-medium text-[#002C66] dark:text-blue-300 hover:underline cursor-pointer"
            >
              System settings
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] dark:border-white/[0.08] text-[#6b7487]">
                  <th className="py-2 pr-3 font-medium">Table</th>
                  <th className="py-2 px-3 font-medium">Domain</th>
                  <th className="py-2 px-3 font-medium text-right">Live rows</th>
                  <th className="py-2 px-3 font-medium text-right">Managed</th>
                  <th className="py-2 pl-3 font-medium">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06] dark:divide-white/[0.06]">
                {snapshot.tableHealth.map((tb) => (
                  <tr key={tb.tableName} className="hover:bg-[#f5f7fa] dark:hover:bg-[#1a1e28]">
                    <td className="py-2.5 pr-3 font-mono text-[#111827] dark:text-[#eef0f5]">
                      {tb.tableName}
                    </td>
                    <td className="py-2.5 px-3 text-[#4b5565] dark:text-[#a3a9b8]">{tb.domain}</td>
                    <td className="py-2.5 px-3 font-mono text-right text-[#6b7487] tabular-nums">
                      {tb.liveRows === null ? "RLS" : tb.liveRows}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-[#111827] dark:text-[#eef0f5] tabular-nums">
                      {tb.totalManagedRows}
                    </td>
                    <td className="py-2.5 pl-3">
                      <span className="inline-flex items-center gap-1.5 text-[#4b5565] dark:text-[#a3a9b8]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                        {tb.syncStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-5 rounded-xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-medium text-[#111827] dark:text-[#eef0f5]">
              Audit log
            </h3>
            <span className="font-mono text-xs text-[#6b7487] tabular-nums">
              Synced {new Date(snapshot.syncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="space-y-2">
            {snapshot.auditLogs.slice(0, 5).map((log) => (
              <button
                key={log.id}
                type="button"
                onClick={() => onInspect({ kind: "audit", data: log })}
                className="w-full rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] p-3 text-left hover:bg-[#f5f7fa] dark:hover:bg-[#1a1e28] transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-[#111827] dark:text-[#eef0f5]">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        log.severity === "critical"
                          ? "bg-[#dc2626]"
                          : log.severity === "warning"
                            ? "bg-[#d97706]"
                            : "bg-[#16a34a]"
                      }`}
                    />
                    {log.action}
                  </span>
                  <span className="font-mono text-[11px] text-[#6b7487] tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#4b5565] dark:text-[#a3a9b8] line-clamp-2">
                  {log.details}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
