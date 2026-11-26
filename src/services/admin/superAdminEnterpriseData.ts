// Enterprise Super Admin Data Layer (Modules 01–20 + 7 Platform Capabilities)
// Fresh, launch-ready defaults: zero dummy user/transaction/content records.
// Populated live from Supabase tables and persisted admin_enterprise_store settings.

export type AdminRoleKey =
  | "super_admin"
  | "finance_admin"
  | "recruitment_admin"
  | "learning_admin"
  | "support_admin"
  | "ops_staff";

export interface AdminRoleDefinition {
  key: AdminRoleKey;
  name: string;
  department: string;
  assignedUsers: number;
  description: string;
  permissions: Record<
    | "users"
    | "employers"
    | "candidates"
    | "recruitment"
    | "assessments"
    | "ai_hub"
    | "lms_mentors"
    | "events_freelance"
    | "finance_plans"
    | "cms_comms"
    | "support"
    | "analytics"
    | "system_security",
    "full" | "write" | "read" | "none"
  >;
}

export interface InternalStaffAccount {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  roleKey: AdminRoleKey;
  roleLabel: string;
  department: string;
  status: "active" | "suspended" | "inactive";
  mfaEnabled: boolean;
  lastLoginAt: string;
  lastIp: string;
  notes: string;
}

export interface AiFeatureControl {
  id: string;
  name: string;
  category: "Candidate AI" | "Employer AI" | "Core Engine";
  enabled: boolean;
  model: string;
  monthlyRequests: number;
  tokensUsedM: number;
  costInr: number;
  accuracyPct: number;
  failedRequests: number;
  freeTierLimit: string;
  proTierLimit: string;
  systemPrompt: string;
}

export interface AiResponseLog {
  id: string;
  timestamp: string;
  feature: string;
  actor: string;
  model: string;
  tokens: number;
  latencyMs: number;
  status: "success" | "failed" | "rate_limited";
  summary: string;
}

export interface LmsCourseRecord {
  id: string;
  code: string;
  title: string;
  category: string;
  domain: string;
  instructor: string;
  tier: "Free" | "Paid";
  priceInr: number;
  featured: boolean;
  approvalStatus: "approved" | "pending_approval" | "draft";
  modulesCount: number;
  videoLessons: number;
  pdfResources: number;
  quizzesCount: number;
  enrolledCount: number;
  activeLearners: number;
  completedCount: number;
  avgRating: number;
  certificatesIssued: number;
  refundsCount: number;
  revenueInr: number;
}

export interface MentorRecord {
  id: string;
  code: string;
  fullName: string;
  email: string;
  headline: string;
  domain: string;
  company: string;
  verificationStatus: "verified" | "pending" | "rejected";
  availability: "Available" | "Limited Slots" | "Unavailable";
  hourlyRateInr: number;
  sessionsUpcoming: number;
  sessionsCompleted: number;
  sessionsCancelled: number;
  rating: number;
  reviewsCount: number;
  totalPayoutInr: number;
  pendingPayoutInr: number;
  assignedCourses: string[];
}

export interface MentorSessionBooking {
  id: string;
  code: string;
  mentorName: string;
  candidateName: string;
  topic: string;
  scheduledAt: string;
  durationMin: number;
  feeInr: number;
  status: "upcoming" | "completed" | "cancelled";
  rating?: number;
}

export interface TalentCrmRequest {
  id: string;
  code: string;
  employerName: string;
  roleTitle: string;
  minCirScore: number;
  requiredSkills: string[];
  location: string;
  shortlistedCount: number;
  status: "open" | "shortlist_shared" | "fulfilled";
  ownerAdmin: string;
  createdAt: string;
}

export interface InterviewRecord {
  id: string;
  code: string;
  type: "Employer Interview" | "AI Mock Interview";
  candidateName: string;
  employerOrHost: string;
  roleTitle: string;
  scheduledAt: string;
  status: "upcoming" | "completed" | "cancelled" | "disputed";
  aiScore?: number;
  panelRating?: number;
  feedbackSummary: string;
  outcome: "Pending" | "Next Round" | "Selected" | "Rejected";
}

export interface HackathonAdminRecord {
  id: string;
  code: string;
  title: string;
  industry: string;
  city: string;
  mode: "Hybrid" | "Online" | "Onsite";
  status: "upcoming" | "live" | "completed";
  sponsors: string[];
  participants: number;
  teams: number;
  submissions: number;
  prizePoolInr: number;
  jobAuctionBids: number;
  winnerTeam?: string;
  runnerUpTeam?: string;
  schedule: string;
}

