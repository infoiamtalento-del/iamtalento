import { supabase } from "@/integrations/supabase/client";
import { SHOWCASE_COMPANIES } from "@/data/showcaseCompanies";
import { CANDIDATES_SEED, DEFAULT_USERS } from "@/data/proData";
import { DEMO_EMPLOYER_JOBS, DEMO_EMPLOYER_APPS } from "@/data/employerDemo";
import { getCandidatePhoto } from "@/data/portalAssets";

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
    | "Talent Package"
    | "Assessment Fee"
    | "Learning & Mentorship"
    | "Hackathon"
    | "Networking"
    | "Job Promotion"
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
  category: "Billing & GST" | "Verification / KYC" | "Assessment Proctoring" | "ATS & Job Posting" | "Account Security";
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

export interface SuperAdminSnapshot {
  syncedAt: string;
  liveDbConnected: boolean;
  liveProfilesCount: number;
  liveEmployersCount: number;
  liveJobsCount: number;
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

export async function fetchSuperAdminSnapshot(): Promise<SuperAdminSnapshot> {
  // Query live Supabase tables & RPCs in parallel without failing if RLS restricts anonymous admin tables
  const [
    profilesRes,
    skillsRes,
    certsRes,
    edusRes,
    expsRes,
    projsRes,
    kycRes,
    employersRes,
    jobsRes,
    catalogRes,
    lmsRes,
    hackathonsRes,
  ] = await Promise.allSettled([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("skills").select("*").limit(500),
    supabase.from("certifications").select("*").limit(300),
    supabase.from("educations").select("*").limit(300),
    supabase.from("experiences").select("*").limit(300),
    supabase.from("projects").select("*").limit(300),
    supabase.from("identity_verifications").select("*").limit(200),
    supabase.from("employers").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("employer_job_openings").select("*").order("created_at", { ascending: false }).limit(200),
    (supabase as any).from("assessments_catalog").select("id", { count: "exact", head: true }),
    (supabase as any).from("lms_courses").select("id", { count: "exact", head: true }),
    (supabase as any).from("hackathons").select("id", { count: "exact", head: true }),
  ]);

  const liveProfiles: any[] =
    profilesRes.status === "fulfilled" && Array.isArray(profilesRes.value.data)
      ? profilesRes.value.data
      : [];
  const liveSkills: any[] =
    skillsRes.status === "fulfilled" && Array.isArray(skillsRes.value.data)
      ? skillsRes.value.data
      : [];
  const liveCerts: any[] =
    certsRes.status === "fulfilled" && Array.isArray(certsRes.value.data)
      ? certsRes.value.data
      : [];
  const liveEdus: any[] =
    edusRes.status === "fulfilled" && Array.isArray(edusRes.value.data)
      ? edusRes.value.data
      : [];
  const liveExps: any[] =
    expsRes.status === "fulfilled" && Array.isArray(expsRes.value.data)
      ? expsRes.value.data
      : [];
  const liveProjs: any[] =
    projsRes.status === "fulfilled" && Array.isArray(projsRes.value.data)
      ? projsRes.value.data
      : [];
  const liveKycs: any[] =
    kycRes.status === "fulfilled" && Array.isArray(kycRes.value.data)
      ? kycRes.value.data
      : [];
  const liveEmployers: any[] =
    employersRes.status === "fulfilled" && Array.isArray(employersRes.value.data)
      ? employersRes.value.data
      : [];
  const liveJobs: any[] =
    jobsRes.status === "fulfilled" && Array.isArray(jobsRes.value.data)
      ? jobsRes.value.data
      : [];

  const liveDbConnected =
    profilesRes.status === "fulfilled" && !profilesRes.value.error;

  // Map Live DB Candidates
  const mappedLiveCandidates: SuperAdminCandidate[] = liveProfiles.map((p, idx) => {
    const uid = p.user_id;
    const pSkills = liveSkills.filter((s) => s.user_id === uid).map((s) => s.skill_name);
    const pCerts = liveCerts.filter((c) => c.user_id === uid).map((c) => c.title);
    const pEdus = liveEdus
      .filter((e) => e.user_id === uid)
      .map((e) => ({
        institution: e.institution || "University",
        degree: [e.degree, e.field_of_study].filter(Boolean).join(" · ") || "Degree",
        year: String(e.end_year || e.start_year || "2025"),
      }));
    const pExps = liveExps
      .filter((x) => x.user_id === uid)
      .map((x) => ({
        company: x.company || "Organization",
        role: x.job_title || "Member",
        duration: [x.start_date, x.is_current ? "Present" : x.end_date].filter(Boolean).join(" – ") || "Active",
        summary: x.description || undefined,
      }));
    const pProjs = liveProjs
      .filter((pr) => pr.user_id === uid)
      .map((pr) => ({
        title: pr.title || "Project",
        stack: Array.isArray(pr.technologies) ? pr.technologies.join(", ") : undefined,
        link: pr.project_url || undefined,
      }));
    const kyc = liveKycs.find((k) => k.user_id === uid);
    const fullName = p.full_name || p.email?.split("@")[0] || `Candidate ${idx + 1}`;
    const expYrs = Number(p.total_experience_years || 0);
    const missingCand: string[] = [];
    if (!p.resume_url) missingCand.push("Resume PDF");
    if (!p.phone) missingCand.push("Mobile OTP");
    if (!pExps.length && expYrs > 0) missingCand.push("Work Experience");
    if (!pEdus.length) missingCand.push("Education");
    const calcCompletion = Number(
      p.profile_completion || Math.max(55, 100 - missingCand.length * 12)
    );

    const inferredIndustry =
      pSkills.some((s: string) => /seo|marketing|ads|social/i.test(s))
        ? "Digital Marketing & Growth"
        : pSkills.some((s: string) => /sql|python|power bi|tableau|data/i.test(s))
          ? "Data & AI"
          : pSkills.some((s: string) => /aws|docker|kubernetes|cloud/i.test(s))
            ? "Cloud & DevOps"
            : "Software & SaaS";

    return {
      id: p.id || uid,
      talentCirId: p.talenta_id || `IAT-LIVE-${String(1040 + idx)}`,
      origin: "live_db",
      archived: false,
      fullName,
      slug: (p as any).public_slug || slugify(fullName),
      email: p.email || "verified.user@talento.app",
      phone: p.phone || "—",
      headline: p.headline || p.current_role || "Verified TalentCIR Professional",
      industry: (p as any).industry || inferredIndustry,
      accountTier: idx % 2 === 0 ? "premium" : "normal",
      premiumPlanName: idx % 2 === 0 ? "Talento Pro Candidate" : undefined,
      city: p.location || p.city || "Bengaluru",
      country: "India",
      experienceYears: expYrs,
      experienceLevel: p.experience_level || (expYrs >= 3 ? "Experienced" : "Fresher"),
      expectedSalaryLpa: Number(p.expected_ctc || 12),
      noticePeriodDays: Number(p.notice_period_days || 15),
      workPreference: p.preferred_work_mode || "Hybrid / Remote",
      availabilityStatus: "Actively looking",
      freelancerStatus: idx % 3 === 0 ? "Actively Freelancing" : idx % 3 === 1 ? "Open to Freelance" : "Full-Time Only",
      freelanceHourlyInr: idx % 3 !== 2 ? 1200 + idx * 250 : 0,
      freelanceGigsCompleted: idx % 3 === 0 ? 3 : 0,
      kycStatus:
        kyc?.verification_status === "verified"
          ? "verified"
          : kyc
            ? "pending"
            : p.onboarding_completed
              ? "verified"
              : "unsubmitted",
      emailVerified: true,
      phoneVerified: Boolean(p.phone),
      mfaEnabled: false,
      cirScore: Number((p as any).cir_score || 84),
      percentile: 88,
      profileCompletion: calcCompletion,
      missingProfileFields: missingCand,
      walletBalance: 500,
      profileViews: 42 + idx * 7,
      applicationsCount: 2 + (idx % 4),
      assessmentsPassed: Math.max(1, pCerts.length),
      totalTestAttempts: idx % 2 === 0 ? 1 : 2,
      retestCount: idx % 2 === 0 ? 0 : 1,
      scoreImprovementDelta: idx % 2 === 0 ? 0 : 9,
      domainsChosen: idx % 2 === 0 ? [inferredIndustry] : [inferredIndustry, "Core Aptitude & Analytics"],
      coursesEnrolled: ["AI Engineer & Agentic Workflows Track"],
      coursesCompleted: idx % 2 === 0 ? 1 : 0,
      mentorSessionsBooked: idx % 3 === 0 ? 1 : 0,
      mockInterviewsCount: 2,
      hackathonParticipated: idx % 2 === 0,
      hackathonsList: idx % 2 === 0 ? ["Code Arena · Season 4"] : [],
      networkingRegistered: true,
      networkingEventsList: ["Bengaluru Verified Builders Mixer"],
      hasResume: Boolean(p.resume_url),
      hasVideoResume: idx % 2 === 0,
      avatarUrl: p.avatar_url || getCandidatePhoto(fullName),
      resumeUrl: p.resume_url || undefined,
      linkedinUrl: p.linkedin_url || undefined,
      githubUrl: p.github_url || undefined,
      portfolioUrl: p.portfolio_url || undefined,
      skills: pSkills.length ? pSkills : ["Communication", "Problem Solving", "Analytical Thinking"],
      certifications: pCerts,
      educations: pEdus,
      experiences: pExps,
      projects: pProjs,
      assessmentScores: { Aptitude: 84, Communication: 88, Domain: 82 },
      createdAt: p.created_at || new Date().toISOString(),
      lastActiveAt: p.updated_at || p.created_at || new Date().toISOString(),
      raw: p,
    };
  });

  const CANDIDATE_INDUSTRIES = [
    "Software & SaaS",
    "Data & AI",
    "Cloud & DevOps",
    "FinTech",
    "Product & Design",
    "Digital Marketing & Growth",
    "Cybersecurity",
  ];
  const COURSE_CATALOG = [
    "AI Engineer & Agentic Workflows Track",
    "Full-Stack TypeScript & System Design",
    "SQL, Power BI & Product Analytics",
    "Cloud Native Kubernetes & Zero-Trust",
    "Growth Marketing & AI Funnel Automation",
  ];
  const ACTIVITY_DAY_OFFSETS = [1, 4, 12, 24, 48, 76, 125, 168, 240, 320, 410];

  // Map Platform Seed Candidates (Yogesh + CANDIDATES_SEED)
  const demoCand = DEFAULT_USERS["demo.candidate@talento.app"];
  const platformCandidates: SuperAdminCandidate[] = [
    {
      id: "cand-yogesh-001",
      talentCirId: "IAT-CIR-900124",
      origin: "platform",
      archived: false,
      fullName: demoCand.name,
      slug: "yogesh",
      email: demoCand.email,
      phone: demoCand.phone || "+91 98765 43210",
      headline: demoCand.rs?.role || "Full-Stack React & TypeScript Engineer",
      industry: "Software & SaaS",
      accountTier: "premium",
      premiumPlanName: "Talento Pro Annual",
      city: demoCand.city || "Bengaluru",
      country: "India",
      experienceYears: demoCand.exp || 3,
      experienceLevel: "Mid-Level",
      expectedSalaryLpa: demoCand.pf?.sal || 22,
      noticePeriodDays: demoCand.pf?.np || 15,
      workPreference: demoCand.pf?.wm || "Remote / Hybrid",
      availabilityStatus: "Actively looking",
      freelancerStatus: "Actively Freelancing",
      freelanceHourlyInr: 2200,
      freelanceGigsCompleted: 6,
      kycStatus: "verified",
      emailVerified: true,
      phoneVerified: true,
      mfaEnabled: true,
      cirScore: 91,
      percentile: 96,
      profileCompletion: 100,
      missingProfileFields: [],
      walletBalance: demoCand.wal?.bal || 1252,
      profileViews: demoCand.views || 148,
      applicationsCount: 5,
      assessmentsPassed: 4,
      totalTestAttempts: 3,
      retestCount: 2,
      scoreImprovementDelta: 14,
      domainsChosen: ["Frontend Engineering (React)", "Data & SQL", "System Design"],
      coursesEnrolled: [
        "AI Engineer & Agentic Workflows Track",
        "Full-Stack TypeScript & System Design",
      ],
      coursesCompleted: 2,
      mentorSessionsBooked: 3,
      mockInterviewsCount: 5,
      hackathonParticipated: true,
      hackathonsList: ["Code Arena · Season 4 (Finalist)", "GenAI Agent Buildathon 2026"],
      networkingRegistered: true,
      networkingEventsList: ["Bengaluru CTO & Builders Roundtable", "Indiranagar React Meetup"],
      hasResume: true,
      hasVideoResume: true,
      avatarUrl: getCandidatePhoto(demoCand.name),
      linkedinUrl: demoCand.links?.li,
      githubUrl: demoCand.links?.gh,
      portfolioUrl: demoCand.links?.pf,
      skills: demoCand.sk || [],
      certifications: demoCand.ce || [],
      educations: (demoCand.ed || []).map((e) => ({ institution: e.sc, degree: e.dg, year: e.yr })),
      experiences: (demoCand.ex || []).map((x) => ({
        company: x.co,
        role: x.role,
        duration: `${x.fr} – ${x.to}`,
        summary: x.d,
      })),
      projects: (demoCand.pj || []).map((p) => ({
        title: p.t,
        stack: p.s,
        link: p.l,
        metrics: p.m,
      })),
      assessmentScores: demoCand.as || { React: 88, SQL: 82, Python: 75, "System Design": 85 },
      createdAt: "2026-04-14T09:30:00.000Z",
      lastActiveAt: new Date(Date.now() - 1800000).toISOString(),
      raw: demoCand as unknown as Record<string, unknown>,
    },
    ...CANDIDATES_SEED.map((c, idx): SuperAdminCandidate => {
      const domainKeys = Object.keys(c.as || {});
      const scores = Object.values(c.as || {});
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 82;
      const isPremium = idx % 3 === 0 || idx === 1;
      const attempts = idx % 6 === 5 ? 0 : idx % 2 === 0 ? 1 : 2 + (idx % 2);
      const retests = Math.max(0, attempts - 1);
      const domainsList =
        idx % 3 === 0
          ? [...domainKeys, "System Architecture"].slice(0, 3)
          : idx % 3 === 1
            ? domainKeys.slice(0, 2)
            : domainKeys.slice(0, 1);
      const enrolledCourses =
        idx % 4 === 3
          ? []
          : idx % 2 === 0
            ? [COURSE_CATALOG[idx % COURSE_CATALOG.length], COURSE_CATALOG[(idx + 1) % COURSE_CATALOG.length]]
            : [COURSE_CATALOG[idx % COURSE_CATALOG.length]];
      const dayOffset = ACTIVITY_DAY_OFFSETS[idx % ACTIVITY_DAY_OFFSETS.length];
      const completion = idx % 5 === 4 ? 68 : idx % 4 === 2 ? 84 : 100;
      const missing =
        completion === 68
          ? ["60s Video Resume", "Portfolio Link", "Certification Proof"]
          : completion === 84
            ? ["60s Video Resume"]
            : [];
      const hackJoined = idx % 2 === 0 || idx % 5 === 1;
      const netJoined = idx % 3 !== 2;

      return {
        id: `cand-seed-${idx + 1}`,
        talentCirId: `IAT-CIR-${840110 + idx * 17}`,
        origin: "platform",
        archived: false,
        fullName: c.n,
        slug: slugify(c.n),
        email: `${slugify(c.n).replace(/-/g, ".")}@talentcir.verified.in`,
        phone: `+91 98${410 + idx} ${22110 + idx * 31}`,
        headline: `${c.sk.slice(0, 2).join(" & ")} Specialist · ${c.x} yrs exp`,
        industry: CANDIDATE_INDUSTRIES[idx % CANDIDATE_INDUSTRIES.length],
        accountTier: isPremium ? "premium" : "normal",
        premiumPlanName: isPremium ? "Talento Pro Candidate" : undefined,
        city: c.c,
        country: "India",
        experienceYears: c.x,
        experienceLevel: c.x <= 1 ? "Fresher" : c.x <= 3 ? "Junior" : c.x <= 6 ? "Mid-Level" : "Senior",
        expectedSalaryLpa: c.es,
        noticePeriodDays: c.nt,
        workPreference: c.wp,
        availabilityStatus:
          idx % 6 === 5 ? "Placed" : idx % 3 === 1 ? "Open to offers" : "Actively looking",
        freelancerStatus:
          idx % 3 === 0
            ? "Actively Freelancing"
            : idx % 3 === 1
              ? "Open to Freelance"
              : "Full-Time Only",
        freelanceHourlyInr: idx % 3 === 2 ? 0 : 1000 + c.x * 350,
        freelanceGigsCompleted: idx % 3 === 0 ? 2 + (idx % 5) : idx % 3 === 1 ? 1 : 0,
        kycStatus: idx % 7 === 4 ? "pending" : "verified",
        emailVerified: true,
        phoneVerified: idx % 6 !== 3,
        mfaEnabled: idx % 2 === 0,
        cirScore: avg,
        percentile: Math.min(99, Math.max(65, avg + 6)),
        profileCompletion: completion,
        missingProfileFields: missing,
        walletBalance: 250 + idx * 140,
        profileViews: 38 + idx * 19,
        applicationsCount: 2 + (idx % 6),
        assessmentsPassed: attempts > 0 ? domainKeys.length : 0,
        totalTestAttempts: attempts,
        retestCount: retests,
        scoreImprovementDelta: retests > 0 ? 6 + retests * 4 : 0,
        domainsChosen: attempts > 0 ? (domainsList.length ? domainsList : ["Core Readiness"]) : [],
        coursesEnrolled: enrolledCourses,
        coursesCompleted: enrolledCourses.length > 0 && idx % 3 !== 1 ? 1 : 0,
        mentorSessionsBooked: isPremium ? 1 + (idx % 3) : 0,
        mockInterviewsCount: attempts > 0 ? 1 + (idx % 4) : 0,
        hackathonParticipated: hackJoined,
        hackathonsList: hackJoined
          ? idx % 4 === 0
            ? ["Code Arena · Season 4", "Cloud & AI Sprint S3"]
            : ["Code Arena · Season 4"]
          : [],
        networkingRegistered: netJoined,
        networkingEventsList: netJoined
          ? [`${c.c} Verified Tech & Hiring Mixer`, "AI Career Podcast Live Q&A"]
          : [],
        hasResume: completion >= 84,
        hasVideoResume: isPremium,
        avatarUrl: getCandidatePhoto(c.n),
        linkedinUrl: `linkedin.com/in/${slugify(c.n)}`,
        githubUrl: `github.com/${slugify(c.n)}`,
        skills: c.sk,
        certifications: c.ce,
        educations: [
          {
            institution: idx % 2 === 0 ? "IIT Madras / Anna University" : "NIT Surathkal / VIT",
            degree: "B.Tech Computer Science & Engineering",
            year: String(2025 - c.x),
          },
        ],
        experiences: [
          {
            company: idx % 2 === 0 ? "Zoho Corp" : "Freshworks",
            role: c.x >= 4 ? "Senior Software Engineer" : "Software Engineer",
            duration: `${2025 - Math.min(c.x, 3)} – Present`,
            summary: `Delivered production ${c.sk.slice(0, 3).join(", ")} systems with high test coverage.`,
          },
        ],
        projects: [
          {
            title: `${c.sk[0] || "Cloud"} Distributed Service`,
            stack: c.sk.join(", "),
            metrics: "99.95% uptime · p95 < 45ms",
          },
        ],
        assessmentScores: c.as,
        createdAt: new Date(Date.now() - (dayOffset + 30) * 86400000).toISOString(),
        lastActiveAt: new Date(Date.now() - dayOffset * 86400000).toISOString(),
        raw: c as unknown as Record<string, unknown>,
      };
    }),
  ];

  // Deduplicate live vs platform candidates by email
  const seenCandidateEmails = new Set(mappedLiveCandidates.map((c) => c.email.toLowerCase()));
  const candidates: SuperAdminCandidate[] = [
    ...mappedLiveCandidates,
    ...platformCandidates.filter((c) => !seenCandidateEmails.has(c.email.toLowerCase())),
  ];

  // Map Live DB Employers + Showcase Employers + Pending / Incomplete Profile Employers
  const mappedLiveEmployers: SuperAdminEmployer[] = liveEmployers.map((emp, idx) => {
    const missingEmp: string[] = [];
    if (!emp.website) missingEmp.push("Official Website");
    if (!emp.description) missingEmp.push("Company Description");
    if (!emp.logo_url) missingEmp.push("Company Logo");
    if (!emp.phone_verified) missingEmp.push("Phone OTP Verification");
    if (!emp.industry) missingEmp.push("Industry Classification");
    const empCompletion = Math.max(35, 100 - missingEmp.length * 15);

    return {
      id: emp.id,
      employerCode: emp.employer_id || `IAT-EMP-${300100 + idx}`,
      origin: "live_db",
      archived: false,
      accountTier: "premium",
      companyName: emp.company_name || "Registered Employer",
      slug: slugify(emp.company_name || `company-${idx + 1}`),
      industry: emp.industry || "Software & SaaS",
      category: emp.company_type || "Corporate",
      companyType: emp.company_type || "Private Limited",
      size: emp.num_employees || "51-200",
      hq: emp.address || "Bengaluru",
      address: emp.address || "India",
      website: emp.website || "—",
      establishedYear: Number(emp.established_year || 2021),
      contactName: emp.contact_name || "Hiring Lead",
      officialEmail: emp.official_email || "hr@company.in",
      phone: emp.phone || "—",
      verificationStatus:
        (emp as any).verification_status ||
        (emp.email_verified ? "verified" : "pending"),
      gstin: (emp as any).gstin || "29AABCS1429B1ZB",
      cin: (emp as any).cin || "U72900KA2021PTC148210",
      pan: (emp as any).pan || "AABCS1429B",
      gstinVerified: Boolean(emp.email_verified),
      profileCompletion: empCompletion,
      missingProfileFields: missingEmp,
      subscriptionPlan: "Growth Pro",
      mrrInr: 14999,
      walletBalance: 5000,
      talentUnlocksRemaining: 28,
      teamMembersCount: 3,
      activeJobsCount: liveJobs.filter((j) => j.employer_id === emp.id).length,
      totalApplications: 14,
      totalHires: 2,
      logoUrl: emp.logo_url || undefined,
      benefits: ["Health Insurance", "Flexible Work", "Learning Budget"],
      createdAt: emp.created_at || new Date().toISOString(),
      lastActiveAt: emp.updated_at || emp.created_at || new Date().toISOString(),
      raw: emp,
    };
  });

  const showcaseEmployers: SuperAdminEmployer[] = SHOWCASE_COMPANIES.map((sc, idx) => ({
    id: sc.id,
    employerCode: sc.employer_code,
    origin: "platform",
    archived: false,
    accountTier: "premium",
    companyName: sc.name,
    slug: sc.slug,
    industry: sc.industry || "Software & Cloud Infrastructure",
    category: sc.category || "Enterprise SaaS",
    companyType: sc.company_type || "Private Limited",
    size: sc.size || "201-500",
    hq: sc.hq || "Bengaluru, India",
    address: sc.address,
    website: sc.website || "https://super30.ai",
    establishedYear: sc.established_year || 2019,
    contactName: sc.leadership?.[0]?.name || "Rohan Deshmukh",
    officialEmail: (sc as any).contact?.email || `careers@${sc.slug}.in`,
    phone: (sc as any).contact?.phone || "+91 80 4719 3030",
    verificationStatus: sc.verified ? "verified" : "pending",
    gstin: `29AADC${1042 + idx * 19}K1Z5`,
    cin: `U72200KA${sc.established_year || 2019}PTC${129041 + idx * 112}`,
    pan: `AADC${1042 + idx * 19}K`,
    gstinVerified: sc.gstin_verified,
    profileCompletion: 100,
    missingProfileFields: [],
    subscriptionPlan: idx === 0 ? "Enterprise Annual" : "Growth Pro",
    mrrInr: idx === 0 ? 49999 : 19999,
    walletBalance: idx === 0 ? 9200 : 6400,
    talentUnlocksRemaining: idx === 0 ? 84 : 35,
    teamMembersCount: (sc.leadership?.length || 2) + 3,
    activeJobsCount: sc.jobs?.length || 4,
    totalApplications: 48 - idx * 9,
    totalHires: 9 - idx * 2,
    logoUrl: sc.logo_url || undefined,
    benefits: sc.benefits || [],
    createdAt: new Date(Date.now() - (30 + idx * 18) * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - idx * 86400000 * 3).toISOString(),
    raw: sc as unknown as Record<string, unknown>,
  }));

  // Pending KYB & Incomplete Company Profile Employers
  const pendingEmployers: SuperAdminEmployer[] = [
    {
      id: "emp-pending-01",
      employerCode: "IAT-EMP-409112",
      origin: "platform",
      archived: false,
      accountTier: "premium",
      companyName: "FinStack Payments India Pvt. Ltd.",
      slug: "finstack-payments",
      industry: "FinTech",
      category: "B2B Payments",
      companyType: "Private Limited (Series A)",
      size: "51-200",
      hq: "Mumbai, Maharashtra, India",
      address: "BKC One, Bandra Kurla Complex, Mumbai 400051",
      website: "https://finstackpay.in",
      establishedYear: 2022,
      contactName: "Meera Krishnan",
      officialEmail: "meera.k@finstackpay.in",
      phone: "+91 22 6104 8890",
      verificationStatus: "pending",
      gstin: "27AAFCF8821M1Z2",
      cin: "U65999MH2022PTC381920",
      pan: "AAFCF8821M",
      gstinVerified: false,
      profileCompletion: 78,
      missingProfileFields: ["GSTIN Certificate Upload", "Workplace Gallery Photos"],
      subscriptionPlan: "Growth Pro",
      mrrInr: 19999,
      walletBalance: 5000,
      talentUnlocksRemaining: 25,
      teamMembersCount: 2,
      activeJobsCount: 2,
      totalApplications: 0,
      totalHires: 0,
      benefits: ["Health Insurance", "Performance Bonus", "Hybrid Flexibility"],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      lastActiveAt: new Date(Date.now() - 86400000 * 1.2).toISOString(),
    },
    {
      id: "emp-pending-02",
      employerCode: "IAT-EMP-409188",
      origin: "platform",
      archived: false,
      accountTier: "normal",
      companyName: "NeuralForge Robotics Labs",
      slug: "neuralforge-robotics",
      industry: "Data & AI",
      category: "DeepTech",
      companyType: "LLP",
      size: "11-50",
      hq: "Hyderabad, Telangana, India",
      address: "T-Hub Phase 2, Madhapur, Hyderabad 500081",
      website: "https://neuralforge.ai",
      establishedYear: 2024,
      contactName: "Vikramaditya Reddy",
      officialEmail: "founders@neuralforge.ai",
      phone: "+91 40 4852 1190",
      verificationStatus: "pending",
      gstin: "36AABFN4410P1Z9",
      cin: "AAZ-4410",
      pan: "AABFN4410P",
      gstinVerified: false,
      profileCompletion: 58,
      missingProfileFields: ["Company Logo", "Company Mission & About", "Employee Benefits", "KYB Tax Proof"],
      subscriptionPlan: "Starter",
      mrrInr: 7999,
      walletBalance: 2500,
      talentUnlocksRemaining: 10,
      teamMembersCount: 1,
      activeJobsCount: 1,
      totalApplications: 0,
      totalHires: 0,
      benefits: ["ESOPs"],
      createdAt: new Date(Date.now() - 86400000 * 19).toISOString(),
      lastActiveAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: "emp-incomplete-03",
      employerCode: "IAT-EMP-409245",
      origin: "platform",
      archived: false,
      accountTier: "normal",
      companyName: "BrightCart D2C Commerce",
      slug: "brightcart-d2c",
      industry: "Digital Marketing & Growth",
      category: "E-Commerce",
      companyType: "Private Limited",
      size: "11-50",
      hq: "Chennai, Tamil Nadu, India",
      address: "OMR Perungudi, Chennai 600096",
      website: "—",
      establishedYear: 2023,
      contactName: "harish.n@brightcart.in",
      officialEmail: "harish.n@brightcart.in",
      phone: "—",
      verificationStatus: "pending",
      gstin: "—",
      cin: "—",
      pan: "—",
      gstinVerified: false,
      profileCompletion: 35,
      missingProfileFields: [
        "Official Website",
        "Phone OTP Verification",
        "GSTIN & CIN",
        "Company Description",
        "Company Logo",
        "First Job Opening",
      ],
      subscriptionPlan: "Free Trial",
      mrrInr: 0,
      walletBalance: 0,
      talentUnlocksRemaining: 0,
      teamMembersCount: 1,
      activeJobsCount: 0,
      totalApplications: 0,
      totalHires: 0,
      benefits: [],
      createdAt: new Date(Date.now() - 86400000 * 65).toISOString(),
      lastActiveAt: new Date(Date.now() - 86400000 * 48).toISOString(),
    },
  ];

  const employers: SuperAdminEmployer[] = [
    ...mappedLiveEmployers,
    ...showcaseEmployers,
    ...pendingEmployers,
  ];

  // Map Live Jobs + Demo Employer Jobs + Showcase Jobs
  const mappedLiveJobs: SuperAdminJob[] = liveJobs.map((j, idx) => {
    const ownerEmp = liveEmployers.find((e) => e.id === j.employer_id);
    return {
      id: j.id,
      jobCode: `JOB-LIVE-${2100 + idx}`,
      origin: "live_db",
      title: j.designation || "Open Role",
      companyName: ownerEmp?.company_name || "Verified Employer",
      employerCode: ownerEmp?.employer_id || "IAT-EMP-LIVE",
      department: (j as any).department || "Engineering",
      industry: ownerEmp?.industry || "Technology",
      location: j.job_location || "India",
      workMode: ((j as any).work_mode as any) || "Hybrid",
      employmentType: (j as any).employment_type || "Full-time",
      minExpYears: Number(parseInt(String(j.experience_years || "1"), 10) || 1),
      salaryMinLpa: Number(j.salary_min || 8),
      salaryMaxLpa: Number(j.salary_max || 16),
      openingsCount: Number(j.num_openings || 1),
      status: ((j as any).status as any) || "active",
      promotionTier: "none",
      skills: Array.isArray((j as any).required_skills)
        ? (j as any).required_skills
        : ["Domain Expertise", "Problem Solving"],
      views: Number((j as any).views_count || 64),
      applicationsCount: 6,
      shortlistedCount: 2,
      hiredCount: 0,
      conversionRate: 9.4,
      description: j.job_description || "Live employer role published on TalentCIR.",
      closesAt: new Date(Date.now() + 86400000 * 25).toISOString().slice(0, 10),
      createdAt: j.created_at || new Date().toISOString(),
      raw: j,
    };
  });

  const platformJobs: SuperAdminJob[] = [
    ...DEMO_EMPLOYER_JOBS.map((j) => {
      const jobApps = DEMO_EMPLOYER_APPS.filter((a) => a.jid === j.id);
      const views = j.views || 150;
      return {
        id: String(j.id),
        jobCode: `JOB-${j.id}`,
        origin: "platform" as const,
        title: j.t,
        companyName: j.c,
        employerCode: "IAT-EMP-204819",
        department: j.department || "Engineering",
        industry: j.industry || "Software & Cloud Infrastructure",
        location: j.l,
        workMode: j.m,
        employmentType: j.ty,
        minExpYears: j.e,
        salaryMinLpa: j.a,
        salaryMaxLpa: j.b,
        openingsCount: 2,
        status: (j.status === "scheduled" ? "pending_review" : (j.status as any)) || "active",
        promotionTier: j.promotionTier || "none",
        skills: j.sk,
        views,
        applicationsCount: jobApps.length,
        shortlistedCount: jobApps.filter((a) =>
          ["Shortlisted", "Interview", "Offer"].includes(a.st)
        ).length,
        hiredCount: jobApps.filter((a) => a.hired).length,
        conversionRate: Number(((jobApps.length / Math.max(1, views)) * 100).toFixed(1)),
        description: j.description || "",
        closesAt: j.closesAt || "2026-12-20",
        createdAt: new Date(j.at).toISOString(),
        raw: j as unknown as Record<string, unknown>,
      };
    }),
    {
      id: "job-mod-901",
      jobCode: "JOB-90901",
      origin: "platform",
      title: "Founding Payment Systems Engineer (Go / Rust)",
      companyName: "FinStack Payments India Pvt. Ltd.",
      employerCode: "IAT-EMP-409112",
      department: "Core Ledger",
      industry: "FinTech",
      location: "Mumbai",
      workMode: "Hybrid",
      employmentType: "Full-time",
      minExpYears: 4,
      salaryMinLpa: 28,
      salaryMaxLpa: 45,
      openingsCount: 3,
      status: "pending_review",
      promotionTier: "sponsored",
      skills: ["Go", "Rust", "PostgreSQL", "Kafka", "UPI Switch"],
      views: 0,
      applicationsCount: 0,
      shortlistedCount: 0,
      hiredCount: 0,
      conversionRate: 0,
      description: "Awaiting Super Admin moderation & GSTIN clearance before going live on job feed.",
      closesAt: "2026-12-31",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: "job-mod-902",
      jobCode: "JOB-90902",
      origin: "platform",
      title: "Perception & SLAM Robotics Engineer",
      companyName: "NeuralForge Robotics Labs",
      employerCode: "IAT-EMP-409188",
      department: "Autonomy",
      industry: "Robotics & AI",
      location: "Hyderabad",
      workMode: "Onsite",
      employmentType: "Full-time",
      minExpYears: 2,
      salaryMinLpa: 18,
      salaryMaxLpa: 32,
      openingsCount: 2,
      status: "pending_review",
      promotionTier: "featured",
      skills: ["C++", "ROS2", "PyTorch", "CUDA", "Computer Vision"],
      views: 0,
      applicationsCount: 0,
      shortlistedCount: 0,
      hiredCount: 0,
      conversionRate: 0,
      description: "Build real-time warehouse SLAM pipelines on NVIDIA Jetson Orin edge hardware.",
      closesAt: "2026-12-28",
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ];

  const jobs: SuperAdminJob[] = [...mappedLiveJobs, ...platformJobs];

  // Global Applications
  const applications: SuperAdminApplication[] = DEMO_EMPLOYER_APPS.map((a, idx) => {
    const job = DEMO_EMPLOYER_JOBS.find((j) => j.id === a.jid);
    const scores = Object.values(a.as || {});
    const cir = scores.length
      ? Math.round(scores.reduce((acc, v) => acc + v, 0) / scores.length)
      : 83;
    return {
      id: String(a.id),
      appCode: `APP-${a.id}`,
      candidateName: a.name,
      candidateId: `IAT-CIR-${840110 + idx * 17}`,
      candidateEmail: a.who,
      jobTitle: job?.t || "Senior Engineering Role",
      jobId: `JOB-${a.jid}`,
      companyName: job?.c || "Super30 Technologies",
      stage: a.hired ? "Hired" : a.st,
      matchScore: Math.min(98, cir + 4),
      cirScore: cir,
      experienceYears: a.exp,
      expectedCtcLpa: 14 + a.exp * 3,
      noticeDays: idx % 2 === 0 ? 15 : 30,
      assignedRecruiter: idx % 2 === 0 ? "Ananya Rao (Lead TA)" : "Karthik Subramanian",
      slaStatus: a.st === "Applied" ? "Action Needed" : "Within SLA",
      interviewScheduled: a.iv,
      offerCtcLpa: a.st === "Offer" || a.hired ? 26 : undefined,
      bgvStatus: a.hired ? "Cleared" : a.st === "Offer" ? "In Progress" : "Not Started",
      recruiterNote: a.note,
      coverNote: a.cn,
      skills: a.sk,
      appliedAt: new Date(a.at).toISOString(),
      updatedAt: new Date(a.upd?.[a.upd.length - 1]?.at || a.at).toISOString(),
      history: (a.upd || []).map((u) => ({
        stage: a.st,
        note: u.msg,
        at: new Date(u.at).toISOString(),
      })),
    };
  });

  // Assessments, CIR Credentials & 30-Layer Proctoring Sessions
  const assessments: SuperAdminAssessmentAttempt[] = candidates.slice(0, 10).map((cand, idx) => {
    const flagged = idx === 3 || idx === 7;
    return {
      id: `att-${1001 + idx}`,
      attemptCode: `ATT-2026-${4910 + idx}`,
      credentialToken: `TCIR-VC-${99201 + idx * 13}`,
      candidateName: cand.fullName,
      candidateEmail: cand.email,
      assessmentTitle:
        idx % 3 === 0
          ? "Full-Stack React & Distributed Systems CIR"
          : idx % 3 === 1
            ? "Data Analytics, SQL & Python Readiness"
            : "Digital Marketing & Growth Performance CIR",
      domainTrack:
        idx % 3 === 0 ? "Software Engineering" : idx % 3 === 1 ? "Data Science & BI" : "Growth & Marketing",
      coreAptitudeScore: Math.min(99, cand.cirScore + 2),
      coreCommunicationScore: Math.min(99, cand.cirScore + 4),
      domainTechnicalScore: cand.cirScore,
      codingScore: Math.max(70, cand.cirScore - 2),
      aiInterviewScore: Math.min(98, cand.cirScore + 1),
      overallCirScore: cand.cirScore,
      percentile: cand.percentile,
      status: flagged ? "Flagged" : "Issued",
      proctorTrustScore: flagged ? 68 : 98 - (idx % 3),
      proctorFlagsCount: flagged ? 3 : 0,
      proctorSummary: flagged
        ? "Secondary HDMI monitor detected (Layer 14) + 2 tab focus switches (Layer 4); queued for human proctor review."
        : "All 30 AI proctoring layers clean: single face lock, clean audio spectrum, verified browser fingerprint, AAL2 check passed.",
      layersTriggered: flagged
        ? ["L04: Tab Focus Loss (x2)", "L14: Secondary Display Enum", "L19: Gaze Off-Screen > 6s"]
        : ["All 30 Layers Passed Clean"],
      durationMinutes: 68 + (idx % 15),
      browserDevice: idx % 2 === 0 ? "Chrome 131 · Windows 11" : "Chrome 131 · macOS Sequoia",
      ipRegion: `${cand.city}, IN (ASN Verified)`,
      completedAt: new Date(Date.now() - idx * 3600000 * 11).toISOString(),
    };
  });

  // Revenue, Orders & Subscriptions
  const transactions: SuperAdminTransaction[] = [
    {
      id: "ord-01",
      orderId: "order_P9kL82mXz01",
      gatewayRef: "pay_Rzp99812041",
      actorType: "Employer",
      actorName: "Super30 Technologies",
      actorEmail: "demo.employer@talento.app",
      category: "SaaS Subscription",
      itemTitle: "Enterprise Annual Hiring Suite (Unlimited Jobs + 100 CIR Unlocks/mo)",
      amountInr: 49999,
      gstInr: 9000,
      netTotalInr: 58999,
      direction: "credit",
      paymentMethod: "Razorpay Corporate NetBanking · HDFC",
      status: "captured",
      invoiceNumber: "INV-2026-00891",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: "ord-02",
      orderId: "order_P9kL71aBc02",
      gatewayRef: "pay_Rzp99811802",
      actorType: "Employer",
      actorName: "Super30 Technologies",
      actorEmail: "demo.employer@talento.app",
      category: "Wallet Top-up",
      itemTitle: "Recruiter Talent Credits Refill",
      amountInr: 10000,
      gstInr: 1800,
      netTotalInr: 11800,
      direction: "credit",
      paymentMethod: "UPI Corporate · super30@icici",
      status: "captured",
      invoiceNumber: "INV-2026-00884",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "ord-03",
      orderId: "order_P9kJ19xYz03",
      gatewayRef: "pay_Rzp99809412",
      actorType: "Employer",
      actorName: "FinStack Payments India Pvt. Ltd.",
      actorEmail: "meera.k@finstackpay.in",
      category: "Talent Package",
      itemTitle: "Growth Pro Plan + 25 Verified CIR Candidate Unlocks",
      amountInr: 19999,
      gstInr: 3600,
      netTotalInr: 23599,
      direction: "credit",
      paymentMethod: "Visa Corporate Card ••8821",
      couponCode: "LAUNCH10",
      status: "captured",
      invoiceNumber: "INV-2026-00879",
      createdAt: new Date(Date.now() - 86400000 * 1.1).toISOString(),
    },
    {
      id: "ord-04",
      orderId: "order_P9jW44mQp04",
      gatewayRef: "pay_Rzp99805119",
      actorType: "Candidate",
      actorName: "Yogesh",
      actorEmail: "demo.candidate@talento.app",
      category: "Assessment Fee",
      itemTitle: "Proctored Full-Stack CIR Assessment + Verifiable Credential",
      amountInr: 999,
      gstInr: 180,
      netTotalInr: 1179,
      direction: "credit",
      paymentMethod: "UPI · yogesh@okaxis",
      status: "captured",
      invoiceNumber: "INV-2026-00865",
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      id: "ord-05",
      orderId: "order_P9jR12pLm05",
      gatewayRef: "pay_Rzp99803108",
      actorType: "Employer",
      actorName: "NeuralForge Robotics Labs",
      actorEmail: "founders@neuralforge.ai",
      category: "Job Promotion",
      itemTitle: "Sponsored Spotlight Slot · 14 Days",
      amountInr: 4999,
      gstInr: 900,
      netTotalInr: 5899,
      direction: "credit",
      paymentMethod: "Pending Bank Authorization",
      status: "pending",
      invoiceNumber: "INV-2026-00894",
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: "ord-06",
      orderId: "order_P9hK09zTr06",
      gatewayRef: "rfnd_Rzp0041921",
      actorType: "Candidate",
      actorName: candidates[1]?.fullName || "Divya Nair",
      actorEmail: candidates[1]?.email || "divya.nair@talento.app",
      category: "Refund",
      itemTitle: "Assessment Reschedule Fee Waiver Refund",
      amountInr: 499,
      gstInr: 90,
      netTotalInr: 589,
      direction: "refund",
      paymentMethod: "Original UPI Source",
      status: "refunded",
      invoiceNumber: "CN-2026-00112",
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
    {
      id: "ord-07",
      orderId: "order_P9jQ88vBn07",
      gatewayRef: "pay_Rzp99804821",
      actorType: "Candidate",
      actorName: candidates[1]?.fullName || "Divya Nair",
      actorEmail: candidates[1]?.email || "divya.nair@talento.app",
      category: "Assessment Fee",
      itemTitle: "Multi-Domain CIR Bundle (Frontend + System Design Retest)",
      amountInr: 1999,
      gstInr: 360,
      netTotalInr: 2359,
      direction: "credit",
      paymentMethod: "UPI · divyanair@okicici",
      status: "captured",
      invoiceNumber: "INV-2026-00871",
      createdAt: new Date(Date.now() - 86400000 * 4.5).toISOString(),
    },
    {
      id: "ord-08",
      orderId: "order_P9jM51cXz08",
      gatewayRef: "pay_Rzp99804110",
      actorType: "Candidate",
      actorName: candidates[2]?.fullName || "Rahul Mehta",
      actorEmail: candidates[2]?.email || "rahul.mehta@talento.app",
      category: "Assessment Fee",
      itemTitle: "Cloud & DevOps Proctored CIR Assessment + AI Interview",
      amountInr: 1499,
      gstInr: 270,
      netTotalInr: 1769,
      direction: "credit",
      paymentMethod: "RuPay Debit ••4412",
      status: "captured",
      invoiceNumber: "INV-2026-00868",
      createdAt: new Date(Date.now() - 86400000 * 5.2).toISOString(),
    },
    {
      id: "ord-09",
      orderId: "order_P9kA34nLp09",
      gatewayRef: "pay_Rzp99812104",
      actorType: "Candidate",
      actorName: "Yogesh",
      actorEmail: "demo.candidate@talento.app",
      category: "Learning & Mentorship",
      itemTitle: "AI Engineer & Agentic Workflows Certification Track",
      amountInr: 4999,
      gstInr: 900,
      netTotalInr: 5899,
      direction: "credit",
      paymentMethod: "UPI · yogesh@okaxis",
      status: "captured",
      invoiceNumber: "INV-2026-00882",
      createdAt: new Date(Date.now() - 86400000 * 3.2).toISOString(),
    },
    {
      id: "ord-10",
      orderId: "order_P9kB18wRt10",
      gatewayRef: "pay_Rzp99812490",
      actorType: "Candidate",
      actorName: candidates[3]?.fullName || "Aravind Krishnan",
      actorEmail: candidates[3]?.email || "aravind@talento.app",
      category: "Learning & Mentorship",
      itemTitle: "1:1 Staff System Design Coaching Pack (3 Mentor Sessions)",
      amountInr: 2997,
      gstInr: 539,
      netTotalInr: 3536,
      direction: "credit",
      paymentMethod: "HDFC Credit Card ••9014",
      status: "captured",
      invoiceNumber: "INV-2026-00885",
      createdAt: new Date(Date.now() - 86400000 * 2.6).toISOString(),
    },
    {
      id: "ord-11",
      orderId: "order_P9kC72pQs11",
      gatewayRef: "pay_Rzp99812912",
      actorType: "Candidate",
      actorName: candidates[4]?.fullName || "Sneha Kulkarni",
      actorEmail: candidates[4]?.email || "sneha.k@talento.app",
      category: "Learning & Mentorship",
      itemTitle: "Product Analytics & SQL Mastery Cohort",
      amountInr: 3499,
      gstInr: 630,
      netTotalInr: 4129,
      direction: "credit",
      paymentMethod: "UPI · snehak@ybl",
      status: "captured",
      invoiceNumber: "INV-2026-00887",
      createdAt: new Date(Date.now() - 86400000 * 2.1).toISOString(),
    },
    {
      id: "ord-12",
      orderId: "order_P9kD19mNv12",
      gatewayRef: "pay_Rzp99813301",
      actorType: "Candidate",
      actorName: "Yogesh",
      actorEmail: "demo.candidate@talento.app",
      category: "Hackathon",
      itemTitle: "Code Arena Season 4 Pro Builder Pass",
      amountInr: 999,
      gstInr: 180,
      netTotalInr: 1179,
      direction: "credit",
      paymentMethod: "UPI · yogesh@okaxis",
      status: "captured",
      invoiceNumber: "INV-2026-00889",
      createdAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
    },
    {
      id: "ord-21",
      orderId: "order_P9kD54bVc21",
      gatewayRef: "pay_Rzp99813488",
      actorType: "Candidate",
      actorName: candidates[2]?.fullName || "Rahul Mehta",
      actorEmail: candidates[2]?.email || "rahul.mehta@talento.app",
      category: "Hackathon",
      itemTitle: "National FinTech AI Sprint Team Entry Pass",
      amountInr: 799,
      gstInr: 144,
      netTotalInr: 943,
      direction: "credit",
      paymentMethod: "UPI · rahulmehta@okhdfcbank",
      status: "captured",
      invoiceNumber: "INV-2026-00901",
      createdAt: new Date(Date.now() - 86400000 * 1.6).toISOString(),
    },
    {
      id: "ord-13",
      orderId: "order_P9kE45xLk13",
      gatewayRef: "pay_Rzp99813677",
      actorType: "Candidate",
      actorName: candidates[1]?.fullName || "Divya Nair",
      actorEmail: candidates[1]?.email || "divya.nair@talento.app",
      category: "Networking",
      itemTitle: "Bengaluru Verified Builders Networking Pass",
      amountInr: 499,
      gstInr: 90,
      netTotalInr: 589,
      direction: "credit",
      paymentMethod: "UPI · divyanair@okicici",
      status: "captured",
      invoiceNumber: "INV-2026-00890",
      createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    },
    {
      id: "ord-14",
      orderId: "order_P9kF63rTy14",
      gatewayRef: "pay_Rzp99813940",
      actorType: "Candidate",
      actorName: candidates[5]?.fullName || "Karthik Subramanian",
      actorEmail: candidates[5]?.email || "karthik.s@talento.app",
      category: "Networking",
      itemTitle: "Mumbai FinTech Founders & Engineers Networking Pass",
      amountInr: 699,
      gstInr: 126,
      netTotalInr: 825,
      direction: "credit",
      paymentMethod: "UPI · karthiks@oksbi",
      status: "captured",
      invoiceNumber: "INV-2026-00892",
      createdAt: new Date(Date.now() - 86400000 * 1.2).toISOString(),
    },
    {
      id: "ord-15",
      orderId: "order_P9kG81zWp15",
      gatewayRef: "pay_Rzp99814218",
      actorType: "Employer",
      actorName: "Super30 Technologies",
      actorEmail: "demo.employer@talento.app",
      category: "Assessment Fee",
      itemTitle: "Enterprise Custom AI Assessment Suite (250 Proctored Invites)",
      amountInr: 35000,
      gstInr: 6300,
      netTotalInr: 41300,
      direction: "credit",
      paymentMethod: "Razorpay Corporate NetBanking · HDFC",
      status: "captured",
      invoiceNumber: "INV-2026-00895",
      createdAt: new Date(Date.now() - 86400000 * 3.6).toISOString(),
    },
    {
      id: "ord-16",
      orderId: "order_P9kH27qMn16",
      gatewayRef: "pay_Rzp99814509",
      actorType: "Employer",
      actorName: "FinStack Payments India Pvt. Ltd.",
      actorEmail: "meera.k@finstackpay.in",
      category: "Assessment Fee",
      itemTitle: "Campus Screening & 30-Layer Proctored CIR Drive (150 Seats)",
      amountInr: 24000,
      gstInr: 4320,
      netTotalInr: 28320,
      direction: "credit",
      paymentMethod: "Visa Corporate Card ••8821",
      status: "captured",
      invoiceNumber: "INV-2026-00896",
      createdAt: new Date(Date.now() - 86400000 * 2.4).toISOString(),
    },
    {
      id: "ord-17",
      orderId: "order_P9kJ94tBv17",
      gatewayRef: "pay_Rzp99814833",
      actorType: "Employer",
      actorName: "Super30 Technologies",
      actorEmail: "demo.employer@talento.app",
      category: "Learning & Mentorship",
      itemTitle: "Corporate L&D Team License · Applied GenAI & Agentic Systems (25 Seats)",
      amountInr: 45000,
      gstInr: 8100,
      netTotalInr: 53100,
      direction: "credit",
      paymentMethod: "Razorpay Corporate NetBanking · HDFC",
      status: "captured",
      invoiceNumber: "INV-2026-00897",
      createdAt: new Date(Date.now() - 86400000 * 2.9).toISOString(),
    },
    {
      id: "ord-18",
      orderId: "order_P9kL11uCx18",
      gatewayRef: "pay_Rzp99815190",
      actorType: "Employer",
      actorName: "FinStack Payments India Pvt. Ltd.",
      actorEmail: "meera.k@finstackpay.in",
      category: "Learning & Mentorship",
      itemTitle: "Engineering Upskilling Track · Secure Go & Rust Payments (12 Seats)",
      amountInr: 22000,
      gstInr: 3960,
      netTotalInr: 25960,
      direction: "credit",
      paymentMethod: "Visa Corporate Card ••8821",
      status: "captured",
      invoiceNumber: "INV-2026-00898",
      createdAt: new Date(Date.now() - 86400000 * 1.7).toISOString(),
    },
    {
      id: "ord-19",
      orderId: "order_P9kM52yZa19",
      gatewayRef: "pay_Rzp99815542",
      actorType: "Employer",
      actorName: "Super30 Technologies",
      actorEmail: "demo.employer@talento.app",
      category: "Hackathon",
      itemTitle: "Code Arena Season 4 Title Hiring Partner & Challenge Track Sponsorship",
      amountInr: 125000,
      gstInr: 22500,
      netTotalInr: 147500,
      direction: "credit",
      paymentMethod: "RTGS Corporate Treasury · HDFC",
      status: "captured",
      invoiceNumber: "INV-2026-00899",
      createdAt: new Date(Date.now() - 86400000 * 1.4).toISOString(),
    },
    {
      id: "ord-22",
      orderId: "order_P9kM88pQr22",
      gatewayRef: "pay_Rzp99815690",
      actorType: "Employer",
      actorName: "FinStack Payments India Pvt. Ltd.",
      actorEmail: "meera.k@finstackpay.in",
      category: "Hackathon",
      itemTitle: "FinTech Payments Hackathon Track Co-Sponsorship",
      amountInr: 60000,
      gstInr: 10800,
      netTotalInr: 70800,
      direction: "credit",
      paymentMethod: "Razorpay Corporate NetBanking · Axis",
      status: "captured",
      invoiceNumber: "INV-2026-00902",
      createdAt: new Date(Date.now() - 86400000 * 1.1).toISOString(),
    },
    {
      id: "ord-20",
      orderId: "order_P9kN68hJk20",
      gatewayRef: "pay_Rzp99815811",
      actorType: "Employer",
      actorName: "FinStack Payments India Pvt. Ltd.",
      actorEmail: "meera.k@finstackpay.in",
      category: "Networking",
      itemTitle: "Mumbai & Bengaluru Executive Networking Mixer Hiring Table",
      amountInr: 35000,
      gstInr: 6300,
      netTotalInr: 41300,
      direction: "credit",
      paymentMethod: "UPI Corporate · finstack@axisbank",
      status: "captured",
      invoiceNumber: "INV-2026-00900",
      createdAt: new Date(Date.now() - 86400000 * 0.9).toISOString(),
    },
    {
      id: "ord-23",
      orderId: "order_P9kP12mWz23",
      gatewayRef: "pay_Rzp99815974",
      actorType: "Employer",
      actorName: "Super30 Technologies",
      actorEmail: "demo.employer@talento.app",
      category: "Networking",
      itemTitle: "Bengaluru CTO & Staff Builders Roundtable Host Partner",
      amountInr: 45000,
      gstInr: 8100,
      netTotalInr: 53100,
      direction: "credit",
      paymentMethod: "Razorpay Corporate NetBanking · HDFC",
      status: "captured",
      invoiceNumber: "INV-2026-00903",
      createdAt: new Date(Date.now() - 86400000 * 0.6).toISOString(),
    },
  ];

  // Wallets & Immutable Ledger Accounts
  const wallets: SuperAdminWalletAccount[] = [
    {
      id: "wal-emp-01",
      ownerType: "Employer",
      ownerName: "Super30 Technologies",
      ownerEmail: "demo.employer@talento.app",
      ownerCode: "IAT-EMP-204819",
      balanceInr: 9200,
      lifetimeCreditedInr: 25000,
      lifetimeDebitedInr: 15800,
      status: "active",
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      ledger: [
        { txId: "TXN-2009", type: "debit", amountInr: 400, reason: "Unlocked 2 Verified CIR Profiles", via: "Talent Pool", at: new Date(Date.now() - 3600000 * 6).toISOString() },
        { txId: "TXN-2005", type: "debit", amountInr: 400, reason: "Sponsored Job Boost · Data Analyst", via: "Job Promotion", at: new Date(Date.now() - 86400000 * 2).toISOString() },
        { txId: "TXN-2001", type: "credit", amountInr: 10000, reason: "Recruiter Credits Refill", via: "Razorpay NetBanking", at: new Date(Date.now() - 86400000 * 5).toISOString() },
      ],
    },
    {
      id: "wal-emp-02",
      ownerType: "Employer",
      ownerName: "FinStack Payments India Pvt. Ltd.",
      ownerEmail: "meera.k@finstackpay.in",
      ownerCode: "IAT-EMP-409112",
      balanceInr: 5000,
      lifetimeCreditedInr: 5000,
      lifetimeDebitedInr: 0,
      status: "active",
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      ledger: [
        { txId: "TXN-2104", type: "credit", amountInr: 5000, reason: "Onboarding Starter Bonus Credits", via: "Growth Pro Bundle", at: new Date(Date.now() - 86400000).toISOString() },
      ],
    },
    {
      id: "wal-cand-01",
      ownerType: "Candidate",
      ownerName: "Yogesh",
      ownerEmail: "demo.candidate@talento.app",
      ownerCode: "IAT-CIR-900124",
      balanceInr: 1252,
      lifetimeCreditedInr: 1500,
      lifetimeDebitedInr: 248,
      status: "active",
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      ledger: [
        { txId: "TXN-4001", type: "debit", amountInr: 99, reason: "Profile Boost (7 days)", via: "Wallet Balance", at: new Date(Date.now() - 86400000 * 2).toISOString() },
        { txId: "TXN-4002", type: "credit", amountInr: 500, reason: "Wallet Top-up", via: "UPI · yogesh@okaxis", at: new Date(Date.now() - 86400000 * 5).toISOString() },
        { txId: "TXN-4003", type: "debit", amountInr: 149, reason: "AI Expert Resume Benchmark", via: "Wallet Balance", at: new Date(Date.now() - 86400000 * 9).toISOString() },
      ],
    },
  ];

  // Support Tickets
  const tickets: SuperAdminTicket[] = [
    {
      id: "tkt-01",
      ticketCode: "SUP-4821",
      requesterType: "Employer",
      requesterName: "Meera Krishnan · FinStack Payments",
      requesterEmail: "meera.k@finstackpay.in",
      category: "Verification / KYC",
      subject: "Expedite CIN & GSTIN verification for urgent Series-A engineering hiring drive",
      priority: "urgent",
      status: "open",
      assignedAdmin: "Super Admin",
      slaDueIn: "1h 40m",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      messages: [
        {
          sender: "Meera Krishnan",
          role: "user",
          body: "Hi TalentCIR Ops, we uploaded our MCA incorporation certificate and Maharashtra GSTIN (27AAFCF8821M1Z2). Could you verify our employer account today so our Founding Payment Systems Engineer role goes live?",
          at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    },
    {
      id: "tkt-02",
      ticketCode: "SUP-4819",
      requesterType: "Candidate",
      requesterName: candidates[3]?.fullName || "Aravind Krishnan",
      requesterEmail: candidates[3]?.email || "aravind@talento.app",
      category: "Assessment Proctoring",
      subject: "Clarification on external monitor warning during System Design CIR test",
      priority: "high",
      status: "in_progress",
      assignedAdmin: "Integrity Desk",
      slaDueIn: "4h 15m",
      createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
      messages: [
        {
          sender: candidates[3]?.fullName || "Aravind Krishnan",
          role: "user",
          body: "My laptop dock had a powered-off monitor cable attached for the first 30 seconds before I unplugged it. Requesting manual review of webcam & screen recording.",
          at: new Date(Date.now() - 3600000 * 7).toISOString(),
        },
        {
          sender: "Integrity Desk",
          role: "admin",
          body: "Proctor video segment queued for manual audit. Gaze & keystroke telemetry look normal so far.",
          at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ],
    },
    {
      id: "tkt-03",
      ticketCode: "SUP-4812",
      requesterType: "Employer",
      requesterName: "Super30 Technologies · Billing",
      requesterEmail: "finance@super30.ai",
      category: "Billing & GST",
      subject: "GSTN input credit reflection on INV-2026-00891",
      priority: "normal",
      status: "resolved",
      assignedAdmin: "Finance Ops",
      slaDueIn: "Resolved",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      messages: [
        {
          sender: "Super30 Finance",
          role: "user",
          body: "Please confirm B2B GSTR-1 filing schedule for invoice INV-2026-00891.",
          at: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          sender: "Finance Ops",
          role: "admin",
          body: "Confirmed — IRN e-Invoice generated and queued for current month GSTR-1.",
          at: new Date(Date.now() - 86400000 * 2.8).toISOString(),
        },
      ],
    },
  ];

  // Learning, Hackathons, Mentors & Networking
  const learningEvents: SuperAdminLearningRecord[] = [
    {
      id: "lrn-01",
      kind: "Hackathon",
      code: "HACK-S4",
      title: "Code Arena · Season 4 (National AI & Systems Challenge)",
      organizerOrInstructor: "TalentCIR × Super30 Technologies",
      category: "AI Agents & Distributed Systems",
      participantsCount: 2840,
      completionOrSubmissionRate: 68,
      priceInr: 0,
      revenueGeneratedInr: 350000,
      status: "Active",
      scheduleLabel: "Finals · Dec 2026",
    },
    {
      id: "lrn-02",
      kind: "LMS Course",
      code: "CRS-AI-101",
      title: "AI Engineer & Agentic Workflows Production Track",
      organizerOrInstructor: "Siddharth Rao (Principal AI Architect)",
      category: "Applied GenAI",
      participantsCount: 1420,
      completionOrSubmissionRate: 74,
      priceInr: 0,
      revenueGeneratedInr: 0,
      status: "Active",
      scheduleLabel: "Self-paced · 8 Modules",
    },
    {
      id: "lrn-03",
      kind: "Mentor",
      code: "MNT-204",
      title: "1:1 Staff System Design & Mock CIR Coaching",
      organizerOrInstructor: "18 Verified Principal Engineers",
      category: "Mentorship Marketplace",
      participantsCount: 312,
      completionOrSubmissionRate: 96,
      priceInr: 999,
      revenueGeneratedInr: 311688,
      status: "Active",
      scheduleLabel: "Daily Slots · 4.9★ Avg",
    },
    {
      id: "lrn-04",
      kind: "Networking Event",
      code: "NET-BLR-11",
      title: "Bengaluru CTO & Verified Builders Roundtable",
      organizerOrInstructor: "TalentCIR Community",
      category: "Executive Mixer",
      participantsCount: 185,
      completionOrSubmissionRate: 91,
      priceInr: 499,
      revenueGeneratedInr: 92315,
      status: "Upcoming",
      scheduleLabel: "Bengaluru · Indiranagar",
    },
  ];

  // Immutable Audit Logs
  const auditLogs: SuperAdminAuditEntry[] = [
    {
      id: "aud-901",
      timestamp: new Date(Date.now() - 60000 * 14).toISOString(),
      actorName: "Supabase Live Sync",
      actorRole: "System Cron",
      actorIp: "10.0.4.12",
      action: "db.realtime_snapshot_synced",
      entityTable: "profiles / employers / employer_job_openings",
      entityId: "cluster-primary",
      severity: "info",
      details: `Synchronized ${liveProfiles.length} live candidate profiles, ${liveEmployers.length} live employers, and ${liveJobs.length} live job openings.`,
      metadata: { liveProfiles: liveProfiles.length, liveEmployers: liveEmployers.length, liveJobs: liveJobs.length },
    },
    {
      id: "aud-902",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      actorName: "Proctor Shield v3.4",
      actorRole: "Proctor AI",
      actorIp: "edge-proctor-ap-south-1",
      action: "proctoring.session_flagged",
      entityTable: "proctoring_sessions",
      entityId: assessments[3]?.attemptCode || "ATT-2026-4913",
      severity: "warning",
      details: "Triggered Layer 14 (Secondary HDMI Display) + Layer 4 (Tab Blur) — held credential pending human review.",
      metadata: { trustScore: 68, layers: [4, 14, 19] },
    },
    {
      id: "aud-903",
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      actorName: "Meera Krishnan",
      actorRole: "Employer Owner",
      actorIp: "103.211.54.18 (Mumbai, IN)",
      action: "employer.verification_submitted",
      entityTable: "employers",
      entityId: "IAT-EMP-409112",
      severity: "info",
      details: "Submitted GSTIN 27AAFCF8821M1Z2, CIN U65999MH2022PTC381920, and PAN AAFCF8821M for KYB review.",
      metadata: { company: "FinStack Payments India Pvt. Ltd." },
    },
    {
      id: "aud-904",
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      actorName: "Ananya Rao (Super30 TA)",
      actorRole: "Employer Owner",
      actorIp: "49.207.192.84 (Bengaluru, IN)",
      action: "talent.cir_profile_unlocked",
      entityTable: "talent_access_grants",
      entityId: "GRANT-88210",
      severity: "info",
      details: "Debited ₹400 from Employer Wallet IAT-EMP-204819 to unlock full CIR report & contact details.",
      metadata: { debitInr: 400, remainingBalance: 9200 },
    },
    {
      id: "aud-905",
      timestamp: new Date(Date.now() - 3600000 * 11).toISOString(),
      actorName: "Rate-Limit Edge Guard",
      actorRole: "System Cron",
      actorIp: "185.220.101.42",
      action: "security.rate_limit_throttled",
      entityTable: "rate_limits",
      entityId: "rl-auth-otp-42",
      severity: "critical",
      details: "Blocked automated credential-stuffing burst (42 req/min) on /auth OTP endpoint; IP hash quarantined for 60m.",
      metadata: { endpoint: "/auth/v1/otp", requestsPerMinute: 42, blocked: true },
    },
  ];

  const catalogCount =
    catalogRes.status === "fulfilled" && typeof catalogRes.value.count === "number"
      ? catalogRes.value.count
      : null;
  const lmsCount =
    lmsRes.status === "fulfilled" && typeof lmsRes.value.count === "number"
      ? lmsRes.value.count
      : null;
  const hackCount =
    hackathonsRes.status === "fulfilled" && typeof hackathonsRes.value.count === "number"
      ? hackathonsRes.value.count
      : null;

  const tableHealth: TableHealthSummary[] = [
    { tableName: "public.profiles", domain: "Candidate Identity", liveRows: liveProfiles.length, totalManagedRows: candidates.length, rlsEnabled: true, syncStatus: "Synced" },
    { tableName: "public.skills / experiences / educations", domain: "Candidate Graph", liveRows: liveSkills.length + liveExps.length + liveEdus.length, totalManagedRows: liveSkills.length + liveExps.length + liveEdus.length + candidates.length * 5, rlsEnabled: true, syncStatus: "Synced" },
    { tableName: "public.certifications / projects", domain: "Proof of Work", liveRows: liveCerts.length + liveProjs.length, totalManagedRows: liveCerts.length + liveProjs.length + candidates.length * 3, rlsEnabled: true, syncStatus: "Synced" },
    { tableName: "public.identity_verifications", domain: "Candidate KYC", liveRows: liveKycs.length, totalManagedRows: candidates.length, rlsEnabled: true, syncStatus: "Synced" },
    { tableName: "public.employers & tenant_organizations", domain: "Employer Tenants", liveRows: liveEmployers.length, totalManagedRows: employers.length, rlsEnabled: true, syncStatus: "Synced" },
    { tableName: "public.employer_job_openings", domain: "Job Marketplace", liveRows: liveJobs.length, totalManagedRows: jobs.length, rlsEnabled: true, syncStatus: "Synced" },
    { tableName: "public.job_applications & stage_history", domain: "ATS Pipeline", liveRows: null, totalManagedRows: applications.length, rlsEnabled: true, syncStatus: "Protected (RLS)" },
    { tableName: "public.assessments_catalog & cir_reports", domain: "CIR Engine", liveRows: catalogCount, totalManagedRows: assessments.length, rlsEnabled: true, syncStatus: "Catalog" },
    { tableName: "public.proctoring_sessions (30 Layers)", domain: "AI Integrity", liveRows: null, totalManagedRows: assessments.length, rlsEnabled: true, syncStatus: "Protected (RLS)" },
    { tableName: "public.payment_orders & subscriptions", domain: "Revenue & GST", liveRows: null, totalManagedRows: transactions.length, rlsEnabled: true, syncStatus: "Protected (RLS)" },
    { tableName: "public.wallet_accounts & ledger_entries", domain: "Wallet Ledger", liveRows: null, totalManagedRows: wallets.length, rlsEnabled: true, syncStatus: "Protected (RLS)" },
    { tableName: "public.lms_courses / hackathons / mentors", domain: "Learning & Events", liveRows: (lmsCount ?? 0) + (hackCount ?? 0), totalManagedRows: learningEvents.length, rlsEnabled: true, syncStatus: "Catalog" },
    { tableName: "public.support_tickets & audit_log", domain: "Ops & Security", liveRows: null, totalManagedRows: tickets.length + auditLogs.length, rlsEnabled: true, syncStatus: "Protected (RLS)" },
  ];

  return {
    syncedAt: new Date().toISOString(),
    liveDbConnected,
    liveProfilesCount: liveProfiles.length,
    liveEmployersCount: liveEmployers.length,
    liveJobsCount: liveJobs.length,
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
    featureFlags: DEFAULT_FLAGS,
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
