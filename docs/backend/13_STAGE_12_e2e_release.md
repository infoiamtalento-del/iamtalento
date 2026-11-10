# STAGE 12 — End-to-end tests and release gate

**Goal:** prove the loops with a browser, then ship.

## Tasks
1. Playwright project against `supabase start` + `vite preview`, with test helpers to create confirmed users through the admin API (test env only) and read emails from Inbucket.
2. Scenarios (each a spec file):
   - **S1 Hiring loop**: employer signup → verify email → company profile → admin approves → post job → candidate signup → verify → onboarding → apply → employer shortlist → schedule → candidate accepts → feedback → offer → accept → job auto-closes → both timelines correct.
   - **S2 Billing**: free-limit hit → Razorpay test checkout (mock the gateway in CI) → entitlement lifts → invoice numbered → webhook replay no-op → cancel → downgrade.
   - **S3 Assessment** (after A1): paid domain test gating, timer, proctoring signals, CIR issued, employer sees report only with consent.
   - **S4 Security negatives**: forged role in localStorage, cross-tenant IDs, replayed invite, SQL/HTML injection strings through every form, rate-limit trips, expired session mid-action.
   - **S5 Demo isolation**: demo employer/candidate flows produce zero Supabase writes (assert on network log).
3. Load test (k6): 200 rps `search_jobs`, 50 rps `apply_to_job`, 20 rps `list_applications`; thresholds in repo.
4. Release checklist `docs/backend/RELEASE_CHECKLIST.md`: env/secrets verified, dashboard auth settings, SMTP/DMARC, Razorpay live keys + webhook, cron jobs present, backups, Sentry, CSP enforced, seed data absent, admin accounts with MFA, legal pages live, rollback plan, on-call contacts.
5. Final report: coverage map (every Pro view → real backend), open risks, owner actions.

## Acceptance
All specs green in CI; checklist fully ticked; tag `v1.0.0-backend`.
