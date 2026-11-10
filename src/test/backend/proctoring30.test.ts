// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { createDb, uuid, type Db } from "./harness";

const A = uuid(61), B = uuid(62);
let db: Db;
let coreAssessmentId: string;
let descQuestionId: string;
let journeyA: string;
let attemptA: string;

beforeAll(async () => {
  db = await createDb();
  await db.signUp(A, "proctor-a@test.dev", { full_name: "Ananya Candidate" });
  await db.signUp(B, "proctor-b@test.dev", { full_name: "Bharat Candidate" });

  await db.admin();
  const domain = (await db.q(`select id from public.assessments_catalog where kind = 'domain' and price_inr = 0 and is_active limit 1`))[0]
    ?? (await db.q(`select id from public.assessments_catalog where kind = 'domain' and is_active limit 1`))[0];

  // Ensure a free domain journey can start cleanly and add one descriptive question to test ChatGPT & Plagiarism checks
  await db.q(`update public.assessments_catalog set price_inr = 0 where id = $1`, [domain.id]);
  coreAssessmentId = (await db.q(`select id from public.assessments_catalog where kind = 'core' and core_position = 1`))[0].id;
  await db.q(`update public.assessments_catalog set question_count = 50 where id = $1`, [coreAssessmentId]);
  const [dq] = await db.q(`
    insert into public.question_bank (assessment_id, section, qtype, prompt, marks)
    values ($1, 'Written Architecture', 'descriptive', 'Explain idempotency and distributed locking in payment systems.', 5)
    returning id
  `, [coreAssessmentId]);
  descQuestionId = dq.id;
  await db.q(`
    insert into public.question_answer_keys (question_id, correct, explanation)
    values ($1, '{"keywords":["idempotency","locking","retry"]}'::jsonb, 'Checks core distributed systems concepts.')
  `, [descQuestionId]);

  await db.user(A);
  journeyA = (await db.q(`select * from public.start_journey($1)`, [domain.id]))[0].id;
  attemptA = (await db.q(`select * from public.start_assessment_attempt($1, $2)`, [journeyA, coreAssessmentId]))[0].id;
}, 120_000);

describe("30-Layer Proctoring Catalog", () => {
  it("seeds all 30 canonical layers (6 before + 16 during + 8 after)", async () => {
    await db.anon();
    const layers = await db.q(`select id, phase, layer_group, code, name from public.proctoring_layers_catalog order by id`);
    expect(layers).toHaveLength(30);
    expect(layers.filter((l) => l.phase === "before" && l.layer_group === "A")).toHaveLength(6);
    expect(layers.filter((l) => l.phase === "during" && l.layer_group === "B")).toHaveLength(16);
    expect(layers.filter((l) => l.phase === "after" && l.layer_group === "C")).toHaveLength(8);
    expect(layers[0].name).toBe("Biometric Face Match");
    expect(layers[6].name).toBe("Gaze & Eye Tracking");
    expect(layers[21].name).toBe("VM Detection");
    expect(layers[29].name).toBe("Post-Test Monitoring");
  });
});

