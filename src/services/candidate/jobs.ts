import { db, rpc, currentUserId, registerId, uuidFor } from "@/services/db";
import type { ProJob, ProApplication } from "@/data/proData";

interface JobRow {
  id: string;
  designation: string | null;
  company_name: string | null;
  job_location: string | null;
  work_mode: ProJob["m"] | null;
  job_type: ProJob["ty"] | null;
  experience_min: number | null;
  salary_min: number | null;
  salary_max: number | null;
  skills: string[] | null;
  job_description: string | null;
  created_at: string;
  user_id: string | null;
  source: string;
}

interface StageRow { to_stage: string; message: string | null; is_auto: boolean; created_at: string }
interface ApplicationRow {
  id: string;
  job_id: string;
  stage: string;
  cover_note: string | null;
  recruiter_note: string | null;
  interview_at: string | null;
  viewed_at: string | null;
  applied_at: string;
  profile_snapshot: { name?: string; skills?: string[]; certifications?: string[]; experience_years?: number } | null;
  application_stage_history: StageRow[] | null;
}

const JOB_COLUMNS =
  "id, designation, company_name, job_location, work_mode, job_type, experience_min, salary_min, salary_max, skills, job_description, created_at, user_id, source";

export const mapJob = (row: JobRow): ProJob => ({
  id: registerId(row.id),
  t: row.designation ?? "Untitled role",
  c: row.company_name ?? "Company",
  l: row.job_location ?? "India",
  m: row.work_mode ?? "Onsite",
  ty: row.job_type ?? "Full-time",
  e: Number(row.experience_min ?? 0),
  a: Number(row.salary_min ?? 0),
  b: Number(row.salary_max ?? 0),
  sk: row.skills ?? [],
  description: row.job_description ?? undefined,
  at: new Date(row.created_at).getTime(),
  by: row.source === "platform" ? `hr@${(row.company_name ?? "company").toLowerCase().replace(/[^a-z]/g, "")}.com` : row.user_id ?? "",
});

export async function fetchJobs(): Promise<ProJob[]> {
  const { data, error } = await db
    .from("employer_job_openings")
    .select(JOB_COLUMNS)
    .eq("status", "active")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data as JobRow[]).map(mapJob);
}

export async function fetchMyApplications(email: string, fallbackName: string): Promise<ProApplication[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db
    .from("job_applications")
    .select("id, job_id, stage, cover_note, recruiter_note, interview_at, viewed_at, applied_at, profile_snapshot, application_stage_history(to_stage, message, is_auto, created_at)")
    .eq("candidate_id", uid)
    .neq("stage", "Withdrawn")
    .order("applied_at", { ascending: false });
  if (error) throw error;
  return (data as ApplicationRow[]).map((row) => {
    const snap = row.profile_snapshot ?? {};
    return {
      id: registerId(row.id),
      jid: registerId(row.job_id),
      who: email,
      name: snap.name || fallbackName,
      exp: snap.experience_years ?? 0,
      sk: snap.skills ?? [],
      ce: snap.certifications ?? [],
      st: row.stage as ProApplication["st"],
      at: new Date(row.applied_at).getTime(),
      cn: row.cover_note ?? "",
      note: row.recruiter_note ?? undefined,
      iv: row.interview_at ?? undefined,
      vw: row.viewed_at ? new Date(row.viewed_at).getTime() : undefined,
      upd: (row.application_stage_history ?? [])
        .slice()
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map((h) => ({ msg: h.message ?? h.to_stage, at: new Date(h.created_at).getTime(), auto: h.is_auto })),
    };
  });
}

export async function fetchSavedJobIds(): Promise<number[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data, error } = await db.from("saved_jobs").select("job_id").eq("user_id", uid);
  if (error) throw error;
  return (data as { job_id: string }[]).map((r) => registerId(r.job_id));
}

export async function applyToJob(numericJobId: number, coverNote?: string) {
  const jobUuid = uuidFor(numericJobId);
  if (!jobUuid) throw new Error("This job is not available on the server.");
  return rpc<{ id: string; match_score: number | null }>("apply_to_job", { p_job: jobUuid, p_cover_note: coverNote ?? null });
}