export interface NetworkingEventAdminRecord {
  id: string;
  code: string;
  title: string;
  industry: string;
  city: string;
  status: "upcoming" | "completed";
  registrations: number;
  attended: number;
  speakers: string[];
  sponsors: string[];
  ticketPriceInr: number;
  feedbackScore: number;
  dateLabel: string;
}

export interface WebinarAdminRecord {
  id: string;
  code: string;
  title: string;
  hostMentor: string;
  category: string;
  status: "upcoming" | "recorded";
  registrations: number;
  avgWatchPct: number;
  dateLabel: string;
}

export interface FreelanceProjectRecord {
  id: string;
  code: string;
  title: string;
  clientName: string;
  freelancerName: string;
  category: string;
  budgetInr: number;
  proposalsCount: number;
  status: "pending_approval" | "active" | "completed" | "disputed";
  escrowStatus: "Funded" | "Released" | "Held (Dispute)";
  rating?: number;
}

export interface SubscriptionPlanRecord {
  id: string;
  code: string;
  name: string;
  segment:
    | "Candidate Plans"
    | "Employer Plans"
    | "Assessment Plans"
    | "Learning Plans"
    | "AI Feature Plans"
    | "Advertisement Plans"
    | "Corporate Learning"
    | "Custom Enterprise";
  priceInr: number;
  billingCycle: "Monthly" | "Quarterly" | "Annual" | "One-time";
  activeSubscribers: number;
  trialUsers: number;
  validityDays: number;
  features: string[];
  status: "active" | "draft" | "retired";
}

export interface CouponRecord {
  id: string;
  code: string;
  discountLabel: string;
  appliesTo: string;
  redemptions: number;
  maxRedemptions: number;
  expiresAt: string;
  status: "active" | "expired";
}

export interface PayoutRecord {
  id: string;
  code: string;
  recipientType: "Mentor" | "Freelancer";
  recipientName: string;
  grossInr: number;
  commissionPct: number;
  netPayoutInr: number;
  bankRef: string;
  status: "processed" | "pending" | "on_hold";
  scheduledFor: string;
}

export interface CmsPageRecord {
  id: string;
  title: string;
  route: string;
  sectionGroup: "Website CMS" | "Legal" | "Content";
  status: "published" | "draft";
  seoTitle: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface MarketingCampaignRecord {
  id: string;
  code: string;
  name: string;
  channel: "Email" | "SMS" | "WhatsApp" | "Push" | "Referral" | "Coupon";
  audience: string;
  sentCount: number;
  openRatePct: number;
  conversionPct: number;
  status: "active" | "scheduled" | "completed";
}

export interface NotificationBroadcastRecord {
  id: string;
  title: string;
  channel: "Push" | "Email" | "SMS" | "WhatsApp" | "System Alert";
  audience: "All Users" | "Candidates Only" | "Employers Only" | "Segmented";
  segmentDetail: string;
  status: "sent" | "scheduled" | "automated";
  deliveredCount: number;
  openRatePct: number;
  sentAt: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  code: string;
  title: string;
  audience: "Candidate" | "Employer" | "Mentor" | "Billing";
  views: number;
  helpfulPct: number;
  status: "published" | "draft";
  updatedAt: string;
}

export interface ApprovalWorkflowRule {
  id: string;
  domain:
    | "Employer KYB"
    | "Job Postings"
    | "Refund Requests"
    | "Course Approvals"
    | "Mentor Onboarding"
    | "Freelance Projects";
  levels: string;
  autoApproveRule: string;
  slaHours: number;
  enabled: boolean;
}

export interface FraudAlertRecord {
  id: string;
  code: string;
  type:
    | "Fake Profile"
    | "Suspicious Application Burst"
    | "Duplicate GSTIN"
    | "Proctoring Collusion"
    | "Payment Velocity";
  entityName: string;
  riskScore: number;
  signals: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  detectedAt: string;
}

export interface AutomationRuleRecord {
  id: string;
  name: string;
  trigger: string;
  action: string;
  channel: string;
  runsLast30d: number;
  enabled: boolean;
}

export interface CirScoreConfig {
  coreAptitudeWeight: number;
  communicationWeight: number;
  domainTechnicalWeight: number;
  codingWeight: number;
  aiInterviewWeight: number;
  passThreshold: number;
  distinctionThreshold: number;
  defaultDurationMin: number;
  maxRetakeAttempts: number;
  retakeCooldownDays: number;
  aiAutoEvaluation: boolean;
}

export interface QuestionBankItem {
  id: string;
  code: string;
  domain: string;
  type: "Technical" | "Aptitude" | "Communication" | "Behavioural" | "Psychometric" | "Coding";
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  usageCount: number;
  avgPassPct: number;
}

export interface ComplianceRequestRecord {
  id: string;
  code: string;
  userEmail: string;
  type: "DPDP Data Export" | "Account Deletion" | "Consent Withdrawal";
  status: "pending" | "completed";
  requestedAt: string;
  dueBy: string;
}

export interface SuperAdminEnterpriseState {
  roles: AdminRoleDefinition[];
  staffAccounts: InternalStaffAccount[];
  aiFeatures: AiFeatureControl[];
  aiLogs: AiResponseLog[];
  courses: LmsCourseRecord[];
  mentors: MentorRecord[];
  mentorBookings: MentorSessionBooking[];
  talentRequests: TalentCrmRequest[];
  interviews: InterviewRecord[];
  hackathons: HackathonAdminRecord[];
  networkingEvents: NetworkingEventAdminRecord[];
  webinars: WebinarAdminRecord[];
  freelanceProjects: FreelanceProjectRecord[];
  plans: SubscriptionPlanRecord[];
  coupons: CouponRecord[];
  payouts: PayoutRecord[];
  cmsPages: CmsPageRecord[];
  campaigns: MarketingCampaignRecord[];
  notifications: NotificationBroadcastRecord[];
  kbArticles: KnowledgeBaseArticle[];
  approvalWorkflows: ApprovalWorkflowRule[];
  fraudAlerts: FraudAlertRecord[];
  automations: AutomationRuleRecord[];
  cirConfig: CirScoreConfig;
  questionBank: QuestionBankItem[];
  complianceRequests: ComplianceRequestRecord[];
  taxonomy: {
    jobCategories: string[];
    industries: string[];
    skills: string[];
    locations: string[];
  };
  maintenanceMode: boolean;
  twoFactorEnforced: boolean;
  ipWhitelistEnabled: boolean;
  commissionRates: { mentorPct: number; freelancePct: number; hackathonPct: number };
}

export function buildRegistrationTrendSeries(
  candidates: Array<{ createdAt: string }>,
  employers: Array<{ createdAt: string }>
): Array<{ month: string; candidates: number; employers: number }> {
  const now = new Date();
  const buckets: Array<{ key: string; month: string; candidates: number; employers: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const month = d.toLocaleString("en-US", { month: "short" });
    buckets.push({ key, month, candidates: 0, employers: 0 });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));
  for (const c of candidates) {
    const dt = new Date(c.createdAt);
    if (!Number.isNaN(dt.getTime())) {
      const k = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const b = byKey.get(k);
      if (b) b.candidates += 1;
    }
  }
  for (const e of employers) {
    const dt = new Date(e.createdAt);
    if (!Number.isNaN(dt.getTime())) {
      const k = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const b = byKey.get(k);
      if (b) b.employers += 1;
    }
  }
  return buckets.map(({ month, candidates: c, employers: e }) => ({
    month,
    candidates: c,
    employers: e,
  }));
}

