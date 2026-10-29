// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const A = uuid(1), B = uuid(2), EMP = uuid(3), EMP2 = uuid(4), ADMIN = uuid(5), MAL = uuid(6);
let db: Db;

beforeAll(async () => {
  db = await createDb();
  await db.signUp(A, "a@test.dev", { full_name: "Asha Candidate", role: "employee", experience_level: "fresher" });
  await db.signUp(B, "b@test.dev", { full_name: "Bala Candidate" });
  await db.signUp(EMP, "emp@test.dev", { full_name: "Eve Employer", role: "employer", company_name: "Acme" });
  await db.signUp(EMP2, "emp2@test.dev", { full_name: "Evan Employer", role: "employer", company_name: "Globex" });
  await db.signUp(MAL, "mal@test.dev", { full_name: "Mallory", role: "admin" });
  await db.signUp(ADMIN, "admin@test.dev", {});
  await db.admin();
  await db.q(`insert into public.platform_admins (user_id) values ($1)`, [ADMIN]);
}, 120_000);

describe("sign-up", () => {
  it("creates profile, role and employer record from metadata", async () => {
    await db.admin();
    const rows = await db.q(`select u.email, r.role, p.experience_level,
      (select company_name from public.employers e where e.user_id = u.id) as company
      from auth.users u join public.user_roles r on r.user_id = u.id join public.profiles p on p.id = u.id order by u.email`);
    const by = Object.fromEntries(rows.map((r) => [r.email, r]));
    expect(by["a@test.dev"]).toMatchObject({ role: "employee", experience_level: "fresher" });
    expect(by["emp@test.dev"]).toMatchObject({ role: "employer", company: "Acme" });
  });

  it("never grants admin through sign-up metadata", async () => {
    await db.admin();
    expect((await db.q(`select role from public.user_roles where user_id = $1`, [MAL]))[0].role).toBe("employee");
    expect((await db.q(`select count(*)::int n from public.platform_admins where user_id = $1`, [MAL]))[0].n).toBe(0);
  });

  it("does not let clients assign themselves roles", async () => {
    await db.user(A);
    expect(await db.fails(`insert into public.user_roles (user_id, role) values ($1, 'employer')`, [A])).toBeTruthy();
  });
});

describe("column protection (privilege escalation)", () => {
  it("blocks self-verification and readiness inflation on profiles", async () => {
    await db.user(A);
    await db.q(`update public.profiles set verification_status = 'verified', industry_readiness_score = 100,
      referral_code = 'HACKED', iam_talento_id = 'IAT-FAKE', professional_headline = 'Hello' where id = $1`, [A]);
    await db.admin();
    const [p] = await db.q(`select verification_status, industry_readiness_score, referral_code, iam_talento_id, professional_headline from public.profiles where id = $1`, [A]);
    expect(p.verification_status).toBe("unverified");
    expect(Number(p.industry_readiness_score)).toBe(0);
    expect(p.referral_code).not.toBe("HACKED");
    expect(p.iam_talento_id).not.toBe("IAT-FAKE");
    expect(p.professional_headline).toBe("Hello");
  });

  it("forces skills and certifications to unverified when written by a client", async () => {
    await db.user(A);
    await db.q(`insert into public.skills (user_id, skill_name, is_verified) values ($1, 'React', true)`, [A]);
    await db.q(`insert into public.certifications (user_id, name, verification_status) values ($1, 'AWS Cloud Practitioner', 'verified')`, [A]);
    await db.q(`update public.skills set is_verified = true where user_id = $1`, [A]);
    await db.admin();
    expect((await db.q(`select is_verified from public.skills where user_id = $1`, [A]))[0].is_verified).toBe(false);
    expect((await db.q(`select verification_status from public.certifications where user_id = $1`, [A]))[0].verification_status).toBe("unverified");
  });

  it("rejects javascript: URLs and oversized text", async () => {
    await db.user(A);
    expect(await db.fails(`update public.profiles set portfolio_url = 'javascript:alert(1)' where id = $1`, [A])).toMatch(/profiles_url_scheme|check/i);
    expect(await db.fails(`update public.profiles set about_summary = $2 where id = $1`, [A, "x".repeat(6000)])).toMatch(/profiles_text_len|check/i);
  });

  it("keeps identity decisions server side", async () => {
    await db.user(A);
    expect(await db.fails(`insert into public.identity_verifications (user_id, verification_status) values ($1, 'verified')`, [A])).toBeTruthy();
    expect((await db.q(`select * from public.submit_identity_verification('aadhar', $1, $2, 'ABCDE1234F')`, [`${A}/id.pdf`, `${A}/me.jpg`]))[0].verification_status).toBe("pending");
    expect(await db.fails(`select * from public.submit_identity_verification('aadhar', $1, null)`, [`${B}/stolen.pdf`])).toMatch(/Invalid document path/);
    expect(await db.fails(`select public.review_identity_verification($1, true)`, [A])).toMatch(/Not allowed/);
    await db.user(ADMIN);
    await db.q(`select public.review_identity_verification($1, true)`, [A]);
    await db.admin();
    expect((await db.q(`select verification_status from public.profiles where id = $1`, [A]))[0].verification_status).toBe("verified");
  });
});