export async function withdrawApplication(numericAppId: number) {
  const appUuid = uuidFor(numericAppId);
  if (!appUuid) throw new Error("Application not found.");
  return rpc("withdraw_application", { p_application: appUuid });
}

export async function toggleSavedJob(numericJobId: number): Promise<boolean> {
  const jobUuid = uuidFor(numericJobId);
  if (!jobUuid) throw new Error("This job is not available on the server.");
  return rpc<boolean>("toggle_saved_job", { p_job: jobUuid });
}

export async function fetchMatchScore(numericJobId: number) {
  const uid = await currentUserId();
  const jobUuid = uuidFor(numericJobId);
  if (!uid || !jobUuid) return null;
  return rpc<{ score: number; has_cir: boolean; skill_overlap: number; semantic: number; experience_fit: number }>(
    "compute_match_score", { p_user: uid, p_job: jobUuid });
}

export const isBackendJob = (numericJobId: number): boolean => uuidFor(numericJobId) !== undefined;

export interface SearchJobsRow {
  id: string;
  designation: string | null;
  company_name: string | null;
  job_location: string | null;
  work_mode: ProJob["m"] | null;
  job_type: ProJob["ty"] | null;
  experience_min: number | null;
  salary_min: number | null;
  salary_max: number | null;
  skills: string[] | null;
  created_at: string;
  match_score: number | null;
  total_count: number;
}

export interface LiveJobResult extends ProJob {
  uuid: string;
  matchScore: number | null;
}

export interface SearchJobsFilters {
  query?: string;
  workMode?: "Remote" | "Hybrid" | "Onsite" | null;
  jobType?: string | null;
  maxExp?: number | null;
  location?: string;
  minSalary?: number | null;
  skills?: string[];
  sort?: "recent" | "match" | "salary";
  limit?: number;
  offset?: number;
}

export function parseExperienceMax(label?: string): number | null {
  if (!label) return null;
  if (label === "Fresher") return 0;
  if (label === "1-3 years") return 3;
  if (label === "3-5 years") return 5;
  if (label === "5-10 years") return 10;
  return null;
}

export async function searchLiveJobs(filters: SearchJobsFilters = {}): Promise<{ items: LiveJobResult[]; total: number }> {
  const rows = await rpc<SearchJobsRow[]>("search_jobs", {
    p_query: filters.query?.trim() || null,
    p_work_mode: filters.workMode || null,
    p_job_type: filters.jobType || null,
    p_max_exp: filters.maxExp ?? null,
    p_location: filters.location?.trim() || null,
    p_min_salary: filters.minSalary ?? null,
    p_skills: filters.skills && filters.skills.length > 0 ? filters.skills : null,
    p_sort: filters.sort ?? "recent",
    p_limit: filters.limit ?? 12,
    p_offset: filters.offset ?? 0,
  });
  const list = rows ?? [];
  const total = list.length > 0 ? Number(list[0].total_count ?? list.length) : 0;
  const items: LiveJobResult[] = list.map((r) => ({
    id: registerId(r.id),
    uuid: r.id,
    t: r.designation ?? "Untitled role",
    c: r.company_name ?? "Company",
    l: r.job_location ?? "India",
    m: r.work_mode ?? "Onsite",
    ty: r.job_type ?? "Full-time",
    e: Number(r.experience_min ?? 0),
    a: Number(r.salary_min ?? 0),
    b: Number(r.salary_max ?? 0),
    sk: r.skills ?? [],
    at: new Date(r.created_at).getTime(),
    by: "",
    matchScore: r.match_score !== null && r.match_score !== undefined ? Math.round(Number(r.match_score)) : null,
  }));
  return { items, total };
}

export async function subscribeJobAlerts(
  email: string,
  keywords: string[] = [],
  location?: string,
  workMode?: "Remote" | "Hybrid" | "Onsite",
): Promise<string> {
  return rpc<string>("subscribe_job_alerts", {
    p_email: email.trim(),
    p_keywords: keywords,
    p_location: location?.trim() || null,
    p_work_mode: workMode ?? null,
  });
}
