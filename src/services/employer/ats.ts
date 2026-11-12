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
  Rejected: "Rejected",
  Withdrawn: "Withdrawn",
};

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
  applied_at: string;
  stage_changed_at: string;
  days_in_stage: number;
  talent_cir_id: string | null;
  photo_url: string | null;
  verified: boolean;
}

export interface ApplicationList {
  total: number;
  counts: Record<string, number>;
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

export interface PublishReadiness { ready: boolean; completion: number; missing: string[] }

export interface EmployerOverview {
  tenant_id: string;
  jobs: { total: number; active: number; draft: number; paused: number; pending_review: number; closed: number };
  applications: { total: number; pending: number; shortlisted: number; interview: number; on_hold: number; selected: number; rejected: number };
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
  params: { job?: string | null; stage?: string | null; search?: string; sort?: "recent" | "match"; limit?: number; offset?: number } = {},
) =>
  rpc<ApplicationList>("list_employer_applications", {
    p_job: params.job ?? null,
    p_stage: params.stage ?? null,
    p_search: params.search || null,
    p_limit: params.limit ?? 100,
    p_offset: params.offset ?? 0,
    p_sort: params.sort ?? "recent",
  });

export const getApplication = (id: string) => rpc<ApplicationDetail>("get_employer_application", { p_app: id });
export const changeStage = (id: string, stage: string, note?: string) =>
  rpc("change_application_stage", { p_app: id, p_stage: stage, p_note: note ?? null });
export const releaseHold = (id: string, note?: string) => rpc("release_application_hold", { p_app: id, p_note: note ?? null });
export const saveApplicationNote = (id: string, note: string) => rpc<boolean>("save_application_note", { p_app: id, p_note: note });
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
