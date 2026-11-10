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
