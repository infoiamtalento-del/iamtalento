// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const A = uuid(31), B = uuid(32);
let db: Db;
let domain: string;
let journey: string;

beforeAll(async () => {
  db = await createDb();
  await db.signUp(A, "a@test.dev", { full_name: "Asha" });
  await db.signUp(B, "b@test.dev", { full_name: "Bala" });
  await db.admin();
  domain = (await db.q(`select id from public.assessments_catalog where slug = 'data-analytics-sql-python'`))[0].id;
}, 120_000);

/** Reads the answer key as the service role, then answers as the candidate. */
async function takeTest(user: string, assessmentId: string, mode: "right" | "wrong" = "right") {
  await db.user(user);
  const [att] = await db.q(`select * from public.start_assessment_attempt($1, $2)`, [journey, assessmentId]);
  const qs = await db.q(`select * from public.get_attempt_questions($1)`, [att.id]);
  for (const q of qs) {
    await db.admin();
    const [{ correct }] = await db.q(`select correct from public.question_answer_keys where question_id = $1`, [q.question_id]);
    const right = correct.selected as number;
    const pick = mode === "right" ? right : q.options.find((o: any) => o.id !== right).id;
    await db.user(user);
    await db.q(`select public.save_attempt_response($1, $2, $3::jsonb, 800)`, [att.id, q.question_id, JSON.stringify({ selected: pick })]);
  }
  await db.user(user);
  return { att, qs, result: (await db.q(`select * from public.submit_assessment_attempt($1)`, [att.id]))[0] };
}

describe("journey rules", () => {
  it("requires a paid, unused order for a paid domain test", async () => {
    await db.user(A);
    expect(await db.fails(`select * from public.start_journey($1)`, [domain])).toMatch(/Payment required/);
    const [o] = await db.q(`select * from public.create_payment_order('assessment_journey', $1, null, 'Karnataka', null, 'j1', 'razorpay')`, [domain]);
    expect(await db.fails(`select * from public.start_journey($1, $2)`, [domain, o.id])).toMatch(/Payment required/); // not paid yet
    await db.admin();
    await db.q(`select public.fulfill_payment_order($1, 'pay_j1')`, [o.id]);
    await db.user(A);
    const [j] = await db.q(`select * from public.start_journey($1, $2)`, [domain, o.id]);
    journey = j.id;
    expect(j.status).toBe("in_progress");
    expect((await db.q(`select * from public.start_journey($1)`, [domain]))[0].id).toBe(journey); // resumes
    await db.user(B);
    expect(await db.fails(`select * from public.start_journey($1, $2)`, [domain, o.id])).toMatch(/Payment required/); // order is not B's
  });

  it("unlocks the 4 core tests in order and the domain test last", async () => {
    await db.user(A);
    const steps = await db.q(`select * from public.get_journey_progress($1)`, [journey]);
    expect(steps.map((s) => [s.step_no, s.kind, s.is_unlocked])).toEqual([
      [1, "core", true], [2, "core", false], [3, "core", false], [4, "core", false], [5, "domain", false]]);
    expect(await db.fails(`select * from public.start_assessment_attempt($1, $2)`, [journey, steps[1].assessment_id])).toMatch(/Complete the earlier tests/);
    expect(await db.fails(`select * from public.start_assessment_attempt($1, $2)`, [journey, domain])).toMatch(/Complete the earlier tests/);
  });

  it("does not let another user touch the journey", async () => {
    await db.user(B);
    expect(await db.fails(`select * from public.get_journey_progress($1)`, [journey])).toMatch(/Journey not found/);
    expect(await db.fails(`select * from public.generate_cir_report($1)`, [journey])).toMatch(/Journey not found/);
  });
});