export function buildDomainCirAnalytics(
  assessments: Array<{ domainTrack: string; overallCirScore: number; status: string }>
): Array<{ domain: string; avgCir: number; passRate: number; attempts: number }> {
  const grouped = new Map<string, { sum: number; passed: number; count: number }>();
  for (const a of assessments) {
    const dom = a.domainTrack || "Core Readiness";
    const cur = grouped.get(dom) || { sum: 0, passed: 0, count: 0 };
    cur.sum += Number(a.overallCirScore || 0);
    cur.count += 1;
    if (a.status === "Issued" || Number(a.overallCirScore || 0) >= 40) {
      cur.passed += 1;
    }
    grouped.set(dom, cur);
  }
  return Array.from(grouped.entries()).map(([domain, stats]) => ({
    domain,
    avgCir: Math.round(stats.sum / Math.max(1, stats.count)),
    passRate: Math.round((stats.passed / Math.max(1, stats.count)) * 100),
    attempts: stats.count,
  }));
}

export function createInitialEnterpriseState(): SuperAdminEnterpriseState {
  return {
    roles: [
      {
        key: "super_admin",
        name: "Super Admin",
        department: "Executive Ops",
        assignedUsers: 0,
        description: "Unrestricted control over all 20 modules, RBAC, finance, and system configuration",
        permissions: {
          users: "full",
          employers: "full",
          candidates: "full",
          recruitment: "full",
          assessments: "full",
          ai_hub: "full",
          lms_mentors: "full",
          events_freelance: "full",
          finance_plans: "full",
          cms_comms: "full",
          support: "full",
          analytics: "full",
          system_security: "full",
        },
      },
      {
        key: "finance_admin",
        name: "Finance Admin",
        department: "Finance & GST",
        assignedUsers: 0,
        description: "Subscriptions, invoices, GST reports, refund approvals, and mentor/freelancer payouts",
        permissions: {
          users: "read",
          employers: "read",
          candidates: "read",
          recruitment: "none",
          assessments: "none",
          ai_hub: "read",
          lms_mentors: "read",
          events_freelance: "read",
          finance_plans: "full",
          cms_comms: "none",
          support: "write",
          analytics: "read",
          system_security: "none",
        },
      },
      {
        key: "recruitment_admin",
        name: "Recruitment Admin",
        department: "Marketplace Ops",
        assignedUsers: 0,
        description: "Employer KYB, job moderation, ATS oversight, talent pool CRM, and interview disputes",
        permissions: {
          users: "read",
          employers: "full",
          candidates: "write",
          recruitment: "full",
          assessments: "read",
          ai_hub: "read",
          lms_mentors: "none",
          events_freelance: "write",
          finance_plans: "none",
          cms_comms: "none",
          support: "write",
          analytics: "read",
          system_security: "none",
        },
      },
      {
        key: "learning_admin",
        name: "Learning & CIR Admin",
        department: "Academics & Integrity",
        assignedUsers: 0,
        description: "Assessment library, question bank, 30-layer proctoring, LMS courses, and mentor onboarding",
        permissions: {
          users: "read",
          employers: "none",
          candidates: "read",
          recruitment: "none",
          assessments: "full",
          ai_hub: "write",
          lms_mentors: "full",
          events_freelance: "write",
          finance_plans: "none",
          cms_comms: "write",
          support: "read",
          analytics: "read",
          system_security: "none",
        },
      },
      {
        key: "support_admin",
        name: "Support & Grievance Admin",
        department: "Trust & Support",
        assignedUsers: 0,
        description: "Tickets, escalations, KYC/KYB document follow-ups, notifications, and knowledge base",
        permissions: {
          users: "write",
          employers: "read",
          candidates: "read",
          recruitment: "read",
          assessments: "read",
          ai_hub: "none",
          lms_mentors: "read",
          events_freelance: "read",
          finance_plans: "read",
          cms_comms: "write",
          support: "full",
          analytics: "read",
          system_security: "none",
        },
      },
    ],
    staffAccounts: [],
    aiFeatures: [
      {
        id: "ai-01",
        name: "AI Resume Builder",
        category: "Candidate AI",
        enabled: true,
        model: "gemini-2.5-flash",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "3 exports / month",
        proTierLimit: "Unlimited + ATS rewrite",
        systemPrompt: "Generate ATS-compliant, impact-quantified resumes strictly grounded in verified candidate records.",
      },
      {
        id: "ai-02",
        name: "AI Resume Screening",
        category: "Employer AI",
        enabled: true,
        model: "gemini-2.5-pro",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "25 resumes / job",
        proTierLimit: "Unlimited batch screening",
        systemPrompt: "Score applicant fit transparently against role skills, experience band, and verified CIR domains.",
      },
      {
        id: "ai-03",
        name: "AI Mock Interview",
        category: "Candidate AI",
        enabled: true,
        model: "gemini-2.5-pro-realtime",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "1 mock / month",
        proTierLimit: "10 mocks / month + rubric",
        systemPrompt: "Conduct structured technical and behavioural mock interviews using STAR and system-design rubrics.",
      },
      {
        id: "ai-04",
        name: "AI Job Match Score",
        category: "Core Engine",
        enabled: true,
        model: "cir-ranker-v4",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "All public jobs",
        proTierLimit: "Deep skill-gap breakdown",
        systemPrompt: "Compute weighted cosine + CIR domain readiness match score without protected-attribute bias.",
      },
      {
        id: "ai-05",
        name: "AI Skill Gap Analysis",
        category: "Candidate AI",
        enabled: true,
        model: "gemini-2.5-flash",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "1 target role",
        proTierLimit: "Unlimited role benchmarks",
        systemPrompt: "Map candidate assessment sub-scores against live employer demand and recommend closing modules.",
      },
      {
        id: "ai-06",
        name: "AI Career Intelligence (CIR)",
        category: "Core Engine",
        enabled: true,
        model: "gemini-2.5-pro",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "Summary score only",
        proTierLimit: "Full verifiable 14-page CIR PDF",
        systemPrompt: "Synthesize proctored aptitude, coding, technical, and communication evidence into a verifiable CIR dossier.",
      },
      {
        id: "ai-07",
        name: "AI Salary Predictor",
        category: "Candidate AI",
        enabled: true,
        model: "cir-comp-xgboost-v2",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "City median range",
        proTierLimit: "Percentile band by CIR tier",
        systemPrompt: "Estimate INR LPA compensation bands calibrated by city, experience, stack, and CIR percentile.",
      },
      {
        id: "ai-08",
        name: "AI Communication Coach",
        category: "Candidate AI",
        enabled: true,
        model: "gemini-2.5-flash-audio",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "2 speech clips / month",
        proTierLimit: "Unlimited clarity & pacing feedback",
        systemPrompt: "Evaluate clarity, pacing, structure, and filler ratio from 60-second video pitches and answers.",
      },
      {
        id: "ai-09",
        name: "AI Learning Recommendations",
        category: "Candidate AI",
        enabled: true,
        model: "gemini-2.5-flash",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "Weekly digest",
        proTierLimit: "Dynamic weekly sprint plan",
        systemPrompt: "Recommend LMS tracks and 1:1 mentors directly addressing lowest CIR sub-competencies.",
      },
      {
        id: "ai-10",
        name: "AI Interview Copilot (Linda)",
        category: "Employer AI",
        enabled: true,
        model: "gemini-2.5-pro-realtime",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "Disabled on free tier",
        proTierLimit: "Included in Growth & Enterprise",
        systemPrompt: "Assist hiring panels with structured follow-up questions, live transcripts, and rubric scoring.",
      },
      {
        id: "ai-11",
        name: "AI Career Guide / SI Guide",
        category: "Candidate AI",
        enabled: true,
        model: "gemini-2.5-flash",
        monthlyRequests: 0,
        tokensUsedM: 0,
        costInr: 0,
        accuracyPct: 0,
        failedRequests: 0,
        freeTierLimit: "20 turns / week",
        proTierLimit: "Unlimited guided roadmap",
        systemPrompt: "Provide step-by-step career transition guidance grounded in TalentCIR assessments and open jobs.",
      },
    ],
    aiLogs: [],
    courses: [],
    mentors: [],
    mentorBookings: [],
    talentRequests: [],
    interviews: [],
    hackathons: [],
    networkingEvents: [],
    webinars: [],
    freelanceProjects: [],
    plans: [],
    coupons: [],
    payouts: [],
    cmsPages: [],
    campaigns: [],
    notifications: [],
    kbArticles: [],
    approvalWorkflows: [
      { id: "wf-01", domain: "Employer KYB", levels: "L1 Recruitment Admin → L2 Super Admin (Enterprise)", autoApproveRule: "Never (manual GSTIN/CIN match mandatory)", slaHours: 4, enabled: true },
      { id: "wf-02", domain: "Job Postings", levels: "L1 Automated Salary/Spam Check → L2 Recruitment Admin", autoApproveRule: "Auto-publish for KYB-verified Enterprise tenants", slaHours: 2, enabled: true },
      { id: "wf-03", domain: "Refund Requests", levels: "L1 Support Admin → L2 Finance Admin (>₹2,500)", autoApproveRule: "Auto-approve duplicate payment failures <₹1,500", slaHours: 12, enabled: true },
      { id: "wf-04", domain: "Course Approvals", levels: "L1 Learning & CIR Admin curriculum QA", autoApproveRule: "Manual syllabus & video compliance audit", slaHours: 24, enabled: true },
      { id: "wf-05", domain: "Mentor Onboarding", levels: "L1 Learning Admin LinkedIn & Experience Verification", autoApproveRule: "Manual credential verification required", slaHours: 24, enabled: true },
      { id: "wf-06", domain: "Freelance Projects", levels: "L1 Escrow Funding Check → L2 Marketplace Ops", autoApproveRule: "Auto-approve funded projects from verified employers", slaHours: 6, enabled: true },
    ],
    fraudAlerts: [],
    automations: [
      { id: "aut-01", name: "Incomplete Employer Profile Reminder", trigger: "Employer profile <100% after 48h", action: "Send Email + WhatsApp onboarding checklist", channel: "Email + WhatsApp", runsLast30d: 0, enabled: true },
      { id: "aut-02", name: "Subscription Renewal 7-Day Alert", trigger: "Plan expires within 7 days", action: "Send Razorpay auto-pay / invoice renewal reminder", channel: "Email", runsLast30d: 0, enabled: true },
      { id: "aut-03", name: "CIR Retest Cooldown Unlocked", trigger: "30 days after 1st assessment attempt", action: "Notify candidate of score-boost retest window", channel: "Push + Email", runsLast30d: 0, enabled: true },
      { id: "aut-04", name: "High-Risk Proctoring Escalation", trigger: "Proctor trust score <75%", action: "Hold CIR credential & create Integrity Desk ticket", channel: "System Alert", runsLast30d: 0, enabled: true },
    ],
    cirConfig: {
      coreAptitudeWeight: 15,
      communicationWeight: 15,
      domainTechnicalWeight: 30,
      codingWeight: 25,
      aiInterviewWeight: 15,
      passThreshold: 65,
      distinctionThreshold: 85,
      defaultDurationMin: 75,
      maxRetakeAttempts: 3,
      retakeCooldownDays: 30,
      aiAutoEvaluation: true,
    },
    questionBank: [],
    complianceRequests: [],
    taxonomy: {
      jobCategories: ["Software Engineering", "Data Science & AI", "Cloud & DevOps", "Product Management", "FinTech Systems", "UI/UX Design", "Cybersecurity", "Growth & Marketing"],
      industries: ["Software & Cloud", "FinTech", "Data & AI", "E-Commerce & D2C", "Robotics & DeepTech", "SaaS Enterprise", "HealthTech", "EdTech"],
      skills: ["React", "TypeScript", "Node.js", "Python", "Go", "Rust", "PostgreSQL", "Kubernetes", "AWS", "PyTorch", "System Design", "SQL"],
      locations: ["Bengaluru", "Mumbai", "Hyderabad", "Pune", "Chennai", "Delhi NCR", "Remote (India)", "Global Remote"],
    },
    maintenanceMode: false,
    twoFactorEnforced: true,
    ipWhitelistEnabled: false,
    commissionRates: { mentorPct: 15, freelancePct: 10, hackathonPct: 12 },
  };
}

