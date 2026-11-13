import { rpc, db } from "@/services/db";

export const APPLICATION_STAGES = ["Applied", "Shortlisted", "Interview", "On Hold", "Offer", "Rejected"] as const;
export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

/** Label shown to the employer for a stage ("Offer" is the selected outcome). */
export const STAGE_LABEL: Record<string, string> = {
  Applied: "Pending",
  Shortlisted: "Shortlisted",
  Interview: "Interview",
  "On Hold": "On Hold",
  Offer: "Selected",
  Hired: "Hired",
  Rejected: "Rejected",
  Withdrawn: "Withdrawn",
};

/** All 11 Application Management Views required by Section 3 */
export const APPLICATION_BUCKETS = [
  { key: "all", label: "All Applications" },
  { key: "new", label: "New Applications" },
  { key: "ai_screened", label: "AI Screened" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "rejected", label: "Rejected" },
  { key: "on_hold", label: "On-Hold" },
  { key: "interview_scheduled", label: "Interview Scheduled" },
  { key: "assessment_pending", label: "Assessment Pending" },
  { key: "assessment_completed", label: "Assessment Completed" },
  { key: "offer_released", label: "Offer Released" },
  { key: "hired", label: "Hired Candidates" },
] as const;

export type ApplicationBucket = (typeof APPLICATION_BUCKETS)[number]["key"];

export interface LiveApplication {
  id: string;
  job_id: string;
  job_title: string;
  candidate_id: string;
  name: string;
  headline: string | null;
  experience_years: number | null;
  skills: string[];
  stage: string;
  match_score: number | null;
  cover_note: string | null;
  recruiter_note?: string | null;
  applied_at: string;
  viewed_at?: string | null;
  interview_at?: string | null;
  stage_changed_at: string;
  days_in_stage: number;
  talent_cir_id: string | null;
  photo_url: string | null;
  verified: boolean;
  assigned_recruiter_id?: string | null;
  assigned_recruiter_name?: string | null;
  ai_screened?: boolean;
  assessment_status?: "none" | "pending" | "completed";
  offer_released?: boolean;
  offer_released_at?: string | null;
  is_hired?: boolean;
  hired_at?: string | null;
  cir_score?: number | null;
  readiness_score?: number | null;
  resume_url?: string | null;
}

export interface ApplicationList {
  total: number;
  counts: Record<string, number>;
  buckets?: Partial<Record<ApplicationBucket, number>>;
  items: LiveApplication[];
}

export interface TalentAccess {
  profile: boolean;
  cv: boolean;
  cir: boolean;
  via: "none" | "applicant" | "purchase" | "subscription";
  verified: boolean;
  applicant: boolean;
}

export interface ApplicationDetail {
  id: string;
  job_id: string;
  job_title: string;
  stage: string;
  applied_at: string;
  stage_changed_at: string;
  match_score: number | null;
  cover_note: string | null;
  recruiter_note: string | null;
  assigned_recruiter_id?: string | null;
  assigned_recruiter_name?: string | null;
  ai_screened?: boolean;
  assessment_status?: "none" | "pending" | "completed";
  offer_released?: boolean;
  offer_released_at?: string | null;
  is_hired?: boolean;
  hired_at?: string | null;
  joining_date?: string | null;
  candidate_id: string;
  candidate: {
    name: string;
    email: string | null;
    phone: string | null;
    headline: string | null;
    city: string | null;
    experience_years: number | null;
    skills: string[];
    certifications: string[];
    verified: boolean;
    photo_url: string | null;
    talent_cir_id: string | null;
    about: string | null;
    resume_path: string | null;
    resume_url: string | null;
  };
  history: Array<{ id: number; from: string | null; to: string; message: string | null; auto: boolean; at: string }>;
  interviews: Array<{ id: string; scheduled_at: string; duration_min: number; mode: string; meeting_url: string | null; status: string }>;
  cir_available: boolean;
  access: TalentAccess;
}

export interface TenantRecruiter {
  user_id: string;
  name: string;
  email: string | null;
  role: string;
}

