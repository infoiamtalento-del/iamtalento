-- =====================================================================
-- STAGE 1: Authentication, Sessions & Account Lifecycle Hardening
-- =====================================================================

-- 1. Remove dangerous auto-confirm trigger (D1)
drop trigger if exists trg_auto_confirm_auth_user on auth.users;
drop function if exists public.auto_confirm_auth_user();

-- 2. Add email_verified_at and deletion_requested_at to profiles
alter table public.profiles
  add column if not exists email_verified_at timestamptz,
  add column if not exists deletion_requested_at timestamptz,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists profile_completion integer not null default 0;

alter table public.employers
  add column if not exists verified_domain text;

-- Protect email_verified_at & deletion_requested_at from client-side privilege escalation
create or replace function public.profiles_protect()
returns trigger language plpgsql as $$
begin
  if public.is_client_role() then
    if tg_op = 'INSERT' then
      new.verification_status := 'unverified';
      new.industry_readiness_score := 0;
      new.referred_by := null;
      new.shell_state := '{}'::jsonb;
      new.email_verified_at := null;
      new.deletion_requested_at := null;
    else
      new.id := old.id;
      new.iam_talento_id := old.iam_talento_id;
      new.verification_status := old.verification_status;
      new.industry_readiness_score := old.industry_readiness_score;
      new.referral_code := old.referral_code;
      new.referred_by := old.referred_by;
      new.email := old.email;
      new.email_verified_at := old.email_verified_at;
      new.deletion_requested_at := old.deletion_requested_at;
    end if;
  end if;
  return new;
end $$;

-- 3. Trigger on auth.users: sync confirmed email to profiles
create or replace function public.on_auth_user_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.email_confirmed_at is not null then
      update public.profiles
      set email_verified_at = new.email_confirmed_at
      where id = new.id;
    end if;
  elsif (old.email_confirmed_at is null and new.email_confirmed_at is not null) or
     (old.email_confirmed_at is not null and new.email_confirmed_at is not null and old.email is distinct from new.email) then
    update public.profiles
    set email_verified_at = new.email_confirmed_at
    where id = new.id;
  end if;
  return new;
end $$;

drop trigger if exists trg_auth_user_email_confirmed on auth.users;
create trigger trg_auth_user_email_confirmed
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.on_auth_user_email_confirmed();

-- Backfill: Demo accounts are pre-verified for seamless UI testing; real accounts start unverified
update public.profiles
set email_verified_at = now()
where email in ('demo.candidate@talento.app', 'demo.employer@talento.app');

-- 4. Verification helpers
create or replace function public.is_email_verified()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _verified boolean;
begin
  if _uid is null then
    return false;
  end if;
  if public.is_admin() or auth.role() = 'service_role' then
    return true;
  end if;
  select (email_verified_at is not null) into _verified
  from public.profiles
  where id = _uid;
  return coalesce(_verified, false);
end $$;

revoke all on function public.is_email_verified() from public, anon;
grant execute on function public.is_email_verified() to authenticated;

create or replace function public.require_verified_email()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_email_verified() then
    raise exception 'Please verify your email to continue' using errcode = 'P0403';
  end if;
end $$;

revoke all on function public.require_verified_email() from public;
grant execute on function public.require_verified_email() to authenticated;

-- Legacy / Token-based email verification upgrade via JWT AMR
create or replace function public.mark_email_verified()
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  _uid uuid := auth.uid();
  _jwt jsonb := auth.jwt();
  _amr jsonb;
  _valid boolean := false;
  _item jsonb;
  _method text;
  _ts numeric;
  _now_epoch numeric := extract(epoch from now());
begin
  if _uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  _amr := coalesce(_jwt -> 'amr', '[]'::jsonb);
  if jsonb_typeof(_amr) = 'array' then
    for _item in select * from jsonb_array_elements(_amr) loop
      if jsonb_typeof(_item) = 'object' then
        _method := _item ->> 'method';
        _ts := coalesce((_item ->> 'timestamp')::numeric, 0);
        if _method in ('otp', 'email', 'magiclink') and (_ts = 0 or (_now_epoch - _ts) <= 600) then
          _valid := true;
          exit;
        end if;
      elsif jsonb_typeof(_item) = 'string' then
        if _item #>> '{}' in ('otp', 'email', 'magiclink') then
          _valid := true;
          exit;
        end if;
      end if;
    end loop;
  end if;

  if not _valid then
    raise exception 'Email verification requires a recent OTP or email verification token' using errcode = 'P0403';
  end if;

  update public.profiles
  set email_verified_at = coalesce(email_verified_at, now())
  where id = _uid;

  return true;