describe("attempts", () => {
  it("serves questions without answers and grades on the server", async () => {
    await db.user(A);
    const steps = await db.q(`select * from public.get_journey_progress($1)`, [journey]);
    const { att, qs, result } = await takeTest(A, steps[0].assessment_id, "right");
    expect(JSON.stringify(qs)).not.toMatch(/correct|explanation/);
    expect(qs.every((q: any) => q.options.length === 4)).toBe(true);
    expect(Number(result.percentage)).toBe(100);
    expect(result.status).toBe("graded");
    expect(att.id).toBe(result.id);
  });

  it("cannot be read, answered or submitted by another user (IDOR)", async () => {
    await db.user(A);
    const steps = await db.q(`select * from public.get_journey_progress($1)`, [journey]);
    const [att] = await db.q(`select * from public.start_assessment_attempt($1, $2)`, [journey, steps[1].assessment_id]);
    const [q] = await db.q(`select question_id from public.get_attempt_questions($1)`, [att.id]);
    await db.user(B);
    expect(await db.fails(`select * from public.get_attempt_questions($1)`, [att.id])).toMatch(/Attempt not found/);
    expect(await db.fails(`select public.save_attempt_response($1, $2, '{"selected":1}'::jsonb)`, [att.id, q.question_id])).toMatch(/Attempt not found/);
    expect(await db.fails(`select * from public.submit_assessment_attempt($1)`, [att.id])).toMatch(/Attempt not found/);
    expect((await db.q(`select count(*)::int n from public.assessment_attempts`))[0].n).toBe(0);
    expect((await db.q(`select count(*)::int n from public.attempt_item_responses`))[0].n).toBe(0);
  });

  it("rejects oversized answers and questions from other attempts", async () => {
    await db.user(A);
    const [att] = await db.q(`select * from public.assessment_attempts where status = 'in_progress'`);
    const [q] = await db.q(`select question_id from public.get_attempt_questions($1)`, [att.id]);
    expect(await db.fails(`select public.save_attempt_response($1, $2, $3::jsonb)`, [att.id, q.question_id, JSON.stringify({ text: "x".repeat(60000) })])).toMatch(/too large/);
    await db.admin();
    const foreign = (await db.q(`select id from public.question_bank where assessment_id = $1 limit 1`, [domain]))[0].id;
    await db.user(A);
    expect(await db.fails(`select public.save_attempt_response($1, $2, '{"selected":1}'::jsonb)`, [att.id, foreign])).toMatch(/not part of this attempt/);
  });

  it("enforces the server deadline but still grades autosaved answers", async () => {
    await db.user(A);
    const [att] = await db.q(`select * from public.assessment_attempts where status = 'in_progress'`);
    const [q] = await db.q(`select question_id from public.get_attempt_questions($1)`, [att.id]);
    await db.q(`select public.save_attempt_response($1, $2, '{"selected":0}'::jsonb)`, [att.id, q.question_id]);
    await db.admin();
    await db.q(`update public.assessment_attempts set server_expires_at = now() - interval '1 minute' where id = $1`, [att.id]);
    await db.user(A);
    expect(await db.fails(`select public.save_attempt_response($1, $2, '{"selected":1}'::jsonb)`, [att.id, q.question_id])).toMatch(/time is over/);
    expect(await db.fails(`select * from public.get_attempt_questions($1)`, [att.id])).toMatch(/time is over/);
    const [res] = await db.q(`select * from public.submit_assessment_attempt($1)`, [att.id]);
    expect(res.status).toBe("graded");
    expect(Number(res.percentage)).toBeLessThan(100);
  });

  it("applies negative scoring correctly for a wrong run", async () => {
    await db.user(B);
    const [o] = await db.q(`select * from public.create_payment_order('assessment_journey', $1, null, null, null, 'jb', 'razorpay')`, [domain]);
    await db.admin();
    await db.q(`select public.fulfill_payment_order($1, 'pay_jb')`, [o.id]);
    await db.user(B);
    const [jb] = await db.q(`select * from public.start_journey($1, $2)`, [domain, o.id]);
    const first = (await db.q(`select assessment_id from public.get_journey_progress($1) where step_no = 1`, [jb.id]))[0].assessment_id;
    const saved = journey; journey = jb.id;
    const { result } = await takeTest(B, first, "wrong");
    journey = saved;
    expect(Number(result.percentage)).toBe(0);
    expect(Number(result.theta)).toBeLessThan(0);
  });
});

