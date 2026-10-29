// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const A = uuid(11), B = uuid(12), ADMIN = uuid(15);
let db: Db;
let frontendJob: string;

beforeAll(async () => {
  db = await createDb();
  await db.signUp(A, "a@test.dev", { full_name: "Asha Candidate", role: "employee" });
  await db.signUp(B, "b@test.dev", { full_name: "Bala Candidate" });
  await db.signUp(ADMIN, "admin@test.dev", {});
  await db.admin();
  await db.q(`insert into public.platform_admins (user_id) values ($1)`, [ADMIN]);
  frontendJob = (await db.q(`select id from public.employer_job_openings where designation = 'Frontend Developer'`))[0].id;
}, 120_000);

describe("profile save / load", () => {
  const payload = {
    profile: {
      full_name: "Asha Rao", phone: "+91 98765 43210", headline: "Frontend engineer", about: "I build fast interfaces.", city: "Chennai",
      years_of_experience: 2, open_to_work: true, linkedin_url: "https://linkedin.com/in/asha", portfolio_slug: "asha-rao",
      preferred_locations: ["Chennai", "Remote"], profile_visibility: "public",
    },
    skills: [{ name: "React", level: "Advanced" }, { name: "TypeScript", level: "intermediate" }, { name: "CSS" }],
    experiences: [{ title: "Frontend Dev", company: "Zoho", start: "2023-01-01", end: "Present", description: "Built dashboards" }],
    educations: [{ degree: "B.E.", institution: "Anna University", year: "2022" }],
    certifications: ["AWS Cloud Practitioner"],
    projects: [{ title: "Portfolio", description: "Site", url: "https://asha.dev", tools: "React, Vite", impact: "10k visits" }],
    languages: [{ name: "English", level: "Fluent" }],
    shell_state: { pw: "secret", wal: { bal: 99999 }, ver: { id: true }, role: "employer", saved: [1], head: "kept", rs: { tpl: "classic" } },
  };

  it("round-trips every section and recomputes completion", async () => {
    await db.user(A);
    const [{ save_candidate_profile: out }] = await db.q(`select public.save_candidate_profile($1::jsonb) as save_candidate_profile`, [JSON.stringify(payload)]);
    expect(out.profile).toMatchObject({ full_name: "Asha Rao", headline: "Frontend engineer", city: "Chennai", open_to_work: true });
    expect(out.skills.map((s: any) => s.name).sort()).toEqual(["CSS", "React", "TypeScript"]);
    expect(out.skills.find((s: any) => s.name === "React").level).toBe("advanced");
    expect(out.experiences[0]).toMatchObject({ title: "Frontend Dev", company: "Zoho", end: "Present" });
    expect(out.educations[0]).toMatchObject({ institution: "Anna University", year: "2022" });
    expect(out.projects[0].tools).toBe("React, Vite");
    expect(out.languages[0]).toEqual({ name: "English", level: "Fluent" });
    expect(out.profile.profile_completion).toBeGreaterThanOrEqual(80);
  });

  it("never persists secrets or self-asserted verification from shell state", async () => {
    await db.user(A);
    const [{ load_candidate_profile: out }] = await db.q(`select public.load_candidate_profile() as load_candidate_profile`);
    expect(out.shell_state).toMatchObject({ head: "kept", rs: { tpl: "classic" } });
    for (const key of ["pw", "wal", "ver", "role", "saved"]) expect(out.shell_state).not.toHaveProperty(key);
    expect(out.verification.profile_status).toBe("unverified");
  });

  it("keeps server-granted verification when the client re-saves skills", async () => {
    await db.admin();
    await db.q(`update public.skills set is_verified = true where user_id = $1 and skill_name = 'React'`, [A]);
    await db.user(A);
    const [{ r }] = await db.q(`select public.save_candidate_profile($1::jsonb) as r`, [JSON.stringify({ skills: [{ name: "react" }, { name: "Go" }] })]);
    const react = r.skills.find((s: any) => s.name.toLowerCase() === "react");
    expect(react.verified).toBe(true);
    expect(r.skills.map((s: any) => s.name)).not.toContain("TypeScript");
  });

  it("rejects hostile or malformed input", async () => {
    await db.user(A);
    expect(await db.fails(`select public.save_candidate_profile($1::jsonb)`, [JSON.stringify({ profile: { portfolio_url: "javascript:alert(1)" } })])).toBeTruthy();
    expect(await db.fails(`select public.save_candidate_profile($1::jsonb)`, [JSON.stringify({ profile: { portfolio_slug: "Bad Slug!" } })])).toBeTruthy();
    expect(await db.fails(`select public.save_candidate_profile($1::jsonb)`, [JSON.stringify({ shell_state: { blob: "x".repeat(300000) } })])).toBeTruthy();
    // project links that are not http(s) are dropped rather than stored
    const [{ r }] = await db.q(`select public.save_candidate_profile($1::jsonb) as r`, [JSON.stringify({ projects: [{ title: "P", url: "javascript:x" }] })]);
    expect(r.projects[0].url).toBeNull();
  });

  it("does not let one user read or overwrite another's profile", async () => {
    await db.user(B);
    const [{ r }] = await db.q(`select public.load_candidate_profile() as r`);
    expect(r.profile.full_name).toBe("Bala Candidate");
    expect(r.skills).toEqual([]);
  });
});

