-- =====================================================================
-- Super Admin Live Backend Wiring & Realtime Operations
-- Migration: 20261126100000_super_admin_live_wiring.sql
--
-- Ensures that every live user action (candidate/employer profile
-- creation, job posting, job applications, assessments/CIR, proctoring,
-- Razorpay/wallet payments, courses, mentors, hackathons, networking,
-- freelancing gigs, support tickets) is readable by platform admins
-- via RLS and every Super Admin console mutation persists cleanly to
-- PostgreSQL with audit logging and Supabase Realtime streaming.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Archive & Suspension Persistence Columns
-- ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists is_archived boolean not null default false,
  add column if not exists is_suspended boolean not null default false;

alter table public.employers
  add column if not exists is_archived boolean not null default false;

create index if not exists idx_profiles_archived on public.profiles(is_archived, created_at desc);
create index if not exists idx_employers_archived on public.employers(is_archived, created_at desc);

-- ---------------------------------------------------------------------
-- 2. Persistent Enterprise Configuration Store (AI prompts, RBAC, CMS,
--    Campaigns, KB, Workflows, Taxonomy, Plan Catalog)
-- ---------------------------------------------------------------------
create table if not exists public.admin_enterprise_store (
  key text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.admin_enterprise_store enable row level security;

drop policy if exists "Admins manage enterprise store" on public.admin_enterprise_store;
create policy "Admins manage enterprise store" on public.admin_enterprise_store
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 3. Complete Platform Admin Read / Manage RLS Policies across ALL tables
-- ---------------------------------------------------------------------
do $$
declare
  tbl text;
  admin_read_tables text[] := array[
    'profiles',
    'skills',
    'experiences',
    'educations',
    'certifications',
    'projects',
    'achievements',
    'courses',
    'accomplishments',
    'identity_verifications',
    'employers',
    'tenant_organizations',
    'tenant_memberships',
    'employer_job_openings',
    'job_applications',
    'application_stage_history',
    'scheduled_interviews',
    'assessment_journeys',
    'assessment_attempts',
    'proctoring_events',
    'cir_reports',
    'verifiable_credentials',
    'ai_interview_sessions',
    'payment_orders',
    'employer_subscriptions',
    'service_purchases',
    'coupon_redemptions',
    'wallet_accounts',
    'wallet_ledger_entries',
    'lms_courses',
    'course_enrollments',
    'mentor_profiles',
    'mentor_slots',
    'mentor_bookings',
    'hackathons',
    'hackathon_teams',
    'hackathon_registrations',
    'hackathon_submissions',
    'event_registrations',
    'freelance_gigs',
    'gig_proposals',
    'notifications',
    'support_tickets',
    'support_messages',
    'audit_log',
    'platform_settings'
  ];
begin
  foreach tbl in array admin_read_tables loop
    if exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = tbl
    ) then
      execute format('drop policy if exists "Platform admins read %1$s" on public.%1$I', tbl);
      execute format(
        'create policy "Platform admins read %1$s" on public.%1$I for select to authenticated using (public.is_admin())',
        tbl
      );
    end if;
  end loop;
end $$;

drop policy if exists "Platform admins manage platform_settings" on public.platform_settings;
create policy "Platform admins manage platform_settings" on public.platform_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Platform admins manage support_tickets" on public.support_tickets;
create policy "Platform admins manage support_tickets" on public.support_tickets
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Platform admins reply support_messages" on public.support_messages;
create policy "Platform admins reply support_messages" on public.support_messages
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Platform admins manage mentor_profiles" on public.mentor_profiles;
create policy "Platform admins manage mentor_profiles" on public.mentor_profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Platform admins manage hackathons" on public.hackathons;
create policy "Platform admins manage hackathons" on public.hackathons
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. Admin Session Introspection RPC
-- ---------------------------------------------------------------------
create or replace function public.is_current_user_admin()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _jwt jsonb := coalesce(auth.jwt(), '{}'::jsonb);
  _admin boolean := false;
begin
  if _uid is not null then
    select exists (select 1 from public.platform_admins where user_id = _uid) into _admin;
  end if;
  return jsonb_build_object(
    'authenticated', _uid is not null,
    'is_admin', _admin,
    'user_id', _uid,
    'email', _jwt ->> 'email',
    'aal', coalesce(_jwt ->> 'aal', 'aal1')
  );
