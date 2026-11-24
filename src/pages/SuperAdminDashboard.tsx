import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Menu,
  X,
  Sliders,
  Activity,
  Bot,
  UserCheck,
  Video,
  Calendar,
  Laptop,
  CreditCard,
  Megaphone,
  Bell,
  BarChart3,
  Settings,
  Lock,
  Layers,
  Receipt,
  BookMarked,
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
  createInitialEnterpriseState,
  type SuperAdminEnterpriseState,
} from "@/services/admin/superAdminEnterpriseData";
import {
  adminReviewEmployer,
  adminModerateJob,
} from "@/services/admin/adminService";
import {
  SuperAdminOverview,
  type AdminSectionId,
  type OverviewNavigateOptions,
} from "@/components/admin/SuperAdminOverview";
import {
  SuperAdminInspector,
  type InspectedEntity,
} from "@/components/admin/SuperAdminInspector";
import { SuperAdminCandidatesPanel } from "@/components/admin/SuperAdminCandidatesPanel";
import { SuperAdminEmployersPanel } from "@/components/admin/SuperAdminEmployersPanel";
import { AdminUsersAndRbacPanel } from "@/components/admin/modules/AdminUsersAndRbacPanel";
import { AdminEcosystemOpsPanel } from "@/components/admin/modules/AdminEcosystemOpsPanel";
import { AdminEventsAndFreelancePanel } from "@/components/admin/modules/AdminEventsAndFreelancePanel";
import { AdminMonetizationPanel } from "@/components/admin/modules/AdminMonetizationPanel";
import { AdminGrowthAndCommsPanel } from "@/components/admin/modules/AdminGrowthAndCommsPanel";
import { AdminAnalyticsAndPlatformPanel } from "@/components/admin/modules/AdminAnalyticsAndPlatformPanel";