describe("public portfolio", () => {
  it("serves a public portfolio by slug with limited fields and counts one view per day", async () => {
    await db.anon();
    const [{ p }] = await db.q(`select public.get_public_portfolio('ASHA-RAO') as p`);
    expect(p.name).toBe("Asha Rao");
    expect(p).not.toHaveProperty("email");
    expect(p).not.toHaveProperty("phone");
    await db.q(`select public.get_public_portfolio('asha-rao')`);
    await db.user(A);
    const [{ a }] = await db.q(`select public.candidate_analytics() as a`);
    expect(Number(a.profile_views_total)).toBe(1);
  });

  it("hides private profiles and rejects duplicate slugs", async () => {
    await db.user(A);
    await db.q(`select public.save_candidate_profile($1::jsonb)`, [JSON.stringify({ profile: { profile_visibility: "private" } })]);
    await db.anon();
    expect((await db.q(`select public.get_public_portfolio('asha-rao') as p`))[0].p).toBeNull();
    await db.user(B);
    expect(await db.fails(`select public.save_candidate_profile($1::jsonb)`, [JSON.stringify({ profile: { portfolio_slug: "asha-rao" } })])).toMatch(/unique|duplicate/i);
  });
});

describe("browse jobs", () => {
  it("searches and filters for anonymous visitors", async () => {
    await db.anon();
    const all = await db.q(`select * from public.search_jobs()`);
    expect(all.length).toBeGreaterThan(10);
    expect(all[0].match_score).toBeNull();
    const react = await db.q(`select designation from public.search_jobs('react')`);
    expect(react.map((r) => r.designation)).toContain("Frontend Developer");
    const remote = await db.q(`select * from public.search_jobs(null, 'Remote')`);
    expect(remote.every((r) => r.work_mode === "Remote")).toBe(true);
    const fresher = await db.q(`select * from public.search_jobs(null, null, null, 0)`);
    expect(fresher.every((r) => Number(r.experience_min) === 0)).toBe(true);
    const page = await db.q(`select count(*) over() as n, total_count from public.search_jobs(null, null, null, null, null, null, null, 'recent', 5, 5) limit 1`);
    expect(Number(page[0].n)).toBe(5);
    expect(Number(page[0].total_count)).toBeGreaterThan(5);
  });

  it("is safe against SQL-injection style input", async () => {
    await db.anon();
    const rows = await db.q(`select * from public.search_jobs($1)`, [`'; drop table public.profiles; --`]);
    expect(rows).toEqual([]);
    await db.admin();
    expect((await db.q(`select count(*)::int n from public.profiles`))[0].n).toBeGreaterThan(0);
  });

  it("ranks by match for signed-in candidates", async () => {
    await db.user(A);
    await db.q(`select public.save_candidate_profile($1::jsonb)`, [JSON.stringify({ skills: [{ name: "React" }, { name: "TypeScript" }, { name: "CSS" }] })]);
    const rows = await db.q(`select designation, match_score from public.search_jobs(null, null, null, null, null, null, null, 'match', 3)`);
    expect(rows[0].designation).toBe("Frontend Developer");
    expect(Number(rows[0].match_score)).toBeGreaterThanOrEqual(Number(rows[1].match_score));
  });
});

