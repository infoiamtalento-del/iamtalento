// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const OWNER_A = uuid(701);
const OWNER_B = uuid(702);
const CAND_V = uuid(703); // verified, public
const CAND_U = uuid(704); // unverified, public
const CAND_P = uuid(705); // private profile
const VIEWER = uuid(706); // viewer in tenant A (no app.move / talent.unlock)

let db: Db;
let tenantA: string;
let tenantB: string;
let jobA: string;
let appV: string;
let appU: string;

const sess = async (id: string) => { await db.user(id); };

beforeAll(async () => {
  db = await createDb();

  for (const [id, email, name, company] of [
    [OWNER_A, "a@apex.dev", "Apex Owner", "Apex Global"],
    [OWNER_B, "b@zenith.dev", "Zenith Owner", "Zenith Labs"],
  ] as const) {
    await db.signUp(id, email, { full_name: name, role: "employer", company_name: company });
  }
  await db.admin();
  const t = await db.q<{ user_id: string; tenant_id: string; id: string }>(`select id, user_id, tenant_id from public.employers`);
  tenantA = t.find((x) => x.user_id === OWNER_A)!.tenant_id;
  tenantB = t.find((x) => x.user_id === OWNER_B)!.tenant_id;
  await db.q(`update public.employers set verification_status = 'verified'`);

  await db.signUp(VIEWER, "viewer@apex.dev", { full_name: "Vera Viewer", role: "employee" });
  await db.admin();
  await db.q(`insert into public.tenant_memberships (tenant_id, user_id, role) values ($1, $2, 'viewer')`, [tenantA, VIEWER]);

  for (const [id, email, name, vis, verified] of [
    [CAND_V, "divya@test.dev", "Divya Nair", "public", "verified"],
    [CAND_U, "rahul@test.dev", "Rahul Mehta", "public", "unverified"],
    [CAND_P, "hidden@test.dev", "Hidden Person", "private", "unverified"],
  ] as const) {
    await db.signUp(id, email, { full_name: name, role: "employee" });
    await db.admin();
    await db.q(
      `update public.profiles set onboarding_completed = true, profile_visibility = $2, verification_status = $3,
              professional_headline = 'Senior Engineer', years_of_experience = 5, city = 'Pune', phone = '9999999999', open_to_work = true where id = $1`,
      [id, vis, verified]);
    await db.q(`insert into public.skills (user_id, skill_name) values ($1, 'React'), ($1, 'TypeScript')`, [id]);
  }
  const [{ id: journey }] = await db.q<{ id: string }>(
    `insert into public.assessment_journeys (user_id, domain_assessment_id, status) values ($1, (select id from public.assessments_catalog limit 1), 'completed') returning id`, [CAND_V]);
  await db.q(
    `insert into public.cir_reports (user_id, journey_id, composite_score, percentile, tier, integrity_score, sections) values ($1, $2, 82, 91, 'Gold', 96, '[]'::jsonb)`,
    [CAND_V, journey]);
});

describe("publishing requires a complete company profile", () => {
  it("lets an incomplete profile save a draft but not publish", async () => {
    await sess(OWNER_A);
    const [{ create_job }] = await db.q<{ create_job: any }>(
      `select public.create_job($1::jsonb)`,
      [JSON.stringify({ designation: "Frontend Engineer", job_description: "Build great interfaces for our customers every day.", skills: ["React"], work_mode: "Remote" })]);
    jobA = create_job.id;
    expect(create_job.status).toBe("draft");

    const readiness = (await db.q<{ r: any }>(`select public.employer_publish_readiness() r`))[0].r;
    expect(readiness.ready).toBe(false);
    expect(readiness.missing.length).toBeGreaterThan(0);

    const err = await db.fails(`select public.publish_job($1)`, [jobA]);
    expect(err).toMatch(/Complete your company profile before publishing/);
  });

  it("publishes once the profile is complete and persists the draft until then", async () => {
    await sess(OWNER_A);
    await db.q(`select public.save_employer_profile($1::jsonb)`, [JSON.stringify({
      company_name: "Apex Global", industry: "Software", num_employees: "51-200", hq_city: "Pune",
      official_email: "hr@apex.dev", description: "Apex builds hiring software for fast growing companies in India.",
    })]);
    const readiness = (await db.q<{ r: any }>(`select public.employer_publish_readiness() r`))[0].r;
    expect(readiness).toMatchObject({ ready: true, missing: [] });

    const out = (await db.q<{ p: any }>(`select public.publish_job($1) p`, [jobA]))[0].p;
    expect(out.status).toBe("active");
  });
});

