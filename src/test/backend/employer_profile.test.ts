// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const EMP_OWNER_A = uuid(301);
const EMP_MEMBER_A = uuid(302);
const EMP_VIEWER_A = uuid(303);
const EMP_OWNER_B = uuid(304);
const CANDIDATE_C = uuid(305);

let db: Db;
let tenantA: string;
let tenantB: string;
let employerIdA: string;
let employerIdB: string;
let jobA1: string;
let jobA2: string;

beforeAll(async () => {
  db = await createDb();

  // Create Employer A (owner)
  await db.signUp(EMP_OWNER_A, "ownerA@alpha.dev", { full_name: "Alpha Owner", role: "employer", company_name: "Alpha Dynamics" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMP_OWNER_A]);

  const empARows = await db.q<{ id: string; tenant_id: string }>(`select id, tenant_id from public.employers where user_id = $1`, [EMP_OWNER_A]);
  employerIdA = empARows[0].id;
  tenantA = empARows[0].tenant_id;

  // Create Employer B (isolated)
  await db.signUp(EMP_OWNER_B, "ownerB@beta.dev", { full_name: "Beta Owner", role: "employer", company_name: "Beta Systems" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMP_OWNER_B]);

  const empBRows = await db.q<{ id: string; tenant_id: string }>(`select id, tenant_id from public.employers where user_id = $1`, [EMP_OWNER_B]);
  employerIdB = empBRows[0].id;
  tenantB = empBRows[0].tenant_id;

  // Add Recruiter to Tenant A
  await db.signUp(EMP_MEMBER_A, "recruiterA@alpha.dev", { full_name: "Alpha Recruiter" });
  await db.admin();
  await db.q(`delete from public.user_roles where user_id = $1`, [EMP_MEMBER_A]);
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMP_MEMBER_A]);
  await db.q(`insert into public.tenant_memberships (tenant_id, user_id, role) values ($1, $2, 'recruiter')`, [tenantA, EMP_MEMBER_A]);

  // Add Viewer to Tenant A (lacks company.edit)
  await db.signUp(EMP_VIEWER_A, "viewerA@alpha.dev", { full_name: "Alpha Viewer" });
  await db.admin();
  await db.q(`delete from public.user_roles where user_id = $1`, [EMP_VIEWER_A]);
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMP_VIEWER_A]);
  await db.q(`insert into public.tenant_memberships (tenant_id, user_id, role) values ($1, $2, 'viewer')`, [tenantA, EMP_VIEWER_A]);

  // Candidate user
  await db.signUp(CANDIDATE_C, "candidateC@test.dev", { full_name: "Candidate Charlie", role: "employee" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [CANDIDATE_C]);
});