describe("applications, saved jobs, notifications", () => {
  let appId: string;
  it("applies once, snapshots the profile and records history", async () => {
    await db.user(A);
    const [a1] = await db.q(`select * from public.apply_to_job($1, 'Keen to join')`, [frontendJob]);
    const [a2] = await db.q(`select * from public.apply_to_job($1, 'again')`, [frontendJob]);
    appId = a1.id;
    expect(a2.id).toBe(a1.id);
    expect(Number(a1.match_score)).toBeGreaterThan(0);
    expect(a1.profile_snapshot.skills).toContain("React");
    expect((await db.q(`select to_stage from public.application_stage_history where application_id = $1`, [appId])).map((r) => r.to_stage)).toEqual(["Applied"]);
    expect(await db.fails(`select * from public.apply_to_job($1, $2)`, [frontendJob, "x".repeat(6000)])).toBeTruthy();
    expect(await db.fails(`select * from public.apply_to_job($1)`, [uuid(404)])).toMatch(/no longer accepting/);
  });

  it("saves, unsaves and withdraws", async () => {
    await db.user(A);
    expect((await db.q(`select public.toggle_saved_job($1) as s`, [frontendJob]))[0].s).toBe(true);
    expect((await db.q(`select public.toggle_saved_job($1) as s`, [frontendJob]))[0].s).toBe(false);
    expect((await db.q(`select stage from public.withdraw_application($1)`, [appId]))[0].stage).toBe("Withdrawn");
    expect(await db.fails(`select * from public.withdraw_application($1)`, [appId])).toMatch(/can no longer be withdrawn/);
    await db.user(B);
    expect(await db.fails(`select * from public.withdraw_application($1)`, [appId])).toBeTruthy();
  });

  it("reads and marks notifications read, only for the owner", async () => {
    await db.admin();
    await db.q(`select public.push_notification($1, 'general', 'Hello', 'Body')`, [A]);
    await db.user(A);
    expect((await db.q(`select count(*)::int n from public.notifications where read_at is null`))[0].n).toBeGreaterThan(0);
    await db.q(`select public.mark_notifications_read()`);
    expect((await db.q(`select count(*)::int n from public.notifications where read_at is null`))[0].n).toBe(0);
    await db.user(B);
    await db.q(`select public.mark_notifications_read()`);
    await db.user(A);
    expect((await db.q(`select count(*)::int n from public.notifications`))[0].n).toBeGreaterThan(0);
  });
});