describe("company profile contacts", () => {
  it("adds, validates and removes alternate emails and phones", async () => {
    await sess(OWNER_A);
    let p = (await db.q<{ p: any }>(`select public.save_employer_profile($1::jsonb) p`, [JSON.stringify({
      alt_emails: ["Jobs@apex.dev", "jobs@apex.dev", "ops@apex.dev"], alt_phones: ["+91 98765 43210"], company_category: "B2B SaaS" })]))[0].p;
    expect(p.alt_emails).toEqual(["jobs@apex.dev", "ops@apex.dev"]);
    expect(p.alt_phones).toEqual(["+91 98765 43210"]);
    expect(p.company_category).toBe("B2B SaaS");

    p = (await db.q<{ p: any }>(`select public.save_employer_profile($1::jsonb) p`, [JSON.stringify({ alt_emails: ["ops@apex.dev"], alt_phones: [] })]))[0].p;
    expect(p.alt_emails).toEqual(["ops@apex.dev"]);
    expect(p.alt_phones).toEqual([]);
    expect(p.company_name).toBe("Apex Global"); // untouched fields survive

    expect(await db.fails(`select public.save_employer_profile($1::jsonb)`, [JSON.stringify({ alt_emails: ["nope"] })])).toMatch(/Invalid email/);
    expect(await db.fails(`select public.save_employer_profile($1::jsonb)`, [JSON.stringify({ alt_phones: ["abc"] })])).toMatch(/Invalid phone/);
  });

  it("keeps contacts off the public page unless the employer opts in", async () => {
    await db.admin();
    const slug = (await db.q<{ slug: string }>(`select slug from public.employers where tenant_id = $1`, [tenantA]))[0].slug;
    await db.anon();
    let pub = (await db.q<{ c: any }>(`select public.get_public_company($1) c`, [slug]))[0].c;
    expect(pub).not.toBeNull();
    expect(pub.contact).toBeNull();
    await sess(OWNER_A);
    await db.q(`select public.save_employer_settings($1::jsonb)`, [JSON.stringify({ privacy: { show_contact_public: true } })]);
    await db.anon();
    pub = (await db.q<{ c: any }>(`select public.get_public_company($1) c`, [slug]))[0].c;
    expect(pub.contact.alt_emails).toEqual(["ops@apex.dev"]);
  });
});

