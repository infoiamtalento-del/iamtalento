import { rpc } from "@/services/db";

export interface EmployerDashboardData {
  tenant_id: string;
  open_jobs: number;
  draft_jobs: number;
  paused_jobs: number;
  total_jobs: number;
  total_applicants: number;
  applicants_by_stage: Record<string, number>;
  sla_breaches: number;
  interviews_next_7_days: number;
  offers_pending: number;
  wallet_balance: number;
  plan_usage: {
    plan: string;
    tier: string;
    seats_used: number;
    seats_limit: number;
    active_jobs: number;
    active_jobs_limit: number;
  };
  unread_notifications: number;
  applications_trend: Array<{ date: string; count: number }>;
  top_jobs: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
    applicants_count: number;
  }>;
  verification_status: {
    status: "pending" | "verified" | "rejected" | "suspended";
    email_verified: boolean;
    phone_verified: boolean;
    can_post_jobs: boolean;
  };
}

/** Fetches full dashboard summary in a single round trip */
export async function getEmployerDashboard(
  tenantId?: string
): Promise<EmployerDashboardData> {
  const data = await rpc("employer_dashboard", {
    p_tenant: tenantId ?? null,
  });
  return data as unknown as EmployerDashboardData;
}
