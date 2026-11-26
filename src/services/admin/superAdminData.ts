import { supabase } from "@/integrations/supabase/client";
import { getCandidatePhoto } from "@/data/portalAssets";
import { checkAdminSession, type AdminSessionStatus } from "@/services/admin/adminService";

export type DataOrigin = "live_db" | "platform";

export interface SuperAdminCandidate {
  id: string;
  talentCirId: string;
  origin: DataOrigin;
  archived: boolean;
  fullName: string;
  slug: string;
  email: string;
  phone: string;
  headline: string;
  industry: string;
  accountTier: "premium" | "normal";
  premiumPlanName?: string;
  city: string;
  country: string;
  experienceYears: number;
  experienceLevel: string;
  expectedSalaryLpa: number;
  noticePeriodDays: number;
  workPreference: string;
  availabilityStatus: "Actively looking" | "Open to offers" | "Placed" | "Suspended";
  freelancerStatus: "Actively Freelancing" | "Open to Freelance" | "Full-Time Only";
  freelanceHourlyInr: number;
  freelanceGigsCompleted: number;
  kycStatus: "verified" | "pending" | "unsubmitted" | "rejected";
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  cirScore: number;
  percentile: number;
  profileCompletion: number;
  missingProfileFields: string[];
  walletBalance: number;
  profileViews: number;
  applicationsCount: number;
  assessmentsPassed: number;
  totalTestAttempts: number;
  retestCount: number;
  scoreImprovementDelta: number;
  domainsChosen: string[];
  coursesEnrolled: string[];
  coursesCompleted: number;
  mentorSessionsBooked: number;
  mockInterviewsCount: number;
  hackathonParticipated: boolean;
  hackathonsList: string[];
  networkingRegistered: boolean;
  networkingEventsList: string[];
  hasResume: boolean;
  hasVideoResume: boolean;
  avatarUrl?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  certifications: string[];
  educations: Array<{ institution: string; degree: string; year: string }>;
  experiences: Array<{ company: string; role: string; duration: string; summary?: string }>;
  projects: Array<{ title: string; stack?: string; link?: string; metrics?: string }>;
  assessmentScores: Record<string, number>;
  createdAt: string;
  lastActiveAt: string;
  raw?: Record<string, unknown>;
}

export interface SuperAdminEmployer {
  id: string;
  employerCode: string;
  origin: DataOrigin;
  archived: boolean;
  accountTier: "premium" | "normal";
  companyName: string;
  slug: string;
  industry: string;
  category: string;
  companyType: string;
  size: string;
  hq: string;
  address: string;
  website: string;
  establishedYear: number;
  contactName: string;
  officialEmail: string;
  phone: string;
  verificationStatus: "verified" | "pending" | "rejected" | "suspended";
  gstin: string;
  cin: string;
  pan: string;
  gstinVerified: boolean;
  profileCompletion: number;
  missingProfileFields: string[];
  subscriptionPlan: "Enterprise Annual" | "Growth Pro" | "Starter" | "Free Trial";
  mrrInr: number;
  walletBalance: number;
  talentUnlocksRemaining: number;
  teamMembersCount: number;
  activeJobsCount: number;
  totalApplications: number;
  totalHires: number;
  logoUrl?: string;
  benefits: string[];
  createdAt: string;
  lastActiveAt: string;
  raw?: Record<string, unknown>;
}

export interface SuperAdminJob {
  id: string;
  jobCode: string;
  origin: DataOrigin;
  title: string;
  companyName: string;
  employerCode: string;
  department: string;
  industry: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "Onsite";
  employmentType: string;
  minExpYears: number;
  salaryMinLpa: number;
  salaryMaxLpa: number;
  openingsCount: number;
  status: "active" | "pending_review" | "draft" | "paused" | "closed" | "rejected";
  promotionTier: "none" | "featured" | "sponsored";
  skills: string[];
  views: number;
  applicationsCount: number;
  shortlistedCount: number;
  hiredCount: number;
  conversionRate: number;
  description: string;
  closesAt: string;
  createdAt: string;
  raw?: Record<string, unknown>;
}

export interface SuperAdminApplication {
  id: string;
  appCode: string;
  candidateName: string;
  candidateId: string;
  candidateEmail: string;
  jobTitle: string;
  jobId: string;
  companyName: string;
  stage: string;
  matchScore: number;
  cirScore: number;
  experienceYears: number;
  expectedCtcLpa: number;
  noticeDays: number;
  assignedRecruiter: string;
  slaStatus: "Within SLA" | "Action Needed" | "Completed";
  interviewScheduled?: string;
  offerCtcLpa?: number;
  bgvStatus?: "Cleared" | "In Progress" | "Not Started";
  recruiterNote?: string;
  coverNote?: string;
  skills: string[];
  appliedAt: string;
  updatedAt: string;
  history: Array<{ stage: string; note: string; at: string }>;
}

export interface SuperAdminAssessmentAttempt {
  id: string;
  attemptCode: string;
  credentialToken: string;
  candidateName: string;
  candidateEmail: string;
  assessmentTitle: string;
  domainTrack: string;
  coreAptitudeScore: number;
  coreCommunicationScore: number;
  domainTechnicalScore: number;
  codingScore: number;
  aiInterviewScore: number;
  overallCirScore: number;
  percentile: number;
  status: "Issued" | "Flagged" | "In Review" | "Failed";
  proctorTrustScore: number;
  proctorFlagsCount: number;
  proctorSummary: string;
  layersTriggered: string[];
  durationMinutes: number;
  browserDevice: string;
  ipRegion: string;
  completedAt: string;
}

export interface SuperAdminTransaction {
  id: string;
  orderId: string;
  gatewayRef: string;
  actorType: "Employer" | "Candidate";
  actorName: string;
  actorEmail: string;
  category:
    | "SaaS Subscription"
    | "Wallet Top-up"
    | "Assessment Fee"
    | "Learning & Mentorship"
    | "Hackathon"
    | "Networking"
    | "Job Promotion"
    | "Talent Package"
    | "Refund";
  itemTitle: string;
  amountInr: number;
  gstInr: number;
  netTotalInr: number;
  direction: "credit" | "debit" | "refund";
  paymentMethod: string;
  couponCode?: string;
  status: "captured" | "pending" | "refunded" | "failed";
  invoiceNumber: string;
  createdAt: string;
}

export interface SuperAdminWalletAccount {
  id: string;
  ownerType: "Employer" | "Candidate";
  ownerName: string;
  ownerEmail: string;
  ownerCode: string;
  balanceInr: number;
  lifetimeCreditedInr: number;
  lifetimeDebitedInr: number;
  status: "active" | "frozen";
  updatedAt: string;
  ledger: Array<{
    txId: string;
    type: "credit" | "debit";
    amountInr: number;
    reason: string;
    via: string;
    at: string;
  }>;
}

export interface SuperAdminTicket {
  id: string;
  ticketCode: string;
  requesterType: "Employer" | "Candidate";
  requesterName: string;
  requesterEmail: string;
  category:
    | "Billing & GST"
    | "Verification / KYC"
    | "Assessment Proctoring"
    | "ATS & Job Posting"
    | "Account Security";
  subject: string;
  priority: "urgent" | "high" | "normal" | "low";
  status: "open" | "in_progress" | "resolved";
  assignedAdmin: string;
  slaDueIn: string;
  createdAt: string;
  messages: Array<{ sender: string; role: "user" | "admin"; body: string; at: string }>;
}

export interface SuperAdminAuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: "Super Admin" | "Employer Owner" | "Candidate" | "System Cron" | "Proctor AI";
  actorIp: string;
  action: string;
  entityTable: string;
  entityId: string;
  severity: "info" | "warning" | "critical";
  details: string;
  metadata: Record<string, unknown>;
}

