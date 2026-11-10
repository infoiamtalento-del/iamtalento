# TalentCIR / IAmTalento — Backend Completion Prompt Pack

Source of truth for the agent. Static read of `talentcir.zip` (447 source files, 16 migrations, 3 edge functions, 6 backend test suites). Nothing was executed; Stage 0 establishes the real baseline.

## How to use in Antigravity
1. Save this file as `docs/backend/00_AUDIT_AND_MASTER_CONTEXT.md` and each stage file next to it. Use Planning mode.
2. Start every stage with: `Read @docs/backend/00_AUDIT_AND_MASTER_CONTEXT.md and @docs/backend/<stage file>. Execute that stage only.`
3. Keep terminal approval ON for anything touching `supabase db push`, `supabase secrets`, or `git push`.
4. One stage = one branch/PR. Do not start the next stage until the Stage Report is accepted.
5. "One massive prompt" mode: paste the Master Context, then `Execute Stages 0 to 12 in order. After each stage run the gate, commit, print the Stage Report, and continue only if every gate is green. Stop on the first red gate.`

---

# PART 1 — AUDIT FINDINGS

## 1.1 What exists (real, in Postgres)
| Area | Status | Where |
|---|---|---|
| Auth | Works but unsafe (see 1.3) | `20261029100700_signup_roles`, `…101100_auth_reliability`, `src/services/authSession.ts`, `pages/Auth.tsx`, `ResetPassword.tsx`, `AuthCallback.tsx` |
| Candidate profile | Save/load RPC, public portfolio, completion, referral code | `…100900_candidate_features` |
| Jobs (candidate side) | Search, match score, apply, withdraw, save, alerts | `…100400_candidate_job_logic`, `services/candidate/jobs.ts` |
| Notifications | Table + trigger-driven + realtime | `…100000_platform_foundation` |
| Billing | GST orders, double-entry wallet ledger, coupons, referrals, services | `…100050_billing_wallet`, `functions/payments` (Razorpay) |
| Assessments | Catalog, journey (4 core + 1 domain), attempts, server grading, CIR, signed credentials | `…100200_assessment_engine`, `functions/sign-credential` |
| Proctoring | 30-layer catalog, hash-chained events, MFA precheck, dossier | `…101000_proctoring_30_layers`, `services/proctoring/*` |
| Learning/events | Courses, modules, mentors, hackathons, event registration RPCs | `…100300_learning_events` |
| Security | Protected columns, rate limits, private buckets, function allow-list | `…100800_security_hardening` |
| Tests | PGlite backend suites: auth, billing, candidate, assessment, proctoring, security | `src/test/backend/*` |

## 1.2 What is missing (the actual work)
- **Employer side has no backend.** There is no `src/services/employer/`. Posting jobs, pipeline, notes, interviews, assessments, AI interviews, campaigns, plan, settings all run on `localStorage` (`tq_users`, `tq_jobs`, `tq_apps`, `EmployerDemoState` in `data/employerDemo.ts`). A job an employer posts never reaches `employer_job_openings`, so candidates never see it, and candidate applications never reach the employer UI. The employer→employee loop is broken end to end.
- Tables exist but nothing drives them: `scheduled_interviews` (no schedule/respond RPC), `recruiter_evaluations`, `tenant_*` (no create/invite flow), `employer_subscriptions`, `tenant_api_keys_webhooks`, `ai_interview_sessions/transcripts`, `candidate_embeddings` and `jd_embedding` (nothing generates embeddings), `job_alert_queue` (no sender), `coding_test_cases` (no sandbox runner), `profile_views`.
- Only 3 edge functions exist: `payments`, `sign-credential`, `generate-assessment`. No email/SMS sender, no embedding worker, no LiveKit token, no resume parser, no AI interviewer runtime, no outbox worker.
- No employer talent search, shortlists, contact unlock, invites, messaging, offers, team invites, SLA enforcement, invoices (server side), subscriptions lifecycle, ad campaigns, admin console.
- No route guards (`App.tsx` has none). Role and identity for the Pro shell come from `localStorage` (`tq_sess`, `tq_users`, including a `pw` field).
- `src/integrations/supabase/types.ts` predates the platform migrations, so all calls go through an untyped `db`.
- Learning, Hackathons 1–3, Networking, Webinars, Meetups, Podcasts, and the assessment marketing pages render static data from `src/data/*`.

