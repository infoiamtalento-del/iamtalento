# STAGE 8 — Notifications, email/SMS outbox, job alerts, support

**Goal:** every business event reaches the right person reliably (in-app + email, SMS where allowed), with preferences, retries and suppression.

## Read first
`notifications`, `push_notification`, `notification_prefs` (profiles), `job_alerts`, `job_alert_queue`, `queue_job_alerts`, `support_tickets/messages`, `create_support_ticket`, `reply_support_ticket`, `ProEmployerNotifications.tsx`, `ProNotificationsView.tsx`, `ProSupportView.tsx`, `functions/_shared/*` (Stage 0).

## Tasks
1. **Outbox.** Table `notification_outbox(id, user_id null, to_email, to_phone, channel check in ('email','sms','push'), template, payload jsonb, dedupe_key unique, status check in ('pending','sending','sent','failed','dead','suppressed'), attempts, next_attempt_at, last_error, created_at, sent_at)`. `push_notification(...)` keeps writing the in-app row and now also enqueues email/SMS according to `notification_prefs` and a per-kind policy table `notification_kinds(kind, default_channels, can_unsubscribe, digest_ok)`. Security-critical kinds (password, login alert, billing, offer) cannot be unsubscribed.
2. **Worker.** Edge function `outbox-worker` (cron every minute, also callable by service role): claims with `update … where id in (select … for update skip locked limit 50)`, renders template, sends through provider adapter (Resend / SES / Brevo for email; MSG91 or Twilio for SMS — Indian SMS requires DLT-registered templates, store `dlt_template_id` per template), exponential backoff (1m, 5m, 30m, 2h, 12h), `dead` after 6 attempts, structured logs, metrics counters table `outbox_stats_daily`.
3. **Templates** under `supabase/functions/_shared/templates/` (HTML + text, mobile-safe, brand header, no remote tracking pixels by default): welcome/verify (auth uses GoTrue templates from Stage 1), application received, stage changed (per stage), interview invite with ICS, interview reminder, interview rescheduled/cancelled, offer sent/accepted/declined, job alert instant + daily digest, employer new-applicant digest, SLA warning, job expiring/expired, team invite, invoice paid, payment failed/dunning, assessment invite/result, identity verification result, login alert, account deletion confirmation. All user-controlled strings HTML-escaped; links use `VITE_SITE_URL`.
4. **Deliverability.** `email_suppressions(email, reason, at)`, provider webhook edge function `email-events` (bounce/complaint → suppress, signature-verified), `List-Unsubscribe` + one-click unsubscribe endpoint using signed tokens, SPF/DKIM/DMARC checklist into `SETUP_TODO.md`.
5. **Job alerts consumer.** `process_job_alert_queue()` + worker step: instant alerts for matching new active jobs (respect frequency, quiet hours, cap 5/day), daily digest at 08:00 IST via cron, include unsubscribe + manage links; dedupe by `(alert_id, job_id)`.
6. **In-app.** Add `notifications.priority`, `notifications.group_key`; RPC `list_notifications(filter, cursor)`; keep `mark_notifications_read`. Employer notifications use the same table with tenant fan-out helper `notify_tenant(tenant, perm, …)` (sends to members holding a permission).
7. **Support.** Ticket categories + priority by plan SLA (`plans.limits.support_sla_hours`), attachments (private bucket `support-files`, 5 files × 5 MB), staff RPCs `admin_list_tickets`, `staff_reply` (AAL2, audited), status transitions, CSAT after resolve, email-on-reply, auto-close after 7 days inactive. Employers and candidates use the same RPCs (tickets carry `tenant_id` when relevant).
8. **Push** (optional, web push): `push_subscriptions` table, VAPID keys in secrets, worker channel `push`. Mark clearly optional.

## Tests
Preference matrix (channel × kind × unsubscribable), dedupe keys, claim concurrency (two workers never send the same row), backoff schedule, suppression honored, template escaping (XSS payloads in names/titles), alert frequency caps, tenant fan-out only to permitted members, support SLA and staff-only visibility.

## Acceptance
Applying to a job produces: in-app notification + email to the employer; moving to Shortlisted produces in-app + email to the candidate; a bounced address stops further sends; digest arrives once per day.
