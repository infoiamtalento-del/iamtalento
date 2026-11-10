// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const CANDIDATE_USER = uuid(201);
const EMPLOYER_OWNER = uuid(202);
const EMPLOYER_MEMBER = uuid(203);
const OTHER_EMPLOYER = uuid(204);
const PLATFORM_ADMIN = uuid(205);
const INVITED_CANDIDATE = uuid(206);

let db: Db;
let tenantId: string;
let otherTenantId: string;
let employerOpeningId: string;

beforeAll(async () => {
  db = await createDb();

  // Create candidate (employee)
  await db.signUp(CANDIDATE_USER, "candidate@test.dev", { full_name: "Candidate Test", role: "employee" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [CANDIDATE_USER]);

  // Create employer owner (email signup triggers handle_new_user and tenant bootstrap)
  await db.signUp(EMPLOYER_OWNER, "owner@acme.dev", { full_name: "Acme Owner", role: "employer", company_name: "Acme Tech" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMPLOYER_OWNER]);

  // Create secondary user to be invited to Acme Tech (has no employee role)
  await db.signUp(EMPLOYER_MEMBER, "member@acme.dev", { full_name: "Acme Recruiter" });
  await db.admin();
  await db.q(`delete from public.user_roles where user_id = $1`, [EMPLOYER_MEMBER]);
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMPLOYER_MEMBER]);

  // Create other employer to test isolation
  await db.signUp(OTHER_EMPLOYER, "boss@globex.dev", { full_name: "Globex Boss", role: "employer", company_name: "Globex Corp" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [OTHER_EMPLOYER]);

  // Create platform admin
  await db.signUp(PLATFORM_ADMIN, "admin@platform.dev", { full_name: "Platform Master" });
  await db.admin();
  await db.q(`insert into public.platform_admins (user_id) values ($1)`, [PLATFORM_ADMIN]);

  // Create candidate with employee role to test invite rejection on role clash
  await db.signUp(INVITED_CANDIDATE, "clash@test.dev", { full_name: "Clash User", role: "employee" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [INVITED_CANDIDATE]);

  // Retrieve bootstrapped tenant IDs
  const [emp] = await db.q(`select tenant_id from public.employers where user_id = $1`, [EMPLOYER_OWNER]);
  tenantId = emp.tenant_id;

  const [otherEmp] = await db.q(`select tenant_id from public.employers where user_id = $1`, [OTHER_EMPLOYER]);
  otherTenantId = otherEmp.tenant_id;

  // Insert a job for EMPLOYER_OWNER via admin
  await db.admin();
  const [job] = await db.q(`
    insert into public.employer_job_openings (user_id, tenant_id, designation, salary_min, salary_max, status, is_public, work_mode, job_location)
    values ($1, $2, 'Lead Systems Engineer', 1500000, 2500000, 'active', true, 'Remote', 'Remote')
    returning id
  `, [EMPLOYER_OWNER, tenantId]);
  employerOpeningId = job.id;
}, 120_000);

describe("Hotfix D2: employer_job_openings RLS & Write Protection", () => {
  it("prevents employee from inserting into employer_job_openings", async () => {
    await db.user(CANDIDATE_USER);
    const err = await db.fails(`
      insert into public.employer_job_openings (user_id, designation, status)
      values ($1, 'Unauthorized Job', 'active')
    `, [CANDIDATE_USER]);
    expect(err).toMatch(/Direct client writes|violates row-level security policy/i);
  });

  it("prevents employee from updating or flipping status on employer jobs", async () => {
    await db.user(CANDIDATE_USER);
    const err = await db.fails(`
      update public.employer_job_openings set status = 'closed' where id = $1
    `, [employerOpeningId]);
    expect(err).toMatch(/Direct client writes|violates row-level security policy/i);
    const [j] = await db.q(`select status from public.employer_job_openings where id = $1`, [employerOpeningId]);
    expect(j.status).toBe("active");
  });

  it("prevents employee from deleting employer jobs", async () => {
    await db.user(CANDIDATE_USER);
    const err = await db.fails(`delete from public.employer_job_openings where id = $1`, [employerOpeningId]);
    expect(err).toMatch(/Direct client writes|violates row-level security policy/i);
    const [j] = await db.q(`select count(*)::int n from public.employer_job_openings where id = $1`, [employerOpeningId]);
    expect(j.n).toBe(1);
  });

  it("prevents employer from updating another employer's job", async () => {
    await db.user(OTHER_EMPLOYER);
    const err = await db.fails(`update public.employer_job_openings set status = 'closed' where id = $1`, [employerOpeningId]);
    expect(err).toMatch(/Direct client writes|violates row-level security policy/i);
    const [j] = await db.q(`select status from public.employer_job_openings where id = $1`, [employerOpeningId]);
    expect(j.status).toBe("active");
  });

  it("allows the owner employer to update their job via update_job RPC (direct writes blocked by D2)", async () => {
    await db.user(EMPLOYER_OWNER);
    const directErr = await db.fails(`update public.employer_job_openings set designation = 'Principal Engineer' where id = $1`, [employerOpeningId]);
    expect(directErr).toMatch(/Direct client writes|violates row-level security policy/i);

    // Update via authorized update_job RPC
    await db.q(`select public.update_job($1, $2::jsonb)`, [employerOpeningId, JSON.stringify({ designation: 'Principal Engineer' })]);
    const [j] = await db.q(`select designation from public.employer_job_openings where id = $1`, [employerOpeningId]);
    expect(j.designation).toBe("Principal Engineer");
  });

  it("blocks suspended employer from modifying job openings", async () => {
    await db.admin();
    await db.q(`update public.employers set verification_status = 'suspended' where user_id = $1`, [EMPLOYER_OWNER]);

    await db.user(EMPLOYER_OWNER);
    const err = await db.fails(`
      select public.update_job($1, $2::jsonb)
    `, [employerOpeningId, JSON.stringify({ designation: 'Hacked' })]);
    expect(err).toMatch(/Tenant account is suspended|Suspended employer|Unauthorized/i);

    // Restore to verified
    await db.admin();
    await db.q(`update public.employers set verification_status = 'verified' where user_id = $1`, [EMPLOYER_OWNER]);
  });
});

describe("Tenant Bootstrap & Context Integration", () => {
  it("bootstraps tenant organization and sets owner membership on employer creation", async () => {
    expect(tenantId).toBeTruthy();
    expect(otherTenantId).toBeTruthy();
    expect(tenantId).not.toBe(otherTenantId);

    const [t] = await db.q(`select name, slug, owner_user_id, plan from public.tenant_organizations where id = $1`, [tenantId]);
    expect(t.name).toBe("Acme Tech");
    expect(t.slug).toMatch(/^acme-tech/);
    expect(t.owner_user_id).toBe(EMPLOYER_OWNER);
    expect(t.plan).toBe("free");

    const [m] = await db.q(`select role from public.tenant_memberships where tenant_id = $1 and user_id = $2`, [tenantId, EMPLOYER_OWNER]);
    expect(m.role).toBe("owner");
  });

  it("get_my_context returns tenant object with roles and permissions for employer", async () => {
    await db.user(EMPLOYER_OWNER);
    const [res] = await db.q<{ get_my_context: any }>(`select public.get_my_context()`);
    const ctx = res.get_my_context;

    expect(ctx.authenticated).toBe(true);
    expect(ctx.role).toBe("employer");
    expect(ctx.tenant).toMatchObject({
      id: tenantId,
      name: "Acme Tech",
      role: "owner",
    });
    expect(Array.isArray(ctx.tenant.permissions)).toBe(true);
    expect(ctx.tenant.permissions).toContain("job.create");
    expect(ctx.tenant.permissions).toContain("billing.manage");
    expect(ctx.tenant.permissions).toContain("team.manage");
  });
});

describe("Permission Matrix (has_tenant_permission)", () => {
  it("evaluates owner role with full permissions", async () => {
    await db.user(EMPLOYER_OWNER);
    const [p1] = await db.q(`select public.has_tenant_permission($1, 'job.publish') as allowed`, [tenantId]);
    expect(p1.allowed).toBe(true);

    const [p2] = await db.q(`select public.has_tenant_permission($1, 'billing.manage') as allowed`, [tenantId]);
    expect(p2.allowed).toBe(true);

    const [p3] = await db.q(`select public.has_tenant_permission($1, 'team.manage') as allowed`, [tenantId]);
    expect(p3.allowed).toBe(true);
  });

  it("denies access to a tenant user has no membership in", async () => {
    await db.user(EMPLOYER_OWNER);
    const [p] = await db.q(`select public.has_tenant_permission($1, 'job.publish') as allowed`, [otherTenantId]);
    expect(p.allowed).toBe(false);
  });

  it("allows platform admin to bypass tenant permissions", async () => {
    await db.user(PLATFORM_ADMIN);
    const [p] = await db.q(`select public.has_tenant_permission($1, 'billing.manage') as allowed`, [tenantId]);
    expect(p.allowed).toBe(true);
  });
});

describe("Team Management & Invites Lifecycle", () => {
  let inviteToken: string;
  let inviteId: string;

  it("allows tenant admin to invite team member and logs audit event", async () => {
    await db.user(EMPLOYER_OWNER);
    const [inv] = await db.q<{ invite_team_member: any }>(
      `select public.invite_team_member($1, 'member@acme.dev', 'recruiter')`,
      [tenantId]
    );
    expect(inv.invite_team_member.invite_id).toBeTruthy();
    expect(inv.invite_team_member.token).toBeTruthy();
    inviteId = inv.invite_team_member.invite_id;
    inviteToken = inv.invite_team_member.token;

    // Verify audit log
    const [audit] = await db.q(
      `select action, entity from public.audit_log where tenant_id = $1 and action = 'invite_team_member'`,
      [tenantId]
    );
    expect(audit.action).toBe("invite_team_member");
  });

  it("requires AAL2 to invite admin role", async () => {
    await db.user(EMPLOYER_OWNER, { aal: "aal1" });
    const err = await db.fails(
      `select public.invite_team_member($1, 'admin_new@acme.dev', 'admin')`,
      [tenantId]
    );
    expect(err).toMatch(/Multi-factor authentication \(AAL2\) required/);

    // With AAL2 it succeeds
    await db.user(EMPLOYER_OWNER, { aal: "aal2" });
    const [inv] = await db.q(
      `select public.invite_team_member($1, 'admin_new@acme.dev', 'admin')`,
      [tenantId]
    );
    expect(inv).toBeTruthy();
  });

  it("prevents candidate with employee role from accepting employer team invite", async () => {
    // Issue invite to clash user
    await db.user(EMPLOYER_OWNER);
    const [inv] = await db.q<{ invite_team_member: any }>(
      `select public.invite_team_member($1, 'clash@test.dev', 'viewer')`,
      [tenantId]
    );

    await db.user(INVITED_CANDIDATE);
    const err = await db.fails(`select public.accept_invite($1)`, [inv.invite_team_member.token]);
    expect(err).toMatch(/already has an employee role/);
  });

  it("allows invited member to accept invite and gain role permissions", async () => {
    await db.user(EMPLOYER_MEMBER);
    const [res] = await db.q<{ accept_invite: any }>(`select public.accept_invite($1)`, [inviteToken]);
    expect(res.accept_invite.success).toBe(true);
    expect(res.accept_invite.role).toBe("recruiter");

    // Check recruiter permissions
    const [p] = await db.q(`select public.has_tenant_permission($1, 'job.create') as allowed`, [tenantId]);
    expect(p.allowed).toBe(true);

    // Recruiter cannot manage team
    const [p2] = await db.q(`select public.has_tenant_permission($1, 'team.manage') as allowed`, [tenantId]);
    expect(p2.allowed).toBe(false);
  });

  it("prevents re-accepting an already accepted invite", async () => {
    await db.user(EMPLOYER_MEMBER);
    const err = await db.fails(`select public.accept_invite($1)`, [inviteToken]);
    expect(err).toMatch(/Invite is invalid, expired, or revoked/);
  });

  it("protects last owner from being removed or demoted", async () => {
    await db.user(EMPLOYER_OWNER, { aal: "aal2" });
    const demoteErr = await db.fails(`select public.change_member_role($1, $2, 'admin')`, [tenantId, EMPLOYER_OWNER]);
    expect(demoteErr).toMatch(/Cannot demote the last owner/);

    const removeErr = await db.fails(`select public.remove_member($1, $2)`, [tenantId, EMPLOYER_OWNER]);
    expect(removeErr).toMatch(/Cannot remove the last owner/);

    const leaveErr = await db.fails(`select public.leave_tenant($1)`, [tenantId]);
    expect(leaveErr).toMatch(/Cannot leave as the last owner/);
  });

  it("allows transferring ownership with AAL2", async () => {
    await db.user(EMPLOYER_OWNER, { aal: "aal1" });
    const aalErr = await db.fails(`select public.transfer_ownership($1, $2)`, [tenantId, EMPLOYER_MEMBER]);
    expect(aalErr).toMatch(/Multi-factor authentication \(AAL2\) required/);

    await db.user(EMPLOYER_OWNER, { aal: "aal2" });
    const [res] = await db.q(`select public.transfer_ownership($1, $2)`, [tenantId, EMPLOYER_MEMBER]);
    expect(res).toBeTruthy();

    // EMPLOYER_MEMBER is now owner
    const [m] = await db.q(`select role from public.tenant_memberships where tenant_id = $1 and user_id = $2`, [tenantId, EMPLOYER_MEMBER]);
    expect(m.role).toBe("owner");

    // EMPLOYER_OWNER is now admin
    const [mOld] = await db.q(`select role from public.tenant_memberships where tenant_id = $1 and user_id = $2`, [tenantId, EMPLOYER_OWNER]);
    expect(mOld.role).toBe("admin");

    // Revert ownership back to EMPLOYER_OWNER
    await db.user(EMPLOYER_MEMBER, { aal: "aal2" });
    await db.q(`select public.transfer_ownership($1, $2)`, [tenantId, EMPLOYER_OWNER]);
  });
});

describe("Employer Verification & Status Matrix", () => {
  it("validates GSTIN / PAN / CIN formats on submit_employer_verification", async () => {
    await db.user(EMPLOYER_OWNER);
    const badGstin = await db.fails(
      `select public.submit_employer_verification('{}'::jsonb, 'INVALID_GSTIN')`
    );
    expect(badGstin).toMatch(/Invalid GSTIN format/);

    const badPan = await db.fails(
      `select public.submit_employer_verification('{}'::jsonb, null, null, 'INVALID_PAN')`
    );
    expect(badPan).toMatch(/Invalid PAN format/);
  });

  it("submits verification documents and updates status to pending", async () => {
    await db.user(EMPLOYER_OWNER);
    const validGstin = "29ABCDE1234F1Z5";
    const validPan = "ABCDE1234F";

    const [res] = await db.q(
      `select * from public.submit_employer_verification('{"gst_cert":"tenant/gst.pdf"}'::jsonb, $1, null, $2)`,
      [validGstin, validPan]
    );
    expect(res.verification_status).toBe("pending");
    expect(res.gst_number).toBe(validGstin);
    expect(res.pan_number).toBe(validPan);
  });

  it("employer_can evaluates allowed actions by verification status", async () => {
    // In pending status: can search, but cannot freely publish multiple active jobs
    const [canSearch] = await db.q(`select public.employer_can($1, 'search') as ok`, [tenantId]);
    expect(canSearch.ok).toBe(true);

    // Verify through admin
    await db.user(PLATFORM_ADMIN, { aal: "aal2" });
    const [emp] = await db.q(`select id from public.employers where user_id = $1`, [EMPLOYER_OWNER]);
    await db.q(`select public.admin_review_employer($1, 'verified', 'Approved documents')`, [emp.id]);

    // Now verified: can publish
    const [canPublish] = await db.q(`select public.employer_can($1, 'publish') as ok`, [tenantId]);
    expect(canPublish.ok).toBe(true);

    // If suspended: cannot do anything
    await db.q(`select public.admin_review_employer($1, 'suspended', 'Terms violation')`, [emp.id]);
    const [canPublishSuspended] = await db.q(`select public.employer_can($1, 'publish') as ok`, [tenantId]);
    expect(canPublishSuspended.ok).toBe(false);

    // Restore
    await db.q(`select public.admin_review_employer($1, 'verified')`, [emp.id]);
  });
});

describe("Audit Log Immutability", () => {
  it("prevents updates or deletes on audit_log", async () => {
    const [a] = await db.q(`select id from public.audit_log limit 1`);
    expect(a).toBeTruthy();

    await db.admin();
    const updateErr = await db.fails(`update public.audit_log set action = 'TAMPERED' where id = $1`, [a.id]);
    expect(updateErr).toMatch(/audit_log is append-only/);

    const deleteErr = await db.fails(`delete from public.audit_log where id = $1`, [a.id]);
    expect(deleteErr).toMatch(/audit_log is append-only/);
  });

  it("lists audit logs for tenant admin", async () => {
    await db.user(EMPLOYER_OWNER);
    const logs = await db.q(`select * from public.list_audit_log($1)`, [tenantId]);
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThan(0);
  });
});

describe("Platform Admin RPCs (AAL2 + is_admin)", () => {
  it("denies access to non-admin users", async () => {
    await db.user(EMPLOYER_OWNER);
    const err = await db.fails(`select * from public.admin_list_employers()`);
    expect(err).toMatch(/Unauthorized: Admin required/);
  });

  it("denies access to admin without AAL2", async () => {
    await db.user(PLATFORM_ADMIN, { aal: "aal1" });
    const err = await db.fails(`select * from public.admin_list_employers()`);
    expect(err).toMatch(/Multi-factor authentication \(AAL2\) required/);
  });

  it("allows admin with AAL2 to list employers and retrieve stats", async () => {
    await db.user(PLATFORM_ADMIN, { aal: "aal2" });
    const employers = await db.q(`select * from public.admin_list_employers()`);
    expect(Array.isArray(employers)).toBe(true);
    expect(employers.length).toBeGreaterThan(0);

    const [stats] = await db.q<{ admin_stats: any }>(`select public.admin_stats()`);
    expect(Number(stats.admin_stats.total_employers)).toBeGreaterThan(0);
    expect(Number(stats.admin_stats.total_candidates)).toBeGreaterThan(0);
  });
});