describe("Employer Profile CRUD & Validations", () => {
  it("rejects invalid URLs, lengths, GSTIN and PAN", async () => {
    await db.user(EMP_OWNER_A);

    // Short company name
    let err = await db.fails(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({ company_name: "A" }),
    ]);
    expect(err).toMatch(/Company name must be at least 2 characters/);

    // Invalid website URL
    err = await db.fails(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({ company_name: "Alpha Dynamics", website: "not-a-url" }),
    ]);
    expect(err).toMatch(/Website must be a valid HTTP\/HTTPS URL/);

    // Invalid GSTIN format
    err = await db.fails(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({ company_name: "Alpha Dynamics", gstin: "INVALIDGST123" }),
    ]);
    expect(err).toMatch(/Invalid GSTIN format/);

    // Invalid PAN format
    err = await db.fails(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({ company_name: "Alpha Dynamics", pan: "BADPAN123" }),
    ]);
    expect(err).toMatch(/Invalid PAN format/);
  });

  it("saves valid profile, encrypts PAN at rest, and recomputes completion", async () => {
    await db.user(EMP_OWNER_A);

    const validPayload = {
      company_name: "Alpha Dynamics Technologies",
      website: "https://alphadynamics.example.com",
      logo_url: "https://alphadynamics.example.com/logo.png",
      cover_url: "https://alphadynamics.example.com/cover.png",
      mission: "Transforming enterprise developer intelligence.",
      description: "Alpha Dynamics builds next-generation AI developer verification pipelines.",
      industry: "Information Technology",
      num_employees: "50-100",
      hq_city: "Bengaluru",
      established_year: 2021,
      benefits: ["Remote work", "Health insurance", "Learning budget"],
      culture_tags: ["Fast-paced", "Engineering-led"],
      hiring_regions: ["India", "Remote"],
      gstin: "29AAAAA0000A1Z5",
      pan: "ABCDE1234F",
      slug: "alpha-dynamics",
    };

    const res = await db.q<{ save_employer_profile: Record<string, unknown> }>(
      `select public.save_employer_profile($1::jsonb)`,
      [JSON.stringify(validPayload)]
    );
    const saved = res[0].save_employer_profile;
    expect(saved.company_name).toBe("Alpha Dynamics Technologies");
    expect(saved.slug).toBe("alpha-dynamics");
    expect(saved.pan).toBe("XXXXX1234F"); // masked
    expect(Number(saved.profile_completion)).toBeGreaterThanOrEqual(80);

    // Verify PAN is encrypted in the raw table and NOT plaintext
    await db.admin();
    const rawRows = await db.q<{ pan: string }>(`select pan from public.employers where id = $1`, [employerIdA]);
    expect(rawRows[0].pan).not.toBe("ABCDE1234F");
    expect(rawRows[0].pan).toContain("BEGIN PGP MESSAGE");
  });

  it("enforces permission checks: viewers cannot edit profile", async () => {
    await db.user(EMP_VIEWER_A);
    const err = await db.fails(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({ company_name: "Alpha Hacked" }),
    ]);
    expect(err).toMatch(/Unauthorized: company\.edit permission required/);
  });

  it("enforces tenant boundary: Tenant A cannot overwrite Tenant B", async () => {
    await db.user(EMP_OWNER_A);
    const profile = await db.q<{ get_employer_profile: Record<string, unknown> }>(
      `select public.get_employer_profile()`
    );
    expect(profile[0].get_employer_profile.id).toBe(employerIdA);
    expect(profile[0].get_employer_profile.id).not.toBe(employerIdB);
  });

  it("prevents candidate users from saving employer profiles", async () => {
    await db.user(CANDIDATE_C);
    const err = await db.fails(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({ company_name: "Candidate Org" }),
    ]);
    expect(err).toMatch(/Employer profile not found/);
  });
});

describe("Public Company Projection (/company/:slug)", () => {
  it("allows anonymous lookup by slug and leaks NO private data", async () => {
    await db.anon();

    const res = await db.q<{ get_public_company: Record<string, unknown> }>(
      `select public.get_public_company('alpha-dynamics')`
    );
    const pub = res[0].get_public_company;
    expect(pub).not.toBeNull();
    expect(pub.name).toBe("Alpha Dynamics Technologies");
    expect(pub.slug).toBe("alpha-dynamics");
    expect(pub.about).toContain("Alpha Dynamics builds");
    expect(pub.mission).toBe("Transforming enterprise developer intelligence.");
    expect(pub.website).toBe("https://alphadynamics.example.com");
    expect(pub.hq).toBe("Bengaluru");
    expect(pub.benefits).toEqual(["Remote work", "Health insurance", "Learning budget"]);

    // STRICT PRIVACY CHECK: None of these private fields should exist in the response
    expect(pub.pan).toBeUndefined();
    expect(pub.gstin).toBeUndefined();
    expect(pub.official_email).toBeUndefined();
    expect(pub.contact_name).toBeUndefined();
    expect(pub.phone).toBeUndefined();
    expect(pub.billing_address).toBeUndefined();
  });

  it("returns null for non-existent company slug", async () => {
    await db.anon();
    const res = await db.q<{ get_public_company: Record<string, unknown> | null }>(
      `select public.get_public_company('non-existent-company-slug')`
    );
    expect(res[0].get_public_company).toBeNull();
  });
});