describe("application lifecycle incl. On Hold", () => {
  it("receives applications and notifies the employer", async () => {
    for (const [cand, key] of [[CAND_V, "v"], [CAND_U, "u"]] as const) {
      await sess(cand);
      const [row] = await db.q<{ id: string }>(`select * from public.apply_to_job($1, 'Hello')`, [jobA]);
      if (key === "v") appV = row.id; else appU = row.id;
    }
    await sess(OWNER_A);
    const n = await db.q(`select * from public.notifications where title like 'New application%'`);
    expect(n.length).toBe(2);
  });

  it("lists real applicants with counts, filters and search", async () => {
    await sess(OWNER_A);
    const r = (await db.q<{ r: any }>(`select public.list_employer_applications() r`))[0].r;
    expect(r.total).toBe(2);
    expect(r.counts).toEqual({ Applied: 2 });
    const first = r.items.find((i: any) => i.id === appV);
    expect(first.name).toBe("Divya Nair");
    expect(first.talent_cir_id).toMatch(/\S/);

    const s = (await db.q<{ r: any }>(`select public.list_employer_applications(null, null, 'rahul') r`))[0].r;
    expect(s.items.map((i: any) => i.id)).toEqual([appU]);
    const f = (await db.q<{ r: any }>(`select public.list_employer_applications(null, 'Shortlisted') r`))[0].r;
    expect(f.total).toBe(0);
  });

  it("moves to On Hold and back, keeping history and audit rows", async () => {
    await sess(OWNER_A);
    await db.q(`select public.change_application_stage($1, 'Shortlisted')`, [appV]);
    await db.q(`select public.change_application_stage($1, 'On Hold', 'Waiting on budget')`, [appV]);
    let r = (await db.q<{ r: any }>(`select public.list_employer_applications(null, 'On Hold') r`))[0].r;
    expect(r.total).toBe(1);

    const released = (await db.q<{ r: any }>(`select public.release_application_hold($1) r`, [appV]))[0].r;
    expect(released.stage).toBe("Shortlisted"); // restored to the stage before the hold

    const d = (await db.q<{ d: any }>(`select public.get_employer_application($1) d`, [appV]))[0].d;
    expect(d.history.map((h: any) => h.to)).toEqual(["Applied", "Shortlisted", "On Hold", "Shortlisted"]);
    expect(d.history[2].message).toBe("Waiting on budget");
    expect(d.candidate.name).toBe("Divya Nair");
    expect(d.candidate.talent_cir_id).toMatch(/\S/);

    const act = (await db.q<{ a: any }>(`select public.list_employer_activity() a`))[0].a;
    expect(act.filter((x: any) => x.action === "application.stage_change").length).toBe(3);

    r = (await db.q<{ r: any }>(`select public.list_employer_applications() r`))[0].r;
    expect(r.counts).toEqual({ Applied: 1, Shortlisted: 1 });
  });

  it("changes only the targeted application", async () => {
    await sess(OWNER_A);
    const apps = (await db.q<{ r: any }>(`select public.list_employer_applications() r`))[0].r;
    expect(apps.items.find((i: any) => i.id === appU).stage).toBe("Applied");
  });

  it("rejects invalid stages, other tenants, candidates and read-only members", async () => {
    await sess(OWNER_A);
    expect(await db.fails(`select public.change_application_stage($1, 'Hired')`, [appV])).toMatch(/Invalid stage/);
    expect(await db.fails(`select public.change_application_stage($1, 'Withdrawn')`, [appV])).toMatch(/Invalid stage/);
    await sess(OWNER_B);
    expect(await db.fails(`select public.change_application_stage($1, 'Rejected')`, [appV])).toMatch(/Unauthorized/);
    expect(await db.fails(`select public.get_employer_application($1)`, [appV])).toMatch(/Unauthorized/);
    await sess(CAND_V);
    expect(await db.fails(`select public.change_application_stage($1, 'Rejected')`, [appV])).toMatch(/Unauthorized|Tenant/);
    await sess(VIEWER);
    expect(await db.fails(`select public.change_application_stage($1, 'Rejected')`, [appV])).toMatch(/Unauthorized/);
  });

  it("notifies the candidate about a move", async () => {
    await sess(CAND_V);
    const n = await db.q(`select title from public.notifications where kind = 'application' order by created_at`);
    expect(n.map((x: any) => x.title).some((t: string) => /: On Hold$/.test(t))).toBe(true);
  });
});

describe("follow-up notifications", () => {
  it("creates a two-day pending follow-up once, links to the application and tracks action", async () => {
    await db.admin();
    await db.q(`update public.job_applications set stage_changed_at = now() - interval '3 days' where id = $1`, [appU]);
    await db.q(`update public.job_applications set stage_changed_at = now() - interval '1 hour' where id = $1`, [appV]);

    const [{ n: first }] = await db.q<{ n: number }>(`select public.generate_employer_followups() n`);
    expect(first).toBe(1);
    const [{ n: second }] = await db.q<{ n: number }>(`select public.generate_employer_followups() n`);
    expect(second).toBe(0); // deduplicated

    await sess(OWNER_A);
    const rows = await db.q<any>(`select * from public.notifications where kind = 'employer_followup'`);
    expect(rows).toHaveLength(1);
    expect(rows[0].link).toContain(appU);
    expect(rows[0].title).toMatch(/pending for 3 days/);
    expect(rows[0].data.suggested_action).toBeTruthy();
    expect(rows[0].acted_at).toBeNull();

    await db.q(`select public.change_application_stage($1, 'Shortlisted')`, [appU]);
    const after = await db.q<any>(`select acted_at from public.notifications where kind = 'employer_followup'`);
    expect(after[0].acted_at).not.toBeNull();
  });

  it("is not callable by clients and honours disabled follow-ups", async () => {
    await sess(OWNER_A);
    expect(await db.fails(`select public.generate_employer_followups()`)).toMatch(/permission denied/);
    await db.q(`select public.save_employer_settings($1::jsonb)`, [JSON.stringify({ followups_enabled: false })]);
    await db.admin();
    await db.q(`update public.job_applications set stage = 'On Hold' where id = $1`, [appU]);
    await db.q(`update public.job_applications set stage_changed_at = now() - interval '10 days' where id = $1`, [appU]);
    const [{ n }] = await db.q<{ n: number }>(`select public.generate_employer_followups() n`);
    expect(n).toBe(0);
    await db.q(`update public.employer_settings set followups_enabled = true where tenant_id = $1`, [tenantA]);
    const [{ n: n2 }] = await db.q<{ n: number }>(`select public.generate_employer_followups() n`);
    expect(n2).toBe(1); // on-hold reminder
  });
});

