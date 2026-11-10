# STAGE 1 — Authentication, sessions, account lifecycle

**Goal:** a real, verifiable identity layer. Fixes D1, D4, D5, D6, D8. Supabase Auth (GoTrue) becomes the only identity provider; no code writes to `auth.*`.

## Read first
`supabase/migrations/…100700_signup_roles.sql`, `…101100_auth_reliability.sql`, `…100800_security_hardening.sql` (user_roles, rate limits), `src/services/authSession.ts`, `pages/Auth.tsx`, `AuthCallback.tsx`, `ResetPassword.tsx`, `OnboardingWizard.tsx`, `hooks/useSupabaseUser.ts`, `App.tsx`, `src/test/backend/auth.test.ts`, `security.test.ts`, `harness.ts`.

## Tasks

### 1.1 Migration `…_auth_v2.sql`
- Drop trigger `trg_auto_confirm_auth_user` and function `auto_confirm_auth_user()`.
- Add `profiles.email_verified_at timestamptz`. Trigger `after update of email_confirmed_at on auth.users` (security definer) sets it when `email_confirmed_at` goes from null to not null. Backfill: set it only for users who verify from now on; **all existing real users start unverified** (their previous confirmation was automatic). Exclude the two demo emails.
- `public.is_email_verified()` helper and `public.require_verified_email()` (raises `P0403` "Please verify your email to continue"). Call it from sensitive RPCs: `apply_to_job`, `create_payment_order`, `submit_identity_verification`, `start_assessment_attempt`, `register_for_event/hackathon`, `book_mentor_slot`, `enroll_in_course`, `create_support_ticket` is allowed unverified. Employer RPCs added later must call it too.
- `public.mark_email_verified()` for legacy users: succeeds only if `auth.jwt()->'amr'` contains an `otp` or `email` method entry with timestamp < 10 minutes old and `auth.users.email` matches.
- Table `consents(user_id, kind check in ('terms','privacy','marketing','data_processing'), version, accepted_at, ip_hash, user_agent_hash)` with insert-only RPC `record_consent(kind, version)`.
- Table `auth_events(id, user_id, kind check in ('login','login_new_device','password_changed','mfa_enrolled','mfa_removed','email_changed','session_revoked','account_deletion_requested'), device_hash, ip_hash, ua text, created_at)` + RPC `record_login_event(p_device_hash text)` which compares to previous devices, writes the event, and on a new device calls `push_notification` when `notification_prefs.login_alerts` is true (email goes through the outbox in Stage 8; for now in-app only).
- Replace `handle_new_user()` so it **only ever creates an `employee`** unless `raw_user_meta_data.role = 'employer'` came from email signup (OAuth signups never get employer). Employer creation of tenant is Stage 2.
- RPC `complete_signup(p_role text, p_full_name text, p_company_name text default null, p_phone text default null)` for OAuth first logins: idempotent, only callable when the user has no `user_roles` row beyond the default, rate-limited, validates inputs exactly like the old register RPC. Roles remain exclusive per account (existing UI assumes `hasEmployer && !hasEmployee`). Adding a second role is admin-only.
- RPC `get_my_context()` returns `{ user_id, email, email_verified, role, is_admin, aal, employer: {…}|null, tenant: {id, role}|null, profile_completion, onboarding_completed, flags }`. This is the single source the UI uses for role and guards.
- `custom_access_token_hook(event jsonb)` adding `app_role` and `is_admin` claims for UI hints only (RLS never relies on them). Register it in `supabase/config.toml`.
- Drop `register_user_account` and `confirm_unverified_account` **in the same release as the client change** (keep a one-release guard: raise a clear error if called).
- `request_account_deletion()` (sets `profiles.deletion_requested_at`, revokes active listings/applications per policy, notifies), `cancel_account_deletion()`, and a cron-driven `purge_deleted_accounts()` after 30 days that anonymizes financial rows and deletes the rest via cascades. `export_my_data()` returns one JSON document with every row the user owns (profile sections, applications, assessments, CIR, orders, wallet ledger summary, consents).
- Password policy enforced in GoTrue config (below) and mirrored in the UI validator.

### 1.2 `supabase/config.toml`
```
[auth]
site_url = "<prod url>"
additional_redirect_urls = ["<prod>/auth/callback", "http://localhost:8080/auth/callback", "<preview pattern>"]
enable_signup = true
minimum_password_length = 10
password_requirements = "lower_upper_letters_digits"
[auth.email]
enable_confirmations = true
double_confirm_changes = true
secure_password_change = true
[auth.captcha]
enabled = true
provider = "turnstile"
[auth.mfa.totp]
enroll_enabled = true
verify_enabled = true
[auth.hook.custom_access_token]
enabled = true
uri = "pg-functions://postgres/public/custom_access_token_hook"
[auth.email.smtp]  # from SETUP_TODO secrets
```
Also set Auth rate limits (sign-ups, token refresh, OTP, email) deliberately, add branded templates in `supabase/templates/` (confirm, magic link, recovery, email change, invite) using `{{ .ConfirmationURL }}` / `{{ .Token }}`. Document the same toggles for the hosted dashboard in `SETUP_TODO.md` because `config.toml` only configures local dev.

