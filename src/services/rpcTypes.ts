/**
 * Strongly typed parameter and return interfaces for Postgres RPCs.
 * Used by src/services/db.ts to guarantee contract compliance.
 */

export interface RpcMap {
  // Auth & Roles (Stage 1 & 2)
  is_admin: {
    args: Record<string, never>;
    returns: boolean;
  };
  get_my_role: {
    args: Record<string, never>;
    returns: "employer" | "employee" | null;
  };
  is_email_verified: {
    args: Record<string, never>;
    returns: boolean;
  };
  require_verified_email: {
    args: Record<string, never>;
    returns: void;
  };
  mark_email_verified: {
    args: Record<string, never>;
    returns: boolean;
  };
  require_aal2: {
    args: Record<string, never>;
    returns: void;
  };
  record_consent: {
    args: { p_kind: string; p_version: string; p_ip_hash?: string | null; p_ua_hash?: string | null };
    returns: void;
  };
  record_login_event: {
    args: { p_device_hash: string; p_ip_hash?: string | null; p_ua?: string | null };
    returns: string;
  };
  complete_signup: {
    args: { p_role: string; p_full_name: string; p_company_name?: string | null; p_phone?: string | null };
    returns: { success: boolean; user_id: string; role: string };
  };
  get_my_context: {
    args: Record<string, never>;
    returns: Record<string, unknown>;
  };
  request_account_deletion: {
    args: Record<string, never>;
    returns: { success: boolean; deletion_requested_at: string };
  };
  cancel_account_deletion: {
    args: Record<string, never>;
    returns: { success: boolean; deletion_cancelled: boolean };
  };
  export_my_data: {
    args: Record<string, never>;
    returns: Record<string, unknown>;
  };

  // Tenancy & Permissions (Stage 2)
  has_tenant_permission: {
    args: { _tenant: string; _perm: string };
    returns: boolean;
  };
  invite_team_member: {
    args: { p_tenant: string; p_email: string; p_role: string };
    returns: { invite_id: string; token: string; expires_at: string };
  };
  revoke_invite: {
    args: { p_invite_id: string };
    returns: boolean;
  };
  accept_invite: {
    args: { p_token: string };
    returns: { success: boolean; tenant_id: string; role: string };
  };
  change_member_role: {
    args: { p_tenant: string; p_user: string; p_role: string };
    returns: boolean;
  };
  remove_member: {
    args: { p_tenant: string; p_user: string };
    returns: boolean;
  };
  leave_tenant: {
    args: { p_tenant: string };
    returns: boolean;
  };
  transfer_ownership: {
    args: { p_tenant: string; p_new_owner: string };
    returns: boolean;
  };
  submit_employer_verification: {
    args: { p_docs: Record<string, unknown>; p_gstin?: string | null; p_cin?: string | null; p_pan?: string | null };
    returns: Record<string, unknown>;
  };
  employer_can: {
    args: { _tenant: string; _action: string };
    returns: boolean;
  };
  log_audit: {
    args: { p_tenant: string; p_action: string; p_entity: string; p_entity_id?: string | null; p_meta?: Record<string, unknown>; p_ip_hash?: string | null };
    returns: number;
  };
  list_audit_log: {
    args: { p_tenant?: string | null; p_limit?: number; p_cursor?: number | null };
    returns: Array<Record<string, unknown>>;
  };
  admin_list_employers: {
    args: { p_status?: string | null; p_search?: string | null; p_limit?: number };
    returns: Array<Record<string, unknown>>;
  };
  admin_review_employer: {
    args: { p_employer_id: string; p_status: string; p_reason?: string | null };
    returns: boolean;
  };
  admin_suspend_user: {
    args: { p_user_id: string; p_reason: string };
    returns: boolean;
  };
  admin_list_jobs_pending: {
    args: { p_limit?: number };
    returns: Array<Record<string, unknown>>;
  };
  admin_moderate_job: {
    args: { p_job_id: string; p_approve: boolean; p_reason?: string | null };
    returns: boolean;
  };
  admin_stats: {
    args: Record<string, never>;
    returns: Record<string, unknown>;
  };

  // Assessment & Proctoring
  start_journey: {
    args: { p_domain_assessment_id: string };
    returns: { id: string; user_id: string; status: string };
  };
  start_assessment_attempt: {
    args: { p_journey: string; p_assessment: string };
    returns: { id: string; journey_id: string; status: string; server_expires_at: string };
  };
  submit_assessment_attempt: {
    args: { p_attempt: string };
    returns: { id: string; status: string; score: number };
  };
  get_proctoring_dossier: {
    args: { p_attempt: string };
    returns: Record<string, unknown>;
  };

  // Cron / Maintenance
  expire_overdue_attempts: {
    args: Record<string, never>;
    returns: number;
  };
  cancel_stale_orders: {
    args: Record<string, never>;
    returns: number;
  };
}