describe("Phase A (Layers 1..6): Pre-Check, MFA OTP, VM & Clock Skew", () => {
  it("initializes session, dispatches 6-digit MFA OTP, blocks precheck until MFA passes, and enforces storage path ownership", async () => {
    await db.user(A);
    const [initRes] = await db.q<{ res: any }>(
      `select public.init_proctoring_session($1, 'fp-shared-rig-01', 'Asia/Kolkata', (extract(epoch from now()) * 1000 - 400000)::bigint, array['swiftshader_gpu']) as res`,
      [attemptA]
    );
    expect(initRes.res.otp_dispatched).toBe(true);
    expect(initRes.res.mfa_verified).toBe(false);
    // Clock skew (>5m, Layer 19 medium 3*0.8=2.4) + VM flag (Layer 22 critical 10*0.85=8.5) => 100 - 10.9 = 89.1
    expect(Number(initRes.res.integrity_score)).toBeCloseTo(89.1, 1);

    // Candidate cannot read raw MFA challenge table directly
    expect((await db.q(`select count(*)::int n from public.proctoring_mfa_challenges`))[0].n).toBe(0);

    // Precheck is blocked before MFA verification
    expect(await db.fails(
      `select * from public.complete_proctoring_precheck($1, '{"face_match_score":96,"liveness_passed":true}'::jsonb)`,
      [attemptA]
    )).toMatch(/Complete Multi-Factor Auth/);

    // Wrong OTP fails cleanly with remaining attempts
    const [badOtp] = await db.q<{ res: any }>(`select public.verify_proctoring_mfa($1, '000000') as res`, [attemptA]);
    expect(badOtp.res.verified).toBe(false);

    // Read candidate's own in-app OTP notification and verify Layer 3 MFA
    const [notif] = await db.q(`select data from public.notifications where user_id = $1 and kind = 'proctoring_mfa' order by created_at desc limit 1`, [A]);
    const otp = notif.data.otp_code as string;
    expect(otp).toMatch(/^\d{6}$/);

    const [goodOtp] = await db.q<{ res: any }>(`select public.verify_proctoring_mfa($1, $2) as res`, [attemptA, otp]);
    expect(goodOtp.res.verified).toBe(true);

    // Reject foreign user's snapshot path
    expect(await db.fails(
      `select * from public.complete_proctoring_precheck($1, $2::jsonb)`,
      [attemptA, JSON.stringify({ baseline_snapshot_path: `${B}/stolen.jpg`, face_match_score: 95, liveness_passed: true })]
    )).toMatch(/Invalid baseline snapshot path/);

    // Complete precheck with valid owner snapshot paths
    const [sess] = await db.q(`select * from public.complete_proctoring_precheck($1, $2::jsonb)`, [
      attemptA,
      JSON.stringify({
        face_match_score: 96.4,
        liveness_passed: true,
        id_verified: true,
        baseline_snapshot_path: `${A}/${attemptA}/baseline.jpg`,
        env_scan_paths: [`${A}/${attemptA}/env-left.jpg`, `${A}/${attemptA}/env-center.jpg`, `${A}/${attemptA}/env-right.jpg`],
        noise_floor_db: -48.5,
      }),
    ]);
    expect(sess.precheck_completed).toBe(true);
    expect(sess.liveness_passed).toBe(true);
    expect(sess.env_scan_paths).toHaveLength(3);
  });
});

describe("Phase B (Layers 7..22): Live Signals, Device Lease, IP Drift & Proctor Chat", () => {
  it("logs Layers 7..22 signals, detects concurrent device lease & IP drift, and responds in live proctor chat", async () => {
    await db.user(A);
    // Log Layer 7 gaze + Layer 21 screenshot attempt with owner storage path
    const sGaze = (await db.q(`select public.log_proctoring_event($1, 7::smallint, 'gaze_off_screen', 'minor', 0.5, $2) as s`, [
      attemptA, `${A}/${attemptA}/gaze1.jpg`,
    ]))[0].s;
    expect(Number(sGaze)).toBeLessThan(89.1);

    // Concurrent device lease from another fingerprint within 45s triggers Layer 12 conflict
    const [hbConflict] = await db.q<{ res: any }>(
      `select public.heartbeat_proctoring_session($1, 'fp-second-laptop-99', '{"screen_share_active":true}'::jsonb) as res`,
      [attemptA]
    );
    expect(hbConflict.res.device_conflict).toBe(true);

    // Simulate mid-session IP change via request.headers -> triggers Layer 15 IP drift
    await db.pg.exec(`select set_config('request.headers', '{"x-forwarded-for":"203.0.113.77"}', false)`);
    const [hbIp] = await db.q<{ res: any }>(
      `select public.heartbeat_proctoring_session($1, 'fp-shared-rig-01', '{"screen_share_active":true}'::jsonb) as res`,
      [attemptA]
    );
    expect(hbIp.res.ip_drift).toBe(true);
    expect(hbIp.res.ip_drift_count).toBe(1);

    // Layer 20: Live Proctor Chat
    const [chat] = await db.q<{ res: any }>(
      `select public.send_proctor_chat_message($1, 'My camera flickered for a second when an OS popup appeared') as res`,
      [attemptA]
    );
    expect(chat.res.candidate_message.sender).toBe("candidate");
    expect(chat.res.proctor_reply.sender).toBe("proctor_ai");
    expect(chat.res.proctor_reply.body).toMatch(/Proctor Desk:/);

    // User B cannot access User A's proctoring session, chat, or dossier
    await db.user(B);
    expect((await db.q(`select count(*)::int n from public.proctoring_sessions`))[0].n).toBe(0);
    expect((await db.q(`select count(*)::int n from public.proctor_chat_messages`))[0].n).toBe(0);
    expect(await db.fails(`select public.get_proctoring_dossier($1)`, [attemptA])).toMatch(/Attempt not found/);
  });
});