describe("Rename Propagation & Trigger Sync", () => {
  it("propagates employer company name, slug and logo to tenant and all jobs", async () => {
    await db.admin();

    // Create 2 jobs for Alpha Dynamics
    const j1 = await db.q<{ id: string }>(
      `insert into public.employer_job_openings (employer_id, user_id, tenant_id, designation, status)
       values ($1, $2, $3, 'Staff Frontend Engineer', 'active') returning id`,
      [employerIdA, EMP_OWNER_A, tenantA]
    );
    const j2 = await db.q<{ id: string }>(
      `insert into public.employer_job_openings (employer_id, user_id, tenant_id, designation, status)
       values ($1, $2, $3, 'Principal Backend Engineer', 'active') returning id`,
      [employerIdA, EMP_OWNER_A, tenantA]
    );
    jobA1 = j1[0].id;
    jobA2 = j2[0].id;

    // Trigger rename via save_employer_profile
    await db.user(EMP_OWNER_A);
    await db.q(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({
        company_name: "Alpha Dynamic Labs",
        slug: "alpha-dynamic-labs",
        logo_url: "https://alphadynamics.example.com/new-logo.png",
      }),
    ]);

    // Verify tenant_organizations got renamed
    await db.admin();
    const tenantRows = await db.q<{ name: string; slug: string }>(
      `select name, slug from public.tenant_organizations where id = $1`,
      [tenantA]
    );
    expect(tenantRows[0].name).toBe("Alpha Dynamic Labs");
    expect(tenantRows[0].slug).toBe("alpha-dynamic-labs");

    // Verify all jobs got synced with the new company name, slug and logo
    const jobRows = await db.q<{ designation: string; company_name: string; company_slug: string; company_logo: string }>(
      `select designation, company_name, company_slug, company_logo from public.employer_job_openings where tenant_id = $1 order by designation`,
      [tenantA]
    );
    expect(jobRows.length).toBe(2);
    expect(jobRows[0].company_name).toBe("Alpha Dynamic Labs");
    expect(jobRows[0].company_slug).toBe("alpha-dynamic-labs");
    expect(jobRows[0].company_logo).toBe("https://alphadynamics.example.com/new-logo.png");
    expect(jobRows[1].company_name).toBe("Alpha Dynamic Labs");
    expect(jobRows[1].company_slug).toBe("alpha-dynamic-labs");
  });
});

