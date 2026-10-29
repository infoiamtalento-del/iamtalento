-- =====================================================================
-- Security hardening (applied on top of earlier migrations)
-- Fixes found in review:
--  * clients could self-set verification flags / readiness score / referral
--  * identity_verifications let users mark themselves "verified"
--  * employers could forge source=platform jobs, tamper with applications
--  * coupon per-user limit was bypassable with parallel orders
--  * referral rewards were farmable with throwaway accounts
--  * anonymous callers could execute internal RPCs (coupon probing)
--  * unbounded text, javascript: URLs, oversized JSON, unlimited events
--  * edge/storage: no size or mime limits, no private buckets
-- =====================================================================

-- ---------------------------------------------------------------------
-- Rate limiting
-- ---------------------------------------------------------------------
create table if not exists public.rate_limits (
  id bigint generated always as identity primary key,
  bucket text not null,
  subject text not null,
  hit_at timestamptz not null default now()
);
create index if not exists rate_limits_lookup_idx on public.rate_limits(bucket, subject, hit_at desc);
alter table public.rate_limits enable row level security;

create or replace function public.rate_limit_hit(p_bucket text, p_max integer, p_window interval, p_subject text default null)
returns void language plpgsql security definer set search_path = public as $$
declare _s text := coalesce(p_subject, auth.uid()::text, 'anon'); _n int;
begin
  if random() < 0.01 then delete from public.rate_limits where hit_at < now() - interval '2 days'; end if;
  select count(*) into _n from public.rate_limits where bucket = p_bucket and subject = _s and hit_at > now() - p_window;
  if _n >= p_max then raise exception 'Too many requests. Please try again later.' using errcode = 'P0429'; end if;
  insert into public.rate_limits (bucket, subject) values (p_bucket, _s);
end $$;

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.all_http_urls(p text[])
returns boolean language sql immutable as $$
  select p is null or not exists (select 1 from unnest(p) u where u !~* '^https?://')
$$;

create or replace function public.safe_date(p text)
returns date language plpgsql immutable as $$
begin
  if p is null or btrim(p) = '' then return null; end if;
  if p ~ '^\d{4}$' then return make_date(p::int, 1, 1); end if;
  return p::date;
exception when others then return null;
end $$;

create or replace function public.is_client_role()
returns boolean language sql stable as $$ select current_user in ('authenticated', 'anon') $$;

-- ---------------------------------------------------------------------
-- Profiles: protected columns, URL checks, new columns
-- ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists shell_state jsonb not null default '{}'::jsonb,
  add column if not exists portfolio_slug text,
  add column if not exists resume_path text;

create unique index if not exists profiles_portfolio_slug_uq on public.profiles(lower(portfolio_slug)) where portfolio_slug is not null;

-- Clean any blank URL strings on existing rows before enforcing strict http(s) URL constraints.
update public.profiles set
  profile_photo_url = nullif(btrim(profile_photo_url), ''),
  resume_url = nullif(btrim(resume_url), ''),
  video_intro_url = nullif(btrim(video_intro_url), ''),
  portfolio_url = nullif(btrim(portfolio_url), ''),
  github_url = nullif(btrim(github_url), ''),
  behance_url = nullif(btrim(behance_url), ''),
  kaggle_url = nullif(btrim(kaggle_url), ''),
  linkedin_url = nullif(btrim(linkedin_url), '')
where profile_photo_url = '' or resume_url = '' or video_intro_url = '' or portfolio_url = ''
   or github_url = '' or behance_url = '' or kaggle_url = '' or linkedin_url = '';
update public.certifications set credential_url = nullif(btrim(credential_url), '') where credential_url = '';
update public.projects set project_url = nullif(btrim(project_url), '') where project_url = '';
update public.accomplishments set url = nullif(btrim(url), '') where url = '';