export function hydrateEnterpriseStateFromLiveDb(
  base: SuperAdminEnterpriseState,
  raw: {
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
    questionBank?: Record<string, unknown>[];
  }
): SuperAdminEnterpriseState {
  const liveCourses: LmsCourseRecord[] = raw.lmsCourses.map((c, idx) => {
    const id = String(c.id || `live-crs-${idx}`);
    const enrolls = raw.courseEnrollments.filter((e) => e.course_id === id);
    const completed = enrolls.filter((e) => e.status === "completed").length;
    const price = Number(c.price_inr || 0);
    return {
      id,
      code: `CRS-${101 + idx}`,
      title: String(c.title || "LMS Course"),
      category: String(c.category || "Upskilling"),
      domain: String(c.category || "Technology"),
      instructor: String(c.instructor_name || "TalentCIR Faculty"),
      tier: price > 0 ? "Paid" : "Free",
      priceInr: price,
      featured: false,
      approvalStatus: c.is_published === false ? "pending_approval" : "approved",
      modulesCount: Math.max(1, Math.round(Number(c.duration_hours || 4))),
      videoLessons: Math.max(1, Math.round(Number(c.duration_hours || 6))),
      pdfResources: 0,
      quizzesCount: 0,
      enrolledCount: Math.max(Number(c.learners_count || 0), enrolls.length),
      activeLearners: enrolls.filter((e) => e.status === "active").length,
      completedCount: completed,
      avgRating: Number(c.rating || 0),
      certificatesIssued: completed,
      refundsCount: 0,
      revenueInr: enrolls.length * price,
    };
  });

  const mentorNameById = new Map(
    raw.mentors.map((m) => [String(m.id), String(m.display_name || "Mentor")])
  );
  const liveMentors: MentorRecord[] = raw.mentors.map((m, idx) => {
    const id = String(m.id || `live-mnt-${idx}`);
    const bookings = raw.mentorBookings.filter((b) => b.mentor_id === id);
    const completed = bookings.filter((b) => b.status === "completed").length;
    const upcoming = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const rate = Number(m.hourly_rate_inr || 0);
    const expertise = Array.isArray(m.expertise) ? (m.expertise as string[]) : [];
    return {
      id,
      code: `MNT-${201 + idx}`,
      fullName: String(m.display_name || "Mentor"),
      email: "—",
      headline: String(m.headline || "Industry Mentor"),
      domain: expertise[0] || "Engineering",
      company: "Verified Mentor Network",
      verificationStatus: m.is_active === false ? "pending" : "verified",
      availability: m.is_active === false ? "Unavailable" : "Available",
      hourlyRateInr: rate,
      sessionsUpcoming: upcoming,
      sessionsCompleted: completed,
      sessionsCancelled: cancelled,
      rating: Number(m.rating || 0),
      reviewsCount: completed,
      totalPayoutInr: Math.round(completed * rate * 0.85),
      pendingPayoutInr: Math.round(upcoming * rate * 0.85),
      assignedCourses: [],
    };
  });

  const liveMentorBookings: MentorSessionBooking[] = raw.mentorBookings.map((b, idx) => ({
    id: String(b.id || `live-mb-${idx}`),
    code: `SES-${301 + idx}`,
    mentorName: mentorNameById.get(String(b.mentor_id)) || "Mentor",
    candidateName: `Candidate ${String(b.user_id || "").slice(0, 6)}`,
    topic: String(b.topic || "1:1 Career Mentorship"),
    scheduledAt: b.created_at ? new Date(String(b.created_at)).toLocaleString() : "Scheduled",
    durationMin: 60,
    feeInr: 0,
    status:
      b.status === "completed"
        ? "completed"
        : b.status === "cancelled"
          ? "cancelled"
          : "upcoming",
  }));

  const liveHackathons: HackathonAdminRecord[] = raw.hackathons.map((h, idx) => {
    const id = String(h.id || `live-hck-${idx}`);
    const regs = raw.hackathonRegistrations.filter(
      (r) => r.hackathon_id === id && r.status !== "withdrawn"
    );
    const subs = raw.hackathonSubmissions.filter((s) => s.hackathon_id === id);
    const stRaw = String(h.status || "open");
    const status: HackathonAdminRecord["status"] =
      stRaw === "completed" ? "completed" : stRaw === "live" || stRaw === "open" ? "live" : "upcoming";
    const modeRaw = String(h.mode || "hybrid").toLowerCase();
    const mode: HackathonAdminRecord["mode"] =
      modeRaw === "online" ? "Online" : modeRaw === "offline" ? "Onsite" : "Hybrid";
    return {
      id,
      code: `HACK-${301 + idx}`,
      title: String(h.title || "TalentCIR Hackathon"),
      industry: String(h.industry || "Software & AI"),
      city: String(h.city || "Bengaluru"),
      mode,
      status,
      sponsors:
        Array.isArray(h.sponsors) && h.sponsors.length ? (h.sponsors as string[]) : ["TalentCIR"],
      participants: regs.length,
      teams: new Set(regs.map((r) => r.team_id).filter(Boolean)).size,
      submissions: subs.length,
      prizePoolInr: Number(h.prize_pool_inr || 0),
      jobAuctionBids: 0,
      schedule: h.starts_at ? new Date(String(h.starts_at)).toLocaleDateString() : "Scheduled",
    };
  });

  const netEventMap = new Map<string, { title: string; city: string; count: number }>();
  for (const reg of raw.eventRegistrations) {
    if (reg.event_kind === "networking" || reg.event_kind === "meetup") {
      const ref = String(reg.event_ref || "Networking Event");
      const cur = netEventMap.get(ref) || { title: ref, city: String(reg.city || "India"), count: 0 };
      cur.count += 1;
      netEventMap.set(ref, cur);
    }
  }
  const liveNetworkingEvents: NetworkingEventAdminRecord[] = Array.from(netEventMap.values()).map(
    (ev, idx) => ({
      id: `live-net-${idx}`,
      code: `NET-${401 + idx}`,
      title: ev.title,
      industry: "Community",
      city: ev.city,
      status: "upcoming",
      registrations: ev.count,
      attended: 0,
      speakers: [],
      sponsors: ["TalentCIR"],
      ticketPriceInr: 0,
      feedbackScore: 0,
      dateLabel: ev.city,
    })
  );

  const liveFreelanceProjects: FreelanceProjectRecord[] = raw.freelanceGigs.map((g, idx) => {
    const id = String(g.id || `live-gig-${idx}`);
    const props = raw.gigProposals.filter((p) => p.gig_id === id);
    const stRaw = String(g.status || "open").toLowerCase();
    const status: FreelanceProjectRecord["status"] =
      stRaw === "completed" ? "completed" : stRaw === "disputed" ? "disputed" : "active";
    return {
      id,
      code: `GIG-${401 + idx}`,
      title: String(g.title || "Freelance Engagement"),
      clientName: String(g.client_name || "TalentCIR Client"),
      freelancerName: props.length ? `${props.length} Proposal(s)` : "Open for bids",
      category: Array.isArray(g.skills) && g.skills[0] ? String(g.skills[0]) : "Engineering",
      budgetInr: Number(g.budget_max || g.budget_min || 0),
      proposalsCount: props.length,
      status,
      escrowStatus: status === "completed" ? "Released" : "Funded",
    };
  });

  const liveCoupons: CouponRecord[] = raw.coupons.map((cp, idx) => {
    const id = String(cp.id || `live-cpn-${idx}`);
    const used = raw.couponRedemptions.filter((r) => r.coupon_id === id).length;
    const isFlat = cp.discount_type === "flat";
    return {
      id,
      code: String(cp.code || "PROMO"),
      discountLabel: isFlat ? `₹${Number(cp.value || 0)} flat` : `${Number(cp.value || 0)}% off`,
      appliesTo:
        Array.isArray(cp.applies_to) && cp.applies_to.length
          ? (cp.applies_to as string[]).join(", ")
          : "All Plans",
      redemptions: used,
      maxRedemptions: Number(cp.max_redemptions || 500),
      expiresAt: cp.valid_to ? String(cp.valid_to).slice(0, 10) : "—",
      status: cp.is_active === false ? "expired" : "active",
    };
  });

  const liveInterviews: InterviewRecord[] = [
    ...raw.aiInterviews.map((ai, idx): InterviewRecord => ({
      id: String(ai.id || `live-ai-int-${idx}`),
      code: `AI-INT-${501 + idx}`,
      type: "AI Mock Interview",
      candidateName: `Candidate ${String(ai.user_id || "").slice(0, 6)}`,
      employerOrHost: "Linda AI Interviewer",
      roleTitle: "Proctored AI CIR Mock Interview",
      scheduledAt: ai.started_at
        ? new Date(String(ai.started_at)).toLocaleString()
        : new Date(String(ai.created_at || Date.now())).toLocaleString(),
      status:
        ai.status === "completed"
          ? "completed"
          : ai.status === "failed"
            ? "disputed"
            : "upcoming",
      aiScore: ai.overall_score ? Math.round(Number(ai.overall_score)) : undefined,
      feedbackSummary: String(ai.summary || "Live AI interview session stored in Supabase."),
      outcome: ai.status === "completed" ? "Next Round" : "Pending",
    })),
    ...raw.scheduledInterviews.map((si, idx): InterviewRecord => ({
      id: String(si.id || `live-emp-int-${idx}`),
      code: `EMP-INT-${601 + idx}`,
      type: si.mode === "ai" ? "AI Mock Interview" : "Employer Interview",
      candidateName: `Candidate ${String(si.candidate_id || "").slice(0, 6)}`,
      employerOrHost: "Employer Panel",
      roleTitle: "Employer Interview Round",
      scheduledAt: si.scheduled_at
        ? new Date(String(si.scheduled_at)).toLocaleString()
        : "Scheduled",
      status:
        si.status === "completed"
          ? "completed"
          : si.status === "cancelled" || si.status === "no_show"
            ? "cancelled"
            : "upcoming",
      feedbackSummary: `Mode: ${String(si.mode || "video")} · Duration: ${Number(si.duration_min || 45)}m`,
      outcome: si.status === "completed" ? "Next Round" : "Pending",
    })),
  ];

  const liveBroadcasts: NotificationBroadcastRecord[] = raw.notifications
    .filter((n) => n.kind === "broadcast")
    .slice(0, 20)
    .map((n, idx) => ({
      id: String(n.id || `live-ntf-${idx}`),
      title: String(n.title || "Platform Notification"),
      channel: "System Alert",
      audience: "All Users",
      segmentDetail: "Live Database Users",
      sentAt: n.created_at ? new Date(String(n.created_at)).toLocaleString() : "Just now",
      deliveredCount: 1,
      openRatePct: n.read_at ? 100 : 0,
      status: "sent",
    }));

  const liveQuestions: QuestionBankItem[] = (raw.questionBank || []).map((q, idx) => ({
    id: String(q.id || `live-qb-${idx}`),
    code: `Q-${100 + idx}`,
    domain: String(q.section || "Core Readiness"),
    type: q.qtype === "coding" ? "Coding" : q.qtype === "audio" ? "Communication" : "Technical",
    difficulty:
      Number(q.irt_difficulty || 0) > 0.5
        ? "Hard"
        : Number(q.irt_difficulty || 0) < -0.3
          ? "Easy"
          : "Medium",
    prompt: String(q.prompt || "Assessment question"),
    usageCount: 0,
    avgPassPct: 0,
  }));

  const storeMap = new Map(
    raw.enterpriseStore.map((row) => [String(row.key), row.payload as Record<string, unknown>])
  );
  const persistedOverrides = (storeMap.get("enterprise_state_v1") || {}) as Partial<SuperAdminEnterpriseState>;

  const weightsRow = raw.platformSettings.find((s) => s.key === "assessment_weights");
  const hydratedCirConfig = {
    ...base.cirConfig,
    ...(persistedOverrides.cirConfig || {}),
    ...(weightsRow && typeof weightsRow.value === "object" && weightsRow.value !== null
      ? {
          coreAptitudeWeight: Math.round((Number((weightsRow.value as Record<string, unknown>).core ?? 0.45) * 100) / 2),
          domainTechnicalWeight: Math.round(Number((weightsRow.value as Record<string, unknown>).domain ?? 0.3) * 100),
          aiInterviewWeight: Math.round(Number((weightsRow.value as Record<string, unknown>).interview ?? 0.15) * 100),
        }
      : {}),
  };

  return {
    ...base,
    ...persistedOverrides,
    cirConfig: hydratedCirConfig,
    courses: liveCourses,
    mentors: liveMentors,
    mentorBookings: liveMentorBookings,
    hackathons: liveHackathons,
    networkingEvents: liveNetworkingEvents,
    freelanceProjects: liveFreelanceProjects,
    coupons: liveCoupons,
    interviews: liveInterviews,
    notifications: liveBroadcasts,
    questionBank: liveQuestions.length ? liveQuestions : (persistedOverrides.questionBank || []),
  };
}
