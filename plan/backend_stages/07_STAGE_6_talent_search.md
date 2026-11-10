# STAGE 6 — Talent search, unlock, pools, invites, messaging

**Goal:** employers can discover candidates who did not apply, without scraping risk and without violating candidate privacy.

## Read first
`profiles` (`profile_visibility`, `open_to_work`, `availability_status`), `candidate_embeddings`, `profile_views`, `cir_reports`, `skills`, `components/pro/ProDiscoverView.tsx` and employer talent screens (`ProEmployerViews.tsx`), wallet functions (`wallet_transfer`, `get_or_create_my_wallet`) and `platform_services`.

## Tasks
1. **Visibility rules (single SQL function `candidate_visible_to_tenant(candidate, tenant)`):** `public` → searchable; `applied_only` → visible only to tenants the candidate applied to; `private` → never; candidate blocked this company → never; candidate under account deletion → never; unverified candidate email → never.
2. `search_candidates(p_filters jsonb, p_cursor jsonb, p_limit int ≤ 50)` — permission `talent.search`, tenant verified, entitlement-gated (`consume_entitlement` hook). Filters: skills (with verified-only toggle), min CIR, tier, city/state, remote-ok, experience range, notice period, expected salary band, availability, industries, certifications, language. Returns **masked** cards: initials + first name, headline, city, experience, skill chips, CIR tier/score, verified flags, match % vs an optional `p_job`. No email/phone/photo URL until unlock.
3. Semantic search: edge function `talent-search` takes a natural-language query, embeds it (`_shared/ai.ts`), calls `search_candidates_semantic(query_embedding vector(1536), filters…)` **as the user** (their JWT) so permission checks still run. Hybrid ranking = 0.5 vector + 0.3 skill overlap + 0.2 CIR, documented and tested. HNSW index exists; verify with `EXPLAIN`.
4. `unlock_candidate_contact(p_candidate uuid, p_job uuid default null)` — permission `talent.unlock`, charges credits through `wallet_transfer` (tenant wallet → platform), idempotent per `(tenant, candidate)` forever, returns contact + resume link (signed URL), writes `profile_views` and `audit_log`, notifies the candidate respecting `notification_prefs`, daily cap per plan, refuses blocked/deleted candidates.
5. Pools and notes: `talent_pools`, `talent_pool_members(pool_id, candidate_id, added_by, tag, note)`; RPCs to create/rename/delete pools, add/remove members, tenant-shared. Saved searches `saved_candidate_searches` + a daily digest hook for Stage 8.
6. Invites: `candidate_invites(id, tenant_id, job_id, candidate_id, message ≤ 1000, status check in ('sent','accepted','declined','expired'), sent_by, expires_at)`; `invite_candidate_to_apply` (permission, plan cap/day, no duplicate within 30 days, requires unlock or search visibility rule); candidate `respond_invite` → accept prefills an application (reusing `apply_to_job`).
7. Messaging: `message_threads(id, tenant_id, candidate_id, job_id, application_id null, created_by)` + `messages`. Allowed only when (a) the candidate applied, or (b) an invite was accepted, or (c) contact unlocked and candidate has not disabled employer messages. Rate limits, 2000 chars, report/block RPCs (`report_message`, `block_company`), staff review queue. Realtime on `messages` for participants only.
8. Candidate controls: `candidate_company_blocks`, `set_profile_visibility`, "who viewed my profile" RPC (aggregated by company + date, identity gated by plan), notification preference per event type.
9. Anti-scraping: per-tenant and per-user rate limits via `rate_limit_hit`, max 500 candidate cards/day/tenant on the standard plan, no bulk export (enterprise export is AAL2 + audit logged + watermarked CSV), repeated sequential id/probing detection flag in `abuse_signals`.
10. Services: `src/services/employer/talent.ts`; wire later in Stage 9.

## Tests
Visibility matrix (public / applied_only / private × applied or not × blocked × deleted × unverified); masking (assert absent fields in JSON); unlock idempotency, ledger balance, insufficient funds `P0402`; cross-tenant pools; invite dedupe and caps; messaging gate paths; cap/rate-limit enforcement; semantic RPC rejects wrong-dimension vectors; scraping flag.

## Acceptance
A verified employer searches "react typescript, 3+ yrs, Bengaluru", sees masked results ranked by hybrid score, unlocks one candidate once (charged once), invites them to a job, candidate accepts and appears in the pipeline.
