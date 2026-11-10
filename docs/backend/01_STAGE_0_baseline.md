# STAGE 0 — Baseline, safety net, repo hygiene

**Goal:** know exactly what works today, stop the bleeding (D3, D9, D10, D12, D14), and put CI around everything before changing logic.

## Tasks
1. Create branch `backend/stage-0`. Run `npm ci && npm run lint && npx tsc -p tsconfig.app.json --noEmit && npm test && npm run build`. Record results and failures in `docs/backend/BASELINE.md`. Fix only what blocks the gate; list everything else.
2. `.gitignore`: add `.env`, `.env.*`, `!.env.example`, `supabase/.temp`, `supabase/.branches`. Create `.env.example` with the three `VITE_` keys plus `VITE_SITE_URL`. `git rm --cached .env` if tracked. Search the repo for `service_role`, `sk_`, `rzp_`, `eyJ` literals and report any secret-like string.
3. Lock `supabase/functions/generate-assessment` immediately: set `verify_jwt = true` in `supabase/config.toml`, reject calls without a valid user, cap `num_questions` to 30 and skills to 20, and require role `employer` or admin. Do not rebuild it yet (that is Stage A1); just stop the unauthenticated abuse. Never return answer keys to a caller that is not an author.
4. Create `supabase/functions/_shared/`:
   - `cors.ts`: origin allow-list from `ALLOWED_ORIGINS`, handles `OPTIONS`, `Vary: Origin`.
   - `auth.ts`: `requireUser(req)` returns `{ user, userClient, admin }`, throws typed 401/403.
   - `http.ts`: `json()`, `badRequest()`, `serverError()` that never leaks stack traces; adds `x-request-id`.
   - `validate.ts`: small zod-style validators (use `zod` from esm.sh pinned version).
   - `ai.ts`: provider-agnostic interface `complete({system, messages, schema})` and `embed(texts)` with adapters for Gemini, OpenAI, Anthropic selected by `AI_PROVIDER`. Replace nothing yet; adapters only.
   Apply `cors.ts` to `payments` and `sign-credential`. Keep `verify_jwt=false` only for `payments` (webhook is HMAC-authenticated); `payments?action=create|verify` already call `getUser()`, keep that.
5. Remove Lovable runtime coupling: `lovable-tagger` from `vite.config.ts` and devDependencies; leave `.lovable/` docs untouched. Do not touch UI code.
6. Regenerate `src/integrations/supabase/types.ts` (`supabase gen types typescript --project-id uoxokxgbpylfsanffsxm`). Keep `src/services/db.ts` untyped export for now, but add `src/services/rpcTypes.ts` exporting typed argument/return interfaces for the RPCs you add from Stage 1 onward.
7. Migration `…_cron_jobs.sql`: guarded block (`if exists (select 1 from pg_extension where extname='pg_cron')`) scheduling `expire-attempts` (every minute, `expire_overdue_attempts()`) and `cancel-stale-orders` (every 10 min, `cancel_stale_orders()`). Later stages append jobs by adding their own migration.
8. CI: `.github/workflows/ci.yml` running lint, typecheck, tests, build on every PR. Add a `supabase db lint` step if the CLI is available in CI, otherwise a script that applies all migrations to PGlite in order and fails on error.
9. Create `docs/backend/SETUP_TODO.md` from the secrets table in the Master Context.

## Acceptance
- CI green on a clean checkout. `BASELINE.md` exists with real numbers.
- `curl` to `generate-assessment` with no `Authorization` returns 401. With a candidate token returns 403.
- No `.env` tracked. `grep -R "lovable-tagger"` returns nothing in config.
- Migrations apply from empty on PGlite with zero errors.

## Out of scope
Auth redesign, employer features, UI changes.