describe("overview and history", () => {
  it("reports real metrics without SLA data", async () => {
    await sess(OWNER_A);
    const o = (await db.q<{ o: any }>(`select public.employer_overview() o`))[0].o;
    expect(o.jobs).toMatchObject({ total: 1, active: 1, draft: 0 });
    expect(o.applications).toMatchObject({ total: 2, shortlisted: 1, on_hold: 1, pending: 0, selected: 0 });
    expect(o.recent_applications).toHaveLength(2);
    expect(JSON.stringify(o)).not.toMatch(/sla/i);
    expect(o.readiness.ready).toBe(true);
  });

  it("records profile, job and candidate activity with timestamps", async () => {
    await sess(OWNER_A);
    const act = (await db.q<{ a: any }>(`select public.list_employer_activity(50) a`))[0].a;
    const kinds = new Set(act.map((x: any) => x.action));
    for (const k of ["save_employer_profile", "job.create", "job.publish", "application.stage_change"]) expect(kinds.has(k)).toBe(true);
    expect(act[0].at).toBeTruthy();
    await sess(OWNER_B);
    const other = (await db.q<{ a: any }>(`select public.list_employer_activity(50) a`))[0].a;
    expect(other.find((x: any) => x.entity_id === jobA)).toBeUndefined(); // tenant isolation
  });
});

