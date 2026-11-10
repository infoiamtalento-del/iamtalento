-- =====================================================================
-- Stage 4: Job Posting Lifecycle (Employer -> Candidates)
-- Migration: 20261029101600_jobs_lifecycle.sql
-- =====================================================================

-- 1. Extend employer_job_openings with lifecycle columns
alter table public.employer_job_openings
  add column if not exists slug text,
  add column if not exists locations text[] not null default '{}',
  add column if not exists currency text not null default 'INR',
  add column if not exists salary_visible boolean not null default true,
  add column if not exists employment_type text,
  add column if not exists application_deadline timestamptz,
  add column if not exists screening_questions jsonb not null default '[]'::jsonb,
  add column if not exists published_at timestamptz,
  add column if not exists closed_reason text,
  add column if not exists views_count integer not null default 0,
  add column if not exists applications_count integer not null default 0,
  add column if not exists moderation_note text,
  add column if not exists is_demo boolean not null default false,
  add column if not exists deleted_at timestamptz,
  add column if not exists source_hash text,
  add column if not exists embedding_model text not null default 'text-embedding-3-small';

-- Update status constraint on employer_job_openings
alter table public.employer_job_openings
  drop constraint if exists employer_job_openings_status_check;

alter table public.employer_job_openings
  add constraint employer_job_openings_status_check
    check (status in ('draft', 'pending_review', 'active', 'paused', 'closed', 'expired', 'rejected'));

-- Update existing platform seed jobs to be marked as is_demo = true
update public.employer_job_openings
set is_demo = true
where source = 'platform' or user_id is null;

-- Ensure platform_settings has show_demo_jobs key
insert into public.platform_settings (key, value)
values ('show_demo_jobs', 'false'::jsonb)
on conflict (key) do nothing;

-- Backfill slugs for existing jobs
create or replace function public.generate_job_slug(p_title text, p_id uuid)
returns text
language plpgsql
immutable
security definer
set search_path = public
as $$
declare
  _clean text;
begin
  _clean := regexp_replace(lower(trim(coalesce(p_title, 'job'))), '[^a-z0-9]+', '-', 'g');
  _clean := trim(both '-' from _clean);
  if length(_clean) < 2 then
    _clean := 'job';
  end if;
  return _clean || '-' || substring(p_id::text from 1 for 8);
end $$;

revoke all on function public.generate_job_slug(text, uuid) from public, anon, authenticated;
grant execute on function public.generate_job_slug(text, uuid) to service_role;

update public.employer_job_openings
set slug = public.generate_job_slug(designation, id)
where slug is null;

create unique index if not exists idx_employer_job_openings_slug
  on public.employer_job_openings(slug);

-- 2. Embedding Queue table and triggers
create table if not exists public.embedding_queue (
  id bigint generated always as identity primary key,
  entity text not null check (entity in ('job', 'candidate')),
  entity_id uuid not null,
  enqueued_at timestamptz not null default now(),
  processed_at timestamptz,
  attempts integer not null default 0,
  error text,
  unique (entity, entity_id)
);

create index if not exists idx_embedding_queue_pending
  on public.embedding_queue(entity, enqueued_at)
  where processed_at is null;

alter table public.embedding_queue enable row level security;
create policy "Embedding queue is internal only"
  on public.embedding_queue for all using (false);

-- Trigger to enqueue jobs for embedding on create or content update
create or replace function public.queue_job_embedding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' or (
    old.designation is distinct from new.designation or
    old.skills is distinct from new.skills or
    old.job_description is distinct from new.job_description
  ) then
    insert into public.embedding_queue (entity, entity_id, enqueued_at, processed_at)
    values ('job', new.id, now(), null)
    on conflict (entity, entity_id) do update set
      enqueued_at = now(),
      processed_at = null;
  end if;
  return new;
end $$;

drop trigger if exists queue_job_embedding_trg on public.employer_job_openings;
create trigger queue_job_embedding_trg
after insert or update on public.employer_job_openings
for each row
execute function public.queue_job_embedding();

-- 3. Daily Views Deduplication Table
create table if not exists public.job_daily_views (
  job_id uuid not null references public.employer_job_openings(id) on delete cascade,
  viewer_hash text not null,
  view_date date not null default current_date,
  primary key (job_id, viewer_hash, view_date)
);

create index if not exists idx_job_daily_views_date
  on public.job_daily_views(job_id, view_date);

alter table public.job_daily_views enable row level security;
create policy "Daily views is internal" on public.job_daily_views for all using (false);

-- 4. Trigger to maintain applications_count on employer_job_openings
create or replace function public.sync_job_applications_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.employer_job_openings
    set applications_count = applications_count + 1
    where id = new.job_id;
  elsif tg_op = 'DELETE' then
    update public.employer_job_openings
    set applications_count = greatest(applications_count - 1, 0)
    where id = old.job_id;
  elsif tg_op = 'UPDATE' and old.job_id <> new.job_id then
    update public.employer_job_openings
    set applications_count = greatest(applications_count - 1, 0)
    where id = old.job_id;

    update public.employer_job_openings
    set applications_count = applications_count + 1
    where id = new.job_id;
  end if;
  return null;
end $$;

drop trigger if exists sync_job_applications_count_trg on public.job_applications;
create trigger sync_job_applications_count_trg
after insert or update or delete on public.job_applications
for each row
execute function public.sync_job_applications_count();

-- 5. Automated Screening: job_risk_flags
create or replace function public.job_risk_flags(p_text text)
returns boolean
language plpgsql
immutable
security definer
set search_path = public
as $$
declare
  _lower text := lower(coalesce(p_text, ''));