describe("function exposure", () => {
  // Every SECURITY DEFINER function a client can call must be listed here on purpose.
  const AUTH_ALLOWED = new Set([
    "apply_to_job", "book_mentor_slot", "cancel_mentor_booking", "cancel_payment_order", "candidate_analytics", "candidate_dashboard",
    "claim_referral", "complete_module", "compute_match_score", "create_payment_order", "create_support_ticket", "enroll_in_course",
    "generate_cir_report", "get_attempt_questions", "get_journey_progress", "get_or_create_my_wallet", "get_public_portfolio",
    "join_hackathon_team", "load_candidate_profile", "log_proctoring_event", "mark_notifications_read", "pay_order_with_wallet",
    "purchase_service", "register_for_event", "register_for_hackathon", "reply_support_ticket", "save_attempt_response",
    "save_candidate_profile", "search_jobs", "start_assessment_attempt", "start_journey", "submit_assessment_attempt",
    "submit_gig_proposal", "submit_hackathon_project", "submit_identity_verification", "subscribe_job_alerts", "toggle_saved_job",
    "unsubscribe_job_alert", "update_application_stage", "validate_coupon", "verify_credential", "withdraw_application",
    "withdraw_gig_proposal", "review_identity_verification",
    // used inside RLS policies and constraints
    "is_admin", "is_owner", "is_tenant_member", "can_manage_job", "has_role", "all_http_urls", "is_client_role", "safe_date", "_jsonb_text_array",
    "generate_talento_id", "update_updated_at",
  ]);
  const ANON_ALLOWED = new Set([
    "is_admin", "is_owner", "is_tenant_member", "can_manage_job", "has_role", "all_http_urls", "is_client_role", "verify_credential",
    "get_public_portfolio", "search_jobs", "subscribe_job_alerts", "unsubscribe_job_alert",
  ]);

  const callable = async (role: string) => {
    await db.admin();
    const rows = await db.q<{ proname: string }>(`select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.prokind = 'f' and p.prorettype <> 'trigger'::regtype and has_function_privilege($1, p.oid, 'execute') order by 1`, [role]);
    return [...new Set(rows.map((r) => r.proname))];
  };

  it("lets authenticated users call only the intended functions", async () => {
    expect((await callable("authenticated")).filter((n) => !AUTH_ALLOWED.has(n))).toEqual([]);
  });
  it("lets anonymous users call only public lookups", async () => {
    expect((await callable("anon")).filter((n) => !ANON_ALLOWED.has(n))).toEqual([]);
  });
  it("has row level security on every public table", async () => {
    await db.admin();
    const rows = await db.q(`select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`);
    expect(rows).toEqual([]);
  });
});