describe("Find Talent", () => {
  it("shows a limited overview and hides private or sensitive data", async () => {
    await sess(OWNER_B);
    const r = (await db.q<{ r: any }>(`select public.search_candidates() r`))[0].r;
    expect(r.total).toBe(2); // private profile excluded
    const v = r.items.find((i: any) => i.id === CAND_V);
    expect(v.display_name).toBe("Divya N.");
    expect(v.verified).toBe(true);
    expect(v.skills).toContain("React");
    expect(v.unlocked).toBe(false);
    expect(Object.keys(v)).not.toEqual(expect.arrayContaining(["email"]));
    expect(JSON.stringify(v)).not.toMatch(/9999999999|divya@test/);

    const only = (await db.q<{ r: any }>(`select public.search_candidates(null, true) r`))[0].r;
    expect(only.items.map((i: any) => i.id)).toEqual([CAND_V]);
  });

  it("blocks the full profile and CIR until access is purchased", async () => {
    await sess(OWNER_B);
    expect(await db.fails(`select public.get_candidate_profile_for_employer($1)`, [CAND_V])).toMatch(/Unlock this candidate/);
    expect(await db.fails(`select public.get_candidate_cir_report($1)`, [CAND_V])).toMatch(/not unlocked/);
    const direct = await db.q(`select * from public.cir_reports`);
    expect(direct).toHaveLength(0); // no direct table read either
  });

  it("requires wallet balance, then charges once and unlocks", async () => {
    await sess(OWNER_B);
    const ov = (await db.q<{ o: any }>(`select public.get_talent_overview() o`))[0].o;
    expect(ov.wallet.balance).toBe(0);
    expect(ov.packages.map((p: any) => p.key)).toEqual(["unverified_profile", "verified_profile", "verified_monthly"]);
    expect(await db.fails(`select public.purchase_talent_package('verified_profile', $1)`, [CAND_V])).toMatch(/Insufficient wallet balance/);

    await db.admin();
    const w = await db.q<{ id: string }>(`select id from public.wallet_accounts where owner_type = 'tenant' and tenant_id = $1`, [tenantB]);
    await db.q(`select public.wallet_transfer(public._platform_wallet('platform_float'), $1, 5000, 'Top-up', 'test', 't1', 'topup-test')`, [w[0].id]);

    await sess(OWNER_B);
    const buy = (await db.q<{ r: any }>(`select public.purchase_talent_package('verified_profile', $1) r`, [CAND_V]))[0].r;
    expect(buy).toMatchObject({ granted: true, already_owned: false, balance: 2001 });
    const again = (await db.q<{ r: any }>(`select public.purchase_talent_package('verified_profile', $1) r`, [CAND_V]))[0].r;
    expect(again).toMatchObject({ already_owned: true, balance: 2001 }); // no double charge

    const prof = (await db.q<{ p: any }>(`select public.get_candidate_profile_for_employer($1) p`, [CAND_V]))[0].p;
    expect(prof.profile.email).toBe("divya@test.dev");
    expect(prof.access).toMatchObject({ profile: true, cv: true, cir: true });
    const cir = (await db.q<{ c: any }>(`select public.get_candidate_cir_report($1) c`, [CAND_V]))[0].c;
    expect(cir.composite_score).toBe(82);
    expect(cir.talent_cir_id).toMatch(/\S/);
  });

  it("keeps entitlements tenant-scoped and package rules strict", async () => {
    await sess(OWNER_A);
    // Tenant A has the applicant relationship (profile + CV) but no CIR entitlement.
    const app = (await db.q<{ d: any }>(`select public.get_employer_application($1) d`, [appV]))[0].d;
    expect(app.access).toMatchObject({ profile: true, cv: true, cir: false, via: "applicant" });
    expect(await db.fails(`select public.get_candidate_cir_report($1)`, [CAND_V])).toMatch(/not unlocked/);

    await sess(OWNER_B);
    expect(await db.fails(`select public.purchase_talent_package('verified_profile', $1)`, [CAND_U])).toMatch(/only for verified/);
    expect(await db.fails(`select public.purchase_talent_package('unverified_profile', $1)`, [CAND_V])).toMatch(/verified package/);
    expect(await db.fails(`select public.purchase_talent_package('verified_profile', null)`)).toMatch(/Select a candidate/);
    expect(await db.fails(`select public.purchase_talent_package('nope', $1)`, [CAND_V])).toMatch(/Package not found/);
  });

  it("sells subscriptions and per-profile access, and blocks viewers and candidates", async () => {
    await sess(OWNER_B);
    const u = (await db.q<{ r: any }>(`select public.purchase_talent_package('unverified_profile', $1) r`, [CAND_U]))[0].r;
    expect(u.balance).toBe(1902);
    expect(await db.fails(`select public.purchase_talent_package('verified_monthly')`)).toMatch(/Insufficient wallet balance. Recharge at least 597/);
    await db.admin();
    const w = await db.q<{ id: string }>(`select id from public.wallet_accounts where owner_type = 'tenant' and tenant_id = $1`, [tenantB]);
    await db.q(`select public.wallet_transfer(public._platform_wallet('platform_float'), $1, 3000, 'Top-up', 'test', 't2', 'topup-test-2')`, [w[0].id]);
    await sess(OWNER_B);
    const sub = (await db.q<{ r: any }>(`select public.purchase_talent_package('verified_monthly') r`))[0].r;
    expect(sub.balance).toBe(2403);
    const ov = (await db.q<{ o: any }>(`select public.get_talent_overview() o`))[0].o;
    expect(ov.subscription).not.toBeNull();

    await sess(VIEWER);
    expect(await db.fails(`select public.search_candidates()`)).toMatch(/Unauthorized|talent\.search/);
    await sess(CAND_V);
    expect(await db.fails(`select public.search_candidates()`)).toMatch(/Tenant organization not found|Unauthorized/);
    expect(await db.fails(`select public.purchase_talent_package('verified_monthly')`)).toMatch(/Tenant organization not found|Unauthorized/);
  });

  it("moves wallet money through the ledger only", async () => {
    await db.admin();
    const led = await db.q<{ n: number }>(
      `select count(*)::int n from public.wallet_ledger_entries l join public.wallet_accounts w on w.id = l.wallet_id where w.tenant_id = $1`, [tenantB]);
    expect(led[0].n).toBeGreaterThanOrEqual(5);
    const bal = await db.q<{ balance: string }>(`select balance from public.wallet_accounts where tenant_id = $1`, [tenantB]);
    expect(Number(bal[0].balance)).toBe(2403);
  });
});

