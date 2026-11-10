-- =====================================================================
-- STAGE 2: Organizations, Roles, Permissions, Admin & Tenant Hardening
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Hotfix D2: Protect employer_job_openings RLS & trigger
-- ---------------------------------------------------------------------
drop policy if exists "Employers can manage own job openings" on public.employer_job_openings;

create policy "Employers can manage own job openings" on public.employer_job_openings
  for all to authenticated
  using (
    user_id = auth.uid()
    and public.has_role(auth.uid(), 'employer')
    and exists (
      select 1 from public.employers e
      where e.user_id = auth.uid() and e.verification_status <> 'suspended'
    )
  )
  with check (
    user_id = auth.uid()
    and public.has_role(auth.uid(), 'employer')
    and exists (
      select 1 from public.employers e
      where e.user_id = auth.uid() and e.verification_status <> 'suspended'
    )
  );

create or replace function public.jobs_protect()
returns trigger language plpgsql as $$
declare
  _susp boolean;
begin
  if public.is_client_role() then
    if not public.has_role(auth.uid(), 'employer') and not public.is_admin() then
      raise exception 'Only employers can manage job openings' using errcode = '42501';
    end if;

    select (verification_status = 'suspended') into _susp
    from public.employers where user_id = auth.uid();
    if coalesce(_susp, false) then
      raise exception 'Suspended employer accounts cannot modify job openings' using errcode = '42501';
    end if;

    new.source := 'employer';
    if tg_op = 'INSERT' then
      new.user_id := auth.uid();
      if new.tenant_id is null then
        select tenant_id into new.tenant_id from public.employers where user_id = auth.uid();
      end if;
    else
      new.user_id := old.user_id;
    end if;

    if new.tenant_id is not null and not public.is_tenant_member(new.tenant_id, array['owner','admin','recruiter','hiring_manager']) and not public.is_admin() then
      new.tenant_id := null;
    end if;
    if tg_op = 'UPDATE' then new.jd_embedding := old.jd_embedding; end if;
  end if;
  return new;
end $$;

drop trigger if exists jobs_protect_trg on public.employer_job_openings;
create trigger jobs_protect_trg before insert or update on public.employer_job_openings
  for each row execute function public.jobs_protect();

-- ---------------------------------------------------------------------
-- 2. Tenant Organizations & Employers Tenant Column
-- ---------------------------------------------------------------------
-- Allow platform admins to view all employer profiles
drop policy if exists "Employers can view own profile" on public.employers;
create policy "Employers can view own profile" on public.employers
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Enforce AAL2 for platform admins and privileged operations (only service_role bypasses)
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
  if auth.role() = 'service_role' then
    return;
  end if;
  if _aal <> 'aal2' then
    raise exception 'Multi-factor authentication (AAL2) required' using errcode = '42501';
  end if;
end $$;

alter table public.employers
  add column if not exists tenant_id uuid references public.tenant_organizations(id) on delete set null,
  add column if not exists verification_documents jsonb default '{}'::jsonb,
  add column if not exists verification_submitted_at timestamptz,
  add column if not exists verified_at timestamptz,
  add column if not exists rejection_reason text,
  add column if not exists gst_number text,
  add column if not exists cin_number text,
  add column if not exists pan_number text;

