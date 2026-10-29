-- =====================================================================
-- Auth Reliability & Rate-Limit-Proof Account Provisioning
-- Solves:
--  1. GoTrue default SMTP 2-email/hr rate limit ("email rate limit exceeded")
--  2. Default SITE_URL localhost:3000 dead confirmation links on email verify
--  3. Stuck unconfirmed accounts ("Email not confirmed") from prior signups
--  4. Guarantees profiles, user_roles & employers rows exist for all users
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Auto-confirm trigger on auth.users + repair existing unconfirmed users
-- ---------------------------------------------------------------------
create or replace function public.auto_confirm_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  new.confirmation_token := coalesce(new.confirmation_token, '');
  new.recovery_token := coalesce(new.recovery_token, '');
  new.email_change := coalesce(new.email_change, '');
  new.email_change_token_new := coalesce(new.email_change_token_new, '');
  new.email_change_token_current := coalesce(new.email_change_token_current, '');
  new.phone_change := coalesce(new.phone_change, '');
  new.phone_change_token := coalesce(new.phone_change_token, '');
  new.reauthentication_token := coalesce(new.reauthentication_token, '');
  new.raw_user_meta_data := coalesce(new.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('email_verified', true);
  return new;
end $$;

revoke all on function public.auto_confirm_auth_user() from public, anon, authenticated;

drop trigger if exists trg_auto_confirm_auth_user on auth.users;
create trigger trg_auto_confirm_auth_user
  before insert on auth.users
  for each row execute function public.auto_confirm_auth_user();

-- Backfill any existing unconfirmed accounts or null GoTrue scan columns
update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  reauthentication_token = coalesce(reauthentication_token, ''),
  updated_at = coalesce(updated_at, now())
where email_confirmed_at is null
   or confirmation_token is null
   or recovery_token is null
   or email_change is null
   or email_change_token_new is null;

-- Ensure every auth.users row has its profile, user_roles, and (if employer) employers stub
insert into public.profiles (id, email, full_name, phone, experience_level)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  nullif(u.raw_user_meta_data ->> 'phone', ''),
  case when (u.raw_user_meta_data ->> 'experience_level') in ('fresher', 'experienced')
       then u.raw_user_meta_data ->> 'experience_level'
       else null end
from auth.users u
where u.deleted_at is null and u.email is not null
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select
  u.id,
  (case when u.raw_user_meta_data ->> 'role' = 'employer' then 'employer' else 'employee' end)::public.app_role
from auth.users u
where u.deleted_at is null
  and not exists (select 1 from public.user_roles r where r.user_id = u.id)
on conflict (user_id, role) do nothing;

insert into public.employers (user_id, contact_name, official_email, phone, company_name)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  u.email,
  nullif(u.raw_user_meta_data ->> 'phone', ''),
  nullif(u.raw_user_meta_data ->> 'company_name', '')
from auth.users u
where u.deleted_at is null
  and u.raw_user_meta_data ->> 'role' = 'employer'
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------
-- 2. Direct, Rate-Limited Account Registration RPC
--    Creates a verified GoTrue account + identity so signInWithPassword
--    succeeds immediately without hitting default SMTP rate limits or
--    dead localhost confirmation redirects.
-- ---------------------------------------------------------------------
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
set search_path = public, extensions
as $$
declare
  _email text := lower(btrim(coalesce(p_email, '')));
  _name text := btrim(coalesce(p_full_name, ''));
  _phone text := nullif(btrim(coalesce(p_phone, '')), '');
  _role text := case when lower(btrim(coalesce(p_role, ''))) = 'employer' then 'employer' else 'employee' end;
  _exp text := case
    when lower(btrim(coalesce(p_role, ''))) <> 'employer'
     and lower(btrim(coalesce(p_experience_level, ''))) in ('fresher', 'experienced')
    then lower(btrim(p_experience_level))
    else null
  end;
  _company text := case when lower(btrim(coalesce(p_role, ''))) = 'employer' then nullif(btrim(coalesce(p_company_name, '')), '') else null end;
  _headers jsonb;
  _ip_subject text := 'local';
  _existing_id uuid;
  _existing_hash text;
  _uid uuid;
  _meta jsonb;
begin
  -- Validate inputs strictly before any DB mutation
  if _email = '' or length(_email) > 255 or _email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'Please enter a valid email address.' using errcode = '22023';
  end if;

  if p_password is null or length(p_password) < 6 or length(p_password) > 128 then
    raise exception 'Password must be between 6 and 128 characters.' using errcode = '22023';
  end if;

  if _name = '' or length(_name) > 200 then
    raise exception 'Please enter your full name (max 200 characters).' using errcode = '22023';
  end if;

  if _phone is not null and length(_phone) > 20 then
    raise exception 'Phone number is too long.' using errcode = '22023';
  end if;

  if _role = 'employer' and (_company is null or length(_company) > 200) then
    raise exception 'Please enter your company name.' using errcode = '22023';
  end if;

  -- Extract client IP safely for abuse rate limiting (works in PostgREST and local PGlite)
  begin
    _headers := nullif(current_setting('request.headers', true), '')::jsonb;
    _ip_subject := coalesce(
      nullif(split_part(coalesce(_headers ->> 'x-forwarded-for', ''), ',', 1), ''),
      nullif(_headers ->> 'cf-connecting-ip', ''),
      'local'
    );
  exception when others then
    _ip_subject := 'local';
  end;

  perform public.rate_limit_hit('auth_register_email', 6, interval '15 minutes', _email);
  perform public.rate_limit_hit('auth_register_ip', 30, interval '15 minutes', _ip_subject);

  -- Check if an active account already exists for this email
  select u.id, u.encrypted_password
    into _existing_id, _existing_hash
  from auth.users u
  where lower(u.email) = _email
    and u.deleted_at is null
  limit 1;

  if _existing_id is not null then
    -- Idempotent recovery: if the user already submitted sign-up with the exact same password,
    -- ensure their email is confirmed and profile/roles exist so immediate sign-in works cleanly.
    if _existing_hash is not null and _existing_hash = crypt(p_password, _existing_hash) then
      update auth.users
         set email_confirmed_at = coalesce(email_confirmed_at, now()),
             confirmation_token = coalesce(confirmation_token, ''),
             recovery_token = coalesce(recovery_token, ''),
             email_change = coalesce(email_change, ''),
             email_change_token_new = coalesce(email_change_token_new, ''),
             updated_at = now()
       where id = _existing_id;

      return jsonb_build_object(
        'user_id', _existing_id,
        'email', _email,
        'role', _role,
        'status', 'confirmed_existing'
      );
    end if;

    raise exception 'An account with this email already exists. Please sign in instead.' using errcode = '23505';
  end if;

  _uid := gen_random_uuid();
  _meta := jsonb_strip_nulls(jsonb_build_object(
    'sub', _uid::text,
    'email', _email,
    'full_name', _name,
    'phone', _phone,
    'role', _role,
    'experience_level', _exp,
    'company_name', _company,
    'email_verified', true,
    'phone_verified', false
  ));

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_token_current,
    phone_change,
    phone_change_token,
    reauthentication_token,
    raw_app_meta_data,
    raw_user_meta_data,
    is_sso_user,
    is_anonymous,
    created_at,
    updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000'::uuid,
    _uid,
    'authenticated',
    'authenticated',
    _email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    _meta,
    false,
    false,
    now(),
    now()
  );

  insert into auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  select
    gen_random_uuid(),
    _uid::text,
    _uid,
    _meta,
    'email',
    now(),
    now(),
    now()
  where not exists (
    select 1 from auth.identities i where i.provider_id = _uid::text and i.provider = 'email'
  );

  return jsonb_build_object(
    'user_id', _uid,
    'email', _email,
    'role', _role,
    'status', 'created'
  );
