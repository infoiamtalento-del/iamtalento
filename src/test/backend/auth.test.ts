// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const UNVERIFIED_USER = uuid(101);
const VERIFIED_USER = uuid(102);
const OAUTH_USER = uuid(103);
const EMPLOYER_USER = uuid(104);
const ADMIN_USER = uuid(105);

let db: Db;
let coreAssessmentId: string;
let journeyId: string;
let publishedJobId: string;

beforeAll(async () => {
  db = await createDb();

  // Create unverified user (no email_verified_at)
  await db.signUp(UNVERIFIED_USER, "unverified@test.dev", { full_name: "Unverified Candidate", role: "employee" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = null where id = $1`, [UNVERIFIED_USER]);

  // Create verified user
  await db.signUp(VERIFIED_USER, "verified@test.dev", { full_name: "Verified Candidate", role: "employee" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [VERIFIED_USER]);

  // Create OAuth user (starts with employee role regardless of metadata)
  await db.signUp(OAUTH_USER, "oauth@test.dev", { full_name: "OAuth User", role: "employer" });
  await db.admin();
  // Simulate OAuth provider metadata
  await db.q(
    `update auth.users set raw_app_meta_data = '{"provider":"google","providers":["google"]}'::jsonb where id = $1`,
    [OAUTH_USER]
  );
  // Re-trigger handle_new_user behavior
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [OAUTH_USER]);

  // Create employer user
  await db.signUp(EMPLOYER_USER, "employer@test.dev", { full_name: "Employer Boss", role: "employer", company_name: "Acme Corp" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMPLOYER_USER]);

  // Create platform admin
  await db.signUp(ADMIN_USER, "admin@test.dev", { full_name: "Platform Admin" });
  await db.admin();
  await db.q(`insert into public.platform_admins (user_id) values ($1)`, [ADMIN_USER]);

  // Seed sample core assessment and journey for testing assessment attempt guard
  const domain = (await db.q(`select id from public.assessments_catalog where kind = 'domain' and is_active limit 1`))[0];
  await db.q(`update public.assessments_catalog set price_inr = 0 where id = $1`, [domain.id]);
  coreAssessmentId = (await db.q(`select id from public.assessments_catalog where kind = 'core' and core_position = 1`))[0].id;
  await db.q(`update public.assessments_catalog set question_count = 10 where id = $1`, [coreAssessmentId]);

  await db.user(UNVERIFIED_USER);
  const [jRow] = await db.q(`select * from public.start_journey($1)`, [domain.id]);
  journeyId = jRow.id;

  // Seed published job for apply_to_job guard test
  await db.admin();
  const [j] = await db.q(`
    insert into public.employer_job_openings (user_id, designation, salary_min, salary_max, skills, status, is_public)
    values ($1, 'Software Engineer', 1200000, 1800000, array['TypeScript', 'PostgreSQL'], 'active', true)
    returning id
  `, [EMPLOYER_USER]);
  publishedJobId = j.id;
}, 120_000);

describe("Email Verification Enforcement (require_verified_email)", () => {
  it("blocks unverified users from apply_to_job with error P0403", async () => {
    await db.user(UNVERIFIED_USER);
    const err = await db.fails(`select * from public.apply_to_job($1, 'Cover note')`, [publishedJobId]);
    expect(err).toMatch(/Please verify your email to continue/);
  });

  it("blocks unverified users from create_payment_order with error P0403", async () => {
    await db.user(UNVERIFIED_USER);
    const err = await db.fails(
      `select * from public.create_payment_order('wallet_topup', null, null, null, null, null, 'razorpay', 100)`
    );
    expect(err).toMatch(/Please verify your email to continue/);
  });

  it("blocks unverified users from start_assessment_attempt with error P0403", async () => {
    await db.user(UNVERIFIED_USER);
    const err = await db.fails(`select * from public.start_assessment_attempt($1, $2)`, [journeyId, coreAssessmentId]);
    expect(err).toMatch(/Please verify your email to continue/);
  });

  it("allows verified users to perform guarded actions", async () => {
    await db.user(VERIFIED_USER);
    const [order] = await db.q<{ status: string; total_amount: number }>(
      `select status, total_amount from public.create_payment_order('wallet_topup', null, null, null, null, null, 'razorpay', 100)`
    );
    expect(order.status).toBe("created");
    expect(Number(order.total_amount)).toBeGreaterThan(0);
  });
});

describe("Legacy & AMR Verification (mark_email_verified)", () => {
  it("rejects mark_email_verified when AMR contains no valid otp/email method", async () => {
    await db.user(UNVERIFIED_USER, { amr: [{ method: "password", timestamp: 1700000000 }] });
    const err = await db.fails(`select public.mark_email_verified()`);
    expect(err).toMatch(/Email verification requires a recent OTP or email verification token/);
  });

  it("succeeds mark_email_verified when AMR contains fresh otp method", async () => {
    const nowEpoch = Math.floor(Date.now() / 1000);
    await db.user(UNVERIFIED_USER, { amr: [{ method: "otp", timestamp: nowEpoch - 30 }] });
    const [res] = await db.q<{ mark_email_verified: boolean }>(`select public.mark_email_verified()`);
    expect(res.mark_email_verified).toBe(true);

    const [p] = await db.q(`select email_verified_at is not null as verified from public.profiles where id = $1`, [UNVERIFIED_USER]);
    expect(p.verified).toBe(true);
  });
});

describe("OAuth Sign-Up & complete_signup RPC", () => {
  it("complete_signup is idempotent and assigns employer role exclusively", async () => {
    await db.user(OAUTH_USER);
    const [res] = await db.q<{ complete_signup: { success: boolean; role: string } }>(
      `select public.complete_signup('employer', 'OAuth Verified User', 'Talent Innovations Pvt Ltd', '+91 9123456789')`
    );
    expect(res.complete_signup.success).toBe(true);
    expect(res.complete_signup.role).toBe("employer");

    // Verify role exclusivity
    const roles = await db.q(`select role from public.user_roles where user_id = $1`, [OAUTH_USER]);
    expect(roles).toHaveLength(1);
    expect(roles[0].role).toBe("employer");

    // Idempotent retry succeeds
    const [retry] = await db.q<{ complete_signup: { success: boolean; role: string } }>(
      `select public.complete_signup('employer', 'OAuth Verified User', 'Talent Innovations Pvt Ltd', '+91 9123456789')`
    );
    expect(retry.complete_signup.success).toBe(true);
  });

  it("validates input lengths for complete_signup", async () => {
    await db.user(OAUTH_USER);
    const shortNameErr = await db.fails(`select public.complete_signup('employer', 'A', 'Company')`);
    expect(shortNameErr).toMatch(/Full name must be between 2 and 100 characters/);

    const missingCompanyErr = await db.fails(`select public.complete_signup('employer', 'Valid Name', '')`);
    expect(missingCompanyErr).toMatch(/Company name is required for employers/);
  });
});

describe("Security Boundaries & Client Escalation Prevention", () => {
  it("prevents clients from inserting directly into user_roles", async () => {
    await db.user(VERIFIED_USER);
    const err = await db.fails(`insert into public.user_roles (user_id, role) values ($1, 'employer')`, [VERIFIED_USER]);
    expect(err).toBeTruthy();
  });

  it("prevents clients from inserting into platform_admins", async () => {
    await db.user(VERIFIED_USER);
    const err = await db.fails(`insert into public.platform_admins (user_id) values ($1)`, [VERIFIED_USER]);
    expect(err).toBeTruthy();
  });
});

describe("Context & Session Retrieval (get_my_context)", () => {
  it("returns structured profile, role, verification and flags for employee", async () => {
    await db.user(VERIFIED_USER);
    const [ctxRow] = await db.q<{ get_my_context: any }>(`select public.get_my_context()`);
    const ctx = ctxRow.get_my_context;
    expect(ctx.authenticated).toBe(true);
    expect(ctx.user_id).toBe(VERIFIED_USER);
    expect(ctx.role).toBe("employee");
    expect(ctx.email_verified).toBe(true);
    expect(ctx.is_admin).toBe(false);
    expect(ctx.employer).toBeNull();
  });

  it("returns employer company details for employer account", async () => {
    await db.user(EMPLOYER_USER);
    const [ctxRow] = await db.q<{ get_my_context: any }>(`select public.get_my_context()`);
    const ctx = ctxRow.get_my_context;
    expect(ctx.authenticated).toBe(true);
    expect(ctx.role).toBe("employer");
    expect(ctx.employer).toMatchObject({ company_name: "Acme Corp" });
  });
});

describe("Consent Recording & Audit Events (DPDP Compliance)", () => {
  it("records consent and enforces select-only-own policy", async () => {
    await db.user(VERIFIED_USER);
    await db.q(`select public.record_consent('terms', '1.0', 'hash_ip', 'hash_ua')`);
    await db.q(`select public.record_consent('privacy', '1.0', 'hash_ip', 'hash_ua')`);

    const myConsents = await db.q(`select kind, version from public.consents`);
    expect(myConsents).toHaveLength(2);

    // Another user cannot see VERIFIED_USER's consents
    await db.user(UNVERIFIED_USER);
    const otherConsents = await db.q(`select * from public.consents where user_id = $1`, [VERIFIED_USER]);
    expect(otherConsents).toHaveLength(0);
  });

  it("records login events and detects new devices", async () => {
    await db.user(VERIFIED_USER);
    const [ev1] = await db.q<{ record_login_event: string }>(
      `select public.record_login_event('device_hash_alpha', 'ip_1', 'Mozilla/5.0')`
    );
    expect(ev1.record_login_event).toBe("login_new_device");

    // Same device second login is regular 'login'
    const [ev2] = await db.q<{ record_login_event: string }>(
      `select public.record_login_event('device_hash_alpha', 'ip_1', 'Mozilla/5.0')`
    );
    expect(ev2.record_login_event).toBe("login");
  });
});

describe("Data Export & Account Deletion (DPDP Act)", () => {
  it("export_my_data exports all rows belonging to the caller only", async () => {
    await db.user(VERIFIED_USER);
    const [exportRow] = await db.q<{ export_my_data: any }>(`select public.export_my_data()`);
    const data = exportRow.export_my_data;
    expect(data.user_id).toBe(VERIFIED_USER);
    expect(data.profile.email).toBe("verified@test.dev");
    expect(Array.isArray(data.consents)).toBe(true);
    expect(data.consents.length).toBeGreaterThan(0);
  });

  it("request_account_deletion and cancel_account_deletion lifecycle", async () => {
    await db.user(VERIFIED_USER);
    const [reqDel] = await db.q<{ request_account_deletion: any }>(`select public.request_account_deletion()`);
    expect(reqDel.request_account_deletion.success).toBe(true);

    const [p] = await db.q(`select deletion_requested_at is not null as requested from public.profiles where id = $1`, [VERIFIED_USER]);
    expect(p.requested).toBe(true);

    const [cancelDel] = await db.q<{ cancel_account_deletion: any }>(`select public.cancel_account_deletion()`);
    expect(cancelDel.cancel_account_deletion.deletion_cancelled).toBe(true);

    const [p2] = await db.q(`select deletion_requested_at is not null as requested from public.profiles where id = $1`, [VERIFIED_USER]);
    expect(p2.requested).toBe(false);
  });
});

describe("MFA Enforcement (require_aal2)", () => {
  it("require_aal2 raises error 42501 when user only has aal1 session", async () => {
    await db.user(VERIFIED_USER, { aal: "aal1" });
    const err = await db.fails(`select public.require_aal2()`);
    expect(err).toMatch(/Multi-factor authentication \(AAL2\) required/);
  });

  it("require_aal2 succeeds when user has verified second factor (aal2)", async () => {
    await db.user(VERIFIED_USER, { aal: "aal2" });
    const err = await db.fails(`select public.require_aal2()`);
    expect(err).toBeNull();
  });
});

describe("Deprecated Direct Account RPC Guards", () => {
  it("register_user_account raises clear deprecation error", async () => {
    await db.anon();
    const err = await db.fails(`select public.register_user_account('test@test.dev', 'pass', 'Name')`);
    expect(err).toMatch(/Direct account creation via register_user_account is deprecated/);
  });

  it("confirm_unverified_account raises clear deprecation error", async () => {
    await db.anon();
    const err = await db.fails(`select public.confirm_unverified_account('test@test.dev', 'pass')`);
    expect(err).toMatch(/confirm_unverified_account is deprecated/);
  });
});
