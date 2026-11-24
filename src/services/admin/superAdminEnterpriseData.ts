// Comprehensive Enterprise Super Admin Data Layer (Modules 01–20 + 7 Platform Capabilities)
// Complements superAdminData.ts without altering any existing snapshot structures.

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
  domain: "Employer KYB" | "Job Postings" | "Refund Requests" | "Course Approvals" | "Mentor Onboarding" | "Freelance Projects";
  levels: string;
  autoApproveRule: string;
  slaHours: number;
  enabled: boolean;
}

export interface FraudAlertRecord {
  id: string;
  code: string;
  type: "Fake Profile" | "Suspicious Application Burst" | "Duplicate GSTIN" | "Proctoring Collusion" | "Payment Velocity";
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

export const REGISTRATION_TREND_SERIES = [
  { month: "Jun", candidates: 1420, employers: 96 },
  { month: "Jul", candidates: 1890, employers: 128 },
  { month: "Aug", candidates: 2340, employers: 164 },
  { month: "Sep", candidates: 2810, employers: 205 },
  { month: "Oct", candidates: 3290, employers: 248 },
  { month: "Nov", candidates: 3840, employers: 294 },
];

export const DOMAIN_CIR_ANALYTICS = [
  { domain: "Full-Stack", avgCir: 84, passRate: 78, attempts: 1240 },
  { domain: "Data & AI", avgCir: 81, passRate: 72, attempts: 980 },
  { domain: "Cloud / DevOps", avgCir: 79, passRate: 69, attempts: 640 },
  { domain: "Product", avgCir: 86, passRate: 83, attempts: 510 },
  { domain: "FinTech / QA", avgCir: 77, passRate: 74, attempts: 430 },
];

export function createInitialEnterpriseState(): SuperAdminEnterpriseState {
  return {
    roles: [
      {
        key: "super_admin",
        name: "Super Admin",
        department: "Executive Ops",
        assignedUsers: 2,
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
        assignedUsers: 3,
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
        assignedUsers: 4,
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
        assignedUsers: 4,
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
        assignedUsers: 6,
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
    staffAccounts: [
      {
        id: "stf-01",
        code: "ADM-001",
        fullName: "Arjun Deshmukh",
        email: "arjun.ops@talentcir.com",
        phone: "+91 98450 11220",
        roleKey: "super_admin",
        roleLabel: "Super Admin",
        department: "Executive Ops",
        status: "active",
        mfaEnabled: true,
        lastLoginAt: new Date(Date.now() - 60000 * 18).toISOString(),
        lastIp: "49.207.184.12",
        notes: "Primary platform custodian with production approval sign-off",
      },
      {
        id: "stf-02",
        code: "ADM-004",
        fullName: "Nandini Iyer",
        email: "finance@talentcir.com",
        phone: "+91 98201 77410",
        roleKey: "finance_admin",
        roleLabel: "Finance Admin",
        department: "Finance & GST",
        status: "active",
        mfaEnabled: true,
        lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        lastIp: "103.211.54.90",
        notes: "Handles GSTR-1 filings, Razorpay reconciliations, and mentor payouts",
      },
      {
        id: "stf-03",
        code: "ADM-009",
        fullName: "Rohan Verma",
        email: "trust@talentcir.com",
        phone: "+91 99100 44821",
        roleKey: "recruitment_admin",
        roleLabel: "Recruitment Admin",
        department: "Marketplace Ops",
        status: "active",
        mfaEnabled: true,
        lastLoginAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        lastIp: "106.51.72.14",
        notes: "Reviews enterprise KYB filings and moderates urgent job listings",
      },
      {
        id: "stf-04",
        code: "ADM-014",
        fullName: "Dr. Kavita Menon",
        email: "assessments@talentcir.com",
        phone: "+91 98802 33915",
        roleKey: "learning_admin",
        roleLabel: "Learning & CIR Admin",
        department: "Academics & Integrity",
        status: "active",
        mfaEnabled: true,
        lastLoginAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        lastIp: "122.172.88.45",
        notes: "Owns CIR scoring calibration, question bank review, and course approvals",
      },
      {
        id: "stf-05",
        code: "ADM-019",
        fullName: "Pooja Kulkarni",
        email: "support.lead@talentcir.com",
        phone: "+91 97654 20190",
        roleKey: "support_admin",
        roleLabel: "Support & Grievance Admin",
        department: "Trust & Support",
        status: "active",
        mfaEnabled: false,
        lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
        lastIp: "115.244.19.62",
        notes: "Leads SLA escalation desk and candidate KYC verification follow-ups",
      },
    ],
    aiFeatures: [
      {
        id: "ai-01",
        name: "AI Resume Builder",
        category: "Candidate AI",
        enabled: true,
        model: "gemini-2.5-flash",
        monthlyRequests: 18420,
        tokensUsedM: 42.6,
        costInr: 14800,
        accuracyPct: 96.4,
        failedRequests: 12,
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
        monthlyRequests: 11250,
        tokensUsedM: 38.1,
        costInr: 22400,
        accuracyPct: 94.8,
        failedRequests: 8,
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
        monthlyRequests: 7840,
        tokensUsedM: 61.4,
        costInr: 36900,
        accuracyPct: 95.1,
        failedRequests: 19,
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
        monthlyRequests: 64100,
        tokensUsedM: 19.2,
        costInr: 8200,
        accuracyPct: 97.2,
        failedRequests: 4,
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
        monthlyRequests: 14900,
        tokensUsedM: 21.8,
        costInr: 9100,
        accuracyPct: 95.6,
        failedRequests: 6,
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
        monthlyRequests: 9320,
        tokensUsedM: 54.0,
        costInr: 31500,
        accuracyPct: 98.1,
        failedRequests: 3,
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
        monthlyRequests: 12180,
        tokensUsedM: 6.4,
        costInr: 3400,
        accuracyPct: 91.8,
        failedRequests: 5,
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
        monthlyRequests: 5410,
        tokensUsedM: 28.9,
        costInr: 16200,
        accuracyPct: 93.7,
        failedRequests: 11,
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
        monthlyRequests: 22450,
        tokensUsedM: 14.3,
        costInr: 5800,
        accuracyPct: 94.4,
        failedRequests: 2,
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
        monthlyRequests: 4860,
        tokensUsedM: 49.5,
        costInr: 29400,
        accuracyPct: 96.8,
        failedRequests: 9,
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
        monthlyRequests: 16300,
        tokensUsedM: 27.1,
        costInr: 11200,
        accuracyPct: 95.9,
        failedRequests: 7,
        freeTierLimit: "20 turns / week",
        proTierLimit: "Unlimited guided roadmap",
        systemPrompt: "Provide step-by-step career transition guidance grounded in TalentCIR assessments and open jobs.",
      },
    ],
    aiLogs: [
      {
        id: "ailog-01",
        timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
        feature: "AI Career Intelligence (CIR)",
        actor: "Yogesh (IAT-CIR-900124)",
        model: "gemini-2.5-pro",
        tokens: 5840,
        latencyMs: 1420,
        status: "success",
        summary: "Generated verified CIR report v3.2 · Overall 91/100 (96th percentile)",
      },
      {
        id: "ailog-02",
        timestamp: new Date(Date.now() - 60000 * 19).toISOString(),
        feature: "AI Interview Copilot (Linda)",
        actor: "Super30 Technologies",
        model: "gemini-2.5-pro-realtime",
        tokens: 9120,
        latencyMs: 980,
        status: "success",
        summary: "Scored 35-minute L2 React architecture interview with rubric confidence 97%",
      },
      {
        id: "ailog-03",
        timestamp: new Date(Date.now() - 60000 * 47).toISOString(),
        feature: "AI Mock Interview",
        actor: "Aravind Krishnan",
        model: "gemini-2.5-pro-realtime",
        tokens: 0,
        latencyMs: 12040,
        status: "failed",
        summary: "WebRTC audio buffer timeout on client reconnect · auto-retried cleanly",
      },
      {
        id: "ailog-04",
        timestamp: new Date(Date.now() - 3600000 * 1.4).toISOString(),
        feature: "AI Resume Screening",
        actor: "FinStack Payments India",
        model: "gemini-2.5-pro",
        tokens: 14200,
        latencyMs: 2150,
        status: "success",
        summary: "Ranked 48 applicants for Founding Payment Systems Engineer (Go/Rust)",
      },
    ],
    courses: [
      {
        id: "crs-01",
        code: "CRS-AI-101",
        title: "AI Engineer & Agentic Workflows Production Track",
        category: "Applied GenAI",
        domain: "Data & AI",
        instructor: "Siddharth Rao",
        tier: "Paid",
        priceInr: 4999,
        featured: true,
        approvalStatus: "approved",
        modulesCount: 8,
        videoLessons: 42,
        pdfResources: 18,
        quizzesCount: 16,
        enrolledCount: 1420,
        activeLearners: 890,
        completedCount: 1051,
        avgRating: 4.9,
        certificatesIssued: 982,
        refundsCount: 6,
        revenueInr: 284000,
      },
      {
        id: "crs-02",
        code: "CRS-FS-204",
        title: "Full-Stack React, TypeScript & Distributed APIs",
        category: "Web Engineering",
        domain: "Software Engineering",
        instructor: "Ananya Deshpande",
        tier: "Paid",
        priceInr: 3499,
        featured: true,
        approvalStatus: "approved",
        modulesCount: 10,
        videoLessons: 56,
        pdfResources: 24,
        quizzesCount: 20,
        enrolledCount: 1185,
        activeLearners: 640,
        completedCount: 814,
        avgRating: 4.8,
        certificatesIssued: 790,
        refundsCount: 4,
        revenueInr: 196500,
      },
      {
        id: "crs-03",
        code: "CRS-CL-118",
        title: "Kubernetes, Terraform & Multi-Region AWS Readiness",
        category: "Cloud Infrastructure",
        domain: "Cloud & DevOps",
        instructor: "Vikram Malhotra",
        tier: "Free",
        priceInr: 0,
        featured: false,
        approvalStatus: "approved",
        modulesCount: 6,
        videoLessons: 28,
        pdfResources: 14,
        quizzesCount: 12,
        enrolledCount: 2140,
        activeLearners: 1120,
        completedCount: 1480,
        avgRating: 4.7,
        certificatesIssued: 1320,
        refundsCount: 0,
        revenueInr: 0,
      },
      {
        id: "crs-04",
        code: "CRS-FIN-305",
        title: "High-Throughput UPI, ISO-8583 & Rust Payment Engines",
        category: "FinTech Systems",
        domain: "FinTech",
        instructor: "Meera Krishnan",
        tier: "Paid",
        priceInr: 5999,
        featured: false,
        approvalStatus: "pending_approval",
        modulesCount: 7,
        videoLessons: 34,
        pdfResources: 16,
        quizzesCount: 14,
        enrolledCount: 0,
        activeLearners: 0,
        completedCount: 0,
        avgRating: 0,
        certificatesIssued: 0,
        refundsCount: 0,
        revenueInr: 0,
      },
      {
        id: "crs-05",
        code: "CRS-PM-210",
        title: "Product Analytics, SQL Experimentation & Growth Metrics",
        category: "Product & Data",
        domain: "Product Management",
        instructor: "Ritu Sharma",
        tier: "Paid",
        priceInr: 3499,
        featured: false,
        approvalStatus: "pending_approval",
        modulesCount: 6,
        videoLessons: 30,
        pdfResources: 12,
        quizzesCount: 10,
        enrolledCount: 0,
        activeLearners: 0,
        completedCount: 0,
        avgRating: 0,
        certificatesIssued: 0,
        refundsCount: 0,
        revenueInr: 0,
      },
    ],
    mentors: [
      {
        id: "mnt-01",
        code: "MNT-101",
        fullName: "Siddharth Rao",
        email: "siddharth.rao@talentcir.com",
        headline: "Principal AI Architect · Ex-Google Cloud",
        domain: "Data & AI",
        company: "Super30 Technologies",
        verificationStatus: "verified",
        availability: "Available",
        hourlyRateInr: 1499,
        sessionsUpcoming: 11,
        sessionsCompleted: 148,
        sessionsCancelled: 4,
        rating: 4.94,
        reviewsCount: 132,
        totalPayoutInr: 188600,
        pendingPayoutInr: 14200,
        assignedCourses: ["CRS-AI-101"],
      },
      {
        id: "mnt-02",
        code: "MNT-108",
        fullName: "Ananya Deshpande",
        email: "ananya.d@talentcir.com",
        headline: "Staff Frontend & Design Systems Engineer",
        domain: "Software Engineering",
        company: "Atlassian India",
        verificationStatus: "verified",
        availability: "Limited Slots",
        hourlyRateInr: 999,
        sessionsUpcoming: 7,
        sessionsCompleted: 96,
        sessionsCancelled: 2,
        rating: 4.88,
        reviewsCount: 84,
        totalPayoutInr: 81500,
        pendingPayoutInr: 6800,
        assignedCourses: ["CRS-FS-204"],
      },
      {
        id: "mnt-03",
        code: "MNT-115",
        fullName: "Karthikeya Nair",
        email: "karthikeya.n@finlabs.in",
        headline: "VP Engineering · Distributed Ledgers",
        domain: "FinTech",
        company: "FinStack Payments",
        verificationStatus: "pending",
        availability: "Available",
        hourlyRateInr: 1999,
        sessionsUpcoming: 0,
        sessionsCompleted: 0,
        sessionsCancelled: 0,
        rating: 0,
        reviewsCount: 0,
        totalPayoutInr: 0,
        pendingPayoutInr: 0,
        assignedCourses: [],
      },
    ],
    mentorBookings: [
      {
        id: "mbk-01",
        code: "SES-8812",
        mentorName: "Siddharth Rao",
        candidateName: "Yogesh",
        topic: "Agentic RAG System Design & CIR Review",
        scheduledAt: "Tomorrow · 19:00 IST",
        durationMin: 45,
        feeInr: 1499,
        status: "upcoming",
      },
      {
        id: "mbk-02",
        code: "SES-8809",
        mentorName: "Ananya Deshpande",
        candidateName: "Divya Nair",
        topic: "React Performance & Mock L2 Frontend Round",
        scheduledAt: "Completed · 2 days ago",
        durationMin: 60,
        feeInr: 999,
        status: "completed",
        rating: 5,
      },
      {
        id: "mbk-03",
        code: "SES-8804",
        mentorName: "Siddharth Rao",
        candidateName: "Aravind Krishnan",
        topic: "Distributed Consensus & Failover Patterns",
        scheduledAt: "Cancelled · 4 days ago",
        durationMin: 45,
        feeInr: 1499,
        status: "cancelled",
      },
    ],
    talentRequests: [
      {
        id: "trq-01",
        code: "CRM-401",
        employerName: "Super30 Technologies",
        roleTitle: "Senior React & TypeScript Engineer",
        minCirScore: 85,
        requiredSkills: ["React", "TypeScript", "System Design"],
        location: "Bengaluru / Hybrid",
        shortlistedCount: 14,
        status: "shortlist_shared",
        ownerAdmin: "Rohan Verma",
        createdAt: "2 days ago",
      },
      {
        id: "trq-02",
        code: "CRM-404",
        employerName: "FinStack Payments India Pvt. Ltd.",
        roleTitle: "Go / Rust Core Payments Engineer",
        minCirScore: 82,
        requiredSkills: ["Go", "Rust", "PostgreSQL", "Kafka"],
        location: "Mumbai",
        shortlistedCount: 6,
        status: "open",
        ownerAdmin: "Rohan Verma",
        createdAt: "6 hours ago",
      },
    ],
    interviews: [
      {
        id: "int-01",
        code: "INT-7012",
        type: "Employer Interview",
        candidateName: "Yogesh",
        employerOrHost: "Super30 Technologies",
        roleTitle: "Senior Full-Stack Engineer",
        scheduledAt: "Tomorrow · 11:30 IST",
        status: "upcoming",
        aiScore: 92,
        feedbackSummary: "Pre-screened with 91 CIR; Linda Copilot enabled for live architecture round",
        outcome: "Pending",
      },
      {
        id: "int-02",
        code: "INT-7008",
        type: "AI Mock Interview",
        candidateName: "Divya Nair",
        employerOrHost: "Linda AI Interviewer",
        roleTitle: "Frontend Architect Track",
        scheduledAt: "2 days ago",
        status: "completed",
        aiScore: 89,
        panelRating: 4.7,
        feedbackSummary: "Strong state management & accessibility depth; tighten complexity analysis",
        outcome: "Next Round",
      },
      {
        id: "int-03",
        code: "INT-6999",
        type: "Employer Interview",
        candidateName: "Rahul Mehta",
        employerOrHost: "Super30 Technologies",
        roleTitle: "Cloud Platform Engineer",
        scheduledAt: "4 days ago",
        status: "completed",
        aiScore: 87,
        panelRating: 4.8,
        feedbackSummary: "Cleared Kubernetes & incident debugging scenario; recommended for offer",
        outcome: "Selected",
      },
      {
        id: "int-04",
        code: "INT-6992",
        type: "Employer Interview",
        candidateName: "Aravind Krishnan",
        employerOrHost: "NeuralForge Robotics Labs",
        roleTitle: "Autonomy Systems Engineer",
        scheduledAt: "5 days ago",
        status: "disputed",
        aiScore: 76,
        feedbackSummary: "Candidate reported panelist no-show after 15m wait; reschedule requested",
        outcome: "Pending",
      },
    ],
    hackathons: [
      {
        id: "hck-01",
        code: "HACK-S4",
        title: "Code Arena · Season 4 (National AI & Systems Challenge)",
        industry: "Software & AI",
        city: "Bengaluru",
        mode: "Hybrid",
        status: "live",
        sponsors: ["Super30 Technologies", "FinStack Payments"],
        participants: 2840,
        teams: 712,
        submissions: 486,
        prizePoolInr: 1000000,
        jobAuctionBids: 34,
        schedule: "Finals · Dec 14–15, 2026",
      },
      {
        id: "hck-02",
        code: "HACK-FIN-02",
        title: "FinTech Real-Time Payments Sprint",
        industry: "FinTech",
        city: "Mumbai",
        mode: "Hybrid",
        status: "upcoming",
        sponsors: ["FinStack Payments"],
        participants: 920,
        teams: 230,
        submissions: 0,
        prizePoolInr: 500000,
        jobAuctionBids: 0,
        schedule: "Jan 18–19, 2027",
      },
      {
        id: "hck-03",
        code: "HACK-S3",
        title: "Code Arena · Season 3 (Cloud Native Builders)",
        industry: "Cloud & DevOps",
        city: "Hyderabad",
        mode: "Hybrid",
        status: "completed",
        sponsors: ["Super30 Technologies"],
        participants: 2150,
        teams: 540,
        submissions: 412,
        prizePoolInr: 750000,
        jobAuctionBids: 29,
        winnerTeam: "Team ByteForge (Yogesh & 3 others)",
        runnerUpTeam: "Team KubePulse",
        schedule: "Completed · Aug 2026",
      },
    ],
    networkingEvents: [
      {
        id: "net-01",
        code: "NET-BLR-11",
        title: "Bengaluru CTO & Verified Builders Roundtable",
        industry: "Software & AI",
        city: "Bengaluru",
        status: "upcoming",
        registrations: 185,
        attended: 0,
        speakers: ["Siddharth Rao", "Ananya Rao (Super30)"],
        sponsors: ["Super30 Technologies"],
        ticketPriceInr: 499,
        feedbackScore: 4.9,
        dateLabel: "Dec 6, 2026 · Indiranagar",
      },
      {
        id: "net-02",
        code: "NET-MUM-08",
        title: "Mumbai FinTech Founders & Staff Engineers Mixer",
        industry: "FinTech",
        city: "Mumbai",
        status: "upcoming",
        registrations: 142,
        attended: 0,
        speakers: ["Meera Krishnan (FinStack)"],
        sponsors: ["FinStack Payments"],
        ticketPriceInr: 699,
        feedbackScore: 4.8,
        dateLabel: "Dec 19, 2026 · BKC",
      },
      {
        id: "net-03",
        code: "NET-HYD-05",
        title: "Hyderabad DeepTech & Product Hiring Evening",
        industry: "Data & AI",
        city: "Hyderabad",
        status: "completed",
        registrations: 160,
        attended: 146,
        speakers: ["Vikramaditya Reddy"],
        sponsors: ["NeuralForge Robotics"],
        ticketPriceInr: 499,
        feedbackScore: 4.85,
        dateLabel: "Completed · Oct 2026 · T-Hub",
      },
    ],
    webinars: [
      {
        id: "web-01",
        code: "WEB-412",
        title: "Cracking 90+ CIR Scores in System Design & Coding",
        hostMentor: "Siddharth Rao",
        category: "CIR Prep",
        status: "upcoming",
        registrations: 860,
        avgWatchPct: 0,
        dateLabel: "Nov 29, 2026 · 18:00 IST",
      },
      {
        id: "web-02",
        code: "WEB-398",
        title: "Employer Playbook: Zero-Cheat 30-Layer Campus Screening",
        hostMentor: "Dr. Kavita Menon",
        category: "Employer Ops",
        status: "recorded",
        registrations: 410,
        avgWatchPct: 82,
        dateLabel: "Recorded · Nov 2026",
      },
    ],
    freelanceProjects: [
      {
        id: "frl-01",
        code: "PRJ-501",
        title: "Design System Migration & Accessibility Audit (React 19)",
        clientName: "Super30 Technologies",
        freelancerName: "Yogesh",
        category: "Frontend Engineering",
        budgetInr: 85000,
        proposalsCount: 12,
        status: "active",
        escrowStatus: "Funded",
      },
      {
        id: "frl-02",
        code: "PRJ-504",
        title: "UPI Reconciliation Dashboard & GST Export Pipeline",
        clientName: "FinStack Payments India",
        freelancerName: "Divya Nair",
        category: "Full-Stack / FinTech",
        budgetInr: 120000,
        proposalsCount: 9,
        status: "pending_approval",
        escrowStatus: "Funded",
      },
      {
        id: "frl-03",
        code: "PRJ-492",
        title: "Kubernetes Cost Optimization & Autoscaling Playbook",
        clientName: "BrightCart D2C Commerce",
        freelancerName: "Rahul Mehta",
        category: "Cloud & DevOps",
        budgetInr: 64000,
        proposalsCount: 7,
        status: "completed",
        escrowStatus: "Released",
        rating: 4.9,
      },
      {
        id: "frl-04",
        code: "PRJ-489",
        title: "Growth Attribution SQL Warehouse Setup",
        clientName: "BrightCart D2C Commerce",
        freelancerName: "Sneha Kulkarni",
        category: "Data Analytics",
        budgetInr: 48000,
        proposalsCount: 5,
        status: "disputed",
        escrowStatus: "Held (Dispute)",
      },
    ],
    plans: [
      {
        id: "pln-01",
        code: "CAND-PRO",
        name: "Candidate Pro (CIR + AI Career Suite)",
        segment: "Candidate Plans",
        priceInr: 1499,
        billingCycle: "Quarterly",
        activeSubscribers: 642,
        trialUsers: 118,
        validityDays: 90,
        features: ["2 proctored CIR assessments", "Unlimited AI Resume & Mock Interviews", "Verified badge & recruiter priority"],
        status: "active",
      },
      {
        id: "pln-02",
        code: "EMP-GROWTH",
        name: "Employer Growth Pro",
        segment: "Employer Plans",
        priceInr: 19999,
        billingCycle: "Monthly",
        activeSubscribers: 38,
        trialUsers: 14,
        validityDays: 30,
        features: ["15 active jobs", "25 CIR profile unlocks/mo", "Linda AI Interview Copilot"],
        status: "active",
      },
      {
        id: "pln-03",
        code: "EMP-ENT",
        name: "Enterprise Annual Hiring Suite",
        segment: "Custom Enterprise",
        priceInr: 49999,
        billingCycle: "Monthly",
        activeSubscribers: 12,
        trialUsers: 2,
        validityDays: 365,
        features: ["Unlimited jobs & campus drives", "100 CIR unlocks/mo", "White-label assessments & dedicated AM"],
        status: "active",
      },
      {
        id: "pln-04",
        code: "CIR-PACK",
        name: "Multi-Domain Assessment Bundle (3 Tracks)",
        segment: "Assessment Plans",
        priceInr: 1999,
        billingCycle: "One-time",
        activeSubscribers: 418,
        trialUsers: 0,
        validityDays: 180,
        features: ["3 domain CIR exams", "1 free retest", "Shareable cryptographic credential"],
        status: "active",
      },
      {
        id: "pln-05",
        code: "LMS-CORP",
        name: "Corporate L&D Team License (25 Seats)",
        segment: "Corporate Learning",
        priceInr: 45000,
        billingCycle: "Quarterly",
        activeSubscribers: 9,
        trialUsers: 3,
        validityDays: 90,
        features: ["All LMS tracks", "Manager progress analytics", "Pre/post CIR skill benchmarking"],
        status: "active",
      },
      {
        id: "pln-06",
        code: "AI-BOOST",
        name: "AI Feature Add-On Pack",
        segment: "AI Feature Plans",
        priceInr: 499,
        billingCycle: "Monthly",
        activeSubscribers: 215,
        trialUsers: 44,
        validityDays: 30,
        features: ["10 Linda AI mock interviews", "Unlimited Communication Coach", "Salary percentile alerts"],
        status: "active",
      },
      {
        id: "pln-07",
        code: "AD-SPOT",
        name: "Sponsored Job & Hackathon Spotlight",
        segment: "Advertisement Plans",
        priceInr: 4999,
        billingCycle: "One-time",
        activeSubscribers: 27,
        trialUsers: 0,
        validityDays: 14,
        features: ["Top search placement", "Email blast to matched CIR talent", "Conversion analytics"],
        status: "active",
      },
    ],
    coupons: [
      { id: "cpn-01", code: "LAUNCH10", discountLabel: "10% off up to ₹5,000", appliesTo: "Employer Plans", redemptions: 24, maxRedemptions: 100, expiresAt: "2026-12-31", status: "active" },
      { id: "cpn-02", code: "CIR2026", discountLabel: "₹300 flat off", appliesTo: "Candidate Assessments", redemptions: 182, maxRedemptions: 500, expiresAt: "2026-12-15", status: "active" },
      { id: "cpn-03", code: "CAMPUS50", discountLabel: "50% student waiver", appliesTo: "Hackathon & LMS", redemptions: 95, maxRedemptions: 100, expiresAt: "2026-11-30", status: "active" },
    ],
    payouts: [
      {
        id: "pay-01",
        code: "PO-2026-441",
        recipientType: "Mentor",
        recipientName: "Siddharth Rao",
        grossInr: 16700,
        commissionPct: 15,
        netPayoutInr: 14195,
        bankRef: "IMPS-HDFC-881204",
        status: "pending",
        scheduledFor: "Nov 28, 2026",
      },
      {
        id: "pay-02",
        code: "PO-2026-439",
        recipientType: "Freelancer",
        recipientName: "Rahul Mehta",
        grossInr: 64000,
        commissionPct: 10,
        netPayoutInr: 57600,
        bankRef: "NEFT-ICIC-774129",
        status: "processed",
        scheduledFor: "Nov 20, 2026",
      },
      {
        id: "pay-03",
        code: "PO-2026-442",
        recipientType: "Freelancer",
        recipientName: "Sneha Kulkarni",
        grossInr: 48000,
        commissionPct: 10,
        netPayoutInr: 43200,
        bankRef: "ESCROW-HOLD-489",
        status: "on_hold",
        scheduledFor: "Pending dispute resolution",
      },
    ],
    cmsPages: [
      { id: "cms-01", title: "Homepage", route: "/", sectionGroup: "Website CMS", status: "published", seoTitle: "TalentCIR · Verified Career Intelligence & Hiring", lastUpdated: "2 days ago", updatedBy: "Arjun Deshmukh" },
      { id: "cms-02", title: "For Employers (Proof Era)", route: "/employers-page-2", sectionGroup: "Website CMS", status: "published", seoTitle: "Hire Verified CIR Talent · TalentCIR", lastUpdated: "3 days ago", updatedBy: "Rohan Verma" },
      { id: "cms-03", title: "Skill Assessments & CIR", route: "/assessments/explore", sectionGroup: "Website CMS", status: "published", seoTitle: "Proctored Skill Assessments · TalentCIR", lastUpdated: "5 days ago", updatedBy: "Dr. Kavita Menon" },
      { id: "cms-04", title: "Learning & Courses Hub", route: "/learning", sectionGroup: "Website CMS", status: "published", seoTitle: "Career Learning Tracks · TalentCIR", lastUpdated: "6 days ago", updatedBy: "Dr. Kavita Menon" },
      { id: "cms-05", title: "Hackathons (Code Arena S4)", route: "/hackathon3", sectionGroup: "Website CMS", status: "published", seoTitle: "Code Arena Season 4 · TalentCIR", lastUpdated: "1 day ago", updatedBy: "Arjun Deshmukh" },
      { id: "cms-06", title: "Networking Events Calendar", route: "/networking", sectionGroup: "Website CMS", status: "published", seoTitle: "City Networking Mixers · TalentCIR", lastUpdated: "4 days ago", updatedBy: "Pooja Kulkarni" },
      { id: "cms-07", title: "Pricing (Candidates & Employers)", route: "/pricing", sectionGroup: "Website CMS", status: "published", seoTitle: "Pricing & Enterprise Plans · TalentCIR", lastUpdated: "2 days ago", updatedBy: "Nandini Iyer" },
      { id: "cms-08", title: "Terms & Conditions / Privacy Policy", route: "/legal", sectionGroup: "Legal", status: "published", seoTitle: "Legal, DPDP & Terms · TalentCIR", lastUpdated: "14 days ago", updatedBy: "Arjun Deshmukh" },
      { id: "cms-09", title: "Case Study: Super30 3.2× Faster Technical Shortlisting", route: "/stories/super30", sectionGroup: "Content", status: "published", seoTitle: "Super30 Case Study · TalentCIR", lastUpdated: "7 days ago", updatedBy: "Rohan Verma" },
      { id: "cms-10", title: "Blog: Why 30-Layer Proctoring Replaces Take-Home Tests", route: "/blog/30-layer-proctoring", sectionGroup: "Content", status: "draft", seoTitle: "30-Layer Proctoring Explained · TalentCIR", lastUpdated: "Today", updatedBy: "Dr. Kavita Menon" },
    ],
    campaigns: [
      { id: "cmp-01", code: "MKT-209", name: "Code Arena Season 4 Final Call (Bengaluru & Hyd)", channel: "WhatsApp", audience: "Candidates · Software & AI", sentCount: 8420, openRatePct: 78.4, conversionPct: 16.2, status: "active" },
      { id: "cmp-02", code: "MKT-212", name: "Incomplete Employer Profile Completion Nudge", channel: "Email", audience: "Employers · <100% profile", sentCount: 312, openRatePct: 54.8, conversionPct: 24.5, status: "active" },
      { id: "cmp-03", code: "MKT-214", name: "CIR Retest Score-Boost Reminder (30d Cohort)", channel: "Push", audience: "Candidates · 1-time test takers", sentCount: 3250, openRatePct: 41.2, conversionPct: 11.8, status: "scheduled" },
      { id: "cmp-04", code: "MKT-205", name: "Refer a Verified Builder · ₹250 Wallet Credit", channel: "Referral", audience: "Verified Candidates (CIR ≥ 80)", sentCount: 4100, openRatePct: 62.0, conversionPct: 19.4, status: "completed" },
    ],
    notifications: [
      { id: "ntf-01", title: "Code Arena Season 4 submission deadline in 48 hours", channel: "Push", audience: "Candidates Only", segmentDetail: "Hackathon participants", status: "sent", deliveredCount: 2840, openRatePct: 69.2, sentAt: "3 hours ago" },
      { id: "ntf-02", title: "New GSTR-1 invoice credit cycle available in Billing", channel: "Email", audience: "Employers Only", segmentDetail: "Premium Enterprise & Growth", status: "sent", deliveredCount: 50, openRatePct: 84.0, sentAt: "1 day ago" },
      { id: "ntf-03", title: "Complete company KYB to unlock job publishing", channel: "WhatsApp", audience: "Segmented", segmentDetail: "Incomplete employer profiles (<100%)", status: "automated", deliveredCount: 118, openRatePct: 76.5, sentAt: "Automated · Daily 10:00 IST" },
    ],
    kbArticles: [
      { id: "kb-01", code: "KB-104", title: "How 30-Layer AI Proctoring Flags Are Reviewed & Cleared", audience: "Candidate", views: 4820, helpfulPct: 94, status: "published", updatedAt: "5 days ago" },
      { id: "kb-02", code: "KB-112", title: "Uploading GSTIN, CIN & PAN for Instant Employer KYB Approval", audience: "Employer", views: 1940, helpfulPct: 96, status: "published", updatedAt: "3 days ago" },
      { id: "kb-03", code: "KB-119", title: "B2B GST Input Tax Credit & Credit Note Refund Timelines", audience: "Billing", views: 1280, helpfulPct: 91, status: "published", updatedAt: "8 days ago" },
      { id: "kb-04", code: "KB-125", title: "Mentor Payout Schedule & Commission Deductions", audience: "Mentor", views: 740, helpfulPct: 92, status: "published", updatedAt: "12 days ago" },
    ],
    approvalWorkflows: [
      { id: "wf-01", domain: "Employer KYB", levels: "L1 Recruitment Admin → L2 Super Admin (Enterprise)", autoApproveRule: "Never (manual GSTIN/CIN match mandatory)", slaHours: 4, enabled: true },
      { id: "wf-02", domain: "Job Postings", levels: "L1 Automated Salary/Spam Check → L2 Recruitment Admin", autoApproveRule: "Auto-publish for KYB-verified Enterprise tenants", slaHours: 2, enabled: true },
      { id: "wf-03", domain: "Refund Requests", levels: "L1 Support Admin → L2 Finance Admin (>₹2,500)", autoApproveRule: "Auto-approve duplicate payment failures <₹1,500", slaHours: 12, enabled: true },
      { id: "wf-04", domain: "Course Approvals", levels: "L1 Learning & CIR Admin curriculum QA", autoApproveRule: "Manual syllabus & video compliance audit", slaHours: 24, enabled: true },
      { id: "wf-05", domain: "Mentor Onboarding", levels: "L1 Learning Admin LinkedIn & Experience Verification", autoApproveRule: "Manual credential verification required", slaHours: 24, enabled: true },
      { id: "wf-06", domain: "Freelance Projects", levels: "L1 Escrow Funding Check → L2 Marketplace Ops", autoApproveRule: "Auto-approve funded projects from verified employers", slaHours: 6, enabled: true },
    ],
    fraudAlerts: [
      {
        id: "frd-01",
        code: "FRD-902",
        type: "Proctoring Collusion",
        entityName: "Attempt ATT-2026-4913 · Aravind Krishnan",
        riskScore: 74,
        signals: "Secondary HDMI display detected + 3 tab focus losses in coding section",
        status: "investigating",
        detectedAt: "2 hours ago",
      },
      {
        id: "frd-02",
        code: "FRD-905",
        type: "Suspicious Application Burst",
        entityName: "IP Cluster 185.220.101.42 · 42 req/min",
        riskScore: 92,
        signals: "Automated OTP & rapid job-apply pattern blocked by edge rate limiter",
        status: "open",
        detectedAt: "5 hours ago",
      },
      {
        id: "frd-03",
        code: "FRD-899",
        type: "Duplicate GSTIN",
        entityName: "Draft Signup · QuickHire Staffing LLP",
        riskScore: 86,
        signals: "GSTIN matched an already suspended agency tenant record",
        status: "resolved",
        detectedAt: "2 days ago",
      },
    ],
    automations: [
      { id: "aut-01", name: "Incomplete Employer Profile Reminder", trigger: "Employer profile <100% after 48h", action: "Send Email + WhatsApp onboarding checklist", channel: "Email + WhatsApp", runsLast30d: 142, enabled: true },
      { id: "aut-02", name: "Subscription Renewal 7-Day Alert", trigger: "Plan expires within 7 days", action: "Send Razorpay auto-pay / invoice renewal reminder", channel: "Email", runsLast30d: 89, enabled: true },
      { id: "aut-03", name: "CIR Retest Cooldown Unlocked", trigger: "30 days after 1st assessment attempt", action: "Notify candidate of score-boost retest window", channel: "Push + Email", runsLast30d: 416, enabled: true },
      { id: "aut-04", name: "High-Risk Proctoring Escalation", trigger: "Proctor trust score <75%", action: "Hold CIR credential & create Integrity Desk ticket", channel: "System Alert", runsLast30d: 27, enabled: true },
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
    questionBank: [
      { id: "qb-01", code: "Q-SYS-402", domain: "Software Engineering", type: "Coding", difficulty: "Hard", prompt: "Design a distributed rate limiter with sliding-window counters in Redis + PostgreSQL fallback", usageCount: 412, avgPassPct: 64 },
      { id: "qb-02", code: "Q-AI-219", domain: "Data & AI", type: "Technical", difficulty: "Medium", prompt: "Evaluate hybrid dense + BM25 retrieval reranking latency vs recall trade-offs", usageCount: 318, avgPassPct: 71 },
      { id: "qb-03", code: "Q-APT-108", domain: "Core Readiness", type: "Aptitude", difficulty: "Medium", prompt: "Multi-stage funnel conversion & cohort retention numerical interpretation set", usageCount: 1290, avgPassPct: 79 },
      { id: "qb-04", code: "Q-COM-154", domain: "Core Readiness", type: "Communication", difficulty: "Easy", prompt: "60-second executive architecture incident postmortem delivery & clarity rubric", usageCount: 980, avgPassPct: 84 },
      { id: "qb-05", code: "Q-BEH-091", domain: "Leadership", type: "Behavioural", difficulty: "Medium", prompt: "Resolving conflicting product release deadlines with security compliance blockers", usageCount: 645, avgPassPct: 82 },
    ],
    complianceRequests: [
      { id: "cmp-req-01", code: "DPDP-204", userEmail: "rohit.sharma@example.com", type: "DPDP Data Export", status: "pending", requestedAt: "Yesterday", dueBy: "Nov 30, 2026" },
      { id: "cmp-req-02", code: "DPDP-198", userEmail: "old.account@example.com", type: "Account Deletion", status: "completed", requestedAt: "6 days ago", dueBy: "Completed" },
    ],
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
