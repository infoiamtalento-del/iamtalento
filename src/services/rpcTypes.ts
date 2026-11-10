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
