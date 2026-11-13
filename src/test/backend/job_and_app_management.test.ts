// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

interface JobRow {
  id: string;
  designation: string;
  status: string;
  industry?: string | null;
  department?: string | null;
  city?: string | null;
  expiry_reminder_days?: number;
  qualifications?: string | null;
  benefits?: string[];
  views_count?: number;
  is_sponsored?: boolean;
  is_featured?: boolean;
}

interface DuplicateCheckResult {
  has_duplicates: boolean;
  matches: Array<{ id: string; designation: string; similarity_pct: number }>;
}

interface SalaryBenchmarkResult {
  min_lpa: number;
  median_lpa: number;
  max_lpa: number;
  sample_size: number;
}

interface CompetitorResult {
  competing_openings: number;
  active_employers: number;
  top_skills: string[];
}

interface AiAssistResult {
  job_description: string;
  suggested_skills: string[];
}

interface ApplicationListResult {
  total: number;
  buckets: Record<string, number>;
  items: Array<{ id: string; stage: string; is_hired?: boolean }>;
}

interface RecruiterRow {
  user_id: string;
  name: string;
  role: string;
}

interface ComparedRow {
  id: string;
  is_hired: boolean;
  assigned_recruiter_name: string | null;
}

const OWNER_A = uuid(811);
const RECRUITER_A = uuid(812);
const OWNER_B = uuid(813);
const CAND_1 = uuid(814);
const CAND_2 = uuid(815);
const CAND_3 = uuid(816);

let db: Db;
let tenantA: string;
let jobMain: string;
let jobScheduled: string;
let app1: string;
let app2: string;
let app3: string;

const sess = async (id: string) => {
  await db.user(id);
};

beforeAll(async () => {
  db = await createDb();

  await db.signUp(OWNER_A, "owner@orbit.dev", {
    full_name: "Orbit Owner",
    role: "employer",
    company_name: "Orbit Cloud",
  });
  await db.signUp(OWNER_B, "owner@nova.dev", {
    full_name: "Nova Owner",
    role: "employer",
    company_name: "Nova Systems",
  });

  await db.admin();
  const tenants = await db.q<{ user_id: string; tenant_id: string }>(
    `select user_id, tenant_id from public.employers`,
  );
  tenantA = tenants.find((t) => t.user_id === OWNER_A)!.tenant_id;
  await db.q(`update public.employers set verification_status = 'verified'`);

  await db.signUp(RECRUITER_A, "ananya@orbit.dev", {
    full_name: "Ananya Rao",
    role: "employee",
  });
  await db.admin();
  await db.q(
    `insert into public.tenant_memberships (tenant_id, user_id, role) values ($1, $2, 'recruiter')`,
    [tenantA, RECRUITER_A],
  );

  for (const uid of [OWNER_A, OWNER_B]) {
    await sess(uid);
    await db.q(`select public.save_employer_profile($1::jsonb)`, [
      JSON.stringify({
        company_name: uid === OWNER_A ? "Orbit Cloud" : "Nova Systems",
        industry: "Software & SaaS",
        num_employees: "51-200",
        hq_city: "Bengaluru",
        official_email: uid === OWNER_A ? "hr@orbit.dev" : "hr@nova.dev",
        description: "Enterprise cloud engineering and AI talent intelligence platform.",
      }),
    ]);
  }

  for (const [id, email, name, exp, skills] of [
    [CAND_1, "aarav@cand.dev", "Aarav Mehta", 4, ["React", "TypeScript", "Node.js"]],
    [CAND_2, "diya@cand.dev", "Diya Nair", 2, ["React", "CSS"]],
    [CAND_3, "kabir@cand.dev", "Kabir Sharma", 6, ["React", "TypeScript", "AWS"]],
  ] as const) {
    await db.signUp(id, email, { full_name: name, role: "employee" });
    await db.admin();
    await db.q(
      `update public.profiles
          set onboarding_completed = true,
              profile_visibility = 'public',
              verification_status = 'verified',
              professional_headline = 'Frontend Engineer',
              years_of_experience = $2,
              city = 'Bengaluru',
              open_to_work = true
        where id = $1`,
      [id, exp],
    );
    for (const sk of skills) {
      await db.q(`insert into public.skills (user_id, skill_name) values ($1, $2)`, [id, sk]);
    }
  }
});

