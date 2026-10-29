-- =====================================================================
-- Billing: GST-aware payment orders, double-entry wallet ledger,
-- coupons, employer subscriptions. Money moves only via SECURITY
-- DEFINER functions; clients can read their own rows and nothing else.
-- =====================================================================

create sequence if not exists public.invoice_seq start 1000;

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code)),
  description text,
  discount_type text not null check (discount_type in ('percent', 'flat')),
  value numeric not null check (value > 0),
  max_discount numeric,
  min_order numeric not null default 0,
  applies_to text[] not null default '{}',
  max_redemptions integer,
  per_user_limit integer not null default 1,
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenant_organizations(id) on delete set null,
  item_type text not null check (item_type in
    ('assessment_journey', 'course', 'mentor_session', 'hackathon_ticket', 'wallet_topup', 'subscription')),
  item_id uuid,
  item_ref text,
  currency text not null default 'INR',
  base_amount numeric not null check (base_amount >= 0),
  discount_amount numeric not null default 0,
  taxable_amount numeric not null default 0,
  gst_rate numeric not null default 18,
  cgst numeric not null default 0,
  sgst numeric not null default 0,
  igst numeric not null default 0,
  total_amount numeric not null default 0,
  buyer_state text,
  buyer_gstin text,
  coupon_id uuid references public.coupons(id),
  gateway text not null default 'razorpay' check (gateway in ('razorpay', 'stripe', 'wallet', 'free')),
  gateway_order_id text,
  gateway_payment_id text,
  idempotency_key text not null unique,
  status text not null default 'created'
    check (status in ('created', 'authorized', 'captured', 'entitled', 'failed', 'refunded', 'cancelled')),
  invoice_number text unique,
  invoice_pdf_url text,
  consumed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payment_orders_user_idx on public.payment_orders(user_id, created_at desc);
create unique index if not exists payment_orders_gateway_uq on public.payment_orders(gateway, gateway_order_id)
  where gateway_order_id is not null;

create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid not null unique references public.payment_orders(id) on delete cascade,
  amount numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('candidate', 'tenant', 'platform')),
  user_id uuid references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenant_organizations(id) on delete cascade,
  system_key text unique,
  currency text not null default 'INR',
  balance numeric not null default 0,
  locked_balance numeric not null default 0 check (locked_balance >= 0),
  version bigint not null default 0,
  created_at timestamptz not null default now(),
  constraint wallet_nonneg check (owner_type = 'platform' or balance >= 0),
  constraint wallet_owner_ck check (
    (owner_type = 'candidate' and user_id is not null) or
    (owner_type = 'tenant' and tenant_id is not null) or
    (owner_type = 'platform' and system_key is not null))
);
create unique index if not exists wallet_candidate_uq on public.wallet_accounts(user_id) where owner_type = 'candidate';
create unique index if not exists wallet_tenant_uq on public.wallet_accounts(tenant_id) where owner_type = 'tenant';

create table if not exists public.wallet_ledger_entries (
  id bigint generated always as identity primary key,
  wallet_id uuid not null references public.wallet_accounts(id),
  tx_group uuid not null,
  entry_type text not null check (entry_type in ('debit', 'credit')),
  amount numeric not null check (amount > 0),
  balance_after numeric not null,
  reason text not null,
  reference_type text,
  reference_id text,
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (wallet_id, idempotency_key)
);
create index if not exists wallet_ledger_wallet_idx on public.wallet_ledger_entries(wallet_id, id desc);

create table if not exists public.employer_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_organizations(id) on delete cascade,
  plan text not null check (plan in ('free', 'growth', 'enterprise')),
  seats integer not null default 1,
  assessment_credits integer not null default 0,
  interview_minutes integer not null default 0,
  cir_unlocks integer not null default 0,
  period_start timestamptz not null default now(),
  period_end timestamptz,
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'expired')),
  order_id uuid references public.payment_orders(id),
  created_at timestamptz not null default now()
);

insert into public.wallet_accounts (owner_type, system_key) values
  ('platform', 'platform_float'), ('platform', 'platform_revenue'), ('platform', 'promo_pool')
on conflict (system_key) do nothing;

alter table public.coupons enable row level security;
alter table public.payment_orders enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.wallet_accounts enable row level security;
alter table public.wallet_ledger_entries enable row level security;
alter table public.employer_subscriptions enable row level security;