export interface SuperAdminLearningRecord {
  id: string;
  kind: "LMS Course" | "Hackathon" | "Mentor" | "Networking Event";
  code: string;
  title: string;
  organizerOrInstructor: string;
  category: string;
  participantsCount: number;
  completionOrSubmissionRate: number;
  priceInr: number;
  revenueGeneratedInr: number;
  status: "Active" | "Upcoming" | "Completed";
  scheduleLabel: string;
}

export interface TableHealthSummary {
  tableName: string;
  domain: string;
  liveRows: number | null;
  totalManagedRows: number;
  rlsEnabled: boolean;
  syncStatus: "Synced" | "Protected (RLS)" | "Catalog";
}

export interface PlatformFeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  category: "Security" | "AI & Proctoring" | "Billing" | "Moderation";
}

export interface LiveEnterpriseRawData {
  lmsCourses: Record<string, unknown>[];
  courseEnrollments: Record<string, unknown>[];
  mentors: Record<string, unknown>[];
  mentorBookings: Record<string, unknown>[];
  hackathons: Record<string, unknown>[];
  hackathonRegistrations: Record<string, unknown>[];
  hackathonSubmissions: Record<string, unknown>[];
  eventRegistrations: Record<string, unknown>[];
  freelanceGigs: Record<string, unknown>[];
  gigProposals: Record<string, unknown>[];
  coupons: Record<string, unknown>[];
  couponRedemptions: Record<string, unknown>[];
  aiInterviews: Record<string, unknown>[];
  scheduledInterviews: Record<string, unknown>[];
  notifications: Record<string, unknown>[];
  platformSettings: Record<string, unknown>[];
  enterpriseStore: Record<string, unknown>[];
  questionBank: Record<string, unknown>[];
}

export interface SuperAdminSnapshot {
  syncedAt: string;
  liveDbConnected: boolean;
  adminSession: AdminSessionStatus;
  liveProfilesCount: number;
  liveEmployersCount: number;
  liveJobsCount: number;
  liveApplicationsCount: number;
  liveTransactionsCount: number;
  liveWalletsCount: number;
  liveAssessmentsCount: number;
  liveTicketsCount: number;
  candidates: SuperAdminCandidate[];
  employers: SuperAdminEmployer[];
  jobs: SuperAdminJob[];
  applications: SuperAdminApplication[];
  assessments: SuperAdminAssessmentAttempt[];
  transactions: SuperAdminTransaction[];
  wallets: SuperAdminWalletAccount[];
  tickets: SuperAdminTicket[];
  auditLogs: SuperAdminAuditEntry[];
  learningEvents: SuperAdminLearningRecord[];
  tableHealth: TableHealthSummary[];
  featureFlags: PlatformFeatureFlag[];
  liveEnterpriseRaw: LiveEnterpriseRawData;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DEFAULT_FLAGS: PlatformFeatureFlag[] = [
  {
    key: "auto_job_moderation",
    label: "AI Job Fraud & Duplicate Gate",
    description: "Hold suspicious or duplicate job postings in pending_review before public listing.",
    enabled: true,
    category: "Moderation",
  },
  {
    key: "proctoring_30_layer_strict",
    label: "30-Layer Strict Proctoring Enforcement",
    description: "Auto-flag CIR attempts with multi-monitor, tab-blur > 2, or voice anomaly detections.",
    enabled: true,
    category: "AI & Proctoring",
  },
  {
    key: "employer_gstin_cin_gate",
    label: "Mandatory CIN / GSTIN Check Before Job Publish",
    description: "Require verified corporate identity before an employer can publish live roles.",
    enabled: true,
    category: "Security",
  },
  {
    key: "linda_ai_interviewer",
    label: "Linda Autonomous AI Video Interviewer",
    description: "Allow employers & candidates to launch structured AI video interview rounds.",
    enabled: true,
    category: "AI & Proctoring",
  },
  {
    key: "instant_wallet_refunds",
    label: "Instant SLA Breach Wallet Credit",
    description: "Automatically credit recruiter/candidate wallets when 24h review SLA expires.",
    enabled: true,
    category: "Billing",
  },
  {
    key: "public_portfolio_indexing",
    label: "Public Candidate & Company SEO Indexing",
    description: "Serve public /u/:slug and /company/:slug profiles with verifiable CIR badges.",
    enabled: true,
    category: "Security",
  },
];

interface SafeQueryResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  ok: boolean;
}

async function safeSelect(
  table: string,
  opts?: { orderBy?: string; limit?: number }
): Promise<SafeQueryResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    let query = client.from(table).select("*");
    if (opts?.orderBy && typeof query?.order === "function") {
      query = query.order(opts.orderBy, { ascending: false });
    }
    if (opts?.limit && typeof query?.limit === "function") {
      query = query.limit(opts.limit);
    }
    const res = await query;
    if (res?.error) return { rows: [], ok: false };
    return { rows: Array.isArray(res?.data) ? res.data : [], ok: true };
  } catch {
    return { rows: [], ok: false };
  }
}