export interface ComparedApplication {
  id: string;
  job_id: string;
  job_title: string;
  candidate_id: string;
  name: string;
  headline: string | null;
  city: string | null;
  experience_years: number;
  match_score: number | null;
  cir_score: number | null;
  readiness_score: number | null;
  skills: string[];
  certifications: string[];
  stage: string;
  is_hired: boolean;
  offer_released: boolean;
  assessment_status: string;
  ai_screened: boolean;
  assigned_recruiter_name: string | null;
  recruiter_note: string | null;
  interviews_count: number;
  applied_at: string;
  verified: boolean;
  photo_url: string | null;
}

export interface ExportedApplicationRow {
  application_id: string;
  candidate_name: string;
  talent_cir_id?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  job_title: string;
  stage: string;
  hiring_status: string;
  match_score: number | null;
  experience_years: number;
  skills: string | null;
  assessment_status?: string | null;
  ai_screened?: boolean;
  assigned_recruiter?: string | null;
  recruiter_note?: string | null;
  applied_at: string;
}

export interface PublishReadiness { ready: boolean; completion: number; missing: string[] }

export interface EmployerOverview {
  tenant_id: string;
  jobs: { total: number; active: number; draft: number; scheduled?: number; paused: number; pending_review: number; closed: number; featured?: number };
  applications: { total: number; pending: number; shortlisted: number; interview: number; on_hold: number; selected: number; hired?: number; rejected: number };
  recent_applications: Array<{ id: string; name: string; job_title: string; stage: string; applied_at: string; match_score: number | null }>;
  job_performance: Array<{ id: string; title: string; status: string; views: number; applications: number; conversion: number }>;
  wallet_balance: number;
  unread_notifications: number;
  readiness: PublishReadiness;
}

export interface ActivityEntry {
  id: number;
  at: string;
  action: string;
  entity: string;
  entity_id: string | null;
  meta: Record<string, unknown>;
  actor: string | null;
}

export interface EmployerSettings {
  followups_enabled: boolean;
  followup_pending_days: number;
  followup_shortlist_days: number;
  followup_hold_days: number;
  followup_interview_grace_hours: number;
  notify_prefs: { email: boolean; applications: boolean; followups: boolean; weekly_digest: boolean };
  privacy: { show_contact_public: boolean; show_hiring_activity: boolean };
}

export type EmployerSettingsPatch = Partial<Omit<EmployerSettings, "notify_prefs" | "privacy">> & {
  notify_prefs?: Partial<EmployerSettings["notify_prefs"]>;
  privacy?: Partial<EmployerSettings["privacy"]>;
};

export const listApplications = (
  params: {
    job?: string | null;
    stage?: string | null;
    search?: string;
    sort?: "recent" | "match";
    limit?: number;
    offset?: number;
    bucket?: ApplicationBucket | null;
    recruiter?: string | null;
    minMatch?: number | null;
  } = {},
) =>
  rpc<ApplicationList>("list_employer_applications", {
    p_job: params.job ?? null,
    p_stage: params.stage ?? null,
    p_search: params.search || null,
    p_limit: params.limit ?? 100,
    p_offset: params.offset ?? 0,
    p_sort: params.sort ?? "recent",
    p_bucket: params.bucket && params.bucket !== "all" ? params.bucket : null,
    p_recruiter: params.recruiter ?? null,
    p_min_match: params.minMatch ?? null,
  });

export const getApplication = (id: string) => rpc<ApplicationDetail>("get_employer_application", { p_app: id });
export const changeStage = (id: string, stage: string, note?: string) =>
  rpc("change_application_stage", { p_app: id, p_stage: stage, p_note: note ?? null });
export const releaseHold = (id: string, note?: string) => rpc("release_application_hold", { p_app: id, p_note: note ?? null });
export const saveApplicationNote = (id: string, note: string) => rpc<boolean>("save_application_note", { p_app: id, p_note: note });
export const markApplicationHired = (id: string, joiningDate?: string | null, note?: string) =>
  rpc("mark_application_hired", { p_app: id, p_joining_date: joiningDate ?? null, p_note: note ?? null });
export const bulkChangeStage = (ids: string[], stage: string, note?: string) =>
  rpc<{ updated: number; stage: string }>("bulk_change_application_stage", {
    p_apps: ids,
    p_stage: stage,
    p_note: note ?? null,
  });