interface NavGroup {
  id: string;
  num: string;
  label: string;
  items: Array<{
    id: AdminSectionId;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
    badgeKey?: string;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "dashboard",
    num: "01",
    label: "Dashboard",
    items: [
      { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
      { id: "activity-feed", label: "Activity Feed", icon: Activity },
    ],
  },
  {
    id: "users",
    num: "02",
    label: "User Management",
    items: [
      { id: "users-all", label: "All Users & Accounts", icon: Users, badgeKey: "allUsers" },
      { id: "rbac-roles", label: "Admin Roles & RBAC", icon: Lock, badgeKey: "roles" },
    ],
  },
  {
    id: "employers",
    num: "03",
    label: "Employer Management",
    items: [
      { id: "employers", label: "Employers & Tenants", icon: Building2, badgeKey: "employers" },
      { id: "kyc", label: "KYC & KYB Verification", icon: ShieldCheck, badgeKey: "kyc" },
    ],
  },
  {
    id: "candidates",
    num: "04",
    label: "Candidate Management",
    items: [
      { id: "candidates", label: "Candidates Directory", icon: Users, badgeKey: "candidates" },
    ],
  },
  {
    id: "recruitment",
    num: "05",
    label: "Recruitment & Jobs",
    items: [
      { id: "jobs", label: "All Jobs & Moderation", icon: Briefcase, badgeKey: "jobs" },
      { id: "applications", label: "Global ATS Pipeline", icon: FileText, badgeKey: "applications" },
      { id: "recruitment-taxonomy", label: "Categories, Skills & Cities", icon: Layers },
    ],
  },
  {
    id: "assessments",
    num: "06",
    label: "Assessments & CIR",
    items: [
      { id: "assessments", label: "Assessments & CIR", icon: GraduationCap, badgeKey: "assessments" },
      { id: "proctoring", label: "30-Layer Proctoring", icon: ShieldAlert, badgeKey: "proctoring" },
      { id: "cir-config", label: "CIR Config & Question Bank", icon: Sliders },
    ],
  },
  {
    id: "ai-hub",
    num: "07",
    label: "AI Intelligence Hub",
    items: [
      { id: "ai-hub", label: "AI Features, Usage & Logs", icon: Bot, badgeKey: "aiFeatures" },
    ],
  },
  {
    id: "lms",
    num: "08",
    label: "Learning Management",
    items: [
      { id: "lms", label: "Courses, Content & Certs", icon: BookOpen, badgeKey: "lmsCourses" },
      { id: "learning", label: "LMS, Mentors & Events", icon: BookMarked, badgeKey: "learning" },
    ],
  },
  {
    id: "mentors",
    num: "09",
    label: "Mentor Management",
    items: [
      { id: "mentors", label: "Mentors, Sessions & Payouts", icon: UserCheck, badgeKey: "mentors" },
    ],
  },
  {
    id: "talent-pool",
    num: "10",
    label: "Talent Pool & CRM",
    items: [
      { id: "talent-pool", label: "Talent Database & Requests", icon: Users, badgeKey: "talentRequests" },
    ],
  },
  {
    id: "interviews",
    num: "11",
    label: "Interview Management",
    items: [
      { id: "interviews", label: "Interviews & AI Mocks", icon: Video, badgeKey: "interviews" },
    ],
  },
  {
    id: "events",
    num: "12",
    label: "Hackathons & Events",
    items: [
      { id: "events-hub", label: "Hackathons, Mixers & Webinars", icon: Calendar, badgeKey: "events" },
    ],
  },
  {
    id: "freelancing",
    num: "13",
    label: "Freelancing",
    items: [
      { id: "freelancing", label: "Freelancers, Projects & Escrow", icon: Laptop, badgeKey: "freelance" },
    ],
  },
  {
    id: "subscriptions",
    num: "14",
    label: "Subscriptions & Plans",
    items: [
      { id: "subscriptions", label: "Plans, Coupons & Renewals", icon: CreditCard, badgeKey: "plans" },
    ],
  },
  {
    id: "finance",
    num: "15",
    label: "Payments & Finance",
    items: [
      { id: "billing", label: "Orders, GST & SaaS", icon: IndianRupee, badgeKey: "billing" },
      { id: "wallets", label: "Wallets & Ledger", icon: Wallet, badgeKey: "wallets" },
      { id: "finance-ops", label: "Payouts, GST & Commissions", icon: Receipt },
    ],
  },
  {
    id: "marketing",
    num: "16",
    label: "Marketing & CMS",
    items: [
      { id: "marketing-cms", label: "Website CMS & Campaigns", icon: Megaphone, badgeKey: "campaigns" },
    ],
  },
  {
    id: "notifications",
    num: "17",
    label: "Notifications",
    items: [
      { id: "notifications", label: "Broadcasts & Automation", icon: Bell, badgeKey: "notifications" },
    ],
  },
  {
    id: "support",
    num: "18",
    label: "Support & Grievances",
    items: [
      { id: "support", label: "Support Desk & SLA", icon: Headphones, badgeKey: "support" },
      { id: "support-kb", label: "Knowledge Base & FAQ", icon: BookOpen },
    ],
  },
  {
    id: "analytics",
    num: "19",
    label: "Analytics & Reports",
    items: [
      { id: "analytics-reports", label: "BI Analytics & Exports", icon: BarChart3 },
    ],
  },
  {
    id: "system",
    num: "20",
    label: "System Settings",
    items: [
      { id: "system", label: "Audit Logs & DB Schema", icon: Database, badgeKey: "system" },
      { id: "ops-platform", label: "Workflows, Fraud & Security", icon: Settings, badgeKey: "fraud" },
    ],
  },
];

const SECTION_META: Record<AdminSectionId, { title: string; subtitle: string }> = {
  overview: {
    title: "Super Admin Command Center",
    subtitle: "Live Supabase tables, candidate and employer registries, proctoring and revenue",
  },
  "activity-feed": {
    title: "Platform Activity Feed",
    subtitle: "Live chronological stream across candidates, employers, proctoring, finance and admin ops",
  },
  "users-all": {
    title: "Centralized User Management",
    subtitle: "All registered candidates, employers and internal admin staff with verification, notes and impersonation",
  },
  "rbac-roles": {
    title: "Admin Roles & RBAC Permissions",
    subtitle: "Role-based access matrix across Super Admin, Finance, Recruitment, Learning and Support staff",
  },
  candidates: {
    title: "Candidates Directory (360° Profiles)",
    subtitle: "Registered candidates with CIR scores, KYC state, cohorts, courses and public portfolios",
  },
  employers: {
    title: "Employers & Tenant Organizations",
    subtitle: "Corporate tenants, CIN and GSTIN verification, profile completion, SaaS plans and credits",
  },
  kyc: {
    title: "Identity (KYC) & Corporate (KYB) Verification Queue",
    subtitle: "Candidate government ID checks and employer CIN, GSTIN and PAN filings",
  },
  jobs: {
    title: "All Job Postings & Moderation Queue",
    subtitle: "Pending postings, sponsored slots, compensation bands and conversion rates",
  },
  applications: {
    title: "Global Applications & ATS Lifecycle",
    subtitle: "Cross-company applications, skill match scores, interview slots and BGV state",
  },
  "recruitment-taxonomy": {
    title: "Job Categories, Industries, Skills & Locations",
    subtitle: "Master recruitment taxonomy powering job creation, search filters and skill matching",
  },
  assessments: {
    title: "Skill Assessments & Verifiable CIR Credentials",
    subtitle: "Aptitude, communication, domain, coding and interview scorecards",
  },
  proctoring: {
    title: "30-Layer AI Proctoring & Integrity Telemetry",
    subtitle: "Session trust scores, display and focus telemetry, and credential overrides",
  },
  "cir-config": {
    title: "CIR Score Configuration & Question Bank",
    subtitle: "Competency weightages, pass/distinction thresholds, retake policies and proctored questions",
  },
  "ai-hub": {
    title: "AI Intelligence Hub (11 Engines)",
    subtitle: "Enable/disable controls, model and prompt config, token spend and API response telemetry",
  },
  lms: {
    title: "Learning Management System (Courses & Certificates)",
    subtitle: "Course catalog, curriculum approvals, modules, enrolments, completion rates and credentials",
  },
  learning: {
    title: "LMS Courses, Mentors, Hackathons & Networking",
    subtitle: "Code Arena hackathons, learning tracks, mentor sessions and city mixers",
  },
  mentors: {
    title: "Mentor Management & 1:1 Sessions",
    subtitle: "Mentor verification, hourly rates, availability, bookings, payouts and ratings",
  },
  "talent-pool": {
    title: "Talent Pool & Employer CRM",
    subtitle: "High-readiness verified CIR talent, employer shortlist requests and search analytics",
  },
  interviews: {
    title: "Interview Management & AI Mock Interviews",
    subtitle: "Employer schedules, Linda AI mock rubrics, panel feedback and interview dispute resolution",
  },
  "events-hub": {
    title: "Hackathons, Networking Events & Webinars",
    subtitle: "Sponsors, teams, submissions, winners, job auction bids, city mixers and mentor webinars",
  },
  freelancing: {
    title: "Freelancing Marketplace & Escrow Operations",
    subtitle: "Verified freelancers, project approvals, proposals, escrow payouts and dispute mediation",
  },
  subscriptions: {
    title: "Subscriptions, Plans, Coupons & Renewals",
    subtitle: "All 8 monetization plan segments, pricing tiers, free trials and discount campaigns",
  },
  billing: {
    title: "Revenue, Razorpay Orders, Subscriptions & GST",
    subtitle: "Captured payments, 18% GST invoices, recurring plans and gateway refunds",
  },
  wallets: {
    title: "Wallet Escrow Accounts & Immutable Ledger",
    subtitle: "Employer and candidate credit balances, inflows, outflows and manual entries",
  },
  "finance-ops": {
    title: "Finance Operations · Payouts, GST & Commissions",
    subtitle: "Mentor and freelancer payout releases, GSTR-1/3B tax summaries, refunds and platform fees",
  },
  "marketing-cms": {
    title: "Marketing Campaigns & Website CMS",
    subtitle: "Website pages, blogs, case studies, SEO metadata and multi-channel growth campaigns",
  },
  notifications: {
    title: "Notifications & Segmented Broadcasts",
    subtitle: "Push, email, SMS, WhatsApp and system alerts with automated triggers and open rates",
  },
  support: {
    title: "Support Tickets & SLA Escalation Desk",
    subtitle: "Employer KYB, GST billing and candidate proctoring threads",
  },
  "support-kb": {
    title: "Support Knowledge Base & FAQ Management",
    subtitle: "Self-serve documentation for candidates, employers, mentors and GST billing",
  },
  "analytics-reports": {
    title: "Management Analytics & BI Reports",
    subtitle: "User, recruitment, CIR assessment, learning, financial and platform intelligence with exports",
  },
  system: {
    title: "Immutable Audit Logs, Feature Flags & Database Explorer",
    subtitle: "Security event log, platform switches and Postgres schema row counts",
  },
  "ops-platform": {
    title: "Platform Operations · Workflows, Fraud, Automation & Compliance",
    subtitle: "Multi-level approval rules, fraud detection alerts, automations, data backups, security and DPDP",
  },
};

const StatusPill: React.FC<{ value: string }> = ({ value }) => {
  const norm = value.toLowerCase();
  const dotCls =
    norm === "verified" || norm === "active" || norm === "issued" || norm === "captured" || norm === "hired" || norm === "resolved"
      ? "bg-[#16a34a]"
      : norm === "pending" || norm === "pending_review" || norm === "in_progress" || norm === "open" || norm === "shortlisted" || norm === "interview" || norm === "offer"
        ? "bg-[#d97706]"
        : norm === "flagged" || norm === "rejected" || norm === "suspended" || norm === "failed" || norm === "urgent"
          ? "bg-[#dc2626]"
          : "bg-[#94a3b8]";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#111827] dark:text-[#eef0f5] capitalize">
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotCls)} />
      {value.replace(/_/g, " ")}
    </span>
  );
};