create policy "Admins manage coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "Users read own orders" on public.payment_orders for select using (user_id = auth.uid());
create policy "Users read own redemptions" on public.coupon_redemptions for select using (user_id = auth.uid());
create policy "Users read own wallet" on public.wallet_accounts for select
  using ((owner_type = 'candidate' and user_id = auth.uid()) or
         (owner_type = 'tenant' and public.is_tenant_member(tenant_id, array['owner','admin'])));
create policy "Users read own ledger" on public.wallet_ledger_entries for select
  using (exists (select 1 from public.wallet_accounts w where w.id = wallet_id and
    ((w.owner_type = 'candidate' and w.user_id = auth.uid()) or
     (w.owner_type = 'tenant' and public.is_tenant_member(w.tenant_id, array['owner','admin'])))));
create policy "Tenant members read subscription" on public.employer_subscriptions
  for select using (public.is_tenant_member(tenant_id));

create trigger payment_orders_updated_at before update on public.payment_orders
  for each row execute function public.update_updated_at();

-- Ledger rows are immutable.
create or replace function public.ledger_immutable()
returns trigger language plpgsql as $$
begin raise exception 'wallet_ledger_entries is append-only'; end $$;
drop trigger if exists ledger_no_change on public.wallet_ledger_entries;
create trigger ledger_no_change before update or delete on public.wallet_ledger_entries
  for each row execute function public.ledger_immutable();

-- ---------------------------------------------------------------------
-- Wallet helpers
-- ---------------------------------------------------------------------
create or replace function public.get_or_create_my_wallet()
returns public.wallet_accounts
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _w public.wallet_accounts;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  insert into public.wallet_accounts (owner_type, user_id) values ('candidate', _uid)
    on conflict (user_id) where owner_type = 'candidate' do nothing;
  select * into _w from public.wallet_accounts where owner_type = 'candidate' and user_id = _uid;
  return _w;
end $$;

-- Atomic double-entry transfer (one debit + one credit sharing a tx_group).
create or replace function public.wallet_transfer(
  p_from uuid, p_to uuid, p_amount numeric, p_reason text,
  p_ref_type text default null, p_ref_id text default null, p_idem text default null)
returns uuid
language plpgsql security definer set search_path = public as $$
declare _group uuid := gen_random_uuid(); _f public.wallet_accounts; _t public.wallet_accounts; _existing uuid;
begin
  if p_amount is null or p_amount <= 0 then raise exception 'Amount must be positive'; end if;
  if p_from = p_to then raise exception 'Cannot transfer to the same wallet'; end if;
  if p_idem is not null then
    select tx_group into _existing from public.wallet_ledger_entries where wallet_id = p_from and idempotency_key = p_idem;
    if found then return _existing; end if;
  end if;
  -- Lock in a stable order to avoid deadlocks.
  perform 1 from public.wallet_accounts where id in (p_from, p_to) order by id for update;
  select * into _f from public.wallet_accounts where id = p_from;
  select * into _t from public.wallet_accounts where id = p_to;
  if _f.owner_type <> 'platform' and _f.balance - _f.locked_balance < p_amount then
    raise exception 'Insufficient wallet balance' using errcode = 'P0402';
  end if;
  update public.wallet_accounts set balance = balance - p_amount, version = version + 1 where id = p_from;
  update public.wallet_accounts set balance = balance + p_amount, version = version + 1 where id = p_to;
  insert into public.wallet_ledger_entries (wallet_id, tx_group, entry_type, amount, balance_after, reason, reference_type, reference_id, idempotency_key)
  values (p_from, _group, 'debit', p_amount, _f.balance - p_amount, p_reason, p_ref_type, p_ref_id, p_idem),
         (p_to, _group, 'credit', p_amount, _t.balance + p_amount, p_reason, p_ref_type, p_ref_id, null);
  return _group;
end $$;
revoke execute on function public.wallet_transfer(uuid, uuid, numeric, text, text, text, text) from public, anon, authenticated;
grant execute on function public.wallet_transfer(uuid, uuid, numeric, text, text, text, text) to service_role;

