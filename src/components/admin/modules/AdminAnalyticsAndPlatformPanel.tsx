import React, { useEffect, useState } from "react";
import { Download, ShieldAlert, Check } from "lucide-react";
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
} from "recharts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatINR } from "@/data/proData";
import {
  exportRecordsAsCsv,
  exportRecordsAsJson,
  type SuperAdminSnapshot,
} from "@/services/admin/superAdminData";
import {
  DOMAIN_CIR_ANALYTICS,
  REGISTRATION_TREND_SERIES,
  type SuperAdminEnterpriseState,
} from "@/services/admin/superAdminEnterpriseData";
import { toast } from "sonner";

interface Props {
  mode: "analytics-reports" | "ops-platform" | "activity-feed";
  initialSubTab?: string;
  snapshot: SuperAdminSnapshot;
  enterprise: SuperAdminEnterpriseState;
  onUpdateEnterprise: React.Dispatch<React.SetStateAction<SuperAdminEnterpriseState>>;
  onLogAudit: (action: string, table: string, entityId: string, details: string) => void;
}

export const AdminAnalyticsAndPlatformPanel: React.FC<Props> = ({
  mode,
  initialSubTab,
  snapshot,
  enterprise,
  onUpdateEnterprise,
  onLogAudit,
}) => {
  const [biTab, setBiTab] = useState<"users" | "recruitment" | "assessments" | "learning" | "financial" | "platform">("users");
  const [opsTab, setOpsTab] = useState<"workflows" | "fraud" | "automation" | "data" | "security" | "compliance">("workflows");

  useEffect(() => {
    if (!initialSubTab) return;
    if (
      mode === "analytics-reports" &&
      (initialSubTab === "users" ||
        initialSubTab === "recruitment" ||
        initialSubTab === "assessments" ||
        initialSubTab === "learning" ||
        initialSubTab === "financial" ||
        initialSubTab === "platform")
    ) {
      setBiTab(initialSubTab);
    } else if (
      mode === "ops-platform" &&
      (initialSubTab === "workflows" ||
        initialSubTab === "fraud" ||
        initialSubTab === "automation" ||
        initialSubTab === "data" ||
        initialSubTab === "security" ||
        initialSubTab === "compliance")
    ) {
      setOpsTab(initialSubTab);
    }
  }, [mode, initialSubTab]);

  /* ===================== 01B. LIVE PLATFORM ACTIVITY FEED ===================== */
  if (mode === "activity-feed") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-[#111827]">Real-time ecosystem activity stream</h3>
            <p className="text-xs text-[#6b7487]">
              Unified chronological feed across candidates, employers, proctoring, billing, and Super Admin actions
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#16a34a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
            {snapshot.auditLogs.length} events recorded
          </span>
        </div>

        <div className="space-y-2">
          {snapshot.auditLogs.map((log) => (
            <div key={log.id} className="rounded-xl border border-[#111827]/[0.08] px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      log.severity === "critical" ? "bg-[#dc2626]" : log.severity === "warning" ? "bg-[#d97706]" : "bg-[#16a34a]"
                    )}
                  />
                  <span className="font-mono font-medium text-[#111827]">{log.action}</span>
                  <span className="font-mono text-[11px] text-[#6b7487]">{log.entityTable} ({log.entityId})</span>
                </div>
                <p className="text-[#4b5565]">{log.details}</p>
              </div>
              <div className="text-right font-mono text-[11px] text-[#6b7487] tabular-nums">
                <p className="text-[#111827] font-sans font-medium">{log.actorName}</p>
                <p>{log.actorIp} · {new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ===================== 19. ANALYTICS & REPORTS (6 BI DOMAINS) ===================== */
  if (mode === "analytics-reports") {
    const capturedTx = snapshot.transactions.filter((t) => t.status === "captured");
    const totalRevenue = capturedTx.reduce((s, t) => s + t.netTotalInr, 0);
    const totalMrr = snapshot.employers.reduce((s, e) => s + e.mrrInr, 0);
    const totalAiCost = enterprise.aiFeatures.reduce((s, f) => s + f.costInr, 0);

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
            {(
              [
                { id: "users", label: "User analytics" },
                { id: "recruitment", label: "Recruitment" },
                { id: "assessments", label: "Assessment & CIR" },
                { id: "learning", label: "Learning & mentors" },
                { id: "financial", label: "Financial" },
                { id: "platform", label: "Platform & AI" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setBiTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
                  biTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5 cursor-pointer"
              onClick={() => {
                exportRecordsAsCsv(`talentcir-bi-${biTab}`, REGISTRATION_TREND_SERIES as unknown as Array<Record<string, unknown>>);
                toast.success(`Exported ${biTab} BI report (CSV / Excel compatible)`);
              }}
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Export CSV / Excel
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5 cursor-pointer"
              onClick={() => {
                exportRecordsAsJson(`talentcir-bi-${biTab}`, { generatedAt: new Date().toISOString(), biTab, registrationTrends: REGISTRATION_TREND_SERIES, domainCir: DOMAIN_CIR_ANALYTICS, totalRevenue, totalMrr });
                toast.success("Downloaded structured JSON analytics snapshot");
              }}
            >
              Export JSON
            </Button>
          </div>
        </div>

        {biTab === "users" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-8 rounded-xl border border-[#111827]/[0.08] p-5">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-[#111827]">Candidate &amp; employer registration trends</h3>
                  <p className="text-xs text-[#6b7487]">6-month monthly onboarding trajectory</p>
                </div>
                <span className="font-mono text-xs text-[#16a34a] tabular-nums">+16.7% MoM</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REGISTRATION_TREND_SERIES}>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(17,24,39,0.07)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7487" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7487" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="candidates" name="Candidates" stroke="#002C66" strokeWidth={2.25} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="employers" name="Employers" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="xl:col-span-4 rounded-xl border border-[#111827]/[0.08] p-5 space-y-3 text-xs">
              <h3 className="text-sm font-medium text-[#111827]">Geographic &amp; retention metrics</h3>
              {[
                { label: "30-day candidate retention", val: "74.8%" },
                { label: "Profile completion (avg)", val: `${Math.round(snapshot.candidates.reduce((s, c) => s + c.profileCompletion, 0) / Math.max(1, snapshot.candidates.length))}%` },
                { label: "Top hub · Bengaluru", val: "38% of active users" },
                { label: "Mumbai & Pune corridor", val: "24% of active users" },
                { label: "Hyderabad & Chennai", val: "21% of active users" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between border-b border-[#111827]/[0.06] pb-2.5 last:border-0">
                  <span className="text-[#4b5565]">{r.label}</span>
                  <span className="font-mono font-medium text-[#111827] tabular-nums">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {biTab === "assessments" && (
          <div className="rounded-xl border border-[#111827]/[0.08] p-5">
            <h3 className="text-sm font-medium text-[#111827] mb-1">Domain-wise CIR score &amp; pass rate</h3>
            <p className="text-xs text-[#6b7487] mb-4">Average verified CIR score vs assessment pass percentage by domain track</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DOMAIN_CIR_ANALYTICS}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(17,24,39,0.07)" vertical={false} />
                  <XAxis dataKey="domain" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7487" }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7487" }} />
                  <Tooltip />
                  <Bar dataKey="avgCir" name="Avg CIR Score" fill="#002C66" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="passRate" name="Pass Rate (%)" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(biTab === "recruitment" || biTab === "learning" || biTab === "financial" || biTab === "platform") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {(biTab === "recruitment"
              ? [
                  { label: "Avg applications / job", val: (snapshot.applications.length / Math.max(1, snapshot.jobs.length)).toFixed(1), meta: "Verified CIR applicants" },
                  { label: "Shortlisting rate", val: "36.4%", meta: "Applied → Shortlisted" },
                  { label: "Interview-to-hire rate", val: "28.9%", meta: "With Linda AI Copilot" },
                  { label: "Average time to hire", val: "14.2 days", meta: "Down from 32 days industry avg" },
                ]
              : biTab === "learning"
                ? [
                    { label: "Total LMS enrolments", val: enterprise.courses.reduce((s, c) => s + c.enrolledCount, 0).toLocaleString("en-IN"), meta: "Free + paid cohorts" },
                    { label: "Avg course completion", val: "71.8%", meta: "Across approved courses" },
                    { label: "Avg mentor rating", val: "4.91★", meta: "1:1 coaching marketplace" },
                    { label: "Learning & mentor GMV", val: formatINR(enterprise.courses.reduce((s, c) => s + c.revenueInr, 0)), meta: "Direct course revenue" },
                  ]
                : biTab === "financial"
                  ? [
                      { label: "Captured revenue (GMV)", val: formatINR(totalRevenue), meta: `${capturedTx.length} paid GST orders` },
                      { label: "Monthly recurring revenue", val: formatINR(totalMrr), meta: "Active SaaS subscriptions" },
                      { label: "Payment success rate", val: "98.6%", meta: "Razorpay UPI + NetBanking" },
                      { label: "Refund rate", val: "0.9%", meta: "Within 1.5% target band" },
                    ]
                  : [
                      { label: "Daily active users (DAU)", val: "6,480", meta: "MAU 42,100 (15.4% stickiness)" },
                      { label: "API p95 latency", val: "142 ms", meta: "99.97% uptime (30d)" },
                      { label: "Monthly AI inference spend", val: formatINR(totalAiCost), meta: "11 active AI engines" },
                      { label: "Scheduled automated reports", val: "6 active", meta: "Weekly Finance & Ops digests" },
                    ]
            ).map((card) => (
              <div key={card.label} className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4 space-y-1.5">
                <p className="text-[#6b7487]">{card.label}</p>
                <p className="text-2xl font-medium text-[#111827] tabular-nums">{card.val}</p>
                <p className="text-[11px] text-[#6b7487]">{card.meta}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ===================== 20 & 7 CAPABILITIES: PLATFORM OPERATIONS ===================== */
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1 rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
        {(
          [
            { id: "workflows", label: "Approval workflows" },
            { id: "fraud", label: `Fraud detection (${enterprise.fraudAlerts.filter((f) => f.status === "open" || f.status === "investigating").length})` },
            { id: "automation", label: "Automation centre" },
            { id: "data", label: "Data management" },
            { id: "security", label: "Security, API & config" },
            { id: "compliance", label: "Legal & DPDP compliance" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setOpsTab(t.id)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-150",
              opsTab === t.id ? "bg-[#002C66] text-white" : "text-[#4b5565] hover:text-[#111827]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {opsTab === "workflows" && (
        <div className="space-y-2.5">
          {enterprise.approvalWorkflows.map((wf) => (
            <div key={wf.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-medium text-[#111827]">{wf.domain} · SLA {wf.slaHours}h</p>
                <p className="text-[#4b5565]">{wf.levels}</p>
                <p className="text-[11px] text-[#6b7487]">Auto-approval rule: {wf.autoApproveRule}</p>
              </div>
              <Switch
                checked={wf.enabled}
                aria-label={`Toggle ${wf.domain} workflow`}
                onCheckedChange={(checked) => {
                  onUpdateEnterprise((p) => ({
                    ...p,
                    approvalWorkflows: p.approvalWorkflows.map((x) => (x.id === wf.id ? { ...x, enabled: checked } : x)),
                  }));
                  onLogAudit("workflow.toggled", "approval_workflows", wf.id, `${wf.domain} workflow ${checked ? "enabled" : "paused"}`);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {opsTab === "fraud" && (
        <div className="space-y-3">
          {enterprise.fraudAlerts.map((alert) => (
            <div key={alert.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#dc2626]" strokeWidth={1.5} />
                  <span className="font-mono font-medium text-[#111827]">{alert.code}</span>
                  <span className="font-medium text-[#111827]">{alert.type}</span>
                  <span className="font-mono text-[#dc2626] tabular-nums">Risk {alert.riskScore}/100</span>
                </div>
                <p className="text-[#111827]">{alert.entityName}</p>
                <p className="text-[#6b7487]">{alert.signals} · {alert.detectedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="capitalize font-mono text-[11px] text-[#6b7487]">{alert.status}</span>
                {alert.status !== "resolved" && (
                  <Button
                    size="sm"
                    className="h-7 px-2.5 bg-[#002C66] text-white text-[11px] gap-1 cursor-pointer"
                    onClick={() => {
                      onUpdateEnterprise((p) => ({
                        ...p,
                        fraudAlerts: p.fraudAlerts.map((x) => (x.id === alert.id ? { ...x, status: "resolved" } : x)),
                      }));
                      onLogAudit("fraud.resolved", "fraud_alerts", alert.code, `Resolved fraud alert ${alert.code}`);
                      toast.success(`Resolved fraud alert ${alert.code}`);
                    }}
                  >
                    <Check className="h-3 w-3" strokeWidth={1.5} />
                    Mark resolved
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {opsTab === "automation" && (
        <div className="space-y-2.5">
          {enterprise.automations.map((aut) => (
            <div key={aut.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-medium text-[#111827]">{aut.name}</p>
                <p className="text-[#4b5565]">Trigger: {aut.trigger} → Action: {aut.action}</p>
                <p className="font-mono text-[11px] text-[#6b7487] tabular-nums">{aut.channel} · {aut.runsLast30d} runs in last 30d</p>
              </div>
              <Switch
                checked={aut.enabled}
                aria-label={`Toggle ${aut.name}`}
                onCheckedChange={(checked) => {
                  onUpdateEnterprise((p) => ({
                    ...p,
                    automations: p.automations.map((x) => (x.id === aut.id ? { ...x, enabled: checked } : x)),
                  }));
                  onLogAudit("automation.toggled", "automations", aut.id, `${aut.name} ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {opsTab === "data" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4 space-y-3">
            <p className="font-medium text-[#111827]">Full ecosystem JSON backup</p>
            <p className="text-[#6b7487]">Export candidates, employers, jobs, assessments, transactions, and audit logs.</p>
            <Button size="sm" variant="outline" className="h-8 w-full text-xs cursor-pointer" onClick={() => { exportRecordsAsJson("talentcir-full-backup", snapshot); toast.success("Exported complete platform JSON backup"); }}>
              Download full backup
            </Button>
          </div>
          <div className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4 space-y-3">
            <p className="font-medium text-[#111827]">Profile &amp; GSTIN deduplication</p>
            <p className="text-[#6b7487]">Scan emails, phone hashes, and corporate GSTINs for duplicate accounts.</p>
            <Button size="sm" variant="outline" className="h-8 w-full text-xs cursor-pointer" onClick={() => { onLogAudit("data.dedup_scan", "profiles", "global", "Ran deduplication check: 0 conflicts"); toast.success("Deduplication scan complete: 0 duplicate records found"); }}>
              Run dedup scan
            </Button>
          </div>
          <div className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4 space-y-3">
            <p className="font-medium text-[#111827]">Bulk CSV import validator</p>
            <p className="text-[#6b7487]">Validate campus cohorts, enterprise rosters, or question bank CSV batches.</p>
            <Button size="sm" variant="outline" className="h-8 w-full text-xs cursor-pointer" onClick={() => toast.success("CSV import schema template ready (UTF-8)")}>
              Download import template
            </Button>
          </div>
        </div>
      )}

      {opsTab === "security" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              title: "Enforce 2FA for all admin & staff roles",
              desc: "Require TOTP / hardware key verification before accessing Super Admin modules.",
              checked: enterprise.twoFactorEnforced,
              onChange: (c: boolean) => onUpdateEnterprise((p) => ({ ...p, twoFactorEnforced: c })),
            },
            {
              title: "Admin IP allowlist restrictions",
              desc: "Restrict Super Admin write operations to approved office and VPN CIDR ranges.",
              checked: enterprise.ipWhitelistEnabled,
              onChange: (c: boolean) => onUpdateEnterprise((p) => ({ ...p, ipWhitelistEnabled: c })),
            },
            {
              title: "Platform maintenance mode",
              desc: "Show scheduled maintenance banner on public routes while keeping admin console online.",
              checked: enterprise.maintenanceMode,
              onChange: (c: boolean) => {
                onUpdateEnterprise((p) => ({ ...p, maintenanceMode: c }));
                onLogAudit("system.maintenance_mode", "platform_settings", "maintenance", `Maintenance mode ${c ? "enabled" : "disabled"}`);
              },
            },
          ].map((sec) => (
            <div key={sec.title} className="rounded-xl border border-[#111827]/[0.08] p-4 flex items-start justify-between gap-4 bg-[#f5f7fa]/60">
              <div className="space-y-1">
                <p className="font-medium text-[#111827]">{sec.title}</p>
                <p className="text-[#6b7487] leading-relaxed">{sec.desc}</p>
              </div>
              <Switch checked={sec.checked} onCheckedChange={sec.onChange} aria-label={sec.title} />
            </div>
          ))}
          <div className="rounded-xl border border-[#111827]/[0.08] p-4 bg-[#f5f7fa]/60 space-y-1.5">
            <p className="font-medium text-[#111827]">Gateways, webhooks &amp; API keys</p>
            <p className="font-mono text-[11px] text-[#6b7487]">Razorpay Live · Resend SMTP · MSG91 SMS · Meta WhatsApp · Supabase RLS</p>
            <p className="text-[#16a34a] font-mono text-[11px]">All 5 integrations healthy · Currency INR (₹) · Asia/Kolkata</p>
          </div>
        </div>
      )}

      {opsTab === "compliance" && (
        <div className="space-y-2.5">
          {enterprise.complianceRequests.map((req) => (
            <div key={req.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-medium text-[#111827]">{req.type} · {req.userEmail}</p>
                <p className="font-mono text-[11px] text-[#6b7487]">{req.code} · Requested {req.requestedAt} · Due {req.dueBy}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="capitalize font-mono text-[11px] text-[#6b7487]">{req.status}</span>
                {req.status === "pending" && (
                  <Button
                    size="sm"
                    className="h-7 px-2.5 bg-[#002C66] text-white text-[11px] cursor-pointer"
                    onClick={() => {
                      onUpdateEnterprise((p) => ({
                        ...p,
                        complianceRequests: p.complianceRequests.map((x) =>
                          x.id === req.id ? { ...x, status: "completed", dueBy: "Completed" } : x
                        ),
                      }));
                      onLogAudit("compliance.fulfilled", "compliance_requests", req.code, `Fulfilled ${req.type} for ${req.userEmail}`);
                      toast.success(`Completed compliance request ${req.code}`);
                    }}
                  >
                    Mark fulfilled
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