end $$;

grant execute on function public.is_current_user_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Super Admin Persistent Write RPCs (all guarded by public.is_admin())
-- ---------------------------------------------------------------------

-- 5a. Candidate archive / restore
create or replace function public.admin_toggle_profile_archive(
  p_user_ids uuid[],
  p_archived boolean
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _count int;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  update public.profiles
  set is_archived = p_archived, updated_at = now()
  where id = any(p_user_ids);
  get diagnostics _count = row_count;
  perform public.log_audit(
    null,
    case when p_archived then 'candidate.archived' else 'candidate.unarchived' end,
    'profiles',
    array_to_string(p_user_ids, ','),
    jsonb_build_object('count', _count, 'archived', p_archived)
  );
  return _count;
end $$;
revoke all on function public.admin_toggle_profile_archive(uuid[], boolean) from public, anon;
grant execute on function public.admin_toggle_profile_archive(uuid[], boolean) to authenticated;

-- 5b. Employer archive / restore
create or replace function public.admin_toggle_employer_archive(
  p_employer_ids uuid[],
  p_archived boolean
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _count int;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  update public.employers
  set is_archived = p_archived, updated_at = now()
  where id = any(p_employer_ids);
  get diagnostics _count = row_count;
  perform public.log_audit(
    null,
    case when p_archived then 'employer.archived' else 'employer.unarchived' end,
    'employers',
    array_to_string(p_employer_ids, ','),
    jsonb_build_object('count', _count, 'archived', p_archived)
  );
  return _count;
end $$;
revoke all on function public.admin_toggle_employer_archive(uuid[], boolean) from public, anon;
grant execute on function public.admin_toggle_employer_archive(uuid[], boolean) to authenticated;

-- 5c. Candidate suspension toggle
create or replace function public.admin_toggle_candidate_suspension(
  p_user_id uuid,
  p_reason text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _next boolean;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  update public.profiles
  set
    is_suspended = not is_suspended,
    availability_status = case when not is_suspended then 'suspended' else 'available' end,
    updated_at = now()
  where id = p_user_id
  returning is_suspended into _next;

  perform public.log_audit(
    null,
    'candidate.status_toggled',
    'profiles',
    p_user_id::text,
    jsonb_build_object('suspended', coalesce(_next, false), 'reason', p_reason)
  );
  return coalesce(_next, false);
end $$;
revoke all on function public.admin_toggle_candidate_suspension(uuid, text) from public, anon;
grant execute on function public.admin_toggle_candidate_suspension(uuid, text) to authenticated;

-- 5d. Candidate KYC verification (works even when no identity_verifications row exists yet)
create or replace function public.admin_verify_candidate_kyc(
  p_user_id uuid,
  p_status text,
  p_reason text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  if p_status not in ('verified', 'rejected', 'pending', 'unverified') then
    raise exception 'Invalid KYC status' using errcode = '22023';
  end if;

  update public.profiles
  set
    verification_status = case when p_status in ('verified', 'pending') then p_status else 'unverified' end,
    updated_at = now()
  where id = p_user_id;

  insert into public.identity_verifications (user_id, verification_status, face_match_status, reviewed_by, reviewed_at, rejection_reason)
  values (
    p_user_id,
    case when p_status = 'unverified' then 'pending' else p_status end,
    case when p_status = 'verified' then 'matched' when p_status = 'rejected' then 'failed' else 'pending' end,
    auth.uid(),
    now(),
    case when p_status = 'rejected' then p_reason else null end
  )
  on conflict (user_id) do update set
    verification_status = excluded.verification_status,
    face_match_status = excluded.face_match_status,
    reviewed_by = excluded.reviewed_by,
    reviewed_at = excluded.reviewed_at,
    rejection_reason = excluded.rejection_reason,
    updated_at = now();

  perform public.push_notification(
    p_user_id,
    'verification',
    case when p_status = 'verified' then 'Identity verified' else 'Identity verification update' end,
    case when p_status = 'verified' then 'Your verified TalentCIR badge is now live.' else coalesce(p_reason, 'Verification status updated to ' || p_status) end,
    '/talento-pro?view=ver'
  );

  perform public.log_audit(
    null, 'candidate.kyc_updated', 'identity_verifications', p_user_id::text,
    jsonb_build_object('status', p_status, 'reason', p_reason)
  );
  return true;
end $$;
revoke all on function public.admin_verify_candidate_kyc(uuid, text, text) from public, anon;
grant execute on function public.admin_verify_candidate_kyc(uuid, text, text) to authenticated;

-- 5e. Job promotion tier update
create or replace function public.admin_promote_job(
  p_job_id uuid,
  p_tier text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  if p_tier not in ('none', 'featured', 'sponsored') then
    raise exception 'Invalid promotion tier' using errcode = '22023';
  end if;
  update public.employer_job_openings
  set
    promotion_tier = case when p_tier = 'none' then null else p_tier end,
    is_featured = (p_tier in ('featured', 'sponsored')),
    is_sponsored = (p_tier = 'sponsored'),
    promoted_until = case when p_tier = 'none' then null else now() + interval '14 days' end,
    updated_at = now()
  where id = p_job_id;

  perform public.log_audit(
    null, 'job.promotion_updated', 'employer_job_openings', p_job_id::text,
    jsonb_build_object('tier', p_tier)
  );
  return true;
end $$;
revoke all on function public.admin_promote_job(uuid, text) from public, anon;
grant execute on function public.admin_promote_job(uuid, text) to authenticated;

-- 5f. ATS application stage override
create or replace function public.admin_update_application_stage(
  p_application_id uuid,
  p_stage text,
  p_note text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _allowed text;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  _allowed := case lower(p_stage)
    when 'applied' then 'Applied'
    when 'shortlisted' then 'Shortlisted'
    when 'interview' then 'Interview'
    when 'offer' then 'Offer'
    when 'hired' then 'Offer'
    when 'rejected' then 'Rejected'
    when 'withdrawn' then 'Withdrawn'
    else 'Shortlisted'
  end;

  update public.job_applications
  set
    stage = _allowed,
    recruiter_note = coalesce(p_note, recruiter_note),
    updated_at = now()
  where id = p_application_id;

  perform public.log_audit(
    null, 'application.stage_override', 'job_applications', p_application_id::text,
    jsonb_build_object('stage', _allowed, 'requested_stage', p_stage, 'note', p_note)
  );
  return true;
end $$;
revoke all on function public.admin_update_application_stage(uuid, text, text) from public, anon;
grant execute on function public.admin_update_application_stage(uuid, text, text) to authenticated;

-- 5g. Assessment / Proctoring manual review override
create or replace function public.admin_review_assessment_attempt(
  p_attempt_id uuid,
  p_status text,
  p_note text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _att public.assessment_attempts;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  select * into _att from public.assessment_attempts where id = p_attempt_id;
  if not found then return false; end if;

  if p_status = 'Issued' then
    update public.assessment_attempts
    set
      status = 'graded',
      needs_manual_review = false,
      integrity_score = greatest(integrity_score, 92)
    where id = p_attempt_id;
    update public.verifiable_credentials vc
    set revoked_at = null
    from public.cir_reports cr
    where vc.cir_report_id = cr.id and cr.journey_id = _att.journey_id;
  elsif p_status in ('Flagged', 'Failed') then
    update public.assessment_attempts
    set
      status = case when p_status = 'Failed' then 'invalidated' else status end,
      needs_manual_review = true
    where id = p_attempt_id;
    if p_status = 'Failed' then
      update public.verifiable_credentials vc
      set revoked_at = now()
      from public.cir_reports cr
      where vc.cir_report_id = cr.id and cr.journey_id = _att.journey_id;
    end if;
  end if;

  perform public.log_audit(
    null, 'assessment.proctor_override', 'assessment_attempts', p_attempt_id::text,
    jsonb_build_object('status', p_status, 'note', p_note)
  );
  return true;
end $$;
revoke all on function public.admin_review_assessment_attempt(uuid, text, text) from public, anon;
grant execute on function public.admin_review_assessment_attempt(uuid, text, text) to authenticated;

-- 5h. Refund a payment order (credits user wallet + updates order status)
create or replace function public.admin_refund_payment_order(
  p_order_id uuid,
  p_reason text default 'Refund issued by Super Admin'
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _ord public.payment_orders;
  _wallet_id uuid;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  select * into _ord from public.payment_orders where id = p_order_id for update;
  if not found or _ord.status = 'refunded' then return false; end if;

  update public.payment_orders
  set
    status = 'refunded',
    metadata = metadata || jsonb_build_object('refund_reason', p_reason, 'refunded_at', now(), 'refunded_by', auth.uid()),
    updated_at = now()
  where id = p_order_id;

  if _ord.total_amount > 0 then
    insert into public.wallet_accounts (owner_type, user_id)
    values ('candidate', _ord.user_id)
    on conflict (user_id) where owner_type = 'candidate' do nothing;

    select id into _wallet_id from public.wallet_accounts
    where owner_type = 'candidate' and user_id = _ord.user_id;

    if _wallet_id is not null then
      perform public.wallet_transfer(
        public._platform_wallet('platform_revenue'),
        _wallet_id,
        _ord.total_amount,
        'Refund: ' || coalesce(_ord.item_ref, _ord.item_type),
        'refund',
        p_order_id::text,
        'rfnd-' || p_order_id::text
      );
    end if;
  end if;

  perform public.push_notification(
    _ord.user_id,
    'payment',
    'Refund processed',
    '₹' || _ord.total_amount || ' credited to your TalentCIR wallet (' || coalesce(p_reason, 'Admin refund') || ').',
    '/talento-pro?view=wallet'
  );

  perform public.log_audit(
    _ord.tenant_id, 'payment.refunded', 'payment_orders', p_order_id::text,
    jsonb_build_object('amount', _ord.total_amount, 'reason', p_reason)
  );
  return true;
end $$;
revoke all on function public.admin_refund_payment_order(uuid, text) from public, anon;
grant execute on function public.admin_refund_payment_order(uuid, text) to authenticated;

-- 5i. Double-entry Admin Wallet Adjustment (credit or debit)
create or replace function public.admin_adjust_wallet(
  p_wallet_id uuid,
  p_entry_type text,
  p_amount numeric,
  p_reason text default 'Super Admin adjustment'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _grp uuid;
  _platform uuid := public._platform_wallet('platform_float');
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be positive' using errcode = '22023';
  end if;
  if p_entry_type = 'credit' then
    _grp := public.wallet_transfer(_platform, p_wallet_id, p_amount, coalesce(p_reason, 'Admin credit'), 'admin_adjustment', auth.uid()::text, 'adm-cr-' || gen_random_uuid()::text);
  elsif p_entry_type = 'debit' then
    _grp := public.wallet_transfer(p_wallet_id, _platform, p_amount, coalesce(p_reason, 'Admin debit'), 'admin_adjustment', auth.uid()::text, 'adm-db-' || gen_random_uuid()::text);
  else
    raise exception 'Invalid entry type' using errcode = '22023';
  end if;

  perform public.log_audit(
    null, 'wallet.' || p_entry_type, 'wallet_ledger_entries', p_wallet_id::text,
    jsonb_build_object('amount', p_amount, 'reason', p_reason, 'tx_group', _grp)
  );
  return _grp;
end $$;
revoke all on function public.admin_adjust_wallet(uuid, text, numeric, text) from public, anon;
grant execute on function public.admin_adjust_wallet(uuid, text, numeric, text) to authenticated;

-- 5j. Support Ticket Staff Reply & Resolution
create or replace function public.admin_reply_support_ticket(
  p_ticket_id uuid,
  p_body text,
  p_resolve boolean default false
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _tkt public.support_tickets;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  select * into _tkt from public.support_tickets where id = p_ticket_id;
  if not found then return false; end if;

  insert into public.support_messages (ticket_id, sender_id, is_staff, body)
  values (p_ticket_id, auth.uid(), true, p_body);

  update public.support_tickets
  set
    status = case when p_resolve then 'resolved' else 'pending' end,
    updated_at = now()
  where id = p_ticket_id;

  perform public.push_notification(
    _tkt.user_id,
    'support',
    case when p_resolve then 'Support ticket resolved' else 'New reply on your support ticket' end,
    left(p_body, 180),
    '/talento-pro?view=support'
  );

  perform public.log_audit(
    _tkt.tenant_id, 'support.ticket_updated', 'support_tickets', p_ticket_id::text,
    jsonb_build_object('resolved', p_resolve)
  );
  return true;
end $$;
revoke all on function public.admin_reply_support_ticket(uuid, text, boolean) from public, anon;
grant execute on function public.admin_reply_support_ticket(uuid, text, boolean) to authenticated;

-- 5k. Persist Platform Settings / Feature Flags / CIR Weights
create or replace function public.admin_upsert_platform_setting(
  p_key text,
  p_value jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  insert into public.platform_settings (key, value, updated_at)
  values (p_key, p_value, now())
  on conflict (key) do update set value = excluded.value, updated_at = now();

  perform public.log_audit(
    null, 'platform.setting_updated', 'platform_settings', p_key,
    jsonb_build_object('value', p_value)
  );
  return true;
end $$;
revoke all on function public.admin_upsert_platform_setting(text, jsonb) from public, anon;
grant execute on function public.admin_upsert_platform_setting(text, jsonb) to authenticated;

-- 5l. Broadcast Notification to Real Live Users
create or replace function public.admin_broadcast_notification(
  p_title text,
  p_body text,
  p_audience text default 'All Users',
  p_link text default '/talento-pro?view=dash'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _count int := 0;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;

  if p_audience = 'Employers' then
    insert into public.notifications (user_id, kind, title, body, link)
    select distinct user_id, 'broadcast', p_title, p_body, p_link
    from public.employers where user_id is not null;
  elsif p_audience = 'Candidates' then
    insert into public.notifications (user_id, kind, title, body, link)
    select p.id, 'broadcast', p_title, p_body, p_link
    from public.profiles p
    where not exists (select 1 from public.employers e where e.user_id = p.id);
  else
    insert into public.notifications (user_id, kind, title, body, link)
    select id, 'broadcast', p_title, p_body, p_link from public.profiles;
  end if;

  get diagnostics _count = row_count;
  perform public.log_audit(
    null, 'notification.broadcast', 'notifications', p_audience,
    jsonb_build_object('title', p_title, 'recipients', _count)
  );
  return _count;
end $$;
revoke all on function public.admin_broadcast_notification(text, text, text, text) from public, anon;
grant execute on function public.admin_broadcast_notification(text, text, text, text) to authenticated;

-- 5m. Admin Create LMS Course, Mentor, Hackathon, Coupon & Enterprise Store Save
create or replace function public.admin_create_course(
  p_title text,
  p_category text,
  p_price_inr numeric,
  p_instructor text default 'TalentCIR Faculty'
)
returns public.lms_courses
language plpgsql
security definer
set search_path = public
as $$
declare
  _slug text;
  _row public.lms_courses;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  _slug := regexp_replace(lower(trim(p_title)), '[^a-z0-9]+', '-', 'g') || '-' || substr(md5(gen_random_uuid()::text), 1, 5);
  insert into public.lms_courses (slug, title, category, price_inr, instructor_name, is_published)
  values (_slug, trim(p_title), coalesce(nullif(trim(p_category), ''), 'General'), greatest(0, coalesce(p_price_inr, 0)), coalesce(p_instructor, 'TalentCIR Faculty'), true)
  returning * into _row;
  perform public.log_audit(null, 'course.created', 'lms_courses', _row.id::text, jsonb_build_object('title', _row.title));
  return _row;
end $$;
revoke all on function public.admin_create_course(text, text, numeric, text) from public, anon;
grant execute on function public.admin_create_course(text, text, numeric, text) to authenticated;

create or replace function public.admin_create_mentor(
  p_display_name text,
  p_headline text,
  p_domain text,
  p_hourly_rate_inr numeric
)
returns public.mentor_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  _row public.mentor_profiles;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  insert into public.mentor_profiles (display_name, headline, expertise, hourly_rate_inr, is_active)
  values (trim(p_display_name), coalesce(nullif(trim(p_headline), ''), p_domain || ' Mentor'), array[coalesce(p_domain, 'Engineering')], greatest(0, coalesce(p_hourly_rate_inr, 999)), true)
  returning * into _row;
  perform public.log_audit(null, 'mentor.created', 'mentor_profiles', _row.id::text, jsonb_build_object('name', _row.display_name));
  return _row;
end $$;
revoke all on function public.admin_create_mentor(text, text, text, numeric) from public, anon;
grant execute on function public.admin_create_mentor(text, text, text, numeric) to authenticated;

create or replace function public.admin_create_hackathon(
  p_title text,
  p_industry text,
  p_city text,
  p_prize_pool_inr numeric default 500000
)
returns public.hackathons
language plpgsql
security definer
set search_path = public
as $$
declare
  _slug text;
  _row public.hackathons;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  _slug := regexp_replace(lower(trim(p_title)), '[^a-z0-9]+', '-', 'g') || '-' || substr(md5(gen_random_uuid()::text), 1, 5);
  insert into public.hackathons (slug, title, industry, city, mode, starts_at, ends_at, prize_pool_inr, status)
  values (_slug, trim(p_title), coalesce(p_industry, 'Software & AI'), coalesce(p_city, 'Bengaluru'), 'hybrid', now() + interval '14 days', now() + interval '16 days', greatest(0, coalesce(p_prize_pool_inr, 500000)), 'open')
  returning * into _row;
  perform public.log_audit(null, 'hackathon.created', 'hackathons', _row.id::text, jsonb_build_object('title', _row.title));
  return _row;
end $$;
revoke all on function public.admin_create_hackathon(text, text, text, numeric) from public, anon;
grant execute on function public.admin_create_hackathon(text, text, text, numeric) to authenticated;

create or replace function public.admin_create_coupon(
  p_code text,
  p_discount_type text default 'percent',
  p_value numeric default 15,
  p_max_redemptions integer default 250,
  p_valid_to timestamptz default (now() + interval '90 days')
)
returns public.coupons
language plpgsql
security definer
set search_path = public
as $$
declare
  _row public.coupons;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  insert into public.coupons (code, discount_type, value, max_redemptions, valid_to, is_active)
  values (upper(trim(p_code)), case when p_discount_type = 'flat' then 'flat' else 'percent' end, greatest(1, coalesce(p_value, 15)), p_max_redemptions, p_valid_to, true)
  on conflict (code) do update set value = excluded.value, is_active = true, valid_to = excluded.valid_to
  returning * into _row;
  perform public.log_audit(null, 'coupon.created', 'coupons', _row.code, jsonb_build_object('value', _row.value));
  return _row;
end $$;
revoke all on function public.admin_create_coupon(text, text, numeric, integer, timestamptz) from public, anon;
grant execute on function public.admin_create_coupon(text, text, numeric, integer, timestamptz) to authenticated;

create or replace function public.admin_upsert_enterprise_store(
  p_key text,
  p_payload jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized: Admin required' using errcode = '42501';
  end if;
  insert into public.admin_enterprise_store (key, payload, updated_by, updated_at)
  values (p_key, p_payload, auth.uid(), now())
  on conflict (key) do update set payload = excluded.payload, updated_by = auth.uid(), updated_at = now();
  return true;
end $$;
revoke all on function public.admin_upsert_enterprise_store(text, jsonb) from public, anon;
grant execute on function public.admin_upsert_enterprise_store(text, jsonb) to authenticated;

-- ---------------------------------------------------------------------
-- 6. Enable Supabase Realtime Publication for Live Dashboard Streaming
-- ---------------------------------------------------------------------
do $$
declare
  t text;
  rt_tables text[] := array[
    'profiles',
    'employers',
    'employer_job_openings',
    'job_applications',
    'payment_orders',
    'wallet_accounts',
    'assessment_attempts',
    'cir_reports',
    'support_tickets',
    'course_enrollments',
    'hackathon_registrations',
    'event_registrations',
    'audit_log'
  ];
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array rt_tables loop
      if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = t) then
        begin
          execute format('alter publication supabase_realtime add table public.%I', t);
        exception when duplicate_object then
          null;
        end;
      end if;
    end loop;
  end if;
end $$;
