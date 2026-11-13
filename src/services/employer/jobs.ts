import { rpc } from "@/services/db";
import { mapJob } from "@/services/candidate/jobs";
import type { ProJob } from "@/data/proData";

export interface CreateJobInput {
  tenant_id?: string;
  designation: string;
  job_description: string;
  qualifications?: string;
  responsibilities?: string;
  benefits?: string[];
  requirements?: string;
  industry?: string;
  department?: string;
  job_function?: string;
  city?: string;
  country?: string;
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
  auto_close_on_expiry?: boolean;
  expiry_reminder_days?: number;
  is_featured?: boolean;
  is_sponsored?: boolean;
}

export type UpdateJobInput = Partial<CreateJobInput>;

export interface EmployerJobRecord {
  id: string;
  tenant_id: string;
  designation: string;
  job_description: string;
  qualifications?: string | null;
  responsibilities?: string | null;
  benefits?: string[];
  requirements?: string | null;
  industry?: string | null;
  department?: string | null;
  job_function?: string | null;
  city?: string | null;
  country?: string | null;
  job_location: string;
  work_mode: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_visible?: boolean;
  experience_min: number;
  skills: string[];
  status: "draft" | "pending_review" | "scheduled" | "active" | "paused" | "closed" | "expired" | "rejected";
  published_at: string | null;
  scheduled_publish_at?: string | null;
  closes_at: string | null;
  auto_close_on_expiry?: boolean;
  expiry_reminder_days?: number;
  is_featured?: boolean;
  is_sponsored?: boolean;
  promotion_tier?: "featured" | "sponsored" | null;
  promoted_until?: string | null;
  closed_reason: string | null;
  moderation_note: string | null;
  slug: string;
  views_count: number;
  applications_count: number;
  conversion_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface JobStats {
  job_id: string;
  views: number;
  applies: number;
  conversion_rate?: number;
  stage_funnel: Record<string, number>;
  avg_match_score: number;
  time_to_first_view_hours: number | null;
}

export interface DuplicateJobMatch {
  id: string;
  designation: string;
  status: string;
  job_location: string | null;
  work_mode: string | null;
  created_at: string;
  similarity_pct: number;
}

export interface DuplicateJobCheck {
  has_duplicates: boolean;
  matches: DuplicateJobMatch[];
}

export interface SalaryBenchmark {
  min_lpa: number;
  median_lpa: number;
  max_lpa: number;
  sample_size: number;
  currency: string;
  location_factor: number;
}

export interface CompetitorJobAnalysis {
  competing_openings: number;
  active_employers: number;
  avg_salary_min: number;
  avg_salary_max: number;
  remote_share_pct: number;
  hybrid_share_pct: number;
  top_skills: string[];
  demand_level: "High" | "Moderate" | "Emerging" | string;
}

export interface JobAiAssist {
  suggested_skills: string[];
  job_description: string;
  responsibilities: string;
  qualifications: string;
  requirements: string;
  benefits: string[];
}

export { mapJob };

/** Creates a job posting in draft status */
export async function createJob(input: CreateJobInput): Promise<EmployerJobRecord> {
  const data = await rpc("create_job", { p: input as unknown as Record<string, unknown> });
  return data as unknown as EmployerJobRecord;
}

/** Updates a draft, scheduled, paused, active, closed, or expired job */
export async function updateJob(jobId: string, input: UpdateJobInput): Promise<EmployerJobRecord> {
  const data = await rpc("update_job", { p_job_id: jobId, p: input as unknown as Record<string, unknown> });
  return data as unknown as EmployerJobRecord;
}

/** Publishes a job: validates completeness and sets active (or pending_review if unverified/flagged) */
export async function publishJob(jobId: string, closesAt?: string): Promise<EmployerJobRecord> {
  const data = await rpc("publish_job", { p_job_id: jobId, p_closes_at: closesAt ?? null });
  return data as unknown as EmployerJobRecord;
}

/** Schedules a job to publish automatically at a future timestamp */
export async function scheduleJobPublish(
  jobId: string,
  publishAt: string,
  closesAt?: string,
): Promise<EmployerJobRecord> {
  const data = await rpc("schedule_job_publish", {
    p_job_id: jobId,
    p_publish_at: publishAt,
    p_closes_at: closesAt ?? null,
  });
  return data as unknown as EmployerJobRecord;
}

/** Pauses an active or scheduled job */
export async function pauseJob(jobId: string): Promise<EmployerJobRecord> {
  const data = await rpc("pause_job", { p_job_id: jobId });
  return data as unknown as EmployerJobRecord;
}

/** Resumes a paused job */
export async function resumeJob(jobId: string): Promise<EmployerJobRecord> {
  const data = await rpc("resume_job", { p_job_id: jobId });
  return data as unknown as EmployerJobRecord;
}

/** Renews a closed, expired, paused, or active job for N days */
export async function renewJob(jobId: string, days = 30): Promise<EmployerJobRecord> {
  const data = await rpc("renew_job", { p_job_id: jobId, p_days: days });
  return data as unknown as EmployerJobRecord;
}

/** Promotes a job as Featured or Sponsored (or clears promotion with 'none') */
export async function promoteJob(
  jobId: string,
  tier: "none" | "featured" | "sponsored",
  days = 14,
): Promise<EmployerJobRecord> {
  const data = await rpc("promote_job", { p_job_id: jobId, p_tier: tier, p_days: days });
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

/** Checks for duplicate/similar job postings within the employer's tenant */
export async function checkDuplicateJobs(params: {
  title: string;
  location?: string;
  skills?: string[];
  excludeJobId?: string | null;
}): Promise<DuplicateJobCheck> {
  const data = await rpc("check_duplicate_jobs", {
    p_title: params.title,
    p_location: params.location ?? null,
    p_skills: params.skills?.length ? params.skills : null,
    p_exclude_job: params.excludeJobId ?? null,
  });
  return (data ?? { has_duplicates: false, matches: [] }) as unknown as DuplicateJobCheck;
}

/** Fetches salary benchmark suggestions for a role, location, and experience level */
export async function getSalaryBenchmark(params: {
  title: string;
  location?: string;
  experienceMin?: number;
}): Promise<SalaryBenchmark> {
  const data = await rpc("get_salary_benchmark", {
    p_title: params.title,
    p_location: params.location ?? null,
    p_exp_min: params.experienceMin ?? 0,
  });
  return data as unknown as SalaryBenchmark;
}

/** Analyzes competing active job postings on the platform */
export async function getCompetitorJobAnalysis(params: {
  title: string;
  skills?: string[];
  location?: string;
}): Promise<CompetitorJobAnalysis> {
  const data = await rpc("get_competitor_job_analysis", {
    p_title: params.title,
    p_skills: params.skills?.length ? params.skills : null,
    p_location: params.location ?? null,
  });
  return data as unknown as CompetitorJobAnalysis;
}

/** Generates structured AI job description, details, and skill suggestions */
export async function generateJobAiAssist(
  input: Partial<CreateJobInput> & { company_name?: string },
): Promise<JobAiAssist> {
  const data = await rpc("generate_job_ai_assist", {
    p: input as unknown as Record<string, unknown>,
  });
  return data as unknown as JobAiAssist;
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
