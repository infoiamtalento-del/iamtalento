-- =====================================================================
-- Sign-up: persist role / employer stub / phone from auth metadata in the
-- trigger. Works with email confirmation on (no client session exists yet),
-- and only ever grants the two self-serve roles (never admin).
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  _meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  _role text := case when _meta ->> 'role' = 'employer' then 'employer' else 'employee' end;
  _level text := _meta ->> 'experience_level';
begin
  insert into public.profiles (id, email, full_name, phone, experience_level)
  values (
    new.id, new.email, coalesce(_meta ->> 'full_name', ''), nullif(_meta ->> 'phone', ''),
    case when _level in ('fresher', 'experienced') then _level end
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, _role::public.app_role)
  on conflict (user_id, role) do nothing;

  if _role = 'employer' then
    insert into public.employers (user_id, contact_name, official_email, phone, company_name)
    values (new.id, coalesce(_meta ->> 'full_name', ''), new.email, nullif(_meta ->> 'phone', ''), nullif(_meta ->> 'company_name', ''))
    on conflict (user_id) do nothing;
  end if;

  return new;
end $$;
