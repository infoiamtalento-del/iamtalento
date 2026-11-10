# STAGE 4 — Job posting lifecycle (employer → candidates)

**Goal:** jobs posted by employers appear to candidates; nobody writes jobs directly. Fixes D7 for jobs and closes D2 permanently.

## Read first
`employer_job_openings` (base `…20260221103809` + extensions in `…100000`), `can_manage_job`, `jobs_protect`, `search_jobs` and `job_alerts_trg` in `…100900`, `compute_match_score`, `ProJob` interface and `SEED_JOBS_RAW` in `data/proData.ts`, `services/candidate/jobs.ts` (row→`ProJob` mapping), `ProEmployerJobPosting.tsx`, `ProEmployerViews.tsx` (posting form), `TalentoPro.tsx` job handlers.

## Tasks
1. Migration: `status` check → `draft | pending_review | active | paused | closed | expired | rejected`; add `slug` (unique), `locations text[]`, `currency default 'INR'`, `salary_visible bool`, `employment_type`, `application_deadline`, `screening_questions jsonb` (max 5, each ≤ 300 chars), `published_at`, `closed_reason`, `views_count`, `applications_count` (maintained by trigger), `moderation_note`. Keep every column `candidate/jobs.ts` already reads.
2. Remove all client INSERT/UPDATE/DELETE policies on `employer_job_openings` (keep SELECT policies). Everything below is RPC.
3. RPCs (require verified email + `job.*` permission + `employer_can`):
   - `create_job(p jsonb)` → draft. `update_job(id, p jsonb)` (only draft/paused/active; salary/title edits on active jobs logged to audit).
   - `publish_job(id)`: validates completeness, runs `check_quota(tenant,'active_jobs')` (stub returning true until Stage 7), sets `active` if tenant verified else `pending_review`; sets `published_at`, `closes_at` (default +30 d, max +90 d).
   - `pause_job`, `resume_job`, `close_job(id, reason)` (notifies pending applicants), `duplicate_job`, `delete_job` (soft delete only when zero applications).
   - `list_my_jobs(status[], q, cursor, limit)`, `get_job_for_edit(id)`, `job_stats(id)` (views, applies, stage funnel, avg match, time-to-first-view).
   - `record_job_view(job_id)` anonymous-safe, deduped per day per viewer hash, rate limited; feeds `views_count`.
   Input rules: title 3–120, description ≤ 20 000 chars with HTML stripped/escaped, `salary_min ≤ salary_max`, skills ≤ 30 normalized lowercase-deduped, experience range sane, location required unless Remote, `closes_at` in the future.
4. Moderation: `pending_review` queue consumed by `admin_moderate_job` (Stage 2). Rejection reasons enum; employer notified. Simple automated screening function `job_risk_flags(text)` (fee/“registration charge” scams, WhatsApp-only contact, free-mail contact, banned words) that auto-routes risky jobs to `pending_review` even for verified tenants.
5. Embeddings: `embedding_queue(entity, entity_id, enqueued_at)` filled by triggers on job insert/update (title, skills, description change) and on candidate profile/skills changes. Edge function `embed-worker` (cron every minute) batches via `_shared/ai.ts embed()`, writes `jd_embedding` / `candidate_embeddings` with `source_hash` skip logic. Add backfill command. Embedding dimension must be 1536; if the provider differs, request that dimension or truncate-normalize and record `model`.
6. Cron: `expire_jobs()` daily (status → `expired`, notify employer), `reminder_job_expiring()` 3 days before close.
7. Job alerts: keep `job_alerts_trg`; the consumer arrives in Stage 8. Make sure the trigger only fires on transition into `active`.
8. Platform-curated demo listings: add `is_demo boolean default false`; the 20 seeded listings must be `is_demo = true`, hidden by `search_jobs` unless `platform_settings.show_demo_jobs = true`. Apply attempts on demo jobs return a friendly "Sample listing" message.
9. Service layer `src/services/employer/jobs.ts` and a mapper to `ProJob` that already exists for candidates (reuse; do not fork).

## Tests
Employee cannot write jobs by any path; cross-tenant edit/close denied; quota stub hook; lifecycle state machine (every illegal transition rejected); publish gating by verification; moderation approve/reject; salary/skills validation; SQL-injection strings; view dedupe; closing a job notifies applicants once; expiry cron; embedding queue enqueue/dedupe; demo-job hiding.

## Acceptance
Post a job as a real verified employer → appears in `search_jobs` for an anonymous visitor and in the candidate Pro shell within one refresh; unverified employer's job lands in `pending_review` and is invisible; closing it removes it from search and notifies applicants.