describe("2. Job Management backend RPCs", () => {
  it("creates, edits, duplicates, and lists jobs with categories, details, expiry, and conversion metrics", async () => {
    await sess(OWNER_A);
    const [{ create_job: created }] = await db.q<{ create_job: JobRow }>(
      `select public.create_job($1::jsonb)`,
      [
        JSON.stringify({
          designation: "Senior React Developer",
          job_description: "Architect modern React and TypeScript interfaces for our platform.",
          qualifications: "B.Tech in Computer Science",
          responsibilities: "Own frontend architecture and mentor engineers",
          requirements: "4+ years React & TypeScript",
          benefits: ["Health Insurance", "ESOPs"],
          industry: "Software & SaaS",
          department: "Engineering",
          job_function: "Frontend Engineering",
          city: "Bengaluru",
          country: "India",
          job_location: "Bengaluru, India",
          work_mode: "Hybrid",
          job_type: "Full-time",
          salary_min: 20,
          salary_max: 34,
          experience_min: 3,
          skills: ["React", "TypeScript", "Node.js"],
          auto_close_on_expiry: true,
          expiry_reminder_days: 7,
        }),
      ],
    );
    jobMain = created.id;
    expect(created.industry).toBe("Software & SaaS");
    expect(created.department).toBe("Engineering");
    expect(created.city).toBe("Bengaluru");
    expect(created.expiry_reminder_days).toBe(7);

    await db.q(`select public.publish_job($1)`, [jobMain]);
    await db.admin();
    await db.q(`update public.employer_job_openings set views_count = 40 where id = $1`, [jobMain]);

    await sess(OWNER_A);
    const full = (await db.q<{ j: JobRow }>(`select public.get_job_for_edit($1) j`, [jobMain]))[0].j;
    expect(full.qualifications).toBe("B.Tech in Computer Science");
    expect(full.benefits).toEqual(expect.arrayContaining(["Health Insurance", "ESOPs"]));

    const rows = await db.q<JobRow>(`select * from public.list_my_jobs(null, null, null, 20)`);
    const row = rows.find((r) => r.id === jobMain);
    expect(row?.industry).toBe("Software & SaaS");
    expect(row?.views_count).toBe(40);
  });

  it("supports Part-time job type, scheduling publication, unpublishing scheduled jobs, promoting, closing, and renewing", async () => {
    await sess(OWNER_A);
    const [{ create_job: draft }] = await db.q<{ create_job: JobRow }>(
      `select public.create_job($1::jsonb)`,
      [
        JSON.stringify({
          designation: "Platform DevOps Engineer",
          job_description: "Manage multi-region Kubernetes clusters and Terraform pipelines.",
          skills: ["AWS", "Kubernetes"],
          work_mode: "Remote",
          job_type: "Part-time",
        }),
      ],
    );
    jobScheduled = draft.id;

    const futureIso = new Date(Date.now() + 86400000 * 2).toISOString();
    const [{ schedule_job_publish: sched }] = await db.q<{ schedule_job_publish: JobRow }>(
      `select public.schedule_job_publish($1, $2::timestamptz)`,
      [jobScheduled, futureIso],
    );
    expect(sched.status).toBe("scheduled");

    // Unpublish scheduled job via pause_job, then schedule again in the near past via admin to test cron publisher
    const [{ pause_job: paused }] = await db.q<{ pause_job: JobRow }>(
      `select public.pause_job($1)`,
      [jobScheduled],
    );
    expect(paused.status).toBe("paused");

    await db.q(`select public.schedule_job_publish($1, $2::timestamptz)`, [
      jobScheduled,
      new Date(Date.now() + 60000).toISOString(),
    ]);
    await db.admin();
    await db.q(
      `update public.employer_job_openings set scheduled_publish_at = now() - interval '1 minute' where id = $1`,
      [jobScheduled],
    );
    const [{ publish_scheduled_jobs: publishedCount }] = await db.q<{ publish_scheduled_jobs: number }>(
      `select public.publish_scheduled_jobs()`,
    );
    expect(publishedCount).toBe(1);

    await sess(OWNER_A);
    // Promote jobMain as sponsored and verify search_jobs prioritizes it
    const [{ promote_job: promo }] = await db.q<{ promote_job: JobRow }>(
      `select public.promote_job($1, 'sponsored', 30)`,
      [jobMain],
    );
    expect(promo.is_sponsored).toBe(true);
    expect(promo.is_featured).toBe(true);

    const search = await db.q<{ id: string }>(`select * from public.search_jobs()`);
    expect(search[0].id).toBe(jobMain);

    // Close and renew jobScheduled
    await db.q(`select public.close_job($1, 'Filled')`, [jobScheduled]);
    const [{ renew_job: renewed }] = await db.q<{ renew_job: JobRow }>(
      `select public.renew_job($1, 45)`,
      [jobScheduled],
    );
    expect(renewed.status).toBe("active");

    // Cross-tenant protection
    await sess(OWNER_B);
    expect(await db.fails(`select public.promote_job($1, 'featured', 30)`, [jobMain])).toMatch(/Unauthorized/);
    expect(await db.fails(`select public.renew_job($1, 30)`, [jobMain])).toMatch(/Unauthorized/);
  });

  it("provides duplicate job detection, salary benchmarks, competitor analysis, and AI JD assist", async () => {
    await sess(OWNER_A);
    const [{ check_duplicate_jobs: dup }] = await db.q<{ check_duplicate_jobs: DuplicateCheckResult }>(
      `select public.check_duplicate_jobs('Senior React Developer')`,
    );
    expect(dup.has_duplicates).toBe(true);
    expect(dup.matches[0].id).toBe(jobMain);

    const [{ get_salary_benchmark: bench }] = await db.q<{ get_salary_benchmark: SalaryBenchmarkResult }>(
      `select public.get_salary_benchmark('Senior React Developer', 'Bengaluru', 3)`,
    );
    expect(bench.max_lpa).toBeGreaterThanOrEqual(bench.min_lpa);
    expect(bench.median_lpa).toBeGreaterThanOrEqual(bench.min_lpa);

    const [{ get_competitor_job_analysis: comp }] = await db.q<{ get_competitor_job_analysis: CompetitorResult }>(
      `select public.get_competitor_job_analysis('React Developer', array['React','TypeScript'], 'Bengaluru')`,
    );
    expect(comp.competing_openings).toBeGreaterThanOrEqual(1);

    const [{ generate_job_ai_assist: ai }] = await db.q<{ generate_job_ai_assist: AiAssistResult }>(
      `select public.generate_job_ai_assist($1::jsonb)`,
      [
        JSON.stringify({
          designation: "Senior React Developer",
          industry: "Software",
          department: "Engineering",
          experience_min: 4,
          work_mode: "Hybrid",
          job_type: "Full-time",
          job_location: "Bengaluru",
          skills: ["React"],
        }),
      ],
    );
    expect(ai.job_description.length).toBeGreaterThan(40);
    expect(ai.suggested_skills).toContain("React");
  });
});