end $$;

revoke all on function public.mark_email_verified() from public;
grant execute on function public.mark_email_verified() to authenticated;

-- 5. MFA / AAL2 helper
create or replace function public.require_aal2()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _jwt jsonb := auth.jwt();
  _aal text := coalesce(_jwt ->> 'aal', 'aal1');
begin
  if public.is_admin() or auth.role() = 'service_role' then
    return;
  end if;
  if _aal <> 'aal2' then
    raise exception 'Multi-factor authentication (AAL2) required' using errcode = '42501';
  end if;
end $$;

revoke all on function public.require_aal2() from public;
grant execute on function public.require_aal2() to authenticated;

-- 6. Consents Table (DPDP Act Compliance)
create table if not exists public.consents (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('terms', 'privacy', 'marketing', 'data_processing')),
  version text not null check (length(version) between 1 and 30),
  accepted_at timestamptz not null default now(),
  ip_hash text,
  user_agent_hash text,
  primary key (user_id, kind, version)
);
alter table public.consents enable row level security;
drop policy if exists "Users can view own consents" on public.consents;
create policy "Users can view own consents" on public.consents
  for select using (auth.uid() = user_id);

create or replace function public.record_consent(
  p_kind text,
  p_version text,
  p_ip_hash text default null,
  p_ua_hash text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if p_kind not in ('terms', 'privacy', 'marketing', 'data_processing') then
    raise exception 'Invalid consent kind' using errcode = '22023';
  end if;
  if length(coalesce(p_version, '')) < 1 then
    raise exception 'Consent version required' using errcode = '22023';
  end if;

  insert into public.consents (user_id, kind, version, accepted_at, ip_hash, user_agent_hash)
  values (_uid, p_kind, p_version, now(), p_ip_hash, p_ua_hash)
  on conflict (user_id, kind, version)
  do update set accepted_at = now(), ip_hash = excluded.ip_hash, user_agent_hash = excluded.user_agent_hash;
end $$;

revoke all on function public.record_consent(text, text, text, text) from public;
grant execute on function public.record_consent(text, text, text, text) to authenticated;

-- 7. Auth Events & Device Tracking Table
create table if not exists public.auth_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('login','login_new_device','password_changed','mfa_enrolled','mfa_removed','email_changed','session_revoked','account_deletion_requested')),
  device_hash text,
  ip_hash text,
  ua text,
  created_at timestamptz not null default now()
);
alter table public.auth_events enable row level security;
drop policy if exists "Users can view own auth events" on public.auth_events;
create policy "Users can view own auth events" on public.auth_events
  for select using (auth.uid() = user_id);
create index if not exists auth_events_user_idx on public.auth_events(user_id, created_at desc);

