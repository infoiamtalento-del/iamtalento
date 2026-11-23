import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  Briefcase,
  FileText,
  GraduationCap,
  ShieldAlert,
  IndianRupee,
  Wallet,
  BookOpen,
  Headphones,
  Database,
  Search,
  RefreshCw,
  Download,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Eye,
  Sparkles,
  Menu,
  X,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { siteLogo } from "@/assets/logo";
import { formatINR } from "@/data/proData";
import { toast } from "sonner";
import {
  fetchSuperAdminSnapshot,
  exportRecordsAsCsv,
  exportRecordsAsJson,
  type SuperAdminSnapshot,
  type SuperAdminCandidate,
  type SuperAdminEmployer,
  type SuperAdminJob,
  type SuperAdminAssessmentAttempt,
} from "@/services/admin/superAdminData";
import {
  adminReviewEmployer,
  adminModerateJob,
} from "@/services/admin/adminService";
import {
  SuperAdminOverview,
  type AdminSectionId,
} from "@/components/admin/SuperAdminOverview";
import {
  SuperAdminInspector,
  type InspectedEntity,
} from "@/components/admin/SuperAdminInspector";

interface NavGroup {
  id: string;
  label: string;
  items: Array<{
    id: AdminSectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeKey?: "candidates" | "employers" | "kyc" | "jobs" | "applications" | "assessments" | "proctoring" | "billing" | "wallets" | "learning" | "support" | "system";
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "users",
    label: "Users & Identity",
    items: [
      { id: "candidates", label: "Candidates Directory", icon: Users, badgeKey: "candidates" },
      { id: "employers", label: "Employers & Tenants", icon: Building2, badgeKey: "employers" },
      { id: "kyc", label: "KYC & KYB Verification", icon: ShieldCheck, badgeKey: "kyc" },
    ],
  },
  {
    id: "recruitment",
    label: "Recruitment & ATS",
    items: [
      { id: "jobs", label: "All Jobs & Moderation", icon: Briefcase, badgeKey: "jobs" },
      { id: "applications", label: "Global ATS Pipeline", icon: FileText, badgeKey: "applications" },
    ],
  },
  {
    id: "assessments",
    label: "CIR & AI Proctoring",
    items: [
      { id: "assessments", label: "Assessments & CIR", icon: GraduationCap, badgeKey: "assessments" },
      { id: "proctoring", label: "30-Layer Proctoring", icon: ShieldAlert, badgeKey: "proctoring" },
    ],
  },
  {
    id: "finance",
    label: "Revenue & Wallets",
    items: [
      { id: "billing", label: "Orders, GST & SaaS", icon: IndianRupee, badgeKey: "billing" },
      { id: "wallets", label: "Wallets & Ledger", icon: Wallet, badgeKey: "wallets" },
    ],
  },
  {
    id: "ops",
    label: "Learning, Support & DB",
    items: [
      { id: "learning", label: "LMS, Mentors & Events", icon: BookOpen, badgeKey: "learning" },
      { id: "support", label: "Support Desk & SLA", icon: Headphones, badgeKey: "support" },
      { id: "system", label: "Audit Logs & DB Schema", icon: Database, badgeKey: "system" },
    ],
  },
];

const SECTION_META: Record<AdminSectionId, { title: string; subtitle: string }> = {
  overview: {
    title: "Super Admin Command Center",
    subtitle: "Complete real-time visibility across live Supabase tables, users, ATS pipelines, CIR proctoring & revenue.",
  },
  candidates: {
    title: "Candidates Directory (360° Profiles)",
    subtitle: "Every registered & verified candidate with CIR scores, KYC status, skills, work history, wallet & public portfolio.",
  },
  employers: {
    title: "Employers & Tenant Organizations",
    subtitle: "Corporate accounts, CIN/GSTIN/PAN verification, SaaS MRR, recruiter seats, wallet credits & hiring metrics.",
  },
  kyc: {
    title: "Identity (KYC) & Corporate (KYB) Verification Queue",
    subtitle: "Review candidate government ID checks and employer CIN / GSTIN / PAN corporate filings.",
  },
  jobs: {
    title: "All Job Postings & Moderation Queue",
    subtitle: "Approve pending postings, manage sponsored slots, audit compensation bands, and track job conversion funnels.",
  },
  applications: {
    title: "Global Applications & ATS Lifecycle",
    subtitle: "Cross-company candidate applications, AI skill-match scores, interview slots, recruiter notes & BGV status.",
  },
  assessments: {
    title: "Skill Assessments & Verifiable CIR Credentials",
    subtitle: "Core Aptitude, Communication, Domain, Coding & Linda AI Interview scorecards and issued credentials.",
  },
  proctoring: {
    title: "30-Layer AI Proctoring & Integrity Telemetry",
    subtitle: "Inspect trust scores, multi-monitor detections, tab-focus logs, environment fingerprints & manual overrides.",
  },
  billing: {
    title: "Revenue, Razorpay Orders, Subscriptions & GST",
    subtitle: "Captured payments, 18% GST invoices, SaaS MRR plans, coupon redemptions & one-click gateway refunds.",
  },
  wallets: {
    title: "Wallet Escrow Accounts & Immutable Ledger",
    subtitle: "Employer & candidate credit balances, lifetime inflows/outflows, and manual ledger adjustments.",
  },
  learning: {
    title: "LMS Courses, Mentors, Hackathons & Networking",
    subtitle: "Code Arena hackathons, AI learning tracks, 1:1 mentor bookings, and city networking RSVPs.",
  },
  support: {
    title: "Support Tickets & SLA Escalation Desk",
    subtitle: "Respond to urgent employer KYB, billing GST, and candidate proctoring tickets with SLA tracking.",
  },
  system: {
    title: "Immutable Audit Logs, Feature Flags & Database Explorer",
    subtitle: "Security event stream, platform feature switches, and live Postgres schema row inventory.",
  },
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const norm = value.toLowerCase();
  const cls =
    norm === "verified" || norm === "active" || norm === "issued" || norm === "captured" || norm === "hired" || norm === "resolved"
      ? "bg-emerald-500/12 text-emerald-700 border-emerald-300"
      : norm === "pending" || norm === "pending_review" || norm === "in_progress" || norm === "open" || norm === "shortlisted" || norm === "interview" || norm === "offer"
        ? "bg-amber-500/15 text-amber-800 border-amber-300"
        : norm === "flagged" || norm === "rejected" || norm === "suspended" || norm === "failed" || norm === "urgent"
          ? "bg-rose-500/12 text-rose-700 border-rose-300"
          : "bg-slate-500/10 text-slate-700 border-slate-300";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", cls)}>
      {value.replace(/_/g, " ")}
    </span>
  );
};