export const listTenantRecruiters = () => rpc<TenantRecruiter[]>("list_tenant_recruiters");
export const assignRecruiter = (ids: string[], recruiterId?: string | null, recruiterName?: string | null) =>
  rpc<number>("assign_application_recruiter", {
    p_apps: ids,
    p_recruiter_id: recruiterId ?? null,
    p_recruiter_name: recruiterName ?? null,
  });
export const setApplicationWorkflowFlags = (
  ids: string[],
  flags: { aiScreened?: boolean | null; assessmentStatus?: "none" | "pending" | "completed" | null },
) =>
  rpc<number>("set_application_workflow_flags", {
    p_apps: ids,
    p_ai_screened: flags.aiScreened ?? null,
    p_assessment_status: flags.assessmentStatus ?? null,
  });
export const compareApplications = (ids: string[]) =>
  rpc<ComparedApplication[]>("compare_applications", { p_apps: ids });
export const exportApplications = (params: { job?: string | null; stage?: string | null; bucket?: string | null } = {}) =>
  rpc<ExportedApplicationRow[]>("export_employer_applications", {
    p_job: params.job ?? null,
    p_stage: params.stage ?? null,
    p_bucket: params.bucket && params.bucket !== "all" ? params.bucket : null,
  });

export const getOverview = () => rpc<EmployerOverview>("employer_overview");
export const listActivity = (limit = 30, offset = 0) => rpc<ActivityEntry[]>("list_employer_activity", { p_limit: limit, p_offset: offset });
export const getPublishReadiness = () => rpc<PublishReadiness>("employer_publish_readiness");
export const getEmployerSettings = () => rpc<EmployerSettings>("get_employer_settings");
export const saveEmployerSettings = (patch: EmployerSettingsPatch) => rpc<EmployerSettings>("save_employer_settings", { p: patch });

export interface EmployerNotification {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  data: { application_id?: string; suggested_action?: string; days?: number; stage?: string };
  read_at: string | null;
  acted_at: string | null;
  created_at: string;
}

export async function listEmployerNotifications(limit = 100): Promise<EmployerNotification[]> {
  const { data, error } = await db.from("notifications").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as EmployerNotification[];
}

export const markNotificationsRead = (ids?: string[]) => rpc<number>("mark_notifications_read", { p_ids: ids ?? null });
export const markNotificationActed = (id: string) => rpc<boolean>("mark_notification_acted", { p_id: id });

/** Pulls the application id out of a `/talento-pro?view=pipe&application=<uuid>` link. */
export function applicationIdFromLink(link: string | null | undefined): string | null {
  if (!link) return null;
  const match = /[?&]application=([0-9a-f-]{36})/i.exec(link);
  return match ? match[1] : null;
}

const escapeCsvCell = (val: unknown): string => {
  const str = val == null ? "" : String(val);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export function applicationsToCsv(rows: ExportedApplicationRow[]): string {
  const headers = [
    "Application ID",
    "Candidate Name",
    "Talent CIR ID",
    "Email",
    "Phone",
    "City",
    "Job Title",
    "Pipeline Stage",
    "Hiring Status",
    "Match Score (%)",
    "Experience (Yrs)",
    "Skills",
    "Assessment Status",
    "AI Screened",
    "Assigned Recruiter",
    "Internal Note",
    "Applied At",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.application_id,
        r.candidate_name,
        r.talent_cir_id ?? "",
        r.email ?? "",
        r.phone ?? "",
        r.city ?? "",
        r.job_title,
        r.stage,
        r.hiring_status,
        r.match_score ?? "",
        r.experience_years ?? 0,
        r.skills ?? "",
        r.assessment_status ?? "none",
        r.ai_screened ? "Yes" : "No",
        r.assigned_recruiter ?? "",
        r.recruiter_note ?? "",
        r.applied_at,
      ]
        .map(escapeCsvCell)
        .join(","),
    ),
  ];
  return lines.join("\r\n");
}

export function triggerTextDownload(filename: string, content: string, mimeType = "text/csv;charset=utf-8;"): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