## 1.3 Defects to fix (ordered by severity)
| ID | Severity | Defect | Fix in |
|---|---|---|---|
| D1 | Critical | `trg_auto_confirm_auth_user` confirms every email on insert. No email ownership is ever proven. Anyone can register any address (pre-hijack, employer impersonation). | Stage 1 |
| D2 | Critical | Any authenticated user (including candidates) can insert an active public job: policy "Employers can manage own job openings" checks only `auth.uid() = user_id`; `jobs_protect` forces `source`/`user_id` but not role. | Stage 2 (hotfix), Stage 4 (remove direct writes) |
| D3 | High | `generate-assessment` is `verify_jwt=false` with no auth in code: unauthenticated callers burn AI credits and receive answer keys. Also hard-wired to the Lovable gateway (`LOVABLE_API_KEY`). | Stage 0 (lock), A1 (rebuild) |
| D4 | High | `register_user_account` (anon-callable) writes directly into `auth.users` / `auth.identities` with `crypt()`. Couples to GoTrue internals, bypasses captcha and Auth rate limits. | Stage 1 |
| D5 | High | `confirm_unverified_account` is an anon-callable password oracle (10 tries / 15 min per email). | Stage 1 |
| D6 | High | Real-account role and identity trusted from `localStorage`; no `RequireAuth`; `ProUser.pw` exists in client state. | Stage 1 + 9 |
| D7 | High | Employer data is simulated for real accounts (see 1.2). Real employers would see fake applicants and fake plans. | Stages 3–9 |
| D8 | Medium | Password minimum is 6. | Stage 1 |
| D9 | Medium | `.gitignore` does not exclude `.env`. Currently only public Supabase URL and anon key are inside, but this will leak secrets later. | Stage 0 |
| D10 | Medium | `Access-Control-Allow-Origin: *` on all functions; `verify_jwt=false` on all three (correct only for the Razorpay webhook). | Stage 0 + 11 |
| D11 | Medium | Seed migration `…100500_seed_platform_data` puts 20 fake jobs, coupons and courses into the migration chain, so they ship to production. | Stage 11 |
| D12 | Medium | pg_cron schedules exist only as README text, not as migrations. | Stage 0 |
| D13 | Medium | `identity_verifications.pan_number` stored in plaintext. | Stage 11 |
| D14 | Low | Lovable coupling: `lovable-tagger`, `.lovable/`, AI gateway. | Stage 0 |

---

# PART 2 — MASTER CONTEXT (paste once, applies to every stage)

## Role
You are a principal backend/security engineer finishing the backend of TalentCIR (IAmTalento), an Indian hiring + assessment + learning platform. You own correctness, security and tests. You do not redesign the UI.

## Stack facts (verified from repo)
- Frontend: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + react-router 6 + TanStack Query, deployed on Vercel (`vercel.json` SPA rewrite).
- Backend: Supabase project `uoxokxgbpylfsanffsxm`. Postgres 15+, RLS, `SECURITY DEFINER` RPCs, Realtime, Storage, Edge Functions (Deno). Extensions: pgcrypto, vector (1536 dims), pg_trgm. Design goal: runs on plain PostgreSQL later; only `auth.uid()` and the `extensions` schema are Supabase-specific.
- Payments: Razorpay (INR, GST 18%, seller state Karnataka, `platform_settings`).
- Tests: Vitest + PGlite harness in `src/test/backend/harness.ts`. Scripts: `npm test`, `npm run build`, `npm run lint`.
- Frontend data layer: `src/services/db.ts` (`rpc()`, `db`, `BackendError`, `registerId/uuidFor` numeric-id bridge), `src/services/candidate/*`, `src/hooks/useCandidateBackend.ts`, Pro shell in `src/pages/TalentoPro.tsx` + `src/components/pro/*`.
- Roles: `app_role` enum `employer | employee`; admins in `platform_admins`; org roles in `tenant_memberships` (`owner, admin, recruiter, hiring_manager, interviewer, viewer`).
- Demo mode: `demo.candidate@talento.app`, `demo.employer@talento.app`, flag `tq_demo_only` in sessionStorage, `openDemoWorkspace()`.

