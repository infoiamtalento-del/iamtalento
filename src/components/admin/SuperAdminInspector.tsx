import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  CheckCircle2,
  XCircle,
  Ban,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Plus,
  Send,
  Code2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/data/proData";
import {
  exportRecordsAsJson,
  type SuperAdminCandidate,
  type SuperAdminEmployer,
  type SuperAdminJob,
  type SuperAdminApplication,
  type SuperAdminAssessmentAttempt,
  type SuperAdminTransaction,
  type SuperAdminWalletAccount,
  type SuperAdminTicket,
  type SuperAdminAuditEntry,
  type SuperAdminLearningRecord,
} from "@/services/admin/superAdminData";
import { toast } from "sonner";

export type InspectedEntity =
  | { kind: "candidate"; data: SuperAdminCandidate }
  | { kind: "employer"; data: SuperAdminEmployer }
  | { kind: "job"; data: SuperAdminJob }
  | { kind: "application"; data: SuperAdminApplication }
  | { kind: "assessment"; data: SuperAdminAssessmentAttempt }
  | { kind: "transaction"; data: SuperAdminTransaction }
  | { kind: "wallet"; data: SuperAdminWalletAccount }
  | { kind: "ticket"; data: SuperAdminTicket }
  | { kind: "audit"; data: SuperAdminAuditEntry }
  | { kind: "learning"; data: SuperAdminLearningRecord }
  | null;

interface Props {
  entity: InspectedEntity;
  onClose: () => void;
  onVerifyCandidate: (id: string, status: SuperAdminCandidate["kycStatus"]) => void;
  onSuspendCandidate: (id: string) => void;
  onReviewEmployer: (id: string, status: SuperAdminEmployer["verificationStatus"]) => void;
  onModerateJob: (id: string, status: SuperAdminJob["status"]) => void;
  onPromoteJob: (id: string, tier: SuperAdminJob["promotionTier"]) => void;
  onUpdateApplicationStage: (id: string, stage: string) => void;
  onReviewAssessment: (id: string, status: SuperAdminAssessmentAttempt["status"]) => void;
  onRefundTransaction: (id: string) => void;
  onAdjustWallet: (id: string, type: "credit" | "debit", amount: number, reason: string) => void;
  onReplyTicket: (id: string, reply: string, resolve: boolean) => void;
}

