import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserRound,
  Briefcase,
  ClipboardCheck,
  Bot,
  GraduationCap,
  UserCheck,
  Contact,
  Video,
  Trophy,
  Handshake,
  Layers,
  Wallet,
  Megaphone,
  Bell,
  LifeBuoy,
  BarChart3,
  Settings,
  Search,
  RefreshCw,
  Download,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Sliders,
  PanelLeft,
  Plus,
  Inbox,
  Eye,
  Info,
  KeyRound,
  LogOut,
  User,
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
  hydrateEnterpriseStateFromLiveDb,
  type SuperAdminEnterpriseState,
} from "@/services/admin/superAdminEnterpriseData";
import {
  SUPER_ADMIN_MENU_GROUPS,
  TOPBAR_QUICK_CREATE_ITEMS,
  findMenuPageById,
  findDefaultPageForSection,
  type PhaseLabel,
} from "@/services/admin/superAdminMenuTree";
import {
  adminReviewEmployer,
  adminModerateJob,
  adminVerifyCandidateKyc,
  adminToggleCandidateSuspension,
  adminToggleProfileArchive,
  adminToggleEmployerArchive,
  adminPromoteJob,
  adminUpdateApplicationStage,
  adminReviewAssessmentAttempt,
  adminRefundPaymentOrder,
  adminAdjustWallet,
  adminReplySupportTicket,
  adminUpsertPlatformSetting,
  adminSaveEnterpriseStore,
} from "@/services/admin/adminService";
import { supabase } from "@/integrations/supabase/client";
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
import {
  AdminUsersAndRbacPanel,
  type UsersSubTab,
} from "@/components/admin/modules/AdminUsersAndRbacPanel";
import { AdminEcosystemOpsPanel } from "@/components/admin/modules/AdminEcosystemOpsPanel";
import { AdminEventsAndFreelancePanel } from "@/components/admin/modules/AdminEventsAndFreelancePanel";
import { AdminMonetizationPanel } from "@/components/admin/modules/AdminMonetizationPanel";
import { AdminGrowthAndCommsPanel } from "@/components/admin/modules/AdminGrowthAndCommsPanel";
import { AdminAnalyticsAndPlatformPanel } from "@/components/admin/modules/AdminAnalyticsAndPlatformPanel";

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number | string }>;

const MODULE_ICONS: Record<string, IconComponent> = {
  LayoutDashboard,
  Users,
  Building2,
  UserRound,
  Briefcase,
  ClipboardCheck,
  Bot,
  GraduationCap,
  UserCheck,
  Contact,
  Video,
  Trophy,
  Handshake,
  Layers,
  Wallet,
  Megaphone,
  Bell,
  LifeBuoy,
  BarChart3,
  Settings,
};

const getPhaseDotClass = (phase: PhaseLabel): string => {
  if (phase.startsWith("Phase 1")) return "bg-[#4ade80]";
  if (phase.startsWith("Phase 2")) return "bg-[#60a5fa]";
  return "bg-[#f59e0b]";
};