alter table public.profiles
  add constraint profiles_slug_format check (portfolio_slug is null or portfolio_slug ~ '^[a-z0-9][a-z0-9-]{2,38}[a-z0-9]$'),
  add constraint profiles_state_size check (octet_length(shell_state::text) <= 262144),
  add constraint profiles_url_scheme check (
    (profile_photo_url is null or profile_photo_url ~* '^https?://') and (resume_url is null or resume_url ~* '^https?://') and
    (video_intro_url is null or video_intro_url ~* '^https?://') and (portfolio_url is null or portfolio_url ~* '^https?://') and
    (github_url is null or github_url ~* '^https?://') and (behance_url is null or behance_url ~* '^https?://') and
    (kaggle_url is null or kaggle_url ~* '^https?://') and (linkedin_url is null or linkedin_url ~* '^https?://') and
    public.all_http_urls(other_portfolio_links)),
  add constraint profiles_text_len check (
    coalesce(length(about_summary), 0) <= 5000 and coalesce(length(professional_headline), 0) <= 300 and coalesce(length(full_name), 0) <= 200);

create or replace function public.profiles_protect()
returns trigger language plpgsql as $$
begin
  if public.is_client_role() then
    if tg_op = 'INSERT' then
      new.verification_status := 'unverified';
      new.industry_readiness_score := 0;
      new.referred_by := null;
      new.shell_state := '{}'::jsonb;
    else
      new.id := old.id;
      new.iam_talento_id := old.iam_talento_id;
      new.verification_status := old.verification_status;
      new.industry_readiness_score := old.industry_readiness_score;
      new.referral_code := old.referral_code;
      new.referred_by := old.referred_by;
      new.email := old.email;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect_trg on public.profiles;
create trigger profiles_protect_trg before insert or update on public.profiles
  for each row execute function public.profiles_protect();

-- Skills / certifications: "verified" can only be granted server side.
alter table public.skills add constraint skills_name_len check (length(skill_name) between 1 and 80);
create unique index if not exists skills_user_name_uq on public.skills(user_id, lower(skill_name));
create unique index if not exists certifications_user_name_uq on public.certifications(user_id, lower(name));
alter table public.certifications add constraint certifications_url_scheme check (credential_url is null or credential_url ~* '^https?://');
alter table public.projects add constraint projects_url_scheme check (project_url is null or project_url ~* '^https?://');
alter table public.accomplishments add constraint accomplishments_url_scheme check (url is null or url ~* '^https?://');

create or replace function public.skills_protect()
returns trigger language plpgsql as $$
begin
  if public.is_client_role() then
    if tg_op = 'INSERT' then new.is_verified := false; else new.is_verified := old.is_verified; end if;
  end if;
  return new;
end $$;
drop trigger if exists skills_protect_trg on public.skills;
create trigger skills_protect_trg before insert or update on public.skills for each row execute function public.skills_protect();

create or replace function public.certifications_protect()
returns trigger language plpgsql as $$
begin
  if public.is_client_role() then
    if tg_op = 'INSERT' then new.verification_status := 'unverified'; else new.verification_status := old.verification_status; end if;
  end if;
  return new;
end $$;
drop trigger if exists certifications_protect_trg on public.certifications;
create trigger certifications_protect_trg before insert or update on public.certifications for each row execute function public.certifications_protect();

-- ---------------------------------------------------------------------
-- user_roles: assigned by the sign-up trigger only
-- ---------------------------------------------------------------------
drop policy if exists "Users can insert own role" on public.user_roles;

-- ---------------------------------------------------------------------
-- Identity verification: documents by the user, decision by staff
-- ---------------------------------------------------------------------
drop policy if exists "Users can manage own verification" on public.identity_verifications;
create policy "Users read own verification" on public.identity_verifications for select using (user_id = auth.uid() or public.is_admin());
alter table public.identity_verifications
  add column if not exists document_path text,
  add column if not exists selfie_path text,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists rejection_reason text;