describe("Phase C (Layers 23..30): AI/ChatGPT, Plagiarism, Collusion & Hash-Chain Verification", () => {
  it("flags LLM boilerplate, cross-candidate plagiarism, shared-device collusion, and verifies the SHA-256 hash chain", async () => {
    const sharedEssay =
      "As an AI language model, certainly! Here is a comprehensive breakdown: idempotency ensures retry safety while distributed locking prevents concurrent double-charging in payment systems.";

    // Candidate B submits the essay first using the same device fingerprint ('fp-shared-rig-01') to trigger collusion + plagiarism reference
    await db.admin();
    const domainId = (await db.q(`select domain_assessment_id from public.assessment_journeys where id = $1`, [journeyA]))[0].domain_assessment_id;
    await db.user(B);
    const [jb] = await db.q(`select * from public.start_journey($1)`, [domainId]);
    const [attB] = await db.q(`select * from public.start_assessment_attempt($1, $2)`, [jb.id, coreAssessmentId]);
    await db.q(`select public.init_proctoring_session($1, 'fp-shared-rig-01', 'Asia/Kolkata', null, '{}')`, [attB.id]);

    const qsB = await db.q(`select * from public.get_attempt_questions($1)`, [attB.id]);
    const bDesc = qsB.find((q) => q.qtype === "descriptive");
    if (bDesc) {
      await db.q(`select public.save_attempt_response($1, $2, $3::jsonb, 4200)`, [
        attB.id, bDesc.question_id, JSON.stringify({ text: sharedEssay }),
      ]);
    }
    await db.q(`select * from public.submit_assessment_attempt($1)`, [attB.id]);

    // Now Candidate A answers ultra-fast MCQ (<1500ms) + pastes the identical LLM essay
    await db.user(A);
    const qsA = await db.q(`select * from public.get_attempt_questions($1)`, [attemptA]);
    for (const q of qsA) {
      if (q.qtype === "descriptive") {
        await db.q(`select public.save_attempt_response($1, $2, $3::jsonb, 900)`, [
          attemptA, q.question_id, JSON.stringify({ text: sharedEssay }),
        ]);
      } else {
        await db.admin();
        const [{ correct }] = await db.q(`select correct from public.question_answer_keys where question_id = $1`, [q.question_id]);
        await db.user(A);
        await db.q(`select public.save_attempt_response($1, $2, $3::jsonb, 500)`, [
          attemptA, q.question_id, JSON.stringify({ selected: correct.selected }),
        ]);
      }
    }

    // Grade attempt first without auto-sealing? Note: submit_assessment_attempt auto-seals, OR we can pass client summary via finalize_proctoring_audit right before or test finalize_proctoring_audit!
    // Wait: let's store client typing metrics via heartbeat first, then submit!
    await db.q(`select public.heartbeat_proctoring_session($1, 'fp-shared-rig-01', $2::jsonb)`, [
      attemptA,
      JSON.stringify({
        typing_metrics: { wpm: 260, burstCount: 3 },
        replay_keyframes: [{ t: 5, label: "Baseline Verified" }, { t: 42, label: "Tab Focus Warning" }],
      }),
    ]);

    const [gradedA] = await db.q(`select * from public.submit_assessment_attempt($1)`, [attemptA]);
    expect(["graded", "submitted", "invalidated"]).toContain(gradedA.status);

    const [dossierRow] = await db.q<{ d: any }>(`select public.get_proctoring_dossier($1) as d`, [attemptA]);
    const d = dossierRow.d;
    expect(d.chain.valid).toBe(true);
    expect(d.chain.event_count).toBeGreaterThanOrEqual(8);
    expect(d.session.collusion_flag).toBe(true);
    expect(Number(d.session.ai_anomaly_score)).toBeGreaterThanOrEqual(60);
    expect(Number(d.session.chatgpt_risk_score)).toBeGreaterThan(0);
    if (qsA.some((q) => q.qtype === "descriptive") && bDesc && qsA.find((q) => q.qtype === "descriptive")?.question_id === bDesc.question_id) {
      expect(Number(d.session.plagiarism_max_sim)).toBeGreaterThan(0.8);
    }
    expect(d.chat_messages_count).toBe(2);
  });
});