begin
  if _lower = '' then return false; end if;

  -- 1. Fee / deposit scam phrases
  if _lower ~* '(registration\s+fee|processing\s+charge|training\s+fee|security\s+deposit|pay\s+before\s+joining|investment\s+required|initial\s+deposit)' then
    return true;
  end if;

  -- 2. WhatsApp-only / direct DM bypass
  if _lower ~* '(whatsapp\s+only|contact\s+on\s+whatsapp|wa\.me/|dm\s+on\s+whatsapp)' then
    return true;
  end if;

  -- 3. Free-mail contact in description
  if _lower ~* '[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.com' then
    return true;
  end if;

  -- 4. Fast money scams
  if _lower ~* '(crypto\s+payout|earn\s+money\s+fast|earn\s+[0-9]+\s+daily|part-time\s+sms\s+sending|typing\s+jobs\s+daily\s+payment)' then
    return true;
  end if;

  return false;
end $$;

revoke all on function public.job_risk_flags(text) from public, anon, authenticated;
grant execute on function public.job_risk_flags(text) to service_role;

-- 6. Quota check stub (Stage 7 will connect to billing tiers)
create or replace function public.check_quota(p_tenant uuid, p_feature text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return true;
end $$;

revoke all on function public.check_quota(uuid, text) from public, anon, authenticated;
grant execute on function public.check_quota(uuid, text) to service_role;

-- 7. Add job.post and job.close permissions to tenant_role_permissions
insert into public.tenant_role_permissions (role, permission) values
  ('owner', 'job.post'), ('owner', 'job.close'),
  ('admin', 'job.post'), ('admin', 'job.close'),
  ('recruiter', 'job.post'), ('recruiter', 'job.close'),
  ('hiring_manager', 'job.post'), ('hiring_manager', 'job.close')
on conflict (role, permission) do nothing;

-- Update employer_can helper
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
    if _action in ('search', 'draft', 'job.create', 'job.post', 'job.edit') then
      return true;
    elsif _action in ('publish', 'job.publish') then
      return (select count(*) from public.employer_job_openings where tenant_id = _tenant and status in ('active', 'pending_review', 'published')) < 1;
    else
      return false;
    end if;
  else
    return false;
  end if;
end $$;

revoke all on function public.employer_can(uuid, text) from public, anon;
grant execute on function public.employer_can(uuid, text) to authenticated;

-- 8. Permanent D2 Fix: Intercept all direct client mutations with jobs_protect trigger
create or replace function public.jobs_protect_statement()
returns trigger
language plpgsql
as $$
begin
  if public.is_client_role() then
    raise exception 'Direct client writes to employer_job_openings are prohibited. Use RPCs (create_job, update_job, close_job, etc.).' using errcode = '42501';
  end if;
  return null;
end $$;

drop trigger if exists jobs_protect_stmt_trg on public.employer_job_openings;
create trigger jobs_protect_stmt_trg
before insert or update or delete on public.employer_job_openings
for each statement
execute function public.jobs_protect_statement();

create or replace function public.jobs_protect()
returns trigger
language plpgsql
as $$
begin
  if public.is_client_role() then
    raise exception 'Direct client writes to employer_job_openings are prohibited. Use RPCs (create_job, update_job, close_job, etc.).' using errcode = '42501';
  end if;

  if tg_op = 'INSERT' then
    if new.slug is null and new.designation is not null then
      new.slug := public.generate_job_slug(new.designation, new.id);
    end if;
  end if;

  return new;
end $$;

drop trigger if exists jobs_protect_trg on public.employer_job_openings;
create trigger jobs_protect_trg
before insert or update or delete on public.employer_job_openings
for each row
execute function public.jobs_protect();

-- Remove all direct INSERT/UPDATE/DELETE client policies on employer_job_openings
drop policy if exists "Employers can manage own job openings" on public.employer_job_openings;
drop policy if exists "Tenant members manage tenant jobs" on public.employer_job_openings;
drop policy if exists "Admins manage all jobs" on public.employer_job_openings;
drop policy if exists "Anyone can browse active public jobs" on public.employer_job_openings;
drop policy if exists "Tenant members can view tenant jobs" on public.employer_job_openings;

create policy "Anyone can browse active public jobs" on public.employer_job_openings
  for select to anon, authenticated
  using (
    status = 'active'
    and is_public = true
    and deleted_at is null
    and (closes_at is null or closes_at > now())
    and (not is_demo or coalesce((select value::boolean from public.platform_settings where key = 'show_demo_jobs'), false))
  );

create policy "Tenant members can view tenant jobs" on public.employer_job_openings
  for select to authenticated
  using (
    (tenant_id is not null and public.is_tenant_member(tenant_id))
    or user_id = auth.uid()
    or public.is_admin()
  );

-- 9. Job Alerts Trigger Update: fire only on transition into active
create or replace function public.queue_job_alerts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _a record;
begin
  if new.status <> 'active' or not new.is_public or new.is_demo or new.deleted_at is not null then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.status = 'active' then
    return new;
  end if;

  for _a in
    select a.* from public.job_alerts a
    where a.is_active
      and (cardinality(a.keywords) = 0 or exists (
        select 1 from unnest(a.keywords) k where new.designation ilike '%' || k || '%'
          or exists (select 1 from unnest(new.skills) s where s ilike '%' || k || '%')))
      and (a.work_mode is null or a.work_mode = new.work_mode)
      and (a.location is null or new.job_location ilike '%' || a.location || '%' or new.work_mode = 'Remote')
    limit 500
  loop
    insert into public.job_alert_queue (alert_id, job_id) values (_a.id, new.id) on conflict do nothing;
    if _a.user_id is not null then
      perform public.push_notification(
        _a.user_id,
        'job_alert',
        'New job: ' || new.designation,
        coalesce(new.company_name, 'A company') || ' is hiring' || coalesce(' in ' || new.job_location, ''),
        '/jobs'
      );
    end if;
  end loop;
  return new;
end $$;

drop trigger if exists job_alerts_trg on public.employer_job_openings;
create trigger job_alerts_trg
after insert or update of status, is_public, deleted_at on public.employer_job_openings
for each row
execute function public.queue_job_alerts();

-- 10. Update apply_to_job to prevent applying to sample/demo jobs
create or replace function public.apply_to_job(p_job uuid, p_cover_note text default null)
returns public.job_applications
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _app public.job_applications;
  _m jsonb;
  _snap jsonb;
  _best numeric;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();
  if length(coalesce(p_cover_note, '')) > 5000 then raise exception 'Cover note is too long'; end if;
  perform public.rate_limit_hit('apply_job', 60, interval '1 hour');

  select * into _job from public.employer_job_openings
  where id = p_job and status = 'active' and is_public and deleted_at is null;

  if not found then raise exception 'This job is no longer accepting applications' using errcode = '22023'; end if;
  if _job.closes_at is not null and _job.closes_at < now() then raise exception 'Applications for this job have closed' using errcode = '22023'; end if;

  if _job.is_demo then
    raise exception 'This is a sample listing and cannot receive real applications' using errcode = '22023';
  end if;

  select * into _app from public.job_applications where job_id = p_job and candidate_id = _uid;
  if found then
    if _app.stage = 'Withdrawn' then
      update public.job_applications
      set stage = 'Applied', cover_note = coalesce(p_cover_note, cover_note), applied_at = now()
      where id = _app.id
      returning * into _app;
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
    'readiness_score', p.industry_readiness_score,
    'verification', p.verification_status)
  into _snap from public.profiles p where p.id = _uid;

  insert into public.job_applications (job_id, candidate_id, tenant_id, cover_note, match_score, match_breakdown, profile_snapshot)
  values (p_job, _uid, _job.tenant_id, p_cover_note, (_m ->> 'score')::numeric, _m, coalesce(_snap, '{}'::jsonb))
  returning * into _app;

  return _app;