alter table public.identity_verifications
  add constraint identity_pan_format check (pan_number is null or pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$');

create or replace function public.submit_identity_verification(
  p_id_type text, p_document_path text, p_selfie_path text, p_pan text default null)
returns public.identity_verifications
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _row public.identity_verifications;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('identity_submit', 5, interval '1 day');
  if p_id_type not in ('aadhar', 'passport', 'driving_license') then raise exception 'Unsupported ID type'; end if;
  -- Files must live in the caller's own folder of the private bucket.
  if split_part(p_document_path, '/', 1) <> _uid::text or (p_selfie_path is not null and split_part(p_selfie_path, '/', 1) <> _uid::text) then
    raise exception 'Invalid document path';
  end if;
  if exists (select 1 from public.identity_verifications where user_id = _uid and verification_status = 'verified') then
    raise exception 'Your identity is already verified';
  end if;
  insert into public.identity_verifications (user_id, government_id_type, document_path, selfie_path, pan_number, verification_status, face_match_status)
  values (_uid, p_id_type, p_document_path, p_selfie_path, nullif(upper(p_pan), ''), 'pending', 'pending')
  on conflict (user_id) do update set government_id_type = excluded.government_id_type, document_path = excluded.document_path,
    selfie_path = excluded.selfie_path, pan_number = excluded.pan_number, verification_status = 'pending',
    face_match_status = 'pending', rejection_reason = null, reviewed_at = null, reviewed_by = null
  returning * into _row;
  update public.profiles set verification_status = 'pending' where id = _uid and verification_status = 'unverified';
  return _row;
end $$;

create or replace function public.review_identity_verification(p_user uuid, p_approve boolean, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and auth.role() <> 'service_role' then raise exception 'Not allowed' using errcode = '42501'; end if;
  update public.identity_verifications set verification_status = case when p_approve then 'verified' else 'rejected' end,
    face_match_status = case when p_approve then 'matched' else 'failed' end,
    rejection_reason = case when p_approve then null else p_reason end, reviewed_by = auth.uid(), reviewed_at = now()
  where user_id = p_user;
  update public.profiles set verification_status = case when p_approve then 'verified' else 'unverified' end where id = p_user;
  perform public.push_notification(p_user, 'verification', case when p_approve then 'Identity verified' else 'Identity verification needs attention' end,
    case when p_approve then 'Your verified badge is now live on your profile.' else coalesce(p_reason, 'Please re-submit clearer documents.') end,
    '/talento-pro?view=ver');
end $$;

-- ---------------------------------------------------------------------
-- Employers / jobs / applications: prevent forgery
-- ---------------------------------------------------------------------
create or replace function public.employers_protect()
returns trigger language plpgsql as $$
begin
  if public.is_client_role() then
    if tg_op = 'INSERT' then
      new.verification_status := 'pending'; new.email_verified := false; new.phone_verified := false;
    else
      new.verification_status := old.verification_status; new.email_verified := old.email_verified;
      new.phone_verified := old.phone_verified; new.employer_id := old.employer_id; new.user_id := old.user_id;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists employers_protect_trg on public.employers;
create trigger employers_protect_trg before insert or update on public.employers for each row execute function public.employers_protect();

create or replace function public.jobs_protect()
returns trigger language plpgsql as $$
begin
  if public.is_client_role() then
    new.source := 'employer';
    if tg_op = 'INSERT' then new.user_id := auth.uid(); else new.user_id := old.user_id; end if;
    if new.tenant_id is not null and not public.is_tenant_member(new.tenant_id, array['owner','admin','recruiter','hiring_manager']) then
      new.tenant_id := null;
    end if;
    if tg_op = 'UPDATE' then new.jd_embedding := old.jd_embedding; end if;
  end if;
  return new;
end $$;
drop trigger if exists jobs_protect_trg on public.employer_job_openings;
create trigger jobs_protect_trg before insert or update on public.employer_job_openings for each row execute function public.jobs_protect();

create or replace function public.applications_guard()
returns trigger language plpgsql as $$
begin
  if public.is_client_role() then
    new.id := old.id; new.job_id := old.job_id; new.candidate_id := old.candidate_id; new.tenant_id := old.tenant_id;
    new.cover_note := old.cover_note; new.match_score := old.match_score; new.match_breakdown := old.match_breakdown;
    new.profile_snapshot := old.profile_snapshot; new.applied_at := old.applied_at;
    if new.stage = 'Withdrawn' and old.stage <> 'Withdrawn' then new.stage := old.stage; end if;
  end if;
  return new;
end $$;
drop trigger if exists applications_guard_trg on public.job_applications;
create trigger applications_guard_trg before update on public.job_applications for each row execute function public.applications_guard();

alter table public.job_applications add constraint application_note_len check (coalesce(length(cover_note), 0) <= 5000 and coalesce(length(recruiter_note), 0) <= 5000);
alter table public.support_tickets add constraint ticket_subject_len check (length(subject) between 3 and 200);
alter table public.support_messages add constraint message_body_len check (length(body) between 1 and 5000);

-- A tenant creator becomes its owner member.
create or replace function public.tenant_owner_membership()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.owner_user_id is not null then
    insert into public.tenant_memberships (tenant_id, user_id, role) values (new.id, new.owner_user_id, 'owner') on conflict do nothing;
  end if;
  return new;
end $$;
drop trigger if exists tenant_owner_membership_trg on public.tenant_organizations;
create trigger tenant_owner_membership_trg after insert on public.tenant_organizations for each row execute function public.tenant_owner_membership();

-- ---------------------------------------------------------------------
-- Coupons: reserve at order creation, serialised per user
-- ---------------------------------------------------------------------
create or replace function public.cancel_payment_order(p_order uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.payment_orders set status = 'cancelled' where id = p_order and user_id = auth.uid() and status in ('created', 'authorized');
  delete from public.coupon_redemptions r using public.payment_orders o
    where r.order_id = o.id and o.id = p_order and o.status = 'cancelled';
end $$;

create or replace function public.cancel_stale_orders()
returns integer language plpgsql security definer set search_path = public as $$
declare _n int;
begin
  with stale as (
    update public.payment_orders set status = 'cancelled'
    where status in ('created', 'authorized') and created_at < now() - interval '2 hours' returning id)
  delete from public.coupon_redemptions where order_id in (select id from stale);
  get diagnostics _n = row_count;
  return _n;
end $$;

create or replace function public.validate_coupon(p_code text, p_item_type text, p_amount numeric)
returns table (valid boolean, discount numeric, message text)
language plpgsql security definer set search_path = public as $$
declare _c public.coupons;
begin
  if auth.uid() is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('coupon_check', 20, interval '10 minutes');
  select * into _c from public.coupons where code = upper(trim(p_code));
  if not found then return query select false, 0::numeric, 'Invalid coupon code'::text; return; end if;
  begin
    return query select true, public._coupon_discount(_c, auth.uid(), p_item_type, p_amount), 'Coupon applied'::text;
  exception when others then
    return query select false, 0::numeric, sqlerrm::text;
  end;
end $$;

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
  if p_gateway not in ('razorpay', 'stripe', 'wallet') then raise exception 'Unsupported gateway'; end if;
  if p_buyer_gstin is not null and p_buyer_gstin !~ '^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$' then
    raise exception 'Invalid GSTIN format';
  end if;
  -- Keys are scoped per user so one user can never collide with, or probe, another's.
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

  -- Release this user's own abandoned, unpaid orders for the same item (frees reserved coupons).
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

  -- Reserve the coupon immediately so parallel orders cannot reuse it.
  if _coupon.id is not null and _disc > 0 then
    insert into public.coupon_redemptions (coupon_id, user_id, order_id, amount) values (_coupon.id, _uid, _order.id, _disc);
  end if;

  if _total = 0 then
    perform public._fulfill_order(_order.id, 'free-' || _order.id::text);
    select * into _order from public.payment_orders where id = _order.id;
  end if;
  return _order;
end $$;

-- ---------------------------------------------------------------------
-- Referrals: reward only after the referee's first real purchase
-- ---------------------------------------------------------------------
create table if not exists public.referral_rewards (
  referee_id uuid primary key references public.profiles(id) on delete cascade,
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  order_id uuid references public.payment_orders(id),
  created_at timestamptz not null default now()
);
alter table public.referral_rewards enable row level security;
create policy "Users read own referral rewards" on public.referral_rewards for select
  using (referee_id = auth.uid() or referrer_id = auth.uid());

drop function if exists public.claim_referral(text);
create or replace function public.claim_referral(p_code text)
returns text
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _referrer uuid;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('claim_referral', 5, interval '1 day');
  select id into _referrer from public.profiles where referral_code = upper(trim(p_code));
  if _referrer is null or _referrer = _uid then raise exception 'Invalid referral code'; end if;
  if (select referred_by from public.profiles where id = _uid) is not null then
    raise exception 'A referral was already claimed on this account';
  end if;
  update public.profiles set referred_by = _referrer where id = _uid;
  return 'Referral saved. Your 100 INR bonus unlocks after your first purchase of 99 INR or more.';
end $$;

create or replace function public._grant_referral_reward(p_order public.payment_orders)
returns void language plpgsql security definer set search_path = public as $$
declare _referrer uuid; _mine uuid; _theirs uuid; _reward constant numeric := 100;
begin
  if p_order.item_type = 'wallet_topup' or p_order.total_amount < 99 then return; end if;
  select referred_by into _referrer from public.profiles where id = p_order.user_id;
  if _referrer is null then return; end if;
  insert into public.referral_rewards (referee_id, referrer_id, amount, order_id) values (p_order.user_id, _referrer, _reward, p_order.id)
  on conflict (referee_id) do nothing;
  if not found then return; end if;
  insert into public.wallet_accounts (owner_type, user_id) values ('candidate', p_order.user_id) on conflict (user_id) where owner_type = 'candidate' do nothing;
  insert into public.wallet_accounts (owner_type, user_id) values ('candidate', _referrer) on conflict (user_id) where owner_type = 'candidate' do nothing;
  select id into _mine from public.wallet_accounts where owner_type = 'candidate' and user_id = p_order.user_id;
  select id into _theirs from public.wallet_accounts where owner_type = 'candidate' and user_id = _referrer;
  perform public.wallet_transfer(public._platform_wallet('promo_pool'), _mine, _reward, 'Referral welcome bonus', 'referral', _referrer::text, 'ref-in-' || p_order.user_id::text);
  perform public.wallet_transfer(public._platform_wallet('promo_pool'), _theirs, _reward, 'Referral reward', 'referral', p_order.user_id::text, 'ref-out-' || p_order.user_id::text);
  perform public.push_notification(_referrer, 'wallet', 'Referral reward credited', 'You earned ' || _reward || ' INR.', '/talento-pro?view=wallet');
  perform public.push_notification(p_order.user_id, 'wallet', 'Referral bonus credited', 'You earned ' || _reward || ' INR.', '/talento-pro?view=wallet');
end $$;

create or replace function public._fulfill_order(p_order uuid, p_payment_id text)
returns void language plpgsql security definer set search_path = public as $$
declare _o public.payment_orders; _w uuid; _fy text;
begin
  select * into _o from public.payment_orders where id = p_order for update;
  if not found then raise exception 'Order not found'; end if;
  -- A payment that arrives for a cancelled order must still be honoured.
  if _o.status in ('entitled', 'refunded') then return; end if;

  _fy := case when extract(month from now()) >= 4
              then to_char(now(), 'YY') || to_char(now() + interval '1 year', 'YY')
              else to_char(now() - interval '1 year', 'YY') || to_char(now(), 'YY') end;

  if _o.item_type = 'wallet_topup' then
    select id into _w from public.wallet_accounts where owner_type = 'candidate' and user_id = _o.user_id;
    if _w is null then
      insert into public.wallet_accounts (owner_type, user_id) values ('candidate', _o.user_id) returning id into _w;
    end if;
    perform public.wallet_transfer(public._platform_wallet('platform_float'), _w, _o.total_amount,
      'Wallet top-up', 'payment_order', _o.id::text, 'topup-' || _o.id::text);
  end if;

  if _o.coupon_id is not null and _o.discount_amount > 0 then
    insert into public.coupon_redemptions (coupon_id, user_id, order_id, amount)
    values (_o.coupon_id, _o.user_id, _o.id, _o.discount_amount) on conflict (order_id) do nothing;
  end if;

  update public.payment_orders set status = 'entitled', gateway_payment_id = coalesce(p_payment_id, gateway_payment_id),
    invoice_number = case when total_amount > 0 and item_type <> 'wallet_topup'
      then 'IAT/' || _fy || '/' || lpad(nextval('public.invoice_seq')::text, 6, '0') end
  where id = p_order returning * into _o;

  perform public._grant_referral_reward(_o);
  perform public.push_notification(_o.user_id, 'payment',
    case when _o.item_type = 'wallet_topup' then 'Wallet credited' else 'Payment successful' end,
    coalesce(_o.item_ref, 'Your purchase') || ' (' || _o.total_amount || ' INR)', '/talento-pro?view=payment-history',
    jsonb_build_object('order_id', _o.id));
end $$;

-- ---------------------------------------------------------------------
-- Abuse caps on candidate RPCs
-- ---------------------------------------------------------------------
create or replace function public.save_attempt_response(
  p_attempt uuid, p_question uuid, p_response jsonb, p_latency_ms integer default null)
returns void language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _att public.assessment_attempts;
begin
  if pg_column_size(p_response) > 50000 then raise exception 'Answer is too large'; end if;
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid for update;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status <> 'in_progress' then raise exception 'Attempt is not in progress'; end if;
  if _att.server_expires_at < now() then raise exception 'Attempt time is over' using errcode = 'P0410'; end if;
  if not exists (select 1 from jsonb_array_elements(_att.question_order) e where (e ->> 'q')::uuid = p_question) then
    raise exception 'Question is not part of this attempt';
  end if;
  insert into public.attempt_item_responses (attempt_id, question_id, response, latency_ms, saved_at)
  values (p_attempt, p_question, p_response, p_latency_ms, now())
  on conflict (attempt_id, question_id)
  do update set response = excluded.response, latency_ms = excluded.latency_ms, saved_at = now();
end $$;

create or replace function public.log_proctoring_event(
  p_attempt uuid, p_layer_id smallint, p_signal_code text, p_severity text,
  p_confidence numeric default 1, p_snapshot_url text default null, p_meta jsonb default '{}'::jsonb)
returns numeric
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _att public.assessment_attempts; _penalty numeric; _score numeric;
        _group text := case when p_layer_id <= 10 then 'A' when p_layer_id <= 20 then 'B' else 'C' end; _n int;
begin
  if p_layer_id not between 1 and 28 or p_severity not in ('minor', 'medium', 'critical') or length(p_signal_code) > 60 then
    raise exception 'Invalid proctoring event';
  end if;
  if pg_column_size(coalesce(p_meta, '{}'::jsonb)) > 4000 then raise exception 'Event metadata too large'; end if;
  if p_snapshot_url is not null and p_snapshot_url !~* '^https?://' then raise exception 'Invalid snapshot URL'; end if;
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status <> 'in_progress' then return _att.integrity_score; end if;
  select count(*) into _n from public.proctoring_events where attempt_id = p_attempt;
  if _n >= 800 then return _att.integrity_score; end if;

  insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, snapshot_url, meta)
  values (p_attempt, _uid, p_layer_id, _group, p_signal_code, p_severity, least(greatest(p_confidence, 0), 1), p_snapshot_url, coalesce(p_meta, '{}'::jsonb));

  select coalesce(sum(case severity when 'minor' then 1 when 'medium' then 3 else 10 end * confidence), 0)
    into _penalty from public.proctoring_events where attempt_id = p_attempt;
  _score := greatest(0, round(100 - _penalty, 2));
  update public.assessment_attempts set integrity_score = _score,
    status = case when _score < 40 then 'invalidated' else status end
  where id = p_attempt;
  return _score;
end $$;

-- Rate-limit wrappers & ownership guard re-declared so live DB stays in sync.
create or replace function public.compute_match_score(p_user uuid, p_job uuid)
returns jsonb
language plpgsql stable security definer set search_path = public, extensions as $$
declare
  _job public.employer_job_openings; _p public.profiles;
  _need text[]; _n int; _have numeric := 0; _overlap numeric; _sem numeric; _exp numeric;
  _cir numeric; _integrity numeric; _cand extensions.vector(1536); _score numeric; _has_cir boolean;
begin
  if p_user is distinct from auth.uid() and not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'You can only compute your own match score' using errcode = '42501';
  end if;
  select * into _job from public.employer_job_openings where id = p_job;
  select * into _p from public.profiles where id = p_user;
  if _job.id is null or _p.id is null then return jsonb_build_object('score', 0); end if;

  select array(select lower(trim(s)) from unnest(_job.skills) s) into _need;
  _n := coalesce(cardinality(_need), 0);
  if _n = 0 then _overlap := 1;
  else
    select coalesce(sum(case when sk.is_verified then 1.0 else 0.7 end), 0) into _have
    from (select distinct on (lower(skill_name)) lower(skill_name) as nm, is_verified
          from public.skills where user_id = p_user order by lower(skill_name), is_verified desc) sk
    where sk.nm = any(_need);
    _overlap := least(_have / _n, 1);
  end if;

  select embedding into _cand from public.candidate_embeddings where user_id = p_user;
  if _cand is not null and _job.jd_embedding is not null then
    _sem := greatest(0, 1 - (_cand <=> _job.jd_embedding));
  else
    _sem := _overlap;
  end if;

  _exp := case when coalesce(_job.experience_min, 0) <= 0 then 1
               else least(coalesce(_p.years_of_experience, 0)::numeric / _job.experience_min, 1) end;

  select r.composite_score / 100.0, coalesce(r.integrity_score, 100) / 100.0 into _cir, _integrity
  from public.cir_reports r where r.user_id = p_user order by r.generated_at desc limit 1;
  _has_cir := _cir is not null;

  _score := case when _has_cir
      then 0.45 * _cir + 0.25 * _overlap + 0.15 * _sem + 0.10 * _exp + 0.05 * _integrity
      else (0.25 * _overlap + 0.15 * _sem + 0.10 * _exp) / 0.50 end;

  return jsonb_build_object('score', round(100 * _score), 'has_cir', _has_cir,
    'cir', round(100 * coalesce(_cir, 0)), 'skill_overlap', round(100 * _overlap),
    'semantic', round(100 * _sem), 'experience_fit', round(100 * _exp),
    'integrity', round(100 * coalesce(_integrity, 1)));
end $$;

create or replace function public.apply_to_job(p_job uuid, p_cover_note text default null)
returns public.job_applications
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid(); _job public.employer_job_openings; _app public.job_applications;
  _m jsonb; _snap jsonb; _best numeric;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
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

create or replace function public.join_hackathon_team(p_invite_code text)
returns public.hackathon_registrations
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _t public.hackathon_teams; _h public.hackathons; _size int; _r public.hackathon_registrations;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('join_team', 20, interval '1 hour');
  select * into _t from public.hackathon_teams where invite_code = upper(trim(p_invite_code));
  if not found then raise exception 'Invalid team invite code'; end if;
  select * into _h from public.hackathons where id = _t.hackathon_id and status = 'open';
  if not found then raise exception 'Registrations are closed for this hackathon'; end if;
  select count(*) into _size from public.hackathon_registrations where team_id = _t.id;
  if _size >= _h.max_team_size then raise exception 'This team is full'; end if;
  if _h.entry_fee_inr > 0 and not exists (select 1 from public.hackathon_registrations where hackathon_id = _h.id and user_id = _uid) then
    raise exception 'Complete your own registration payment before joining a team' using errcode = 'P0402';
  end if;
  insert into public.hackathon_registrations (hackathon_id, user_id, team_id) values (_h.id, _uid, _t.id)
  on conflict (hackathon_id, user_id) do update set team_id = excluded.team_id returning * into _r;
  return _r;
end $$;

-- ---------------------------------------------------------------------
-- Storage: size/mime limits and private buckets
-- ---------------------------------------------------------------------
update storage.buckets set file_size_limit = 5242880, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'] where id = 'profile-photos';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('identity-docs', 'identity-docs', false, 10485760, array['image/jpeg', 'image/png', 'application/pdf']),
  ('resumes', 'resumes', false, 5242880, array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

do $$
declare b text;
begin
  foreach b in array array['identity-docs', 'resumes'] loop
    execute format('create policy "%1$s owner read" on storage.objects for select using (bucket_id = %2$L and auth.uid()::text = (storage.foldername(name))[1])', b, b);
    execute format('create policy "%1$s owner insert" on storage.objects for insert with check (bucket_id = %2$L and auth.uid()::text = (storage.foldername(name))[1])', b, b);
    execute format('create policy "%1$s owner update" on storage.objects for update using (bucket_id = %2$L and auth.uid()::text = (storage.foldername(name))[1])', b, b);
    execute format('create policy "%1$s owner delete" on storage.objects for delete using (bucket_id = %2$L and auth.uid()::text = (storage.foldername(name))[1])', b, b);
  end loop;
end $$;

create policy "resumes employers read applicants" on storage.objects for select using (
  bucket_id = 'resumes' and exists (
    select 1 from public.job_applications a
    where a.candidate_id::text = (storage.foldername(name))[1] and public.can_manage_job(a.job_id)));
create policy "identity-docs staff read" on storage.objects for select using (bucket_id = 'identity-docs' and public.is_admin());