describe("job alerts", () => {
  it("collects alerts from anonymous and signed-in users and queues matches", async () => {
    await db.anon();
    const [{ id }] = await db.q(`select public.subscribe_job_alerts('visitor@test.dev', array['rust'], null, null) as id`);
    expect(id).toBeTruthy();
    expect(await db.fails(`select public.subscribe_job_alerts('not-an-email')`)).toBeTruthy();
    await db.user(A);
    await db.q(`select public.subscribe_job_alerts('a@test.dev', array['rust engineer'], null, null)`);
    await db.admin();
    await db.q(`insert into public.employer_job_openings (designation, company_name, job_type, work_mode, skills, source)
      values ('Rust Engineer', 'Ferrous', 'Full-time', 'Remote', array['Rust'], 'platform')`);
    expect((await db.q(`select count(*)::int n from public.job_alert_queue`))[0].n).toBe(2);
    expect((await db.q(`select count(*)::int n from public.notifications where user_id = $1 and kind = 'job_alert'`, [A]))[0].n).toBe(1);
    // Tokens are private: anonymous visitors cannot list them, but the emailed link works.
    await db.anon();
    expect((await db.q(`select count(*)::int n from public.job_alerts`))[0].n).toBe(0);
    await db.admin();
    const [{ unsubscribe_token: token }] = await db.q(`select unsubscribe_token from public.job_alerts where email = 'visitor@test.dev'`);
    await db.anon();
    expect((await db.q(`select public.unsubscribe_job_alert($1) as ok`, [token]))[0].ok).toBe(true);
    expect((await db.q(`select public.unsubscribe_job_alert('bogus') as ok`))[0].ok).toBe(false);
  });

  it("rate limits alert sign-ups", async () => {
    await db.anon();
    let msg = "";
    for (let i = 0; i < 8; i++) msg = (await db.fails(`select public.subscribe_job_alerts('spam@test.dev', array['k${i}'])`)) ?? msg;
    expect(msg).toMatch(/Too many requests/);
  });
});

describe("freelancing, support, analytics", () => {
  it("lists open gigs and takes one proposal per gig within a sane bid", async () => {
    await db.anon();
    const gigs = await db.q(`select id, budget_min, budget_max from public.freelance_gigs`);
    expect(gigs.length).toBeGreaterThanOrEqual(6);
    await db.user(A);
    const g = gigs[0];
    expect(await db.fails(`select * from public.submit_gig_proposal($1, 'I can do this well', 1)`, [g.id])).toMatch(/reasonable range/);
    const [p] = await db.q(`select * from public.submit_gig_proposal($1, 'I can do this well', $2)`, [g.id, g.budget_min]);
    expect(p.status).toBe("submitted");
    expect(await db.fails(`insert into public.gig_proposals (gig_id, user_id, cover_note, bid_amount) values ($1, $2, 'direct insert here', 1)`, [g.id, A])).toBeTruthy();
    await db.user(B);
    expect((await db.q(`select count(*)::int n from public.gig_proposals`))[0].n).toBe(0);
  });

  it("handles support tickets only through the rate-limited RPCs", async () => {
    await db.user(A);
    expect(await db.fails(`insert into public.support_tickets (user_id, subject) values ($1, 'direct')`, [A])).toBeTruthy();
    const [t] = await db.q(`select * from public.create_support_ticket('billing', 'Payment help', 'My top-up is pending')`);
    await db.q(`select * from public.reply_support_ticket($1, 'Any update?')`, [t.id]);
    expect((await db.q(`select count(*)::int n from public.support_messages where ticket_id = $1`, [t.id]))[0].n).toBe(2);
    expect(await db.fails(`select * from public.create_support_ticket('x', 'ab', 'short subject')`)).toBeTruthy();
    await db.user(B);
    expect((await db.q(`select count(*)::int n from public.support_tickets`))[0].n).toBe(0);
    expect(await db.fails(`select * from public.reply_support_ticket($1, 'intruder')`, [t.id])).toMatch(/Ticket not found/);
  });

  it("returns analytics and dashboard counters for the caller only", async () => {
    await db.user(A);
    const [{ a }] = await db.q(`select public.candidate_analytics() as a`);
    expect(Number(a.applications_total)).toBe(0); // the only application was withdrawn
    const [{ d }] = await db.q(`select public.candidate_dashboard() as d`);
    expect(d).toHaveProperty("applications");
    await db.user(B);
    expect(Number((await db.q(`select public.candidate_analytics() as a`))[0].a.profile_views_total)).toBe(0);
  });
});
