# STAGE 2 — Organizations, roles, permissions, admin

**Goal:** a real employer identity (tenant), team access, a permission matrix, employer verification, audit trail, and the hotfix for D2.

## Read first
`…100000_platform_foundation.sql` (tenant tables, `is_tenant_member`, `can_manage_job`), `…100800_security_hardening.sql` (`employers_protect`, `jobs_protect`, `tenant_owner_membership`), `pages/EmployerProfileBuilder.tsx`, `components/pro/employerMenu.ts`, `ProEmployerMyAccount.tsx` (team/security UI), `data/proData.ts` (`ProUser.cp`).

## Tasks

### 2.1 Hotfix D2 (first commit of the stage)
Replace the policy "Employers can manage own job openings" so writes require `public.has_role(auth.uid(), 'employer')` and the caller's employer record is not `suspended`. Add a regression test: an `employee` cannot insert, update or delete any row in `employer_job_openings`, and cannot flip `status` on someone else's job. (Stage 4 removes direct writes entirely.)

### 2.2 Tenant bootstrap
- On employer signup (`handle_new_user` for email signups, `complete_signup` for OAuth) create `tenant_organizations` (unique slug from company name with collision suffix, `plan='free'`, `employer_id`, `owner_user_id`, `billing_state` null) — the existing trigger adds the owner membership. Backfill every existing `employers` row without a tenant.
- `employers.tenant_id` FK (nullable → backfilled → set not null).
- `get_my_context()` returns the tenant and the caller's tenant role.

### 2.3 Permission matrix
Create `tenant_role_permissions(role, permission)` seeded and `public.has_tenant_permission(_tenant uuid, _perm text) returns boolean` (stable, definer). Permissions: `job.create, job.publish, job.edit, app.view, app.move, app.note, interview.schedule, interview.feedback, offer.send, talent.search, talent.unlock, assessment.create, assessment.invite, billing.view, billing.manage, team.manage, api.manage, company.edit`. Matrix:
- owner/admin: all (admin lacks `billing.manage` ownership transfer)
- recruiter: job.*, app.*, interview.schedule, offer.send, talent.*, assessment.*
- hiring_manager: job.create/edit, app.view/note/move, interview.*, assessment.invite
- interviewer: app.view (assigned only), interview.feedback
- viewer: app.view, billing.view
Document it in `docs/backend/PERMISSIONS.md`. All new employer RPCs use this function, never ad-hoc role arrays.

### 2.4 Team management
Tables: `tenant_invites(id, tenant_id, email, role, token_hash, invited_by, expires_at, accepted_at, revoked_at)`.
RPCs (all require `team.manage`, verified email, AAL2 for role changes to admin/owner): `invite_team_member(email, role)`, `revoke_invite(id)`, `accept_invite(token)` (caller's verified email must equal the invite email; becomes member; employer role granted only if they have no `employee` role, otherwise error), `change_member_role`, `remove_member`, `leave_tenant`, `transfer_ownership`. Protect the last owner. Seat limit via `plan` (hook for Stage 7 `check_quota`). Invite email via outbox (Stage 8; for now write the outbox row or a notification).

### 2.5 Employer verification and moderation
- Private bucket `employer-docs` (PDF/JPG/PNG, 10 MB, folder = tenant id, owner read/write, admin read).
- `submit_employer_verification(docs jsonb)` stores document paths + GSTIN/CIN/PAN formats validated by regex; flags free-mail official emails and domain mismatch between `official_email` and `website`.
- `review_employer_verification(employer_id, approve, reason)` admin only (AAL2). Sets `employers.verification_status` (`pending → verified | rejected | suspended`), notifies, writes audit.
- Behavior by status (enforced in Stage 4/6 RPCs through `public.employer_can(_tenant, 'publish'|'unlock'|'search')`): pending = drafts + 1 job that goes to `pending_review`; verified = normal; suspended = read-only, all listings hidden.

### 2.6 Audit log
`audit_log(id bigint identity, at, actor_id, tenant_id, action, entity, entity_id, meta jsonb, ip_hash)`, insert only through `public.log_audit(...)`, update/delete blocked by trigger, indexed by `(tenant_id, at desc)`. Called from every privileged RPC in this and later stages. Tenant admins can read their tenant's rows; platform admins read all. RPC `list_audit_log(filters, cursor)`.

### 2.7 Platform admin RPCs (AAL2 + `is_admin()`)
`admin_list_employers(status, q, cursor)`, `admin_review_employer`, `admin_suspend_user(user_id, reason)`, `admin_list_jobs_pending()`, `admin_moderate_job(job_id, approve, reason)`, `admin_list_identity_reviews()`, `admin_stats()`. No UI in this stage; expose via a thin `src/services/admin/*.ts` and a minimal protected route `/admin` only if a UI already exists (do not invent design; otherwise document the SQL calls).

## Tests
Cross-tenant matrix (A vs B for every table/RPC added or touched), permission matrix per role, last-owner protection, invite token replay/expiry/wrong email, employee→employer escalation attempts, suspended employer behavior, audit immutability, admin AAL2 gate, backfill idempotency.

## Acceptance
- Every real employer has exactly one tenant and one owner membership.
- A candidate JWT gets `42501` on every employer RPC.
- `select * from pg_policies where tablename='employer_job_openings'` shows no write policy without a role check.
- `PERMISSIONS.md` matches the seeded table (test asserts it).
