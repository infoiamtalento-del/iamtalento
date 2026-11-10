# STAGE A1 — Assessment platform (run after Stages 0–9; can be deferred)

**Goal:** finish the assessment product end to end: secure question generation, employer-authored assessments and invitations, coding/AI grading, the AI interviewer ("Linda"), proctoring review, CIR sharing.

## What already exists (do not rebuild)
`…100200_assessment_engine.sql`: `assessments_catalog`, `assessment_blueprints`, `question_bank`, `question_answer_keys` (no client policy), `assessment_journeys` (4 core + 1 domain), `assessment_attempts` (server timer, `theta`, `needs_manual_review`), `attempt_item_responses`, `start_journey`, `start_assessment_attempt`, `get_attempt_questions`, `save_attempt_response`, `submit_assessment_attempt`, `_grade_attempt` (MCQ/multi exact, descriptive keyword coverage), `apply_sandbox_result`, `generate_cir_report`, `verify_credential`, `verifiable_credentials` (+ `sign-credential`), `ai_interview_sessions/transcripts`, `coding_test_cases`. `…101000_proctoring_30_layers.sql` and `services/proctoring/*`. Client: `services/candidate/assessments.ts`, `components/assessment/LiveAssessmentJourney.tsx`, `pages/assessment/*`, `components/proctoring/*`, employer UI `ProEmployerAssessments.tsx` (2 294 lines, local state only).

## Tasks
### A1.1 Rebuild `generate-assessment` (fixes D3 fully)
Require JWT + permission `assessment.create` (or admin author); body validated; quota via `consume_entitlement('ai_questions')`; provider via `_shared/ai.ts` with a strict JSON schema (question, 4 options, `correct_index`, skill, difficulty, explanation); reject duplicates (embedding similarity > 0.92 against existing questions); write results as **drafts** in `question_bank` with keys in `question_answer_keys` and `review_status = 'draft'`; the response to the client contains questions **without** keys; promotion to `approved` through `approve_question` (author/admin). Log to `ai_usage`.

### A1.2 Employer-authored assessments
Tables: `employer_assessments(id, tenant_id, name, type, difficulty, passing_score, duration_min, proctoring bool, skills text[], status, blueprint jsonb, created_by)`, `employer_assessment_questions(assessment_id, question_id, position, marks)`, `assessment_invites(id, assessment_id, tenant_id, candidate_id null, email, application_id null, token_hash, expires_at, status check in ('sent','opened','started','completed','expired','revoked'), reminder_count)`.
RPCs: create/update/publish/archive, `add_questions`, `preview_assessment`, `invite_candidates(assessment_id, targets jsonb, deadline)` (consumes entitlement, emails via outbox, ≤ 200 per call), `resend_invite`, `revoke_invite`, `get_invite_public(token)` (anonymous, minimal fields), `start_attempt_from_invite(token)` (requires signed-in verified candidate whose email matches or explicit claim flow; no payment; reuses `start_assessment_attempt` rules; randomizes question order and option order per attempt; question pool sampling), `get_assessment_results(assessment_id, cursor)` and `get_candidate_result(invite_id)`: score, pass/fail, per-skill breakdown, time per question, integrity score, proctoring summary; **CIR full report only if the candidate consented** (`share_cir` flag on the invite).
Wire `ProEmployerAssessments.tsx` for real accounts by replacing its local reducers with `src/services/employer/assessments.ts` (same Stage 9 rules).

### A1.3 Grading
- **Coding**: Judge0 or Piston behind edge function `grade-coding` (service role). Hidden tests from `coding_test_cases`; per-test time/memory limits; max source 64 KB; network disabled; language allow-list; result → `apply_sandbox_result`. Never execute candidate code in Edge Functions or Postgres. Queue table `grading_jobs` with retries and DLQ.
- **Descriptive/audio**: edge function `grade-subjective` with a rubric per question, temperature 0, JSON schema, stores `rationale` and `confidence`; below threshold → `needs_manual_review`; reviewer RPC `submit_manual_grade` (author/admin, audited). Audio via speech-to-text then the same rubric. Candidate text is untrusted: fixed system prompt, no tools, output schema only, strip control sequences.
- Adaptive scoring: use `theta` only if a calibration table `item_stats` exists; otherwise leave off. Add nightly `recompute_item_stats()` (difficulty, discrimination, exposure) and retire over-exposed or negatively discriminating items.

### A1.4 AI Interviewer ("Linda")
Edge functions: `ai-interview-start` (creates `ai_interview_sessions` from job/role context, consent recorded, question plan of 6–10 items), `ai-interview-turn` (candidate answer as text or STT; next question chosen by rubric coverage; max turns, max tokens, per-session cost cap), `ai-interview-finish` (rubric scoring: role knowledge, problem solving, communication, structure, relevance; evidence quotes ≤ 20 words from the transcript; JSON stored; confidence). Realtime transcript table `ai_interview_transcripts` with RLS (candidate + permitted employer after consent). Entitlement `ai_interviews_month`. Safety: no scoring on accent, appearance, age, gender or emotion; no facial analysis; explainable score with evidence; employer sees the rubric, not a verdict; candidate can request human review (`request_review` RPC) and delete the recording per retention; document in `docs/compliance/AI_HIRING.md` (DPDP + EU AI Act high-risk employment context + bias monitoring plan with per-cohort score distribution query).

### A1.5 Proctoring operations
Employer/admin RPC `list_flagged_attempts(filters)` and `review_proctoring_case(attempt_id, decision, note)` (valid / invalidate / retake allowed) using `get_proctoring_dossier`, `verify_proctoring_chain`; appeals by candidates (`appeal_attempt`) with SLA; media retention 90 days in a private bucket with signed URL playback; ensure `ProctoringExamShell` calls `init_proctoring_session`, heartbeat and `finalize_proctoring_audit` on every attempt and blocks submission when the hash chain verification fails; camera/mic permission failures fall back per policy, not silently.

### A1.6 CIR and credentials
Weights from `platform_settings.assessment_weights`; nightly percentile job; credential public verify page uses `verify_credential`; employer share link with expiry and revoke; key rotation procedure for `CREDENTIAL_KEY_ID`; QR/PDF generation server side (replace client-only `utils/credentialPdf.ts` for real accounts).

### A1.7 Commerce
Paid domain tests via existing orders; employer-sponsored attempts consume tenant entitlement, never the candidate wallet; refunds for system-invalidated attempts through admin RPC.

## Tests
Key never returned to clients (scan every RPC/function response); invite token replay/expiry/wrong user; randomization differs between candidates; employer cannot read results of other tenants or without consent; grader queue retries; prompt-injection fixtures in descriptive answers and interview turns; proctoring chain tamper detection; entitlement exhaustion; concurrency on attempt start; AI cost caps.

## Acceptance
Employer creates an assessment with AI-drafted, human-approved questions, invites candidates by email; candidate completes it under proctoring; employer sees ranked results and (with consent) the CIR; an AI interview runs end to end with an evidence-backed report.