end $$;

revoke all on function public.register_user_account(text, text, text, text, text, text, text) from public;
grant execute on function public.register_user_account(text, text, text, text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. Password-Verified Unconfirmed Account Recovery RPC
--    Allows a user whose earlier confirmation link failed (localhost)
--    to confirm and sign in by proving knowledge of their password.
-- ---------------------------------------------------------------------
create or replace function public.confirm_unverified_account(
  p_email text,
  p_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  _email text := lower(btrim(coalesce(p_email, '')));
  _uid uuid;
  _hash text;
begin
  if _email = '' or p_password is null or length(p_password) = 0 then
    return false;
  end if;

  perform public.rate_limit_hit('auth_confirm_login', 10, interval '15 minutes', _email);

  select u.id, u.encrypted_password
    into _uid, _hash
  from auth.users u
  where lower(u.email) = _email
    and u.deleted_at is null
  limit 1;

  if _uid is null or _hash is null then
    return false;
  end if;

  if _hash <> crypt(p_password, _hash) then
    return false;
  end if;

  update auth.users
     set email_confirmed_at = coalesce(email_confirmed_at, now()),
         confirmation_token = coalesce(confirmation_token, ''),
         recovery_token = coalesce(recovery_token, ''),
         email_change = coalesce(email_change, ''),
         email_change_token_new = coalesce(email_change_token_new, ''),
         email_change_token_current = coalesce(email_change_token_current, ''),
         phone_change = coalesce(phone_change, ''),
         phone_change_token = coalesce(phone_change_token, ''),
         reauthentication_token = coalesce(reauthentication_token, ''),
         updated_at = now()
   where id = _uid;

  return true;
end $$;

revoke all on function public.confirm_unverified_account(text, text) from public;
grant execute on function public.confirm_unverified_account(text, text) to anon, authenticated;