const FieldGrid: React.FC<{ items: Array<{ label: string; value: React.ReactNode; mono?: boolean }> }> = ({
  items,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
    {items.map((item, idx) => (
      <div
        key={idx}
        className="rounded-lg border border-border/80 bg-muted/25 px-3 py-2 min-w-0"
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {item.label}
        </p>
        <div
          className={`mt-0.5 text-xs font-semibold text-foreground break-words ${
            item.mono ? "font-mono" : ""
          }`}
        >
          {item.value ?? "—"}
        </div>
      </div>
    ))}
  </div>
);

const SectionTitle: React.FC<{ title: string; count?: number }> = ({ title, count }) => (
  <div className="flex items-center justify-between border-b border-border pb-1.5 pt-2">
    <h4 className="text-xs font-bold uppercase tracking-wider text-[#002C66] dark:text-foreground">
      {title}
    </h4>
    {typeof count === "number" && (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
        {count}
      </span>
    )}
  </div>
);

export const SuperAdminInspector: React.FC<Props> = ({
  entity,
  onClose,
  onVerifyCandidate,
  onSuspendCandidate,
  onReviewEmployer,
  onModerateJob,
  onPromoteJob,
  onUpdateApplicationStage,
  onReviewAssessment,
  onRefundTransaction,
  onAdjustWallet,
  onReplyTicket,
}) => {
  const [tab, setTab] = useState<"structured" | "json">("structured");
  const [walletAmt, setWalletAmt] = useState("500");
  const [walletReason, setWalletReason] = useState("Super Admin manual credit adjustment");
  const [ticketReply, setTicketReply] = useState("");

  if (!entity) return null;

  const title =
    entity.kind === "candidate"
      ? entity.data.fullName
      : entity.kind === "employer"
        ? entity.data.companyName
        : entity.kind === "job"
          ? entity.data.title
          : entity.kind === "application"
            ? `${entity.data.candidateName} → ${entity.data.jobTitle}`
            : entity.kind === "assessment"
              ? `${entity.data.candidateName} · ${entity.data.attemptCode}`
              : entity.kind === "transaction"
                ? `${entity.data.invoiceNumber} · ${entity.data.actorName}`
                : entity.kind === "wallet"
                  ? `Wallet · ${entity.data.ownerName}`
                  : entity.kind === "ticket"
                    ? `${entity.data.ticketCode} · ${entity.data.subject}`
                    : entity.kind === "learning"
                      ? entity.data.title
                      : entity.data.action;

  const subtitle =
    entity.kind === "candidate"
      ? `${entity.data.talentCirId} · ${entity.data.email}`
      : entity.kind === "employer"
        ? `${entity.data.employerCode} · ${entity.data.officialEmail}`
        : entity.kind === "job"
          ? `${entity.data.jobCode} · ${entity.data.companyName}`
          : entity.kind === "application"
            ? `${entity.data.appCode} · ${entity.data.companyName}`
            : entity.kind === "assessment"
              ? `Credential ${entity.data.credentialToken}`
              : entity.kind === "transaction"
                ? `${entity.data.orderId} · ${entity.data.gatewayRef}`
                : entity.kind === "wallet"
                  ? `${entity.data.ownerCode} · ${entity.data.ownerEmail}`
                  : entity.kind === "ticket"
                    ? `${entity.data.requesterName} (${entity.data.requesterEmail})`
                    : entity.kind === "learning"
                      ? `${entity.data.kind} · ${entity.data.code}`
                      : `${entity.data.entityTable} · ${entity.data.timestamp}`;

  const rawJson = JSON.stringify(entity.data, null, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Inspect ${title}`}
    >
      <div
        className="relative flex h-full w-full max-w-2xl flex-col bg-card text-foreground shadow-2xl border-l border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Inspector Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border bg-[#002C66] px-6 py-4 text-white shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                {entity.kind} record
              </span>
              {"origin" in entity.data && (
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    entity.data.origin === "live_db"
                      ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/30"
                      : "bg-blue-400/20 text-blue-100"
                  }`}
                >
                  {entity.data.origin === "live_db" ? "● LIVE SUPABASE DB" : "PLATFORM RECORD"}
                </span>
              )}
            </div>
            <h3 className="mt-1.5 font-display text-lg font-bold text-white leading-snug break-words">
              {title}
            </h3>
            <p className="mt-0.5 font-mono text-xs text-blue-200/90 break-all">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inspector"
            className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sub-Toolbar Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-6 py-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTab("structured")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                tab === "structured"
                  ? "bg-[#002C66] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Complete Details &amp; Actions
            </button>
            <button
              type="button"
              onClick={() => setTab("json")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                tab === "json"
                  ? "bg-[#002C66] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              Raw JSON Payload
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-[11px] cursor-pointer"
              onClick={() => {
                navigator.clipboard?.writeText(rawJson);
                toast.success("Copied full JSON record to clipboard");
              }}
            >
              <Copy className="h-3 w-3" />
              Copy JSON
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-[11px] cursor-pointer"
              onClick={() => exportRecordsAsJson(`${entity.kind}-record`, entity.data)}
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === "json" ? (
            <pre className="rounded-xl border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {rawJson}
            </pre>
          ) : (
            <>
              {/* CANDIDATE DEEP DIVE */}
              {entity.kind === "candidate" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                      onClick={() => onVerifyCandidate(entity.data.id, "verified")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark KYC Verified
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
                      onClick={() => onSuspendCandidate(entity.data.id)}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      {entity.data.availabilityStatus === "Suspended" ? "Reinstate User" : "Suspend User"}
                    </Button>
                    <Link
                      to={`/u/${entity.data.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent"
                    >
                      Public Profile (/u/{entity.data.slug})
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <SectionTitle title="Identity, Contact & Verification" />
                  <FieldGrid
                    items={[
                      { label: "Record UUID", value: entity.data.id, mono: true },
                      { label: "TalentCIR ID", value: entity.data.talentCirId, mono: true },
                      { label: "Full Name", value: entity.data.fullName },
                      { label: "Headline", value: entity.data.headline },
                      { label: "Email Address", value: entity.data.email, mono: true },
                      { label: "Phone Number", value: entity.data.phone, mono: true },
                      { label: "Location", value: `${entity.data.city}, ${entity.data.country}` },
                      { label: "Work Preference", value: entity.data.workPreference },
                      { label: "Experience", value: `${entity.data.experienceYears} yrs (${entity.data.experienceLevel})` },
                      { label: "Expected CTC / Notice", value: `₹${entity.data.expectedSalaryLpa} LPA · ${entity.data.noticePeriodDays} days` },
                      { label: "KYC Status", value: entity.data.kycStatus.toUpperCase() },
                      { label: "Security Flags", value: `Email: ${entity.data.emailVerified ? "Yes" : "No"} · Phone: ${entity.data.phoneVerified ? "Yes" : "No"} · 2FA: ${entity.data.mfaEnabled ? "Enabled" : "Off"}` },
                    ]}
                  />

                  <SectionTitle title="CIR Readiness, Activity & Wallet" />
                  <FieldGrid
                    items={[
                      { label: "CIR Readiness Score", value: `${entity.data.cirScore} / 100 (${entity.data.percentile}th percentile)` },
                      { label: "Profile Completion", value: `${entity.data.profileCompletion}%` },
                      { label: "Wallet Balance", value: formatINR(entity.data.walletBalance) },
                      { label: "Engagement", value: `${entity.data.profileViews} views · ${entity.data.applicationsCount} apps · ${entity.data.assessmentsPassed} tests` },
                      { label: "LinkedIn / GitHub", value: [entity.data.linkedinUrl, entity.data.githubUrl].filter(Boolean).join(" · ") || "—" },
                      { label: "Created / Last Active", value: `${new Date(entity.data.createdAt).toLocaleDateString()} · ${new Date(entity.data.lastActiveAt).toLocaleString()}` },
                    ]}
                  />

                  <SectionTitle title="Domain Assessment Sub-Scores" count={Object.keys(entity.data.assessmentScores).length} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(entity.data.assessmentScores).map(([domain, score]) => (
                      <div key={domain} className="rounded-lg border border-border p-2.5 text-center bg-background">
                        <p className="text-[11px] font-medium text-muted-foreground truncate">{domain}</p>
                        <p className="mt-0.5 text-base font-extrabold text-[#002C66] dark:text-foreground">{score}%</p>
                      </div>
                    ))}
                  </div>

                  <SectionTitle title="Verified Skills" count={entity.data.skills.length} />
                  <div className="flex flex-wrap gap-1.5">
                    {entity.data.skills.map((sk) => (
                      <Badge key={sk} variant="secondary" className="text-xs">
                        {sk}
                      </Badge>
                    ))}
                  </div>

                  <SectionTitle title="Work Experience" count={entity.data.experiences.length} />
                  <div className="space-y-2">
                    {entity.data.experiences.length ? (
                      entity.data.experiences.map((ex, i) => (
                        <div key={i} className="rounded-lg border border-border p-3 text-xs">
                          <div className="flex justify-between gap-2 font-bold">
                            <span>{ex.role} · {ex.company}</span>
                            <span className="text-muted-foreground font-normal">{ex.duration}</span>
                          </div>
                          {ex.summary && <p className="mt-1 text-muted-foreground leading-relaxed">{ex.summary}</p>}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No work history entries recorded yet.</p>
                    )}
                  </div>

                  <SectionTitle title="Education, Certifications & Projects" count={entity.data.educations.length + entity.data.certifications.length + entity.data.projects.length} />
                  <div className="space-y-2 text-xs">
                    {entity.data.educations.map((ed, i) => (
                      <div key={`ed-${i}`} className="rounded-lg border border-border px-3 py-2 flex justify-between">
                        <span className="font-semibold">{ed.degree} — {ed.institution}</span>
                        <span className="text-muted-foreground">{ed.year}</span>
                      </div>
                    ))}
                    {entity.data.certifications.map((ce, i) => (
                      <div key={`ce-${i}`} className="rounded-lg border border-border px-3 py-2 font-medium">
                        🏅 {ce}
                      </div>
                    ))}
                    {entity.data.projects.map((pj, i) => (
                      <div key={`pj-${i}`} className="rounded-lg border border-border p-3">
                        <p className="font-bold">{pj.title}</p>
                        {pj.stack && <p className="text-muted-foreground mt-0.5">Stack: {pj.stack}</p>}
                        {pj.metrics && <p className="text-emerald-700 font-semibold mt-0.5">{pj.metrics}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EMPLOYER DEEP DIVE */}
              {entity.kind === "employer" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                      onClick={() => onReviewEmployer(entity.data.id, "verified")}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Approve &amp; Verify KYB
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs border-amber-300 text-amber-800 hover:bg-amber-50 cursor-pointer"
                      onClick={() => onReviewEmployer(entity.data.id, "rejected")}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject KYB
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
                      onClick={() => onReviewEmployer(entity.data.id, "suspended")}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      Suspend Tenant
                    </Button>
                    <Link
                      to={`/company/${entity.data.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent"
                    >
                      Public Page
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <SectionTitle title="Corporate Entity, Tax & KYB Credentials" />
                  <FieldGrid
                    items={[
                      { label: "Employer ID", value: entity.data.employerCode, mono: true },
                      { label: "Verification Status", value: entity.data.verificationStatus.toUpperCase() },
                      { label: "Legal / Brand Name", value: entity.data.companyName },
                      { label: "Company Type & Size", value: `${entity.data.companyType} · ${entity.data.size} employees` },
                      { label: "GSTIN", value: entity.data.gstin, mono: true },
                      { label: "CIN", value: entity.data.cin, mono: true },
                      { label: "Corporate PAN", value: entity.data.pan, mono: true },
                      { label: "Established Year", value: entity.data.establishedYear },
                      { label: "Primary Contact", value: entity.data.contactName },
                      { label: "Official Email & Phone", value: `${entity.data.officialEmail} · ${entity.data.phone}` },
                      { label: "Headquarters", value: entity.data.hq },
                      { label: "Registered Address", value: entity.data.address },
                    ]}
                  />

                  <SectionTitle title="SaaS Billing, Credits & Hiring Throughput" />
                  <FieldGrid
                    items={[
                      { label: "Subscription Tier", value: entity.data.subscriptionPlan },
                      { label: "Monthly Recurring Rev (MRR)", value: formatINR(entity.data.mrrInr) },
                      { label: "Wallet Balance", value: formatINR(entity.data.walletBalance) },
                      { label: "CIR Talent Unlocks Left", value: entity.data.talentUnlocksRemaining },
                      { label: "Recruiter Seats", value: `${entity.data.teamMembersCount} active seats` },
                      { label: "Hiring Funnel", value: `${entity.data.activeJobsCount} jobs · ${entity.data.totalApplications} apps · ${entity.data.totalHires} hires` },
                    ]}
                  />

                  <SectionTitle title="Employee Benefits Listed" count={entity.data.benefits.length} />
                  <div className="flex flex-wrap gap-1.5">
                    {entity.data.benefits.map((b) => (
                      <Badge key={b} variant="outline" className="text-xs">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* JOB DEEP DIVE */}
              {entity.kind === "job" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                      onClick={() => onModerateJob(entity.data.id, "active")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve &amp; Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs cursor-pointer"
                      onClick={() =>
                        onPromoteJob(
                          entity.data.id,
                          entity.data.promotionTier === "sponsored" ? "none" : "sponsored"
                        )
                      }
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#FB923C]" />
                      {entity.data.promotionTier === "sponsored" ? "Remove Sponsorship" : "Boost as Sponsored"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
                      onClick={() => onModerateJob(entity.data.id, "rejected")}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject / Unpublish
                    </Button>
                  </div>

                  <FieldGrid
                    items={[
                      { label: "Job Code", value: entity.data.jobCode, mono: true },
                      { label: "Employer", value: `${entity.data.companyName} (${entity.data.employerCode})` },
                      { label: "Status & Tier", value: `${entity.data.status.toUpperCase()} · ${entity.data.promotionTier.toUpperCase()}` },
                      { label: "Department / Industry", value: `${entity.data.department} · ${entity.data.industry}` },
                      { label: "Location & Mode", value: `${entity.data.location} (${entity.data.workMode})` },
                      { label: "Compensation Band", value: `₹${entity.data.salaryMinLpa}L – ₹${entity.data.salaryMaxLpa}L LPA` },
                      { label: "Min Experience / Openings", value: `${entity.data.minExpYears}+ yrs · ${entity.data.openingsCount} seats` },
                      { label: "Funnel Metrics", value: `${entity.data.views} views → ${entity.data.applicationsCount} apps (${entity.data.conversionRate}%) · ${entity.data.hiredCount} hired` },
                    ]}
                  />

                  <SectionTitle title="Required Skills" count={entity.data.skills.length} />
                  <div className="flex flex-wrap gap-1.5">
                    {entity.data.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>

                  <SectionTitle title="Full Job Description" />
                  <p className="rounded-xl border border-border bg-muted/20 p-4 text-xs leading-relaxed text-foreground whitespace-pre-line">
                    {entity.data.description}
                  </p>
                </div>
              )}

              {/* APPLICATION DEEP DIVE */}
              {entity.kind === "application" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-muted/30 p-3">
                    <span className="text-xs font-semibold mr-2">Override Stage:</span>
                    {["Applied", "Shortlisted", "Interview", "Offer", "Hired", "On Hold", "Rejected"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onUpdateApplicationStage(entity.data.id, st)}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                          entity.data.stage === st
                            ? "bg-[#002C66] text-white border-[#002C66]"
                            : "bg-background text-foreground border-border hover:bg-accent"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <FieldGrid
                    items={[
                      { label: "Application ID", value: entity.data.appCode, mono: true },
                      { label: "Candidate", value: `${entity.data.candidateName} (${entity.data.candidateId})` },
                      { label: "Candidate Email", value: entity.data.candidateEmail, mono: true },
                      { label: "Target Role & Company", value: `${entity.data.jobTitle} @ ${entity.data.companyName}` },
                      { label: "Current Stage / SLA", value: `${entity.data.stage} · ${entity.data.slaStatus}` },
                      { label: "AI Skill Match & CIR", value: `${entity.data.matchScore}% Match · CIR ${entity.data.cirScore}` },
                      { label: "Assigned Recruiter", value: entity.data.assignedRecruiter },
                      { label: "Interview / Offer / BGV", value: `${entity.data.interviewScheduled || "No slot"} · ${entity.data.offerCtcLpa ? `₹${entity.data.offerCtcLpa}L` : "—"} · BGV: ${entity.data.bgvStatus}` },
                    ]}
                  />

                  {entity.data.recruiterNote && (
                    <>
                      <SectionTitle title="Recruiter Internal Note" />
                      <p className="rounded-lg border border-border bg-amber-500/5 p-3 text-xs">{entity.data.recruiterNote}</p>
                    </>
                  )}

                  <SectionTitle title="Immutable Stage History Log" count={entity.data.history.length} />
                  <div className="space-y-2">
                    {entity.data.history.map((h, i) => (
                      <div key={i} className="rounded-lg border border-border px-3 py-2 text-xs flex justify-between gap-3">
                        <span>{h.note}</span>
                        <span className="text-muted-foreground shrink-0">{new Date(h.at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ASSESSMENT & PROCTORING DEEP DIVE */}
              {entity.kind === "assessment" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                      onClick={() => onReviewAssessment(entity.data.id, "Issued")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Clear Flags &amp; Issue CIR Credential
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
                      onClick={() => onReviewAssessment(entity.data.id, "Failed")}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      Revoke / Invalidate Attempt
                    </Button>
                  </div>

                  <FieldGrid
                    items={[
                      { label: "Attempt Code", value: entity.data.attemptCode, mono: true },
                      { label: "Verifiable Credential", value: entity.data.credentialToken, mono: true },
                      { label: "Candidate", value: `${entity.data.candidateName} (${entity.data.candidateEmail})` },
                      { label: "Assessment & Track", value: `${entity.data.assessmentTitle} · ${entity.data.domainTrack}` },
                      { label: "Overall CIR Score", value: `${entity.data.overallCirScore}/100 (${entity.data.percentile}th pct)` },
                      { label: "Section Breakdown", value: `Aptitude ${entity.data.coreAptitudeScore} · Comm ${entity.data.coreCommunicationScore} · Tech ${entity.data.domainTechnicalScore} · Coding ${entity.data.codingScore} · Linda AI ${entity.data.aiInterviewScore}` },
                      { label: "30-Layer Trust Score", value: `${entity.data.proctorTrustScore}/100 (${entity.data.proctorFlagsCount} flags)` },
                      { label: "Environment Telemetry", value: `${entity.data.browserDevice} · ${entity.data.ipRegion} · ${entity.data.durationMinutes}m` },
                    ]}
                  />

                  <SectionTitle title="30-Layer AI Proctoring Telemetry" />
                  <div className="rounded-xl border border-border bg-muted/25 p-3.5 space-y-2 text-xs">
                    <p className="font-medium leading-relaxed">{entity.data.proctorSummary}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {entity.data.layersTriggered.map((l) => (
                        <Badge
                          key={l}
                          variant={entity.data.proctorFlagsCount > 0 ? "destructive" : "secondary"}
                          className="text-[11px]"
                        >
                          {l}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TRANSACTION DEEP DIVE */}
              {entity.kind === "transaction" && (
                <div className="space-y-5">
                  {entity.data.status === "captured" && (
                    <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Issue full gateway refund &amp; credit note
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
                        onClick={() => onRefundTransaction(entity.data.id)}
                      >
                        Issue Refund ({formatINR(entity.data.netTotalInr)})
                      </Button>
                    </div>
                  )}
                  <FieldGrid
                    items={[
                      { label: "Invoice / Credit Note", value: entity.data.invoiceNumber, mono: true },
                      { label: "Razorpay Order ID", value: entity.data.orderId, mono: true },
                      { label: "Gateway Payment Ref", value: entity.data.gatewayRef, mono: true },
                      { label: "Status", value: entity.data.status.toUpperCase() },
                      { label: "Customer", value: `${entity.data.actorName} (${entity.data.actorType})` },
                      { label: "Billing Email", value: entity.data.actorEmail, mono: true },
                      { label: "Category & Item", value: `${entity.data.category} — ${entity.data.itemTitle}` },
                      { label: "Taxable Base + 18% GST", value: `${formatINR(entity.data.amountInr)} + ${formatINR(entity.data.gstInr)} = ${formatINR(entity.data.netTotalInr)}` },
                      { label: "Payment Method", value: entity.data.paymentMethod },
                      { label: "Coupon Applied", value: entity.data.couponCode || "None" },
                    ]}
                  />
                </div>
              )}

              {/* WALLET & LEDGER DEEP DIVE */}
              {entity.kind === "wallet" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2.5">
                    <p className="text-xs font-bold text-[#002C66] dark:text-foreground">
                      Manual Ledger Credit / Debit Adjustment
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={walletAmt}
                        onChange={(e) => setWalletAmt(e.target.value)}
                        placeholder="Amount INR"
                        className="h-8 text-xs"
                      />
                      <Input
                        value={walletReason}
                        onChange={(e) => setWalletReason(e.target.value)}
                        placeholder="Audit reason"
                        className="h-8 text-xs sm:col-span-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                        onClick={() =>
                          onAdjustWallet(entity.data.id, "credit", Number(walletAmt) || 0, walletReason)
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Credit Wallet
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-xs border-rose-300 text-rose-700 cursor-pointer"
                        onClick={() =>
                          onAdjustWallet(entity.data.id, "debit", Number(walletAmt) || 0, walletReason)
                        }
                      >
                        Debit Wallet
                      </Button>
                    </div>
                  </div>

                  <FieldGrid
                    items={[
                      { label: "Account Owner", value: `${entity.data.ownerName} (${entity.data.ownerType})` },
                      { label: "Owner ID", value: entity.data.ownerCode, mono: true },
                      { label: "Current Balance", value: formatINR(entity.data.balanceInr) },
                      { label: "Lifetime In / Out", value: `+${formatINR(entity.data.lifetimeCreditedInr)} / -${formatINR(entity.data.lifetimeDebitedInr)}` },
                    ]}
                  />

                  <SectionTitle title="Immutable Wallet Ledger Entries" count={entity.data.ledger.length} />
                  <div className="space-y-2">
                    {entity.data.ledger.map((tx) => (
                      <div key={tx.txId} className="rounded-lg border border-border p-3 text-xs flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold font-mono">{tx.txId} · {tx.reason}</p>
                          <p className="text-muted-foreground mt-0.5">{tx.via} · {new Date(tx.at).toLocaleString()}</p>
                        </div>
                        <span className={`font-extrabold ${tx.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}>
                          {tx.type === "credit" ? "+" : "-"}{formatINR(tx.amountInr)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUPPORT TICKET DEEP DIVE */}
              {entity.kind === "ticket" && (
                <div className="space-y-5">
                  <FieldGrid
                    items={[
                      { label: "Ticket ID", value: entity.data.ticketCode, mono: true },
                      { label: "Priority & Status", value: `${entity.data.priority.toUpperCase()} · ${entity.data.status.toUpperCase()}` },
                      { label: "Requester", value: `${entity.data.requesterName} (${entity.data.requesterType})` },
                      { label: "Category & SLA", value: `${entity.data.category} · Due: ${entity.data.slaDueIn}` },
                    ]}
                  />

                  <SectionTitle title="Conversation Thread" count={entity.data.messages.length} />
                  <div className="space-y-2.5">
                    {entity.data.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl border p-3 text-xs ${
                          m.role === "admin"
                            ? "border-primary/30 bg-primary/5 ml-6"
                            : "border-border bg-muted/25 mr-6"
                        }`}
                      >
                        <div className="flex justify-between font-bold mb-1">
                          <span>{m.sender}</span>
                          <span className="text-muted-foreground font-normal">
                            {new Date(m.at).toLocaleString()}
                          </span>
                        </div>
                        <p className="leading-relaxed">{m.body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                    <Input
                      value={ticketReply}
                      onChange={(e) => setTicketReply(e.target.value)}
                      placeholder="Write official Super Admin response..."
                      className="h-9 text-xs bg-background"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 gap-1.5 text-xs cursor-pointer"
                        onClick={() => {
                          if (!ticketReply.trim()) return;
                          onReplyTicket(entity.data.id, ticketReply.trim(), false);
                          setTicketReply("");
                        }}
                      >
                        <Send className="h-3.5 w-3.5" />
                        Send Reply
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                        onClick={() => {
                          onReplyTicket(
                            entity.data.id,
                            ticketReply.trim() || "Issue verified and resolved by Super Admin.",
                            true
                          );
                          setTicketReply("");
                        }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Reply &amp; Mark Resolved
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* LEARNING / AUDIT GENERIC DEEP DIVE */}
              {(entity.kind === "learning" || entity.kind === "audit") && (
                <FieldGrid
                  items={Object.entries(entity.data).map(([k, v]) => ({
                    label: k,
                    value: typeof v === "object" ? JSON.stringify(v) : String(v),
                    mono: k.toLowerCase().includes("id") || k.toLowerCase().includes("ip") || k.toLowerCase().includes("code"),
                  }))}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