const OriginBadge: React.FC<{ origin: "live_db" | "platform" }> = ({ origin }) => (
  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#6b7487]">
    <span
      className={cn(
        "h-1.5 w-1.5 rounded-full shrink-0",
        origin === "live_db" ? "bg-[#16a34a]" : "bg-[#94a3b8]"
      )}
    />
    {origin === "live_db" ? "Live DB" : "Platform"}
  </span>
);

const SuperAdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSection = (searchParams.get("tab") as AdminSectionId) || "overview";

  const [activeSection, setActiveSection] = useState<AdminSectionId>(
    SECTION_META[initialSection] ? initialSection : "overview"
  );
  const [snapshot, setSnapshot] = useState<SuperAdminSnapshot | null>(null);
  const [enterprise, setEnterprise] = useState<SuperAdminEnterpriseState>(() =>
    createInitialEnterpriseState()
  );
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [impersonating, setImpersonating] = useState<{
    id: string;
    name: string;
    email: string;
    role: "Candidate" | "Employer";
  } | null>(null);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    users: true,
    employers: true,
    candidates: true,
    recruitment: true,
    assessments: true,
    finance: true,
    "ai-hub": false,
    lms: false,
    mentors: false,
    "talent-pool": false,
    interviews: false,
    events: false,
    freelancing: false,
    subscriptions: false,
    marketing: false,
    notifications: false,
    support: true,
    analytics: false,
    system: true,
  });

  // Table Filters & Global Omni-Search
  const [tableQuery, setTableQuery] = useState("");
  const [originFilter, setOriginFilter] = useState<"all" | "live_db" | "platform">("all");
  const [billingActorFilter, setBillingActorFilter] = useState<"all" | "Candidate" | "Employer">("all");
  const [billingCategoryFilter, setBillingCategoryFilter] = useState<string>("all");
  const [omniQuery, setOmniQuery] = useState("");
  const [inspected, setInspected] = useState<InspectedEntity>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectSection = (sec: AdminSectionId, opts?: OverviewNavigateOptions) => {
    setActiveSection(sec);
    setSearchParams(sec === "overview" ? {} : { tab: sec });
    setTableQuery("");
    setOriginFilter("all");
    setBillingActorFilter(opts?.billingActor ?? "all");
    setBillingCategoryFilter(opts?.billingCategory ?? "all");
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

  const handleToggleArchiveCandidates = (ids: string[], archive: boolean) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.candidates.map((c) =>
        ids.includes(c.id) ? { ...c, archived: archive } : c
      );
      if (inspected?.kind === "candidate" && ids.includes(inspected.data.id)) {
        const target = updated.find((c) => c.id === inspected.data.id);
        if (target) setInspected({ kind: "candidate", data: target });
      }
      return { ...prev, candidates: updated };
    });
    appendAudit(
      archive ? "candidate.archived" : "candidate.unarchived",
      "profiles",
      ids.join(","),
      `${archive ? "Archived" : "Restored"} ${ids.length} candidate profile(s)`
    );
    toast.success(
      `${archive ? "Archived" : "Restored"} ${ids.length} candidate profile${ids.length > 1 ? "s" : ""}`
    );
  };

  const handleBulkVerifyKyc = (ids: string[]) => {
    setSnapshot((prev) =>
      prev
        ? {
            ...prev,
            candidates: prev.candidates.map((c) =>
              ids.includes(c.id) ? { ...c, kycStatus: "verified" as const } : c
            ),
          }
        : prev
    );
    appendAudit("candidate.bulk_kyc_verified", "identity_verifications", ids.join(","), `Verified KYC for ${ids.length} candidates`);
    toast.success(`Verified KYC for ${ids.length} candidate(s)`);
  };

  const handleToggleArchiveEmployers = (ids: string[], archive: boolean) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.employers.map((e) =>
        ids.includes(e.id) ? { ...e, archived: archive } : e
      );
      if (inspected?.kind === "employer" && ids.includes(inspected.data.id)) {
        const target = updated.find((e) => e.id === inspected.data.id);
        if (target) setInspected({ kind: "employer", data: target });
      }
      return { ...prev, employers: updated };
    });
    appendAudit(
      archive ? "employer.archived" : "employer.unarchived",
      "employers",
      ids.join(","),
      `${archive ? "Archived" : "Restored"} ${ids.length} employer profile(s)`
    );
    toast.success(
      `${archive ? "Archived" : "Restored"} ${ids.length} employer profile${ids.length > 1 ? "s" : ""}`
    );
  };

  const handleSendCompletionNudge = (emp: SuperAdminEmployer) => {
    appendAudit(
      "employer.profile_nudge_sent",
      "employers",
      emp.employerCode,
      `Sent onboarding completion reminder to ${emp.officialEmail} (Missing: ${emp.missingProfileFields.join(", ")})`
    );
    toast.success(
      `Sent profile completion reminder to ${emp.companyName} (${emp.officialEmail})`
    );
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
      allUsers: snapshot.candidates.length + snapshot.employers.length + enterprise.staffAccounts.length,
      roles: enterprise.roles.length,
      candidates: snapshot.candidates.length,
      employers: snapshot.employers.length,
      kyc:
        snapshot.employers.filter((e) => e.verificationStatus === "pending").length +
        snapshot.candidates.filter((c) => c.kycStatus !== "verified").length,
      jobs: snapshot.jobs.length,
      applications: snapshot.applications.length,
      assessments: snapshot.assessments.length,
      proctoring: snapshot.assessments.filter((a) => a.status === "Flagged").length,
      aiFeatures: enterprise.aiFeatures.filter((f) => f.enabled).length,
      lmsCourses: enterprise.courses.length,
      mentors: enterprise.mentors.length,
      talentRequests: enterprise.talentRequests.length,
      interviews: enterprise.interviews.length,
      events: enterprise.hackathons.length + enterprise.networkingEvents.length + enterprise.webinars.length,
      freelance: enterprise.freelanceProjects.length,
      plans: enterprise.plans.length,
      billing: snapshot.transactions.length,
      wallets: snapshot.wallets.length,
      learning: snapshot.learningEvents.length,
      campaigns: enterprise.campaigns.length,
      notifications: enterprise.notifications.length,
      support: snapshot.tickets.filter((t) => t.status !== "resolved").length,
      system: snapshot.tableHealth.length,
      fraud: enterprise.fraudAlerts.filter((f) => f.status === "open" || f.status === "investigating").length,
    };
  }, [snapshot, enterprise]);

  const handleExportCurrentSection = () => {
    if (!snapshot) return;
    const map: Record<AdminSectionId, unknown[]> = {
      overview: snapshot.tableHealth as unknown[],
      "activity-feed": snapshot.auditLogs as unknown[],
      "users-all": [...snapshot.candidates, ...snapshot.employers] as unknown[],
      "rbac-roles": enterprise.roles as unknown[],
      candidates: snapshot.candidates as unknown[],
      employers: snapshot.employers as unknown[],
      kyc: snapshot.employers.filter((e) => e.verificationStatus === "pending") as unknown[],
      jobs: snapshot.jobs as unknown[],
      applications: snapshot.applications as unknown[],
      "recruitment-taxonomy": [enterprise.taxonomy] as unknown[],
      assessments: snapshot.assessments as unknown[],
      proctoring: snapshot.assessments as unknown[],
      "cir-config": enterprise.questionBank as unknown[],
      "ai-hub": enterprise.aiFeatures as unknown[],
      lms: enterprise.courses as unknown[],
      learning: snapshot.learningEvents as unknown[],
      mentors: enterprise.mentors as unknown[],
      "talent-pool": enterprise.talentRequests as unknown[],
      interviews: enterprise.interviews as unknown[],
      "events-hub": enterprise.hackathons as unknown[],
      freelancing: enterprise.freelanceProjects as unknown[],
      subscriptions: enterprise.plans as unknown[],
      billing: snapshot.transactions as unknown[],
      wallets: snapshot.wallets as unknown[],
      "finance-ops": enterprise.payouts as unknown[],
      "marketing-cms": enterprise.cmsPages as unknown[],
      notifications: enterprise.notifications as unknown[],
      support: snapshot.tickets as unknown[],
      "support-kb": enterprise.kbArticles as unknown[],
      "analytics-reports": snapshot.tableHealth as unknown[],
      system: snapshot.auditLogs as unknown[],
      "ops-platform": enterprise.fraudAlerts as unknown[],
    };
    exportRecordsAsCsv(`talentcir-admin-${activeSection}`, map[activeSection] as Array<Record<string, unknown>>);
    toast.success(`Exported ${activeSection} CSV report`);
  };

  const renderSidebarContent = () => {
    const sq = sidebarQuery.trim().toLowerCase();
    const visibleNavGroups = NAV_GROUPS.map((g) => ({
      ...g,
      items: sq
        ? g.items.filter(
            (i) =>
              i.label.toLowerCase().includes(sq) ||
              g.label.toLowerCase().includes(sq) ||
              g.num.includes(sq)
          )
        : g.items,
    })).filter((g) => g.items.length > 0);

    return (
      <>
        {/* 64px Brand Bar on 4px Grid */}
        <div className="shrink-0">
          <div className="h-16 min-h-16 px-5 bg-[#002C66] border-b border-white/10 flex items-center justify-between gap-2">
            <Link to="/" className="inline-flex items-center focus:outline-none" aria-label="TalentCIR Home">
              <img
                src={siteLogo.url}
                alt="TalentCIR"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>

          <div className="px-5 py-2.5 bg-[#002250] border-b border-white/10 flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-blue-100">Super Admin · 20 Modules</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-blue-200/85">
              <span className={cn("h-1.5 w-1.5 rounded-full", snapshot?.liveDbConnected ? "bg-[#4cc38a]" : "bg-[#d97706]")} />
              {snapshot?.liveDbConnected ? "Live DB" : "Syncing"}
            </span>
          </div>

          <div className="px-3 py-2 bg-[#002659] border-b border-white/10">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-200/70" strokeWidth={1.5} />
              <input
                type="search"
                value={sidebarQuery}
                onChange={(e) => setSidebarQuery(e.target.value)}
                placeholder="Filter 20 modules"
                aria-label="Filter Super Admin modules"
                className="h-8 w-full rounded-lg border border-white/15 bg-[#001F4D] pl-8 pr-2.5 text-xs text-white placeholder:text-blue-200/60 focus:border-[#FB923C] focus:outline-none transition-colors duration-150"
              />
            </div>
          </div>
        </div>

        {/* Navigation: 20 Collapsible Modules, 36px rows, 16px icons */}
        <div className="flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
          {visibleNavGroups.map((group, gIdx) => {
            const isOpen = sq ? true : Boolean(openGroups[group.id]);
            const hasActive = group.items.some((i) => i.id === activeSection);
            return (
              <div key={group.id} className={cn(gIdx === 0 ? "pt-0" : "pt-3")}>
                <button
                  type="button"
                  onClick={() => setOpenGroups((p) => ({ ...p, [group.id]: !p[group.id] }))}
                  className={cn(
                    "flex w-full items-center justify-between px-2.5 pb-1.5 text-xs transition-colors duration-150 cursor-pointer",
                    hasActive ? "text-white font-medium" : "text-blue-200/70 hover:text-white font-normal"
                  )}
                >
                  <span className="inline-flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-blue-300/65">{group.num}</span>
                    <span className="truncate">{group.label}</span>
                  </span>
                  <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-150", isOpen && "rotate-180")} strokeWidth={1.5} />
                </button>

                {isOpen && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      const count = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
                      const isAlert = item.id === "kyc" || item.id === "proctoring" || item.id === "support" || item.id === "ops-platform";
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectSection(item.id)}
                          className={cn(
                            "relative flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs transition-colors duration-150 text-left cursor-pointer",
                            isActive
                              ? "bg-white/14 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                              : "text-blue-100/80 hover:text-white hover:bg-white/8 font-normal"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-blue-200/80" strokeWidth={1.5} />
                          <span className="flex-1 truncate text-white">{item.label}</span>
                          {typeof count === "number" && (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-blue-200/75 tabular-nums">
                              {isAlert && count > 0 && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#fb923c]" />
                              )}
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
        <div className="p-3 border-t border-white/10 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/talento-pro?view=dash&role=employer"
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white/8 hover:bg-white/14 px-2 text-xs text-blue-100 hover:text-white transition-colors duration-150"
            >
              Employer
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
            <Link
              to="/talento-pro?view=dash"
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white/8 hover:bg-white/14 px-2 text-xs text-blue-100 hover:text-white transition-colors duration-150"
            >
              Candidate
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </>
    );
  };

  const q = tableQuery.trim().toLowerCase();

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-[#0b0d14] text-[#111827] dark:text-[#eef0f5] flex flex-col">
      <Helmet>
        <title>Super Admin Command Console | TalentCIR</title>
      </Helmet>

      {/* Desktop Fixed Sidebar (#002C66 Navy) */}
      <aside className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 z-40 border-r border-[#001D44] bg-[#002C66] text-white flex-col">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-64 max-w-[85vw] bg-[#002C66] text-white flex flex-col h-full">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            {renderSidebarContent()}
          </div>
          <div className="flex-1 bg-black/45" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Top Sticky 64px Header Bar */}
      <header className="sticky top-0 z-30 w-full lg:ml-64 lg:w-[calc(100%-16rem)] border-b border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c]">
        <div className="flex h-16 min-h-16 w-full items-center justify-between gap-4 px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg border border-[#111827]/[0.08] p-2 text-[#111827]"
              aria-label="Open admin navigation"
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-medium text-[#111827] dark:text-[#eef0f5] truncate">
                {SECTION_META[activeSection].title}
              </h1>
              <p className="hidden md:block text-xs text-[#6b7487] truncate">
                {SECTION_META[activeSection].subtitle}
              </p>
            </div>
          </div>

          {/* Right Omni-Search with Keycaps + Sync + Export */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
              <input
                ref={searchInputRef}
                type="search"
                value={omniQuery}
                onChange={(e) => setOmniQuery(e.target.value)}
                placeholder="Search"
                aria-label="Global platform omni-search"
                className="h-9 w-56 xl:w-72 rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#1a1e28] pl-9 pr-14 text-xs text-[#111827] dark:text-[#eef0f5] placeholder:text-[#6b7487] focus:border-[#002C66] focus:bg-white focus:outline-none transition-colors duration-150"
              />
              {!omniQuery && (
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1">
                  <kbd className="rounded border border-[#111827]/12 bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#6b7487]">
                    ⌘
                  </kbd>
                  <kbd className="rounded border border-[#111827]/12 bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#6b7487]">
                    K
                  </kbd>
                </span>
              )}
              {omniQuery.trim() && (
                <div className="absolute right-0 mt-2 w-96 max-w-[90vw] rounded-xl border border-[#111827]/[0.08] bg-white dark:bg-[#11141c] p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50 space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-xs text-[#6b7487]">
                    <span>Matches ({omniMatches.length})</span>
                    <button
                      type="button"
                      onClick={() => setOmniQuery("")}
                      className="text-[#002C66] hover:underline cursor-pointer"
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
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-[#f5f7fa] cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#111827] truncate">{m.title}</p>
                          <p className="font-mono text-[11px] text-[#6b7487] truncate">{m.sub}</p>
                        </div>
                        <span className="font-mono text-[11px] text-[#6b7487] shrink-0">
                          {m.badge}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-center text-xs text-[#6b7487]">
                      No matching records
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
              className="h-9 gap-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <RefreshCw className={cn("h-4 w-4 text-[#6b7487]", syncing && "animate-spin")} strokeWidth={1.5} />
              <span className="hidden md:inline">Sync DB</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCurrentSection}
              className="h-9 gap-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
              <span className="hidden md:inline">Export CSV</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full lg:pl-64">
        <div className="mx-auto max-w-[1600px] p-6 lg:p-8 space-y-5">
          {/* Audit-Logged Admin Impersonation Session Banner */}
          {impersonating && (
            <div
              role="status"
              className="rounded-xl border border-[#FB923C] bg-[#002C66] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FB923C]" />
                <span>
                  Impersonation session active: <strong>{impersonating.name}</strong> ({impersonating.role} · <span className="font-mono">{impersonating.id}</span> · {impersonating.email}) — all actions logged to audit_log
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={impersonating.role === "Employer" ? "/talento-pro?view=dash&role=employer" : "/talento-pro?view=dash"}
                  className="rounded-lg bg-white/12 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150"
                >
                  Open {impersonating.role} view
                </Link>
                <Button
                  size="sm"
                  className="h-7 bg-white text-[#002C66] hover:bg-blue-50 text-xs cursor-pointer"
                  onClick={() => {
                    appendAudit("admin.impersonation_ended", "auth.sessions", impersonating.id, `Ended impersonation session for ${impersonating.name}`);
                    setImpersonating(null);
                    toast.success("Exited impersonation session");
                  }}
                >
                  Exit impersonation
                </Button>
              </div>
            </div>
          )}

          {loading || !snapshot ? (
            <div className="rounded-2xl border border-[#111827]/[0.08] bg-white p-16 text-center space-y-3">
              <div className="mx-auto h-8 w-8 rounded-full border-2 border-[#002C66] border-t-transparent animate-spin" />
              <p className="text-sm text-[#6b7487]">
                Loading platform records
              </p>
            </div>
          ) : activeSection === "overview" ? (
            <SuperAdminOverview
              snapshot={snapshot}
              pendingCourseApprovals={enterprise.courses.filter((c) => c.approvalStatus === "pending_approval").length}
              openFraudAlertsCount={enterprise.fraudAlerts.filter((f) => f.status === "open" || f.status === "investigating").length}
              onNavigate={selectSection}
              onInspect={setInspected}
              onApproveEmployer={(id) => handleReviewEmployer(id, "verified")}
              onApproveJob={(id) => handleModerateJob(id, "active")}
              onClearProctorFlag={(id) => handleReviewAssessment(id, "Issued")}
            />
          ) : (
            <div className="rounded-2xl border border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] p-5 sm:p-6 space-y-5">
              {/* Universal Filter Bar for Legacy Table Views Only */}
              {(activeSection === "kyc" ||
                activeSection === "jobs" ||
                activeSection === "applications" ||
                activeSection === "assessments" ||
                activeSection === "proctoring" ||
                activeSection === "billing" ||
                activeSection === "wallets" ||
                activeSection === "learning" ||
                activeSection === "support") && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111827]/[0.08] pb-4">
                  <div className="relative flex-1 min-w-[220px] max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
                    <Input
                      value={tableQuery}
                      onChange={(e) => setTableQuery(e.target.value)}
                      placeholder="Filter records"
                      className="h-9 pl-9 text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeSection === "jobs" && (
                      <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#eceff4] p-0.5 text-xs">
                        {(["all", "live_db", "platform"] as const).map((orig) => (
                          <button
                            key={orig}
                            type="button"
                            onClick={() => setOriginFilter(orig)}
                            className={cn(
                              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer",
                              originFilter === orig
                                ? "bg-[#002C66] text-white"
                                : "text-[#4b5565] hover:text-[#111827]"
                            )}
                          >
                            {orig === "all" ? "All sources" : orig === "live_db" ? "Live DB" : "Platform"}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeSection === "billing" && (
                      <>
                        <div className="inline-flex rounded-lg border border-[#111827]/[0.08] bg-[#eceff4] p-0.5 text-xs">
                          {(["all", "Candidate", "Employer"] as const).map((act) => (
                            <button
                              key={act}
                              type="button"
                              onClick={() => setBillingActorFilter(act)}
                              className={cn(
                                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer",
                                billingActorFilter === act
                                  ? "bg-[#002C66] text-white"
                                  : "text-[#4b5565] hover:text-[#111827]"
                              )}
                            >
                              {act === "all" ? "All payers" : `${act}s`}
                            </button>
                          ))}
                        </div>

                        <select
                          aria-label="Filter billing category"
                          value={billingCategoryFilter}
                          onChange={(e) => setBillingCategoryFilter(e.target.value)}
                          className="h-8 rounded-lg border border-[#111827]/[0.08] bg-white px-2.5 text-xs text-[#111827] focus:border-[#002C66] focus:outline-none cursor-pointer"
                        >
                          <option value="all">All revenue streams</option>
                          <option value="Assessment Fee">Assessment revenue</option>
                          <option value="Learning & Mentorship">Learning &amp; mentorship</option>
                          <option value="Hackathon">Hackathon revenue</option>
                          <option value="Networking">Networking revenue</option>
                          <option value="SaaS Subscription">SaaS subscriptions</option>
                          <option value="Talent Package">Talent packages</option>
                          <option value="Wallet Top-up">Wallet top-ups</option>
                          <option value="Job Promotion">Job promotions</option>
                          <option value="Refund">Refunds</option>
                        </select>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1.5 cursor-pointer"
                      onClick={() =>
                        exportRecordsAsJson(`talentcir-${activeSection}-full`, snapshot)
                      }
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Export JSON
                    </Button>
                  </div>
                </div>
              )}

              {/* 1. CANDIDATES DIRECTORY (EMPLOYEE SUPER ADMIN) */}
              {activeSection === "candidates" && (
                <SuperAdminCandidatesPanel
                  candidates={snapshot.candidates}
                  onInspect={(cand) => setInspected({ kind: "candidate", data: cand })}
                  onToggleArchive={handleToggleArchiveCandidates}
                  onBulkVerifyKyc={handleBulkVerifyKyc}
                />
              )}

              {/* 2. EMPLOYERS & TENANTS */}
              {activeSection === "employers" && (
                <SuperAdminEmployersPanel
                  employers={snapshot.employers}
                  onInspect={(emp) => setInspected({ kind: "employer", data: emp })}
                  onToggleArchive={handleToggleArchiveEmployers}
                  onReviewEmployer={handleReviewEmployer}
                  onSendCompletionNudge={handleSendCompletionNudge}
                />
              )}

              {/* 3. KYC & KYB VERIFICATION CENTER */}
              {activeSection === "kyc" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5]">
                      Corporate KYB filings (CIN · GSTIN · PAN)
                    </h3>
                    {snapshot.employers.map((emp) => (
                      <div key={emp.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-[#111827] truncate">{emp.companyName}</p>
                            <StatusPill value={emp.verificationStatus} />
                          </div>
                          <p className="font-mono text-[11px] text-[#6b7487] mt-1">
                            {emp.employerCode} · GSTIN: {emp.gstin} · PAN: {emp.pan}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {emp.verificationStatus !== "verified" && (
                            <Button
                              size="sm"
                              className="h-7 text-[11px] bg-[#002C66] hover:bg-[#002250] text-white cursor-pointer"
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
                    <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5]">
                      Candidate government ID &amp; biometric checks
                    </h3>
                    {snapshot.candidates.map((cand) => (
                      <div key={cand.id} className="rounded-xl border border-[#111827]/[0.08] p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-[#111827] truncate">{cand.fullName}</p>
                            <StatusPill value={cand.kycStatus} />
                          </div>
                          <p className="font-mono text-[11px] text-[#6b7487] mt-1">
                            {cand.talentCirId} · {cand.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {cand.kycStatus !== "verified" && (
                            <Button
                              size="sm"
                              className="h-7 text-[11px] bg-[#002C66] hover:bg-[#002250] text-white cursor-pointer"
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
                      <tr className="border-b border-[#111827]/[0.08] text-xs font-medium text-[#6b7487]">
                        <th className="py-2.5 pr-3 font-medium">Job role &amp; code</th>
                        <th className="py-2.5 px-3 font-medium">Source</th>
                        <th className="py-2.5 px-3 font-medium">Company</th>
                        <th className="py-2.5 px-3 font-medium">Location &amp; mode</th>
                        <th className="py-2.5 px-3 font-medium">Salary &amp; exp</th>
                        <th className="py-2.5 px-3 font-medium">Status &amp; tier</th>
                        <th className="py-2.5 px-3 font-medium">Views → apps → hires</th>
                        <th className="py-2.5 pl-3 text-right font-medium">Moderation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111827]/[0.06]">
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
                            className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                          >
                            <td className="py-3 pr-3">
                              <p className="font-medium text-[#111827]">{job.title}</p>
                              <p className="font-mono text-[11px] text-[#6b7487]">
                                {job.jobCode} · {job.department}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <OriginBadge origin={job.origin} />
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#111827]">{job.companyName}</p>
                              <p className="font-mono text-[11px] text-[#6b7487]">{job.employerCode}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="text-[#111827]">{job.location}</p>
                              <p className="text-[11px] text-[#6b7487]">{job.workMode} · {job.employmentType}</p>
                            </td>
                            <td className="py-3 px-3 tabular-nums">
                              <p className="font-medium text-[#111827]">₹{job.salaryMinLpa}L – ₹{job.salaryMaxLpa}L</p>
                              <p className="text-[11px] text-[#6b7487]">{job.minExpYears}+ yrs · {job.openingsCount} seats</p>
                            </td>
                            <td className="py-3 px-3 space-y-1">
                              <StatusPill value={job.status} />
                              {job.promotionTier !== "none" && (
                                <span className="ml-2 inline-flex items-center gap-1.5 text-[11px] text-[#4b5565] capitalize">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
                                  {job.promotionTier}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-[#4b5565] tabular-nums">
                              {job.views}V → {job.applicationsCount}A ({job.conversionRate}%) → {job.hiredCount}H
                            </td>
                            <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center gap-1.5">
                                {job.status === "pending_review" && (
                                  <Button
                                    size="sm"
                                    className="h-7 px-2.5 text-[11px] bg-[#002C66] hover:bg-[#002250] text-white cursor-pointer"
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
                      <tr className="border-b border-[#111827]/[0.08] text-xs font-medium text-[#6b7487]">
                        <th className="py-2.5 pr-3 font-medium">App ID &amp; candidate</th>
                        <th className="py-2.5 px-3 font-medium">Role &amp; employer</th>
                        <th className="py-2.5 px-3 font-medium">Match &amp; CIR</th>
                        <th className="py-2.5 px-3 font-medium">Stage</th>
                        <th className="py-2.5 px-3 font-medium">Recruiter &amp; SLA</th>
                        <th className="py-2.5 px-3 font-medium">Interview · offer · BGV</th>
                        <th className="py-2.5 pl-3 text-right font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111827]/[0.06]">
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
                            className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                          >
                            <td className="py-3 pr-3">
                              <p className="font-medium text-[#111827]">{app.candidateName}</p>
                              <p className="font-mono text-[11px] text-[#6b7487]">
                                {app.appCode} · {app.candidateId}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#111827]">{app.jobTitle}</p>
                              <p className="text-[11px] text-[#6b7487]">{app.companyName}</p>
                            </td>
                            <td className="py-3 px-3 font-mono font-medium text-[#111827] tabular-nums">
                              {app.matchScore}% · CIR {app.cirScore}
                            </td>
                            <td className="py-3 px-3">
                              <StatusPill value={app.stage} />
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#111827]">{app.assignedRecruiter}</p>
                              <p className="text-[11px] text-[#6b7487]">{app.slaStatus}</p>
                            </td>
                            <td className="py-3 px-3 text-[11px] text-[#4b5565] tabular-nums">
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
                      <tr className="border-b border-[#111827]/[0.08] text-xs font-medium text-[#6b7487]">
                        <th className="py-2.5 pr-3 font-medium">Attempt &amp; credential</th>
                        <th className="py-2.5 px-3 font-medium">Candidate</th>
                        <th className="py-2.5 px-3 font-medium">Assessment track</th>
                        <th className="py-2.5 px-3 font-medium">Core · tech · coding · AI</th>
                        <th className="py-2.5 px-3 font-medium">CIR score</th>
                        <th className="py-2.5 px-3 font-medium">30-layer trust</th>
                        <th className="py-2.5 px-3 font-medium">Status</th>
                        <th className="py-2.5 pl-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111827]/[0.06]">
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
                            className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                          >
                            <td className="py-3 pr-3 font-mono">
                              <p className="font-medium text-[#111827]">{att.attemptCode}</p>
                              <p className="text-[11px] text-[#6b7487]">{att.credentialToken}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#111827]">{att.candidateName}</p>
                              <p className="font-mono text-[11px] text-[#6b7487]">{att.candidateEmail}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#111827]">{att.assessmentTitle}</p>
                              <p className="text-[11px] text-[#6b7487]">{att.browserDevice}</p>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-[#4b5565] tabular-nums">
                              {att.coreAptitudeScore} / {att.domainTechnicalScore} / {att.codingScore} / {att.aiInterviewScore}
                            </td>
                            <td className="py-3 px-3 font-mono text-sm font-medium text-[#111827] tabular-nums">
                              {att.overallCirScore} ({att.percentile}th)
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={cn(
                                  "font-mono font-medium tabular-nums",
                                  att.proctorTrustScore < 80 ? "text-[#dc2626]" : "text-[#16a34a]"
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
                                    className="h-7 px-2 text-[11px] bg-[#002C66] hover:bg-[#002250] text-white cursor-pointer"
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
                      <tr className="border-b border-[#111827]/[0.08] text-xs font-medium text-[#6b7487]">
                        <th className="py-2.5 pr-3 font-medium">Invoice &amp; order ID</th>
                        <th className="py-2.5 px-3 font-medium">Customer</th>
                        <th className="py-2.5 px-3 font-medium">Category &amp; plan</th>
                        <th className="py-2.5 px-3 font-medium">Base + 18% GST</th>
                        <th className="py-2.5 px-3 font-medium">Total INR</th>
                        <th className="py-2.5 px-3 font-medium">Method</th>
                        <th className="py-2.5 px-3 font-medium">Status</th>
                        <th className="py-2.5 pl-3 text-right font-medium">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111827]/[0.06]">
                      {snapshot.transactions
                        .filter((t) =>
                          billingActorFilter === "all" ? true : t.actorType === billingActorFilter
                        )
                        .filter((t) =>
                          billingCategoryFilter === "all" ? true : t.category === billingCategoryFilter
                        )
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
                            className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                          >
                            <td className="py-3 pr-3 font-mono">
                              <p className="font-medium text-[#111827]">{tx.invoiceNumber}</p>
                              <p className="text-[11px] text-[#6b7487]">{tx.orderId}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#111827]">{tx.actorName}</p>
                              <p className="text-[11px] text-[#6b7487]">{tx.actorType} · {tx.actorEmail}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#111827]">{tx.category}</p>
                              <p className="text-[11px] text-[#6b7487] truncate max-w-[240px]">{tx.itemTitle}</p>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-[#4b5565] tabular-nums">
                              {formatINR(tx.amountInr)} + {formatINR(tx.gstInr)}
                            </td>
                            <td className="py-3 px-3 font-mono font-medium text-[#111827] tabular-nums">
                              {formatINR(tx.netTotalInr)}
                            </td>
                            <td className="py-3 px-3 text-[11px] text-[#4b5565]">{tx.paymentMethod}</td>
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
                        className="rounded-xl border border-[#111827]/[0.08] p-5 hover:border-[#002C66]/40 transition-colors duration-150 cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs text-[#6b7487]">
                          <span>{wal.ownerType} wallet</span>
                          <span className="font-mono">{wal.ownerCode}</span>
                        </div>
                        <div>
                          <p className="text-base font-medium text-[#111827]">{wal.ownerName}</p>
                          <p className="font-mono text-xs text-[#6b7487]">{wal.ownerEmail}</p>
                        </div>
                        <div className="rounded-lg bg-[#f5f7fa] p-3 flex items-center justify-between">
                          <span className="text-xs text-[#6b7487]">Available balance</span>
                          <span className="text-xl font-medium text-[#111827] tabular-nums">
                            {formatINR(wal.balanceInr)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-[#6b7487] tabular-nums">
                          <span>Credited: {formatINR(wal.lifetimeCreditedInr)}</span>
                          <span>Debited: {formatINR(wal.lifetimeDebitedInr)}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs cursor-pointer">
                          View ledger ({wal.ledger.length} entries)
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
                      <tr className="border-b border-[#111827]/[0.08] text-xs font-medium text-[#6b7487]">
                        <th className="py-2.5 pr-3 font-medium">Program &amp; code</th>
                        <th className="py-2.5 px-3 font-medium">Type</th>
                        <th className="py-2.5 px-3 font-medium">Lead / organizer</th>
                        <th className="py-2.5 px-3 font-medium">Participants</th>
                        <th className="py-2.5 px-3 font-medium">Completion</th>
                        <th className="py-2.5 px-3 font-medium">Revenue</th>
                        <th className="py-2.5 px-3 font-medium">Status</th>
                        <th className="py-2.5 pl-3 text-right font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111827]/[0.06]">
                      {snapshot.learningEvents.map((ev) => (
                        <tr
                          key={ev.id}
                          onClick={() => setInspected({ kind: "learning", data: ev })}
                          className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                        >
                          <td className="py-3 pr-3">
                            <p className="font-medium text-[#111827]">{ev.title}</p>
                            <p className="font-mono text-[11px] text-[#6b7487]">{ev.code} · {ev.scheduleLabel}</p>
                          </td>
                          <td className="py-3 px-3"><Badge variant="secondary" className="font-normal">{ev.kind}</Badge></td>
                          <td className="py-3 px-3 text-[#4b5565]">{ev.organizerOrInstructor}</td>
                          <td className="py-3 px-3 font-medium text-[#111827] tabular-nums">{ev.participantsCount.toLocaleString()}</td>
                          <td className="py-3 px-3 font-medium text-[#16a34a] tabular-nums">{ev.completionOrSubmissionRate}%</td>
                          <td className="py-3 px-3 font-medium text-[#111827] tabular-nums">{formatINR(ev.revenueGeneratedInr)}</td>
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
                        className="rounded-xl border border-[#111827]/[0.08] p-4 hover:bg-[#f5f7fa] transition-colors duration-150 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-medium text-[#111827]">
                              {tkt.ticketCode}
                            </span>
                            <StatusPill value={tkt.priority} />
                            <StatusPill value={tkt.status} />
                            <Badge variant="outline" className="text-[11px] font-normal">{tkt.category}</Badge>
                          </div>
                          <p className="text-sm font-medium text-[#111827]">{tkt.subject}</p>
                          <p className="text-xs text-[#6b7487]">
                            {tkt.requesterName} ({tkt.requesterEmail}) · SLA: {tkt.slaDueIn}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-xs cursor-pointer">
                          Open thread ({tkt.messages.length})
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
                      <Sliders className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
                      <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5]">
                        Global platform controls &amp; feature switches (public.platform_settings)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {snapshot.featureFlags.map((flag) => (
                        <div
                          key={flag.key}
                          className="rounded-xl border border-[#111827]/[0.08] p-4 flex items-start justify-between gap-4 bg-[#f5f7fa]/60"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-[#111827]">{flag.label}</p>
                              <Badge variant="outline" className="text-[10px] font-normal">{flag.category}</Badge>
                            </div>
                            <p className="text-[11px] text-[#6b7487] leading-relaxed">
                              {flag.description}
                            </p>
                            <p className="font-mono text-[11px] text-[#6b7487]">key: {flag.key}</p>
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
                    <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5] mb-3">
                      Immutable security &amp; operations audit trail (public.audit_log)
                    </h3>
                    <div className="space-y-2">
                      {snapshot.auditLogs.map((log) => (
                        <div
                          key={log.id}
                          onClick={() => setInspected({ kind: "audit", data: log })}
                          className="rounded-xl border border-[#111827]/[0.08] px-4 py-3 hover:bg-[#f5f7fa] transition-colors duration-150 cursor-pointer flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium text-[#111827]">
                                {log.action}
                              </span>
                              <StatusPill value={log.severity} />
                              <span className="font-mono text-[11px] text-[#6b7487]">
                                {log.entityTable} ({log.entityId})
                              </span>
                            </div>
                            <p className="text-[#6b7487]">{log.details}</p>
                          </div>
                          <div className="text-right text-[11px] text-[#6b7487] tabular-nums">
                            <p className="font-medium text-[#111827]">{log.actorName}</p>
                            <p>{log.actorIp} · {new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NEW ENTERPRISE MODULES (01B–20 + 7 CAPABILITIES) */}
              {(activeSection === "users-all" || activeSection === "rbac-roles") && (
                <AdminUsersAndRbacPanel
                  key={activeSection}
                  snapshot={snapshot}
                  roles={enterprise.roles}
                  staffAccounts={enterprise.staffAccounts}
                  initialTab={activeSection === "rbac-roles" ? "roles" : "all"}
                  onInspect={setInspected}
                  onImpersonate={(target) => {
                    setImpersonating(target);
                    appendAudit("admin.impersonation_started", "auth.sessions", target.id, `Started audit-logged impersonation for ${target.name} (${target.role})`, "warning");
                    toast.success(`Impersonation session active for ${target.name}`);
                  }}
                  onVerifyCandidate={(id) => handleVerifyCandidate(id, "verified")}
                  onVerifyEmployer={(id) => handleReviewEmployer(id, "verified")}
                  onSuspendCandidate={handleSuspendCandidate}
                  onAddStaff={(staff) => {
                    setEnterprise((p) => ({ ...p, staffAccounts: [staff, ...p.staffAccounts] }));
                    appendAudit("staff.provisioned", "admin_users", staff.code, `Provisioned ${staff.fullName} as ${staff.roleLabel}`);
                    toast.success(`Added ${staff.fullName} (${staff.roleLabel})`);
                  }}
                  onToggleStaffStatus={(id) => {
                    setEnterprise((p) => ({
                      ...p,
                      staffAccounts: p.staffAccounts.map((s) =>
                        s.id === id ? { ...s, status: s.status === "active" ? "suspended" : "active" } : s
                      ),
                    }));
                    appendAudit("staff.status_toggled", "admin_users", id, "Updated internal staff account status", "warning");
                    toast.success("Updated staff account status");
                  }}
                  onUpdateRolePermission={(roleKey, modKey, level) => {
                    setEnterprise((p) => ({
                      ...p,
                      roles: p.roles.map((r) =>
                        r.key === roleKey ? { ...r, permissions: { ...r.permissions, [modKey]: level } } : r
                      ),
                    }));
                    appendAudit("rbac.permission_updated", "admin_roles", roleKey, `Set ${roleKey}.${modKey} = ${level}`);
                  }}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "ai-hub" ||
                activeSection === "lms" ||
                activeSection === "mentors" ||
                activeSection === "talent-pool" ||
                activeSection === "interviews") && (
                <AdminEcosystemOpsPanel
                  module={activeSection}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={setEnterprise}
                  onInspect={setInspected}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "events-hub" || activeSection === "freelancing") && (
                <AdminEventsAndFreelancePanel
                  mode={activeSection}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={setEnterprise}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "subscriptions" ||
                activeSection === "finance-ops" ||
                activeSection === "cir-config" ||
                activeSection === "recruitment-taxonomy") && (
                <AdminMonetizationPanel
                  mode={activeSection}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={setEnterprise}
                  onRefundTransaction={handleRefundTransaction}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "marketing-cms" ||
                activeSection === "notifications" ||
                activeSection === "support-kb") && (
                <AdminGrowthAndCommsPanel
                  mode={activeSection}
                  enterprise={enterprise}
                  onUpdateEnterprise={setEnterprise}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "analytics-reports" ||
                activeSection === "ops-platform" ||
                activeSection === "activity-feed") && (
                <AdminAnalyticsAndPlatformPanel
                  mode={activeSection}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={setEnterprise}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
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
        onToggleArchiveCandidate={(id, archive) => handleToggleArchiveCandidates([id], archive)}
        onReviewEmployer={handleReviewEmployer}
        onToggleArchiveEmployer={(id, archive) => handleToggleArchiveEmployers([id], archive)}
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