-- Helper to generate unique tenant slug
create or replace function public.generate_tenant_slug(p_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  _clean text;
  _slug text;
  _candidate text;
  _exists boolean;
  _counter int := 0;
begin
  _clean := regexp_replace(lower(trim(coalesce(p_name, 'company'))), '[^a-z0-9]+', '-', 'g');
  _clean := trim(both '-' from _clean);
  if length(_clean) < 2 then
    _clean := 'company';
  end if;

  _slug := _clean;
  loop
    select exists (
      select 1 from public.tenant_organizations where slug = _slug
    ) into _exists;

    if not _exists then
      return _slug;
    end if;

    _counter := _counter + 1;
    _slug := _clean || '-' || substr(md5(gen_random_uuid()::text), 1, 4);
    if _counter > 20 then
      return _clean || '-' || substr(gen_random_uuid()::text, 1, 8);
    end if;
  end loop;
end $$;

revoke all on function public.generate_tenant_slug(text) from public, anon, authenticated;
grant execute on function public.generate_tenant_slug(text) to service_role;

-- Helper to bootstrap a tenant for an employer
create or replace function public.bootstrap_employer_tenant(
  p_employer_id uuid,
  p_user_id uuid,
  p_company_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _tenant_id uuid;
  _slug text;
  _comp text := coalesce(nullif(trim(p_company_name), ''), 'Company');
begin
  select id into _tenant_id
  from public.tenant_organizations
  where owner_user_id = p_user_id or employer_id = p_employer_id
  order by created_at asc
  limit 1;

  if _tenant_id is not null then
    update public.employers
    set tenant_id = _tenant_id
    where id = p_employer_id and tenant_id is null;

    -- Ensure owner membership
    insert into public.tenant_memberships (tenant_id, user_id, role)
    values (_tenant_id, p_user_id, 'owner')
    on conflict (tenant_id, user_id) do update set role = 'owner';

    return _tenant_id;
  end if;

  _slug := public.generate_tenant_slug(_comp);

  insert into public.tenant_organizations (
    name, slug, tier, plan, employer_id, owner_user_id, is_active
  )
  values (
    _comp, _slug, 'pool', 'free', p_employer_id, p_user_id, true
  )
  returning id into _tenant_id;

  update public.employers
  set tenant_id = _tenant_id
  where id = p_employer_id;

  insert into public.tenant_memberships (tenant_id, user_id, role)
  values (_tenant_id, p_user_id, 'owner')
  on conflict (tenant_id, user_id) do update set role = 'owner';

  return _tenant_id;
end $$;

revoke all on function public.bootstrap_employer_tenant(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.bootstrap_employer_tenant(uuid, uuid, text) to service_role;

-- Backfill every existing employer row without a tenant
do $$
declare
  _emp record;
begin
  for _emp in select id, user_id, company_name from public.employers where tenant_id is null loop
    perform public.bootstrap_employer_tenant(_emp.id, _emp.user_id, _emp.company_name);
  end loop;
end $$;

-- Update handle_new_user() to bootstrap tenant for email employer signups
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
  _emp_id uuid;
begin
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
    on conflict (user_id) do update set
      company_name = coalesce(nullif(excluded.company_name, ''), employers.company_name)
    returning id into _emp_id;

    if _emp_id is not null then
      perform public.bootstrap_employer_tenant(_emp_id, new.id, _meta ->> 'company_name');
    end if;
  end if;

  return new;
end $$;

-- Update complete_signup() to bootstrap tenant for OAuth signups selecting employer
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
  _emp_id uuid;
  _tenant_id uuid;
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
      contact_name = coalesce(nullif(excluded.contact_name, ''), employers.contact_name)
    returning id into _emp_id;

    if _emp_id is not null then
      _tenant_id := public.bootstrap_employer_tenant(_emp_id, _uid, _clean_company);
    end if;
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
    'role', _target_role,
    'tenant_id', _tenant_id
  );
end $$;

-- ---------------------------------------------------------------------
-- 3. Permission Matrix: tenant_role_permissions & has_tenant_permission()
-- ---------------------------------------------------------------------
create table if not exists public.tenant_role_permissions (
  role text not null check (role in ('owner', 'admin', 'recruiter', 'hiring_manager', 'interviewer', 'viewer')),
  permission text not null,
  primary key (role, permission)
);
alter table public.tenant_role_permissions enable row level security;
drop policy if exists "Anyone authenticated can read role permissions" on public.tenant_role_permissions;
create policy "Anyone authenticated can read role permissions" on public.tenant_role_permissions
  for select to authenticated, anon using (true);

-- Seed Permission Matrix
insert into public.tenant_role_permissions (role, permission) values
  -- Owner: all 18 permissions
  ('owner', 'job.create'), ('owner', 'job.publish'), ('owner', 'job.edit'),
  ('owner', 'app.view'), ('owner', 'app.move'), ('owner', 'app.note'),
  ('owner', 'interview.schedule'), ('owner', 'interview.feedback'), ('owner', 'offer.send'),
  ('owner', 'talent.search'), ('owner', 'talent.unlock'),
  ('owner', 'assessment.create'), ('owner', 'assessment.invite'),
  ('owner', 'billing.view'), ('owner', 'billing.manage'),
  ('owner', 'team.manage'), ('owner', 'api.manage'), ('owner', 'company.edit'),

  -- Admin: 17 permissions (all except billing.manage ownership transfer)
  ('admin', 'job.create'), ('admin', 'job.publish'), ('admin', 'job.edit'),
  ('admin', 'app.view'), ('admin', 'app.move'), ('admin', 'app.note'),
  ('admin', 'interview.schedule'), ('admin', 'interview.feedback'), ('admin', 'offer.send'),
  ('admin', 'talent.search'), ('admin', 'talent.unlock'),
  ('admin', 'assessment.create'), ('admin', 'assessment.invite'),
  ('admin', 'billing.view'),
  ('admin', 'team.manage'), ('admin', 'api.manage'), ('admin', 'company.edit'),

  -- Recruiter: job.*, app.*, interview.schedule, offer.send, talent.*, assessment.*, company.edit
  ('recruiter', 'job.create'), ('recruiter', 'job.publish'), ('recruiter', 'job.edit'),
  ('recruiter', 'app.view'), ('recruiter', 'app.move'), ('recruiter', 'app.note'),
  ('recruiter', 'interview.schedule'), ('recruiter', 'offer.send'),
  ('recruiter', 'talent.search'), ('recruiter', 'talent.unlock'),
  ('recruiter', 'assessment.create'), ('recruiter', 'assessment.invite'),
  ('recruiter', 'company.edit'),

  -- Hiring Manager: job.create/edit, app.view/note/move, interview.*, assessment.invite
  ('hiring_manager', 'job.create'), ('hiring_manager', 'job.edit'),
  ('hiring_manager', 'app.view'), ('hiring_manager', 'app.move'), ('hiring_manager', 'app.note'),
  ('hiring_manager', 'interview.schedule'), ('hiring_manager', 'interview.feedback'),
  ('hiring_manager', 'assessment.invite'),

  -- Interviewer: app.view, interview.feedback
  ('interviewer', 'app.view'), ('interviewer', 'interview.feedback'),

  -- Viewer: app.view, billing.view
  ('viewer', 'app.view'), ('viewer', 'billing.view')
on conflict (role, permission) do nothing;

create or replace function public.has_tenant_permission(_tenant uuid, _perm text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _m_role text;
begin
  if _uid is null or _tenant is null or _perm is null then return false; end if;
  if public.is_admin() then return true; end if;

  select m.role into _m_role
  from public.tenant_memberships m
  where m.tenant_id = _tenant and m.user_id = _uid;

  if _m_role is null then return false; end if;

  return exists (
    select 1 from public.tenant_role_permissions p
    where p.role = _m_role and p.permission = _perm
  );
end $$;

revoke all on function public.has_tenant_permission(uuid, text) from public, anon;
grant execute on function public.has_tenant_permission(uuid, text) to authenticated;

-- Update get_my_context() with tenant details and permissions
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
  _tenant_row public.tenant_organizations;
  _t_role text := null;
  _t_id uuid := null;
  _flags jsonb := '{}'::jsonb;
  _email_verified boolean := false;
  _perms text[] := '{}';
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
        'verified_domain', _emp_row.verified_domain,
        'tenant_id', _emp_row.tenant_id
      );
    end if;
  end if;

  -- Look up tenant membership
  select m.role, m.tenant_id into _t_role, _t_id
  from public.tenant_memberships m
  where m.user_id = _uid
  order by (m.role = 'owner') desc, m.created_at asc
  limit 1;

  if _t_id is not null then
    select * into _tenant_row from public.tenant_organizations where id = _t_id;

    select array_agg(permission) into _perms
    from public.tenant_role_permissions
    where role = _t_role;

    _tenant := jsonb_build_object(
      'id', _tenant_row.id,
      'name', _tenant_row.name,
      'slug', _tenant_row.slug,
      'role', _t_role,
      'plan', _tenant_row.plan,
      'tier', _tenant_row.tier,
      'is_active', _tenant_row.is_active,
      'permissions', coalesce(_perms, '{}')
    );
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

-- ---------------------------------------------------------------------
-- 4. Audit Log (Immutable, Append-Only)
-- ---------------------------------------------------------------------
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor_id uuid references auth.users(id) on delete set null,
  tenant_id uuid references public.tenant_organizations(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  ip_hash text
);
alter table public.audit_log enable row level security;
create index if not exists audit_log_tenant_idx on public.audit_log(tenant_id, at desc);
create index if not exists audit_log_actor_idx on public.audit_log(actor_id, at desc);

-- Immutability enforcement trigger
create or replace function public.audit_log_immutable()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_log is append-only' using errcode = '42501';
end $$;

drop trigger if exists trg_audit_log_immutable on public.audit_log;
create trigger trg_audit_log_immutable
  before update or delete on public.audit_log
  for each row execute function public.audit_log_immutable();

-- Log audit helper
create or replace function public.log_audit(
  p_tenant uuid,
  p_action text,
  p_entity text,
  p_entity_id text default null,
  p_meta jsonb default '{}'::jsonb,
  p_ip_hash text default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  _id bigint;
begin
  insert into public.audit_log (
    actor_id, tenant_id, action, entity, entity_id, meta, ip_hash, at
  )
  values (
    auth.uid(), p_tenant, p_action, p_entity, p_entity_id, coalesce(p_meta, '{}'::jsonb), p_ip_hash, now()
  )
  returning id into _id;

  return _id;
end $$;

revoke all on function public.log_audit(uuid, text, text, text, jsonb, text) from public, anon;
grant execute on function public.log_audit(uuid, text, text, text, jsonb, text) to authenticated;

-- Audit log RLS
drop policy if exists "Tenant admins can view own tenant audit log" on public.audit_log;
create policy "Tenant admins can view own tenant audit log" on public.audit_log
  for select to authenticated
  using (
    public.is_admin() or (
      tenant_id is not null and public.has_tenant_permission(tenant_id, 'team.manage')
    )
  );

create or replace function public.list_audit_log(
  p_tenant uuid,
  p_limit int default 50,
  p_cursor bigint default null
)
returns table (
  id bigint,
  at timestamptz,
  actor_id uuid,
  tenant_id uuid,
  action text,
  entity text,
  entity_id text,
  meta jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and not public.has_tenant_permission(p_tenant, 'team.manage') then
    raise exception 'Unauthorized to view audit logs' using errcode = '42501';
  end if;

  return query
  select a.id, a.at, a.actor_id, a.tenant_id, a.action, a.entity, a.entity_id, a.meta
  from public.audit_log a
  where (p_tenant is null or a.tenant_id = p_tenant)
    and (p_cursor is null or a.id < p_cursor)
  order by a.id desc
  limit least(coalesce(p_limit, 50), 100);
end $$;

revoke all on function public.list_audit_log(uuid, int, bigint) from public, anon;
grant execute on function public.list_audit_log(uuid, int, bigint) to authenticated;

-- ---------------------------------------------------------------------
-- 5. Team Invites & Management
-- ---------------------------------------------------------------------
create table if not exists public.tenant_invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_organizations(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'recruiter', 'hiring_manager', 'interviewer', 'viewer')),
  token_hash text not null unique,
  invited_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.tenant_invites enable row level security;

drop policy if exists "Tenant members with team.manage can view invites" on public.tenant_invites;
create policy "Tenant members with team.manage can view invites" on public.tenant_invites
  for select to authenticated
  using (public.has_tenant_permission(tenant_id, 'team.manage') or public.is_admin());

-- Invite team member
create or replace function public.invite_team_member(
  p_tenant uuid,
  p_email text,
  p_role text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  _uid uuid := auth.uid();
  _clean_email text := lower(trim(p_email));
  _raw_token text;
  _hash text;
  _invite_id uuid;
  _expires timestamptz := now() + interval '7 days';
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  if not public.has_tenant_permission(p_tenant, 'team.manage') then
    raise exception 'Unauthorized: team.manage permission required' using errcode = '42501';
  end if;

  if p_role not in ('admin', 'recruiter', 'hiring_manager', 'interviewer', 'viewer') then
    raise exception 'Invalid team role' using errcode = '22023';
  end if;

  if p_role = 'admin' then
    perform public.require_aal2();
  end if;

  if _clean_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
    raise exception 'Invalid email format' using errcode = '22023';
  end if;

  -- Check if already member
  if exists (
    select 1 from public.tenant_memberships m
    join auth.users u on u.id = m.user_id
    where m.tenant_id = p_tenant and lower(u.email) = _clean_email
  ) then
    raise exception 'User is already a member of this organization' using errcode = '22023';
  end if;

  _raw_token := encode(gen_random_bytes(32), 'hex');
  _hash := encode(digest(_raw_token, 'sha256'), 'hex');

  -- Invalidate previous pending invites for this email in this tenant
  update public.tenant_invites
  set revoked_at = now()
  where tenant_id = p_tenant and email = _clean_email and accepted_at is null and revoked_at is null;

  insert into public.tenant_invites (tenant_id, email, role, token_hash, invited_by, expires_at)
  values (p_tenant, _clean_email, p_role, _hash, _uid, _expires)
  returning id into _invite_id;

  perform public.log_audit(
    p_tenant, 'invite_team_member', 'tenant_invites', _invite_id::text,
    jsonb_build_object('email', _clean_email, 'role', p_role)
  );

  return jsonb_build_object(
    'invite_id', _invite_id,
    'token', _raw_token,
    'expires_at', _expires
  );
end $$;

revoke all on function public.invite_team_member(uuid, text, text) from public, anon;
grant execute on function public.invite_team_member(uuid, text, text) to authenticated;

-- Revoke invite
create or replace function public.revoke_invite(p_invite_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _inv public.tenant_invites;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _inv from public.tenant_invites where id = p_invite_id;
  if not found then raise exception 'Invite not found' using errcode = '22023'; end if;

  if not public.has_tenant_permission(_inv.tenant_id, 'team.manage') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  update public.tenant_invites set revoked_at = now() where id = p_invite_id;

  perform public.log_audit(
    _inv.tenant_id, 'revoke_invite', 'tenant_invites', p_invite_id::text,
    jsonb_build_object('email', _inv.email)
  );

  return true;
end $$;

revoke all on function public.revoke_invite(uuid) from public, anon;
grant execute on function public.revoke_invite(uuid) to authenticated;

-- Accept invite
create or replace function public.accept_invite(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  _uid uuid := auth.uid();
  _caller_email text;
  _hash text;
  _inv public.tenant_invites;
  _has_employee boolean;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  _hash := encode(digest(p_token, 'sha256'), 'hex');

  select * into _inv
  from public.tenant_invites
  where token_hash = _hash
    and accepted_at is null
    and revoked_at is null
    and expires_at > now();

  if not found then
    raise exception 'Invite is invalid, expired, or revoked' using errcode = '22023';
  end if;

  select lower(email) into _caller_email from public.profiles where id = _uid;

  if _caller_email is distinct from lower(_inv.email) then
    raise exception 'This invite was issued to %', _inv.email using errcode = '42501';
  end if;

  -- Ensure role exclusivity: Cannot accept employer team invite if account has employee role
  select exists (
    select 1 from public.user_roles where user_id = _uid and role = 'employee'
  ) into _has_employee;

  if _has_employee then
    raise exception 'Account already has an employee role. Use a dedicated employer account.' using errcode = '42501';
  end if;

  insert into public.tenant_memberships (tenant_id, user_id, role)
  values (_inv.tenant_id, _uid, _inv.role)
  on conflict (tenant_id, user_id) do update set role = excluded.role;

  insert into public.user_roles (user_id, role)
  values (_uid, 'employer')
  on conflict (user_id, role) do nothing;

  update public.tenant_invites
  set accepted_at = now()
  where id = _inv.id;

  perform public.log_audit(
    _inv.tenant_id, 'accept_invite', 'tenant_memberships', _uid::text,
    jsonb_build_object('role', _inv.role, 'email', _caller_email)
  );

  return jsonb_build_object(
    'success', true,
    'tenant_id', _inv.tenant_id,
    'role', _inv.role
  );
end $$;

revoke all on function public.accept_invite(text) from public, anon;
grant execute on function public.accept_invite(text) to authenticated;

-- Change member role
create or replace function public.change_member_role(
  p_tenant uuid,
  p_user uuid,
  p_role text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _current_role text;
  _owner_count int;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  if not public.has_tenant_permission(p_tenant, 'team.manage') then
    raise exception 'Unauthorized: team.manage permission required' using errcode = '42501';
  end if;

  if p_role not in ('admin', 'recruiter', 'hiring_manager', 'interviewer', 'viewer') then
    raise exception 'Invalid role' using errcode = '22023';
  end if;

  if p_role = 'admin' then
    perform public.require_aal2();
  end if;

  select role into _current_role
  from public.tenant_memberships
  where tenant_id = p_tenant and user_id = p_user;

  if _current_role is null then
    raise exception 'Member not found' using errcode = '22023';
  end if;

  -- Protect last owner
  if _current_role = 'owner' and p_role <> 'owner' then
    select count(*) into _owner_count
    from public.tenant_memberships
    where tenant_id = p_tenant and role = 'owner';

    if _owner_count <= 1 then
      raise exception 'Cannot demote the last owner. Transfer ownership first.' using errcode = '42501';
    end if;
  end if;

  update public.tenant_memberships
  set role = p_role
  where tenant_id = p_tenant and user_id = p_user;

  perform public.log_audit(
    p_tenant, 'change_member_role', 'tenant_memberships', p_user::text,
    jsonb_build_object('old_role', _current_role, 'new_role', p_role)
  );

  return true;
end $$;

revoke all on function public.change_member_role(uuid, uuid, text) from public, anon;
grant execute on function public.change_member_role(uuid, uuid, text) to authenticated;

-- Remove member
create or replace function public.remove_member(
  p_tenant uuid,
  p_user uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _m_role text;
  _owner_count int;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  if not public.has_tenant_permission(p_tenant, 'team.manage') then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select role into _m_role
  from public.tenant_memberships
  where tenant_id = p_tenant and user_id = p_user;

  if _m_role is null then
    raise exception 'Member not found' using errcode = '22023';
  end if;

  if _m_role = 'owner' then
    select count(*) into _owner_count
    from public.tenant_memberships
    where tenant_id = p_tenant and role = 'owner';

    if _owner_count <= 1 then
      raise exception 'Cannot remove the last owner. Transfer ownership first.' using errcode = '42501';
    end if;
  end if;

  delete from public.tenant_memberships
  where tenant_id = p_tenant and user_id = p_user;

  perform public.log_audit(
    p_tenant, 'remove_member', 'tenant_memberships', p_user::text,
    jsonb_build_object('removed_role', _m_role)
  );

  return true;
end $$;

revoke all on function public.remove_member(uuid, uuid) from public, anon;
grant execute on function public.remove_member(uuid, uuid) to authenticated;

-- Leave tenant
create or replace function public.leave_tenant(p_tenant uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _m_role text;
  _owner_count int;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  select role into _m_role
  from public.tenant_memberships
  where tenant_id = p_tenant and user_id = _uid;

  if _m_role is null then
    raise exception 'You are not a member of this organization' using errcode = '22023';
  end if;

  if _m_role = 'owner' then
    select count(*) into _owner_count
    from public.tenant_memberships
    where tenant_id = p_tenant and role = 'owner';

    if _owner_count <= 1 then
      raise exception 'Cannot leave as the last owner. Transfer ownership first.' using errcode = '42501';
    end if;
  end if;

  delete from public.tenant_memberships
  where tenant_id = p_tenant and user_id = _uid;

  perform public.log_audit(
    p_tenant, 'leave_tenant', 'tenant_memberships', _uid::text,
    jsonb_build_object('left_role', _m_role)
  );

  return true;
end $$;

revoke all on function public.leave_tenant(uuid) from public, anon;
grant execute on function public.leave_tenant(uuid) to authenticated;

-- Transfer ownership
create or replace function public.transfer_ownership(
  p_tenant uuid,
  p_new_owner uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _caller_role text;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  perform public.require_aal2();

  select role into _caller_role
  from public.tenant_memberships
  where tenant_id = p_tenant and user_id = _uid;

  if _caller_role <> 'owner' and not public.is_admin() then
    raise exception 'Only the current owner can transfer ownership' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.tenant_memberships where tenant_id = p_tenant and user_id = p_new_owner
  ) then
    raise exception 'New owner must already be a member of the organization' using errcode = '22023';
  end if;

  update public.tenant_organizations
  set owner_user_id = p_new_owner, updated_at = now()
  where id = p_tenant;

  update public.tenant_memberships
  set role = 'admin'
  where tenant_id = p_tenant and user_id = _uid;

  update public.tenant_memberships
  set role = 'owner'
  where tenant_id = p_tenant and user_id = p_new_owner;

  perform public.log_audit(
    p_tenant, 'transfer_ownership', 'tenant_organizations', p_tenant::text,
    jsonb_build_object('previous_owner', _uid, 'new_owner', p_new_owner)
  );

  return true;
end $$;

revoke all on function public.transfer_ownership(uuid, uuid) from public, anon;
grant execute on function public.transfer_ownership(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 6. Employer Verification & Moderation
-- ---------------------------------------------------------------------
-- Private bucket employer-docs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'employer-docs', 'employer-docs', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png'];

drop policy if exists "Tenant admins can manage employer verification docs" on storage.objects;
create policy "Tenant admins can manage employer verification docs" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'employer-docs' and (
      public.is_admin() or exists (
        select 1 from public.tenant_memberships m
        where m.user_id = auth.uid()
          and m.role in ('owner', 'admin')
          and m.tenant_id::text = split_part(name, '/', 1)
      )
    )
  )
  with check (
    bucket_id = 'employer-docs' and (
      public.is_admin() or exists (
        select 1 from public.tenant_memberships m
        where m.user_id = auth.uid()
          and m.role in ('owner', 'admin')
          and m.tenant_id::text = split_part(name, '/', 1)
      )
    )
  );

-- Submit employer verification
create or replace function public.submit_employer_verification(
  p_docs jsonb,
  p_gstin text default null,
  p_cin text default null,
  p_pan text default null
)
returns public.employers
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _emp public.employers;
  _free_mail boolean := false;
  _email_domain text;
  _web_domain text;
  _domain_mismatch boolean := false;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _emp from public.employers where user_id = _uid;
  if not found then raise exception 'Employer profile not found' using errcode = '22023'; end if;

  if not public.has_tenant_permission(_emp.tenant_id, 'company.edit') and not public.is_admin() then
    raise exception 'Unauthorized: company.edit permission required' using errcode = '42501';
  end if;

  -- Regex validations
  if p_gstin is not null and length(trim(p_gstin)) > 0 then
    if upper(trim(p_gstin)) !~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$' then
      raise exception 'Invalid GSTIN format' using errcode = '22023';
    end if;
  end if;

  if p_cin is not null and length(trim(p_cin)) > 0 then
    if upper(trim(p_cin)) !~ '^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$' then
      raise exception 'Invalid CIN format' using errcode = '22023';
    end if;
  end if;

  if p_pan is not null and length(trim(p_pan)) > 0 then
    if upper(trim(p_pan)) !~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' then
      raise exception 'Invalid PAN format' using errcode = '22023';
    end if;
  end if;

  -- Detect freemail official email
  _email_domain := lower(split_part(_emp.official_email, '@', 2));
  if _email_domain in ('gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'zoho.com') then
    _free_mail := true;
  end if;

  -- Check website domain mismatch
  if _emp.website is not null and length(_emp.website) > 0 then
    _web_domain := lower(regexp_replace(regexp_replace(_emp.website, '^https?://(www\.)?', ''), '/.*$', ''));
    if _email_domain is not null and _web_domain is not null and _email_domain <> _web_domain and not _free_mail then
      _domain_mismatch := true;
    end if;
  end if;

  update public.employers
  set
    verification_documents = coalesce(p_docs, '{}'::jsonb) || jsonb_build_object(
      'free_mail_flag', _free_mail,
      'domain_mismatch_flag', _domain_mismatch,
      'email_domain', _email_domain,
      'web_domain', _web_domain
    ),
    verification_status = 'pending',
    verification_submitted_at = now(),
    gst_number = nullif(upper(trim(p_gstin)), ''),
    cin_number = nullif(upper(trim(p_cin)), ''),
    pan_number = nullif(upper(trim(p_pan)), ''),
    updated_at = now()
  where id = _emp.id
  returning * into _emp;

  perform public.log_audit(
    _emp.tenant_id, 'submit_employer_verification', 'employers', _emp.id::text,
    jsonb_build_object('gstin', p_gstin, 'cin', p_cin, 'pan', p_pan)
  );

  return _emp;
end $$;

revoke all on function public.submit_employer_verification(jsonb, text, text, text) from public, anon;
grant execute on function public.submit_employer_verification(jsonb, text, text, text) to authenticated;

-- Helper to check employer capabilities based on verification and suspension
create or replace function public.employer_can(
  _tenant uuid,
  _action text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _t public.tenant_organizations;
  _emp public.employers;
begin
  if _tenant is null or _action is null then return false; end if;

  select * into _t from public.tenant_organizations where id = _tenant;
  if not found or not _t.is_active then return false; end if;

  select * into _emp from public.employers where id = _t.employer_id;
  if not found or _emp.verification_status = 'suspended' then return false; end if;

  if _emp.verification_status = 'verified' then
    return true;
  elsif _emp.verification_status = 'pending' then
    if _action in ('search', 'draft') then
      return true;
    elsif _action = 'publish' then
      -- In pending status, only 1 job can be submitted for review
      return (select count(*) from public.employer_job_openings where tenant_id = _tenant and status in ('active', 'published')) < 1;
    else
      return false;
    end if;
  else
    return false;
  end if;
end $$;

revoke all on function public.employer_can(uuid, text) from public, anon;
grant execute on function public.employer_can(uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- 7. Platform Admin RPCs (Requires is_admin() AND AAL2)
-- ---------------------------------------------------------------------

-- Admin: list employers
create or replace function public.admin_list_employers(
  p_status text default null,
  p_search text default null,
  p_limit int default 50
)
returns table (
  id uuid,
  user_id uuid,
  company_name text,
  official_email text,
  contact_name text,
  verification_status text,
  tenant_id uuid,
  tenant_name text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;
  perform public.require_aal2();

  return query
  select
    e.id, e.user_id, e.company_name, e.official_email, e.contact_name,
    e.verification_status, e.tenant_id, t.name as tenant_name, e.created_at
  from public.employers e
  left join public.tenant_organizations t on t.id = e.tenant_id
  where (p_status is null or e.verification_status = p_status)
    and (
      p_search is null
      or e.company_name ilike '%' || p_search || '%'
      or e.official_email ilike '%' || p_search || '%'
      or e.contact_name ilike '%' || p_search || '%'
    )
  order by e.created_at desc
  limit least(coalesce(p_limit, 50), 100);
end $$;

revoke all on function public.admin_list_employers(text, text, int) from public, anon;
grant execute on function public.admin_list_employers(text, text, int) to authenticated;

-- Admin: review employer verification
create or replace function public.admin_review_employer(
  p_employer_id uuid,
  p_status text,
  p_reason text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _emp public.employers;
begin
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;
  perform public.require_aal2();

  if p_status not in ('verified', 'rejected', 'suspended', 'pending') then
    raise exception 'Invalid status' using errcode = '22023';
  end if;

  select * into _emp from public.employers where id = p_employer_id;
  if not found then raise exception 'Employer not found' using errcode = '22023'; end if;

  update public.employers
  set
    verification_status = p_status,
    verified_at = case when p_status = 'verified' then now() else verified_at end,
    rejection_reason = case when p_status = 'rejected' then p_reason else rejection_reason end,
    updated_at = now()
  where id = p_employer_id;

  if p_status = 'suspended' then
    update public.tenant_organizations set is_active = false where id = _emp.tenant_id;
    update public.employer_job_openings set status = 'closed' where tenant_id = _emp.tenant_id;
  elsif p_status = 'verified' then
    update public.tenant_organizations set is_active = true where id = _emp.tenant_id;
  end if;

  perform public.log_audit(
    _emp.tenant_id, 'admin_review_employer', 'employers', p_employer_id::text,
    jsonb_build_object('status', p_status, 'reason', p_reason)
  );

  perform public.push_notification(
    _emp.user_id,
    'verification',
    case when p_status = 'verified' then 'Company Verified' else 'Verification Update' end,
    case when p_status = 'verified' then 'Your employer profile has been approved.' else coalesce(p_reason, 'Your verification status is ' || p_status) end
  );

  return true;
end $$;

revoke all on function public.admin_review_employer(uuid, text, text) from public, anon;
grant execute on function public.admin_review_employer(uuid, text, text) to authenticated;

-- Admin: suspend user
create or replace function public.admin_suspend_user(
  p_user_id uuid,
  p_reason text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  _emp public.employers;
begin
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;
  perform public.require_aal2();

  select * into _emp from public.employers where user_id = p_user_id;
  if found then
    update public.employers set verification_status = 'suspended' where id = _emp.id;
    update public.tenant_organizations set is_active = false where id = _emp.tenant_id;
    update public.employer_job_openings set status = 'closed' where tenant_id = _emp.tenant_id;
  end if;

  perform public.log_audit(
    _emp.tenant_id, 'admin_suspend_user', 'users', p_user_id::text,
    jsonb_build_object('reason', p_reason)
  );

  return true;
end $$;

revoke all on function public.admin_suspend_user(uuid, text) from public, anon;
grant execute on function public.admin_suspend_user(uuid, text) to authenticated;

-- Admin: list pending jobs
create or replace function public.admin_list_jobs_pending(p_limit int default 50)
returns table (
  id uuid,
  tenant_id uuid,
  company_name text,
  designation text,
  created_at timestamptz,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;
  perform public.require_aal2();

  return query
  select j.id, j.tenant_id, j.company_name, j.designation, j.created_at, j.status
  from public.employer_job_openings j
  where j.status in ('pending_review', 'active')
  order by j.created_at desc
  limit least(coalesce(p_limit, 50), 100);
end $$;

revoke all on function public.admin_list_jobs_pending(int) from public, anon;
grant execute on function public.admin_list_jobs_pending(int) to authenticated;

-- Admin: moderate job
create or replace function public.admin_moderate_job(
  p_job_id uuid,
  p_approve boolean,
  p_reason text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _j public.employer_job_openings;
begin
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;
  perform public.require_aal2();

  select * into _j from public.employer_job_openings where id = p_job_id;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  update public.employer_job_openings
  set
    status = case when p_approve then 'active' else 'rejected' end,
    is_public = p_approve,
    updated_at = now()
  where id = p_job_id;

  perform public.log_audit(
    _j.tenant_id, 'admin_moderate_job', 'employer_job_openings', p_job_id::text,
    jsonb_build_object('approve', p_approve, 'reason', p_reason)
  );

  return true;
end $$;

revoke all on function public.admin_moderate_job(uuid, boolean, text) from public, anon;
grant execute on function public.admin_moderate_job(uuid, boolean, text) to authenticated;

-- Admin: stats
create or replace function public.admin_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _users_count int;
  _employers_count int;
  _active_jobs_count int;
  _apps_count int;
begin
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;
  perform public.require_aal2();

  select count(*) into _users_count from public.profiles;
  select count(*) into _employers_count from public.employers;
  select count(*) into _active_jobs_count from public.employer_job_openings where status = 'active';
  select count(*) into _apps_count from public.job_applications;

  return jsonb_build_object(
    'total_candidates', _users_count,
    'total_employers', _employers_count,
    'active_jobs', _active_jobs_count,
    'total_applications', _apps_count,
    'generated_at', now()
  );
end $$;

revoke all on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;
