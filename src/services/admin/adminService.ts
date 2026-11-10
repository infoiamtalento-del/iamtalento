import { supabase } from "@/integrations/supabase/client";

export interface AdminEmployer {
  id: string;
  user_id: string;
  company_name: string;
  official_email: string;
  contact_name: string;
  verification_status: "pending" | "verified" | "rejected" | "suspended";
  tenant_id: string | null;
  tenant_name: string | null;
  created_at: string;
}

export interface AdminPendingJob {
  id: string;
  tenant_id: string;
  company_name: string;
  designation: string;
  created_at: string;
  status: string;
}

export interface AdminStats {
  total_candidates: number;
  total_employers: number;
  active_jobs: number;
  total_applications: number;
  generated_at: string;
}

export async function adminListEmployers(
  status?: string,
  search?: string,
  limit = 50
): Promise<AdminEmployer[]> {
  const { data, error } = await (supabase as any).rpc("admin_list_employers", {
    p_status: status || null,
    p_search: search || null,
    p_limit: limit,
  });
  if (error) throw error;
  return data || [];
}

export async function adminReviewEmployer(
  employerId: string,
  status: "verified" | "rejected" | "suspended" | "pending",
  reason?: string
): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("admin_review_employer", {
    p_employer_id: employerId,
    p_status: status,
    p_reason: reason || null,
  });
  if (error) throw error;
  return data;
}

export async function adminSuspendUser(userId: string, reason: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("admin_suspend_user", {
    p_user_id: userId,
    p_reason: reason,
  });
  if (error) throw error;
  return data;
}

export async function adminListJobsPending(limit = 50): Promise<AdminPendingJob[]> {
  const { data, error } = await (supabase as any).rpc("admin_list_jobs_pending", {
    p_limit: limit,
  });
  if (error) throw error;
  return data || [];
}

export async function adminModerateJob(
  jobId: string,
  approve: boolean,
  reason?: string
): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("admin_moderate_job", {
    p_job_id: jobId,
    p_approve: approve,
    p_reason: reason || null,
  });
  if (error) throw error;
  return data;
}

export async function adminGetStats(): Promise<AdminStats> {
  const { data, error } = await (supabase as any).rpc("admin_stats");
  if (error) throw error;
  return data;
}
