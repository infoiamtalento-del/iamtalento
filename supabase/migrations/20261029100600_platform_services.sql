-- =====================================================================
-- Paid add-on services purchasable from the wallet (profile boost, etc.)
-- =====================================================================
create table if not exists public.platform_services (
  key text primary key,
  title text not null,
  description text,
  audience text not null default 'candidate' check (audience in ('candidate', 'employer')),
  price_inr numeric not null check (price_inr >= 0),
  duration_days integer,
  is_active boolean not null default true
);

create table if not exists public.service_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_key text not null references public.platform_services(key),
  amount numeric not null,
  tx_group uuid,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'fulfilled', 'expired', 'refunded')),
  created_at timestamptz not null default now()
);
create index if not exists service_purchases_user_idx on public.service_purchases(user_id, created_at desc);

alter table public.platform_services enable row level security;
alter table public.service_purchases enable row level security;
create policy "Anyone reads active services" on public.platform_services
  for select to anon, authenticated using (is_active);
create policy "Users read own purchases" on public.service_purchases
  for select using (user_id = auth.uid());

insert into public.platform_services (key, title, description, audience, price_inr, duration_days) values
  ('profile_boost',   'Profile boost (7 days)',     'Featured in employer search',               'candidate', 99,   7),
  ('resume_review',   'Expert resume review',       'Feedback from a hiring specialist',         'candidate', 149,  null),
  ('recruiter_pack',  'Recruiter credits (100 pack)','Unlock direct candidate contact access',   'employer',  2499, null),
  ('job_spotlight',   'Job spotlight boost (7 days)','Pin a job to the top of candidate search', 'employer',  999,  7),
  ('ai_shortlisting', 'AI candidate shortlisting',  'Automatic ranking of incoming applicants',  'employer',  499,  null)
on conflict (key) do nothing;

create or replace function public.purchase_service(p_key text)
returns public.service_purchases
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _s public.platform_services; _w public.wallet_accounts; _grp uuid; _p public.service_purchases;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _s from public.platform_services where key = p_key and is_active;
  if not found then raise exception 'Service not available'; end if;
  _w := public.get_or_create_my_wallet();
  _grp := public.wallet_transfer(_w.id, public._platform_wallet('platform_revenue'), _s.price_inr, _s.title,
            'service', p_key, 'svc-' || gen_random_uuid()::text);
  insert into public.service_purchases (user_id, service_key, amount, tx_group, expires_at)
  values (_uid, p_key, _s.price_inr, _grp, case when _s.duration_days is null then null else now() + make_interval(days => _s.duration_days) end)
  returning * into _p;
  perform public.push_notification(_uid, 'payment', 'Purchased: ' || _s.title, _s.price_inr || ' INR debited from your wallet.', '/talento-pro?view=wallet');
  return _p;
end $$;