create or replace function public._platform_wallet(p_key text)
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.wallet_accounts where system_key = p_key
$$;
revoke execute on function public._platform_wallet(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Coupons
-- ---------------------------------------------------------------------
create or replace function public._coupon_discount(p_coupon public.coupons, p_user uuid, p_item_type text, p_amount numeric)
returns numeric language plpgsql stable security definer set search_path = public as $$
declare _d numeric; _used int; _used_by_user int;
begin
  if not p_coupon.is_active or p_coupon.valid_from > now() or (p_coupon.valid_to is not null and p_coupon.valid_to < now()) then
    raise exception 'Coupon is not active';
  end if;
  if p_amount < p_coupon.min_order then raise exception 'Order is below the coupon minimum'; end if;
  if cardinality(p_coupon.applies_to) > 0 and not (p_item_type = any(p_coupon.applies_to)) then
    raise exception 'Coupon does not apply to this purchase';
  end if;
  select count(*) into _used from public.coupon_redemptions where coupon_id = p_coupon.id;
  if p_coupon.max_redemptions is not null and _used >= p_coupon.max_redemptions then
    raise exception 'Coupon has been fully redeemed';
  end if;
  select count(*) into _used_by_user from public.coupon_redemptions where coupon_id = p_coupon.id and user_id = p_user;
  if _used_by_user >= p_coupon.per_user_limit then raise exception 'You have already used this coupon'; end if;
  _d := case p_coupon.discount_type when 'percent' then p_amount * p_coupon.value / 100 else p_coupon.value end;
  if p_coupon.max_discount is not null then _d := least(_d, p_coupon.max_discount); end if;
  return round(least(_d, p_amount), 2);
end $$;
revoke execute on function public._coupon_discount(public.coupons, uuid, text, numeric) from public, anon, authenticated;

create or replace function public.validate_coupon(p_code text, p_item_type text, p_amount numeric)
returns table (valid boolean, discount numeric, message text)
language plpgsql stable security definer set search_path = public as $$
declare _c public.coupons;
begin
  select * into _c from public.coupons where code = upper(trim(p_code));
  if not found then return query select false, 0::numeric, 'Invalid coupon code'::text; return; end if;
  begin
    return query select true, public._coupon_discount(_c, auth.uid(), p_item_type, p_amount), 'Coupon applied'::text;
  exception when others then
    return query select false, 0::numeric, sqlerrm::text;
  end;
end $$;

-- ---------------------------------------------------------------------
-- Orders: server-priced, GST split by buyer/seller state, idempotent
-- ---------------------------------------------------------------------
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
  _key text := coalesce(p_idempotency_key, gen_random_uuid()::text);
  _gw text := p_gateway;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _order from public.payment_orders where idempotency_key = _key and user_id = _uid;
  if found then return _order; end if;

  if p_item_type = 'assessment_journey' then
    select price_inr, title into _base, _ref from public.assessments_catalog where id = p_item_id and kind = 'domain' and is_active;
  elsif p_item_type = 'course' then
    select price_inr, title into _base, _ref from public.lms_courses where id = p_item_id and is_published;
  elsif p_item_type = 'mentor_session' then
    select price_inr, 'Mentor session' into _base, _ref from public.mentor_slots where id = p_item_id and status = 'open';
  elsif p_item_type = 'hackathon_ticket' then
    select entry_fee_inr, title into _base, _ref from public.hackathons where id = p_item_id;
  elsif p_item_type = 'wallet_topup' then
    if p_amount is null or p_amount < 10 or p_amount > 100000 then raise exception 'Top-up must be between 10 and 100000'; end if;
    _base := p_amount; _ref := 'Wallet top-up';
  else
    raise exception 'Unsupported item type %', p_item_type;
  end if;
  if _base is null then raise exception 'Item not found or unavailable'; end if;

  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 and p_item_type <> 'wallet_topup' then
    select * into _coupon from public.coupons where code = upper(trim(p_coupon_code));
    if not found then raise exception 'Invalid coupon code'; end if;
    _disc := public._coupon_discount(_coupon, _uid, p_item_type, _base);
  end if;

  _taxable := _base - _disc;
  select (value #>> '{}')::numeric into _rate from public.platform_settings where key = 'gst_rate';
  select value #>> '{}' into _seller from public.platform_settings where key = 'seller_state';
  _rate := coalesce(_rate, 18);
  if p_item_type = 'wallet_topup' then _rate := 0; end if;  -- top-ups are not a supply of services
  _gst := round(_taxable * _rate / 100, 2);
  if p_buyer_state is not null and lower(trim(p_buyer_state)) = lower(trim(coalesce(_seller, ''))) then
    _cgst := round(_gst / 2, 2); _sgst := _gst - _cgst;
  else
    _igst := _gst;
  end if;
  _total := _taxable + _gst;
  if _total = 0 then _gw := 'free'; end if;

  insert into public.payment_orders (user_id, item_type, item_id, item_ref, base_amount, discount_amount, taxable_amount,
    gst_rate, cgst, sgst, igst, total_amount, buyer_state, buyer_gstin, coupon_id, gateway, idempotency_key,
    status)
  values (_uid, p_item_type, p_item_id, _ref, _base, _disc, _taxable, _rate, _cgst, _sgst, _igst, _total,
    p_buyer_state, p_buyer_gstin, _coupon.id, _gw, _key, 'created')
  returning * into _order;

  if _total = 0 then
    perform public._fulfill_order(_order.id, 'free-' || _order.id::text);
    select * into _order from public.payment_orders where id = _order.id;
  end if;
  return _order;
end $$;

-- Grants entitlement exactly once. Internal; called by webhook/wallet/free paths.
create or replace function public._fulfill_order(p_order uuid, p_payment_id text)
returns void language plpgsql security definer set search_path = public as $$
declare _o public.payment_orders; _w uuid; _fy text;
begin
  select * into _o from public.payment_orders where id = p_order for update;
  if not found then raise exception 'Order not found'; end if;
  if _o.status in ('entitled', 'refunded', 'cancelled') then return; end if;

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
  where id = p_order;

  perform public.push_notification(_o.user_id, 'payment',
    case when _o.item_type = 'wallet_topup' then 'Wallet credited' else 'Payment successful' end,
    coalesce(_o.item_ref, 'Your purchase') || ' (' || _o.total_amount || ' INR)', '/talento-pro?view=payment-history',
    jsonb_build_object('order_id', _o.id));
end $$;
revoke execute on function public._fulfill_order(uuid, text) from public, anon, authenticated;

-- Called by the Razorpay/Stripe webhook edge function (service role only).
create or replace function public.fulfill_payment_order(p_order uuid, p_payment_id text)
returns public.payment_orders
language plpgsql security definer set search_path = public as $$
declare _o public.payment_orders;
begin
  perform public._fulfill_order(p_order, p_payment_id);
  select * into _o from public.payment_orders where id = p_order;
  return _o;
end $$;
revoke execute on function public.fulfill_payment_order(uuid, text) from public, anon, authenticated;
grant execute on function public.fulfill_payment_order(uuid, text) to service_role;

-- Pay for an order straight from the candidate wallet.
create or replace function public.pay_order_with_wallet(p_order uuid)
returns public.payment_orders
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _o public.payment_orders; _w public.wallet_accounts;
begin
  select * into _o from public.payment_orders where id = p_order and user_id = _uid for update;
  if not found then raise exception 'Order not found'; end if;
  if _o.item_type = 'wallet_topup' then raise exception 'A top-up cannot be paid from the wallet'; end if;
  if _o.status = 'entitled' then return _o; end if;
  if _o.status not in ('created', 'authorized') then raise exception 'Order is %', _o.status; end if;
  _w := public.get_or_create_my_wallet();
  perform public.wallet_transfer(_w.id, public._platform_wallet('platform_revenue'), _o.total_amount,
    coalesce(_o.item_ref, 'Purchase'), 'payment_order', _o.id::text, 'order-' || _o.id::text);
  update public.payment_orders set gateway = 'wallet' where id = p_order;
  perform public._fulfill_order(p_order, 'wallet-' || p_order::text);
  select * into _o from public.payment_orders where id = p_order;
  return _o;
end $$;

-- Referral reward: credits both wallets from the promo pool, once per referee.
create or replace function public.claim_referral(p_code text)
returns numeric
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _referrer uuid; _mine public.wallet_accounts; _theirs uuid;
        _reward constant numeric := 100;
begin
  select id into _referrer from public.profiles where referral_code = upper(trim(p_code));
  if _referrer is null or _referrer = _uid then raise exception 'Invalid referral code'; end if;
  if (select referred_by from public.profiles where id = _uid) is not null then
    raise exception 'A referral was already claimed on this account';
  end if;
  update public.profiles set referred_by = _referrer where id = _uid;
  _mine := public.get_or_create_my_wallet();
  insert into public.wallet_accounts (owner_type, user_id) values ('candidate', _referrer) on conflict (user_id) where owner_type = 'candidate' do nothing;
  select id into _theirs from public.wallet_accounts where owner_type = 'candidate' and user_id = _referrer;
  perform public.wallet_transfer(public._platform_wallet('promo_pool'), _mine.id, _reward, 'Referral welcome bonus', 'referral', _referrer::text, 'ref-in-' || _uid::text);
  perform public.wallet_transfer(public._platform_wallet('promo_pool'), _theirs, _reward, 'Referral reward', 'referral', _uid::text, 'ref-out-' || _uid::text);
  perform public.push_notification(_referrer, 'wallet', 'Referral reward credited', 'You earned ' || _reward || ' INR.', '/talento-pro?view=wallet');
  return _reward;
end $$;
