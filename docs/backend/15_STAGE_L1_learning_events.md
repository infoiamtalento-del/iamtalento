# STAGE L1 — Learning, mentors, hackathons, events (run after Stage 10; can be deferred)

**Goal:** replace static pages with a real catalog and delivery pipeline.

## What already exists
`…100300_learning_events.sql`: `lms_courses`, `lms_modules`, `course_enrollments`, `courses` (profile course records), `enroll_in_course`, `complete_module`, entitlement helper, `mentor_profiles/slots/bookings` with `book_mentor_slot`/`cancel_mentor_booking`, `hackathons`, `hackathon_teams/registrations/submissions` with `register_for_hackathon`, `join_hackathon_team`, `submit_hackathon_project`, `event_registrations` with `register_for_event`. Static today: `data/learningCourses.ts`, `pages/Learning.tsx`, `CourseDetail.tsx` (partly wired), `Hackathons.tsx`, `Hackathon2.tsx`, `Hackathon3.tsx`, `Networking.tsx`, `Webinars.tsx`, `Meetups.tsx`, `Podcast.tsx`, `Podcasts.tsx`, plus the `corporate-learning` employer menu item. Before changing anything, document how `courses` and `lms_courses` differ and keep both unless a safe merge is proven.

## Tasks
1. **Catalog**: seed the static catalog into `lms_courses/modules` (reference data, not demo), add `slug`, `level`, `language`, `skills[]`, `category`, `duration`, `rating_avg/count`, `instructor_id`, `status`; public read RPCs `list_courses(filters, cursor)`, `get_course(slug)` (preview modules visible, rest gated). Switch the static pages to RPCs with the same layout and loading states.
2. **Delivery**: video through Cloudflare Stream or Mux with signed playback tokens from edge function `playback-token` (checks enrollment/entitlement and device/rate limits); files/transcripts via signed Storage URLs; resume position per module; watch-time based completion (≥ 90%) plus quiz.
3. **Quizzes**: module quizzes reuse the assessment question engine (`question_bank`, server grading, no keys to client); pass mark and retake policy per module.
4. **Certificates**: on completion issue a `verifiable_credentials` row (type `course`), sign via `sign-credential`, PDF server side, public verify page, LinkedIn "add to profile" link.
5. **Reviews and discovery**: `course_reviews` (enrolled + ≥ 20% progress, one per user, moderation flags), wishlist, "continue learning", learning paths linked to `candidate_skill_gap` (Stage 10).
6. **Authoring**: role `instructor` as a `tenant_memberships`-style role on a `content_providers` org; RPCs `create_course`, `add_module`, `submit_for_review`, admin `approve_course`; versioning so published content can be edited without breaking enrollments; coupons and bundles via existing coupon engine; revenue share ledger `provider_earnings` (accounting only, payouts manual in v1).
7. **AI companion** (USP "AI companion"): edge function `learning-assistant` doing retrieval over the learner's enrolled course text (chunk + embed into `course_chunks` vector(1536)), answers with citations to modules, per-user daily quota, refuses off-catalog legal/medical advice, logs to `ai_usage`.
8. **Corporate learning (employers)**: `learning_seats(tenant_id, course_id, seats, expires_at)` purchased via orders, `assign_seat(user/email)`, progress and completion reports per member, `export_team_learning_csv` (AAL2, audited), manager nudges via outbox.
9. **Mentors**: availability in IST + stored timezone, booking payment through orders (exists), meeting link generation (LiveKit or Google Meet link stored), reminders T−24 h/T−1 h, reviews, cancellation/refund policy table, mentor payouts tracked in `provider_earnings` (manual payout v1).
10. **Hackathons**: employer-sponsored creation by tenants (`create_hackathon` → admin approval), tracks, team size rules, submission windows enforced by DB time, judging rubric tables `hackathon_judges`, `hackathon_scores`, tamper-proof leaderboard view, winners publish RPC, certificates for participants, prize records (disbursement manual), notifications and calendar ICS.
11. **Events / webinars / meetups / podcasts**: unify under `events(kind in ('webinar','meetup','networking','podcast'), city, starts_at, capacity, waitlist, recording_url, …)`, `register_for_event` with capacity + waitlist promotion, reminder emails, ICS, post-event recording and feedback form, podcast episodes ingest (RSS import function) with plays counted anonymously. Replace static arrays on the Networking/Webinars/Meetups/Podcast pages with RPCs, keeping each page's layout rules from `AGENTS.md`.
12. **Admin/content ops**: bulk upload CSV for catalog, scheduled publish, soft delete, audit.

## Tests
Entitlement gating of paid modules (signed URL denied without entitlement), progress idempotency, certificate once-only and verifiable, review eligibility, seat assignment isolation across tenants, capacity/waitlist under concurrency, hackathon window enforcement and score aggregation, assistant retrieval limited to enrolled content, playback token rate limits.

## Acceptance
Every learning/event page renders from the database with identical layout; a learner can enroll, watch, pass a quiz, receive a verifiable certificate; an employer can buy seats, assign them and see progress; a hackathon runs from creation to leaderboard.