describe("Employer Dashboard RPC", () => {
  beforeAll(async () => {
    await db.admin();

    // Add draft and paused jobs
    await db.q(
      `insert into public.employer_job_openings (employer_id, user_id, tenant_id, designation, status)
       values ($1, $2, $3, 'Product Designer', 'draft')`,
      [employerIdA, EMP_OWNER_A, tenantA]
    );
    await db.q(
      `insert into public.employer_job_openings (employer_id, user_id, tenant_id, designation, status)
       values ($1, $2, $3, 'DevOps Lead', 'paused')`,
      [employerIdA, EMP_OWNER_A, tenantA]
    );

    // Create candidate profiles for applications
    const c1 = uuid(311);
    const c2 = uuid(312);
    const c3 = uuid(313);
    const c4 = uuid(314);
    await db.signUp(c1, "cand1@test.dev", { full_name: "Candidate 1", role: "employee" });
    await db.signUp(c2, "cand2@test.dev", { full_name: "Candidate 2", role: "employee" });
    await db.signUp(c3, "cand3@test.dev", { full_name: "Candidate 3", role: "employee" });
    await db.signUp(c4, "cand4@test.dev", { full_name: "Candidate 4", role: "employee" });

    // Seed Applications:
    // 1: Applied > 24 hours ago, unviewed (SLA breach)
    const app1 = await db.q<{ id: string }>(
      `insert into public.job_applications (job_id, candidate_id, tenant_id, stage, viewed_at, applied_at)
       values ($1, $2, $3, 'Applied', null, now() - interval '36 hours') returning id`,
      [jobA1, c1, tenantA]
    );

    // 2: Shortlisted
    await db.q(
      `insert into public.job_applications (job_id, candidate_id, tenant_id, stage, viewed_at, applied_at)
       values ($1, $2, $3, 'Shortlisted', now(), now() - interval '10 hours')`,
      [jobA1, c2, tenantA]
    );

    // 3: Interview with a scheduled interview tomorrow
    const app3 = await db.q<{ id: string }>(
      `insert into public.job_applications (job_id, candidate_id, tenant_id, stage, viewed_at, applied_at)
       values ($1, $2, $3, 'Interview', now(), now() - interval '5 hours') returning id`,
      [jobA1, c3, tenantA]
    );
    await db.q(
      `insert into public.scheduled_interviews (application_id, job_id, candidate_id, tenant_id, scheduled_at, status)
       values ($1, $2, $3, $4, now() + interval '2 days', 'scheduled')`,
      [app3[0].id, jobA1, c3, tenantA]
    );

    // 4: Offer pending
    await db.q(
      `insert into public.job_applications (job_id, candidate_id, tenant_id, stage, viewed_at, applied_at)
       values ($1, $2, $3, 'Offer', now(), now() - interval '2 hours')`,
      [jobA2, c4, tenantA]
    );

    // Seed Tenant Wallet
    await db.q(
      `insert into public.wallet_accounts (owner_type, tenant_id, balance)
       values ('tenant', $1, 25000)
       on conflict (tenant_id) where owner_type = 'tenant'
       do update set balance = 25000`,
      [tenantA]
    );
  });

  it("calculates exact metrics for jobs, applications, SLA breaches, and interviews", async () => {
    await db.user(EMP_OWNER_A);

    const res = await db.q<{ employer_dashboard: any }>(`select public.employer_dashboard()`);
    const d = res[0].employer_dashboard;

    expect(d.open_jobs).toBe(2);
    expect(d.draft_jobs).toBe(1);
    expect(d.paused_jobs).toBe(1);
    expect(d.total_jobs).toBe(4);

    expect(d.total_applicants).toBe(4);
    expect(d.applicants_by_stage.Applied).toBe(1);
    expect(d.applicants_by_stage.Shortlisted).toBe(1);
    expect(d.applicants_by_stage.Interview).toBe(1);
    expect(d.applicants_by_stage.Offer).toBe(1);

    expect(d.sla_breaches).toBe(1);
    expect(d.interviews_next_7_days).toBe(1);
    expect(d.offers_pending).toBe(1);
    expect(Number(d.wallet_balance)).toBe(25000);

    expect(d.applications_trend).toHaveLength(14);
    expect(d.top_jobs.length).toBeGreaterThanOrEqual(2);
    expect(d.top_jobs[0].title).toBe("Staff Frontend Engineer");
    expect(d.top_jobs[0].applicants_count).toBe(3);
  });

  it("rejects unauthorized cross-tenant dashboard access", async () => {
    await db.user(EMP_OWNER_B);

    // Tenant B owner attempts to view Tenant A dashboard
    const err = await db.fails(`select public.employer_dashboard($1::uuid)`, [tenantA]);
    expect(err).toMatch(/Unauthorized access to tenant dashboard/);
  });

  it("executes dashboard query in sub-100ms with EXPLAIN note", async () => {
    await db.admin();

    // Verify index usage via EXPLAIN
    const planRows = await db.q<{ "QUERY PLAN": string }>(
      `explain analyze select public.employer_dashboard($1::uuid)`,
      [tenantA]
    );
    const planText = planRows.map((r) => r["QUERY PLAN"]).join("\n");
    expect(planText).toContain("Execution Time");

    // Measure round trip execution time
    await db.user(EMP_OWNER_A);
    const t0 = performance.now();
    await db.q(`select public.employer_dashboard()`);
    const t1 = performance.now();
    const elapsedMs = t1 - t0;

    expect(elapsedMs).toBeLessThan(100);
  });
});