const OriginBadge: React.FC<{ origin: "live_db" | "platform" }> = ({ origin }) =>
  origin === "live_db" ? (
    <span className="inline-flex items-center rounded-md bg-emerald-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
      LIVE DB
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
      PLATFORM
    </span>
  );

const SuperAdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSection = (searchParams.get("tab") as AdminSectionId) || "overview";

  const [activeSection, setActiveSection] = useState<AdminSectionId>(
    SECTION_META[initialSection] ? initialSection : "overview"
  );
  const [snapshot, setSnapshot] = useState<SuperAdminSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    users: true,
    recruitment: true,
    assessments: true,
    finance: true,
    ops: true,
  });

  // Table Filters & Global Omni-Search
  const [tableQuery, setTableQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState<"all" | "live_db" | "platform">("all");
  const [omniQuery, setOmniQuery] = useState("");
  const [inspected, setInspected] = useState<InspectedEntity>(null);

  const loadSnapshot = useCallback(async (isRefresh = false) => {
    if (isRefresh) setSyncing(true);
    else setLoading(true);
    try {
      const data = await fetchSuperAdminSnapshot();
      setSnapshot(data);
      if (isRefresh) {
        toast.success(
          `Synced live database (${data.liveProfilesCount} live profiles, ${data.liveEmployersCount} live employers, ${data.liveJobsCount} live jobs)`
        );
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load Super Admin data");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshot(false);
  }, [loadSnapshot]);

  const selectSection = (sec: AdminSectionId) => {
    setActiveSection(sec);
    setSearchParams(sec === "overview" ? {} : { tab: sec });
    setTableQuery("");
    setStatusFilter("all");
    setOriginFilter("all");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const appendAudit = useCallback(
    (action: string, entityTable: string, entityId: string, details: string, severity: "info" | "warning" | "critical" = "info") => {
      setSnapshot((prev) =>
        prev
          ? {
              ...prev,
              auditLogs: [
                {
                  id: `aud-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  actorName: "Super Admin",
                  actorRole: "Super Admin",
                  actorIp: "Console Session",
                  action,
                  entityTable,
                  entityId,
                  severity,
                  details,
                  metadata: {},
                },
                ...prev.auditLogs,
              ],
            }
          : prev
      );
    },
    []
  );

  // Admin Mutation Handlers
  const handleVerifyCandidate = (id: string, status: SuperAdminCandidate["kycStatus"]) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.candidates.map((c) => (c.id === id ? { ...c, kycStatus: status } : c));
      const target = updated.find((c) => c.id === id);
      if (target && inspected?.kind === "candidate" && inspected.data.id === id) {
        setInspected({ kind: "candidate", data: target });
      }
      return { ...prev, candidates: updated };
    });
    appendAudit("candidate.kyc_updated", "identity_verifications", id, `Candidate KYC set to ${status}`);
    toast.success(`Candidate KYC marked as ${status}`);
  };

  const handleSuspendCandidate = (id: string) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.candidates.map((c) =>
        c.id === id
          ? {
              ...c,
              availabilityStatus:
                c.availabilityStatus === "Suspended"
                  ? ("Actively looking" as const)
                  : ("Suspended" as const),
            }
          : c
      );
      const target = updated.find((c) => c.id === id);
      if (target && inspected?.kind === "candidate" && inspected.data.id === id) {
        setInspected({ kind: "candidate", data: target });
      }
      return { ...prev, candidates: updated };
    });
    appendAudit("candidate.status_toggled", "profiles", id, "Toggled candidate account suspension", "warning");
    toast.success("Candidate account status updated");
  };

  const handleReviewEmployer = async (
    id: string,
    status: SuperAdminEmployer["verificationStatus"]
  ) => {
    const targetEmp = snapshot?.employers.find((e) => e.id === id);
    if (targetEmp?.origin === "live_db") {
      await adminReviewEmployer(id, status, "Reviewed from Super Admin Console").catch(() => {});
    }
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.employers.map((e) =>
        e.id === id
          ? { ...e, verificationStatus: status, gstinVerified: status === "verified" }
          : e
      );
      const target = updated.find((e) => e.id === id);
      if (target && inspected?.kind === "employer" && inspected.data.id === id) {
        setInspected({ kind: "employer", data: target });
      }
      return { ...prev, employers: updated };
    });
    appendAudit("employer.kyb_reviewed", "employers", id, `Employer verification set to ${status}`);
    toast.success(`Employer ${targetEmp?.companyName || id} marked as ${status}`);
  };

  const handleModerateJob = async (id: string, status: SuperAdminJob["status"]) => {
    const targetJob = snapshot?.jobs.find((j) => j.id === id);
    if (targetJob?.origin === "live_db") {
      await adminModerateJob(id, status === "active", "Moderated in Super Admin Console").catch(() => {});
    }
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.jobs.map((j) => (j.id === id ? { ...j, status } : j));
      const target = updated.find((j) => j.id === id);
      if (target && inspected?.kind === "job" && inspected.data.id === id) {
        setInspected({ kind: "job", data: target });
      }
      return { ...prev, jobs: updated };
    });
    appendAudit("job.moderated", "employer_job_openings", id, `Job status set to ${status}`);
    toast.success(`Job status updated to ${status}`);
  };

  const handlePromoteJob = (id: string, tier: SuperAdminJob["promotionTier"]) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.jobs.map((j) => (j.id === id ? { ...j, promotionTier: tier } : j));
      const target = updated.find((j) => j.id === id);
      if (target && inspected?.kind === "job" && inspected.data.id === id) {
        setInspected({ kind: "job", data: target });
      }
      return { ...prev, jobs: updated };
    });
    appendAudit("job.promotion_updated", "employer_job_openings", id, `Promotion tier set to ${tier}`);
    toast.success(`Job promotion tier updated to ${tier}`);
  };

  const handleUpdateApplicationStage = (id: string, stage: string) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              stage,
              slaStatus: "Within SLA" as const,
              history: [
                { stage, note: `Stage overridden to ${stage} by Super Admin`, at: new Date().toISOString() },
                ...a.history,
              ],
            }
          : a
      );
      const target = updated.find((a) => a.id === id);
      if (target && inspected?.kind === "application" && inspected.data.id === id) {
        setInspected({ kind: "application", data: target });
      }
      return { ...prev, applications: updated };
    });
    appendAudit("application.stage_override", "job_applications", id, `Overrode stage to ${stage}`);
    toast.success(`Application moved to ${stage}`);
  };

  const handleReviewAssessment = (id: string, status: SuperAdminAssessmentAttempt["status"]) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.assessments.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              proctorFlagsCount: status === "Issued" ? 0 : a.proctorFlagsCount,
              proctorTrustScore: status === "Issued" ? Math.max(92, a.proctorTrustScore) : a.proctorTrustScore,
            }
          : a
      );
      const target = updated.find((a) => a.id === id);
      if (target && inspected?.kind === "assessment" && inspected.data.id === id) {
        setInspected({ kind: "assessment", data: target });
      }
      return { ...prev, assessments: updated };
    });
    appendAudit("assessment.proctor_override", "assessment_attempts", id, `Assessment credential status set to ${status}`);
    toast.success(`Assessment status updated to ${status}`);
  };

  const handleRefundTransaction = (id: string) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.transactions.map((t) =>
        t.id === id ? { ...t, status: "refunded" as const, direction: "refund" as const } : t
      );
      const target = updated.find((t) => t.id === id);
      if (target && inspected?.kind === "transaction" && inspected.data.id === id) {
        setInspected({ kind: "transaction", data: target });
      }
      return { ...prev, transactions: updated };
    });
    appendAudit("payment.refunded", "payment_orders", id, "Full refund issued by Super Admin", "warning");
    toast.success("Transaction refunded & credit note logged");
  };

  const handleAdjustWallet = (
    id: string,
    type: "credit" | "debit",
    amount: number,
    reason: string
  ) => {
    if (amount <= 0) {
      toast.error("Enter a valid positive INR amount");
      return;
    }
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.wallets.map((w) => {
        if (w.id !== id) return w;
        const nextBal = type === "credit" ? w.balanceInr + amount : Math.max(0, w.balanceInr - amount);
        return {
          ...w,
          balanceInr: nextBal,
          lifetimeCreditedInr: type === "credit" ? w.lifetimeCreditedInr + amount : w.lifetimeCreditedInr,
          lifetimeDebitedInr: type === "debit" ? w.lifetimeDebitedInr + amount : w.lifetimeDebitedInr,
          updatedAt: new Date().toISOString(),
          ledger: [
            {
              txId: `TXN-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
              type,
              amountInr: amount,
              reason: reason || "Super Admin adjustment",
              via: "Super Admin Console",
              at: new Date().toISOString(),
            },
            ...w.ledger,
          ],
        };
      });
      const target = updated.find((w) => w.id === id);
      if (target && inspected?.kind === "wallet" && inspected.data.id === id) {
        setInspected({ kind: "wallet", data: target });
      }
      return { ...prev, wallets: updated };
    });
    appendAudit(`wallet.${type}`, "wallet_ledger_entries", id, `${type.toUpperCase()} ₹${amount}: ${reason}`);
    toast.success(`Wallet ${type}ed by ${formatINR(amount)}`);
  };

  const handleReplyTicket = (id: string, reply: string, resolve: boolean) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status: resolve ? ("resolved" as const) : ("in_progress" as const),
              slaDueIn: resolve ? "Resolved" : t.slaDueIn,
              messages: [
                ...t.messages,
                {
                  sender: "Super Admin",
                  role: "admin" as const,
                  body: reply,
                  at: new Date().toISOString(),
                },
              ],
            }
          : t
      );
      const target = updated.find((t) => t.id === id);
      if (target && inspected?.kind === "ticket" && inspected.data.id === id) {
        setInspected({ kind: "ticket", data: target });
      }
      return { ...prev, tickets: updated };
    });
    appendAudit("support.ticket_updated", "support_tickets", id, resolve ? "Ticket resolved" : "Admin reply posted");
    toast.success(resolve ? "Ticket resolved" : "Reply sent");
  };

  const handleToggleFlag = (key: string, checked: boolean) => {
    setSnapshot((prev) =>
      prev
        ? {
            ...prev,
            featureFlags: prev.featureFlags.map((f) =>
              f.key === key ? { ...f, enabled: checked } : f
            ),
          }
        : prev
    );
    appendAudit("platform.flag_toggled", "platform_settings", key, `Set ${key} = ${checked}`);
    toast.success(`Updated platform setting: ${key}`);
  };

  // Global Omni-Search Matches
  const omniMatches = useMemo(() => {
    const q = omniQuery.trim().toLowerCase();
    if (!q || !snapshot) return [];
    const results: Array<{ badge: string; title: string; sub: string; entity: InspectedEntity }> = [];

    snapshot.candidates
      .filter((c) =>
        [c.fullName, c.email, c.talentCirId, c.city, ...c.skills].some((v) =>
          v?.toLowerCase().includes(q)
        )
      )
      .slice(0, 4)
      .forEach((c) =>
        results.push({
          badge: "Candidate",
          title: c.fullName,
          sub: `${c.talentCirId} · ${c.email} · CIR ${c.cirScore}`,
          entity: { kind: "candidate", data: c },
        })
      );

    snapshot.employers
      .filter((e) =>
        [e.companyName, e.employerCode, e.officialEmail, e.gstin, e.hq].some((v) =>
          v?.toLowerCase().includes(q)
        )
      )
      .slice(0, 4)
      .forEach((e) =>
        results.push({
          badge: "Employer",
          title: e.companyName,
          sub: `${e.employerCode} · ${e.verificationStatus} · ${e.officialEmail}`,
          entity: { kind: "employer", data: e },
        })
      );

    snapshot.jobs
      .filter((j) =>
        [j.title, j.companyName, j.jobCode, j.location, ...j.skills].some((v) =>
          v?.toLowerCase().includes(q)
        )
      )
      .slice(0, 4)
      .forEach((j) =>
        results.push({
          badge: "Job",
          title: j.title,
          sub: `${j.jobCode} · ${j.companyName} · ${j.status}`,
          entity: { kind: "job", data: j },
        })
      );

    snapshot.transactions
      .filter((t) =>
        [t.invoiceNumber, t.orderId, t.actorName, t.itemTitle].some((v) =>
          v?.toLowerCase().includes(q)
        )
      )
      .slice(0, 3)
      .forEach((t) =>
        results.push({
          badge: "Invoice",
          title: `${t.invoiceNumber} · ${formatINR(t.netTotalInr)}`,
          sub: `${t.actorName} · ${t.category}`,
          entity: { kind: "transaction", data: t },
        })
      );

    return results;
  }, [omniQuery, snapshot]);

  const badgeCounts = useMemo(() => {
    if (!snapshot) return {} as Record<string, number>;
    return {
      candidates: snapshot.candidates.length,
      employers: snapshot.employers.length,
      kyc:
        snapshot.employers.filter((e) => e.verificationStatus === "pending").length +
        snapshot.candidates.filter((c) => c.kycStatus !== "verified").length,
      jobs: snapshot.jobs.length,
      applications: snapshot.applications.length,
      assessments: snapshot.assessments.length,
      proctoring: snapshot.assessments.filter((a) => a.status === "Flagged").length,
      billing: snapshot.transactions.length,
      wallets: snapshot.wallets.length,
      learning: snapshot.learningEvents.length,
      support: snapshot.tickets.filter((t) => t.status !== "resolved").length,
      system: snapshot.tableHealth.length,
    };
  }, [snapshot]);

  const handleExportCurrentSection = () => {
    if (!snapshot) return;
    const map: Record<AdminSectionId, unknown[]> = {
      overview: snapshot.tableHealth as unknown[],
      candidates: snapshot.candidates as unknown[],
      employers: snapshot.employers as unknown[],
      kyc: snapshot.employers.filter((e) => e.verificationStatus === "pending") as unknown[],
      jobs: snapshot.jobs as unknown[],
      applications: snapshot.applications as unknown[],
      assessments: snapshot.assessments as unknown[],
      proctoring: snapshot.assessments as unknown[],
      billing: snapshot.transactions as unknown[],
      wallets: snapshot.wallets as unknown[],
      learning: snapshot.learningEvents as unknown[],
      support: snapshot.tickets as unknown[],
      system: snapshot.auditLogs as unknown[],
    };
    exportRecordsAsCsv(`talentcir-admin-${activeSection}`, map[activeSection] as Array<Record<string, unknown>>);
    toast.success(`Exported ${activeSection} CSV report`);
  };

  const renderSidebarContent = () => (
    <>
      {/* Top 86px Brand Bar matching Employer layout */}
      <div className="shrink-0">
        <div className="h-[86px] min-h-[86px] px-5 bg-[#002C66] border-b border-white/10 flex items-center justify-between gap-2">
          <Link to="/" className="inline-flex items-center focus:outline-none" aria-label="TalentCIR Home">
            <img
              src={siteLogo.url}
              alt="TalentCIR"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
        </div>

        <div className="px-4 py-2.5 bg-[#002250] border-b border-white/10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#FB923C] tracking-wider uppercase">
            ● Super Admin
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
            {snapshot?.liveDbConnected ? "Live DB Connected" : "Syncing..."}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
        <button
          type="button"
          onClick={() => selectSection("overview")}
          className={cn(
            "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all text-left cursor-pointer",
            activeSection === "overview"
              ? "bg-white/16 text-white border border-white/20"
              : "text-blue-100/85 hover:text-white hover:bg-white/8"
          )}
        >
          {activeSection === "overview" && (
            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#FB923C]" />
          )}
          <LayoutDashboard className={cn("h-4 w-4 shrink-0", activeSection === "overview" ? "text-[#FB923C]" : "text-blue-200")} />
          <span>Executive Overview</span>
        </button>

        <div className="my-2 border-t border-white/10" />

        {NAV_GROUPS.map((group) => {
          const isOpen = Boolean(openGroups[group.id]);
          return (
            <div key={group.id} className="pt-0.5">
              <button
                type="button"
                onClick={() => setOpenGroups((p) => ({ ...p, [group.id]: !p[group.id] }))}
                className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-blue-200/70 hover:text-white cursor-pointer"
              >
                <span>{group.label}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
              </button>

              {isOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    const count = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
                    const isAlert = item.id === "kyc" || item.id === "proctoring" || item.id === "support";
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectSection(item.id)}
                        className={cn(
                          "relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer",
                          isActive
                            ? "bg-white/15 text-white font-semibold border border-white/15"
                            : "text-blue-100/85 hover:text-white hover:bg-white/8"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#FB923C]" />
                        )}
                        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#FB923C]" : "text-blue-200/80")} />
                        <span className="flex-1 truncate text-white">{item.label}</span>
                        {typeof count === "number" && (
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                              isAlert && count > 0
                                ? "bg-[#FB923C] text-white"
                                : "bg-white/12 text-blue-100"
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Quick Portals */}
      <div className="p-3 border-t border-white/10 space-y-1.5 shrink-0">
        <div className="grid grid-cols-2 gap-1.5">
          <Link
            to="/talento-pro?view=dash&role=employer"
            className="flex items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-white/18 px-2 py-2 text-[11px] font-semibold text-white transition-colors"
          >
            Employer View
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            to="/talento-pro?view=dash"
            className="flex items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-white/18 px-2 py-2 text-[11px] font-semibold text-white transition-colors"
          >
            Candidate View
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </>
  );

  const q = tableQuery.trim().toLowerCase();

  return (
    <div className="min-h-screen bg-[#EAEEF4]/70 dark:bg-background text-foreground flex flex-col">
      <Helmet>
        <title>Super Admin Command Console | TalentCIR</title>
      </Helmet>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 lg:fixed lg:inset-y-0 lg:left-0 z-40 border-r border-[#001D44] bg-[#002C66] text-white flex-col shadow-md">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-72 max-w-[85vw] bg-[#002C66] text-white flex flex-col h-full shadow-2xl">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderSidebarContent()}
          </div>
          <div className="flex-1 bg-black/45" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Top Sticky 86px Header Bar */}
      <header className="sticky top-0 z-30 w-full lg:ml-64 xl:ml-72 lg:w-[calc(100%-16rem)] xl:w-[calc(100%-18rem)] border-b border-border bg-card shadow-2xs">
        <div className="flex min-h-[86px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg border border-border p-2 text-foreground"
              aria-label="Open admin navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#002C66] dark:text-foreground truncate">
                {SECTION_META[activeSection].title}
              </h1>
              <p className="hidden md:block text-xs text-muted-foreground truncate mt-0.5">
                {SECTION_META[activeSection].subtitle}
              </p>
            </div>
          </div>

          {/* Right Omni-Search + Sync + Export + Admin Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={omniQuery}
                onChange={(e) => setOmniQuery(e.target.value)}
                placeholder="Global search (name, ID, email, GSTIN, invoice)..."
                aria-label="Global platform omni-search"
                className="h-10 w-56 xl:w-80 rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              {omniQuery.trim() && (
                <div className="absolute right-0 mt-2 w-96 max-w-[90vw] rounded-xl border border-border bg-popover p-2 shadow-2xl z-50 space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">
                    <span>Cross-Platform Matches ({omniMatches.length})</span>
                    <button
                      type="button"
                      onClick={() => setOmniQuery("")}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  {omniMatches.length ? (
                    omniMatches.map((m, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setInspected(m.entity);
                          setOmniQuery("");
                        }}
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-accent cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{m.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{m.sub}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {m.badge}
                        </Badge>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                      No matching records across platform.
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={syncing}
              onClick={() => loadSnapshot(true)}
              className="h-10 gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
              <span className="hidden md:inline">Sync DB</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCurrentSection}
              className="h-10 gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Export CSV</span>
            </Button>

            <div className="hidden xl:flex items-center gap-2.5 rounded-full border border-border bg-background pl-2 pr-3.5 py-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002C66] text-xs font-extrabold text-white">
                SA
              </span>
              <div className="leading-tight">
                <p className="text-xs font-bold text-[#002C66] dark:text-foreground">Root Admin</p>
                <p className="text-[10px] font-medium text-emerald-600">● Full Access</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full lg:pl-64 xl:pl-72">
        <div className="p-4 sm:p-6 lg:p-7">
          {loading || !snapshot ? (
            <div className="rounded-3xl border border-border bg-card p-16 text-center space-y-3">
              <div className="mx-auto h-9 w-9 rounded-full border-2 border-[#002C66] border-t-transparent animate-spin" />
              <p className="text-sm font-semibold text-muted-foreground">
                Loading live Supabase records &amp; platform telemetry...
              </p>
            </div>
          ) : activeSection === "overview" ? (
            <SuperAdminOverview
              snapshot={snapshot}
              onNavigate={selectSection}
              onInspect={setInspected}
              onApproveEmployer={(id) => handleReviewEmployer(id, "verified")}
              onApproveJob={(id) => handleModerateJob(id, "active")}
              onClearProctorFlag={(id) => handleReviewAssessment(id, "Issued")}
            />
          ) : (
            <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-2xs space-y-5">
              {/* Universal Filter Bar for Detailed Data Views */}
              {activeSection !== "system" && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="relative flex-1 min-w-[220px] max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={tableQuery}
                      onChange={(e) => setTableQuery(e.target.value)}
                      placeholder={`Filter ${SECTION_META[activeSection].title.toLowerCase()}...`}
                      className="h-9 pl-9 text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(activeSection === "candidates" ||
                      activeSection === "employers" ||
                      activeSection === "jobs") && (
                      <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                        {(["all", "live_db", "platform"] as const).map((orig) => (
                          <button
                            key={orig}
                            type="button"
                            onClick={() => setOriginFilter(orig)}
                            className={cn(
                              "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer",
                              originFilter === orig
                                ? "bg-[#002C66] text-white"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {orig === "all" ? "All Sources" : orig === "live_db" ? "Live DB Only" : "Platform"}
                          </button>
                        ))}
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1.5 cursor-pointer"
                      onClick={() =>
                        exportRecordsAsJson(`talentcir-${activeSection}-full`, snapshot)
                      }
                    >
                      <Download className="h-3.5 w-3.5" />
                      Full JSON Dump
                    </Button>
                  </div>
                </div>
              )}

              {/* 1. CANDIDATES DIRECTORY */}
              {activeSection === "candidates" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 pr-3">Candidate &amp; ID</th>
                        <th className="py-2.5 px-3">Source</th>
                        <th className="py-2.5 px-3">Contact &amp; City</th>
                        <th className="py-2.5 px-3">Exp &amp; Target CTC</th>
                        <th className="py-2.5 px-3">CIR Score</th>
                        <th className="py-2.5 px-3">Top Skills</th>
                        <th className="py-2.5 px-3">KYC / 2FA</th>
                        <th className="py-2.5 px-3">Wallet / Apps</th>
                        <th className="py-2.5 pl-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {snapshot.candidates
                        .filter((c) => (originFilter === "all" ? true : c.origin === originFilter))
                        .filter(
                          (c) =>
                            !q ||
                            [c.fullName, c.email, c.talentCirId, c.city, c.headline, ...c.skills].some(
                              (v) => v?.toLowerCase().includes(q)
                            )
                        )
                        .map((cand) => (
                          <tr
                            key={cand.id}
                            onClick={() => setInspected({ kind: "candidate", data: cand })}
                            className="hover:bg-muted/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3 pr-3">
                              <p className="font-bold text-foreground">{cand.fullName}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                {cand.talentCirId} · /u/{cand.slug}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <OriginBadge origin={cand.origin} />
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-mono text-[11px]">{cand.email}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {cand.phone} · {cand.city}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{cand.experienceYears} yrs ({cand.experienceLevel})</p>
                              <p className="text-[11px] text-muted-foreground">
                                ₹{cand.expectedSalaryLpa}L · {cand.noticePeriodDays}d NP
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-display text-sm font-extrabold text-[#002C66] dark:text-foreground">
                                {cand.cirScore}
                              </span>
                              <span className="ml-1 text-[10px] text-muted-foreground">
                                ({cand.percentile}th%)
                              </span>
                            </td>
                            <td className="py-3 px-3 max-w-[190px]">
                              <div className="flex flex-wrap gap-1">
                                {cand.skills.slice(0, 3).map((s) => (
                                  <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                                    {s}
                                  </span>
                                ))}
                                {cand.skills.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground">
                                    +{cand.skills.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <StatusPill value={cand.kycStatus} />
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{formatINR(cand.walletBalance)}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {cand.applicationsCount} apps · {cand.profileViews} views
                              </p>
                            </td>
                            <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center gap-1.5">
                                <Link
                                  to={`/u/${cand.slug}`}
                                  target="_blank"
                                  className="rounded-md border border-border px-2 py-1 text-[11px] font-semibold hover:bg-accent"
                                >
                                  Profile ↗
                                </Link>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px] cursor-pointer"
                                  onClick={() => setInspected({ kind: "candidate", data: cand })}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Inspect
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 2. EMPLOYERS & TENANTS */}
              {activeSection === "employers" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 pr-3">Company &amp; Employer ID</th>
                        <th className="py-2.5 px-3">Source</th>
                        <th className="py-2.5 px-3">Tax / Corporate IDs</th>
                        <th className="py-2.5 px-3">Contact Lead</th>
                        <th className="py-2.5 px-3">KYB Status</th>
                        <th className="py-2.5 px-3">Plan &amp; MRR</th>
                        <th className="py-2.5 px-3">Wallet / Unlocks</th>
                        <th className="py-2.5 px-3">Jobs / Apps / Hires</th>
                        <th className="py-2.5 pl-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {snapshot.employers
                        .filter((e) => (originFilter === "all" ? true : e.origin === originFilter))
                        .filter(
                          (e) =>
                            !q ||
                            [e.companyName, e.employerCode, e.officialEmail, e.gstin, e.hq, e.industry].some(
                              (v) => v?.toLowerCase().includes(q)
                            )
                        )
                        .map((emp) => (
                          <tr
                            key={emp.id}
                            onClick={() => setInspected({ kind: "employer", data: emp })}
                            className="hover:bg-muted/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3 pr-3">
                              <p className="font-bold text-foreground">{emp.companyName}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                {emp.employerCode} · {emp.hq}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <OriginBadge origin={emp.origin} />
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px]">
                              <p>GST: {emp.gstin}</p>
                              <p className="text-muted-foreground">CIN: {emp.cin}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{emp.contactName}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">{emp.officialEmail}</p>
                            </td>
                            <td className="py-3 px-3">
                              <StatusPill value={emp.verificationStatus} />
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{emp.subscriptionPlan}</p>
                              <p className="text-[11px] text-emerald-700 font-bold">{formatINR(emp.mrrInr)}/mo</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{formatINR(emp.walletBalance)}</p>
                              <p className="text-[11px] text-muted-foreground">{emp.talentUnlocksRemaining} unlocks left</p>
                            </td>
                            <td className="py-3 px-3 font-semibold">
                              {emp.activeJobsCount}J · {emp.totalApplications}A · {emp.totalHires}H
                            </td>
                            <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center gap-1.5">
                                {emp.verificationStatus === "pending" && (
                                  <Button
                                    size="sm"
                                    className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                    onClick={() => handleReviewEmployer(emp.id, "verified")}
                                  >
                                    Verify
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px] cursor-pointer"
                                  onClick={() => setInspected({ kind: "employer", data: emp })}
                                >
                                  Inspect
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. KYC & KYB VERIFICATION CENTER */}
              {activeSection === "kyc" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                      Corporate KYB Filings (CIN · GSTIN · PAN)
                    </h3>
                    {snapshot.employers.map((emp) => (
                      <div key={emp.id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold truncate">{emp.companyName}</p>
                            <StatusPill value={emp.verificationStatus} />
                          </div>
                          <p className="font-mono text-[11px] text-muted-foreground mt-1">
                            {emp.employerCode} · GSTIN: {emp.gstin} · PAN: {emp.pan}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {emp.verificationStatus !== "verified" && (
                            <Button
                              size="sm"
                              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              onClick={() => handleReviewEmployer(emp.id, "verified")}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] cursor-pointer"
                            onClick={() => setInspected({ kind: "employer", data: emp })}
                          >
                            Inspect
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                      Candidate Government ID &amp; Biometric Checks
                    </h3>
                    {snapshot.candidates.map((cand) => (
                      <div key={cand.id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold truncate">{cand.fullName}</p>
                            <StatusPill value={cand.kycStatus} />
                          </div>
                          <p className="font-mono text-[11px] text-muted-foreground mt-1">
                            {cand.talentCirId} · {cand.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {cand.kycStatus !== "verified" && (
                            <Button
                              size="sm"
                              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              onClick={() => handleVerifyCandidate(cand.id, "verified")}
                            >
                              Verify KYC
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] cursor-pointer"
                            onClick={() => setInspected({ kind: "candidate", data: cand })}
                          >
                            Inspect
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. ALL JOBS & MODERATION */}
              {activeSection === "jobs" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 pr-3">Job Role &amp; Code</th>
                        <th className="py-2.5 px-3">Source</th>
                        <th className="py-2.5 px-3">Company</th>
                        <th className="py-2.5 px-3">Location / Mode</th>
                        <th className="py-2.5 px-3">Salary &amp; Exp</th>
                        <th className="py-2.5 px-3">Status &amp; Tier</th>
                        <th className="py-2.5 px-3">Views → Apps → Hires</th>
                        <th className="py-2.5 pl-3 text-right">Moderation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {snapshot.jobs
                        .filter((j) => (originFilter === "all" ? true : j.origin === originFilter))
                        .filter(
                          (j) =>
                            !q ||
                            [j.title, j.companyName, j.jobCode, j.location, ...j.skills].some((v) =>
                              v?.toLowerCase().includes(q)
                            )
                        )
                        .map((job) => (
                          <tr
                            key={job.id}
                            onClick={() => setInspected({ kind: "job", data: job })}
                            className="hover:bg-muted/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3 pr-3">
                              <p className="font-bold text-foreground">{job.title}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                {job.jobCode} · {job.department}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <OriginBadge origin={job.origin} />
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{job.companyName}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">{job.employerCode}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p>{job.location}</p>
                              <p className="text-[11px] text-muted-foreground">{job.workMode} · {job.employmentType}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">₹{job.salaryMinLpa}L – ₹{job.salaryMaxLpa}L</p>
                              <p className="text-[11px] text-muted-foreground">{job.minExpYears}+ yrs · {job.openingsCount} seats</p>
                            </td>
                            <td className="py-3 px-3 space-y-1">
                              <StatusPill value={job.status} />
                              {job.promotionTier !== "none" && (
                                <span className="ml-1 inline-flex items-center gap-0.5 rounded bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  {job.promotionTier}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px]">
                              {job.views}V → {job.applicationsCount}A ({job.conversionRate}%) → {job.hiredCount}H
                            </td>
                            <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center gap-1.5">
                                {job.status === "pending_review" && (
                                  <Button
                                    size="sm"
                                    className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                    onClick={() => handleModerateJob(job.id, "active")}
                                  >
                                    Approve
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px] cursor-pointer"
                                  onClick={() => setInspected({ kind: "job", data: job })}
                                >
                                  Inspect
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 5. GLOBAL ATS APPLICATIONS */}
              {activeSection === "applications" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 pr-3">App ID &amp; Candidate</th>
                        <th className="py-2.5 px-3">Role &amp; Employer</th>
                        <th className="py-2.5 px-3">Match / CIR</th>
                        <th className="py-2.5 px-3">Stage</th>
                        <th className="py-2.5 px-3">Recruiter &amp; SLA</th>
                        <th className="py-2.5 px-3">Interview / Offer / BGV</th>
                        <th className="py-2.5 pl-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {snapshot.applications
                        .filter(
                          (a) =>
                            !q ||
                            [a.candidateName, a.jobTitle, a.companyName, a.appCode, a.stage].some(
                              (v) => v?.toLowerCase().includes(q)
                            )
                        )
                        .map((app) => (
                          <tr
                            key={app.id}
                            onClick={() => setInspected({ kind: "application", data: app })}
                            className="hover:bg-muted/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3 pr-3">
                              <p className="font-bold text-foreground">{app.candidateName}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                {app.appCode} · {app.candidateId}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{app.jobTitle}</p>
                              <p className="text-[11px] text-muted-foreground">{app.companyName}</p>
                            </td>
                            <td className="py-3 px-3 font-bold text-[#002C66] dark:text-foreground">
                              {app.matchScore}% · CIR {app.cirScore}
                            </td>
                            <td className="py-3 px-3">
                              <StatusPill value={app.stage} />
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium">{app.assignedRecruiter}</p>
                              <p className="text-[11px] text-muted-foreground">{app.slaStatus}</p>
                            </td>
                            <td className="py-3 px-3 text-[11px]">
                              {app.interviewScheduled || "—"} · {app.offerCtcLpa ? `₹${app.offerCtcLpa}L` : "—"} · BGV {app.bgvStatus}
                            </td>
                            <td className="py-3 pl-3 text-right">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] cursor-pointer">
                                Inspect
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 6 & 7. ASSESSMENTS, CIR & 30-LAYER PROCTORING */}
              {(activeSection === "assessments" || activeSection === "proctoring") && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 pr-3">Attempt &amp; Credential</th>
                        <th className="py-2.5 px-3">Candidate</th>
                        <th className="py-2.5 px-3">Assessment Track</th>
                        <th className="py-2.5 px-3">Core / Tech / Coding / AI</th>
                        <th className="py-2.5 px-3">CIR Score</th>
                        <th className="py-2.5 px-3">30-Layer Trust</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 pl-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {snapshot.assessments
                        .filter(
                          (a) =>
                            !q ||
                            [a.candidateName, a.attemptCode, a.credentialToken, a.assessmentTitle].some(
                              (v) => v?.toLowerCase().includes(q)
                            )
                        )
                        .map((att) => (
                          <tr
                            key={att.id}
                            onClick={() => setInspected({ kind: "assessment", data: att })}
                            className="hover:bg-muted/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3 pr-3 font-mono">
                              <p className="font-bold text-foreground">{att.attemptCode}</p>
                              <p className="text-[11px] text-muted-foreground">{att.credentialToken}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{att.candidateName}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">{att.candidateEmail}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{att.assessmentTitle}</p>
                              <p className="text-[11px] text-muted-foreground">{att.browserDevice}</p>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px]">
                              {att.coreAptitudeScore} / {att.domainTechnicalScore} / {att.codingScore} / {att.aiInterviewScore}
                            </td>
                            <td className="py-3 px-3 font-display text-sm font-extrabold text-[#002C66] dark:text-foreground">
                              {att.overallCirScore} ({att.percentile}th%)
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={cn(
                                  "font-mono font-bold",
                                  att.proctorTrustScore < 80 ? "text-rose-600" : "text-emerald-700"
                                )}
                              >
                                {att.proctorTrustScore}% ({att.proctorFlagsCount} flags)
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <StatusPill value={att.status} />
                            </td>
                            <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex gap-1.5">
                                {att.status === "Flagged" && (
                                  <Button
                                    size="sm"
                                    className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                    onClick={() => handleReviewAssessment(att.id, "Issued")}
                                  >
                                    Clear
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px] cursor-pointer"
                                  onClick={() => setInspected({ kind: "assessment", data: att })}
                                >
                                  Telemetry
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 8. REVENUE, ORDERS & SUBSCRIPTIONS */}
              {activeSection === "billing" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 pr-3">Invoice &amp; Order ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Category &amp; Plan</th>
                        <th className="py-2.5 px-3">Base + 18% GST</th>
                        <th className="py-2.5 px-3">Total INR</th>
                        <th className="py-2.5 px-3">Gateway Method</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 pl-3 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {snapshot.transactions
                        .filter(
                          (t) =>
                            !q ||
                            [t.invoiceNumber, t.orderId, t.actorName, t.itemTitle, t.category].some(
                              (v) => v?.toLowerCase().includes(q)
                            )
                        )
                        .map((tx) => (
                          <tr
                            key={tx.id}
                            onClick={() => setInspected({ kind: "transaction", data: tx })}
                            className="hover:bg-muted/40 cursor-pointer transition-colors"
                          >
                            <td className="py-3 pr-3 font-mono">
                              <p className="font-bold text-foreground">{tx.invoiceNumber}</p>
                              <p className="text-[11px] text-muted-foreground">{tx.orderId}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{tx.actorName}</p>
                              <p className="text-[11px] text-muted-foreground">{tx.actorType} · {tx.actorEmail}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-semibold">{tx.category}</p>
                              <p className="text-[11px] text-muted-foreground truncate max-w-[240px]">{tx.itemTitle}</p>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px]">
                              {formatINR(tx.amountInr)} + {formatINR(tx.gstInr)}
                            </td>
                            <td className="py-3 px-3 font-extrabold text-[#002C66] dark:text-foreground">
                              {formatINR(tx.netTotalInr)}
                            </td>
                            <td className="py-3 px-3 text-[11px]">{tx.paymentMethod}</td>
                            <td className="py-3 px-3">
                              <StatusPill value={tx.status} />
                            </td>
                            <td className="py-3 pl-3 text-right">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] cursor-pointer">
                                Inspect
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 9. WALLETS & LEDGER */}
              {activeSection === "wallets" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {snapshot.wallets
                    .filter(
                      (w) =>
                        !q ||
                        [w.ownerName, w.ownerCode, w.ownerEmail].some((v) =>
                          v?.toLowerCase().includes(q)
                        )
                    )
                    .map((wal) => (
                      <div
                        key={wal.id}
                        onClick={() => setInspected({ kind: "wallet", data: wal })}
                        className="rounded-2xl border border-border p-5 hover:border-[#002C66]/40 hover:shadow-md transition-all cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{wal.ownerType} Wallet</Badge>
                          <span className="font-mono text-xs text-muted-foreground">{wal.ownerCode}</span>
                        </div>
                        <div>
                          <p className="font-display text-base font-bold text-foreground">{wal.ownerName}</p>
                          <p className="font-mono text-xs text-muted-foreground">{wal.ownerEmail}</p>
                        </div>
                        <div className="rounded-xl bg-muted/40 p-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Available Balance</span>
                          <span className="font-display text-xl font-extrabold text-[#002C66] dark:text-foreground">
                            {formatINR(wal.balanceInr)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>Credited: {formatINR(wal.lifetimeCreditedInr)}</span>
                          <span>Debited: {formatINR(wal.lifetimeDebitedInr)}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs cursor-pointer">
                          View Ledger &amp; Credit / Debit ({wal.ledger.length} entries)
                        </Button>
                      </div>
                    ))}
                </div>
              )}

              {/* 10. LEARNING, MENTORS & HACKATHONS */}
              {activeSection === "learning" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 pr-3">Program &amp; Code</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Lead / Organizer</th>
                        <th className="py-2.5 px-3">Participants</th>
                        <th className="py-2.5 px-3">Completion / Submit %</th>
                        <th className="py-2.5 px-3">Revenue / Sponsorship</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 pl-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {snapshot.learningEvents.map((ev) => (
                        <tr
                          key={ev.id}
                          onClick={() => setInspected({ kind: "learning", data: ev })}
                          className="hover:bg-muted/40 cursor-pointer"
                        >
                          <td className="py-3 pr-3">
                            <p className="font-bold text-foreground">{ev.title}</p>
                            <p className="font-mono text-[11px] text-muted-foreground">{ev.code} · {ev.scheduleLabel}</p>
                          </td>
                          <td className="py-3 px-3"><Badge variant="secondary">{ev.kind}</Badge></td>
                          <td className="py-3 px-3">{ev.organizerOrInstructor}</td>
                          <td className="py-3 px-3 font-bold">{ev.participantsCount.toLocaleString()}</td>
                          <td className="py-3 px-3 font-semibold text-emerald-700">{ev.completionOrSubmissionRate}%</td>
                          <td className="py-3 px-3 font-semibold">{formatINR(ev.revenueGeneratedInr)}</td>
                          <td className="py-3 px-3"><StatusPill value={ev.status} /></td>
                          <td className="py-3 pl-3 text-right">
                            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] cursor-pointer">
                              Inspect
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 11. SUPPORT DESK */}
              {activeSection === "support" && (
                <div className="space-y-3">
                  {snapshot.tickets
                    .filter(
                      (t) =>
                        !q ||
                        [t.ticketCode, t.subject, t.requesterName, t.category].some((v) =>
                          v?.toLowerCase().includes(q)
                        )
                    )
                    .map((tkt) => (
                      <div
                        key={tkt.id}
                        onClick={() => setInspected({ kind: "ticket", data: tkt })}
                        className="rounded-2xl border border-border p-4 hover:bg-muted/30 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#002C66] dark:text-foreground">
                              {tkt.ticketCode}
                            </span>
                            <StatusPill value={tkt.priority} />
                            <StatusPill value={tkt.status} />
                            <Badge variant="outline" className="text-[10px]">{tkt.category}</Badge>
                          </div>
                          <p className="text-sm font-bold text-foreground">{tkt.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {tkt.requesterName} ({tkt.requesterEmail}) · SLA: {tkt.slaDueIn}
                          </p>
                        </div>
                        <Button size="sm" className="h-8 text-xs cursor-pointer">
                          Open Thread ({tkt.messages.length})
                        </Button>
                      </div>
                    ))}
                </div>
              )}

              {/* 12. SYSTEM: FEATURE FLAGS, DB EXPLORER & AUDIT STREAM */}
              {activeSection === "system" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sliders className="h-4 w-4 text-[#002C66]" />
                      <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground">
                        Global Platform Controls &amp; Feature Switches (public.platform_settings)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {snapshot.featureFlags.map((flag) => (
                        <div
                          key={flag.key}
                          className="rounded-xl border border-border p-4 flex items-start justify-between gap-4 bg-muted/15"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-foreground">{flag.label}</p>
                              <Badge variant="outline" className="text-[10px]">{flag.category}</Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {flag.description}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">key: {flag.key}</p>
                          </div>
                          <Switch
                            checked={flag.enabled}
                            onCheckedChange={(checked) => handleToggleFlag(flag.key, checked)}
                            aria-label={flag.label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-sm font-bold text-[#002C66] dark:text-foreground mb-3">
                      Immutable Security &amp; Operations Audit Trail (public.audit_log)
                    </h3>
                    <div className="space-y-2">
                      {snapshot.auditLogs.map((log) => (
                        <div
                          key={log.id}
                          onClick={() => setInspected({ kind: "audit", data: log })}
                          className="rounded-xl border border-border px-4 py-3 hover:bg-muted/30 cursor-pointer flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#002C66] dark:text-foreground">
                                {log.action}
                              </span>
                              <StatusPill value={log.severity} />
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {log.entityTable} ({log.entityId})
                              </span>
                            </div>
                            <p className="text-muted-foreground">{log.details}</p>
                          </div>
                          <div className="text-right text-[11px] text-muted-foreground">
                            <p className="font-semibold text-foreground">{log.actorName}</p>
                            <p>{log.actorIp} · {new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Slide-over Deep-Dive Inspector Drawer */}
      <SuperAdminInspector
        entity={inspected}
        onClose={() => setInspected(null)}
        onVerifyCandidate={handleVerifyCandidate}
        onSuspendCandidate={handleSuspendCandidate}
        onReviewEmployer={handleReviewEmployer}
        onModerateJob={handleModerateJob}
        onPromoteJob={handlePromoteJob}
        onUpdateApplicationStage={handleUpdateApplicationStage}
        onReviewAssessment={handleReviewAssessment}
        onRefundTransaction={handleRefundTransaction}
        onAdjustWallet={handleAdjustWallet}
        onReplyTicket={handleReplyTicket}
      />
    </div>
  );
};

export default SuperAdminDashboard;
