# STAGE 5 — Applications, ATS pipeline, interviews, offers

**Goal:** the core employer ↔ candidate loop: review, move, note, interview, offer, hire, with the candidate seeing every step.

## Read first
`job_applications`, `application_stage_history`, `recruiter_evaluations`, `scheduled_interviews`, `on_application_change`, `update_application_stage`, `applications_guard` (all `…100000`, `…100400`, `…100800`), `apply_to_job` (re-declared in `…100800`), `ProApplication` + `STAGES` in `data/proData.ts`, `ProEmployerPipeline.tsx`, `ProEmployerCandidateDetail.tsx`, `ProApplicationsView.tsx`, `ProEmployerNotifications.tsx`.

## Tasks

### 5.1 Reading applications
- `list_applications(p_job uuid default null, p_stages text[], p_q text, p_min_match numeric, p_sort text, p_cursor jsonb, p_limit int)` — permission `app.view`, keyset pagination, returns the candidate snapshot, match score + breakdown, latest CIR score/tier, integrity, verified-badges, stage, age, SLA flag. No contact data yet unless the candidate applied (applying implies sharing contact with that employer; include email/phone in `get_application`, not in list).
- `get_application(p_id)` — full view: profile sections via existing employer-view policies, latest CIR + credential verify link, assessments taken, notes, evaluations, stage history, interviews, offers. Sets `viewed_at`, inserts `profile_views` (kind `application_view`). Interviewer role sees only assigned applications.
- `pipeline_counts(p_job)` for column badges.

### 5.2 Stage engine
- Add `Hired` to the stage check constraint (and `Rejected` reason fields). Transition graph enforced in SQL: `Applied→Shortlisted|Rejected`, `Shortlisted→Interview|Rejected`, `Interview→Offer|Rejected|Shortlisted`, `Offer→Hired|Rejected`, any open stage `→Withdrawn` only by candidate. Terminal: `Hired`, `Rejected`, `Withdrawn`; reopening needs `app.move` + audit entry.
- Replace `update_application_stage` with a hardened version (permission `app.move`, verified email, reason required for `Rejected` from a taxonomy `rejection_reasons`, optional candidate-visible message ≤ 1000 chars, rate limit). `bulk_update_stage(ids uuid[], stage text, reason text)` max 100 per call, all-or-nothing, same-tenant only.
- UI mapping: `Hired` shows within the existing Offer column until product decides; do not add a column.
- SLA: `job_applications.sla_due_at = applied_at + interval '24 hours'`; cron `sla_sweeper()` notifies the employer once at 80% and at breach, escalates to tenant admins at 48 h, writes `sla_breaches`. Expose SLA in `employer_dashboard()`.

### 5.3 Notes and evaluations
- `application_notes(id, application_id, author_id, body ≤ 5000, created_at)` private to the tenant (never readable by candidates; keep the legacy `recruiter_note` column in sync with the latest note for UI compatibility).
- `submit_evaluation(app_id, rating 1–5, scorecard jsonb, notes)` with a validated scorecard schema (competency → 1–5), one per evaluator per interview round, aggregate view `application_scores`.

### 5.4 Interviews
- `schedule_interview(p_app, p_at, p_duration, p_mode, p_panelists uuid[], p_meeting_url, p_note)` — permission `interview.schedule`; panelists must be tenant members; conflict check across panelists and candidate's other interviews; sets stage `Interview` if earlier; creates `scheduled_interviews`; notification + outbox email with ICS (Stage 8).
- `respond_interview(p_id, p_action text)` candidate: `accept | decline | propose` (proposal stores up to 3 slots); employer `confirm_proposed_slot`; `reschedule_interview`, `cancel_interview(reason)`, `complete_interview(outcome)`, `mark_no_show`.
- Status machine: `proposed → scheduled → completed | cancelled | no_show` (extend the check constraint, add `candidate_response`).
- Reminders T−24 h and T−1 h through the outbox (cron `interview_reminders()`).
- Video: edge function `livekit-token` — requires the caller to be the candidate or a listed panelist, only within `scheduled_at − 15 min … + duration + 30 min`, short-lived token, room name from `livekit_room`; 503 if LiveKit env missing. For `mode='ai'` link to the AI interview session (Stage A1).

### 5.5 Offers
`offers(id, application_id, tenant_id, ctc_annual, currency, joining_date, designation, benefits jsonb, letter_path, status check in ('draft','sent','accepted','declined','expired','withdrawn'), expires_at, sent_by, responded_at)`. RPCs `create_offer`, `send_offer` (permission `offer.send`, application must be in `Offer`), `respond_offer(accept|decline, message)` candidate, `withdraw_offer`, cron `expire_offers()`. Accept → application `Hired`, decrement `num_openings`, auto-`close_job` when filled, notify both sides, audit. Offer letter PDF is uploaded to a private bucket `offer-letters` (employer writes, candidate reads own).

### 5.6 Candidate-side truth
`my_application_timeline(p_app)` merges history + interviews + offers + employer messages (candidate-visible only). Realtime publication adds `scheduled_interviews`, `offers`. When a job closes with pending applications, send "position closed" once. Candidates can see employer response-time stats per company (aggregate only).

### 5.7 Retention
Cron `anonymize_old_applications()`: rejected/withdrawn applications older than 24 months have `profile_snapshot` and notes stripped to aggregates (DPDP minimization). Configurable via `platform_settings`.

## Tests
Full transition matrix; cross-tenant IDOR on every RPC; candidate cannot read notes/evaluations/offers of others; bulk atomicity and size cap; SLA sweeper idempotency; interviewer scoping; interview conflicts and window enforcement for LiveKit token; offer accept closes job when filled; double-click idempotency (same action twice → one history row, one notification); concurrency (two recruiters move the same application → deterministic result with row lock).

## Acceptance
Scripted flow passes on PGlite: candidate applies → recruiter lists, opens, shortlists → schedules → candidate accepts → feedback → offer → candidate accepts → job closes. Each step produces exactly one notification and one history row. Candidate timeline matches.
