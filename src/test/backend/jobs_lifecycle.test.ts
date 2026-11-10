// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const EMP_OWNER_A = uuid(401);
const EMP_OWNER_B = uuid(402);
const CANDIDATE_D = uuid(403);
const UNVERIFIED_EMP = uuid(404);
const ADMIN_USER = uuid(405);

let db: Db;
let tenantA: string;
let tenantB: string;
let unverifiedTenant: string;
let employerIdA: string;

beforeAll(async () => {
  db = await createDb();

  // 1. Verified Employer A
  await db.signUp(EMP_OWNER_A, "ownerA@apex.dev", { full_name: "Apex Owner", role: "employer", company_name: "Apex Global" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMP_OWNER_A]);
  const empARows = await db.q<{ id: string; tenant_id: string }>(`select id, tenant_id from public.employers where user_id = $1`, [EMP_OWNER_A]);
  employerIdA = empARows[0].id;
  tenantA = empARows[0].tenant_id;
  // Mark employer A as verified
  await db.q(`update public.employers set verification_status = 'verified' where id = $1`, [employerIdA]);

  // 2. Verified Employer B (for cross-tenant tests)
  await db.signUp(EMP_OWNER_B, "ownerB@zenith.dev", { full_name: "Zenith Owner", role: "employer", company_name: "Zenith Labs" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [EMP_OWNER_B]);
  const empBRows = await db.q<{ id: string; tenant_id: string }>(`select id, tenant_id from public.employers where user_id = $1`, [EMP_OWNER_B]);
  tenantB = empBRows[0].tenant_id;
  await db.q(`update public.employers set verification_status = 'verified' where id = $1`, [empBRows[0].id]);

  // 3. Unverified Employer
  await db.signUp(UNVERIFIED_EMP, "owner@unverified.dev", { full_name: "New Owner", role: "employer", company_name: "Newbie Corp" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [UNVERIFIED_EMP]);
  const unvRows = await db.q<{ id: string; tenant_id: string }>(`select id, tenant_id from public.employers where user_id = $1`, [UNVERIFIED_EMP]);
  unverifiedTenant = unvRows[0].tenant_id;
  await db.q(`update public.employers set verification_status = 'pending' where id = $1`, [unvRows[0].id]);

  // 4. Candidate user
  await db.signUp(CANDIDATE_D, "candidateD@test.dev", { full_name: "Candidate Dan", role: "employee" });
  await db.admin();
  await db.q(`update public.profiles set email_verified_at = now() where id = $1`, [CANDIDATE_D]);

  // 5. Platform Admin
  await db.signUp(ADMIN_USER, "admin@platform.dev", { full_name: "Admin Super" });
  await db.admin();
  await db.q(`insert into public.platform_admins (user_id) values ($1)`, [ADMIN_USER]);
});

describe("D2 Permanent Fix: Direct Client Writes Blocked by RLS", () => {
  it("prevents any direct client INSERT on employer_job_openings", async () => {
    await db.user(EMP_OWNER_A);
    const err = await db.fails(`
      insert into public.employer_job_openings (tenant_id, designation, status)
      values ($1, 'Direct Insert Hack', 'active')
    `, [tenantA]);
    expect(err).toMatch(/violates row-level security policy|Direct client writes/i);
  });

  it("prevents any direct client UPDATE on employer_job_openings", async () => {
    await db.user(EMP_OWNER_A);
    const err = await db.fails(`
      update public.employer_job_openings set status = 'closed'
    `);
    expect(err).toMatch(/violates row-level security policy|Direct client writes/i);
  });

  it("prevents any direct client DELETE on employer_job_openings", async () => {
    await db.user(EMP_OWNER_A);
    const err = await db.fails(`
      delete from public.employer_job_openings
    `);
    expect(err).toMatch(/violates row-level security policy|Direct client writes/i);
  });
});

describe("Job Creation & Input Validation (create_job)", () => {
  it("rejects invalid title length and salary bounds", async () => {
    await db.user(EMP_OWNER_A);

    // Title too short
    let err = await db.fails(`select public.create_job($1::jsonb)`, [
      JSON.stringify({ designation: "AI" }),
    ]);
    expect(err).toMatch(/Job title must be between 3 and 120 characters/);

    // Salary min > max
    err = await db.fails(`select public.create_job($1::jsonb)`, [
      JSON.stringify({ designation: "Staff Engineer", salary_min: 50, salary_max: 30, work_mode: "Remote" }),
    ]);
    expect(err).toMatch(/Minimum salary cannot exceed maximum salary/);

    // Non-remote without location
    err = await db.fails(`select public.create_job($1::jsonb)`, [
      JSON.stringify({ designation: "Staff Engineer", work_mode: "Onsite", job_location: "" }),
    ]);
    expect(err).toMatch(/Job location is required for non-remote roles/);
  });

  it("creates a draft job, strips HTML from description, and deduplicates skills", async () => {
    await db.user(EMP_OWNER_A);

    const res = await db.q<{ create_job: any }>(`
      select public.create_job($1::jsonb)
    `, [
      JSON.stringify({
        designation: "Principal Backend Engineer",
        job_description: "<p>We are hiring an <b>experienced</b> backend engineer.</p>",
        job_location: "Bengaluru",
        work_mode: "Hybrid",
        job_type: "Full-time",
        salary_min: 25,
        salary_max: 40,
        experience_min: 5,
        skills: ["Go", "Kubernetes", "go", "PostgreSQL"],
      }),
    ]);

    const job = res[0].create_job;
    expect(job.status).toBe("draft");
    expect(job.is_public).toBe(false);
    expect(job.job_description).toBe("We are hiring an experienced backend engineer.");
    expect(job.skills).toEqual(expect.arrayContaining(["go", "kubernetes", "postgresql"]));
    expect(job.skills).toHaveLength(3); // 'go' deduplicated
    expect(job.slug).toContain("principal-backend-engineer");

    // Verify enqueued into embedding_queue
    await db.admin();
    const queueRows = await db.q<{ entity: string; entity_id: string }>(
      `select entity, entity_id from public.embedding_queue where entity = 'job' and entity_id = $1`,
      [job.id]
    );
    expect(queueRows).toHaveLength(1);
  });

  it("prevents candidate accounts from creating jobs", async () => {
    await db.user(CANDIDATE_D);
    const err = await db.fails(`select public.create_job($1::jsonb)`, [
      JSON.stringify({ designation: "Malicious Job", work_mode: "Remote" }),
    ]);
    expect(err).toMatch(/Tenant organization not found|Unauthorized/);
  });
});

describe("Publish Gating, Automated Risk Screening & Moderation", () => {
  let cleanJobId: string;
  let scamJobId: string;
  let unverifiedJobId: string;

  beforeAll(async () => {
    await db.user(EMP_OWNER_A);

    // Clean job by verified employer
    const j1 = await db.q<{ create_job: any }>(`select public.create_job($1::jsonb)`, [
      JSON.stringify({
        designation: "Senior Cloud Architect",
        job_description: "Design fault-tolerant distributed infrastructure on AWS and GCP for enterprise customers.",
        job_location: "Hyderabad",
        work_mode: "Onsite",
        skills: ["AWS", "Terraform", "Distributed Systems"],
      }),
    ]);
    cleanJobId = j1[0].create_job.id;

    // Scam job by verified employer
    const j2 = await db.q<{ create_job: any }>(`select public.create_job($1::jsonb)`, [
      JSON.stringify({
        designation: "Data Entry Clerk",
        job_description: "Earn 5000 daily! WhatsApp only contact for registration fee details.",
        job_location: "Remote",
        work_mode: "Remote",
        skills: ["Typing", "Excel"],
      }),
    ]);
    scamJobId = j2[0].create_job.id;

    // Clean job by unverified employer
    await db.user(UNVERIFIED_EMP);
    const j3 = await db.q<{ create_job: any }>(`select public.create_job($1::jsonb)`, [
      JSON.stringify({
        designation: "Fullstack Developer",
        job_description: "Build reactive single page applications using React and Node.js.",
        job_location: "Remote",
        work_mode: "Remote",
        skills: ["React", "Node.js"],
      }),
    ]);
    unverifiedJobId = j3[0].create_job.id;
  });

  it("publishes clean job directly to 'active' for verified employer", async () => {
    await db.user(EMP_OWNER_A);
    const res = await db.q<{ publish_job: any }>(`select public.publish_job($1::uuid)`, [cleanJobId]);
    const pub = res[0].publish_job;
    expect(pub.status).toBe("active");
    expect(pub.is_public).toBe(true);
    expect(pub.published_at).toBeTruthy();
    expect(pub.closes_at).toBeTruthy();
  });

  it("auto-screens scam job and routes to 'pending_review' even for verified employer", async () => {
    await db.user(EMP_OWNER_A);
    const res = await db.q<{ publish_job: any }>(`select public.publish_job($1::uuid)`, [scamJobId]);
    const pub = res[0].publish_job;
    expect(pub.status).toBe("pending_review");
    expect(pub.is_public).toBe(false);
    expect(pub.moderation_note).toContain("automated screening");
  });

  it("routes job by unverified employer to 'pending_review'", async () => {
    await db.user(UNVERIFIED_EMP);
    const res = await db.q<{ publish_job: any }>(`select public.publish_job($1::uuid)`, [unverifiedJobId]);
    const pub = res[0].publish_job;
    expect(pub.status).toBe("pending_review");
    expect(pub.is_public).toBe(false);
    expect(pub.moderation_note).toContain("identity verification");
  });

  it("admin can moderate and approve pending job with AAL2", async () => {
    await db.user(ADMIN_USER, { aal: "aal2" });
    const res = await db.q<{ admin_moderate_job: boolean }>(
      `select public.admin_moderate_job($1::uuid, true, 'Verified via manual company check')`,
      [unverifiedJobId]
    );
    expect(res[0].admin_moderate_job).toBe(true);

    // Verify job is now active
    await db.admin();
    const rows = await db.q<{ status: string; is_public: boolean }>(
      `select status, is_public from public.employer_job_openings where id = $1`,
      [unverifiedJobId]
    );
    expect(rows[0].status).toBe("active");
    expect(rows[0].is_public).toBe(true);
  });
});

describe("Cross-Tenant Isolation & Lifecycle State Machine", () => {
  let jobA: string;

  beforeAll(async () => {
    await db.user(EMP_OWNER_A);
    const res = await db.q<{ create_job: any }>(`select public.create_job($1::jsonb)`, [
      JSON.stringify({
        designation: "Platform Security Lead",
        job_description: "Leading enterprise IAM, zero trust architecture, and SOC2 compliance initiatives.",
        job_location: "Bengaluru",
        work_mode: "Hybrid",
        skills: ["Security", "IAM", "Compliance"],
      }),
    ]);
    jobA = res[0].create_job.id;
    await db.q(`select public.publish_job($1::uuid)`, [jobA]);
  });

  it("denies cross-tenant edits or closures by Employer B", async () => {
    await db.user(EMP_OWNER_B);

    // Update attempt
    let err = await db.fails(`select public.update_job($1::uuid, $2::jsonb)`, [
      jobA, JSON.stringify({ designation: "Hijacked Title" }),
    ]);
    expect(err).toMatch(/Unauthorized: job\.edit permission required/);

    // Pause attempt
    err = await db.fails(`select public.pause_job($1::uuid)`, [jobA]);
    expect(err).toMatch(/Unauthorized: job\.close or job\.edit permission required/);

    // Close attempt
    err = await db.fails(`select public.close_job($1::uuid)`, [jobA]);
    expect(err).toMatch(/Unauthorized: job\.close permission required/);
  });

  it("enforces state machine: cannot resume an active job or pause a paused job", async () => {
    await db.user(EMP_OWNER_A);

    // Cannot resume when already active
    let err = await db.fails(`select public.resume_job($1::uuid)`, [jobA]);
    expect(err).toMatch(/Can only resume a paused job/);

    // Pause job
    await db.q(`select public.pause_job($1::uuid)`, [jobA]);

    // Cannot pause when already paused
    err = await db.fails(`select public.pause_job($1::uuid)`, [jobA]);
    expect(err).toMatch(/Can only pause an active job/);

    // Resume back to active
    await db.q(`select public.resume_job($1::uuid)`, [jobA]);
  });

  it("logs title or salary edits on active jobs to audit log", async () => {
    await db.user(EMP_OWNER_A);

    await db.q(`select public.update_job($1::uuid, $2::jsonb)`, [
      jobA,
      JSON.stringify({ designation: "Platform Security Architect", salary_min: 30, salary_max: 55 }),
    ]);

    await db.admin();
    const auditRows = await db.q<{ action: string; meta: any }>(
      `select action, meta from public.audit_log where entity = 'employer_job_openings' and entity_id = $1 and action = 'job.edit_active'`,
      [jobA]
    );
    expect(auditRows.length).toBeGreaterThanOrEqual(1);
    expect(auditRows[0].meta.title_changed).toBe(true);
  });

  it("duplicates job into a clean draft copy", async () => {
    await db.user(EMP_OWNER_A);
    const res = await db.q<{ duplicate_job: any }>(`select public.duplicate_job($1::uuid)`, [jobA]);
    const copy = res[0].duplicate_job;

    expect(copy.id).not.toBe(jobA);
    expect(copy.designation).toBe("Platform Security Architect (Copy)");
    expect(copy.status).toBe("draft");
    expect(copy.views_count).toBe(0);
    expect(copy.applications_count).toBe(0);
  });
});

describe("View Deduplication & Close Notifications", () => {
  let trackJobId: string;

  beforeAll(async () => {
    await db.user(EMP_OWNER_A);
    const res = await db.q<{ create_job: any }>(`select public.create_job($1::jsonb)`, [
      JSON.stringify({
        designation: "Site Reliability Engineer",
        job_description: "Ensuring 99.99% availability for critical infrastructure services.",
        job_location: "Bengaluru",
        work_mode: "Remote",
        skills: ["Kubernetes", "Prometheus", "Terraform"],
      }),
    ]);
    trackJobId = res[0].create_job.id;
    await db.q(`select public.publish_job($1::uuid)`, [trackJobId]);
  });

  it("deduplicates daily job views by viewer hash", async () => {
    await db.anon();

    // 1st view
    const v1 = await db.q<{ record_job_view: boolean }>(
      `select public.record_job_view($1::uuid, 'viewer_hash_123')`,
      [trackJobId]
    );
    expect(v1[0].record_job_view).toBe(true);

    // 2nd view on same day with same hash -> deduped, returns false
    const v2 = await db.q<{ record_job_view: boolean }>(
      `select public.record_job_view($1::uuid, 'viewer_hash_123')`,
      [trackJobId]
    );
    expect(v2[0].record_job_view).toBe(false);

    // Verify views_count is exactly 1
    await db.admin();
    const rows = await db.q<{ views_count: number }>(
      `select views_count from public.employer_job_openings where id = $1`,
      [trackJobId]
    );
    expect(rows[0].views_count).toBe(1);
  });

  it("closing a job notifies in-flight applicants exactly once", async () => {
    // Dan applies to the job
    await db.user(CANDIDATE_D);
    await db.q(`select public.apply_to_job($1::uuid, 'Excited to apply!')`, [trackJobId]);

    // Employer A closes the job
    await db.user(EMP_OWNER_A);
    await db.q(`select public.close_job($1::uuid, 'Filled via internal mobility')`, [trackJobId]);

    // Check notification delivered to Candidate Dan
    await db.admin();
    const notifs = await db.q<{ kind: string; title: string; body: string }>(
      `select kind, title, body from public.notifications where user_id = $1 and kind = 'job_closed'`,
      [CANDIDATE_D]
    );
    expect(notifs.length).toBe(1);
    expect(notifs[0].title).toContain("Site Reliability Engineer");
    expect(notifs[0].body).toContain("Filled via internal mobility");
  });

  it("prevents deleting a job that has existing applications", async () => {
    await db.user(EMP_OWNER_A);
    const err = await db.fails(`select public.delete_job($1::uuid)`, [trackJobId]);
    expect(err).toMatch(/Cannot delete job with existing applications\. Close the job instead\./);
  });
});

describe("Demo Jobs Hiding & Search Filtering", () => {
  it("hides demo jobs from search_jobs by default", async () => {
    await db.anon();
    const res = await db.q<{ id: string; designation: string }>(
      `select id, designation from public.search_jobs()`
    );

    // All returned jobs must NOT be demo listings
    await db.admin();
    for (const r of res) {
      const check = await db.q<{ is_demo: boolean }>(
        `select is_demo from public.employer_job_openings where id = $1`,
        [r.id]
      );
      expect(check[0]?.is_demo).toBe(false);
    }
  });

  it("returns friendly message when candidate attempts to apply to demo job", async () => {
    await db.admin();
    const demoJob = await db.q<{ id: string }>(
      `select id from public.employer_job_openings where is_demo = true limit 1`
    );

    if (demoJob.length > 0) {
      await db.user(CANDIDATE_D);
      const err = await db.fails(`select public.apply_to_job($1::uuid)`, [demoJob[0].id]);
      expect(err).toMatch(/This is a sample listing and cannot receive real applications/);
    }
  });
});

describe("Expiry Cron & Maintenance (expire_jobs)", () => {
  it("expires jobs past deadline and notifies employer", async () => {
    await db.admin();
    // Artificially backdate closes_at of an active job
    const expiredJob = await db.q<{ id: string }>(
      `insert into public.employer_job_openings (
        tenant_id, user_id, designation, job_description, job_location, work_mode,
        job_type, status, is_public, closes_at
       ) values ($1, $2, 'Expired Batch Job', 'Description', 'Remote', 'Remote', 'Full-time', 'active', true, now() - interval '1 hour')
       returning id`,
      [tenantA, EMP_OWNER_A]
    );

    const res = await db.q<{ expire_jobs: number }>(`select public.expire_jobs()`);
    expect(res[0].expire_jobs).toBeGreaterThanOrEqual(1);

    // Check status is expired
    const rows = await db.q<{ status: string }>(
      `select status from public.employer_job_openings where id = $1`,
      [expiredJob[0].id]
    );
    expect(rows[0].status).toBe("expired");

    // Check employer was notified
    const notifs = await db.q<{ title: string }>(
      `select title from public.notifications where user_id = $1 and kind = 'job_expired'`,
      [EMP_OWNER_A]
    );
    expect(notifs.length).toBeGreaterThanOrEqual(1);
  });
});