### 1.3 Client
- `src/integrations/supabase/client.ts`: add `flowType: 'pkce'`, `detectSessionInUrl: true`. Remove the "auto generated" header (Lovable is no longer generating it).
- Rewrite `authSession.ts`: `signUpWithEmail()` uses `supabase.auth.signUp` with `emailRedirectTo = ${VITE_SITE_URL}/auth/callback`, `options.data = { full_name, phone, role, company_name, experience_level }`, Turnstile `captchaToken`. Remove `registerAndSignIn`, `signInWithPasswordAndRecover`, and the missing-function fallback. Keep `openDemoWorkspace`, `isSafeInternalPath`, `formatAuthError` (update messages).
- `Auth.tsx` states: sign in, sign up (role toggle exactly as today), check-your-inbox screen with resend (60 s cooldown), forgot password, OAuth buttons (Google; LinkedIn OIDC if enabled), 6-digit OTP entry as an alternative to the link. Do not change visual design.
- `AuthCallback.tsx`: exchange code (PKCE), call `get_my_context()`, if OAuth first login and no role chosen show a small role/company step that calls `complete_signup`, then route: employer → `/employer-profile` or `/talento-pro?view=dash&role=employer`; candidate → `/onboarding` or dashboard (existing logic in `establishProSessionForUser`).
- New `src/providers/AuthProvider.tsx` + `useAuth()` exposing `{ user, ctx, loading, role, emailVerified, aal, refresh, signOut }` from `get_my_context()`; replaces ad-hoc `useSupabaseUser`.
- New `<RequireAuth role="employee|employer|admin" requireVerified? requireAal2?>` wrapper in `App.tsx` for: `/talento-pro`, `/onboarding`, `/employer-profile`, `/my-profile`, `/profile-builder`, all `/assessment/*` runtime routes (test, precheck), `/dashboard`. Public marketing routes stay public. Demo sessions pass the guard only for `/talento-pro`.
- Stop trusting `tq_sess`/`tq_users` for real users: role and name come from `get_my_context()`. Keep those keys only for demo. Remove `pw` from any code path that touches a real account. On real sign-out clear all `tq_*` keys.
- Banner component "Verify your email" shown to unverified users; blocks sensitive actions with the server's `P0403` message.
- Security settings UI hooks (reuse `ProEmployeeMyAccount.tsx` / `ProEmployerMyAccount.tsx` existing panels, only wire data): change password (requires `supabase.auth.reauthenticate()` nonce), change email (double confirm), TOTP enroll/verify/unenroll (`supabase.auth.mfa.*`), list devices from `auth_events`, "sign out other sessions" (`signOut({ scope: 'others' })`), download my data, delete my account.

### 1.4 MFA enforcement
`public.require_aal2()` reading `auth.jwt()->>'aal'`. Required for: platform admin RPCs, employer owner/admin on billing, API keys, team management, data export of candidates (Stage 6), refunds. Candidates are optional-MFA except proctoring (already has OTP).

### 1.5 Tests (`src/test/backend/auth.test.ts` rewrite)
Simulate JWT claims via the harness. Cases: unverified user blocked from each guarded RPC; `mark_email_verified` rejects stale/absent `amr`; OAuth user cannot become employer via metadata; `complete_signup` idempotent and role-exclusive; no way to insert into `user_roles` or `platform_admins` as a client; `get_my_context` shape per role; consent insert-only; `record_login_event` new-device detection; `export_my_data` contains only caller rows; deletion request and cancel; `require_aal2` behaviour. Remove obsolete tests for the dropped RPCs.

## Acceptance
- Cannot sign in with an unconfirmed email on a real project; confirmation email arrives from the custom SMTP sender.
- `select proname from pg_proc where proname in ('register_user_account','confirm_unverified_account','auto_confirm_auth_user')` returns none.
- `grep -R "INSERT INTO auth\\." supabase/` shows only historical migrations.
- A candidate token cannot reach any employer route; editing `localStorage` does not change role.
- Password of 8 chars is rejected by the server; captcha required.
- All tests pass; Stage Report includes the manual dashboard checklist (SMTP, Site URL, redirect URLs, captcha, hook, leaked-password protection if the plan allows).

## Out of scope
Employer tenant creation (Stage 2), outbound email queue (Stage 8).