describe("3. Job Applications Management backend RPCs", () => {
  beforeAll(async () => {
    await sess(CAND_1);
    app1 = (await db.q<{ id: string }>(`select * from public.apply_to_job($1, 'Excited to join!')`, [jobMain]))[0].id;
    await sess(CAND_2);
    app2 = (await db.q<{ id: string }>(`select * from public.apply_to_job($1, 'Frontend enthusiast')`, [jobMain]))[0].id;
    await sess(CAND_3);
    app3 = (await db.q<{ id: string }>(`select * from public.apply_to_job($1, 'Staff React architect')`, [jobMain]))[0].id;
  });

  it("returns all 11 application buckets, supports bulk shortlist/reject, recruiter assignment, workflow flags, hiring, comparison, and export", async () => {
    await sess(OWNER_A);

    // Initial bucket check
    let list = (await db.q<{ r: ApplicationListResult }>(`select public.list_employer_applications() r`))[0].r;
    expect(list.buckets.all).toBe(3);
    expect(list.buckets.new).toBe(3);

    // Bulk shortlist app1 & app3, bulk reject app2
    const [{ bulk_change_application_stage: shortlisted }] = await db.q<{
      bulk_change_application_stage: { updated: number; stage: string };
    }>(
      `select public.bulk_change_application_stage($1::uuid[], 'Shortlisted', 'Strong React fit')`,
      [`{${app1},${app3}}`],
    );
    expect(shortlisted.updated).toBe(2);

    await db.q(
      `select public.bulk_change_application_stage($1::uuid[], 'Rejected', 'Experience gap')`,
      [`{${app2}}`],
    );

    // Assign recruiter to app1 & app3
    const recruiters = (await db.q<{ r: RecruiterRow[] }>(`select public.list_tenant_recruiters() r`))[0].r;
    expect(recruiters.some((m) => m.user_id === RECRUITER_A)).toBe(true);

    await db.q(
      `select public.assign_application_recruiter($1::uuid[], $2, 'Ananya Rao')`,
      [`{${app1},${app3}}`, RECRUITER_A],
    );

    // Set workflow flags: app1 -> assessment pending, app3 -> assessment completed; app1 -> Offer, app3 -> Hired
    await db.q(
      `select public.set_application_workflow_flags($1::uuid[], true, 'pending')`,
      [`{${app1}}`],
    );
    await db.q(
      `select public.set_application_workflow_flags($1::uuid[], true, 'completed')`,
      [`{${app3}}`],
    );
    await db.q(`select public.change_application_stage($1, 'Offer', 'Extending offer')`, [app1]);
    await db.q(`select public.mark_application_hired($1, (current_date + 14), 'Great hire')`, [app3]);

    // Verify all bucket counts reflect exact lifecycle states
    list = (await db.q<{ r: ApplicationListResult }>(`select public.list_employer_applications() r`))[0].r;
    expect(list.buckets).toMatchObject({
      all: 3,
      rejected: 1,
      assessment_pending: 1,
      assessment_completed: 1,
      offer_released: 1, // app1 has offer released and is not yet hired
      hired: 1, // app3 is hired
    });

    // Filter by 'hired' bucket
    const hiredOnly = (
      await db.q<{ r: ApplicationListResult }>(
        `select public.list_employer_applications(null, null, null, 50, 0, 'recent', 'hired') r`,
      )
    )[0].r;
    expect(hiredOnly.items.map((i) => i.id)).toEqual([app3]);

    // Candidate comparison
    const compared = (
      await db.q<{ c: ComparedRow[] }>(`select public.compare_applications($1::uuid[]) c`, [`{${app1},${app3}}`])
    )[0].c;
    expect(compared).toHaveLength(2);
    expect(compared.find((x) => x.id === app3)?.is_hired).toBe(true);
    expect(compared.find((x) => x.id === app1)?.assigned_recruiter_name).toBe("Ananya Rao");

    // Export application data
    const exported = (
      await db.q<{ e: Array<{ application_id: string }> }>(
        `select public.export_employer_applications($1, null, null) e`,
        [jobMain],
      )
    )[0].e;
    expect(exported).toHaveLength(3);

    // Cross-tenant isolation: compare returns 0 rows, mutating RPCs throw Unauthorized
    await sess(OWNER_B);
    const crossCompare = (
      await db.q<{ c: ComparedRow[] }>(`select public.compare_applications($1::uuid[]) c`, [`{${app1},${app3}}`])
    )[0].c;
    expect(crossCompare).toEqual([]);
    expect(
      await db.fails(`select public.assign_application_recruiter($1::uuid[], null, 'Intruder')`, [`{${app1}}`]),
    ).toMatch(/Unauthorized/);
    expect(await db.fails(`select public.mark_application_hired($1)`, [app1])).toMatch(/Unauthorized/);
  });
});
