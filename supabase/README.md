# IAmTalento backend (Supabase now, PostgreSQL later)

All business rules live in Postgres (RLS + `SECURITY DEFINER` functions), so the same
migrations run on plain PostgreSQL 15+ when you outgrow Supabase. Only `auth.uid()` and the
`extensions` schema are Supabase specific.

## Deploy

```bash
supabase link --project-ref uoxokxgbpylfsanffsxm
supabase db push                       # applies every file in supabase/migrations
supabase gen types typescript --project-id uoxokxgbpylfsanffsxm > src/integrations/supabase/types.ts

supabase secrets set RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=... RAZORPAY_WEBHOOK_SECRET=...
supabase secrets set CREDENTIAL_SIGNING_KEY="$(openssl genpkey -algorithm ed25519 -outform DER | base64 -w0)" CREDENTIAL_KEY_ID=v1
supabase functions deploy payments sign-credential
```

Razorpay webhook URL: `https://<project>.functions.supabase.co/payments?action=webhook`
(events: `payment.captured`, `order.paid`).

Expire overdue assessment attempts every minute (pg_cron):

```sql
select cron.schedule('expire-attempts', '* * * * *', $$select public.expire_overdue_attempts()$$);
```

Grant yourself admin (catalog / coupon / course management):

```sql
insert into public.platform_admins (user_id) values ('<your auth user id>');
```

## Migration order

| File | Contents |
| --- | --- |
| `…100000_platform_foundation` | tenants, memberships, API keys, jobs (extends `employer_job_openings`), ATS, notifications, support, embeddings |
| `…100050_billing_wallet` | GST orders, double-entry wallet ledger, coupons, referrals, subscriptions |
| `…100200_assessment_engine` | catalog, journeys (4 core + 1 domain), attempts, server grading, proctoring hash chain, AI interviews, CIR, verifiable credentials |
| `…100300_learning_events` | courses, mentors, hackathons, event registrations |
| `…100400_candidate_job_logic` | match score, apply / save / withdraw, notifications, dashboard, attempt expiry |
| `…100500_seed_platform_data` | 20 jobs, 4 core + 2 domain tests with questions, courses, mentors, hackathons, coupons |
| `…100600_platform_services` | wallet-purchasable add-ons (profile boost, resume review, …) |

## Rules enforced server side

* Candidates never receive answer keys (`question_answer_keys` has no client policy).
* Timers are authoritative on the server; autosave is rejected after `server_expires_at`.
* Core tests unlock in order; the domain test unlocks only after all four core tests.
* Money moves only through `wallet_transfer` (service role / definer functions). Every
  transfer is a debit + credit pair, and the ledger is append-only.
* Webhooks verify the HMAC and the paid amount before entitlement is granted, and
  `_fulfill_order` is idempotent.
* `proctoring_events` is append-only and hash-chained per attempt.

## Wiring the rest of the app

`src/services/candidate/*` are thin wrappers over the RPCs. `useCandidateBackend` bridges the
Pro shell: public jobs load for everyone, private data only for a real signed-in candidate,
so demo accounts never touch real data.