## Non-negotiable rules
1. **All business rules live in Postgres.** Clients get RLS-protected reads and RPC calls. No client INSERT/UPDATE/DELETE policy on: money, ledger, scores, verification, roles, jobs state, application stage, entitlements, audit.
2. Every `SECURITY DEFINER` function: `set search_path = public` (add `extensions` only if needed), validates `auth.uid()`, checks role/tenant permission inside the function, validates and bounds every argument, and ends with `revoke all … from public; grant execute … to authenticated` (to `anon` only for explicit public endpoints). Internal helpers are not callable from the API.
3. Every new table: RLS enabled in the same migration, explicit policies, indexes for every FK and every filter used in a list RPC, `created_at/updated_at`, check constraints on enums and lengths.
4. Never trust the client for: role, tenant, price, score, stage, ownership. Derive from `auth.uid()` and the database.
5. Tenant isolation is a hard boundary. Every employer-facing read/write proves membership of the owning tenant. Write a cross-tenant negative test for every new RPC.
6. Money: only through `wallet_transfer` and `payment_orders`; amounts in paise/integers or `numeric` with rounding rules written down; webhooks verify HMAC and amount and are idempotent via an event-id table.
7. Pagination is keyset-based and capped (default 25, max 100). No unbounded list returns.
8. PII: minimize returned fields; contact details only after an explicit unlock or application; log employer views of candidate data in `profile_views`; honor `profiles.profile_visibility`. Compliance baseline: India DPDP Act 2023 (consent, purpose limitation, retention, deletion, export).
9. Secrets never in the repo or in `VITE_*`. Service-role key only inside Edge Functions. Missing secret → function returns 503 with a clear message; app degrades gracefully.
10. Demo accounts must never read or write real data, and real accounts must never see simulated data. Do not delete the demo shell; isolate it.
11. UI: keep layout and design exactly as is (root `AGENTS.md` UI rules remain in force). You may add loading, empty, error and "verify your email" states and swap data sources. If a feature has no backend yet, show an honest "Coming soon" for real accounts; never fake data.
12. Migrations: new files only, timestamp after the latest (`20261029101100`), never edit applied migrations, idempotent (`if not exists`, `drop … if exists`), one concern per file, data backfills included.
13. Error codes: `28000` not authenticated, `42501` forbidden, `P0402` payment required, `P0403` policy violation, `P0410` time expired, `22023` invalid input, `23505` conflict. Add `P0429` rate limited. Messages are user-safe (no SQL, no internals).
14. If you need something only the owner can provide (API key, DNS, legal text, GSTIN), do not invent it. Add it to `docs/backend/SETUP_TODO.md`, read it from env, and keep going.

## Working protocol (every stage)
1. Read the stage file and every file it names. State assumptions you verified in the code.
2. Post a short plan: migrations, functions, services, tests, files touched.
3. Implement in small commits. Regenerate types when schema changes.
4. Write tests first for security-sensitive RPCs (positive, negative, IDOR, cross-tenant, abuse/rate limit, idempotency, concurrency where money or quotas are involved).
5. Gate (all must pass): `npm run lint`, `npx tsc -p tsconfig.app.json --noEmit`, `npm test`, `npm run build`, plus the stage's own acceptance list.
6. Print the **Stage Report**:
   - Done / Not done (with reason)
   - Migrations added (file names), functions added, tables added
   - Tests added and pass counts
   - Security notes and residual risks
   - Items appended to `SETUP_TODO.md`
   - Exact manual steps for the owner (commands, dashboard toggles)
7. Stop. Do not begin the next stage.

## Environment and secrets (collect into `docs/backend/SETUP_TODO.md`)
| Name | Used by | Notes |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | web | public |
| `VITE_SITE_URL` | web/auth redirects | e.g. https://app.example.com |
| `VITE_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | auth captcha | Cloudflare Turnstile |
| `SMTP_*` or `RESEND_API_KEY` | auth email + outbox | custom SMTP is mandatory in prod; default Supabase SMTP is rate limited |
| `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET` | payments | already referenced |
| `CREDENTIAL_SIGNING_KEY`, `CREDENTIAL_KEY_ID` | sign-credential | Ed25519 |
| `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, `EMBEDDING_MODEL` | AI functions | replaces `LOVABLE_API_KEY`; embeddings must output 1536 dims |
| `ALLOWED_ORIGINS` | all functions | comma list |
| `LIVEKIT_URL/API_KEY/API_SECRET` | interviews | optional |
| `JUDGE0_URL/KEY` or `PISTON_URL` | coding grader | optional until A1 |
| `SENTRY_DSN` | web + functions | optional |

## Dependency order
`0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12`, then `A1` (Assessment) and `L1` (Learning). Stages 6 and 7 can run in parallel after 5. Stage 8 can start after 4 but must finish before 5's email acceptance items are green. Stage 9 consumes everything before it.
