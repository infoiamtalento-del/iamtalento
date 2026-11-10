import { rpc } from "@/services/db";
import { mapJob } from "@/services/candidate/jobs";
import type { ProJob } from "@/data/proData";

export interface CreateJobInput {
  tenant_id?: string;
  designation: string;
  job_description: string;
  job_location?: string;
  work_mode?: "Remote" | "Hybrid" | "Onsite";
  job_type?: "Full-time" | "Internship" | "Contract" | "Part-time";
  salary_min?: number;
  salary_max?: number;
  experience_min?: number;
  skills?: string[];
  screening_questions?: Array<{ question: string; required?: boolean }>;
  currency?: string;
  salary_visible?: boolean;
}

export type UpdateJobInput = Partial<CreateJobInput>;

export interface EmployerJobRecord {
  id: string;
  tenant_id: string;
  designation: string;
  job_description: string;
  job_location: string;
  work_mode: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  experience_min: number;
  skills: string[];
  status: "draft" | "pending_review" | "active" | "paused" | "closed" | "expired" | "rejected";
  published_at: string | null;
  closes_at: string | null;
  closed_reason: string | null;
  moderation_note: string | null;
  slug: string;
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export interface JobStats {
  job_id: string;
  views: number;
  applies: number;
  stage_funnel: Record<string, number>;
  avg_match_score: number;
  time_to_first_view_hours: number | null;
}

export { mapJob };

/** Creates a job posting in draft status */
export async function createJob(input: CreateJobInput): Promise<EmployerJobRecord> {
  const data = await rpc("create_job", { p: input as unknown as Record<string, unknown> });
  return data as unknown as EmployerJobRecord;
}

/** Updates a draft, paused, or active job */
export async function updateJob(jobId: string, input: UpdateJobInput): Promise<EmployerJobRecord> {
  const data = await rpc("update_job", { p_job_id: jobId, p: input as unknown as Record<string, unknown> });
  return data as unknown as EmployerJobRecord;
}

/** Publishes a job: validates completeness and sets active (or pending_review if unverified/flagged) */
export async function publishJob(jobId: string, closesAt?: string): Promise<EmployerJobRecord> {
  const data = await rpc("publish_job", { p_job_id: jobId, p_closes_at: closesAt ?? null });
  return data as unknown as EmployerJobRecord;
}

/** Pauses an active job */
export async function pauseJob(jobId: string): Promise<EmployerJobRecord> {
  const data = await rpc("pause_job", { p_job_id: jobId });
  return data as unknown as EmployerJobRecord;
}

/** Resumes a paused job */
export async function resumeJob(jobId: string): Promise<EmployerJobRecord> {
  const data = await rpc("resume_job", { p_job_id: jobId });
  return data as unknown as EmployerJobRecord;
}

/** Closes a job and notifies all in-flight applicants */
export async function closeJob(jobId: string, reason?: string): Promise<EmployerJobRecord> {
  const data = await rpc("close_job", { p_job_id: jobId, p_reason: reason });
  return data as unknown as EmployerJobRecord;
}

/** Duplicates a job into a new draft */
export async function duplicateJob(jobId: string): Promise<EmployerJobRecord> {
  const data = await rpc("duplicate_job", { p_job_id: jobId });
  return data as unknown as EmployerJobRecord;
}

/** Soft deletes a job (only allowed when 0 applications exist) */
export async function deleteJob(jobId: string): Promise<boolean> {
  const data = await rpc("delete_job", { p_job_id: jobId });
  return Boolean(data);
}

/** Lists jobs for the caller's tenant */
export async function listMyJobs(params?: {
  status?: string[];
  search?: string;
  cursor?: string;
  limit?: number;
}): Promise<EmployerJobRecord[]> {
  const data = await rpc("list_my_jobs", {
    p_status: params?.status ?? null,
    p_search: params?.search ?? null,
    p_cursor: params?.cursor ?? null,
    p_limit: params?.limit ?? 20,
  });
  return (data ?? []) as unknown as EmployerJobRecord[];
}

/** Fetches full job configuration for editing */
export async function getJobForEdit(jobId: string): Promise<EmployerJobRecord> {
  const data = await rpc("get_job_for_edit", { p_job_id: jobId });
  return data as unknown as EmployerJobRecord;
}

/** Fetches detailed job analytics funnel */
export async function getJobStats(jobId: string): Promise<JobStats> {
  const data = await rpc("job_stats", { p_job_id: jobId });
  return data as unknown as JobStats;
}

/** Records a job view (deduped per day) */
export async function recordJobView(jobId: string, viewerHash?: string): Promise<boolean> {
  const data = await rpc("record_job_view", { p_job_id: jobId, p_viewer_hash: viewerHash ?? null });
  return Boolean(data);
}

/** Helper converting EmployerJobRecord to ProJob */
export function toProJob(job: EmployerJobRecord): ProJob {
  return mapJob({
    id: job.id,
    designation: job.designation,
    company_name: null,
    job_location: job.job_location,
    work_mode: job.work_mode as ProJob["m"],
    job_type: job.job_type as ProJob["ty"],
    experience_min: job.experience_min,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    skills: job.skills,
    job_description: job.job_description,
    created_at: job.created_at,
    user_id: null,
    source: "employer",
  });
}