create or replace function public.record_login_event(
  p_device_hash text,
  p_ip_hash text default null,
  p_ua text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _is_new_device boolean := false;
  _kind text := 'login';
  _alerts_enabled boolean;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  if p_device_hash is not null and length(trim(p_device_hash)) > 0 then
    select not exists (
      select 1 from public.auth_events
      where user_id = _uid and device_hash = p_device_hash
    ) into _is_new_device;
  end if;

  if _is_new_device then
    _kind := 'login_new_device';
  end if;

  insert into public.auth_events (user_id, kind, device_hash, ip_hash, ua, created_at)
  values (_uid, _kind, p_device_hash, p_ip_hash, left(coalesce(p_ua, ''), 300), now());

  if _is_new_device then
    select coalesce((notification_prefs ->> 'login_alerts')::boolean, true) into _alerts_enabled
    from public.profiles
    where id = _uid;

    if coalesce(_alerts_enabled, true) then
      begin
        perform public.push_notification(
          _uid,
          'security',
          'New device login detected',
          'A new device signed into your account. If this was not you, please secure your password immediately.'
        );
      exception when others then null;
      end;
    end if;
  end if;

  return _kind;
end $$;

revoke all on function public.record_login_event(text, text, text) from public;
grant execute on function public.record_login_event(text, text, text) to authenticated;

-- 8. Safe handle_new_user(): OAuth signups never get employer role automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  _meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  _app_meta jsonb := coalesce(new.raw_app_meta_data, '{}'::jsonb);
  _provider text := coalesce(_app_meta ->> 'provider', 'email');
  _requested_role text := _meta ->> 'role';
  _role text := 'employee';
  _level text := _meta ->> 'experience_level';
begin
  -- Only email signup can select employer role directly; OAuth signups start as employee
  if _provider = 'email' and _requested_role = 'employer' then
    _role := 'employer';
  else
    _role := 'employee';
  end if;

  insert into public.profiles (id, email, full_name, phone, experience_level, email_verified_at)
  values (
    new.id,
    new.email,
    coalesce(_meta ->> 'full_name', ''),
    nullif(_meta ->> 'phone', ''),
    case when _level in ('fresher', 'experienced') then _level end,
    new.email_confirmed_at
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = case when length(profiles.full_name) = 0 then excluded.full_name else profiles.full_name end,
    email_verified_at = coalesce(profiles.email_verified_at, excluded.email_verified_at);

  insert into public.user_roles (user_id, role)
  values (new.id, _role::public.app_role)
  on conflict (user_id, role) do nothing;

  if _role = 'employer' then
    insert into public.employers (user_id, contact_name, official_email, phone, company_name)
    values (
      new.id,
      coalesce(_meta ->> 'full_name', ''),
      new.email,
      nullif(_meta ->> 'phone', ''),
      nullif(_meta ->> 'company_name', '')
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end $$;

-- 9. Complete signup for OAuth users
create or replace function public.complete_signup(
  p_role text,
  p_full_name text,
  p_company_name text default null,
  p_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _target_role text := lower(trim(p_role));
  _clean_name text := trim(p_full_name);
  _clean_company text := trim(coalesce(p_company_name, ''));
  _clean_phone text := trim(coalesce(p_phone, ''));
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  if _target_role not in ('employer', 'employee') then
    raise exception 'Invalid role: must be employer or employee' using errcode = '22023';
  end if;

  if length(_clean_name) < 2 or length(_clean_name) > 100 then
    raise exception 'Full name must be between 2 and 100 characters' using errcode = '22023';
  end if;

  if _target_role = 'employer' and length(_clean_company) < 2 then
    raise exception 'Company name is required for employers' using errcode = '22023';
  end if;

  -- Rate limit check
  perform public.rate_limit_hit('complete_signup', 5, interval '1 minute');

  if _target_role = 'employer' then
    delete from public.user_roles where user_id = _uid and role = 'employee';
    insert into public.user_roles (user_id, role) values (_uid, 'employer')
    on conflict (user_id, role) do nothing;

    insert into public.employers (user_id, contact_name, official_email, phone, company_name)
    select _uid, _clean_name, email, nullif(_clean_phone, ''), nullif(_clean_company, '')
    from public.profiles where id = _uid
    on conflict (user_id) do update set
      company_name = coalesce(nullif(excluded.company_name, ''), employers.company_name),
      contact_name = coalesce(nullif(excluded.contact_name, ''), employers.contact_name);
  else
    insert into public.user_roles (user_id, role) values (_uid, 'employee')
    on conflict (user_id, role) do nothing;
  end if;

  update public.profiles
  set
    full_name = _clean_name,
    phone = coalesce(nullif(_clean_phone, ''), phone),
    updated_at = now()
  where id = _uid;

  return jsonb_build_object(
    'success', true,
    'user_id', _uid,
    'role', _target_role
  );
end $$;

revoke all on function public.complete_signup(text, text, text, text) from public;
grant execute on function public.complete_signup(text, text, text, text) to authenticated;

-- 10. Single source of context: get_my_context()
create or replace function public.get_my_context()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _jwt jsonb := auth.jwt();
  _prof public.profiles;
  _role text;
  _is_admin boolean := false;
  _aal text := coalesce(_jwt ->> 'aal', 'aal1');
  _employer jsonb := null;
  _emp_row public.employers;
  _tenant jsonb := null;
  _flags jsonb := '{}'::jsonb;
  _email_verified boolean := false;
begin
  if _uid is null then
    return jsonb_build_object('authenticated', false);
  end if;

  select * into _prof from public.profiles where id = _uid;
  _email_verified := (_prof.email_verified_at is not null) or public.is_admin();

  select role::text into _role from public.user_roles where user_id = _uid order by created_at desc limit 1;
  _role := coalesce(_role, 'employee');

  _is_admin := public.is_admin();

  if _role = 'employer' or _is_admin then
    select * into _emp_row from public.employers where user_id = _uid;
    if found then
      _employer := jsonb_build_object(
        'id', _emp_row.id,
        'company_name', _emp_row.company_name,
        'contact_name', _emp_row.contact_name,
        'official_email', _emp_row.official_email,
        'verification_status', _emp_row.verification_status,
        'verified_domain', _emp_row.verified_domain
      );
    end if;
  end if;

  _flags := jsonb_build_object(
    'deletion_requested', (_prof.deletion_requested_at is not null),
    'deletion_requested_at', _prof.deletion_requested_at
  );

  return jsonb_build_object(
    'authenticated', true,
    'user_id', _uid,
    'email', _prof.email,
    'email_verified', _email_verified,
    'email_verified_at', _prof.email_verified_at,
    'role', _role,
    'is_admin', _is_admin,
    'aal', _aal,
    'employer', _employer,
    'tenant', _tenant,
    'profile_completion', coalesce(_prof.profile_completion, 0),
    'onboarding_completed', coalesce(_prof.onboarding_completed, false),
    'full_name', coalesce(_prof.full_name, ''),
    'phone', _prof.phone,
    'flags', _flags
  );
end $$;

revoke all on function public.get_my_context() from public, anon;
grant execute on function public.get_my_context() to authenticated;

-- 11. Custom Access Token Hook
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role text;
  is_platform_admin boolean := false;
  user_id uuid;
begin
  claims := event->'claims';
  user_id := (event->>'user_id')::uuid;

  select role::text into user_role
  from public.user_roles
  where user_id = user_id
  order by created_at desc
  limit 1;

  select exists (
    select 1 from public.platform_admins where user_id = user_id
  ) into is_platform_admin;

  claims := jsonb_set(claims, '{app_role}', to_jsonb(coalesce(user_role, 'employee')));
  claims := jsonb_set(claims, '{is_admin}', to_jsonb(is_platform_admin));

  event := jsonb_set(event, '{claims}', claims);
  return event;
end $$;

revoke all on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
grant execute on function public.custom_access_token_hook(jsonb) to service_role;

-- 12. Account Deletion & Data Export
create or replace function public.request_account_deletion()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  update public.profiles
  set deletion_requested_at = now()
  where id = _uid;

  insert into public.auth_events (user_id, kind, created_at)
  values (_uid, 'account_deletion_requested', now());

  return jsonb_build_object('success', true, 'deletion_requested_at', now());
end $$;

revoke all on function public.request_account_deletion() from public;
grant execute on function public.request_account_deletion() to authenticated;

create or replace function public.cancel_account_deletion()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  update public.profiles
  set deletion_requested_at = null
  where id = _uid;

  return jsonb_build_object('success', true, 'deletion_cancelled', true);
end $$;

revoke all on function public.cancel_account_deletion() from public;
grant execute on function public.cancel_account_deletion() to authenticated;

create or replace function public.purge_deleted_accounts()
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  _count integer := 0;
  _target record;
begin
  if not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  for _target in
    select id from public.profiles
    where deletion_requested_at < now() - interval '30 days'
  loop
    update public.payment_orders set customer_details = '{"anonymized": true}'::jsonb where user_id = _target.id;
    delete from auth.users where id = _target.id;
    _count := _count + 1;
  end loop;

  return _count;
end $$;

revoke all on function public.purge_deleted_accounts() from public, anon, authenticated;
grant execute on function public.purge_deleted_accounts() to service_role;

create or replace function public.export_my_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _profile jsonb;
  _apps jsonb;
  _assessments jsonb;
  _cir jsonb;
  _orders jsonb;
  _consents jsonb;
  _auth_evts jsonb;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  select to_jsonb(p) into _profile from public.profiles p where p.id = _uid;
  select coalesce(jsonb_agg(to_jsonb(a)), '[]'::jsonb) into _apps from public.job_applications a where a.candidate_id = _uid;
  select coalesce(jsonb_agg(to_jsonb(att)), '[]'::jsonb) into _assessments from public.assessment_attempts att where att.user_id = _uid;
  select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb) into _cir from public.cir_reports c where c.user_id = _uid;
  select coalesce(jsonb_agg(to_jsonb(o)), '[]'::jsonb) into _orders from public.payment_orders o where o.user_id = _uid;
  select coalesce(jsonb_agg(to_jsonb(cs)), '[]'::jsonb) into _consents from public.consents cs where cs.user_id = _uid;
  select coalesce(jsonb_agg(to_jsonb(ae)), '[]'::jsonb) into _auth_evts from public.auth_events ae where ae.user_id = _uid;

  return jsonb_build_object(
    'exported_at', now(),
    'user_id', _uid,
    'profile', _profile,
    'applications', _apps,
    'assessments', _assessments,
    'cir_reports', _cir,
    'orders', _orders,
    'consents', _consents,
    'auth_events', _auth_evts
  );
end $$;

revoke all on function public.export_my_data() from public;
grant execute on function public.export_my_data() to authenticated;

-- 13. Deprecate legacy register and confirm RPCs with clear error guards
create or replace function public.register_user_account(
  p_email text,
  p_password text,
  p_full_name text,
  p_phone text default null,
  p_role text default 'employee',
  p_experience_level text default null,
  p_company_name text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'Direct account creation via register_user_account is deprecated. Please use Supabase Auth signUp.' using errcode = 'P0403';
end $$;

drop function if exists public.confirm_unverified_account(text, text);
create or replace function public.confirm_unverified_account(
  p_email text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'confirm_unverified_account is deprecated. Please use Supabase Auth signInWithPassword.' using errcode = 'P0403';
end $$;

-- 14. Guard sensitive RPCs with require_verified_email()

-- 14a. apply_to_job
create or replace function public.apply_to_job(p_job uuid, p_cover_note text default null)
returns public.job_applications
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid(); _job public.employer_job_openings; _app public.job_applications;
  _m jsonb; _snap jsonb; _best numeric;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  if length(coalesce(p_cover_note, '')) > 5000 then raise exception 'Cover note is too long'; end if;
  perform public.rate_limit_hit('apply_job', 60, interval '1 hour');
  select * into _job from public.employer_job_openings where id = p_job and status = 'active' and is_public;
  if not found then raise exception 'This job is no longer accepting applications'; end if;
  if _job.closes_at is not null and _job.closes_at < now() then raise exception 'Applications for this job have closed'; end if;

  select * into _app from public.job_applications where job_id = p_job and candidate_id = _uid;
  if found then
    if _app.stage = 'Withdrawn' then
      update public.job_applications set stage = 'Applied', cover_note = coalesce(p_cover_note, cover_note), applied_at = now()
        where id = _app.id returning * into _app;
    end if;
    return _app;
  end if;

  _m := public.compute_match_score(_uid, p_job);
  select max(composite_score) into _best from public.cir_reports where user_id = _uid;
  if _job.min_cir_score > 0 and coalesce(_best, 0) < _job.min_cir_score then
    raise exception 'This role requires a verified CIR score of at least %', _job.min_cir_score using errcode = 'P0403';
  end if;

  select jsonb_build_object(
    'name', p.full_name, 'headline', p.professional_headline, 'city', p.city,
    'experience_years', p.years_of_experience, 'resume_url', p.resume_url,
    'skills', coalesce((select jsonb_agg(s.skill_name) from public.skills s where s.user_id = p.id), '[]'::jsonb),
    'certifications', coalesce((select jsonb_agg(c.name) from public.certifications c where c.user_id = p.id), '[]'::jsonb),
    'readiness_score', p.industry_readiness_score, 'verification', p.verification_status)
  into _snap from public.profiles p where p.id = _uid;

  insert into public.job_applications (job_id, candidate_id, tenant_id, cover_note, match_score, match_breakdown, profile_snapshot)
  values (p_job, _uid, _job.tenant_id, p_cover_note, (_m ->> 'score')::numeric, _m, coalesce(_snap, '{}'::jsonb))
  returning * into _app;
  return _app;
end $$;

-- 14b. create_payment_order
create or replace function public.create_payment_order(
  p_item_type text, p_item_id uuid default null, p_coupon_code text default null,
  p_buyer_state text default null, p_buyer_gstin text default null,
  p_idempotency_key text default null, p_gateway text default 'razorpay', p_amount numeric default null)
returns public.payment_orders
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid(); _order public.payment_orders; _base numeric; _ref text;
  _coupon public.coupons; _disc numeric := 0; _taxable numeric; _rate numeric; _seller text;
  _gst numeric; _cgst numeric := 0; _sgst numeric := 0; _igst numeric := 0; _total numeric;
  _key text; _gw text := p_gateway;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  if p_gateway not in ('razorpay', 'stripe', 'wallet') then raise exception 'Unsupported gateway'; end if;
  if p_buyer_gstin is not null and p_buyer_gstin !~ '^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$' then
    raise exception 'Invalid GSTIN format';
  end if;
  _key := _uid::text || ':' || coalesce(p_idempotency_key, gen_random_uuid()::text);
  select * into _order from public.payment_orders where idempotency_key = _key;
  if found then return _order; end if;

  perform public.rate_limit_hit('create_order', 30, interval '1 hour');

  if p_item_type = 'assessment_journey' then
    select price_inr, title into _base, _ref from public.assessments_catalog where id = p_item_id and kind = 'domain' and is_active;
  elsif p_item_type = 'course' then
    select price_inr, title into _base, _ref from public.lms_courses where id = p_item_id and is_published;
  elsif p_item_type = 'mentor_session' then
    select price_inr, 'Mentor session' into _base, _ref from public.mentor_slots where id = p_item_id and status = 'open' and starts_at > now();
  elsif p_item_type = 'hackathon_ticket' then
    select entry_fee_inr, title into _base, _ref from public.hackathons where id = p_item_id and status = 'open';
  elsif p_item_type = 'wallet_topup' then
    if p_amount is null or p_amount < 10 or p_amount > 100000 then raise exception 'Top-up must be between 10 and 100000'; end if;
    _base := round(p_amount, 2); _ref := 'Wallet top-up';
  else
    raise exception 'Unsupported item type %', p_item_type;
  end if;
  if _base is null then raise exception 'Item not found or unavailable'; end if;

  if p_item_type <> 'wallet_topup' then
    with abandoned as (
      update public.payment_orders set status = 'cancelled'
      where user_id = _uid and item_type = p_item_type and item_id is not distinct from p_item_id
        and status in ('created', 'authorized') and gateway_payment_id is null and created_at < now() - interval '2 minutes'
      returning id)
    delete from public.coupon_redemptions where order_id in (select id from abandoned);
  end if;

  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 and p_item_type <> 'wallet_topup' then
    select * into _coupon from public.coupons where code = upper(trim(p_coupon_code));
    if not found then raise exception 'Invalid coupon code'; end if;
    perform pg_advisory_xact_lock(hashtextextended('coupon:' || _coupon.id::text || ':' || _uid::text, 0));
    _disc := public._coupon_discount(_coupon, _uid, p_item_type, _base);
  end if;

  _taxable := _base - _disc;
  select (value #>> '{}')::numeric into _rate from public.platform_settings where key = 'gst_rate';
  select value #>> '{}' into _seller from public.platform_settings where key = 'seller_state';
  _rate := coalesce(_rate, 18);
  if p_item_type = 'wallet_topup' then _rate := 0; end if;
  _gst := round(_taxable * _rate / 100, 2);
  if p_buyer_state is not null and lower(trim(p_buyer_state)) = lower(trim(coalesce(_seller, ''))) then
    _cgst := round(_gst / 2, 2); _sgst := _gst - _cgst;
  else
    _igst := _gst;
  end if;
  _total := _taxable + _gst;
  if _total = 0 then _gw := 'free'; end if;

  insert into public.payment_orders (user_id, item_type, item_id, item_ref, base_amount, discount_amount, taxable_amount,
    gst_rate, cgst, sgst, igst, total_amount, buyer_state, buyer_gstin, coupon_id, gateway, idempotency_key, status)
  values (_uid, p_item_type, p_item_id, _ref, _base, _disc, _taxable, _rate, _cgst, _sgst, _igst, _total,
    left(p_buyer_state, 60), p_buyer_gstin, _coupon.id, _gw, _key, 'created')
  returning * into _order;

  if _coupon.id is not null and _disc > 0 then
    insert into public.coupon_redemptions (coupon_id, user_id, order_id, amount) values (_coupon.id, _uid, _order.id, _disc);
  end if;

  if _total = 0 then
    perform public._fulfill_order(_order.id, 'free-' || _order.id::text);
    select * into _order from public.payment_orders where id = _order.id;
  end if;
  return _order;
end $$;

-- 14c. submit_identity_verification
create or replace function public.submit_identity_verification(
  p_id_type text, p_document_path text, p_selfie_path text, p_pan text default null
)
returns public.identity_verifications
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _row public.identity_verifications;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  perform public.rate_limit_hit('identity_submit', 5, interval '1 day');
  if p_id_type not in ('aadhar', 'passport', 'driving_license') then raise exception 'Unsupported ID type'; end if;
  if split_part(p_document_path, '/', 1) <> _uid::text or (p_selfie_path is not null and split_part(p_selfie_path, '/', 1) <> _uid::text) then
    raise exception 'Invalid document path';
  end if;

  insert into public.identity_verifications (user_id, government_id_type, government_id_url, photo_url, pan_number, verification_status)
  values (_uid, p_id_type, p_document_path, p_selfie_path, upper(p_pan), 'pending')
  on conflict (user_id) do update set
    government_id_type = excluded.government_id_type,
    government_id_url = excluded.government_id_url,
    photo_url = excluded.photo_url,
    pan_number = excluded.pan_number,
    verification_status = 'pending',
    updated_at = now()
  returning * into _row;

  return _row;
end $$;

-- 14d. start_assessment_attempt (already checks auth, add require_verified_email)
create or replace function public.start_assessment_attempt(p_journey uuid, p_assessment uuid)
returns public.assessment_attempts
language plpgsql security definer set search_path = public, extensions as $$
declare
  _uid uuid := auth.uid();
  _j public.assessment_journeys;
  _a public.assessments_catalog;
  _attempt public.assessment_attempts;
  _unlocked boolean;
  _order jsonb;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _j from public.assessment_journeys where id = p_journey and user_id = _uid and status = 'in_progress';
  if not found then raise exception 'Journey not found or already completed'; end if;
  select * into _a from public.assessments_catalog where id = p_assessment and is_active;
  if not found then raise exception 'Assessment not found'; end if;
  if not ((_a.kind = 'core' and _a.tenant_id is null) or _a.id = _j.domain_assessment_id) then
    raise exception 'This assessment is not part of the journey';
  end if;

  select * into _attempt from public.assessment_attempts
    where journey_id = p_journey and assessment_id = p_assessment and status = 'in_progress';
  if found then
    if _attempt.server_expires_at < now() then
      update public.assessment_attempts set status = 'expired' where id = _attempt.id;
    else
      return _attempt;
    end if;
  end if;

  if exists (select 1 from public.assessment_attempts
             where journey_id = p_journey and assessment_id = p_assessment and status in ('graded', 'submitted')) then
    raise exception 'This assessment is already completed for the journey';
  end if;

  select p.is_unlocked into _unlocked from public.get_journey_progress(p_journey) p where p.assessment_id = p_assessment;
  if not coalesce(_unlocked, false) then
    raise exception 'Complete the earlier tests first: core tests come before the domain test' using errcode = 'P0403';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
           'q', t.id,
           'perm', (select coalesce(jsonb_agg(g.i order by md5(t.id::text || _uid::text || g.i::text || clock_timestamp()::text)), '[]'::jsonb)
                    from generate_series(0, greatest(coalesce(jsonb_array_length(t.options), 0) - 1, -1)) as g(i))
         ) order by t.rn), '[]'::jsonb)
  into _order
  from (
    select q.id, q.options, row_number() over (order by random()) as rn
    from public.question_bank q where q.assessment_id = p_assessment and q.is_active
    order by random() limit _a.question_count
  ) t;

  if jsonb_array_length(_order) = 0 then raise exception 'This assessment has no questions yet'; end if;

  insert into public.assessment_attempts (user_id, assessment_id, journey_id, question_order, server_expires_at)
  values (_uid, p_assessment, p_journey, _order, now() + (_a.duration_minutes || ' minutes')::interval)
  returning * into _attempt;

  return _attempt;
end $$;

-- 14e. enroll_in_course
create or replace function public.enroll_in_course(p_course uuid, p_order uuid default null)
returns public.course_enrollments
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _c public.lms_courses; _e public.course_enrollments;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  select * into _c from public.lms_courses where id = p_course and is_published;
  if not found then raise exception 'Course not found'; end if;
  select * into _e from public.course_enrollments where user_id = _uid and course_id = p_course;
  if found then return _e; end if;
  perform public._consume_order(p_order, _uid, 'course', p_course, _c.price_inr);
  insert into public.course_enrollments (user_id, course_id, order_id) values (_uid, p_course, p_order) returning * into _e;
  update public.lms_courses set learners_count = learners_count + 1 where id = p_course;
  perform public.push_notification(_uid, 'learning', 'Enrolled: ' || _c.title, 'Your course is ready. Start learning.', '/learning/courses/' || _c.slug);
  return _e;
end $$;

-- 14f. book_mentor_slot
create or replace function public.book_mentor_slot(p_slot uuid, p_topic text default null, p_order uuid default null)
returns public.mentor_bookings
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _s public.mentor_slots; _b public.mentor_bookings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  select * into _s from public.mentor_slots where id = p_slot for update;
  if not found or _s.status <> 'open' or _s.starts_at <= now() then raise exception 'This slot is no longer available'; end if;
  perform public._consume_order(p_order, _uid, 'mentor_session', p_slot, _s.price_inr);
  update public.mentor_slots set status = 'booked' where id = p_slot;
  insert into public.mentor_bookings (slot_id, mentor_id, user_id, order_id, topic, livekit_room)
  values (p_slot, _s.mentor_id, _uid, p_order, p_topic, 'mentor-' || replace(p_slot::text, '-', ''))
  returning * into _b;
  perform public.push_notification(_uid, 'mentor', '1:1 session confirmed', 'Starts ' || to_char(_s.starts_at at time zone 'Asia/Kolkata', 'DD Mon, HH12:MI AM') || ' IST', '/talento-pro?view=learning-mentors');
  return _b;
end $$;

-- 14g. register_for_hackathon
create or replace function public.register_for_hackathon(p_hackathon uuid, p_team_name text default null, p_order uuid default null)
returns public.hackathon_registrations
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _h public.hackathons; _team uuid; _r public.hackathon_registrations;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  select * into _h from public.hackathons where id = p_hackathon and status = 'open';
  if not found then raise exception 'Registrations are closed for this hackathon'; end if;
  if _h.registration_deadline is not null and _h.registration_deadline < now() then raise exception 'Registration deadline has passed'; end if;
  select * into _r from public.hackathon_registrations where hackathon_id = p_hackathon and user_id = _uid;
  if found then return _r; end if;
  perform public._consume_order(p_order, _uid, 'hackathon_ticket', p_hackathon, _h.entry_fee_inr);
  if p_team_name is not null and length(trim(p_team_name)) > 0 and _h.format <> 'individual' then
    insert into public.hackathon_teams (hackathon_id, name, leader_id) values (p_hackathon, trim(p_team_name), _uid) returning id into _team;
  end if;
  insert into public.hackathon_registrations (hackathon_id, user_id, team_id, order_id) values (p_hackathon, _uid, _team, p_order) returning * into _r;
  perform public.push_notification(_uid, 'hackathon', 'Registered: ' || _h.title, 'You are in. Good luck.', '/hackathon3');
  return _r;
end $$;

-- 14h. register_for_event
create or replace function public.register_for_event(p_kind text, p_ref text, p_city text default null)
returns public.event_registrations
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _r public.event_registrations;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  insert into public.event_registrations (user_id, event_kind, event_ref, city) values (_uid, p_kind, p_ref, p_city)
  on conflict (user_id, event_kind, event_ref) do update set city = coalesce(excluded.city, public.event_registrations.city)
  returning * into _r;
  return _r;
end $$;