export async function fetchSuperAdminSnapshot(): Promise<SuperAdminSnapshot> {
  const [
    adminSession,
    profilesQ,
    skillsQ,
    certsQ,
    edusQ,
    expsQ,
    projsQ,
    kycQ,
    employersQ,
    tenantsQ,
    membershipsQ,
    jobsQ,
    applicationsQ,
    stageHistoryQ,
    catalogQ,
    questionBankQ,
    attemptsQ,
    cirReportsQ,
    credentialsQ,
    proctorEventsQ,
    paymentOrdersQ,
    employerSubsQ,
    servicePurchasesQ,
    walletsQ,
    ledgerQ,
    lmsCoursesQ,
    courseEnrollmentsQ,
    mentorsQ,
    mentorBookingsQ,
    hackathonsQ,
    hackathonRegsQ,
    hackathonSubsQ,
    eventRegsQ,
    freelanceGigsQ,
    gigProposalsQ,
    ticketsQ,
    ticketMsgsQ,
    auditLogQ,
    settingsQ,
    couponsQ,
    couponRedemptionsQ,
    aiInterviewsQ,
    scheduledInterviewsQ,
    notificationsQ,
    enterpriseStoreQ,
  ] = await Promise.all([
    checkAdminSession(),
    safeSelect("profiles", { orderBy: "created_at", limit: 300 }),
    safeSelect("skills", { limit: 1000 }),
    safeSelect("certifications", { limit: 500 }),
    safeSelect("educations", { limit: 500 }),
    safeSelect("experiences", { limit: 500 }),
    safeSelect("projects", { limit: 500 }),
    safeSelect("identity_verifications", { limit: 300 }),
    safeSelect("employers", { orderBy: "created_at", limit: 300 }),
    safeSelect("tenant_organizations", { orderBy: "created_at", limit: 300 }),
    safeSelect("tenant_memberships", { limit: 500 }),
    safeSelect("employer_job_openings", { orderBy: "created_at", limit: 300 }),
    safeSelect("job_applications", { orderBy: "applied_at", limit: 500 }),
    safeSelect("application_stage_history", { orderBy: "created_at", limit: 1000 }),
    safeSelect("assessments_catalog", { limit: 200 }),
    safeSelect("question_bank", { orderBy: "created_at", limit: 200 }),
    safeSelect("assessment_attempts", { orderBy: "started_at", limit: 500 }),
    safeSelect("cir_reports", { orderBy: "generated_at", limit: 300 }),
    safeSelect("verifiable_credentials", { orderBy: "issued_at", limit: 300 }),
    safeSelect("proctoring_events", { orderBy: "created_at", limit: 1000 }),
    safeSelect("payment_orders", { orderBy: "created_at", limit: 500 }),
    safeSelect("employer_subscriptions", { orderBy: "created_at", limit: 300 }),
    safeSelect("service_purchases", { orderBy: "created_at", limit: 300 }),
    safeSelect("wallet_accounts", { limit: 300 }),
    safeSelect("wallet_ledger_entries", { orderBy: "created_at", limit: 1000 }),
    safeSelect("lms_courses", { orderBy: "created_at", limit: 200 }),
    safeSelect("course_enrollments", { orderBy: "enrolled_at", limit: 500 }),
    safeSelect("mentor_profiles", { orderBy: "created_at", limit: 200 }),
    safeSelect("mentor_bookings", { orderBy: "created_at", limit: 500 }),
    safeSelect("hackathons", { orderBy: "starts_at", limit: 200 }),
    safeSelect("hackathon_registrations", { orderBy: "registered_at", limit: 500 }),
    safeSelect("hackathon_submissions", { orderBy: "submitted_at", limit: 500 }),
    safeSelect("event_registrations", { orderBy: "created_at", limit: 500 }),
    safeSelect("freelance_gigs", { orderBy: "created_at", limit: 200 }),
    safeSelect("gig_proposals", { orderBy: "created_at", limit: 500 }),
    safeSelect("support_tickets", { orderBy: "created_at", limit: 300 }),
    safeSelect("support_messages", { orderBy: "created_at", limit: 1000 }),
    safeSelect("audit_log", { orderBy: "at", limit: 300 }),
    safeSelect("platform_settings", { limit: 100 }),
    safeSelect("coupons", { orderBy: "created_at", limit: 200 }),
    safeSelect("coupon_redemptions", { orderBy: "created_at", limit: 500 }),
    safeSelect("ai_interview_sessions", { orderBy: "created_at", limit: 300 }),
    safeSelect("scheduled_interviews", { orderBy: "scheduled_at", limit: 300 }),
    safeSelect("notifications", { orderBy: "created_at", limit: 300 }),
    safeSelect("admin_enterprise_store", { limit: 100 }),
  ]);

  const liveProfiles = profilesQ.rows;
  const liveSkills = skillsQ.rows;
  const liveCerts = certsQ.rows;
  const liveEdus = edusQ.rows;
  const liveExps = expsQ.rows;
  const liveProjs = projsQ.rows;
  const liveKycs = kycQ.rows;
  const liveEmployers = employersQ.rows;
  const liveTenants = tenantsQ.rows;
  const liveMemberships = membershipsQ.rows;
  const liveJobs = jobsQ.rows;
  const liveApplications = applicationsQ.rows;
  const liveStageHistory = stageHistoryQ.rows;
  const liveCatalog = catalogQ.rows;
  const liveQuestionBank = questionBankQ.rows;
  const liveAttempts = attemptsQ.rows;
  const liveCirReports = cirReportsQ.rows;
  const liveCredentials = credentialsQ.rows;
  const liveProctorEvents = proctorEventsQ.rows;
  const livePaymentOrders = paymentOrdersQ.rows;
  const liveEmployerSubs = employerSubsQ.rows;
  const liveServicePurchases = servicePurchasesQ.rows;
  const liveWallets = walletsQ.rows;
  const liveLedger = ledgerQ.rows;
  const liveLmsCourses = lmsCoursesQ.rows;
  const liveCourseEnrollments = courseEnrollmentsQ.rows;
  const liveMentors = mentorsQ.rows;
  const liveMentorBookings = mentorBookingsQ.rows;
  const liveHackathons = hackathonsQ.rows;
  const liveHackathonRegs = hackathonRegsQ.rows;
  const liveHackathonSubs = hackathonSubsQ.rows;
  const liveEventRegs = eventRegsQ.rows;
  const liveFreelanceGigs = freelanceGigsQ.rows;
  const liveGigProposals = gigProposalsQ.rows;
  const liveTickets = ticketsQ.rows;
  const liveTicketMsgs = ticketMsgsQ.rows;
  const liveAuditLogs = auditLogQ.rows;
  const liveSettings = settingsQ.rows;
  const liveCoupons = couponsQ.rows;
  const liveCouponRedemptions = couponRedemptionsQ.rows;
  const liveAiInterviews = aiInterviewsQ.rows;
  const liveScheduledInterviews = scheduledInterviewsQ.rows;
  const liveNotifications = notificationsQ.rows;
  const liveEnterpriseStore = enterpriseStoreQ.rows;

  const liveDbConnected = profilesQ.ok || employersQ.ok || jobsQ.ok || catalogQ.ok;

  const employerUserIds = new Set(liveEmployers.map((e) => e.user_id).filter(Boolean));
  const profileById = new Map(liveProfiles.map((p) => [p.id || p.user_id, p]));
  const employerById = new Map(liveEmployers.map((e) => [e.id, e]));
  const employerByUserId = new Map(liveEmployers.map((e) => [e.user_id, e]));
  const employerByTenantId = new Map(liveEmployers.filter((e) => e.tenant_id).map((e) => [e.tenant_id, e]));
  const tenantById = new Map(liveTenants.map((t) => [t.id, t]));
  const jobById = new Map(liveJobs.map((j) => [j.id, j]));
  const catalogById = new Map(liveCatalog.map((c) => [c.id, c]));
  const courseById = new Map(liveLmsCourses.map((c) => [c.id, c]));
  const hackathonById = new Map(liveHackathons.map((h) => [h.id, h]));

  // 1. Live Candidates (100% from public.profiles + relational tables)
  const candidates: SuperAdminCandidate[] = liveProfiles
    .filter((p) => !employerUserIds.has(p.id || p.user_id))
    .map((p, idx) => {
      const uid = p.id || p.user_id;
      const pSkills = liveSkills
        .filter((s) => s.user_id === uid)
        .map((s) => s.skill_name)
        .filter(Boolean);
      const pCerts = liveCerts
        .filter((c) => c.user_id === uid)
        .map((c) => c.name || c.title)
        .filter(Boolean);
      const pEdus = liveEdus
        .filter((e) => e.user_id === uid)
        .map((e) => ({
          institution: e.institution_name || e.institution || "University",
          degree: [e.degree, e.field_of_study].filter(Boolean).join(" · ") || "Degree",
          year: String(e.end_year || e.start_year || "—"),
        }));
      const pExps = liveExps
        .filter((x) => x.user_id === uid)
        .map((x) => ({
          company: x.company_name || x.company || "Organization",
          role: x.job_title || "Member",
          duration:
            [x.start_date, x.is_current ? "Present" : x.end_date].filter(Boolean).join(" – ") ||
            "Active",
          summary: x.description || undefined,
        }));
      const pProjs = liveProjs
        .filter((pr) => pr.user_id === uid)
        .map((pr) => ({
          title: pr.title || "Project",
          stack: Array.isArray(pr.tools_technologies)
            ? pr.tools_technologies.join(", ")
            : Array.isArray(pr.technologies)
              ? pr.technologies.join(", ")
              : undefined,
          link: pr.project_url || pr.github_url || undefined,
          metrics: pr.impact || undefined,
        }));

      const kyc = liveKycs.find((k) => k.user_id === uid);
      const userWallet = liveWallets.find((w) => w.owner_type === "candidate" && w.user_id === uid);
      const userApps = liveApplications.filter((a) => a.candidate_id === uid);
      const userAttempts = liveAttempts.filter((a) => a.user_id === uid);
      const userCirs = liveCirReports.filter((r) => r.user_id === uid);
      const latestCir = userCirs[0];
      const userEnrollments = liveCourseEnrollments.filter((e) => e.user_id === uid);
      const userMentorBookings = liveMentorBookings.filter((b) => b.user_id === uid);
      const userAiMocks = liveAiInterviews.filter((i) => i.user_id === uid);
      const userHackRegs = liveHackathonRegs.filter((r) => r.user_id === uid && r.status !== "withdrawn");
      const userEventRegs = liveEventRegs.filter((r) => r.user_id === uid);
      const userOrders = livePaymentOrders.filter(
        (o) => o.user_id === uid && (o.status === "captured" || o.status === "entitled")
      );
      const userServices = liveServicePurchases.filter((s) => s.user_id === uid);
      const userGigs = liveGigProposals.filter((g) => g.user_id === uid);

      const fullName = p.full_name || p.email?.split("@")[0] || `Candidate ${idx + 1}`;
      const expYrs = Number(p.years_of_experience ?? p.total_experience_years ?? 0);
      const missingCand: string[] = [];
      if (!p.resume_url && !p.resume_path) missingCand.push("Resume PDF");
      if (!p.phone) missingCand.push("Mobile OTP");
      if (!pExps.length && expYrs > 0) missingCand.push("Work Experience");
      if (!pEdus.length) missingCand.push("Education");
      const calcCompletion = Number(
        p.profile_completion ?? Math.max(25, 100 - missingCand.length * 18)
      );

      const inferredIndustry =
        p.industry ||
        (pSkills.some((s: string) => /seo|marketing|ads|social/i.test(s))
          ? "Digital Marketing & Growth"
          : pSkills.some((s: string) => /sql|python|power bi|tableau|data/i.test(s))
            ? "Data & AI"
            : pSkills.some((s: string) => /aws|docker|kubernetes|cloud/i.test(s))
              ? "Cloud & DevOps"
              : "Software & SaaS");

      const domainAssessmentsTaken = Array.from(
        new Set(
          userAttempts
            .map((a) => catalogById.get(a.assessment_id)?.domain || catalogById.get(a.assessment_id)?.title)
            .filter(Boolean) as string[]
        )
      );
      const gradedAttempts = userAttempts.filter((a) => a.status === "graded" || a.status === "submitted");
      const uniqueAssessmentIds = new Set(userAttempts.map((a) => a.assessment_id));
      const retestCount = Math.max(0, userAttempts.length - uniqueAssessmentIds.size);

      const isPremium = userOrders.length > 0 || userServices.length > 0;
      const salaryDigits = String(p.preferred_salary_range || "").match(/\d+/);
      const noticeDigits = String(p.notice_period || "").match(/\d+/);
      const cirScore = Math.round(
        Number(latestCir?.composite_score ?? p.industry_readiness_score ?? 0)
      );

      const availabilityStatus: SuperAdminCandidate["availabilityStatus"] = p.is_suspended
        ? "Suspended"
        : String(p.availability_status || "").toLowerCase() === "placed"
          ? "Placed"
          : p.open_to_work === false
            ? "Open to offers"
            : "Actively looking";

      return {
        id: uid,
        talentCirId: p.iam_talento_id || p.talenta_id || `IAT-LIVE-${String(1040 + idx)}`,
        origin: "live_db",
        archived: Boolean(p.is_archived),
        fullName,
        slug: p.portfolio_slug || p.public_slug || slugify(fullName),
        email: p.email || "—",
        phone: p.phone || "—",
        headline:
          p.professional_headline ||
          p.headline ||
          p.job_role ||
          "Registered Candidate",
        industry: inferredIndustry,
        accountTier: isPremium ? "premium" : "normal",
        premiumPlanName: isPremium ? "TalentCIR Paid Member" : undefined,
        city: p.city || p.location || "India",
        country: p.country || "India",
        experienceYears: expYrs,
        experienceLevel: p.experience_level || (expYrs >= 3 ? "Experienced" : "Fresher"),
        expectedSalaryLpa: salaryDigits ? Number(salaryDigits[0]) : Number(p.expected_ctc || 0),
        noticePeriodDays: noticeDigits ? Number(noticeDigits[0]) : Number(p.notice_period_days || 30),
        workPreference:
          Array.isArray(p.preferred_locations) && p.preferred_locations.length
            ? p.preferred_locations.slice(0, 2).join(" / ")
            : p.preferred_work_mode || "Hybrid / Remote",
        availabilityStatus,
        freelancerStatus: p.open_for_freelance
          ? "Actively Freelancing"
          : p.employment_type === "freelance"
            ? "Open to Freelance"
            : "Full-Time Only",
        freelanceHourlyInr: p.open_for_freelance ? 1500 : 0,
        freelanceGigsCompleted: userGigs.filter((g) => g.status === "accepted").length,
        kycStatus:
          kyc?.verification_status === "verified" || p.verification_status === "verified"
            ? "verified"
            : kyc?.verification_status === "rejected"
              ? "rejected"
              : kyc?.verification_status === "pending" || p.verification_status === "pending"
                ? "pending"
                : "unsubmitted",
        emailVerified: Boolean(p.email_verified_at || p.email),
        phoneVerified: Boolean(p.phone),
        mfaEnabled: false,
        cirScore,
        percentile: Math.round(Number(latestCir?.percentile ?? 0)),
        profileCompletion: calcCompletion,
        missingProfileFields: missingCand,
        walletBalance: Number(userWallet?.balance ?? 0),
        profileViews: Number(p.profile_views ?? 0),
        applicationsCount: userApps.length,
        assessmentsPassed: gradedAttempts.filter((a) => Number(a.percentage ?? 0) >= 40).length,
        totalTestAttempts: userAttempts.length,
        retestCount,
        scoreImprovementDelta: 0,
        domainsChosen: domainAssessmentsTaken,
        coursesEnrolled: userEnrollments.map(
          (en) => courseById.get(en.course_id)?.title || "LMS Course"
        ),
        coursesCompleted: userEnrollments.filter((en) => en.status === "completed").length,
        mentorSessionsBooked: userMentorBookings.length,
        mockInterviewsCount: userAiMocks.length,
        hackathonParticipated: userHackRegs.length > 0,
        hackathonsList: userHackRegs.map(
          (r) => hackathonById.get(r.hackathon_id)?.title || "TalentCIR Hackathon"
        ),
        networkingRegistered: userEventRegs.some(
          (r) => r.event_kind === "networking" || r.event_kind === "meetup"
        ),
        networkingEventsList: userEventRegs.map((r) => `${r.event_ref}${r.city ? ` (${r.city})` : ""}`),
        hasResume: Boolean(p.resume_url || p.resume_path),
        hasVideoResume: Boolean(p.video_intro_url || p.video_pitch),
        avatarUrl: p.profile_photo_url || p.avatar_url || getCandidatePhoto(fullName),
        resumeUrl: p.resume_url || undefined,
        linkedinUrl: p.linkedin_url || undefined,
        githubUrl: p.github_url || undefined,
        portfolioUrl: p.portfolio_url || undefined,
        skills: pSkills,
        certifications: pCerts,
        educations: pEdus,
        experiences: pExps,
        projects: pProjs,
        assessmentScores: Object.fromEntries(
          gradedAttempts.map((a) => [
            catalogById.get(a.assessment_id)?.title || "Assessment",
            Math.round(Number(a.percentage ?? 0)),
          ])
        ),
        createdAt: p.created_at || new Date().toISOString(),
        lastActiveAt: p.updated_at || p.created_at || new Date().toISOString(),
        raw: p,
      };
    });

  // 2. Live Employers (100% from public.employers + tenants + subscriptions + wallets)
  const employers: SuperAdminEmployer[] = liveEmployers.map((emp, idx) => {
    const tenant = emp.tenant_id ? tenantById.get(emp.tenant_id) : undefined;
    const empSub = liveEmployerSubs.find(
      (s) => s.tenant_id && s.tenant_id === emp.tenant_id && s.status === "active"
    );
    const empWallet = liveWallets.find(
      (w) => w.owner_type === "tenant" && w.tenant_id && w.tenant_id === emp.tenant_id
    );
    const empMembers = liveMemberships.filter(
      (m) => m.tenant_id && m.tenant_id === emp.tenant_id
    );
    const empJobs = liveJobs.filter(
      (j) => j.employer_id === emp.id || (emp.tenant_id && j.tenant_id === emp.tenant_id)
    );
    const empJobIds = new Set(empJobs.map((j) => j.id));
    const empApps = liveApplications.filter(
      (a) => empJobIds.has(a.job_id) || (emp.tenant_id && a.tenant_id === emp.tenant_id)
    );

    const missingEmp: string[] = [];
    if (!emp.website) missingEmp.push("Official Website");
    if (!emp.description) missingEmp.push("Company Description");
    if (!emp.logo_url) missingEmp.push("Company Logo");
    if (!emp.phone_verified && !emp.phone) missingEmp.push("Phone OTP Verification");
    if (!emp.industry) missingEmp.push("Industry Classification");
    const gstinVal = emp.gstin || emp.gst_number || tenant?.gstin || "";
    const cinVal = emp.cin_number || emp.cin || "";
    const panVal = emp.pan_number || emp.pan || "";
    if (!gstinVal) missingEmp.push("GSTIN / Corporate Tax ID");
    const empCompletion = Number(
      emp.profile_completion ?? Math.max(25, 100 - missingEmp.length * 14)
    );

    const planKey = String(empSub?.plan || tenant?.plan || "free").toLowerCase();
    const subscriptionPlan: SuperAdminEmployer["subscriptionPlan"] =
      planKey === "enterprise"
        ? "Enterprise Annual"
        : planKey === "growth"
          ? "Growth Pro"
          : "Free Trial";
    const mrrInr =
      subscriptionPlan === "Enterprise Annual"
        ? 49999
        : subscriptionPlan === "Growth Pro"
          ? 19999
          : 0;

    return {
      id: emp.id,
      employerCode: emp.employer_id || `IAT-EMP-${300100 + idx}`,
      origin: "live_db",
      archived: Boolean(emp.is_archived),
      accountTier: subscriptionPlan === "Free Trial" ? "normal" : "premium",
      companyName: emp.company_name || tenant?.name || "Registered Employer",
      slug: emp.slug || tenant?.slug || slugify(emp.company_name || `company-${idx + 1}`),
      industry: emp.industry || "Software & SaaS",
      category: emp.company_category || emp.company_type || "Corporate",
      companyType: emp.company_type || "Private Limited",
      size: emp.num_employees || "11-50",
      hq: emp.hq_city || emp.address || "India",
      address: emp.address || emp.hq_city || "India",
      website: emp.website || "—",
      establishedYear: Number(emp.established_year || new Date().getFullYear()),
      contactName: emp.contact_name || "Hiring Lead",
      officialEmail: emp.official_email || "—",
      phone: emp.phone || "—",
      verificationStatus:
        emp.verification_status || (emp.email_verified ? "verified" : "pending"),
      gstin: gstinVal || "—",
      cin: cinVal || "—",
      pan: panVal ? (panVal.length > 12 ? "Encrypted PAN" : panVal) : "—",
      gstinVerified: Boolean(emp.verification_status === "verified" && gstinVal),
      profileCompletion: empCompletion,
      missingProfileFields: missingEmp,
      subscriptionPlan,
      mrrInr,
      walletBalance: Number(empWallet?.balance ?? 0),
      talentUnlocksRemaining: Number(empSub?.cir_unlocks ?? 0),
      teamMembersCount: Math.max(1, empMembers.length),
      activeJobsCount: empJobs.filter((j) => j.status === "active").length,
      totalApplications: empApps.length,
      totalHires: empApps.filter(
        (a) => String(a.stage).toLowerCase() === "offer" || String(a.stage).toLowerCase() === "hired"
      ).length,
      logoUrl: emp.logo_url || undefined,
      benefits: Array.isArray(emp.benefits) ? emp.benefits : [],
      createdAt: emp.created_at || new Date().toISOString(),
      lastActiveAt: emp.updated_at || emp.created_at || new Date().toISOString(),
      raw: emp,
    };
  });

  // 3. Live Jobs (100% from public.employer_job_openings)
  const jobs: SuperAdminJob[] = liveJobs.map((j, idx) => {
    const ownerEmp =
      (j.employer_id ? employerById.get(j.employer_id) : undefined) ||
      (j.tenant_id ? employerByTenantId.get(j.tenant_id) : undefined);
    const jobApps = liveApplications.filter((a) => a.job_id === j.id);
    const views = Number(j.views_count || 0);
    const promoTier: SuperAdminJob["promotionTier"] =
      j.is_sponsored || j.promotion_tier === "sponsored"
        ? "sponsored"
        : j.is_featured || j.promotion_tier === "featured"
          ? "featured"
          : "none";

    return {
      id: j.id,
      jobCode: `JOB-${2100 + idx}`,
      origin: "live_db",
      title: j.designation || "Open Role",
      companyName: j.company_name || ownerEmp?.company_name || "TalentCIR Employer",
      employerCode: ownerEmp?.employer_id || "IAT-EMP-LIVE",
      department: j.department || j.job_function || "Engineering",
      industry: j.industry || ownerEmp?.industry || "Technology",
      location: j.city || j.job_location || "India",
      workMode: (j.work_mode as SuperAdminJob["workMode"]) || "Hybrid",
      employmentType: j.job_type || j.employment_type || "Full-time",
      minExpYears: Number(j.experience_min ?? (parseInt(String(j.experience_years || "0"), 10) || 0)),
      salaryMinLpa: Number(j.salary_min || 0),
      salaryMaxLpa: Number(j.salary_max || 0),
      openingsCount: Number(j.num_openings || 1),
      status:
        (j.status === "scheduled"
          ? "pending_review"
          : (j.status as SuperAdminJob["status"])) || "active",
      promotionTier: promoTier,
      skills:
        Array.isArray(j.skills) && j.skills.length
          ? j.skills
          : Array.isArray(j.required_skills)
            ? j.required_skills
            : [],
      views,
      applicationsCount: jobApps.length,
      shortlistedCount: jobApps.filter((a) =>
        ["Shortlisted", "Interview", "Offer"].includes(String(a.stage))
      ).length,
      hiredCount: jobApps.filter((a) => String(a.stage) === "Offer").length,
      conversionRate: views > 0 ? Number(((jobApps.length / views) * 100).toFixed(1)) : 0,
      description: j.job_description || "",
      closesAt: j.closes_at ? String(j.closes_at).slice(0, 10) : "—",
      createdAt: j.created_at || new Date().toISOString(),
      raw: j,
    };
  });

  // 4. Live Applications (100% from public.job_applications + application_stage_history)
  const applications: SuperAdminApplication[] = liveApplications.map((a, idx) => {
    const cand = profileById.get(a.candidate_id);
    const job = jobById.get(a.job_id);
    const emp =
      (a.tenant_id ? employerByTenantId.get(a.tenant_id) : undefined) ||
      (job?.employer_id ? employerById.get(job.employer_id) : undefined);
    const appHist = liveStageHistory
      .filter((h) => h.application_id === a.id)
      .map((h) => ({
        stage: h.to_stage || a.stage,
        note: h.message || `Moved from ${h.from_stage || "New"} to ${h.to_stage}`,
        at: h.created_at || a.updated_at || a.applied_at,
      }));
    const candSkills = liveSkills
      .filter((s) => s.user_id === a.candidate_id)
      .map((s) => s.skill_name);
    const cir = Math.round(Number(cand?.industry_readiness_score ?? 0));

    return {
      id: a.id,
      appCode: `APP-${5000 + idx}`,
      candidateName: cand?.full_name || cand?.email?.split("@")[0] || "Candidate",
      candidateId: cand?.iam_talento_id || String(a.candidate_id).slice(0, 8),
      candidateEmail: cand?.email || "—",
      jobTitle: job?.designation || "Open Role",
      jobId: job?.id ? `JOB-${String(job.id).slice(0, 8)}` : String(a.job_id).slice(0, 8),
      companyName: job?.company_name || emp?.company_name || "TalentCIR Employer",
      stage: a.stage || "Applied",
      matchScore: Math.round(Number(a.match_score ?? 0)),
      cirScore: cir,
      experienceYears: Number(cand?.years_of_experience ?? 0),
      expectedCtcLpa: Number(String(cand?.preferred_salary_range || "").match(/\d+/)?.[0] || 0),
      noticeDays: Number(String(cand?.notice_period || "").match(/\d+/)?.[0] || 30),
      assignedRecruiter: emp?.contact_name || "Employer TA Team",
      slaStatus: a.stage === "Applied" && !a.viewed_at ? "Action Needed" : "Within SLA",
      interviewScheduled: a.interview_at ? new Date(a.interview_at).toLocaleString() : undefined,
      bgvStatus: a.stage === "Offer" ? "In Progress" : "Not Started",
      recruiterNote: a.recruiter_note || undefined,
      coverNote: a.cover_note || undefined,
      skills: candSkills,
      appliedAt: a.applied_at || new Date().toISOString(),
      updatedAt: a.updated_at || a.applied_at || new Date().toISOString(),
      history: appHist.length
        ? appHist
        : [{ stage: a.stage || "Applied", note: "Application submitted", at: a.applied_at || new Date().toISOString() }],
    };
  });

  // 5. Live Assessments, CIR Credentials & 30-Layer Proctoring Sessions
  const assessments: SuperAdminAssessmentAttempt[] = liveAttempts.map((att, idx) => {
    const cand = profileById.get(att.user_id);
    const cat = catalogById.get(att.assessment_id);
    const cir = liveCirReports.find((r) => r.journey_id && r.journey_id === att.journey_id);
    const cred = cir ? liveCredentials.find((vc) => vc.cir_report_id === cir.id) : undefined;
    const events = liveProctorEvents.filter((e) => e.attempt_id === att.id);
    const trustScore = Math.round(Number(att.integrity_score ?? 100));
    const pct = Math.round(Number(att.percentage ?? cir?.composite_score ?? 0));
    const isFlagged = Boolean(att.needs_manual_review) || trustScore < 80;
    const status: SuperAdminAssessmentAttempt["status"] =
      att.status === "invalidated"
        ? "Failed"
        : isFlagged
          ? "Flagged"
          : att.status === "graded"
            ? "Issued"
            : "In Review";

    return {
      id: att.id,
      attemptCode: `ATT-${6000 + idx}`,
      credentialToken: cred?.token
        ? `TCIR-${String(cred.token).slice(0, 10).toUpperCase()}`
        : `PENDING-${String(att.id).slice(0, 6).toUpperCase()}`,
      candidateName: cand?.full_name || cand?.email?.split("@")[0] || "Candidate",
      candidateEmail: cand?.email || "—",
      assessmentTitle: cat?.title || "Proctored CIR Assessment",
      domainTrack: cat?.domain || cat?.industry || "Core Readiness",
      coreAptitudeScore: Math.round(Number(cir?.sections?.core ?? pct)),
      coreCommunicationScore: Math.round(Number(cir?.sections?.communication ?? pct)),
      domainTechnicalScore: Math.round(Number(cir?.sections?.domain ?? pct)),
      codingScore: Math.round(Number(cir?.sections?.coding ?? pct)),
      aiInterviewScore: Math.round(Number(cir?.sections?.interview ?? pct)),
      overallCirScore: Math.round(Number(cir?.composite_score ?? pct)),
      percentile: Math.round(Number(cir?.percentile ?? Math.min(99, pct))),
      status,
      proctorTrustScore: trustScore,
      proctorFlagsCount: events.length,
      proctorSummary: events.length
        ? `${events.length} proctoring signal(s) recorded across 30-layer engine (integrity ${trustScore}%).`
        : "All 30 AI proctoring layers clean with zero tamper signals.",
      layersTriggered: events.length
        ? events.slice(0, 5).map((e) => `L${String(e.layer_id).padStart(2, "0")}: ${e.signal_code} (${e.severity})`)
        : ["All 30 Layers Passed Clean"],
      durationMinutes: Number(cat?.duration_minutes ?? 30),
      browserDevice: "Live Proctored Session",
      ipRegion: cand?.city ? `${cand.city}, IN` : "India",
      completedAt: att.submitted_at || att.graded_at || att.started_at || new Date().toISOString(),
    };
  });

  // 6. Live Payment Orders & Service Purchases
  const mapOrderCategory = (
    itemType: string,
    status: string,
    itemRef?: string | null
  ): SuperAdminTransaction["category"] => {
    const it = String(itemType || "").toLowerCase();
    if (status === "refunded") return "Refund";
    if (it === "assessment_journey" || it.includes("assess") || it.includes("cir")) return "Assessment Fee";
    if (it === "course" || it === "mentor_session" || it.includes("learn") || it.includes("mentor")) {
      return "Learning & Mentorship";
    }
    if (it.includes("network") || it.includes("mixer") || it.includes("roundtable")) {
      return "Networking";
    }
    if (it === "hackathon_ticket" || it.includes("hackathon") || it.includes("event")) {
      return /network|mixer|meetup|roundtable/i.test(String(itemRef || "")) ? "Networking" : "Hackathon";
    }
    if (it === "wallet_topup" || it.includes("wallet")) return "Wallet Top-up";
    if (it === "subscription" || it.includes("sub")) return "SaaS Subscription";
    if (it === "job_spotlight" || it.includes("promot")) return "Job Promotion";
    if (it === "recruiter_pack" || it.includes("talent")) return "Talent Package";
    return "Learning & Mentorship";
  };

  const transactions: SuperAdminTransaction[] = [
    ...livePaymentOrders.map((ord, idx): SuperAdminTransaction => {
      const emp =
        (ord.tenant_id ? employerByTenantId.get(ord.tenant_id) : undefined) ||
        (ord.employer_id ? employerById.get(String(ord.employer_id)) : undefined) ||
        employerByUserId.get(ord.user_id);
      const prof = profileById.get(ord.user_id);
      const isEmployer = Boolean(ord.tenant_id || ord.employer_id || emp);
      const gst = Number(ord.cgst || 0) + Number(ord.sgst || 0) + Number(ord.igst || 0);
      const net = Number(ord.total_amount || 0);
      const base = Number(ord.taxable_amount || ord.base_amount || Math.max(0, net - gst));
      const txStatus: SuperAdminTransaction["status"] =
        ord.status === "entitled" || ord.status === "captured"
          ? "captured"
          : ord.status === "refunded"
            ? "refunded"
            : ord.status === "failed" || ord.status === "cancelled"
              ? "failed"
              : "pending";
      return {
        id: ord.id,
        orderId: ord.gateway_order_id || `ord_${String(ord.id).slice(0, 10)}`,
        gatewayRef: ord.gateway_payment_id || ord.gateway || "razorpay",
        actorType: isEmployer ? "Employer" : "Candidate",
        actorName: isEmployer
          ? emp?.company_name || prof?.full_name || "Employer Account"
          : prof?.full_name || prof?.email?.split("@")[0] || "Candidate Account",
        actorEmail: (isEmployer ? emp?.official_email : prof?.email) || prof?.email || "—",
        category: mapOrderCategory(ord.item_type, txStatus, ord.item_ref),
        itemTitle: ord.item_ref || String(ord.item_type || "Order").replace(/_/g, " "),
        amountInr: base,
        gstInr: gst,
        netTotalInr: net,
        direction: txStatus === "refunded" ? "refund" : "credit",
        paymentMethod:
          ord.gateway === "wallet"
            ? "TalentCIR Wallet"
            : ord.gateway === "free"
              ? "Free / Coupon"
              : "Razorpay Checkout",
        status: txStatus,
        invoiceNumber: ord.invoice_number || `INV-${1000 + idx}`,
        createdAt: ord.created_at || new Date().toISOString(),
      };
    }),
    ...liveServicePurchases.map((sp, idx): SuperAdminTransaction => {
      const emp = employerByUserId.get(sp.user_id);
      const prof = profileById.get(sp.user_id);
      const isEmployer =
        Boolean(emp) || ["recruiter_pack", "job_spotlight", "ai_shortlisting"].includes(sp.service_key);
      const amt = Number(sp.amount || 0);
      return {
        id: sp.id,
        orderId: `svc_${String(sp.id).slice(0, 10)}`,
        gatewayRef: sp.tx_group ? String(sp.tx_group).slice(0, 12) : "wallet_debit",
        actorType: isEmployer ? "Employer" : "Candidate",
        actorName: isEmployer
          ? emp?.company_name || prof?.full_name || "Employer"
          : prof?.full_name || "Candidate",
        actorEmail: (isEmployer ? emp?.official_email : prof?.email) || "—",
        category: mapOrderCategory(sp.service_key, sp.status === "refunded" ? "refunded" : "captured"),
        itemTitle: `Add-on Service · ${String(sp.service_key || "").replace(/_/g, " ")}`,
        amountInr: amt,
        gstInr: 0,
        netTotalInr: amt,
        direction: sp.status === "refunded" ? "refund" : "credit",
        paymentMethod: "TalentCIR Wallet",
        status: sp.status === "refunded" ? "refunded" : "captured",
        invoiceNumber: `SVC-${2000 + idx}`,
        createdAt: sp.created_at || new Date().toISOString(),
      };
    }),
  ];

  // 7. Live Wallets & Ledger
  const wallets: SuperAdminWalletAccount[] = liveWallets
    .filter((w) => w.owner_type !== "platform")
    .map((w, idx) => {
      const isTenant = w.owner_type === "tenant";
      const emp = isTenant && w.tenant_id ? employerByTenantId.get(w.tenant_id) : undefined;
      const prof = !isTenant && w.user_id ? profileById.get(w.user_id) : undefined;
      const entries = liveLedger
        .filter((l) => l.wallet_id === w.id)
        .map((l) => ({
          txId: `TXN-${l.id}`,
          type: (l.entry_type === "debit" ? "debit" : "credit") as "credit" | "debit",
          amountInr: Number(l.amount || 0),
          reason: l.reason || "Ledger transaction",
          via: l.reference_type ? String(l.reference_type).replace(/_/g, " ") : "Wallet",
          at: l.created_at || new Date().toISOString(),
        }));
      const credited = entries
        .filter((e) => e.type === "credit")
        .reduce((s, e) => s + e.amountInr, 0);
      const debited = entries
        .filter((e) => e.type === "debit")
        .reduce((s, e) => s + e.amountInr, 0);
      return {
        id: w.id,
        ownerType: isTenant ? "Employer" : "Candidate",
        ownerName: isTenant
          ? emp?.company_name || `Employer Tenant ${idx + 1}`
          : prof?.full_name || prof?.email?.split("@")[0] || `Candidate ${idx + 1}`,
        ownerEmail: (isTenant ? emp?.official_email : prof?.email) || "—",
        ownerCode: (isTenant ? emp?.employer_id : prof?.iam_talento_id) || `WAL-${100 + idx}`,
        balanceInr: Number(w.balance || 0),
        lifetimeCreditedInr: credited || Number(w.balance || 0),
        lifetimeDebitedInr: debited,
        status: "active",
        updatedAt: entries[0]?.at || w.created_at || new Date().toISOString(),
        ledger: entries,
      };
    });

  // 8. Live Support Tickets
  const mapTicketCategory = (cat: string): SuperAdminTicket["category"] => {
    const c = (cat || "").toLowerCase();
    if (c.includes("bill") || c.includes("gst") || c.includes("pay")) return "Billing & GST";
    if (c.includes("verif") || c.includes("kyc") || c.includes("kyb")) return "Verification / KYC";
    if (c.includes("proctor") || c.includes("assess") || c.includes("exam")) return "Assessment Proctoring";
    if (c.includes("job") || c.includes("ats") || c.includes("app")) return "ATS & Job Posting";
    return "Account Security";
  };

  const tickets: SuperAdminTicket[] = liveTickets.map((t, idx) => {
    const emp =
      (t.tenant_id ? employerByTenantId.get(t.tenant_id) : undefined) ||
      employerByUserId.get(t.user_id);
    const prof = profileById.get(t.user_id);
    const msgs = liveTicketMsgs
      .filter((m) => m.ticket_id === t.id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((m) => ({
        sender: m.is_staff ? "Super Admin" : prof?.full_name || emp?.contact_name || "User",
        role: (m.is_staff ? "admin" : "user") as "user" | "admin",
        body: m.body || "",
        at: m.created_at || t.created_at,
      }));
    const st: SuperAdminTicket["status"] =
      t.status === "resolved" || t.status === "closed"
        ? "resolved"
        : t.status === "pending"
          ? "in_progress"
          : "open";
    return {
      id: t.id,
      ticketCode: `SUP-${4900 + idx}`,
      requesterType: emp ? "Employer" : "Candidate",
      requesterName: emp?.company_name || prof?.full_name || "Platform User",
      requesterEmail: emp?.official_email || prof?.email || "—",
      category: mapTicketCategory(t.category),
      subject: t.subject || "Support request",
      priority: (t.priority as SuperAdminTicket["priority"]) || "normal",
      status: st,
      assignedAdmin: "Super Admin",
      slaDueIn: st === "resolved" ? "Resolved" : "4h SLA",
      createdAt: t.created_at || new Date().toISOString(),
      messages: msgs.length
        ? msgs
        : [{ sender: prof?.full_name || "User", role: "user", body: t.subject || "Ticket created.", at: t.created_at || new Date().toISOString() }],
    };
  });

  // 9. Live Learning, Hackathons & Mentors
  const learningEvents: SuperAdminLearningRecord[] = [
    ...liveLmsCourses.map((c, idx): SuperAdminLearningRecord => {
      const enrolls = liveCourseEnrollments.filter((e) => e.course_id === c.id);
      const completed = enrolls.filter((e) => e.status === "completed").length;
      const participants = Math.max(Number(c.learners_count || 0), enrolls.length);
      const price = Number(c.price_inr || 0);
      return {
        id: c.id,
        kind: "LMS Course",
        code: `CRS-${101 + idx}`,
        title: c.title || "LMS Course",
        organizerOrInstructor: c.instructor_name || "TalentCIR Faculty",
        category: c.category || "Upskilling",
        participantsCount: participants,
        completionOrSubmissionRate: enrolls.length ? Math.round((completed / enrolls.length) * 100) : 0,
        priceInr: price,
        revenueGeneratedInr: enrolls.length * price,
        status: c.is_published ? "Active" : "Completed",
        scheduleLabel: `${c.level || "Self-paced"}${c.duration_hours ? ` · ${c.duration_hours}h` : ""}`,
      };
    }),
    ...liveHackathons.map((h, idx): SuperAdminLearningRecord => {
      const regs = liveHackathonRegs.filter((r) => r.hackathon_id === h.id && r.status !== "withdrawn");
      const subs = liveHackathonSubs.filter((s) => s.hackathon_id === h.id);
      return {
        id: h.id,
        kind: "Hackathon",
        code: `HACK-${201 + idx}`,
        title: h.title || "TalentCIR Hackathon",
        organizerOrInstructor: h.industry || "TalentCIR",
        category: h.industry || "Innovation",
        participantsCount: regs.length,
        completionOrSubmissionRate: regs.length ? Math.round((subs.length / regs.length) * 100) : 0,
        priceInr: Number(h.entry_fee_inr || 0),
        revenueGeneratedInr: regs.length * Number(h.entry_fee_inr || 0),
        status: h.status === "completed" ? "Completed" : h.status === "live" || h.status === "open" ? "Active" : "Upcoming",
        scheduleLabel: `${h.city || "Hybrid"} · ${h.starts_at ? new Date(h.starts_at).toLocaleDateString() : "Scheduled"}`,
      };
    }),
    ...liveMentors.map((m, idx): SuperAdminLearningRecord => {
      const bookings = liveMentorBookings.filter((b) => b.mentor_id === m.id);
      const completed = bookings.filter((b) => b.status === "completed").length;
      const rate = Number(m.hourly_rate_inr || 0);
      return {
        id: m.id,
        kind: "Mentor",
        code: `MNT-${301 + idx}`,
        title: `${m.display_name} · ${m.headline || "1:1 Mentorship"}`,
        organizerOrInstructor: m.display_name || "Mentor",
        category: Array.isArray(m.expertise) && m.expertise[0] ? m.expertise[0] : "Mentorship",
        participantsCount: bookings.length,
        completionOrSubmissionRate: bookings.length ? Math.round((completed / bookings.length) * 100) : 0,
        priceInr: rate,
        revenueGeneratedInr: bookings.filter((b) => b.status !== "cancelled").length * rate,
        status: m.is_active ? "Active" : "Completed",
        scheduleLabel: `₹${rate}/hr · ${Number(m.rating || 0).toFixed(1)}★`,
      };
    }),
  ];

  // 10. Live Immutable Audit Logs
  const auditLogs: SuperAdminAuditEntry[] = liveAuditLogs.map((a) => {
    const actorProf = a.actor_id ? profileById.get(a.actor_id) : undefined;
    const act = String(a.action || "system.event");
    const severity: SuperAdminAuditEntry["severity"] =
      /suspend|reject|fraud|fail|block|critical/i.test(act)
        ? "critical"
        : /refund|flag|override|archive|warn/i.test(act)
          ? "warning"
          : "info";
    return {
      id: `aud-${a.id}`,
      timestamp: a.at || new Date().toISOString(),
      actorName: actorProf?.full_name || actorProf?.email || "Platform Admin",
      actorRole: actorProf && employerUserIds.has(a.actor_id) ? "Employer Owner" : "Super Admin",
      actorIp: a.ip_hash ? `hash:${String(a.ip_hash).slice(0, 10)}` : "Supabase RPC",
      action: act,
      entityTable: a.entity || "public",
      entityId: a.entity_id || "—",
      severity,
      details:
        a.meta && typeof a.meta === "object" && Object.keys(a.meta).length
          ? `${act} on ${a.entity} · ${JSON.stringify(a.meta)}`
          : `${act} on ${a.entity}`,
      metadata: (a.meta as Record<string, unknown>) || {},
    };
  });

  // 11. Hydrate Platform Feature Flags from public.platform_settings
  const settingsMap = new Map(liveSettings.map((s) => [String(s.key), s.value]));
  const featureFlags: PlatformFeatureFlag[] = DEFAULT_FLAGS.map((flag) => {
    const rawVal = settingsMap.get(`flag.${flag.key}`) ?? settingsMap.get(flag.key);
    if (typeof rawVal === "boolean") {
      return { ...flag, enabled: rawVal };
    }
    return flag;
  });

  // 12. Real Live Table Health Telemetry (zero synthetic row inflation)
  const tableHealth: TableHealthSummary[] = [
    { tableName: "public.profiles", domain: "Candidate Identity", liveRows: profilesQ.ok ? liveProfiles.length : null, totalManagedRows: candidates.length, rlsEnabled: true, syncStatus: profilesQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.skills / experiences / educations", domain: "Candidate Graph", liveRows: skillsQ.ok ? liveSkills.length + liveExps.length + liveEdus.length : null, totalManagedRows: liveSkills.length + liveExps.length + liveEdus.length, rlsEnabled: true, syncStatus: skillsQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.certifications / projects", domain: "Proof of Work", liveRows: certsQ.ok ? liveCerts.length + liveProjs.length : null, totalManagedRows: liveCerts.length + liveProjs.length, rlsEnabled: true, syncStatus: certsQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.identity_verifications", domain: "Candidate KYC", liveRows: kycQ.ok ? liveKycs.length : null, totalManagedRows: liveKycs.length, rlsEnabled: true, syncStatus: kycQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.employers & tenant_organizations", domain: "Employer Tenants", liveRows: employersQ.ok ? liveEmployers.length : null, totalManagedRows: employers.length, rlsEnabled: true, syncStatus: employersQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.employer_job_openings", domain: "Job Marketplace", liveRows: jobsQ.ok ? liveJobs.length : null, totalManagedRows: jobs.length, rlsEnabled: true, syncStatus: jobsQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.job_applications & stage_history", domain: "ATS Pipeline", liveRows: applicationsQ.ok ? liveApplications.length : null, totalManagedRows: applications.length, rlsEnabled: true, syncStatus: applicationsQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.assessments_catalog & cir_reports", domain: "CIR Engine", liveRows: catalogQ.ok ? liveCatalog.length + liveCirReports.length : null, totalManagedRows: assessments.length, rlsEnabled: true, syncStatus: catalogQ.ok ? "Synced" : "Catalog" },
    { tableName: "public.proctoring_events (30 Layers)", domain: "AI Integrity", liveRows: proctorEventsQ.ok ? liveProctorEvents.length : null, totalManagedRows: liveProctorEvents.length, rlsEnabled: true, syncStatus: proctorEventsQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.payment_orders & subscriptions", domain: "Revenue & GST", liveRows: paymentOrdersQ.ok ? livePaymentOrders.length + liveServicePurchases.length : null, totalManagedRows: transactions.length, rlsEnabled: true, syncStatus: paymentOrdersQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.wallet_accounts & ledger_entries", domain: "Wallet Ledger", liveRows: walletsQ.ok ? liveWallets.length : null, totalManagedRows: wallets.length, rlsEnabled: true, syncStatus: walletsQ.ok ? "Synced" : "Protected (RLS)" },
    { tableName: "public.lms_courses / hackathons / mentors", domain: "Learning & Events", liveRows: lmsCoursesQ.ok || hackathonsQ.ok ? liveLmsCourses.length + liveHackathons.length + liveMentors.length : null, totalManagedRows: learningEvents.length, rlsEnabled: true, syncStatus: lmsCoursesQ.ok ? "Synced" : "Catalog" },
    { tableName: "public.support_tickets & audit_log", domain: "Ops & Security", liveRows: ticketsQ.ok || auditLogQ.ok ? liveTickets.length + liveAuditLogs.length : null, totalManagedRows: tickets.length + auditLogs.length, rlsEnabled: true, syncStatus: ticketsQ.ok ? "Synced" : "Protected (RLS)" },
  ];

  return {
    syncedAt: new Date().toISOString(),
    liveDbConnected,
    adminSession,
    liveProfilesCount: candidates.length,
    liveEmployersCount: employers.length,
    liveJobsCount: jobs.length,
    liveApplicationsCount: applications.length,
    liveTransactionsCount: transactions.length,
    liveWalletsCount: wallets.length,
    liveAssessmentsCount: assessments.length,
    liveTicketsCount: tickets.length,
    candidates,
    employers,
    jobs,
    applications,
    assessments,
    transactions,
    wallets,
    tickets,
    auditLogs,
    learningEvents,
    tableHealth,
    featureFlags,
    liveEnterpriseRaw: {
      lmsCourses: liveLmsCourses,
      courseEnrollments: liveCourseEnrollments,
      mentors: liveMentors,
      mentorBookings: liveMentorBookings,
      hackathons: liveHackathons,
      hackathonRegistrations: liveHackathonRegs,
      hackathonSubmissions: liveHackathonSubs,
      eventRegistrations: liveEventRegs,
      freelanceGigs: liveFreelanceGigs,
      gigProposals: liveGigProposals,
      coupons: liveCoupons,
      couponRedemptions: liveCouponRedemptions,
      aiInterviews: liveAiInterviews,
      scheduledInterviews: liveScheduledInterviews,
      notifications: liveNotifications,
      platformSettings: liveSettings,
      enterpriseStore: liveEnterpriseStore,
      questionBank: liveQuestionBank,
    },
  };
}

export function exportRecordsAsCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]).filter((k) => k !== "raw");
  const escapeCell = (val: unknown) => {
    const str =
      val === null || val === undefined
        ? ""
        : typeof val === "object"
          ? JSON.stringify(val)
          : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escapeCell(r[h])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRecordsAsJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
