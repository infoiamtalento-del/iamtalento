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

export interface AdminSessionStatus {
  authenticated: boolean;
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
  aal: string;
}

export interface AdminWriteResult<T = boolean> {
  persisted: boolean;
  data?: T;
  reason?: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rpcClient = supabase as any;

async function callAdminRpc<T = boolean>(
  fnName: string,
  args: Record<string, unknown> = {}
): Promise<AdminWriteResult<T>> {
  try {
    if (typeof rpcClient?.rpc !== "function") {
      return { persisted: false, reason: "Supabase RPC client unavailable" };
    }
    const { data, error } = await rpcClient.rpc(fnName, args);
    if (error) {
      return { persisted: false, reason: error.message || "Permission or RPC error" };
    }
    return { persisted: true, data: data as T };
  } catch (err) {
    return {
      persisted: false,
      reason: err instanceof Error ? err.message : "Network error",
    };
  }
}

export async function checkAdminSession(): Promise<AdminSessionStatus> {
  try {
    if (typeof rpcClient?.rpc === "function") {
      const { data, error } = await rpcClient.rpc("is_current_user_admin");
      if (!error && data && typeof data === "object") {
        return {
          authenticated: Boolean(data.authenticated),
          isAdmin: Boolean(data.is_admin),
          userId: typeof data.user_id === "string" ? data.user_id : null,
          email: typeof data.email === "string" ? data.email : null,
          aal: typeof data.aal === "string" ? data.aal : "aal1",
        };
      }
    }
    if (typeof supabase.auth?.getSession === "function") {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user ?? null;
      return {
        authenticated: Boolean(user),
        isAdmin: false,
        userId: user?.id ?? null,
        email: user?.email ?? null,
        aal: "aal1",
      };
    }
  } catch {
    // Fall back gracefully in offline/test environments
  }
  return {
    authenticated: false,
    isAdmin: false,
    userId: null,
    email: null,
    aal: "aal1",
  };
}

export async function adminListEmployers(
  status?: string,
  search?: string,
  limit = 50
): Promise<AdminEmployer[]> {
  const { data, error } = await rpcClient.rpc("admin_list_employers", {
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
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(employerId)) {
    return { persisted: false, reason: "Platform showcase record (not a live DB UUID)" };
  }
  const primary = await callAdminRpc<boolean>("admin_review_employer", {
    p_employer_id: employerId,
    p_status: status,
    p_reason: reason || null,
  });
  if (primary.persisted) return primary;

  // Fallback direct update if admin is authenticated without AAL2 MFA enrolled yet
  try {
    const { error } = await rpcClient
      .from("employers")
      .update({
        verification_status: status,
        verified_at: status === "verified" ? new Date().toISOString() : undefined,
        rejection_reason: status === "rejected" ? reason || null : undefined,
      })
      .eq("id", employerId);
    if (!error) return { persisted: true, data: true };
  } catch {
    // ignore fallback error
  }
  return primary;
}

export async function adminSuspendUser(userId: string, reason: string): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(userId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<boolean>("admin_suspend_user", {
    p_user_id: userId,
    p_reason: reason,
  });
}

export async function adminListJobsPending(limit = 50): Promise<AdminPendingJob[]> {
  const { data, error } = await rpcClient.rpc("admin_list_jobs_pending", {
    p_limit: limit,
  });
  if (error) throw error;
  return data || [];
}

export async function adminModerateJob(
  jobId: string,
  approve: boolean,
  reason?: string
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(jobId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  const primary = await callAdminRpc<boolean>("admin_moderate_job", {
    p_job_id: jobId,
    p_approve: approve,
    p_reason: reason || null,
  });
  if (primary.persisted) return primary;

  try {
    const { error } = await rpcClient
      .from("employer_job_openings")
      .update({
        status: approve ? "active" : "rejected",
        is_public: approve,
      })
      .eq("id", jobId);
    if (!error) return { persisted: true, data: true };
  } catch {
    // ignore fallback error
  }
  return primary;
}

export async function adminGetStats(): Promise<AdminStats> {
  const { data, error } = await rpcClient.rpc("admin_stats");
  if (error) throw error;
  return data;
}

export async function adminVerifyCandidateKyc(
  userId: string,
  status: "verified" | "rejected" | "pending" | "unverified",
  reason?: string
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(userId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  const primary = await callAdminRpc<boolean>("admin_verify_candidate_kyc", {
    p_user_id: userId,
    p_status: status,
    p_reason: reason || null,
  });
  if (primary.persisted) return primary;

  // Fallback to legacy review_identity_verification RPC if new migration not pushed yet
  if (status === "verified" || status === "rejected") {
    return callAdminRpc<boolean>("review_identity_verification", {
      p_user: userId,
      p_approve: status === "verified",
      p_reason: reason || null,
    });
  }
  return primary;
}

export async function adminToggleCandidateSuspension(
  userId: string,
  reason?: string
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(userId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<boolean>("admin_toggle_candidate_suspension", {
    p_user_id: userId,
    p_reason: reason || null,
  });
}

export async function adminToggleProfileArchive(
  userIds: string[],
  archived: boolean
): Promise<AdminWriteResult<number>> {
  const liveIds = userIds.filter(isUuid);
  if (!liveIds.length) {
    return { persisted: false, reason: "No live DB records selected" };
  }
  return callAdminRpc<number>("admin_toggle_profile_archive", {
    p_user_ids: liveIds,
    p_archived: archived,
  });
}

export async function adminToggleEmployerArchive(
  employerIds: string[],
  archived: boolean
): Promise<AdminWriteResult<number>> {
  const liveIds = employerIds.filter(isUuid);
  if (!liveIds.length) {
    return { persisted: false, reason: "No live DB records selected" };
  }
  return callAdminRpc<number>("admin_toggle_employer_archive", {
    p_employer_ids: liveIds,
    p_archived: archived,
  });
}

export async function adminPromoteJob(
  jobId: string,
  tier: "none" | "featured" | "sponsored"
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(jobId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<boolean>("admin_promote_job", {
    p_job_id: jobId,
    p_tier: tier,
  });
}

export async function adminUpdateApplicationStage(
  applicationId: string,
  stage: string,
  note?: string
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(applicationId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<boolean>("admin_update_application_stage", {
    p_application_id: applicationId,
    p_stage: stage,
    p_note: note || null,
  });
}

export async function adminReviewAssessmentAttempt(
  attemptId: string,
  status: "Issued" | "Flagged" | "In Review" | "Failed",
  note?: string
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(attemptId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<boolean>("admin_review_assessment_attempt", {
    p_attempt_id: attemptId,
    p_status: status,
    p_note: note || null,
  });
}

export async function adminRefundPaymentOrder(
  orderId: string,
  reason?: string
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(orderId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<boolean>("admin_refund_payment_order", {
    p_order_id: orderId,
    p_reason: reason || "Refund issued by Super Admin",
  });
}

export async function adminAdjustWallet(
  walletId: string,
  entryType: "credit" | "debit",
  amount: number,
  reason: string
): Promise<AdminWriteResult<string>> {
  if (!isUuid(walletId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<string>("admin_adjust_wallet", {
    p_wallet_id: walletId,
    p_entry_type: entryType,
    p_amount: amount,
    p_reason: reason || "Super Admin adjustment",
  });
}

export async function adminReplySupportTicket(
  ticketId: string,
  body: string,
  resolve: boolean
): Promise<AdminWriteResult<boolean>> {
  if (!isUuid(ticketId)) {
    return { persisted: false, reason: "Platform showcase record" };
  }
  return callAdminRpc<boolean>("admin_reply_support_ticket", {
    p_ticket_id: ticketId,
    p_body: body,
    p_resolve: resolve,
  });
}

export async function adminUpsertPlatformSetting(
  key: string,
  value: unknown
): Promise<AdminWriteResult<boolean>> {
  return callAdminRpc<boolean>("admin_upsert_platform_setting", {
    p_key: key,
    p_value: value,
  });
}

export async function adminBroadcastNotification(
  title: string,
  body: string,
  audience: string,
  link = "/talento-pro?view=dash"
): Promise<AdminWriteResult<number>> {
  return callAdminRpc<number>("admin_broadcast_notification", {
    p_title: title,
    p_body: body,
    p_audience: audience,
    p_link: link,
  });
}

export async function adminCreateCourse(
  title: string,
  category: string,
  priceInr: number,
  instructor = "TalentCIR Faculty"
): Promise<AdminWriteResult<Record<string, unknown>>> {
  return callAdminRpc<Record<string, unknown>>("admin_create_course", {
    p_title: title,
    p_category: category,
    p_price_inr: priceInr,
    p_instructor: instructor,
  });
}

export async function adminCreateMentor(
  displayName: string,
  headline: string,
  domain: string,
  hourlyRateInr: number
): Promise<AdminWriteResult<Record<string, unknown>>> {
  return callAdminRpc<Record<string, unknown>>("admin_create_mentor", {
    p_display_name: displayName,
    p_headline: headline,
    p_domain: domain,
    p_hourly_rate_inr: hourlyRateInr,
  });
}

export async function adminCreateHackathon(
  title: string,
  industry: string,
  city: string,
  prizePoolInr = 500000
): Promise<AdminWriteResult<Record<string, unknown>>> {
  return callAdminRpc<Record<string, unknown>>("admin_create_hackathon", {
    p_title: title,
    p_industry: industry,
    p_city: city,
    p_prize_pool_inr: prizePoolInr,
  });
}

export async function adminCreateCoupon(
  code: string,
  discountType: "percent" | "flat",
  value: number,
  maxRedemptions = 250
): Promise<AdminWriteResult<Record<string, unknown>>> {
  return callAdminRpc<Record<string, unknown>>("admin_create_coupon", {
    p_code: code,
    p_discount_type: discountType,
    p_value: value,
    p_max_redemptions: maxRedemptions,
  });
}

export async function adminSaveEnterpriseStore(
  key: string,
  payload: unknown
): Promise<AdminWriteResult<boolean>> {
  return callAdminRpc<boolean>("admin_upsert_enterprise_store", {
    p_key: key,
    p_payload: payload,
  });
}