describe("row level isolation", () => {
  it("hides private tables from other users and anonymous callers", async () => {
    await db.user(B);
    for (const t of ["profiles", "skills", "identity_verifications", "payment_orders", "wallet_accounts", "wallet_ledger_entries",
      "assessment_attempts", "cir_reports", "notifications", "job_applications", "support_tickets", "rate_limits"]) {
      const rows = await db.q(`select count(*)::int n from public.${t}` + (t === "profiles" ? ` where id <> $1` : ""), t === "profiles" ? [B] : []);
      expect(rows[0].n, t).toBe(0);
    }
    await db.anon();
    for (const t of ["profiles", "payment_orders", "question_answer_keys", "verifiable_credentials", "notifications", "coupons"]) {
      const msg = await db.fails(`select * from public.${t}`);
      const rows = msg ? [] : await db.q(`select * from public.${t}`);
      expect(rows.length, t).toBe(0);
    }
  });

  it("blocks anonymous calls to authenticated RPCs", async () => {
    await db.anon();
    for (const call of [`apply_to_job('${uuid(99)}', null)`, `validate_coupon('WELCOME100','course',999)`, `get_or_create_my_wallet()`,
      `candidate_dashboard()`, `claim_referral('X')`, `create_payment_order('wallet_topup', null, null, null, null, 'k', 'razorpay', 100)`]) {
      expect(await db.fails(`select public.${call}`), call).toMatch(/permission denied|Not authenticated/);
    }
  });

  it("rate limits probing and spam", async () => {
    await db.user(A);
    let hit = "";
    for (let i = 0; i < 25; i++) {
      hit = (await db.fails(`select * from public.validate_coupon('NOPE${i}', 'course', 999)`)) ?? hit;
    }
    expect(hit).toMatch(/Too many requests/);
    expect(await db.fails(`select public.rate_limit_hit('x', 1, interval '1 hour', '${B}')`)).toMatch(/permission denied/);
  });
});

describe("employers cannot forge data", () => {
  let job: string;
  let appId: string;
  it("forces source=employer and ownership on jobs", async () => {
    await db.user(EMP);
    const [row] = await db.q(`insert into public.employer_job_openings (designation, company_name, source, user_id, job_type, work_mode, skills)
      values ('Forged Platform Job', 'Acme', 'platform', $1, 'Full-time', 'Remote', array['React']) returning id, source, user_id`, [EMP2]);
    job = row.id;
    expect(row.source).toBe("employer");
    expect(row.user_id).toBe(EMP);
  });

  it("lets a candidate apply and an employer move the stage, but not rewrite the application", async () => {
    await db.user(A);
    const [app] = await db.q(`select * from public.apply_to_job($1, 'hire me')`, [job]);
    appId = app.id;
    await db.user(EMP2);
    expect((await db.q(`select count(*)::int n from public.job_applications`))[0].n).toBe(0);
    await db.user(EMP);
    await db.q(`update public.job_applications set stage = 'Shortlisted', candidate_id = $2, match_score = 100, cover_note = 'edited' where id = $1`, [appId, B]);
    await db.admin();
    const [row] = await db.q(`select stage, candidate_id, match_score, cover_note from public.job_applications where id = $1`, [appId]);
    expect(row).toMatchObject({ stage: "Shortlisted", candidate_id: A, cover_note: "hire me" });
    expect(Number(row.match_score)).not.toBe(100);
    const notes = await db.q(`select title from public.notifications where user_id = $1 and kind = 'application'`, [A]);
    expect(notes.length).toBeGreaterThan(0);
  });

  it("stops a candidate editing or withdrawing via direct writes", async () => {
    await db.user(A);
    await db.q(`update public.job_applications set stage = 'Offer', match_score = 100 where id = $1`, [appId]);
    await db.admin();
    expect((await db.q(`select stage from public.job_applications where id = $1`, [appId]))[0].stage).toBe("Shortlisted");
  });

  it("lets only the job owner see applicant profiles", async () => {
    await db.user(EMP);
    expect((await db.q(`select count(*)::int n from public.profiles where id = $1`, [A]))[0].n).toBe(1);
    expect((await db.q(`select count(*)::int n from public.profiles where id = $1`, [B]))[0].n).toBe(0);
    await db.user(EMP2);
    expect((await db.q(`select count(*)::int n from public.profiles where id = $1`, [A]))[0].n).toBe(0);
  });
});
