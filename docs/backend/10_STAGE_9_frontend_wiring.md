# STAGE 9 — Frontend wiring: employer shell on the real backend

**Goal:** a real employer's Pro shell reads and writes Supabase; demo accounts remain 100% local; real accounts never see simulated data. No visual redesign.

## Read first
`pages/TalentoPro.tsx` (handlers around `tq_jobs`, `tq_apps`, `tq_users`, role switching, `useCandidateBackend` integration), `hooks/useCandidateBackend.ts` (pattern to mirror), `components/pro/ProEmployer*.tsx`, `ProEmployerSidebar.tsx`, `components/pro/employerMenu.ts`, `data/employerDemo.ts`, `services/db.ts` (`registerId/uuidFor`), root `AGENTS.md` UI rules.

## Tasks
1. Services (thin wrappers over `rpc()` / `db.from()` reads), one file per domain: `src/services/employer/{profile,dashboard,jobs,applications,interviews,offers,talent,billing,ads,team,notifications,support,audit}.ts`, each with exported TypeScript types from Stage migrations.
2. Hook `src/hooks/useEmployerBackend.ts` mirroring `useCandidateBackend`: loads jobs, applications (paginated, keyset), dashboard, wallet/plan/usage, notifications; realtime channels filtered by `tenant_id` for `job_applications`, `scheduled_interviews`, `offers`, `notifications`, `messages`; exposes actions (`postJob`, `publish`, `move`, `bulkMove`, `addNote`, `schedule`, `sendOffer`, `unlock`, `invite`, `topUp`, …) with optimistic update + rollback and normalized errors (`backendErrorMessage`).
3. In `TalentoPro.tsx`: introduce one switch `const live = !demoOnly && !!ctx.userId`. When `live && role==='employer'`, handlers call the hook; otherwise the existing localStorage logic runs unchanged. Delete no demo code. Stop reading `tq_users` for role (use `useAuth().ctx`).
4. Map ids: DB uuid ↔ the UI's numeric ids via `registerId/uuidFor` (already used for candidates); never persist the numeric id.
5. Replace per-view simulated state for **real** employers: `EmployerDemoState` (assessments, aiInterviews, campaigns, plan, preferences, security) → backend (campaigns, plan: Stage 7; preferences and security: Stage 1/8; assessments and AI interviews: Stage A1). Until A1 lands, render an honest "Coming soon" card for those two views for real accounts.
6. States: skeleton, empty, error-with-retry, "verify your email", "company pending verification" banner explaining limits, plan-limit upsell dialog on `P0402`, session-expired handling (`28000` → sign-in redirect preserving the path).
7. Candidate shell fixes: ensure Applied/Interviews/Offers views read `my_application_timeline`, offers inbox with accept/decline, interview accept/propose, notification deep links (`/talento-pro?view=…`) resolve.
8. Delete dead paths for real accounts only: `DEFAULT_USERS` seeding into real-user entries in `establishProSessionForUser` (it currently clones `demo.employer@talento.app` into `tq_users[realEmail]`); real users need no local user object except display cache, and must not store `pw`.
9. Performance: virtualize long lists if > 200 rows, debounce search (300 ms), cancel in-flight requests on unmount, React Query for caching where it simplifies (hook may use it).
10. Accessibility and i18n not in scope; do not alter copy.

## Tests
Component/integration tests with the PGlite harness or a mocked `rpc`: live vs demo switch, error mapping, optimistic rollback, realtime event handling. Add Playwright later in Stage 12.

## Acceptance
Manual script (put in the Stage Report): sign up as employer → verify → complete company profile → post a job → it appears in a candidate browser → candidate applies → employer sees the application without refresh → shortlist → candidate notification appears. Switching to the demo employer still shows seeded sample data and never touches Supabase (verify in the network tab).
