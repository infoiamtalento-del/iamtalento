# STAGE 3 — Employer profile, company page, dashboard

**Goal:** the employer's company data is stored, validated and public-safe; dashboard numbers come from the server.

## Read first
`employers` table (`…20260221103809`), `pages/EmployerProfileBuilder.tsx`, `ProEmployerProfileView.tsx`, `ProEmployerViews.tsx` (dashboard), `ProUser.cp` shape in `data/proData.ts`, `services/candidate/profile.ts` (pattern to copy).

## Tasks
1. Migration: extend `employers` to cover everything the UI captures: `mission`, `benefits text[]`, `hq_city`, `social_links jsonb`, `gstin`, `pan`, `billing_address jsonb`, `slug` (unique, public), `cover_url`, `culture_tags text[]`, `hiring_regions text[]`. Add length/format constraints and `all_http_urls` checks. Encrypt `pan` at rest (Vault / pgsodium column encryption or application-level via a definer function) — do not store plaintext.
2. RPCs (permission `company.edit` / any member for read):
   - `save_employer_profile(p jsonb)`: whitelist keys, validate, normalize, recompute `profile_completion`, never touches verification fields (`employers_protect` stays).
   - `get_employer_profile()`.
   - `get_public_company(p_slug text)` anonymous-readable: name, logo, about, mission, industry, size, HQ, website, benefits, active job count. Nothing about contacts or billing.
3. Storage: public-read bucket `company-logos` (png/jpg/webp/svg-sanitized or exclude svg, 2 MB, path `<tenant_id>/…`, writes require `company.edit`).
4. `employer_dashboard()` single round trip returning: open/draft/paused jobs, total applicants and by stage, applicants waiting > 24 h unviewed (SLA breaches), interviews next 7 days, offers pending, wallet balance, plan + usage (stub until Stage 7), unread notifications, 14-day applications trend, top 5 jobs by applicants, verification status banner.
5. Link `jobs.company_name`, logo and slug to the employer so job cards stay in sync on rename (trigger updating denormalized `company_name`).
6. Service layer: `src/services/employer/profile.ts`, `dashboard.ts`.

## Tests
Validation (GSTIN, URLs, lengths), cross-tenant read/write, public company projection leaks nothing private, completion calc, dashboard numbers against a seeded fixture, rename propagation.

## Acceptance
Saving the Company Profile as a real employer persists after reload on another browser; `/company/<slug>` data is retrievable anonymously; dashboard RPC runs < 100 ms on 10k applications fixture (add an `EXPLAIN` note to the report).