end $$;

-- 11. Update search_jobs to respect deleted_at and demo settings
create or replace function public.search_jobs(
  p_query text default null,
  p_work_mode text default null,
  p_job_type text default null,
  p_max_exp numeric default null,
  p_location text default null,
  p_min_salary numeric default null,
  p_skills text[] default null,
  p_sort text default 'recent',
  p_limit integer default 24,
  p_offset integer default 0
)
returns table (
  id uuid,
  designation text,
  company_name text,
  job_location text,
  work_mode text,
  job_type text,
  experience_min numeric,
  salary_min numeric,
  salary_max numeric,
  skills text[],
  created_at timestamptz,
  match_score numeric,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  _q text := nullif(btrim(p_query), '');
  _uid uuid := auth.uid();
begin
  return query
  with filtered as (
    select j.* from public.employer_job_openings j
    where j.status = 'active'
      and j.is_public
      and j.deleted_at is null
      and (j.closes_at is null or j.closes_at > now())
      and (not j.is_demo or coalesce((select value::boolean from public.platform_settings where key = 'show_demo_jobs'), false))
      and (_q is null or j.designation ilike '%' || _q || '%' or j.company_name ilike '%' || _q || '%'
           or exists (select 1 from unnest(j.skills) s where s ilike '%' || _q || '%'))
      and (p_work_mode is null or j.work_mode = p_work_mode)
      and (p_job_type is null or j.job_type = p_job_type)
      and (p_max_exp is null or j.experience_min <= p_max_exp)
      and (p_location is null or j.job_location ilike '%' || p_location || '%' or j.work_mode = 'Remote')
      and (p_min_salary is null or coalesce(j.salary_max, 0) >= p_min_salary)
      and (p_skills is null or j.skills && p_skills)
  ),
  scored as (
    select f.*,
      case when _uid is not null and p_sort = 'match'
           then (public.compute_match_score(_uid, f.id) ->> 'score')::numeric
      end as ms
    from filtered f
  ),
  paged as (
    select s.*, count(*) over () as tc from scored s
    order by
      case when p_sort = 'match' then s.ms end desc nulls last,
      case when p_sort = 'salary' then s.salary_max end desc nulls last,
      s.created_at desc
    limit least(greatest(p_limit, 1), 100)
    offset greatest(p_offset, 0)
  )
  select
    p.id,
    p.designation,
    p.company_name,
    p.job_location,
    p.work_mode,
    p.job_type,
    p.experience_min,
    p.salary_min,
    p.salary_max,
    p.skills,
    p.created_at,
    coalesce(p.ms, case when _uid is not null then (public.compute_match_score(_uid, p.id) ->> 'score')::numeric end),
    p.tc
  from paged p
  order by
    case when p_sort = 'match' then p.ms end desc nulls last,
    case when p_sort = 'salary' then p.salary_max end desc nulls last,
    p.created_at desc;
end $$;

-- 12. RPC: create_job
create or replace function public.create_job(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _tenant_id uuid;
  _emp public.employers;
  _title text;
  _desc text;
  _clean_desc text;
  _work_mode text;
  _job_type text;
  _loc text;
  _min_sal numeric;
  _max_sal numeric;
  _exp_min numeric;
  _skills text[];
  _screening jsonb;
  _slug text;
  _job public.employer_job_openings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  -- Resolve tenant
  if p ? 'tenant_id' and (p->>'tenant_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    _tenant_id := (p->>'tenant_id')::uuid;
  else
    select tenant_id into _tenant_id from public.employers where user_id = _uid;
    if _tenant_id is null then
      select tenant_id into _tenant_id from public.tenant_memberships where user_id = _uid order by created_at asc limit 1;
    end if;
  end if;

  if _tenant_id is null then
    raise exception 'Tenant organization not found' using errcode = 'P0002';
  end if;

  -- Validate title early
  _title := trim(coalesce(p->>'designation', p->>'title', ''));
  if length(_title) < 3 or length(_title) > 120 then
    raise exception 'Job title must be between 3 and 120 characters' using errcode = '22023';
  end if;

  if not (public.has_tenant_permission(_tenant_id, 'job.post') or public.has_tenant_permission(_tenant_id, 'job.create')) and not public.is_admin() then
    raise exception 'Unauthorized: job.post permission required' using errcode = '42501';
  end if;

  if not public.employer_can(_tenant_id, 'job.post') and not public.is_admin() then
    raise exception 'Tenant account is not permitted to post jobs' using errcode = '42501';
  end if;

  _desc := coalesce(p->>'job_description', p->>'description', '');
  _clean_desc := regexp_replace(_desc, '<[^>]+>', '', 'g');
  if length(_clean_desc) > 20000 then
    raise exception 'Job description exceeds 20,000 characters' using errcode = '22023';
  end if;

  _work_mode := coalesce(p->>'work_mode', 'Onsite');
  if _work_mode not in ('Remote', 'Hybrid', 'Onsite') then
    raise exception 'Invalid work mode. Must be Remote, Hybrid, or Onsite' using errcode = '22023';
  end if;

  _loc := trim(coalesce(p->>'job_location', p->>'location', ''));
  if _work_mode <> 'Remote' and length(_loc) < 2 then
    raise exception 'Job location is required for non-remote roles' using errcode = '22023';
  end if;

  _min_sal := case when p ? 'salary_min' and (p->>'salary_min') <> '' then (p->>'salary_min')::numeric else null end;
  _max_sal := case when p ? 'salary_max' and (p->>'salary_max') <> '' then (p->>'salary_max')::numeric else null end;
  if _min_sal is not null and _max_sal is not null and _min_sal > _max_sal then
    raise exception 'Minimum salary cannot exceed maximum salary' using errcode = '22023';
  end if;

  _exp_min := case when p ? 'experience_min' and (p->>'experience_min') <> '' then (p->>'experience_min')::numeric else 0 end;
  if _exp_min < 0 or _exp_min > 50 then
    raise exception 'Experience minimum must be between 0 and 50 years' using errcode = '22023';
  end if;

  if p ? 'skills' then
    select coalesce(array_agg(distinct lower(trim(s))), '{}')
    into _skills
    from jsonb_array_elements_text(p->'skills') s
    where trim(s) <> ''
    limit 30;
  else
    _skills := '{}';
  end if;

  _job_type := coalesce(p->>'job_type', p->>'employment_type', 'Full-time');
  _screening := coalesce(p->'screening_questions', '[]'::jsonb);
  if jsonb_array_length(_screening) > 5 then
    raise exception 'Maximum 5 screening questions allowed' using errcode = '22023';
  end if;

  select * into _emp from public.employers where tenant_id = _tenant_id limit 1;

  insert into public.employer_job_openings (
    tenant_id,
    user_id,
    employer_id,
    designation,
    job_description,
    job_location,
    work_mode,
    job_type,
    employment_type,
    salary_min,
    salary_max,
    experience_min,
    skills,
    screening_questions,
    currency,
    salary_visible,
    company_name,
    company_slug,
    company_logo,
    status,
    is_public,
    source
  )
  values (
    _tenant_id,
    _uid,
    _emp.id,
    _title,
    _clean_desc,
    _loc,
    _work_mode,
    _job_type,
    _job_type,
    _min_sal,
    _max_sal,
    _exp_min,
    _skills,
    _screening,
    coalesce(p->>'currency', 'INR'),
    coalesce((p->>'salary_visible')::boolean, true),
    coalesce(_emp.company_name, 'Company'),
    _emp.slug,
    _emp.logo_url,
    'draft',
    false,
    'employer'
  )
  returning * into _job;

  _slug := public.generate_job_slug(_job.designation, _job.id);
  update public.employer_job_openings set slug = _slug where id = _job.id returning * into _job;

  perform public.log_audit(_tenant_id, 'job.create', 'employer_job_openings', _job.id::text, jsonb_build_object('title', _title));

  return to_jsonb(_job);
end $$;

revoke all on function public.create_job(jsonb) from public, anon;
grant execute on function public.create_job(jsonb) to authenticated;

-- 13. RPC: update_job
create or replace function public.update_job(p_job_id uuid, p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _title text;
  _desc text;
  _clean_desc text;
  _work_mode text;
  _job_type text;
  _loc text;
  _min_sal numeric;
  _max_sal numeric;
  _exp_min numeric;
  _skills text[];
  _screening jsonb;
  _title_changed boolean := false;
  _salary_changed boolean := false;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not public.has_tenant_permission(_job.tenant_id, 'job.edit') and not public.is_admin() then
    raise exception 'Unauthorized: job.edit permission required' using errcode = '42501';
  end if;

  if not public.employer_can(_job.tenant_id, 'job.edit') and not public.is_admin() then
    raise exception 'Tenant account is suspended or not permitted to edit jobs' using errcode = '42501';
  end if;

  if _job.status not in ('draft', 'paused', 'active') then
    raise exception 'Cannot edit job in % status', _job.status using errcode = '22023';
  end if;

  _title := trim(coalesce(p->>'designation', p->>'title', _job.designation));
  if length(_title) < 3 or length(_title) > 120 then
    raise exception 'Job title must be between 3 and 120 characters' using errcode = '22023';
  end if;

  _desc := coalesce(p->>'job_description', p->>'description', _job.job_description);
  _clean_desc := regexp_replace(_desc, '<[^>]+>', '', 'g');
  if length(_clean_desc) > 20000 then
    raise exception 'Job description exceeds 20,000 characters' using errcode = '22023';
  end if;

  _work_mode := coalesce(p->>'work_mode', _job.work_mode, 'Onsite');
  _loc := trim(coalesce(p->>'job_location', p->>'location', _job.job_location, ''));
  if _work_mode <> 'Remote' and length(_loc) < 2 then
    raise exception 'Job location is required for non-remote roles' using errcode = '22023';
  end if;

  _min_sal := case when p ? 'salary_min' then (p->>'salary_min')::numeric else _job.salary_min end;
  _max_sal := case when p ? 'salary_max' then (p->>'salary_max')::numeric else _job.salary_max end;
  if _min_sal is not null and _max_sal is not null and _min_sal > _max_sal then
    raise exception 'Minimum salary cannot exceed maximum salary' using errcode = '22023';
  end if;

  _exp_min := case when p ? 'experience_min' then (p->>'experience_min')::numeric else _job.experience_min end;
  _job_type := coalesce(p->>'job_type', p->>'employment_type', _job.job_type, 'Full-time');

  if p ? 'skills' then
    select coalesce(array_agg(distinct lower(trim(s))), '{}')
    into _skills
    from jsonb_array_elements_text(p->'skills') s
    where trim(s) <> ''
    limit 30;
  else
    _skills := _job.skills;
  end if;

  if p ? 'screening_questions' then
    _screening := p->'screening_questions';
    if jsonb_array_length(_screening) > 5 then
      raise exception 'Maximum 5 screening questions allowed' using errcode = '22023';
    end if;
  else
    _screening := _job.screening_questions;
  end if;

  _title_changed := (_title <> _job.designation);
  _salary_changed := (_min_sal is distinct from _job.salary_min or _max_sal is distinct from _job.salary_max);

  update public.employer_job_openings set
    designation = _title,
    job_description = _clean_desc,
    job_location = _loc,
    work_mode = _work_mode,
    job_type = _job_type,
    employment_type = _job_type,
    salary_min = _min_sal,
    salary_max = _max_sal,
    experience_min = _exp_min,
    skills = _skills,
    screening_questions = _screening,
    currency = coalesce(p->>'currency', currency),
    salary_visible = case when p ? 'salary_visible' then (p->>'salary_visible')::boolean else salary_visible end,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  if _job.status = 'active' and (_title_changed or _salary_changed) then
    perform public.log_audit(
      _job.tenant_id,
      'job.edit_active',
      'employer_job_openings',
      _job.id::text,
      jsonb_build_object('title_changed', _title_changed, 'salary_changed', _salary_changed)
    );
  else
    perform public.log_audit(_job.tenant_id, 'job.update', 'employer_job_openings', _job.id::text, jsonb_build_object('title', _title));
  end if;

  return to_jsonb(_job);
end $$;

revoke all on function public.update_job(uuid, jsonb) from public, anon;
grant execute on function public.update_job(uuid, jsonb) to authenticated;

-- 14. RPC: publish_job
create or replace function public.publish_job(p_job_id uuid, p_closes_at timestamptz default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _can_post boolean;
  _risk boolean;
  _new_status text;
  _mod_note text;
  _closes_at timestamptz;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.post') or public.has_tenant_permission(_job.tenant_id, 'job.publish')) and not public.is_admin() then
    raise exception 'Unauthorized: job.post permission required' using errcode = '42501';
  end if;

  if length(coalesce(_job.designation, '')) < 3 then
    raise exception 'Job title must be at least 3 characters' using errcode = '22023';
  end if;
  if length(coalesce(_job.job_description, '')) < 20 then
    raise exception 'Job description must be at least 20 characters before publishing' using errcode = '22023';
  end if;
  if cardinality(_job.skills) = 0 then
    raise exception 'At least one skill is required before publishing' using errcode = '22023';
  end if;
  if _job.work_mode <> 'Remote' and length(coalesce(_job.job_location, '')) < 2 then
    raise exception 'Job location is required for non-remote roles' using errcode = '22023';
  end if;

  perform public.check_quota(_job.tenant_id, 'active_jobs');

  _closes_at := coalesce(p_closes_at, now() + interval '30 days');
  if _closes_at <= now() then
    raise exception 'Application deadline must be in the future' using errcode = '22023';
  end if;
  if _closes_at > (now() + interval '90 days') then
    _closes_at := now() + interval '90 days';
  end if;

  _risk := public.job_risk_flags(_job.designation || ' ' || coalesce(_job.job_description, ''));
  _can_post := public.employer_can(_job.tenant_id, 'job.publish');

  -- Also check tenant employer verification status directly
  declare
    _vstatus text := 'pending';
  begin
    select coalesce(e.verification_status, 'pending') into _vstatus
    from public.tenant_organizations t
    join public.employers e on e.id = t.employer_id
    where t.id = _job.tenant_id;

    if _risk then
      _new_status := 'pending_review';
      _mod_note := 'Flagged by automated screening for review';
    elsif not _can_post or _vstatus <> 'verified' then
      _new_status := 'pending_review';
      _mod_note := 'Awaiting employer identity verification';
    else
      _new_status := 'active';
      _mod_note := null;
    end if;
  end;

  update public.employer_job_openings set
    status = _new_status,
    is_public = (_new_status = 'active'),
    published_at = coalesce(published_at, now()),
    closes_at = _closes_at,
    application_deadline = _closes_at,
    moderation_note = _mod_note,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  perform public.log_audit(_job.tenant_id, 'job.publish', 'employer_job_openings', _job.id::text, jsonb_build_object('status', _new_status));

  return to_jsonb(_job);
end $$;

revoke all on function public.publish_job(uuid, timestamptz) from public, anon;
grant execute on function public.publish_job(uuid, timestamptz) to authenticated;

-- 15. RPC: pause_job
create or replace function public.pause_job(p_job_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.close') or public.has_tenant_permission(_job.tenant_id, 'job.edit')) and not public.is_admin() then
    raise exception 'Unauthorized: job.close or job.edit permission required' using errcode = '42501';
  end if;

  if _job.status <> 'active' then
    raise exception 'Can only pause an active job (current status: %)', _job.status using errcode = '22023';
  end if;

  update public.employer_job_openings set
    status = 'paused',
    is_public = false,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  perform public.log_audit(_job.tenant_id, 'job.pause', 'employer_job_openings', _job.id::text);

  return to_jsonb(_job);
end $$;

revoke all on function public.pause_job(uuid) from public, anon;
grant execute on function public.pause_job(uuid) to authenticated;

-- 16. RPC: resume_job
create or replace function public.resume_job(p_job_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.post') or public.has_tenant_permission(_job.tenant_id, 'job.edit')) and not public.is_admin() then
    raise exception 'Unauthorized: job.post or job.edit permission required' using errcode = '42501';
  end if;

  if _job.status <> 'paused' then
    raise exception 'Can only resume a paused job (current status: %)', _job.status using errcode = '22023';
  end if;

  if not public.employer_can(_job.tenant_id, 'job.post') and not public.is_admin() then
    raise exception 'Tenant account is not permitted to resume jobs' using errcode = '42501';
  end if;

  perform public.check_quota(_job.tenant_id, 'active_jobs');

  update public.employer_job_openings set
    status = 'active',
    is_public = true,
    closes_at = case when closes_at is null or closes_at < now() then now() + interval '30 days' else closes_at end,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  perform public.log_audit(_job.tenant_id, 'job.resume', 'employer_job_openings', _job.id::text);

  return to_jsonb(_job);
end $$;

revoke all on function public.resume_job(uuid) from public, anon;
grant execute on function public.resume_job(uuid) to authenticated;

-- 17. RPC: close_job
create or replace function public.close_job(p_job_id uuid, p_reason text default 'Position filled')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _app record;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.close') or public.has_tenant_permission(_job.tenant_id, 'job.edit')) and not public.is_admin() then
    raise exception 'Unauthorized: job.close permission required' using errcode = '42501';
  end if;

  if _job.status in ('closed', 'expired') then
    raise exception 'Job is already %', _job.status using errcode = '22023';
  end if;

  update public.employer_job_openings set
    status = 'closed',
    is_public = false,
    closed_reason = coalesce(p_reason, 'Position filled'),
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  for _app in
    select a.id, a.candidate_id, p.id as user_id
    from public.job_applications a
    join public.profiles p on p.id = a.candidate_id
    where a.job_id = p_job_id
      and a.stage in ('Applied', 'Shortlisted', 'Interview')
  loop
    insert into public.notifications (user_id, kind, title, body, link, data)
    values (
      _app.user_id,
      'job_closed',
      'Position Closed: ' || _job.designation,
      'The position "' || _job.designation || '" at ' || coalesce(_job.company_name, 'the company') || ' has been closed (' || coalesce(p_reason, 'Position filled') || ').',
      '/talento-pro?view=apps',
      jsonb_build_object('job_id', p_job_id::text, 'reason', p_reason)
    );
  end loop;

  perform public.log_audit(_job.tenant_id, 'job.close', 'employer_job_openings', _job.id::text, jsonb_build_object('reason', p_reason));

  return to_jsonb(_job);
end $$;

revoke all on function public.close_job(uuid, text) from public, anon;
grant execute on function public.close_job(uuid, text) to authenticated;

-- 18. RPC: duplicate_job
create or replace function public.duplicate_job(p_job_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _orig public.employer_job_openings;
  _new public.employer_job_openings;
  _slug text;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _orig from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_orig.tenant_id, 'job.post') or public.has_tenant_permission(_orig.tenant_id, 'job.create')) and not public.is_admin() then
    raise exception 'Unauthorized: job.post permission required' using errcode = '42501';
  end if;

  insert into public.employer_job_openings (
    tenant_id, user_id, employer_id, designation, job_description, job_location,
    work_mode, job_type, employment_type, salary_min, salary_max, experience_min,
    skills, screening_questions, currency, salary_visible, company_name, company_slug,
    company_logo, status, is_public, source, views_count, applications_count
  )
  values (
    _orig.tenant_id, _uid, _orig.employer_id, _orig.designation || ' (Copy)',
    _orig.job_description, _orig.job_location, _orig.work_mode, _orig.job_type,
    _orig.employment_type, _orig.salary_min, _orig.salary_max, _orig.experience_min,
    _orig.skills, _orig.screening_questions, _orig.currency, _orig.salary_visible,
    _orig.company_name, _orig.company_slug, _orig.company_logo, 'draft', false,
    'employer', 0, 0
  )
  returning * into _new;

  _slug := public.generate_job_slug(_new.designation, _new.id);
  update public.employer_job_openings set slug = _slug where id = _new.id returning * into _new;

  perform public.log_audit(_orig.tenant_id, 'job.duplicate', 'employer_job_openings', _new.id::text);

  return to_jsonb(_new);
end $$;

revoke all on function public.duplicate_job(uuid) from public, anon;
grant execute on function public.duplicate_job(uuid) to authenticated;

-- 19. RPC: delete_job
create or replace function public.delete_job(p_job_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _apps_count int;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.close') or public.has_tenant_permission(_job.tenant_id, 'job.edit')) and not public.is_admin() then
    raise exception 'Unauthorized: job.close or job.edit permission required' using errcode = '42501';
  end if;

  select count(*) into _apps_count from public.job_applications where job_id = p_job_id;
  if _apps_count > 0 then
    raise exception 'Cannot delete job with existing applications. Close the job instead.' using errcode = '22023';
  end if;

  update public.employer_job_openings set
    deleted_at = now(),
    status = 'closed',
    is_public = false,
    updated_at = now()
  where id = p_job_id;

  perform public.log_audit(_job.tenant_id, 'job.delete', 'employer_job_openings', p_job_id::text);

  return true;
end $$;

revoke all on function public.delete_job(uuid) from public, anon;
grant execute on function public.delete_job(uuid) to authenticated;

-- 20. RPC: list_my_jobs
create or replace function public.list_my_jobs(
  p_status text[] default null,
  p_search text default null,
  p_cursor timestamptz default null,
  p_limit integer default 20
)
returns table (
  id uuid,
  designation text,
  status text,
  work_mode text,
  job_type text,
  salary_min numeric,
  salary_max numeric,
  job_location text,
  skills text[],
  views_count integer,
  applications_count integer,
  published_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz,
  slug text,
  moderation_note text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _tenant_id uuid;
  _q text := nullif(trim(p_search), '');
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  select tenant_id into _tenant_id from public.employers where user_id = _uid;
  if _tenant_id is null then
    select tenant_id into _tenant_id from public.tenant_memberships where user_id = _uid order by created_at asc limit 1;
  end if;

  if _tenant_id is null then
    raise exception 'Tenant not found' using errcode = 'P0002';
  end if;

  return query
  select
    j.id,
    j.designation,
    j.status,
    j.work_mode,
    j.job_type,
    j.salary_min,
    j.salary_max,
    j.job_location,
    j.skills,
    j.views_count,
    j.applications_count,
    j.published_at,
    j.closes_at,
    j.created_at,
    j.slug,
    j.moderation_note
  from public.employer_job_openings j
  where j.tenant_id = _tenant_id
    and j.deleted_at is null
    and (p_status is null or cardinality(p_status) = 0 or j.status = any(p_status))
    and (_q is null or j.designation ilike '%' || _q || '%' or j.job_location ilike '%' || _q || '%')
    and (p_cursor is null or j.created_at < p_cursor)
  order by j.created_at desc
  limit least(greatest(p_limit, 1), 100);
end $$;

revoke all on function public.list_my_jobs(text[], text, timestamptz, integer) from public, anon;
grant execute on function public.list_my_jobs(text[], text, timestamptz, integer) to authenticated;

-- 21. RPC: get_job_for_edit
create or replace function public.get_job_for_edit(p_job_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.is_tenant_member(_job.tenant_id) or public.is_admin()) then
    raise exception 'Unauthorized: access denied to job' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'id', _job.id,
    'tenant_id', _job.tenant_id,
    'designation', _job.designation,
    'job_description', _job.job_description,
    'job_location', _job.job_location,
    'work_mode', _job.work_mode,
    'job_type', _job.job_type,
    'salary_min', _job.salary_min,
    'salary_max', _job.salary_max,
    'currency', _job.currency,
    'salary_visible', _job.salary_visible,
    'experience_min', _job.experience_min,
    'skills', _job.skills,
    'screening_questions', _job.screening_questions,
    'status', _job.status,
    'published_at', _job.published_at,
    'closes_at', _job.closes_at,
    'closed_reason', _job.closed_reason,
    'moderation_note', _job.moderation_note,
    'slug', _job.slug,
    'views_count', _job.views_count,
    'applications_count', _job.applications_count,
    'created_at', _job.created_at,
    'updated_at', _job.updated_at
  );
end $$;

revoke all on function public.get_job_for_edit(uuid) from public, anon;
grant execute on function public.get_job_for_edit(uuid) to authenticated;

-- 22. RPC: job_stats
create or replace function public.job_stats(p_job_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _stages jsonb;
  _avg_match numeric;
  _first_view timestamptz;
  _ttfv_hours numeric;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.is_tenant_member(_job.tenant_id) or public.is_admin()) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select coalesce(jsonb_object_agg(stage, cnt), '{}'::jsonb)
  into _stages
  from (
    select stage, count(*) as cnt
    from public.job_applications
    where job_id = p_job_id
    group by stage
  ) s;

  select round(avg(match_score), 1)
  into _avg_match
  from public.job_applications
  where job_id = p_job_id and match_score is not null;

  select min(viewed_at) into _first_view
  from public.job_applications
  where job_id = p_job_id and viewed_at is not null;

  if _first_view is not null and _job.published_at is not null then
    _ttfv_hours := round(extract(epoch from (_first_view - _job.published_at)) / 3600.0, 2);
  else
    _ttfv_hours := null;
  end if;

  return jsonb_build_object(
    'job_id', p_job_id,
    'views', _job.views_count,
    'applies', _job.applications_count,
    'stage_funnel', coalesce(_stages, '{}'::jsonb),
    'avg_match_score', coalesce(_avg_match, 0),
    'time_to_first_view_hours', _ttfv_hours
  );
end $$;

revoke all on function public.job_stats(uuid) from public, anon;
grant execute on function public.job_stats(uuid) to authenticated;

-- 23. RPC: record_job_view
create or replace function public.record_job_view(p_job_id uuid, p_viewer_hash text default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _hash text;
begin
  if p_job_id is null then return false; end if;

  _hash := coalesce(
    nullif(trim(p_viewer_hash), ''),
    auth.uid()::text,
    'anon_' || encode(extensions.gen_random_bytes(8), 'hex')
  );

  insert into public.job_daily_views (job_id, viewer_hash, view_date)
  values (p_job_id, _hash, current_date)
  on conflict do nothing;

  if found then
    update public.employer_job_openings
    set views_count = views_count + 1
    where id = p_job_id;
    return true;
  end if;

  return false;
end $$;

revoke all on function public.record_job_view(uuid, text) from public;
grant execute on function public.record_job_view(uuid, text) to anon, authenticated;

-- 24. Cron: expire_jobs
create or replace function public.expire_jobs()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _expired_count int := 0;
  _j record;
begin
  for _j in
    select id, user_id, designation
    from public.employer_job_openings
    where status = 'active'
      and closes_at is not null
      and closes_at <= now()
      and deleted_at is null
  loop
    update public.employer_job_openings
    set status = 'expired', updated_at = now()
    where id = _j.id;

    _expired_count := _expired_count + 1;

    if _j.user_id is not null then
      insert into public.notifications (user_id, kind, title, body, link)
      values (
        _j.user_id,
        'job_expired',
        'Job Posting Expired: ' || _j.designation,
        'Your listing has expired. You can review applicants or extend the deadline.',
        '/pro?view=jobs'
      );
    end if;
  end loop;

  return _expired_count;
end $$;

revoke all on function public.expire_jobs() from public, anon;
grant execute on function public.expire_jobs() to authenticated;

-- 25. Cron: reminder_job_expiring
create or replace function public.reminder_job_expiring()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _reminded_count int := 0;
  _j record;
begin
  for _j in
    select id, user_id, designation, closes_at
    from public.employer_job_openings
    where status = 'active'
      and closes_at is not null
      and closes_at > now()
      and closes_at <= (now() + interval '3 days')
      and deleted_at is null
  loop
    if _j.user_id is not null and not exists (
      select 1 from public.notifications
      where user_id = _j.user_id
        and kind = 'job_expiring_soon'
        and data->>'job_id' = _j.id::text
        and created_at > (now() - interval '3 days')
    ) then
      insert into public.notifications (user_id, kind, title, body, link, data)
      values (
        _j.user_id,
        'job_expiring_soon',
        'Job Expiring Soon: ' || _j.designation,
        'Your job listing will expire in 3 days. Extend the deadline to keep accepting applicants.',
        '/pro?view=jobs',
        jsonb_build_object('job_id', _j.id::text)
      );
      _reminded_count := _reminded_count + 1;
    end if;
  end loop;

  return _reminded_count;
end $$;

revoke all on function public.reminder_job_expiring() from public, anon;
grant execute on function public.reminder_job_expiring() to authenticated;

-- 26. Admin: admin_list_jobs_pending
create or replace function public.admin_list_jobs_pending(p_limit int default 50, p_offset int default 0)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _jobs jsonb;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;

  select coalesce(jsonb_agg(to_jsonb(j)), '[]'::jsonb)
  into _jobs
  from (
    select j.*
    from public.employer_job_openings j
    where j.status = 'pending_review'
      and j.deleted_at is null
    order by j.created_at asc
    limit p_limit offset p_offset
  ) j;

  return _jobs;
end $$;

revoke all on function public.admin_list_jobs_pending(int, int) from public, anon;
grant execute on function public.admin_list_jobs_pending(int, int) to authenticated;

-- 27. Admin: admin_moderate_job
drop function if exists public.admin_moderate_job(uuid, boolean, text);
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
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if not public.is_admin() then raise exception 'Unauthorized: Admin required' using errcode = '42501'; end if;
  perform public.require_aal2();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if p_approve then
    update public.employer_job_openings set
      status = 'active',
      is_public = true,
      published_at = coalesce(published_at, now()),
      closes_at = case when closes_at is null or closes_at < now() then now() + interval '30 days' else closes_at end,
      moderation_note = p_reason,
      updated_at = now()
    where id = p_job_id;

    if _job.user_id is not null then
      insert into public.notifications (user_id, kind, title, body, link)
      values (
        _job.user_id,
        'job_approved',
        'Job Approved: ' || _job.designation,
        'Your job opening "' || _job.designation || '" has been reviewed and published.',
        '/talento-pro?view=jobs'
      );
    end if;
  else
    update public.employer_job_openings set
      status = 'rejected',
      is_public = false,
      moderation_note = p_reason,
      updated_at = now()
    where id = p_job_id;

    if _job.user_id is not null then
      insert into public.notifications (user_id, kind, title, body, link)
      values (
        _job.user_id,
        'job_rejected',
        'Job Review Update: ' || _job.designation,
        'Your job opening "' || _job.designation || '" was not approved. Note: ' || coalesce(p_reason, 'Policy violation'),
        '/talento-pro?view=jobs'
      );
    end if;
  end if;

  perform public.log_audit(_job.tenant_id, 'job.moderate', 'employer_job_openings', p_job_id::text, jsonb_build_object('approved', p_approve, 'note', p_reason));

  return true;
end $$;

revoke all on function public.admin_moderate_job(uuid, boolean, text) from public, anon;
grant execute on function public.admin_moderate_job(uuid, boolean, text) to authenticated;
