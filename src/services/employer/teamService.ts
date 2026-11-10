import { supabase } from "@/integrations/supabase/client";

export interface TeamInviteResult {
  invite_id: string;
  token: string;
  expires_at: string;
}

export interface AuditLogEntry {
  id: number;
  at: string;
  actor_id: string;
  tenant_id: string;
  action: string;
  entity: string;
  entity_id: string;
  meta: Record<string, any>;
}

export async function inviteTeamMember(
  tenantId: string,
  email: string,
  role: "admin" | "recruiter" | "hiring_manager" | "interviewer" | "viewer"
): Promise<TeamInviteResult> {
  const { data, error } = await (supabase as any).rpc("invite_team_member", {
    p_tenant: tenantId,
    p_email: email,
    p_role: role,
  });
  if (error) throw error;
  return data;
}

export async function revokeInvite(inviteId: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("revoke_invite", {
    p_invite_id: inviteId,
  });
  if (error) throw error;
  return data;
}

export async function acceptInvite(token: string): Promise<{ success: boolean; tenant_id: string; role: string }> {
  const { data, error } = await (supabase as any).rpc("accept_invite", {
    p_token: token,
  });
  if (error) throw error;
  return data;
}

export async function changeMemberRole(
  tenantId: string,
  userId: string,
  role: "admin" | "recruiter" | "hiring_manager" | "interviewer" | "viewer"
): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("change_member_role", {
    p_tenant: tenantId,
    p_user: userId,
    p_role: role,
  });
  if (error) throw error;
  return data;
}

export async function removeMember(tenantId: string, userId: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("remove_member", {
    p_tenant: tenantId,
    p_user: userId,
  });
  if (error) throw error;
  return data;
}

export async function leaveTenant(tenantId: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("leave_tenant", {
    p_tenant: tenantId,
  });
  if (error) throw error;
  return data;
}

export async function transferOwnership(tenantId: string, newOwnerUserId: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("transfer_ownership", {
    p_tenant: tenantId,
    p_new_owner: newOwnerUserId,
  });
  if (error) throw error;
  return data;
}

export async function submitEmployerVerification(
  docs: Record<string, any>,
  gstin?: string,
  cin?: string,
  pan?: string
): Promise<any> {
  const { data, error } = await (supabase as any).rpc("submit_employer_verification", {
    p_docs: docs,
    p_gstin: gstin || null,
    p_cin: cin || null,
    p_pan: pan || null,
  });
  if (error) throw error;
  return data;
}

export async function listAuditLog(
  tenantId?: string,
  limit = 50,
  cursor?: number
): Promise<AuditLogEntry[]> {
  const { data, error } = await (supabase as any).rpc("list_audit_log", {
    p_tenant: tenantId || null,
    p_limit: limit,
    p_cursor: cursor || null,
  });
  if (error) throw error;
  return data || [];
}