const getPhaseChipClass = (phase: PhaseLabel): string => {
  if (phase.startsWith("Phase 1")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (phase.startsWith("Phase 2")) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-amber-50 text-amber-800 border-amber-200";
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

  const initialPageId = useMemo(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) return findMenuPageById(pageParam).page.id;
    const legacyTab = searchParams.get("tab") as AdminSectionId | null;
    if (legacyTab) return findDefaultPageForSection(legacyTab).page.id;
    return "01.01";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activePageId, setActivePageId] = useState<string>(initialPageId);
  const [activeInnerTabIndex, setActiveInnerTabIndex] = useState<number>(0);
  const resolvedMenu = useMemo(() => findMenuPageById(activePageId), [activePageId]);
  const activeSection: AdminSectionId = resolvedMenu.page.sectionId;
  const activeInnerTab = resolvedMenu.page.tabs[activeInnerTabIndex] ?? resolvedMenu.page.tabs[0] ?? null;

  const [snapshot, setSnapshot] = useState<SuperAdminSnapshot | null>(null);
  const [enterprise, setEnterprise] = useState<SuperAdminEnterpriseState>(() =>
    createInitialEnterpriseState()
  );
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showPageSpec, setShowPageSpec] = useState(false);
  const [impersonating, setImpersonating] = useState<{
    id: string;
    name: string;
    email: string;
    role: "Candidate" | "Employer";
  } | null>(null);

  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => ({
    "01": true,
    "02": true,
    "03": true,
    "04": true,
    [findMenuPageById(initialPageId).module.id]: true,
  }));

  // Table Filters & Global Omni-Search
  const [tableQuery, setTableQuery] = useState("");
  const [billingActorFilter, setBillingActorFilter] = useState<"all" | "Candidate" | "Employer">("all");
  const [billingCategoryFilter, setBillingCategoryFilter] = useState<string>("all");
  const [omniQuery, setOmniQuery] = useState("");
  const [inspected, setInspected] = useState<InspectedEntity>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickCreateRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const enterpriseSaveTimerRef = useRef<number | null>(null);

  const updateEnterprise: React.Dispatch<React.SetStateAction<SuperAdminEnterpriseState>> =
    useCallback((updater) => {
      setEnterprise((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (p: SuperAdminEnterpriseState) => SuperAdminEnterpriseState)(prev)
            : updater;
        if (enterpriseSaveTimerRef.current) {
          window.clearTimeout(enterpriseSaveTimerRef.current);
        }
        enterpriseSaveTimerRef.current = window.setTimeout(() => {
          void adminSaveEnterpriseStore("enterprise_state_v1", {
            roles: next.roles,
            staffAccounts: next.staffAccounts,
            aiFeatures: next.aiFeatures,
            cmsPages: next.cmsPages,
            campaigns: next.campaigns,
            kbArticles: next.kbArticles,
            approvalWorkflows: next.approvalWorkflows,
            automations: next.automations,
            cirConfig: next.cirConfig,
            questionBank: next.questionBank,
            taxonomy: next.taxonomy,
            plans: next.plans,
            maintenanceMode: next.maintenanceMode,
            twoFactorEnforced: next.twoFactorEnforced,
            ipWhitelistEnabled: next.ipWhitelistEnabled,
            commissionRates: next.commissionRates,
          });
        }, 700);
        return next;
      });
    }, []);

  const loadSnapshot = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setSyncing(true);
      else setLoading((prev) => (snapshot ? prev : true));
      try {
        const data = await fetchSuperAdminSnapshot();
        setSnapshot(data);
        setEnterprise((prev) =>
          hydrateEnterpriseStateFromLiveDb(
            createInitialEnterpriseState(),
            data.liveEnterpriseRaw
          ) || prev
        );
        if (isRefresh) {
          toast.success(
            `Synced live DB (${data.liveProfilesCount} candidates · ${data.liveEmployersCount} employers · ${data.liveJobsCount} jobs · ${data.liveTransactionsCount} payments)`
          );
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load Super Admin data");
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    loadSnapshot(false);
  }, [loadSnapshot]);

  // Supabase Realtime streaming for live signups, profiles, jobs, applications, payments & tickets
  useEffect(() => {
    if (typeof supabase.channel !== "function") return;
    let debounceTimer: number | null = null;
    const scheduleRefresh = () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        void loadSnapshot(false);
      }, 900);
    };

    const rtTables = [
      "profiles",
      "employers",
      "employer_job_openings",
      "job_applications",
      "payment_orders",
      "wallet_accounts",
      "assessment_attempts",
      "support_tickets",
      "course_enrollments",
      "hackathon_registrations",
      "event_registrations",
    ];

    let channel = supabase.channel("super-admin-live-sync");
    for (const table of rtTables) {
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        scheduleRefresh
      );
    }
    channel.subscribe((status) => {
      setRealtimeConnected(status === "SUBSCRIBED");
    });

    return () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      if (typeof supabase.removeChannel === "function") {
        void supabase.removeChannel(channel);
      }
    };
  }, [loadSnapshot]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape") {
        setQuickCreateOpen(false);
        setProfileMenuOpen(false);
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (quickCreateRef.current && !quickCreateRef.current.contains(target)) {
        setQuickCreateOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  const selectPage = useCallback(
    (pageId: string, opts?: OverviewNavigateOptions, innerTabIdx = 0) => {
      const resolved = findMenuPageById(pageId);
      setActivePageId(resolved.page.id);
      setActiveInnerTabIndex(innerTabIdx);
      setOpenModules((prev) => ({ ...prev, [resolved.module.id]: true }));
      setSearchParams(resolved.page.id === "01.01" ? {} : { page: resolved.page.id });
      setTableQuery("");
      setBillingActorFilter(opts?.billingActor ?? "all");
      setBillingCategoryFilter(opts?.billingCategory ?? "all");
      setMobileMenuOpen(false);
      setQuickCreateOpen(false);
      setProfileMenuOpen(false);
      setShowPageSpec(false);
      window.scrollTo({ top: 0 });
    },
    [setSearchParams]
  );

  const selectSection = useCallback(
    (sec: AdminSectionId, opts?: OverviewNavigateOptions) => {
      const resolved = findDefaultPageForSection(sec);
      selectPage(resolved.page.id, opts, 0);
    },
    [selectPage]
  );

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

  // Admin Mutation Handlers (Optimistic UI + Persistent Supabase RPC Writes)
  const handleVerifyCandidate = async (id: string, status: SuperAdminCandidate["kycStatus"]) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.candidates.map((c) => (c.id === id ? { ...c, kycStatus: status } : c));
      const target = updated.find((c) => c.id === id);
      if (target && inspected?.kind === "candidate" && inspected.data.id === id) {
        setInspected({ kind: "candidate", data: target });
      }
      return { ...prev, candidates: updated };
    });
    const dbStatus = status === "unsubmitted" ? "unverified" : status;
    const res = await adminVerifyCandidateKyc(id, dbStatus);
    appendAudit("candidate.kyc_updated", "identity_verifications", id, `Candidate KYC set to ${status}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Candidate KYC marked as ${status}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleSuspendCandidate = async (id: string) => {
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
    const res = await adminToggleCandidateSuspension(id, "Toggled from Super Admin Console");
    appendAudit("candidate.status_toggled", "profiles", id, `Toggled candidate account suspension${res.persisted ? " (saved to DB)" : ""}`, "warning");
    toast.success(`Candidate account status updated${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleToggleArchiveCandidates = async (ids: string[], archive: boolean) => {
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
    const res = await adminToggleProfileArchive(ids, archive);
    appendAudit(
      archive ? "candidate.archived" : "candidate.unarchived",
      "profiles",
      ids.join(","),
      `${archive ? "Archived" : "Restored"} ${ids.length} candidate profile(s)${res.persisted ? " (saved to DB)" : ""}`
    );
    toast.success(
      `${archive ? "Archived" : "Restored"} ${ids.length} candidate profile${ids.length > 1 ? "s" : ""}${res.persisted ? " · saved to Supabase" : ""}`
    );
  };

  const handleBulkVerifyKyc = async (ids: string[]) => {
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
    const results = await Promise.all(ids.map((id) => adminVerifyCandidateKyc(id, "verified")));
    const persistedCount = results.filter((r) => r.persisted).length;
    appendAudit("candidate.bulk_kyc_verified", "identity_verifications", ids.join(","), `Verified KYC for ${ids.length} candidates (${persistedCount} persisted)`);
    toast.success(`Verified KYC for ${ids.length} candidate(s)${persistedCount > 0 ? ` · ${persistedCount} saved to Supabase` : ""}`);
  };

  const handleToggleArchiveEmployers = async (ids: string[], archive: boolean) => {
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
    const res = await adminToggleEmployerArchive(ids, archive);
    appendAudit(
      archive ? "employer.archived" : "employer.unarchived",
      "employers",
      ids.join(","),
      `${archive ? "Archived" : "Restored"} ${ids.length} employer profile(s)${res.persisted ? " (saved to DB)" : ""}`
    );
    toast.success(
      `${archive ? "Archived" : "Restored"} ${ids.length} employer profile${ids.length > 1 ? "s" : ""}${res.persisted ? " · saved to Supabase" : ""}`
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
    const res = await adminReviewEmployer(id, status, "Reviewed from Super Admin Console");
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
    appendAudit("employer.kyb_reviewed", "employers", id, `Employer verification set to ${status}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Employer ${targetEmp?.companyName || id} marked as ${status}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleModerateJob = async (id: string, status: SuperAdminJob["status"]) => {
    const res = await adminModerateJob(id, status === "active", "Moderated in Super Admin Console");
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.jobs.map((j) => (j.id === id ? { ...j, status } : j));
      const target = updated.find((j) => j.id === id);
      if (target && inspected?.kind === "job" && inspected.data.id === id) {
        setInspected({ kind: "job", data: target });
      }
      return { ...prev, jobs: updated };
    });
    appendAudit("job.moderated", "employer_job_openings", id, `Job status set to ${status}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Job status updated to ${status}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handlePromoteJob = async (id: string, tier: SuperAdminJob["promotionTier"]) => {
    setSnapshot((prev) => {
      if (!prev) return prev;
      const updated = prev.jobs.map((j) => (j.id === id ? { ...j, promotionTier: tier } : j));
      const target = updated.find((j) => j.id === id);
      if (target && inspected?.kind === "job" && inspected.data.id === id) {
        setInspected({ kind: "job", data: target });
      }
      return { ...prev, jobs: updated };
    });
    const res = await adminPromoteJob(id, tier);
    appendAudit("job.promotion_updated", "employer_job_openings", id, `Promotion tier set to ${tier}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Job promotion tier updated to ${tier}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleUpdateApplicationStage = async (id: string, stage: string) => {
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
    const res = await adminUpdateApplicationStage(id, stage);
    appendAudit("application.stage_override", "job_applications", id, `Overrode stage to ${stage}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Application moved to ${stage}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleReviewAssessment = async (id: string, status: SuperAdminAssessmentAttempt["status"]) => {
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
    const res = await adminReviewAssessmentAttempt(id, status);
    appendAudit("assessment.proctor_override", "assessment_attempts", id, `Assessment credential status set to ${status}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Assessment status updated to ${status}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleRefundTransaction = async (id: string) => {
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
    const res = await adminRefundPaymentOrder(id, "Full refund issued by Super Admin");
    appendAudit("payment.refunded", "payment_orders", id, `Full refund issued by Super Admin${res.persisted ? " (saved to DB)" : ""}`, "warning");
    toast.success(`Transaction refunded & credit note logged${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleAdjustWallet = async (
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
    const res = await adminAdjustWallet(id, type, amount, reason || "Super Admin adjustment");
    appendAudit(`wallet.${type}`, "wallet_ledger_entries", id, `${type.toUpperCase()} ₹${amount}: ${reason}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Wallet ${type}ed by ${formatINR(amount)}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleReplyTicket = async (id: string, reply: string, resolve: boolean) => {
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
    const res = await adminReplySupportTicket(id, reply, resolve);
    appendAudit("support.ticket_updated", "support_tickets", id, `${resolve ? "Ticket resolved" : "Admin reply posted"}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`${resolve ? "Ticket resolved" : "Reply sent"}${res.persisted ? " · saved to Supabase" : ""}`);
  };

  const handleToggleFlag = async (key: string, checked: boolean) => {
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
    const res = await adminUpsertPlatformSetting(`flag.${key}`, checked);
    appendAudit("platform.flag_toggled", "platform_settings", key, `Set ${key} = ${checked}${res.persisted ? " (saved to DB)" : ""}`);
    toast.success(`Updated platform setting: ${key}${res.persisted ? " · saved to Supabase" : ""}`);
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

  const pageBadgeCounts = useMemo(() => {
    if (!snapshot) return {} as Record<string, number>;
    const kycPending =
      snapshot.employers.filter((e) => e.verificationStatus === "pending").length +
      snapshot.candidates.filter((c) => c.kycStatus !== "verified").length;
    const pendingJobs = snapshot.jobs.filter((j) => j.status === "pending_review").length;
    const flaggedProctoring = snapshot.assessments.filter((a) => a.status === "Flagged").length;
    const openTickets = snapshot.tickets.filter((t) => t.status !== "resolved").length;
    const openFraud = enterprise.fraudAlerts.filter((f) => f.status === "open" || f.status === "investigating").length;
    return {
      "02.01": snapshot.candidates.length + snapshot.employers.length + enterprise.staffAccounts.length,
      "02.03": kycPending,
      "03.01": snapshot.employers.length,
      "03.02": snapshot.employers.filter((e) => e.verificationStatus === "pending").length,
      "04.01": snapshot.candidates.length,
      "05.01": snapshot.jobs.length,
      "05.02": pendingJobs,
      "05.03": snapshot.applications.length,
      "06.01": snapshot.assessments.length,
      "06.03": flaggedProctoring,
      "07.01": enterprise.aiFeatures.filter((f) => f.enabled).length,
      "08.01": enterprise.courses.length,
      "09.01": enterprise.mentors.length,
      "10.02": enterprise.talentRequests.length,
      "11.01": enterprise.interviews.length,
      "12.01": enterprise.hackathons.length,
      "12.02": enterprise.networkingEvents.length,
      "13.02": enterprise.freelanceProjects.length,
      "14.01": enterprise.plans.length,
      "15.01": snapshot.transactions.length,
      "15.06": snapshot.wallets.length,
      "17.02": enterprise.notifications.length,
      "18.01": openTickets,
      "20.06": openFraud,
    } as Record<string, number>;
  }, [snapshot, enterprise]);

  const totalPendingApprovals = useMemo(() => {
    if (!snapshot) return 0;
    return (
      snapshot.employers.filter((e) => e.verificationStatus === "pending").length +
      snapshot.jobs.filter((j) => j.status === "pending_review").length +
      enterprise.courses.filter((c) => c.approvalStatus === "pending_approval").length +
      enterprise.fraudAlerts.filter((f) => f.status === "open" || f.status === "investigating").length
    );
  }, [snapshot, enterprise]);

  // Effective sub-tab resolver combining submenu page default + active horizontal inner tab
  const effectiveSubTab = useMemo(() => {
    const base = resolvedMenu.page.initialViewTab;
    const slug = activeInnerTab?.slug;
    if (activeSection === "users-all" || activeSection === "rbac-roles") {
      if (slug === "candidate-users") return "candidates";
      if (slug === "employer-users") return "employers";
      if (slug === "admin-users") return "admins";
      if (slug === "registration-requests" || slug === "account-verification") return "verification";
      if (slug === "user-activity-logs") return "activity";
      if (slug === "user-permissions" || slug === "role-permissions") return "roles";
      return base ?? (activeSection === "rbac-roles" ? "roles" : "all");
    }
    if (activeSection === "analytics-reports") {
      if (slug === "assessment-analytics") return "assessments";
      if (slug === "learning-analytics") return "learning";
      if (slug === "platform-analytics") return "platform";
      if (slug === "user-analytics") return "users";
      if (slug === "recruitment-analytics") return "recruitment";
      if (slug === "financial-analytics") return "financial";
      return base ?? "users";
    }
    if (activeSection === "ops-platform") {
      if (slug === "approval-workflows") return "workflows";
      if (slug === "fraud-detection") return "fraud";
      if (slug === "automation") return "automation";
      if (slug === "data-and-backups") return "data";
      if (slug === "compliance") return "compliance";
      if (slug === "security-settings" || slug === "two-factor-authentication" || slug === "ip-restrictions") return "security";
      return base ?? "workflows";
    }
    if (activeSection === "finance-ops") {
      if (slug === "commissions") return "commissions";
      if (slug === "gst-reports") return "gst";
      if (slug === "payouts") return "payouts";
      if (slug === "refunds") return "refunds";
      return base ?? "payouts";
    }
    if (activeSection === "lms") {
      if (slug === "course-approvals") return "approvals";
      if (slug === "course-content") return "content";
      if (slug === "certificates") return "config";
      if (slug === "all-courses") return "courses";
      return base ?? "courses";
    }
    return base;
  }, [activeSection, resolvedMenu.page.initialViewTab, activeInnerTab?.slug]);

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
    exportRecordsAsCsv(`talentcir-admin-${resolvedMenu.page.id}-${activeSection}`, map[activeSection] as Array<Record<string, unknown>>);
    toast.success(`Exported ${resolvedMenu.page.label} CSV report`);
  };

  const renderSidebarContent = (isCollapsedRail = false) => {
    const sq = sidebarQuery.trim().toLowerCase();
    const visibleGroups = SUPER_ADMIN_MENU_GROUPS.map((group) => {
      const filteredModules = group.modules
        .map((mod) => {
          if (!sq) return mod;
          const groupOrModMatches =
            group.label.toLowerCase().includes(sq) ||
            mod.label.toLowerCase().includes(sq) ||
            mod.num.includes(sq);
          if (groupOrModMatches) return mod;
          const matchingPages = mod.pages.filter(
            (pg) =>
              pg.label.toLowerCase().includes(sq) ||
              pg.id.includes(sq) ||
              pg.tabs.some((t) => t.label.toLowerCase().includes(sq))
          );
          if (matchingPages.length > 0) {
            return { ...mod, pages: matchingPages };
          }
          return null;
        })
        .filter((m): m is NonNullable<typeof m> => m !== null);
      return { ...group, modules: filteredModules };
    }).filter((g) => g.modules.length > 0);

    return (
      <>
        {/* 64px Brand Bar on 4px Grid */}
        <div className="shrink-0">
          <div
            className={cn(
              "h-16 min-h-16 bg-[#002C66] border-b border-white/10 flex items-center gap-2",
              isCollapsedRail ? "justify-center px-2" : "justify-between px-5"
            )}
          >
            <Link
              to="/"
              className="inline-flex items-center focus:outline-none"
              aria-label="TalentCIR Home"
            >
              {isCollapsedRail ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#001F4D] border border-white/15 font-mono text-xs font-semibold text-white">
                  TC
                </span>
              ) : (
                <img
                  src={siteLogo.url}
                  alt="TalentCIR"
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              )}
            </Link>
            {!isCollapsedRail && (
              <span
                title={
                  realtimeConnected
                    ? "Supabase Realtime streaming active"
                    : snapshot?.liveDbConnected
                      ? "Connected to Supabase"
                      : "Connecting to Supabase"
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-[#001F4D] border border-white/15 px-2 py-0.5 font-mono text-[10px] text-blue-100"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    realtimeConnected
                      ? "bg-[#4ade80]"
                      : snapshot?.liveDbConnected
                        ? "bg-[#60a5fa]"
                        : "bg-[#f59e0b]"
                  )}
                />
                {realtimeConnected ? "Realtime" : snapshot?.liveDbConnected ? "Live DB" : "Sync"}
              </span>
            )}
          </div>

          {!isCollapsedRail && (
            <>
              <div className="px-5 py-2 bg-[#002250] border-b border-white/10 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-blue-100">Super Admin · 20 Modules</span>
                <span className="font-mono text-[10px] text-blue-200/75">7 Groups · 80 Views</span>
              </div>

              <div className="px-3 py-2 bg-[#002659] border-b border-white/10">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-200/70"
                    strokeWidth={1.5}
                  />
                  <input
                    type="search"
                    value={sidebarQuery}
                    onChange={(e) => setSidebarQuery(e.target.value)}
                    placeholder="Filter menu…"
                    aria-label="Filter Super Admin modules"
                    className="h-8 w-full rounded-lg border border-white/15 bg-[#001F4D] pl-8 pr-2.5 text-xs text-white placeholder:text-blue-200/60 focus:border-[#FB923C] focus:outline-none transition-colors duration-150"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation: 7 Section Headers -> 20 Numbered Modules -> Indented Submenus */}
        <nav
          aria-label="Super Admin menu"
          className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
        >
          {visibleGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {isCollapsedRail ? (
                <div className="mx-2 my-1.5 border-t border-white/10" title={group.label} />
              ) : (
                <div className="px-2.5 pt-1 pb-1 font-mono text-[10px] font-medium tracking-[0.08em] text-blue-200/65 uppercase">
                  {group.label}
                </div>
              )}

              {group.modules.map((mod) => {
                const Icon = MODULE_ICONS[mod.icon] ?? LayoutDashboard;
                const isModActive = resolvedMenu.module.id === mod.id;
                const isOpen = sq ? true : Boolean(openModules[mod.id]);

                return (
                  <div key={mod.id} className="space-y-0.5">
                    <button
                      type="button"
                      title={isCollapsedRail ? `${mod.num} · ${mod.label}` : undefined}
                      onClick={() => {
                        if (isCollapsedRail) {
                          selectPage(mod.pages[0].id);
                        } else {
                          setOpenModules((p) => ({ ...p, [mod.id]: !p[mod.id] }));
                        }
                      }}
                      className={cn(
                        "flex w-full items-center rounded-lg text-xs transition-colors duration-150 cursor-pointer",
                        isCollapsedRail ? "h-9 justify-center px-0" : "h-8 gap-2 px-2.5 text-left",
                        isModActive
                          ? "bg-white/14 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                          : "text-blue-100/85 hover:text-white hover:bg-white/8 font-normal"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isModActive ? "text-white" : "text-blue-200/80"
                        )}
                        strokeWidth={1.5}
                      />
                      {!isCollapsedRail && (
                        <>
                          <span className="font-mono text-[10px] text-blue-300/70 shrink-0">
                            {mod.num}
                          </span>
                          <span className="flex-1 truncate">{mod.label}</span>
                          <span
                            title={mod.phase}
                            className={cn("h-1.5 w-1.5 rounded-full shrink-0", getPhaseDotClass(mod.phase))}
                          />
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 text-blue-200/70 transition-transform duration-150",
                              isOpen && "rotate-90"
                            )}
                            strokeWidth={1.5}
                          />
                        </>
                      )}
                    </button>

                    {!isCollapsedRail && isOpen && (
                      <div className="ml-4 border-l border-white/15 pl-2 py-0.5 space-y-0.5">
                        {mod.pages.map((pg) => {
                          const isPageActive = activePageId === pg.id;
                          const count = pageBadgeCounts[pg.id];
                          const isAlertPage =
                            pg.id === "02.03" ||
                            pg.id === "03.02" ||
                            pg.id === "05.02" ||
                            pg.id === "06.03" ||
                            pg.id === "18.01" ||
                            pg.id === "20.06";
                          return (
                            <button
                              key={pg.id}
                              type="button"
                              onClick={() => selectPage(pg.id)}
                              className={cn(
                                "relative flex h-7 w-full items-center justify-between gap-2 rounded-md px-2.5 text-xs transition-colors duration-150 text-left cursor-pointer",
                                isPageActive
                                  ? "bg-white/14 text-white font-medium before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-[#60a5fa]"
                                  : "text-blue-100/75 hover:text-white hover:bg-white/8 font-normal"
                              )}
                            >
                              <span className="truncate">{pg.label}</span>
                              {typeof count === "number" && (
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-blue-200/80 tabular-nums shrink-0">
                                  {isAlertPage && count > 0 && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FB923C]" />
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
          ))}
        </nav>

        {/* Bottom Super Admin Identity + Quick Portals */}
        <div className="p-3 border-t border-white/10 shrink-0 space-y-2.5 bg-[#002250]">
          {isCollapsedRail ? (
            <div className="flex justify-center">
              <button
                type="button"
                title="Super Admin · admin@talentcir.com"
                onClick={() => selectPage("20.01")}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FB923C] text-xs font-semibold text-[#001F4D] cursor-pointer"
              >
                SA
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 px-1">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FB923C] text-xs font-semibold text-[#001F4D]">
                  SA
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white truncate">Super Admin</p>
                  <p className="font-mono text-[10px] text-blue-200/75 truncate">
                    admin@talentcir.com
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/talento-pro?view=dash&role=employer"
                  className="flex h-7 items-center justify-center gap-1.5 rounded-lg bg-white/8 hover:bg-white/14 px-2 text-[11px] text-blue-100 hover:text-white transition-colors duration-150"
                >
                  Employer
                  <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                </Link>
                <Link
                  to="/talento-pro?view=dash"
                  className="flex h-7 items-center justify-center gap-1.5 rounded-lg bg-white/8 hover:bg-white/14 px-2 text-[11px] text-blue-100 hover:text-white transition-colors duration-150"
                >
                  Candidate
                  <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                </Link>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const q = tableQuery.trim().toLowerCase();

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-[#0b0d14] text-[#111827] dark:text-[#eef0f5] flex flex-col">
      <Helmet>
        <title>{resolvedMenu.page.label} · Super Admin | TalentCIR</title>
      </Helmet>

      {/* Desktop Fixed Sidebar (#002C66 Navy, collapsible to 76px icon rail) */}
      <aside
        className={cn(
          "hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 z-40 border-r border-[#001D44] bg-[#002C66] text-white flex-col transition-[width] duration-150",
          sidebarCollapsed ? "lg:w-[76px]" : "lg:w-72"
        )}
      >
        {renderSidebarContent(sidebarCollapsed)}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-72 max-w-[85vw] bg-[#002C66] text-white flex flex-col h-full">
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
            {renderSidebarContent(false)}
          </div>
          <div className="flex-1 bg-black/45" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Global Top Bar (G00 Reference Structure) */}
      <header
        className={cn(
          "sticky top-0 z-30 w-full border-b border-[#111827]/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#11141c] transition-[margin,width] duration-150",
          sidebarCollapsed
            ? "lg:ml-[76px] lg:w-[calc(100%-76px)]"
            : "lg:ml-72 lg:w-[calc(100%-18rem)]"
        )}
      >
        <div className="flex h-16 min-h-16 w-full items-center justify-between gap-3 px-4 lg:px-7">
          {/* Left: Collapse Rail Toggle + Mobile Drawer + Global Search */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] text-[#111827] hover:bg-[#eceff4] transition-colors duration-150 cursor-pointer shrink-0"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg border border-[#111827]/[0.08] p-2 text-[#111827]"
              aria-label="Open admin navigation"
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* TB.01 Global Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7487]"
                strokeWidth={1.5}
              />
              <input
                ref={searchInputRef}
                type="search"
                value={omniQuery}
                onChange={(e) => setOmniQuery(e.target.value)}
                placeholder="Search users, employers, jobs, invoices…"
                aria-label="Global platform omni-search"
                className="h-9 w-full rounded-lg border border-[#111827]/[0.08] dark:border-white/[0.08] bg-[#f5f7fa] dark:bg-[#1a1e28] pl-9 pr-14 text-xs text-[#111827] dark:text-[#eef0f5] placeholder:text-[#6b7487] focus:border-[#002C66] focus:bg-white focus:outline-none transition-colors duration-150"
              />
              {!omniQuery && (
                <span className="pointer-events-none hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1">
                  <kbd className="rounded border border-[#111827]/12 bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#6b7487]">
                    ⌘
                  </kbd>
                  <kbd className="rounded border border-[#111827]/12 bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#6b7487]">
                    K
                  </kbd>
                </span>
              )}
              {omniQuery.trim() && (
                <div className="absolute left-0 mt-2 w-96 max-w-[90vw] rounded-xl border border-[#111827]/[0.08] bg-white dark:bg-[#11141c] p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50 space-y-1">
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
          </div>

          {/* Right: Live Production DB Indicator + Phase Legend + Quick Create + Approvals + Notifications + Impersonation + Sync/Export + Admin Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span
              title="Connected directly to live Supabase PostgreSQL tables (zero dummy data)"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-[#111827]/[0.08] bg-[#f5f7fa] px-2.5 py-1.5 font-mono text-[11px] font-medium text-[#111827]"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  realtimeConnected
                    ? "bg-[#16a34a]"
                    : snapshot?.liveDbConnected
                      ? "bg-[#002C66]"
                      : "bg-[#d97706]"
                )}
              />
              {realtimeConnected ? "Live Realtime" : "Live Production DB"}
            </span>

            <div className="hidden 2xl:flex items-center gap-3 mr-1 text-[11px] text-[#6b7487]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
                Phase 1
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
                Phase 2
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                Phase 3
              </span>
            </div>

            {/* TB.02 Quick Create Dropdown */}
            <div className="relative" ref={quickCreateRef}>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setQuickCreateOpen((v) => !v);
                  setProfileMenuOpen(false);
                }}
                aria-expanded={quickCreateOpen}
                aria-haspopup="menu"
                className="h-9 gap-1.5 rounded-lg bg-[#002C66] hover:bg-[#002250] text-white text-xs font-medium cursor-pointer"
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">Quick Create</span>
              </Button>
              {quickCreateOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-[#111827]/[0.1] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-50"
                >
                  <div className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6b7487]">
                    Quick Actions
                  </div>
                  {TOPBAR_QUICK_CREATE_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        selectPage(item.targetPageId);
                        toast.info(`Opened ${item.label}`);
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[#111827] hover:bg-[#f5f7fa] transition-colors duration-150 cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-[10px] text-[#6b7487]">
                        {item.targetPageId}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TB.03 Pending Approvals */}
            <button
              type="button"
              onClick={() => selectPage("03.02")}
              title={`Pending Approvals (${totalPendingApprovals})`}
              aria-label={`Pending Approvals (${totalPendingApprovals})`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#111827]/[0.08] bg-white text-[#4b5565] hover:bg-[#f5f7fa] hover:text-[#111827] transition-colors duration-150 cursor-pointer"
            >
              <Inbox className="h-4 w-4" strokeWidth={1.5} />
              {totalPendingApprovals > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FB923C] px-1 font-mono text-[10px] font-semibold text-[#001F4D] tabular-nums">
                  {totalPendingApprovals}
                </span>
              )}
            </button>

            {/* TB.04 Notifications */}
            <button
              type="button"
              onClick={() => selectPage("17.02")}
              title={`Notifications (${enterprise.notifications.length})`}
              aria-label="Notifications"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#111827]/[0.08] bg-white text-[#4b5565] hover:bg-[#f5f7fa] hover:text-[#111827] transition-colors duration-150 cursor-pointer"
            >
              <Bell className="h-4 w-4" strokeWidth={1.5} />
              {enterprise.notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#002C66] px-1 font-mono text-[10px] font-semibold text-white tabular-nums">
                  {enterprise.notifications.length}
                </span>
              )}
            </button>

            {/* TB.05 Admin Impersonation */}
            <button
              type="button"
              onClick={() => {
                selectPage("02.01");
                toast.info("Select any candidate or employer and click Impersonate");
              }}
              title="Admin Impersonation (audit-logged)"
              aria-label="Admin Impersonation"
              className={cn(
                "hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 cursor-pointer",
                impersonating
                  ? "border-[#FB923C] bg-[#002C66] text-white"
                  : "border-[#111827]/[0.08] bg-white text-[#4b5565] hover:bg-[#f5f7fa] hover:text-[#111827]"
              )}
            >
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={syncing}
              onClick={() => loadSnapshot(true)}
              className="hidden xl:inline-flex h-9 gap-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <RefreshCw className={cn("h-4 w-4 text-[#6b7487]", syncing && "animate-spin")} strokeWidth={1.5} />
              <span>Sync DB</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCurrentSection}
              className="hidden xl:inline-flex h-9 gap-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#6b7487]" strokeWidth={1.5} />
              <span>Export CSV</span>
            </Button>

            {/* TB.06 Admin Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((v) => !v);
                  setQuickCreateOpen(false);
                }}
                aria-label="Admin Profile Menu"
                aria-expanded={profileMenuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002C66] text-xs font-semibold text-white hover:bg-[#002250] transition-colors duration-150 cursor-pointer"
              >
                SA
              </button>
              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-[#111827]/[0.1] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-50"
                >
                  <div className="px-2.5 py-2 border-b border-[#111827]/[0.08] mb-1">
                    <p className="text-xs font-medium text-[#111827]">Super Admin</p>
                    <p className="font-mono text-[11px] text-[#6b7487]">admin@talentcir.com</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => selectPage("20.01")}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#111827] hover:bg-[#f5f7fa] cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 text-[#6b7487]" strokeWidth={1.5} />
                    My Profile &amp; Admin Users
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => selectPage("20.03")}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#111827] hover:bg-[#f5f7fa] cursor-pointer"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-[#6b7487]" strokeWidth={1.5} />
                    Two-Factor Authentication
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => loadSnapshot(true)}
                    className="flex xl:hidden w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#111827] hover:bg-[#f5f7fa] cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-[#6b7487]" strokeWidth={1.5} />
                    Sync Live Database
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleExportCurrentSection}
                    className="flex xl:hidden w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#111827] hover:bg-[#f5f7fa] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-[#6b7487]" strokeWidth={1.5} />
                    Export Current CSV
                  </button>
                  <Link
                    to="/"
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#dc2626] hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main
        className={cn(
          "flex-1 w-full transition-[padding] duration-150",
          sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-72"
        )}
      >
        <div className="mx-auto max-w-[1600px] p-5 lg:p-7 space-y-5">
          {/* Reference Breadcrumb + Page Header + Inner Horizontal Tabs */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-1.5 text-xs text-[#6b7487]"
              >
                <span className="font-mono text-[11px] text-[#002C66] font-medium">
                  {resolvedMenu.module.num}
                </span>
                <span>{resolvedMenu.module.label}</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#94a3b8]" strokeWidth={1.5} />
                <span className="font-medium text-[#111827] dark:text-[#eef0f5]">
                  {resolvedMenu.page.label}
                </span>
                {activeInnerTab && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-[#94a3b8]" strokeWidth={1.5} />
                    <span className="text-[#002C66] font-medium">{activeInnerTab.label}</span>
                  </>
                )}
              </nav>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                    getPhaseChipClass(resolvedMenu.page.phase)
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", getPhaseDotClass(resolvedMenu.page.phase))} />
                  {resolvedMenu.page.phase}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPageSpec((s) => !s)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors duration-150 cursor-pointer",
                    showPageSpec
                      ? "border-[#002C66] bg-[#002C66] text-white"
                      : "border-[#111827]/[0.1] bg-white text-[#4b5565] hover:text-[#111827]"
                  )}
                >
                  <Info className="h-3 w-3" strokeWidth={1.5} />
                  Page spec
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#111827] dark:text-[#eef0f5]">
                {resolvedMenu.page.id === "01.01"
                  ? "Super Admin Command Center"
                  : resolvedMenu.page.label}
              </h1>
              <p className="mt-0.5 text-xs text-[#6b7487]">
                {resolvedMenu.page.desc}
              </p>
            </div>

            {showPageSpec && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 rounded-xl border border-[#111827]/[0.08] bg-white p-3.5 text-xs">
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#6b7487]">Menu ID</p>
                  <p className="mt-0.5 font-mono font-medium text-[#111827]">{resolvedMenu.page.id}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#6b7487]">Route</p>
                  <p className="mt-0.5 font-mono text-[#002C66] truncate">
                    {activeInnerTab ? activeInnerTab.route : resolvedMenu.page.route}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#6b7487]">Permission</p>
                  <p className="mt-0.5 font-mono text-[#111827] truncate">{resolvedMenu.page.perm}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#6b7487]">Allowed Roles</p>
                  <p className="mt-0.5 text-[#111827] truncate">{resolvedMenu.page.roles}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#6b7487]">Priority</p>
                  <p className="mt-0.5 font-medium text-[#111827]">{resolvedMenu.page.prio}</p>
                </div>
              </div>
            )}

            {/* Inner Horizontal Tab Bar (from Reference Menu Tree) */}
            {resolvedMenu.page.tabs.length > 0 && (
              <div
                role="tablist"
                aria-label={`${resolvedMenu.page.label} views`}
                className="flex items-center gap-1 overflow-x-auto border-b border-[#111827]/[0.08] pb-0 [scrollbar-width:thin]"
              >
                {resolvedMenu.page.tabs.map((tab, idx) => {
                  const isTabActive = idx === activeInnerTabIndex;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isTabActive}
                      onClick={() => setActiveInnerTabIndex(idx)}
                      className={cn(
                        "whitespace-nowrap border-b-2 px-3.5 py-2 text-xs font-medium transition-colors duration-150 cursor-pointer",
                        isTabActive
                          ? "border-[#002C66] text-[#002C66]"
                          : "border-transparent text-[#6b7487] hover:text-[#111827]"
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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

              {/* 1. CANDIDATES DIRECTORY + DEDICATED 04.03 RESUMES & 04.04 BADGES VIEWS */}
              {activeSection === "candidates" &&
                (resolvedMenu.page.initialViewTab === "resumes" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {[
                        {
                          label: "Resumes uploaded",
                          value: String(snapshot.candidates.filter((c) => c.hasResume).length),
                          meta: `of ${snapshot.candidates.length} candidates`,
                        },
                        {
                          label: "60s video pitches",
                          value: String(snapshot.candidates.filter((c) => c.hasVideoResume).length),
                          meta: "Verified recruiter intro reels",
                        },
                        {
                          label: "LinkedIn / GitHub linked",
                          value: String(snapshot.candidates.filter((c) => c.linkedinUrl || c.githubUrl).length),
                          meta: "External proof of work",
                        },
                        {
                          label: "Avg profile completion",
                          value: `${Math.round(
                            snapshot.candidates.reduce((s, c) => s + c.profileCompletion, 0) /
                              Math.max(1, snapshot.candidates.length)
                          )}%`,
                          meta: "Across active candidates",
                        },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-4">
                          <p className="text-xs text-[#6b7487]">{stat.label}</p>
                          <p className="mt-2 text-2xl font-medium text-[#111827] tabular-nums">{stat.value}</p>
                          <p className="mt-1 text-[11px] text-[#6b7487]">{stat.meta}</p>
                        </div>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                            <th className="py-2.5 pr-3 font-medium">Candidate</th>
                            <th className="py-2.5 px-3 font-medium">Resume PDF</th>
                            <th className="py-2.5 px-3 font-medium">Video Pitch</th>
                            <th className="py-2.5 px-3 font-medium">Public Portfolio</th>
                            <th className="py-2.5 px-3 font-medium">Completion</th>
                            <th className="py-2.5 pl-3 text-right font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#111827]/[0.06]">
                          {snapshot.candidates.map((cand) => (
                            <tr
                              key={cand.id}
                              onClick={() => setInspected({ kind: "candidate", data: cand })}
                              className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                            >
                              <td className="py-3 pr-3">
                                <p className="font-medium text-[#111827]">{cand.fullName}</p>
                                <p className="font-mono text-[11px] text-[#6b7487]">{cand.talentCirId} · {cand.headline}</p>
                              </td>
                              <td className="py-3 px-3">
                                <StatusPill value={cand.hasResume ? "verified" : "pending"} />
                              </td>
                              <td className="py-3 px-3 text-[#4b5565]">
                                {cand.hasVideoResume ? "60s Pitch Ready" : "Not uploaded"}
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-[#002C66]">
                                /profile/{cand.slug}
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">
                                {cand.profileCompletion}%
                              </td>
                              <td className="py-3 pl-3 text-right">
                                <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px] cursor-pointer">
                                  Inspect
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : resolvedMenu.page.initialViewTab === "badges" ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                            <th className="py-2.5 pr-3 font-medium">Candidate</th>
                            <th className="py-2.5 px-3 font-medium">KYC Identity</th>
                            <th className="py-2.5 px-3 font-medium">CIR Credential Badge</th>
                            <th className="py-2.5 px-3 font-medium">Achievement Badges</th>
                            <th className="py-2.5 pl-3 text-right font-medium">Manage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#111827]/[0.06]">
                          {snapshot.candidates.map((cand) => (
                            <tr
                              key={cand.id}
                              onClick={() => setInspected({ kind: "candidate", data: cand })}
                              className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                            >
                              <td className="py-3 pr-3">
                                <p className="font-medium text-[#111827]">{cand.fullName}</p>
                                <p className="font-mono text-[11px] text-[#6b7487]">{cand.talentCirId} · {cand.city}</p>
                              </td>
                              <td className="py-3 px-3">
                                <StatusPill value={cand.kycStatus} />
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">
                                CIR {cand.cirScore} · {cand.percentile >= 85 ? "Distinction" : "Verified"}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {cand.kycStatus === "verified" && (
                                    <Badge variant="outline" className="text-[10px] font-normal">ID Verified</Badge>
                                  )}
                                  {cand.domainsChosen.length >= 2 && (
                                    <Badge variant="outline" className="text-[10px] font-normal">Multi-Domain ({cand.domainsChosen.length})</Badge>
                                  )}
                                  {cand.hackathonParticipated && (
                                    <Badge variant="outline" className="text-[10px] font-normal">Hackathon Builder</Badge>
                                  )}
                                  {cand.coursesCompleted > 0 && (
                                    <Badge variant="outline" className="text-[10px] font-normal">{cand.coursesCompleted} Course Certs</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex gap-1.5">
                                  {cand.kycStatus !== "verified" && (
                                    <Button
                                      size="sm"
                                      className="h-7 px-2.5 text-[11px] bg-[#002C66] hover:bg-[#002250] text-white cursor-pointer"
                                      onClick={() => handleVerifyCandidate(cand.id, "verified")}
                                    >
                                      Grant ID Badge
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2.5 text-[11px] cursor-pointer"
                                    onClick={() => setInspected({ kind: "candidate", data: cand })}
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
                  </div>
                ) : (
                  <SuperAdminCandidatesPanel
                    candidates={snapshot.candidates}
                    onInspect={(cand) => setInspected({ kind: "candidate", data: cand })}
                    onToggleArchive={handleToggleArchiveCandidates}
                    onBulkVerifyKyc={handleBulkVerifyKyc}
                  />
                ))}

              {/* 2. EMPLOYERS & TENANTS + DEDICATED 03.03 EMPLOYER ACTIVITY VIEW */}
              {activeSection === "employers" &&
                (resolvedMenu.page.initialViewTab === "employer-activity" ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                            <th className="py-2.5 pr-3 font-medium">Employer &amp; code</th>
                            <th className="py-2.5 px-3 font-medium">Subscription &amp; MRR</th>
                            <th className="py-2.5 px-3 font-medium">Hiring activity</th>
                            <th className="py-2.5 px-3 font-medium">Profile completion</th>
                            <th className="py-2.5 px-3 font-medium">Last active</th>
                            <th className="py-2.5 pl-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#111827]/[0.06]">
                          {snapshot.employers.map((emp) => (
                            <tr
                              key={emp.id}
                              onClick={() => setInspected({ kind: "employer", data: emp })}
                              className="hover:bg-[#f5f7fa] cursor-pointer transition-colors duration-150"
                            >
                              <td className="py-3 pr-3">
                                <p className="font-medium text-[#111827]">{emp.companyName}</p>
                                <p className="font-mono text-[11px] text-[#6b7487]">{emp.employerCode} · {emp.contactName}</p>
                              </td>
                              <td className="py-3 px-3">
                                <p className="font-medium text-[#111827]">{emp.subscriptionPlan}</p>
                                <p className="font-mono text-[11px] text-[#6b7487] tabular-nums">{formatINR(emp.mrrInr)}/mo · {emp.talentUnlocksRemaining} unlocks</p>
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-[#4b5565] tabular-nums">
                                {emp.activeJobsCount} jobs · {emp.totalApplications} apps · {emp.totalHires} hires
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums text-[#111827]">
                                {emp.profileCompletion}%
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-[#6b7487]">
                                {new Date(emp.lastActiveAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 pl-3 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex gap-1.5">
                                  {emp.profileCompletion < 100 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-2 text-[11px] cursor-pointer"
                                      onClick={() => handleSendCompletionNudge(emp)}
                                    >
                                      Nudge
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
                  </div>
                ) : (
                  <SuperAdminEmployersPanel
                    employers={snapshot.employers}
                    onInspect={(emp) => setInspected({ kind: "employer", data: emp })}
                    onToggleArchive={handleToggleArchiveEmployers}
                    onReviewEmployer={handleReviewEmployer}
                    onSendCompletionNudge={handleSendCompletionNudge}
                  />
                ))}

              {/* 3. KYC & KYB VERIFICATION CENTER */}
              {activeSection === "kyc" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5]">
                      Corporate KYB filings (CIN · GSTIN · PAN)
                    </h3>
                    {snapshot.employers.length === 0 ? (
                      <p className="rounded-xl border border-[#111827]/[0.08] py-8 text-center text-xs text-[#6b7487]">
                        No employer KYB filings submitted yet.
                      </p>
                    ) : (
                      snapshot.employers.map((emp) => (
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
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#111827] dark:text-[#eef0f5]">
                      Candidate government ID &amp; biometric checks
                    </h3>
                    {snapshot.candidates.length === 0 ? (
                      <p className="rounded-xl border border-[#111827]/[0.08] py-8 text-center text-xs text-[#6b7487]">
                        No candidate KYC records submitted yet.
                      </p>
                    ) : (
                      snapshot.candidates.map((cand) => (
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
                      ))
                    )}
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
                      {(() => {
                        const filteredJobs = snapshot.jobs
                          .filter((j) => {
                            const slug = activeInnerTab?.slug;
                            if (!slug || slug === "all-jobs" || slug === "create-job") return true;
                            if (slug === "pending-job-approvals") return j.status === "pending_review";
                            if (slug === "published-jobs") return j.status === "active";
                            if (slug === "rejected-jobs") return j.status === "rejected";
                            if (slug === "expired-jobs") return j.status === "closed" || j.status === "paused";
                            if (slug === "featured-jobs") return j.promotionTier !== "none";
                            if (slug === "urgent-hiring-jobs") return j.openingsCount >= 4 || j.promotionTier === "sponsored";
                            if (slug === "reported-jobs") return j.status === "pending_review" || j.status === "rejected";
                            return true;
                          })
                          .filter(
                            (j) =>
                              !q ||
                              [j.title, j.companyName, j.jobCode, j.location, ...j.skills].some((v) =>
                                v?.toLowerCase().includes(q)
                              )
                          );
                        if (filteredJobs.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="py-10 text-center text-xs text-[#6b7487]">
                                No job openings posted yet. Live employer job listings will appear here automatically.
                              </td>
                            </tr>
                          );
                        }
                        return filteredJobs.map((job) => (
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
                        ));
                      })()}
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
                      {(() => {
                        const filteredApps = snapshot.applications
                          .filter((a) => {
                            const slug = activeInnerTab?.slug;
                            if (!slug || slug === "all-applications") return true;
                            const st = a.stage.toLowerCase();
                            if (slug === "new-applications") return st.includes("appl") || st === "new";
                            if (slug === "under-review") return st.includes("review") || st.includes("screen");
                            if (slug === "shortlisted-candidates") return st.includes("shortlist");
                            if (slug === "rejected-candidates") return st.includes("reject");
                            if (slug === "interview-scheduled") return st.includes("interview");
                            if (slug === "selected-candidates" || slug === "offers-released") return st.includes("offer") || st.includes("select");
                            if (slug === "hired-candidates") return st.includes("hire");
                            return true;
                          })
                          .filter(
                            (a) =>
                              !q ||
                              [a.candidateName, a.jobTitle, a.companyName, a.appCode, a.stage].some(
                                (v) => v?.toLowerCase().includes(q)
                              )
                          );
                        if (filteredApps.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-xs text-[#6b7487]">
                                No job applications submitted yet.
                              </td>
                            </tr>
                          );
                        }
                        return filteredApps.map((app) => (
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
                        ));
                      })()}
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
                      {(() => {
                        const filteredAssessments = snapshot.assessments.filter(
                          (a) =>
                            !q ||
                            [a.candidateName, a.attemptCode, a.credentialToken, a.assessmentTitle].some(
                              (v) => v?.toLowerCase().includes(q)
                            )
                        );
                        if (filteredAssessments.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="py-10 text-center text-xs text-[#6b7487]">
                                No proctored assessment attempts logged yet.
                              </td>
                            </tr>
                          );
                        }
                        return filteredAssessments.map((att) => (
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
                        ));
                      })()}
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
                      {(() => {
                        const filteredTransactions = snapshot.transactions
                          .filter((t) =>
                            billingActorFilter === "all" ? true : t.actorType === billingActorFilter
                          )
                          .filter((t) =>
                            billingCategoryFilter === "all" ? true : t.category === billingCategoryFilter
                          )
                          .filter((t) => {
                            const slug = activeInnerTab?.slug;
                            if (!slug || slug === "all-payments" || slug === "invoices" || slug === "payment-gateway-logs") return true;
                            if (slug === "candidate-payments") return t.actorType === "Candidate";
                            if (slug === "employer-payments") return t.actorType === "Employer";
                            if (slug === "pending-payments") return t.status === "pending";
                            if (slug === "failed-transactions") return t.status === "failed";
                            if (slug === "credit-notes") return t.status === "refunded" || t.direction === "refund";
                            return true;
                          })
                          .filter(
                            (t) =>
                              !q ||
                              [t.invoiceNumber, t.orderId, t.actorName, t.itemTitle, t.category].some(
                                (v) => v?.toLowerCase().includes(q)
                              )
                          );
                        if (filteredTransactions.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="py-10 text-center text-xs text-[#6b7487]">
                                No payment orders recorded yet. Live Razorpay &amp; GST invoices will appear here automatically.
                              </td>
                            </tr>
                          );
                        }
                        return filteredTransactions.map((tx) => (
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
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 9. WALLETS & LEDGER */}
              {activeSection === "wallets" && (
                snapshot.wallets.length === 0 ? (
                  <p className="rounded-xl border border-[#111827]/[0.08] py-10 text-center text-xs text-[#6b7487]">
                    No escrow wallet accounts created yet. Wallets appear automatically when users top up or receive credits.
                  </p>
                ) : (
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
                )
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
                      {snapshot.learningEvents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-xs text-[#6b7487]">
                            No learning programs or hackathons published yet. Create courses or events to populate this directory.
                          </td>
                        </tr>
                      ) : (
                        snapshot.learningEvents.map((ev) => (
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 11. SUPPORT DESK */}
              {activeSection === "support" && (
                <div className="space-y-3">
                  {snapshot.tickets.length === 0 ? (
                    <p className="rounded-xl border border-[#111827]/[0.08] py-10 text-center text-xs text-[#6b7487]">
                      No support tickets or grievances raised yet.
                    </p>
                  ) : (
                    snapshot.tickets
                      .filter((t) => {
                        const slug = activeInnerTab?.slug;
                        if (!slug || slug === "all-tickets") return true;
                        if (slug === "open-tickets") return t.status === "open";
                        if (slug === "pending-tickets") return t.status === "in_progress";
                        if (slug === "resolved-tickets") return t.status === "resolved";
                        if (slug === "escalations" || slug === "sla-breaches") return t.priority === "urgent" || t.priority === "high";
                        return true;
                      })
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
                      ))
                  )}
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
                  key={`${activePageId}-${effectiveSubTab ?? "default"}`}
                  snapshot={snapshot}
                  roles={enterprise.roles}
                  staffAccounts={enterprise.staffAccounts}
                  initialTab={(effectiveSubTab as UsersSubTab) || (activeSection === "rbac-roles" ? "roles" : "all")}
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
                    updateEnterprise((p) => ({ ...p, staffAccounts: [staff, ...p.staffAccounts] }));
                    appendAudit("staff.provisioned", "admin_users", staff.code, `Provisioned ${staff.fullName} as ${staff.roleLabel}`);
                    toast.success(`Added ${staff.fullName} (${staff.roleLabel})`);
                  }}
                  onToggleStaffStatus={(id) => {
                    updateEnterprise((p) => ({
                      ...p,
                      staffAccounts: p.staffAccounts.map((s) =>
                        s.id === id ? { ...s, status: s.status === "active" ? "suspended" : "active" } : s
                      ),
                    }));
                    appendAudit("staff.status_toggled", "admin_users", id, "Updated internal staff account status", "warning");
                    toast.success("Updated staff account status");
                  }}
                  onUpdateRolePermission={(roleKey, modKey, level) => {
                    updateEnterprise((p) => ({
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
                  initialSubTab={effectiveSubTab}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={updateEnterprise}
                  onInspect={setInspected}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "events-hub" || activeSection === "freelancing") && (
                <AdminEventsAndFreelancePanel
                  mode={activeSection}
                  initialSubTab={effectiveSubTab}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={updateEnterprise}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "subscriptions" ||
                activeSection === "finance-ops" ||
                activeSection === "cir-config" ||
                activeSection === "recruitment-taxonomy") && (
                <AdminMonetizationPanel
                  mode={activeSection}
                  initialSubTab={effectiveSubTab}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={updateEnterprise}
                  onRefundTransaction={handleRefundTransaction}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "marketing-cms" ||
                activeSection === "notifications" ||
                activeSection === "support-kb") && (
                <AdminGrowthAndCommsPanel
                  mode={activeSection}
                  initialSubTab={effectiveSubTab}
                  enterprise={enterprise}
                  onUpdateEnterprise={updateEnterprise}
                  onLogAudit={(action, table, entityId, details) => appendAudit(action, table, entityId, details)}
                />
              )}

              {(activeSection === "analytics-reports" ||
                activeSection === "ops-platform" ||
                activeSection === "activity-feed") && (
                <AdminAnalyticsAndPlatformPanel
                  mode={activeSection}
                  initialSubTab={effectiveSubTab}
                  snapshot={snapshot}
                  enterprise={enterprise}
                  onUpdateEnterprise={updateEnterprise}
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