describe("proctoring", () => {
  let attemptId: string;
  it("hash-chains events, lowers integrity and refuses client tampering", async () => {
    await db.user(A);
    const steps = await db.q(`select * from public.get_journey_progress($1)`, [journey]);
    // finish remaining core tests quickly
    for (const s of steps.filter((x) => x.kind === "core" && x.status !== "graded" && x.status !== "submitted")) {
      await takeTest(A, s.assessment_id, "right");
    }
    await db.user(A);
    const [att] = await db.q(`select * from public.start_assessment_attempt($1, $2)`, [journey, domain]);
    attemptId = att.id;
    const s1 = (await db.q(`select public.log_proctoring_event($1, 1::smallint, 'tab_hidden', 'medium', 1) as s`, [attemptId]))[0].s;
    const s2 = (await db.q(`select public.log_proctoring_event($1, 15::smallint, 'multiple_faces', 'critical', 0.8) as s`, [attemptId]))[0].s;
    expect(Number(s1)).toBe(97);
    expect(Number(s2)).toBe(89);
    await db.admin();
    const chain = await db.q(`select prev_hash, event_hash from public.proctoring_events order by id`);
    expect(chain[0].prev_hash).toBe("GENESIS");
    expect(chain[1].prev_hash).toBe(chain[0].event_hash);
    await db.user(A);
    expect(await db.fails(`insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity) values ($1, $2, 1, 'A', 'x', 'minor')`, [attemptId, A])).toBeTruthy();
    await db.q(`update public.proctoring_events set severity = 'minor', confidence = 0`); // RLS: no rows match, nothing changes
    await db.q(`delete from public.proctoring_events`);
    await db.admin();
    expect((await db.q(`select count(*)::int n from public.proctoring_events where severity = 'critical' and confidence > 0`))[0].n).toBe(1);
    expect(await db.fails(`delete from public.proctoring_events`)).toMatch(/append-only/);
  });

  it("validates event inputs and ignores other users' attempts", async () => {
    await db.user(A);
    expect(await db.fails(`select public.log_proctoring_event($1, 99::smallint, 'x', 'minor')`, [attemptId])).toMatch(/Invalid proctoring event/);
    expect(await db.fails(`select public.log_proctoring_event($1, 1::smallint, 'x', 'severe')`, [attemptId])).toMatch(/Invalid proctoring event/);
    expect(await db.fails(`select public.log_proctoring_event($1, 1::smallint, 'x', 'minor', 1, 'javascript:1')`, [attemptId])).toMatch(/Invalid snapshot URL/);
    await db.user(B);
    expect(await db.fails(`select public.log_proctoring_event($1, 1::smallint, 'x', 'minor')`, [attemptId])).toMatch(/Attempt not found/);
  });

  it("invalidates an attempt after repeated critical violations", async () => {
    await db.user(A);
    let last = 100;
    for (let i = 0; i < 8; i++) last = Number((await db.q(`select public.log_proctoring_event($1, 16::smallint, 'phone', 'critical', 1) as s`, [attemptId]))[0].s);
    expect(last).toBeLessThan(40);
    await db.admin();
    expect((await db.q(`select status from public.assessment_attempts where id = $1`, [attemptId]))[0].status).toBe("invalidated");
  });
});

describe("CIR and credentials", () => {
  it("refuses a report until the whole journey is done", async () => {
    await db.user(A);
    expect(await db.fails(`select * from public.generate_cir_report($1)`, [journey])).toMatch(/Finish all 4 core tests/);
  });

  it("issues a CIR with integrity, a verifiable credential and a public verify page", async () => {
    // A fresh journey for a third user keeps this independent of the invalidated attempt above.
    const C = uuid(33);
    await db.signUp(C, "c@test.dev", { full_name: "Chitra" });
    await db.user(C);
    const [o] = await db.q(`select * from public.create_payment_order('assessment_journey', $1, null, null, null, 'jc', 'razorpay')`, [domain]);
    await db.admin();
    await db.q(`select public.fulfill_payment_order($1, 'pay_jc')`, [o.id]);
    await db.user(C);
    const [jc] = await db.q(`select * from public.start_journey($1, $2)`, [domain, o.id]);
    const saved = journey; journey = jc.id;
    const steps = await db.q(`select * from public.get_journey_progress($1)`, [journey]);
    for (const s of steps.filter((x) => x.kind === "core")) await takeTest(C, s.assessment_id, "right");
    await takeTest(C, domain, "right");
    await db.user(C);
    const [cir] = await db.q(`select * from public.generate_cir_report($1)`, [journey]);
    journey = saved;
    expect(Number(cir.composite_score)).toBeGreaterThan(85);
    expect(cir.tier).toBe("Elite");
    expect(Object.keys(cir.sections)).toEqual(expect.arrayContaining(["readiness", "domain", "communication", "psychometric", "vocational", "hr_judgment", "integrity"]));
    expect((await db.q(`select industry_readiness_score s from public.profiles where id = $1`, [C]))[0].s).toBeTruthy();

    await db.admin();
    const [{ token }] = await db.q(`select token from public.verifiable_credentials where cir_report_id = $1`, [cir.id]);
    await db.anon();
    const [v] = await db.q(`select * from public.verify_credential($1)`, [token]);
    expect(v).toMatchObject({ valid: true, holder_name: "Chitra", tier: "Elite", signed: false });
    expect((await db.q(`select * from public.verify_credential('not-a-real-token')`)).length).toBe(0);
    expect((await db.q(`select count(*)::int n from public.verifiable_credentials`))[0].n).toBe(0); // table itself stays private
    await db.user(A);
    expect((await db.q(`select count(*)::int n from public.cir_reports`))[0].n).toBe(0);
  });

  it("does not let a user forge their readiness score", async () => {
    await db.user(A);
    await db.q(`update public.profiles set industry_readiness_score = 100 where id = $1`, [A]);
    await db.admin();
    expect(Number((await db.q(`select industry_readiness_score s from public.profiles where id = $1`, [A]))[0].s)).toBe(0);
  });
});