describe("employer wallet top-up credits the tenant wallet", () => {
  it("fulfils a top-up order into the company wallet, not a personal one", async () => {
    await sess(OWNER_A);
    const order = (await db.q<{ id: string }>(`select * from public.create_payment_order('wallet_topup', null, null, null, null, 'k1', 'razorpay', 1000)`))[0];
    await db.admin();
    await db.q(`select public.fulfill_payment_order($1, 'pay_test_1')`, [order.id]);
    await db.q(`select public.fulfill_payment_order($1, 'pay_test_1')`, [order.id]); // idempotent
    const t = await db.q<{ balance: string }>(`select balance from public.wallet_accounts where owner_type = 'tenant' and tenant_id = $1`, [tenantA]);
    expect(Number(t[0].balance)).toBe(1000);
    const c = await db.q(`select 1 from public.wallet_accounts where owner_type = 'candidate' and user_id = $1`, [OWNER_A]);
    expect(c).toHaveLength(0);
    await sess(OWNER_A);
    expect((await db.q<{ w: any }>(`select public.get_employer_wallet() w`))[0].w.balance).toBe(1000);
  });
});

describe("interviews", () => {
  let interviewId: string;

  it("schedules an interview, moves the applicant to Interview and validates input", async () => {
    await sess(OWNER_A);
    const at = new Date(Date.now() + 86400000).toISOString();
    const iv = (await db.q<{ i: any }>(`select public.schedule_interview($1, $2, 'video', 45, 'https://meet.example.com/abc') i`, [appV, at]))[0].i;
    interviewId = iv.id;
    expect(iv.status).toBe("scheduled");

    const d = (await db.q<{ d: any }>(`select public.get_employer_application($1) d`, [appV]))[0].d;
    expect(d.stage).toBe("Interview");
    expect(d.interviews).toHaveLength(1);
    expect(d.history.at(-1).to).toBe("Interview");

    expect(await db.fails(`select public.schedule_interview($1, now() - interval '1 day')`, [appV])).toMatch(/future interview time/);
    expect(await db.fails(`select public.schedule_interview($1, $2, 'carrier-pigeon')`, [appV, at])).toMatch(/Invalid interview mode/);
    expect(await db.fails(`select public.schedule_interview($1, $2, 'video', 45, 'javascript:alert(1)')`, [appV, at])).toMatch(/http/);
    await sess(OWNER_B);
    expect(await db.fails(`select public.schedule_interview($1, $2)`, [appV, at])).toMatch(/Unauthorized/);
    await sess(VIEWER);
    expect(await db.fails(`select public.schedule_interview($1, $2)`, [appV, at])).toMatch(/Unauthorized/);
  });

  it("flags a past interview without an outcome once, and clears it when updated", async () => {
    await db.admin();
    await db.q(`update public.scheduled_interviews set scheduled_at = now() - interval '2 days' where id = $1`, [interviewId]);
    const [{ n }] = await db.q<{ n: number }>(`select public.generate_employer_followups() n`);
    expect(n).toBe(1);
    const [{ n: again }] = await db.q<{ n: number }>(`select public.generate_employer_followups() n`);
    expect(again).toBe(0);

    await sess(OWNER_A);
    const open = await db.q<any>(`select * from public.notifications where kind = 'employer_followup' and data ->> 'interview_id' = $1`, [interviewId]);
    expect(open).toHaveLength(1);
    expect(open[0].title).toMatch(/Interview outcome/);

    await db.q(`select public.update_interview_status($1, 'completed')`, [interviewId]);
    const done = await db.q<any>(`select acted_at from public.notifications where data ->> 'interview_id' = $1`, [interviewId]);
    expect(done[0].acted_at).not.toBeNull();
    expect(await db.fails(`select public.update_interview_status($1, 'maybe')`, [interviewId])).toMatch(/Invalid status/);
    await sess(OWNER_B);
    expect(await db.fails(`select public.update_interview_status($1, 'cancelled')`, [interviewId])).toMatch(/Unauthorized/);
  });
});

describe("audit log integrity", () => {
  it("rejects audit rows written into another company's history", async () => {
    await sess(CAND_V);
    expect(await db.fails(`select public.log_audit($1, 'job.publish', 'employer_job_openings', 'x')`, [tenantA])).toMatch(/Unauthorized/);
    await sess(OWNER_B);
    expect(await db.fails(`select public.log_audit($1, 'job.publish', 'employer_job_openings', 'x')`, [tenantA])).toMatch(/Unauthorized/);
    await sess(OWNER_A);
    const id = (await db.q<{ id: number }>(`select public.log_audit($1, 'settings.update', 'employer_settings', 'ok') id`, [tenantA]))[0].id;
    expect(Number(id)).toBeGreaterThan(0);
  });
});
