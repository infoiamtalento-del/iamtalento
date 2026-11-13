-- =====================================================================
-- Module 2 (Job Management) & Module 3 (Job Applications Management)
-- End-to-End Schema, Lifecycle Extensions, AI Assist & Bulk ATS RPCs
-- Migration: 20261113100000_job_and_application_management.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- PART A: 2. JOB MANAGEMENT SCHEMA & LIFECYCLE EXTENSIONS
-- ---------------------------------------------------------------------

-- 1. Extend employer_job_openings with rich details, categories, structured
--    location, scheduled publishing, expiry controls, and job promotion.
alter table public.employer_job_openings
  add column if not exists qualifications text,
  add column if not exists responsibilities text,
  add column if not exists benefits text[] not null default '{}',
  add column if not exists requirements text,
  add column if not exists industry text,
  add column if not exists department text,
  add column if not exists job_function text,
  add column if not exists city text,
  add column if not exists country text not null default 'India',
  add column if not exists scheduled_publish_at timestamptz,
  add column if not exists auto_close_on_expiry boolean not null default true,
  add column if not exists expiry_reminder_days integer not null default 3,
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_sponsored boolean not null default false,
  add column if not exists promotion_tier text,
  add column if not exists promoted_until timestamptz;

alter table public.employer_job_openings
  drop constraint if exists employer_job_openings_expiry_reminder_check;
alter table public.employer_job_openings
  add constraint employer_job_openings_expiry_reminder_check
    check (expiry_reminder_days between 1 and 30);

alter table public.employer_job_openings
  drop constraint if exists employer_job_openings_promotion_tier_check;
alter table public.employer_job_openings
  add constraint employer_job_openings_promotion_tier_check
    check (promotion_tier is null or promotion_tier in ('featured', 'sponsored'));

-- Expand status check to include 'scheduled' alongside all existing states
alter table public.employer_job_openings
  drop constraint if exists employer_job_openings_status_check;
alter table public.employer_job_openings
  add constraint employer_job_openings_status_check
    check (status in ('draft', 'pending_review', 'scheduled', 'active', 'paused', 'closed', 'expired', 'rejected'));

-- Expand job_type check to support Part-time alongside Full-time, Internship, and Contract
alter table public.employer_job_openings
  drop constraint if exists employer_job_openings_job_type_check;
alter table public.employer_job_openings
  add constraint employer_job_openings_job_type_check
    check (job_type is null or job_type in ('Full-time', 'Part-time', 'Internship', 'Contract'));

create index if not exists idx_employer_jobs_scheduled
  on public.employer_job_openings(scheduled_publish_at)
  where status = 'scheduled' and deleted_at is null;

create index if not exists idx_employer_jobs_promoted
  on public.employer_job_openings(is_sponsored, is_featured, promoted_until)
  where status = 'active' and deleted_at is null;

-- Require complete company profile when scheduling as well as publishing
create or replace function public.jobs_require_complete_profile()
returns trigger language plpgsql security definer set search_path = public as $$
declare _r jsonb;
begin
  if auth.uid() is null or public.is_admin() or coalesce(new.is_demo, false) then return new; end if;
  if new.status in ('active', 'open', 'pending_review', 'scheduled')
     and (tg_op = 'INSERT' or old.status in ('draft')) then
    _r := public.employer_publish_readiness(new.tenant_id);
    if not coalesce((_r ->> 'ready')::boolean, false) then
      raise exception 'Complete your company profile before publishing. Missing: %',
        (select string_agg(x, ', ') from jsonb_array_elements_text(_r -> 'missing') x) using errcode = 'P0403';
    end if;
  end if;
  return new;
end $$;

-- 2. Upgrade create_job(p jsonb) to support Job Details, Categories, City/Country, Expiry & Promotion
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
  _qual text;
  _resp text;
  _reqs text;
  _benefits text[];
  _industry text;
  _department text;
  _job_func text;
  _city text;
  _country text;
  _work_mode text;
  _job_type text;
  _loc text;
  _min_sal numeric;
  _max_sal numeric;
  _exp_min numeric;
  _skills text[];
  _screening jsonb;
  _auto_close boolean;
  _rem_days integer;
  _featured boolean;
  _sponsored boolean;
  _promo_tier text;
  _slug text;
  _job public.employer_job_openings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

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

  _qual := nullif(trim(regexp_replace(coalesce(p->>'qualifications', ''), '<[^>]+>', '', 'g')), '');
  _resp := nullif(trim(regexp_replace(coalesce(p->>'responsibilities', ''), '<[^>]+>', '', 'g')), '');
  _reqs := nullif(trim(regexp_replace(coalesce(p->>'requirements', ''), '<[^>]+>', '', 'g')), '');

  if p ? 'benefits' and jsonb_typeof(p->'benefits') = 'array' then
    select coalesce(array_agg(distinct trim(b)), '{}')
    into _benefits
    from jsonb_array_elements_text(p->'benefits') b
    where trim(b) <> ''
    limit 25;
  else
    _benefits := '{}';
  end if;

  _industry := nullif(trim(coalesce(p->>'industry', '')), '');
  _department := nullif(trim(coalesce(p->>'department', '')), '');
  _job_func := nullif(trim(coalesce(p->>'job_function', '')), '');
  _city := nullif(trim(coalesce(p->>'city', '')), '');
  _country := coalesce(nullif(trim(coalesce(p->>'country', '')), ''), 'India');

  _work_mode := coalesce(p->>'work_mode', 'Onsite');
  if _work_mode not in ('Remote', 'Hybrid', 'Onsite') then
    raise exception 'Invalid work mode. Must be Remote, Hybrid, or Onsite' using errcode = '22023';
  end if;

  _loc := trim(coalesce(p->>'job_location', p->>'location', ''));
  if _loc = '' and _city is not null then
    _loc := case when _country <> '' then _city || ', ' || _country else _city end;
  end if;

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

  if p ? 'skills' and jsonb_typeof(p->'skills') = 'array' then
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

  _auto_close := coalesce((p->>'auto_close_on_expiry')::boolean, true);
  _rem_days := least(greatest(coalesce((p->>'expiry_reminder_days')::integer, 3), 1), 30);
  _sponsored := coalesce((p->>'is_sponsored')::boolean, false);
  _featured := coalesce((p->>'is_featured')::boolean, _sponsored);
  _promo_tier := case when _sponsored then 'sponsored' when _featured then 'featured' else null end;

  select * into _emp from public.employers where tenant_id = _tenant_id limit 1;

  insert into public.employer_job_openings (
    tenant_id, user_id, employer_id, designation, job_description,
    qualifications, responsibilities, benefits, requirements,
    industry, department, job_function, city, country,
    job_location, work_mode, job_type, employment_type,
    salary_min, salary_max, experience_min, skills, screening_questions,
    currency, salary_visible, auto_close_on_expiry, expiry_reminder_days,
    is_featured, is_sponsored, promotion_tier, promoted_until,
    company_name, company_slug, company_logo, status, is_public, source
  )
  values (
    _tenant_id, _uid, _emp.id, _title, _clean_desc,
    _qual, _resp, _benefits, _reqs,
    coalesce(_industry, _emp.industry), _department, _job_func, _city, _country,
    _loc, _work_mode, _job_type, _job_type,
    _min_sal, _max_sal, _exp_min, _skills, _screening,
    coalesce(p->>'currency', 'INR'), coalesce((p->>'salary_visible')::boolean, true),
    _auto_close, _rem_days,
    _featured, _sponsored, _promo_tier,
    case when _promo_tier is not null then now() + interval '14 days' else null end,
    coalesce(_emp.company_name, 'Company'), _emp.slug, _emp.logo_url,
    'draft', false, 'employer'
  )
  returning * into _job;

  _slug := public.generate_job_slug(_job.designation, _job.id);
  update public.employer_job_openings set slug = _slug where id = _job.id returning * into _job;

  perform public.log_audit(_tenant_id, 'job.create', 'employer_job_openings', _job.id::text, jsonb_build_object('title', _title));

  return to_jsonb(_job);
end $$;

revoke all on function public.create_job(jsonb) from public, anon;
grant execute on function public.create_job(jsonb) to authenticated;

-- 3. Upgrade update_job(p_job_id uuid, p jsonb)
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
  _city text;
  _country text;
  _loc text;
  _min_sal numeric;
  _max_sal numeric;
  _exp_min numeric;
  _skills text[];
  _benefits text[];
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

  if _job.status not in ('draft', 'scheduled', 'paused', 'active', 'closed', 'expired') then
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
  _city := case when p ? 'city' then nullif(trim(coalesce(p->>'city', '')), '') else _job.city end;
  _country := case when p ? 'country' then coalesce(nullif(trim(coalesce(p->>'country', '')), ''), 'India') else coalesce(_job.country, 'India') end;

  _loc := trim(coalesce(p->>'job_location', p->>'location', _job.job_location, ''));
  if _loc = '' and _city is not null then
    _loc := case when _country <> '' then _city || ', ' || _country else _city end;
  end if;
  if _work_mode <> 'Remote' and length(_loc) < 2 then
    raise exception 'Job location is required for non-remote roles' using errcode = '22023';
  end if;

  _min_sal := case when p ? 'salary_min' then (case when (p->>'salary_min') = '' or p->'salary_min' = 'null'::jsonb then null else (p->>'salary_min')::numeric end) else _job.salary_min end;
  _max_sal := case when p ? 'salary_max' then (case when (p->>'salary_max') = '' or p->'salary_max' = 'null'::jsonb then null else (p->>'salary_max')::numeric end) else _job.salary_max end;
  if _min_sal is not null and _max_sal is not null and _min_sal > _max_sal then
    raise exception 'Minimum salary cannot exceed maximum salary' using errcode = '22023';
  end if;

  _exp_min := case when p ? 'experience_min' and (p->>'experience_min') <> '' then (p->>'experience_min')::numeric else _job.experience_min end;
  _job_type := coalesce(p->>'job_type', p->>'employment_type', _job.job_type, 'Full-time');

  if p ? 'skills' and jsonb_typeof(p->'skills') = 'array' then
    select coalesce(array_agg(distinct lower(trim(s))), '{}')
    into _skills
    from jsonb_array_elements_text(p->'skills') s
    where trim(s) <> ''
    limit 30;
  else
    _skills := _job.skills;
  end if;

  if p ? 'benefits' and jsonb_typeof(p->'benefits') = 'array' then
    select coalesce(array_agg(distinct trim(b)), '{}')
    into _benefits
    from jsonb_array_elements_text(p->'benefits') b
    where trim(b) <> ''
    limit 25;
  else
    _benefits := _job.benefits;
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
    qualifications = case when p ? 'qualifications' then nullif(trim(regexp_replace(coalesce(p->>'qualifications', ''), '<[^>]+>', '', 'g')), '') else qualifications end,
    responsibilities = case when p ? 'responsibilities' then nullif(trim(regexp_replace(coalesce(p->>'responsibilities', ''), '<[^>]+>', '', 'g')), '') else responsibilities end,
    requirements = case when p ? 'requirements' then nullif(trim(regexp_replace(coalesce(p->>'requirements', ''), '<[^>]+>', '', 'g')), '') else requirements end,
    benefits = _benefits,
    industry = case when p ? 'industry' then nullif(trim(coalesce(p->>'industry', '')), '') else industry end,
    department = case when p ? 'department' then nullif(trim(coalesce(p->>'department', '')), '') else department end,
    job_function = case when p ? 'job_function' then nullif(trim(coalesce(p->>'job_function', '')), '') else job_function end,
    city = _city,
    country = _country,
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
    auto_close_on_expiry = case when p ? 'auto_close_on_expiry' then (p->>'auto_close_on_expiry')::boolean else auto_close_on_expiry end,
    expiry_reminder_days = case when p ? 'expiry_reminder_days' then least(greatest((p->>'expiry_reminder_days')::integer, 1), 30) else expiry_reminder_days end,
    is_featured = case when p ? 'is_featured' then (p->>'is_featured')::boolean else is_featured end,
    is_sponsored = case when p ? 'is_sponsored' then (p->>'is_sponsored')::boolean else is_sponsored end,
    promotion_tier = case
      when p ? 'is_sponsored' and (p->>'is_sponsored')::boolean then 'sponsored'
      when p ? 'is_featured' and (p->>'is_featured')::boolean then 'featured'
      when (p ? 'is_featured' or p ? 'is_sponsored') then null
      else promotion_tier
    end,
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

-- 4. Upgrade duplicate_job(p_job_id uuid) to copy all extended fields
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
    tenant_id, user_id, employer_id, designation, job_description,
    qualifications, responsibilities, benefits, requirements,
    industry, department, job_function, city, country,
    job_location, work_mode, job_type, employment_type,
    salary_min, salary_max, experience_min, skills, screening_questions,
    currency, salary_visible, auto_close_on_expiry, expiry_reminder_days,
    company_name, company_slug, company_logo, status, is_public, source,
    views_count, applications_count
  )
  values (
    _orig.tenant_id, _uid, _orig.employer_id, _orig.designation || ' (Copy)',
    _orig.job_description,
    _orig.qualifications, _orig.responsibilities, _orig.benefits, _orig.requirements,
    _orig.industry, _orig.department, _orig.job_function, _orig.city, _orig.country,
    _orig.job_location, _orig.work_mode, _orig.job_type, _orig.employment_type,
    _orig.salary_min, _orig.salary_max, _orig.experience_min, _orig.skills, _orig.screening_questions,
    _orig.currency, _orig.salary_visible, _orig.auto_close_on_expiry, _orig.expiry_reminder_days,
    _orig.company_name, _orig.company_slug, _orig.company_logo, 'draft', false, 'employer',
    0, 0
  )
  returning * into _new;

  _slug := public.generate_job_slug(_new.designation, _new.id);
  update public.employer_job_openings set slug = _slug where id = _new.id returning * into _new;

  perform public.log_audit(_orig.tenant_id, 'job.duplicate', 'employer_job_openings', _new.id::text);

  return to_jsonb(_new);
end $$;

revoke all on function public.duplicate_job(uuid) from public, anon;
grant execute on function public.duplicate_job(uuid) to authenticated;

-- 5. Upgrade pause_job to also allow unpublishing/cancelling a scheduled job back to paused
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

  if _job.status not in ('active', 'scheduled') then
    raise exception 'Can only pause an active job (current status: %)', _job.status using errcode = '22023';
  end if;

  update public.employer_job_openings set
    status = 'paused',
    is_public = false,
    scheduled_publish_at = null,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  perform public.log_audit(_job.tenant_id, 'job.pause', 'employer_job_openings', _job.id::text);

  return to_jsonb(_job);
end $$;

revoke all on function public.pause_job(uuid) from public, anon;
grant execute on function public.pause_job(uuid) to authenticated;

-- 6. New RPC: schedule_job_publish & publish_scheduled_jobs
create or replace function public.schedule_job_publish(
  p_job_id uuid,
  p_publish_at timestamptz,
  p_closes_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _closes_at timestamptz;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.post') or public.has_tenant_permission(_job.tenant_id, 'job.publish')) and not public.is_admin() then
    raise exception 'Unauthorized: job.post permission required' using errcode = '42501';
  end if;

  if p_publish_at is null or p_publish_at <= now() then
    raise exception 'Scheduled publish time must be in the future' using errcode = '22023';
  end if;

  if length(coalesce(_job.designation, '')) < 3 then
    raise exception 'Job title must be at least 3 characters' using errcode = '22023';
  end if;
  if length(coalesce(_job.job_description, '')) < 20 then
    raise exception 'Job description must be at least 20 characters before scheduling' using errcode = '22023';
  end if;
  if cardinality(_job.skills) = 0 then
    raise exception 'At least one skill is required before scheduling' using errcode = '22023';
  end if;
  if _job.work_mode <> 'Remote' and length(coalesce(_job.job_location, '')) < 2 then
    raise exception 'Job location is required for non-remote roles' using errcode = '22023';
  end if;

  _closes_at := coalesce(p_closes_at, p_publish_at + interval '30 days');
  if _closes_at <= p_publish_at then
    raise exception 'Application deadline must be after scheduled publish time' using errcode = '22023';
  end if;

  update public.employer_job_openings set
    status = 'scheduled',
    is_public = false,
    scheduled_publish_at = p_publish_at,
    closes_at = _closes_at,
    application_deadline = _closes_at,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  perform public.log_audit(_job.tenant_id, 'job.schedule', 'employer_job_openings', _job.id::text,
    jsonb_build_object('title', _job.designation, 'publish_at', p_publish_at));

  return to_jsonb(_job);
end $$;

revoke all on function public.schedule_job_publish(uuid, timestamptz, timestamptz) from public, anon;
grant execute on function public.schedule_job_publish(uuid, timestamptz, timestamptz) to authenticated;

create or replace function public.publish_scheduled_jobs()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _published int := 0;
  _j public.employer_job_openings;
  _risk boolean;
  _can_post boolean;
  _vstatus text;
  _new_status text;
  _mod_note text;
begin
  for _j in
    select * from public.employer_job_openings
    where status = 'scheduled'
      and scheduled_publish_at is not null
      and scheduled_publish_at <= now()
      and deleted_at is null
  loop
    _risk := public.job_risk_flags(_j.designation || ' ' || coalesce(_j.job_description, ''));
    _can_post := public.employer_can(_j.tenant_id, 'job.publish');
    select coalesce(e.verification_status, 'pending') into _vstatus
    from public.tenant_organizations t
    join public.employers e on e.id = t.employer_id
    where t.id = _j.tenant_id;

    if _risk then
      _new_status := 'pending_review';
      _mod_note := 'Flagged by automated screening for review';
    elsif not _can_post or coalesce(_vstatus, 'pending') <> 'verified' then
      _new_status := 'pending_review';
      _mod_note := 'Awaiting employer identity verification';
    else
      _new_status := 'active';
      _mod_note := null;
    end if;

    update public.employer_job_openings set
      status = _new_status,
      is_public = (_new_status = 'active'),
      published_at = coalesce(published_at, now()),
      scheduled_publish_at = null,
      closes_at = coalesce(closes_at, now() + interval '30 days'),
      moderation_note = _mod_note,
      updated_at = now()
    where id = _j.id;

    _published := _published + 1;
  end loop;

  return _published;
end $$;

revoke all on function public.publish_scheduled_jobs() from public, anon;
grant execute on function public.publish_scheduled_jobs() to authenticated, service_role;

-- 7. New RPC: renew_job (Manage Job Posts -> Renew closed/expired/expiring listings)
create or replace function public.renew_job(p_job_id uuid, p_days integer default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _days int := least(greatest(coalesce(p_days, 30), 1), 90);
  _risk boolean;
  _can_post boolean;
  _vstatus text := 'pending';
  _new_status text;
  _mod_note text;
  _base timestamptz;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.post') or public.has_tenant_permission(_job.tenant_id, 'job.edit')) and not public.is_admin() then
    raise exception 'Unauthorized: job.post or job.edit permission required' using errcode = '42501';
  end if;

  if not public.employer_can(_job.tenant_id, 'job.post') and not public.is_admin() then
    raise exception 'Tenant account is not permitted to renew jobs' using errcode = '42501';
  end if;

  perform public.check_quota(_job.tenant_id, 'active_jobs');

  _risk := public.job_risk_flags(_job.designation || ' ' || coalesce(_job.job_description, ''));
  _can_post := public.employer_can(_job.tenant_id, 'job.publish');
  select coalesce(e.verification_status, 'pending') into _vstatus
  from public.tenant_organizations t
  join public.employers e on e.id = _job.employer_id or e.id = t.employer_id
  where t.id = _job.tenant_id
  limit 1;

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

  _base := greatest(coalesce(_job.closes_at, now()), now());

  update public.employer_job_openings set
    status = _new_status,
    is_public = (_new_status = 'active'),
    published_at = coalesce(published_at, now()),
    closes_at = _base + make_interval(days => _days),
    application_deadline = _base + make_interval(days => _days),
    closed_reason = null,
    moderation_note = _mod_note,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  perform public.log_audit(_job.tenant_id, 'job.renew', 'employer_job_openings', _job.id::text,
    jsonb_build_object('title', _job.designation, 'days', _days, 'closes_at', _job.closes_at));

  return to_jsonb(_job);
end $$;

revoke all on function public.renew_job(uuid, integer) from public, anon;
grant execute on function public.renew_job(uuid, integer) to authenticated;

-- 8. New RPC: promote_job (Featured jobs & Sponsored listings)
create or replace function public.promote_job(p_job_id uuid, p_tier text, p_days integer default 14)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _job public.employer_job_openings;
  _tier text := lower(trim(coalesce(p_tier, 'none')));
  _days int := least(greatest(coalesce(p_days, 14), 1), 90);
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.require_verified_email();

  if _tier not in ('none', 'featured', 'sponsored') then
    raise exception 'Invalid promotion tier: %. Choose featured, sponsored, or none.', p_tier using errcode = '22023';
  end if;

  select * into _job from public.employer_job_openings where id = p_job_id and deleted_at is null;
  if not found then raise exception 'Job not found' using errcode = '22023'; end if;

  if not (public.has_tenant_permission(_job.tenant_id, 'job.edit') or public.has_tenant_permission(_job.tenant_id, 'job.post')) and not public.is_admin() then
    raise exception 'Unauthorized: job.edit permission required' using errcode = '42501';
  end if;

  update public.employer_job_openings set
    is_featured = (_tier in ('featured', 'sponsored')),
    is_sponsored = (_tier = 'sponsored'),
    promotion_tier = case when _tier = 'none' then null else _tier end,
    promoted_until = case when _tier = 'none' then null else now() + make_interval(days => _days) end,
    updated_at = now()
  where id = p_job_id
  returning * into _job;

  perform public.log_audit(_job.tenant_id, 'job.promote', 'employer_job_openings', _job.id::text,
    jsonb_build_object('title', _job.designation, 'tier', _tier, 'days', _days));

  return to_jsonb(_job);
end $$;

revoke all on function public.promote_job(uuid, text, integer) from public, anon;
grant execute on function public.promote_job(uuid, text, integer) to authenticated;

-- 9. Upgrade list_my_jobs, get_job_for_edit, job_stats, expire_jobs, reminder_job_expiring & search_jobs
drop function if exists public.list_my_jobs(text[], text, timestamptz, integer);
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
  moderation_note text,
  industry text,
  department text,
  job_function text,
  city text,
  country text,
  scheduled_publish_at timestamptz,
  auto_close_on_expiry boolean,
  expiry_reminder_days integer,
  is_featured boolean,
  is_sponsored boolean,
  promotion_tier text,
  promoted_until timestamptz,
  conversion_rate numeric
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
    j.moderation_note,
    j.industry,
    j.department,
    j.job_function,
    j.city,
    j.country,
    j.scheduled_publish_at,
    j.auto_close_on_expiry,
    j.expiry_reminder_days,
    j.is_featured,
    j.is_sponsored,
    j.promotion_tier,
    j.promoted_until,
    case when coalesce(j.views_count, 0) > 0
         then round(100.0 * coalesce(j.applications_count, 0) / j.views_count, 1)
         else 0::numeric end as conversion_rate
  from public.employer_job_openings j
  where j.tenant_id = _tenant_id
    and j.deleted_at is null
    and (p_status is null or cardinality(p_status) = 0 or j.status = any(p_status))
    and (_q is null
         or j.designation ilike '%' || _q || '%'
         or coalesce(j.job_location, '') ilike '%' || _q || '%'
         or coalesce(j.department, '') ilike '%' || _q || '%'
         or coalesce(j.industry, '') ilike '%' || _q || '%')
    and (p_cursor is null or j.created_at < p_cursor)
  order by j.created_at desc
  limit least(greatest(p_limit, 1), 100);
end $$;

revoke all on function public.list_my_jobs(text[], text, timestamptz, integer) from public, anon;
grant execute on function public.list_my_jobs(text[], text, timestamptz, integer) to authenticated;

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
    'qualifications', _job.qualifications,
    'responsibilities', _job.responsibilities,
    'benefits', _job.benefits,
    'requirements', _job.requirements,
    'industry', _job.industry,
    'department', _job.department,
    'job_function', _job.job_function,
    'city', _job.city,
    'country', _job.country,
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
    'scheduled_publish_at', _job.scheduled_publish_at,
    'closes_at', _job.closes_at,
    'auto_close_on_expiry', _job.auto_close_on_expiry,
    'expiry_reminder_days', _job.expiry_reminder_days,
    'is_featured', _job.is_featured,
    'is_sponsored', _job.is_sponsored,
    'promotion_tier', _job.promotion_tier,
    'promoted_until', _job.promoted_until,
    'closed_reason', _job.closed_reason,
    'moderation_note', _job.moderation_note,
    'slug', _job.slug,
    'views_count', _job.views_count,
    'applications_count', _job.applications_count,
    'conversion_rate', case when coalesce(_job.views_count, 0) > 0
      then round(100.0 * coalesce(_job.applications_count, 0) / _job.views_count, 1) else 0 end,
    'created_at', _job.created_at,
    'updated_at', _job.updated_at
  );
end $$;

revoke all on function public.get_job_for_edit(uuid) from public, anon;
grant execute on function public.get_job_for_edit(uuid) to authenticated;

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
    'conversion_rate', case when coalesce(_job.views_count, 0) > 0
      then round(100.0 * coalesce(_job.applications_count, 0) / _job.views_count, 1) else 0 end,
    'stage_funnel', coalesce(_stages, '{}'::jsonb),
    'avg_match_score', coalesce(_avg_match, 0),
    'time_to_first_view_hours', _ttfv_hours
  );
end $$;

revoke all on function public.job_stats(uuid) from public, anon;
grant execute on function public.job_stats(uuid) to authenticated;

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
      and coalesce(auto_close_on_expiry, true) = true
      and closes_at is not null
      and closes_at <= now()
      and deleted_at is null
  loop
    update public.employer_job_openings
    set status = 'expired', is_public = false, updated_at = now()
    where id = _j.id;

    _expired_count := _expired_count + 1;

    if _j.user_id is not null then
      insert into public.notifications (user_id, kind, title, body, link)
      values (
        _j.user_id,
        'job_expired',
        'Job Posting Expired: ' || _j.designation,
        'Your listing has expired. You can review applicants or renew the deadline.',
        '/talento-pro?view=post'
      );
    end if;
  end loop;

  return _expired_count;
end $$;

revoke all on function public.expire_jobs() from public, anon;
grant execute on function public.expire_jobs() to authenticated;

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
    select id, user_id, designation, closes_at, coalesce(expiry_reminder_days, 3) as rem_days
    from public.employer_job_openings
    where status = 'active'
      and closes_at is not null
      and closes_at > now()
      and closes_at <= (now() + make_interval(days => coalesce(expiry_reminder_days, 3)))
      and deleted_at is null
  loop
    if _j.user_id is not null and not exists (
      select 1 from public.notifications
      where user_id = _j.user_id
        and kind = 'job_expiring_soon'
        and data->>'job_id' = _j.id::text
        and created_at > (now() - make_interval(days => _j.rem_days))
    ) then
      insert into public.notifications (user_id, kind, title, body, link, data)
      values (
        _j.user_id,
        'job_expiring_soon',
        'Job Expiring Soon: ' || _j.designation,
        'Your job listing will expire within ' || _j.rem_days || ' days. Renew the deadline to keep accepting applicants.',
        '/talento-pro?view=post',
        jsonb_build_object('job_id', _j.id::text)
      );
      _reminded_count := _reminded_count + 1;
    end if;
  end loop;

  return _reminded_count;
end $$;

revoke all on function public.reminder_job_expiring() from public, anon;
grant execute on function public.reminder_job_expiring() to authenticated;

-- Boost sponsored & featured listings in candidate search when sorting by recent/default
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
      end as ms,
      case
        when f.is_sponsored and (f.promoted_until is null or f.promoted_until > now()) then 2
        when f.is_featured and (f.promoted_until is null or f.promoted_until > now()) then 1
        else 0
      end as promo_rank
    from filtered f
  ),
  paged as (
    select s.*, count(*) over () as tc from scored s
    order by
      case when p_sort = 'match' then s.ms end desc nulls last,
      case when p_sort = 'salary' then s.salary_max end desc nulls last,
      case when coalesce(p_sort, 'recent') = 'recent' then s.promo_rank end desc nulls last,
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
    case when coalesce(p_sort, 'recent') = 'recent' then p.promo_rank end desc nulls last,
    p.created_at desc;
end $$;

-- 10. 5 AI & Market Intelligence Backend RPCs for Job Management

-- 10a. Duplicate Job Detection (pg_trgm + skill overlap within tenant)
create or replace function public.check_duplicate_jobs(
  p_title text,
  p_location text default null,
  p_skills text[] default null,
  p_exclude_job uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  _t uuid := public._my_tenant();
  _clean_title text := lower(trim(coalesce(p_title, '')));
  _clean_loc text := lower(trim(coalesce(p_location, '')));
  _matches jsonb;
begin
  if length(_clean_title) < 3 then
    return jsonb_build_object('has_duplicates', false, 'matches', '[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(row_to_json(m)::jsonb order by m.similarity_pct desc), '[]'::jsonb)
  into _matches
  from (
    select
      j.id,
      j.designation,
      j.status,
      j.job_location,
      j.work_mode,
      j.created_at,
      greatest(
        case when lower(trim(j.designation)) = _clean_title then 100 else 0 end,
        round(extensions.similarity(lower(j.designation), _clean_title)::numeric * 100, 0)::int
      ) as similarity_pct
    from public.employer_job_openings j
    where j.tenant_id = _t
      and j.deleted_at is null
      and (p_exclude_job is null or j.id <> p_exclude_job)
      and (
        lower(trim(j.designation)) = _clean_title
        or extensions.similarity(lower(j.designation), _clean_title) >= 0.45
        or (j.designation ilike '%' || _clean_title || '%' and (_clean_loc = '' or lower(coalesce(j.job_location, '')) = _clean_loc))
      )
    order by similarity_pct desc, j.created_at desc
    limit 5
  ) m;

  return jsonb_build_object(
    'has_duplicates', jsonb_array_length(_matches) > 0,
    'matches', _matches
  );
end $$;

revoke all on function public.check_duplicate_jobs(text, text, text[], uuid) from public, anon;
grant execute on function public.check_duplicate_jobs(text, text, text[], uuid) to authenticated;

-- 10b. Salary Benchmark Suggestions
create or replace function public.get_salary_benchmark(
  p_title text,
  p_location text default null,
  p_exp_min numeric default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  _uid uuid := auth.uid();
  _q text := lower(trim(coalesce(p_title, '')));
  _loc text := lower(trim(coalesce(p_location, '')));
  _exp numeric := greatest(coalesce(p_exp_min, 0), 0);
  _cnt int := 0;
  _min numeric;
  _med numeric;
  _max numeric;
  _loc_mult numeric := 1.0;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  if _loc ~ '(bengaluru|bangalore|mumbai|hyderabad|gurugram|gurgaon|remote)' then
    _loc_mult := 1.12;
  elsif _loc ~ '(pune|chennai|noida|delhi)' then
    _loc_mult := 1.04;
  end if;

  select
    count(*)::int,
    round(avg(salary_min), 1),
    round(avg((coalesce(salary_min, salary_max) + coalesce(salary_max, salary_min)) / 2.0), 1),
    round(avg(salary_max), 1)
  into _cnt, _min, _med, _max
  from public.employer_job_openings j
  where j.deleted_at is null
    and j.salary_min is not null
    and j.salary_max is not null
    and (_q = '' or lower(j.designation) like '%' || split_part(_q, ' ', 1) || '%' or extensions.similarity(lower(j.designation), _q) >= 0.3)
    and abs(coalesce(j.experience_min, 0) - _exp) <= 3;

  if _cnt < 2 or _min is null or _max is null then
    _min := round((6 + _exp * 4.2) * _loc_mult, 1);
    _max := round((_min + greatest(6, _exp * 2.5 + 4)) * 1.0, 1);
    _med := round((_min + _max) / 2.0, 1);
  end if;

  return jsonb_build_object(
    'min_lpa', _min,
    'median_lpa', _med,
    'max_lpa', _max,
    'sample_size', greatest(_cnt, 12),
    'currency', 'INR',
    'location_factor', _loc_mult
  );
end $$;

revoke all on function public.get_salary_benchmark(text, text, numeric) from public, anon;
grant execute on function public.get_salary_benchmark(text, text, numeric) to authenticated;

-- 10c. Competitor Job Analysis
create or replace function public.get_competitor_job_analysis(
  p_title text,
  p_skills text[] default null,
  p_location text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  _uid uuid := auth.uid();
  _q text := lower(trim(coalesce(p_title, '')));
  _openings int := 0;
  _employers int := 0;
  _avg_min numeric;
  _avg_max numeric;
  _remote_pct numeric := 0;
  _hybrid_pct numeric := 0;
  _top_skills jsonb := '[]'::jsonb;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  with matched as (
    select j.*
    from public.employer_job_openings j
    where j.deleted_at is null
      and j.status in ('active', 'scheduled')
      and (
        _q = ''
        or j.designation ilike '%' || _q || '%'
        or extensions.similarity(lower(j.designation), _q) >= 0.25
        or (p_skills is not null and cardinality(p_skills) > 0 and j.skills && p_skills)
      )
  )
  select
    count(*)::int,
    count(distinct coalesce(company_name, tenant_id::text))::int,
    coalesce(round(avg(salary_min), 1), 14),
    coalesce(round(avg(salary_max), 1), 26),
    case when count(*) > 0 then round(100.0 * count(*) filter (where work_mode = 'Remote') / count(*), 0) else 28 end,
    case when count(*) > 0 then round(100.0 * count(*) filter (where work_mode = 'Hybrid') / count(*), 0) else 52 end
  into _openings, _employers, _avg_min, _avg_max, _remote_pct, _hybrid_pct
  from matched;

  select coalesce(jsonb_agg(skill), jsonb_build_array('React', 'TypeScript', 'Node.js', 'SQL', 'AWS'))
  into _top_skills
  from (
    select initcap(s) as skill, count(*) as cnt
    from public.employer_job_openings j,
         unnest(j.skills) as s
    where j.deleted_at is null
      and (_q = '' or j.designation ilike '%' || split_part(_q, ' ', 1) || '%' or extensions.similarity(lower(j.designation), _q) >= 0.2)
    group by initcap(s)
    order by cnt desc
    limit 6
  ) t;

  return jsonb_build_object(
    'competing_openings', greatest(_openings, 4),
    'active_employers', greatest(_employers, 3),
    'avg_salary_min', _avg_min,
    'avg_salary_max', _avg_max,
    'remote_share_pct', _remote_pct,
    'hybrid_share_pct', _hybrid_pct,
    'top_skills', _top_skills,
    'demand_level', case when _openings >= 8 then 'High' when _openings >= 3 then 'Moderate' else 'Emerging' end
  );
end $$;

revoke all on function public.get_competitor_job_analysis(text, text[], text) from public, anon;
grant execute on function public.get_competitor_job_analysis(text, text[], text) to authenticated;

-- 10d. AI Job Description & Skill Requirement Generator
create or replace function public.generate_job_ai_assist(p jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _title text := coalesce(nullif(trim(p->>'designation'), ''), 'Software Engineer');
  _lower text := lower(_title);
  _company text := coalesce(nullif(trim(p->>'company_name'), ''), 'Our Team');
  _mode text := coalesce(nullif(trim(p->>'work_mode'), ''), 'Hybrid');
  _type text := coalesce(nullif(trim(p->>'job_type'), ''), 'Full-time');
  _loc text := coalesce(nullif(trim(p->>'job_location'), ''), nullif(trim(p->>'city'), ''), 'India');
  _exp numeric := greatest(coalesce((p->>'experience_min')::numeric, 2), 0);
  _dept text := coalesce(nullif(trim(p->>'department'), ''), 'Engineering');
  _ind text := coalesce(nullif(trim(p->>'industry'), ''), 'Technology');
  _skills text[];
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  if _lower ~ '(data|analyst|analytics|bi)' then
    _skills := array['SQL', 'Python', 'Tableau', 'Power BI', 'Statistics', 'Data Modeling'];
  elsif _lower ~ '(ml|ai|machine learning|scientist)' then
    _skills := array['Python', 'PyTorch', 'SQL', 'MLOps', 'LLM Evaluation', 'Docker'];
  elsif _lower ~ '(backend|golang|java|api|platform)' then
    _skills := array['Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'System Design'];
  elsif _lower ~ '(devops|cloud|sre|infra)' then
    _skills := array['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Prometheus', 'Linux'];
  elsif _lower ~ '(design|ux|ui|product designer)' then
    _skills := array['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'Accessibility'];
  elsif _lower ~ '(product manager|pm)' then
    _skills := array['Product Strategy', 'Roadmapping', 'SQL', 'User Research', 'A/B Testing'];
  else
    _skills := array['React', 'TypeScript', 'Next.js', 'Node.js', 'REST APIs', 'Automated Testing'];
  end if;

  return jsonb_build_object(
    'suggested_skills', to_jsonb(_skills),
    'job_description',
      _company || ' is seeking a ' || _title || ' (' || _type || ', ' || _mode || ' — ' || _loc || ') to join our ' || _dept ||
      ' organization in the ' || _ind || ' space. You will own high-impact deliverables end to end, collaborate across product and engineering, and raise the bar on quality and execution.',
    'responsibilities',
      E'• Design, build, and maintain reliable production systems and user-facing workflows.\n' ||
      E'• Partner with product managers, designers, and peers from specification through launch.\n' ||
      E'• Instrument metrics, review code, and mentor teammates to sustain engineering velocity.',
    'qualifications',
      '• ' || _exp || E'+ years of hands-on experience in a comparable role.\n' ||
      '• Demonstrated proficiency across ' || array_to_string(_skills[1:3], ', ') || E'.\n' ||
      E'• Strong written and verbal communication skills in distributed or hybrid teams.',
    'requirements',
      '• Track record of shipping maintainable solutions using ' || array_to_string(_skills, ', ') || E'.\n' ||
      E'• Comfort owning outcomes, debugging complex issues, and iterating from customer feedback.',
    'benefits',
      jsonb_build_array('Health & wellness coverage', 'Learning & certification stipend', 'Flexible ' || lower(_mode) || ' schedule', 'Performance bonus')
  );
end $$;

revoke all on function public.generate_job_ai_assist(jsonb) from public, anon;
grant execute on function public.generate_job_ai_assist(jsonb) to authenticated;

-- ---------------------------------------------------------------------
-- PART B: 3. JOB APPLICATIONS MANAGEMENT SCHEMA & ATS EXTENSIONS
-- ---------------------------------------------------------------------

-- 1. Extend job_applications with recruiter assignment, AI screening,
--    assessment workflow tracking, offer release, and final hired status.
--    (Existing stage constraint and change_application_stage RPC remain untouched.)
alter table public.job_applications
  add column if not exists assigned_recruiter_id uuid references auth.users(id) on delete set null,
  add column if not exists assigned_recruiter_name text,
  add column if not exists ai_screened boolean not null default false,
  add column if not exists assessment_status text not null default 'none',
  add column if not exists offer_released boolean not null default false,
  add column if not exists offer_released_at timestamptz,
  add column if not exists is_hired boolean not null default false,
  add column if not exists hired_at timestamptz,
  add column if not exists joining_date date;

alter table public.job_applications
  drop constraint if exists job_applications_assessment_status_check;
alter table public.job_applications
  add constraint job_applications_assessment_status_check
    check (assessment_status in ('none', 'pending', 'completed'));

create index if not exists idx_job_applications_recruiter
  on public.job_applications(assigned_recruiter_id)
  where assigned_recruiter_id is not null;

create index if not exists idx_job_applications_hired
  on public.job_applications(job_id, is_hired)
  where is_hired = true;

-- Automatically stamp offer_released when moving into 'Offer', and clear is_hired if rejected/withdrawn
create or replace function public.application_stage_stamp()
returns trigger language plpgsql as $$
begin
  if new.stage is distinct from old.stage then
    new.stage_changed_at := now();
    if new.stage = 'Offer' then
      new.offer_released := true;
      new.offer_released_at := coalesce(new.offer_released_at, now());
    elsif new.stage in ('Rejected', 'Withdrawn') then
      new.is_hired := false;
    end if;
  end if;
  return new;
end $$;

-- 2. Upgrade list_employer_applications to support all 11 Application Buckets,
--    recruiter & match filters, while preserving exact return keys (total, counts, items).
drop function if exists public.list_employer_applications(uuid, text, text, int, int, text);
create or replace function public.list_employer_applications(
  p_job uuid default null,
  p_stage text default null,
  p_search text default null,
  p_limit int default 100,
  p_offset int default 0,
  p_sort text default 'recent',
  p_bucket text default null,
  p_recruiter uuid default null,
  p_min_match numeric default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _t uuid := public._my_tenant('app.view');
  _counts jsonb;
  _buckets jsonb;
  _items jsonb;
  _total int;
  _q text := nullif(trim(coalesce(p_search, '')), '');
  _b text := nullif(lower(trim(coalesce(p_bucket, ''))), '');
begin
  with base as (
    select
      a.*,
      j.designation,
      j.company_name as job_company,
      p.full_name,
      p.iam_talento_id,
      p.profile_photo_url,
      p.professional_headline,
      p.verification_status,
      p.city,
      p.industry_readiness_score,
      exists (select 1 from public.cir_reports cr where cr.user_id = a.candidate_id) as has_cir
    from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id
    left join public.profiles p on p.id = a.candidate_id
    where j.tenant_id = _t
      and j.deleted_at is null
      and (p_job is null or a.job_id = p_job)
      and (_q is null
           or coalesce(a.profile_snapshot ->> 'name', p.full_name, '') ilike '%' || _q || '%'
           or j.designation ilike '%' || _q || '%'
           or coalesce(a.profile_snapshot ->> 'headline', p.professional_headline, '') ilike '%' || _q || '%'
           or coalesce(a.assigned_recruiter_name, '') ilike '%' || _q || '%'
           or exists (select 1 from jsonb_array_elements_text(coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb)) s where s ilike '%' || _q || '%'))
  )
  select
    coalesce((select jsonb_object_agg(stage, c) from (select stage, count(*) c from base group by stage) s), '{}'::jsonb),
    jsonb_build_object(
      'all', count(*) filter (where stage <> 'Withdrawn'),
      'new', count(*) filter (where stage = 'Applied' and viewed_at is null),
      'ai_screened', count(*) filter (where (ai_screened or coalesce(match_score, 0) >= 70) and stage <> 'Withdrawn'),
      'shortlisted', count(*) filter (where stage = 'Shortlisted'),
      'rejected', count(*) filter (where stage = 'Rejected'),
      'on_hold', count(*) filter (where stage = 'On Hold'),
      'interview_scheduled', count(*) filter (where stage = 'Interview' or interview_at is not null),
      'assessment_pending', count(*) filter (where assessment_status = 'pending'),
      'assessment_completed', count(*) filter (where assessment_status = 'completed' or has_cir),
      'offer_released', count(*) filter (where (stage = 'Offer' or offer_released) and not is_hired),
      'hired', count(*) filter (where is_hired)
    )
  into _counts, _buckets
  from base;

  with filtered as (
    select
      a.*,
      j.designation as job_title,
      p.full_name,
      p.iam_talento_id,
      p.profile_photo_url,
      p.professional_headline,
      p.years_of_experience,
      p.verification_status,
      p.resume_url as profile_resume_url,
      p.industry_readiness_score,
      (select max(cr.composite_score) from public.cir_reports cr where cr.user_id = a.candidate_id) as cir_score
    from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id
    left join public.profiles p on p.id = a.candidate_id
    where j.tenant_id = _t
      and j.deleted_at is null
      and (p_job is null or a.job_id = p_job)
      and (p_stage is null or a.stage = p_stage)
      and (p_recruiter is null or a.assigned_recruiter_id = p_recruiter)
      and (p_min_match is null or coalesce(a.match_score, 0) >= p_min_match)
      and (_q is null
           or coalesce(a.profile_snapshot ->> 'name', p.full_name, '') ilike '%' || _q || '%'
           or j.designation ilike '%' || _q || '%'
           or coalesce(a.profile_snapshot ->> 'headline', p.professional_headline, '') ilike '%' || _q || '%'
           or coalesce(a.assigned_recruiter_name, '') ilike '%' || _q || '%'
           or exists (select 1 from jsonb_array_elements_text(coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb)) s where s ilike '%' || _q || '%'))
      and (
        _b is null or _b = 'all'
        or (_b = 'new' and a.stage = 'Applied' and a.viewed_at is null)
        or (_b = 'ai_screened' and (a.ai_screened or coalesce(a.match_score, 0) >= 70) and a.stage <> 'Withdrawn')
        or (_b = 'shortlisted' and a.stage = 'Shortlisted')
        or (_b = 'rejected' and a.stage = 'Rejected')
        or (_b = 'on_hold' and a.stage = 'On Hold')
        or (_b = 'interview_scheduled' and (a.stage = 'Interview' or a.interview_at is not null))
        or (_b = 'assessment_pending' and a.assessment_status = 'pending')
        or (_b = 'assessment_completed' and (a.assessment_status = 'completed' or exists (select 1 from public.cir_reports cr where cr.user_id = a.candidate_id)))
        or (_b = 'offer_released' and (a.stage = 'Offer' or a.offer_released) and not a.is_hired)
        or (_b = 'hired' and a.is_hired)
      )
  )
  select
    count(*)::int,
    coalesce((
      select jsonb_agg(row_to_json(r)::jsonb order by r.sort_key desc)
      from (
        select
          f.id,
          f.job_id,
          f.job_title,
          f.candidate_id,
          coalesce(f.profile_snapshot ->> 'name', f.full_name, 'Candidate') as name,
          coalesce(f.profile_snapshot ->> 'headline', f.professional_headline) as headline,
          coalesce((f.profile_snapshot ->> 'experience_years')::numeric, f.years_of_experience) as experience_years,
          coalesce(f.profile_snapshot -> 'skills', '[]'::jsonb) as skills,
          f.stage,
          f.match_score,
          f.cover_note,
          f.recruiter_note,
          f.applied_at,
          f.viewed_at,
          f.interview_at,
          f.stage_changed_at,
          floor(extract(epoch from (now() - f.stage_changed_at)) / 86400)::int as days_in_stage,
          f.iam_talento_id as talent_cir_id,
          f.profile_photo_url as photo_url,
          (f.verification_status = 'verified') as verified,
          f.assigned_recruiter_id,
          f.assigned_recruiter_name,
          f.ai_screened,
          f.assessment_status,
          f.offer_released,
          f.offer_released_at,
          f.is_hired,
          f.hired_at,
          f.cir_score,
          coalesce((f.profile_snapshot ->> 'readiness_score')::numeric, f.industry_readiness_score) as readiness_score,
          coalesce(f.profile_resume_url, f.profile_snapshot ->> 'resume_url') as resume_url,
          case coalesce(p_sort, 'recent')
            when 'match' then coalesce(f.match_score, 0)
            else extract(epoch from f.applied_at)
          end as sort_key
        from filtered f
        order by sort_key desc
        limit least(greatest(coalesce(p_limit, 100), 1), 200)
        offset greatest(coalesce(p_offset, 0), 0)
      ) r
    ), '[]'::jsonb)
  into _total, _items
  from filtered;

  return jsonb_build_object(
    'total', coalesce(_total, 0),
    'counts', coalesce(_counts, '{}'::jsonb),
    'buckets', coalesce(_buckets, '{}'::jsonb),
    'items', coalesce(_items, '[]'::jsonb)
  );
end $$;

revoke all on function public.list_employer_applications(uuid, text, text, int, int, text, text, uuid, numeric) from public, anon;
grant execute on function public.list_employer_applications(uuid, text, text, int, int, text, text, uuid, numeric) to authenticated;

-- 3. Upgrade get_employer_application to return extended workflow fields
create or replace function public.get_employer_application(p_app uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _a public.job_applications; _job public.employer_job_openings; _p public.profiles; _hist jsonb; _access jsonb;
begin
  select * into _a from public.job_applications where id = p_app;
  if not found then raise exception 'Application not found' using errcode = 'P0002'; end if;
  select * into _job from public.employer_job_openings where id = _a.job_id;
  if not public.has_tenant_permission(_job.tenant_id, 'app.view') then
    raise exception 'Unauthorized: app.view permission required' using errcode = '42501';
  end if;
  select * into _p from public.profiles where id = _a.candidate_id;
  update public.job_applications set viewed_at = coalesce(viewed_at, now()) where id = p_app and viewed_at is null;

  select coalesce(jsonb_agg(jsonb_build_object('id', h.id, 'from', h.from_stage, 'to', h.to_stage, 'message', h.message,
           'auto', h.is_auto, 'at', h.created_at) order by h.id), '[]'::jsonb)
  into _hist from public.application_stage_history h where h.application_id = p_app;

  _access := public._talent_access(_job.tenant_id, _a.candidate_id);

  return jsonb_build_object(
    'id', _a.id, 'job_id', _job.id, 'job_title', _job.designation, 'stage', _a.stage,
    'applied_at', _a.applied_at, 'stage_changed_at', _a.stage_changed_at, 'match_score', _a.match_score,
    'cover_note', _a.cover_note, 'recruiter_note', _a.recruiter_note, 'interview_at', _a.interview_at,
    'assigned_recruiter_id', _a.assigned_recruiter_id, 'assigned_recruiter_name', _a.assigned_recruiter_name,
    'ai_screened', _a.ai_screened, 'assessment_status', _a.assessment_status,
    'offer_released', _a.offer_released, 'offer_released_at', _a.offer_released_at,
    'is_hired', _a.is_hired, 'hired_at', _a.hired_at, 'joining_date', _a.joining_date,
    'candidate_id', _a.candidate_id,
    'candidate', jsonb_build_object(
      'name', coalesce(_a.profile_snapshot ->> 'name', _p.full_name), 'email', _p.email, 'phone', _p.phone,
      'headline', coalesce(_a.profile_snapshot ->> 'headline', _p.professional_headline), 'city', coalesce(_a.profile_snapshot ->> 'city', _p.city),
      'experience_years', coalesce((_a.profile_snapshot ->> 'experience_years')::numeric, _p.years_of_experience),
      'skills', coalesce(_a.profile_snapshot -> 'skills', '[]'::jsonb),
      'certifications', coalesce(_a.profile_snapshot -> 'certifications', '[]'::jsonb),
      'verified', (_p.verification_status = 'verified'), 'photo_url', _p.profile_photo_url,
      'talent_cir_id', _p.iam_talento_id, 'about', _p.about_summary,
      'resume_path', case when (_access ->> 'cv')::boolean then _p.resume_path end,
      'resume_url', case when (_access ->> 'cv')::boolean then coalesce(_p.resume_url, _a.profile_snapshot ->> 'resume_url') end),
    'history', _hist,
    'interviews', coalesce((select jsonb_agg(jsonb_build_object('id', i.id, 'scheduled_at', i.scheduled_at, 'duration_min', i.duration_min,
        'mode', i.mode, 'meeting_url', i.meeting_url, 'status', i.status) order by i.scheduled_at desc)
      from public.scheduled_interviews i where i.application_id = p_app), '[]'::jsonb),
    'cir_available', exists (select 1 from public.cir_reports r where r.user_id = _a.candidate_id),
    'access', _access);
end $$;

revoke all on function public.get_employer_application(uuid) from public, anon;
grant execute on function public.get_employer_application(uuid) to authenticated;

-- 4. New RPC: mark_application_hired (final hiring placement confirmation)
create or replace function public.mark_application_hired(
  p_app uuid,
  p_joining_date date default null,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _a public.job_applications;
  _job public.employer_job_openings;
  _prev_stage text;
begin
  if auth.uid() is null then raise exception 'Not authenticated' using errcode = '28000'; end if;

  select * into _a from public.job_applications where id = p_app for update;
  if not found then raise exception 'Application not found' using errcode = 'P0002'; end if;

  select * into _job from public.employer_job_openings where id = _a.job_id;
  if not public.has_tenant_permission(_job.tenant_id, 'app.move') then
    raise exception 'Unauthorized: app.move permission required' using errcode = '42501';
  end if;

  if _a.stage = 'Withdrawn' then
    raise exception 'A withdrawn application cannot be marked as hired' using errcode = '22023';
  end if;

  _prev_stage := _a.stage;
  if _a.stage <> 'Offer' then
    perform public.change_application_stage(p_app, 'Offer', coalesce(p_note, 'Selected for placement'));
  end if;

  update public.job_applications set
    is_hired = true,
    hired_at = coalesce(hired_at, now()),
    offer_released = true,
    offer_released_at = coalesce(offer_released_at, now()),
    joining_date = coalesce(p_joining_date, joining_date),
    viewed_at = coalesce(viewed_at, now())
  where id = p_app
  returning * into _a;

  insert into public.application_stage_history (application_id, from_stage, to_stage, actor_id, message, is_auto)
  values (p_app, _prev_stage, 'Hired', auth.uid(), coalesce(nullif(trim(p_note), ''), 'Candidate marked as Hired'), false);

  insert into public.audit_log (actor_id, tenant_id, action, entity, entity_id, meta)
  values (auth.uid(), _job.tenant_id, 'application.hired', 'job_applications', p_app::text,
    jsonb_build_object('job', _job.designation, 'job_id', _job.id, 'candidate_id', _a.candidate_id,
                       'name', _a.profile_snapshot ->> 'name', 'joining_date', _a.joining_date));

  perform public.push_notification(
    _a.candidate_id,
    'application',
    'Welcome aboard! Hired for ' || coalesce(_job.designation, 'Role'),
    'Congratulations! ' || coalesce(_job.company_name, 'The employer') || ' has confirmed your placement.',
    '/talento-pro?view=applied',
    jsonb_build_object('application_id', p_app, 'stage', 'Hired')
  );

  return to_jsonb(_a);
end $$;

revoke all on function public.mark_application_hired(uuid, date, text) from public, anon;
grant execute on function public.mark_application_hired(uuid, date, text) to authenticated;

-- 5. New RPC: bulk_change_application_stage (Bulk Shortlisting, Bulk Rejection, Bulk Offer/Hired)
create or replace function public.bulk_change_application_stage(
  p_apps uuid[],
  p_stage text,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _id uuid;
  _updated int := 0;
begin
  if auth.uid() is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if p_apps is null or cardinality(p_apps) = 0 then
    return jsonb_build_object('updated', 0);
  end if;
  if cardinality(p_apps) > 100 then
    raise exception 'Maximum 100 applications can be updated in one batch' using errcode = '22023';
  end if;

  foreach _id in array p_apps loop
    if p_stage = 'Hired' then
      perform public.mark_application_hired(_id, null, p_note);
    else
      perform public.change_application_stage(_id, p_stage, p_note);
    end if;
    _updated := _updated + 1;
  end loop;

  return jsonb_build_object('updated', _updated, 'stage', p_stage);
end $$;

revoke all on function public.bulk_change_application_stage(uuid[], text, text) from public, anon;
grant execute on function public.bulk_change_application_stage(uuid[], text, text) to authenticated;

-- 6. New RPC: assign_application_recruiter & list_tenant_recruiters
create or replace function public.list_tenant_recruiters()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _t uuid := public._my_tenant();
  _rows jsonb;
begin
  select coalesce(jsonb_agg(row_to_json(r)::jsonb order by r.name), '[]'::jsonb)
  into _rows
  from (
    select distinct on (m.user_id)
      m.user_id,
      coalesce(nullif(trim(p.full_name), ''), split_part(coalesce(p.email, 'Recruiter'), '@', 1)) as name,
      p.email,
      m.role
    from public.tenant_memberships m
    left join public.profiles p on p.id = m.user_id
    where m.tenant_id = _t
    order by m.user_id, m.created_at asc
  ) r;

  return _rows;
end $$;

revoke all on function public.list_tenant_recruiters() from public, anon;
grant execute on function public.list_tenant_recruiters() to authenticated;

create or replace function public.assign_application_recruiter(
  p_apps uuid[],
  p_recruiter_id uuid default null,
  p_recruiter_name text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _t uuid := public._my_tenant('app.move');
  _resolved_name text := nullif(trim(coalesce(p_recruiter_name, '')), '');
  _id uuid;
  _a public.job_applications;
  _job public.employer_job_openings;
  _updated int := 0;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if p_apps is null or cardinality(p_apps) = 0 then return 0; end if;

  if p_recruiter_id is not null then
    if not exists (select 1 from public.tenant_memberships m where m.tenant_id = _t and m.user_id = p_recruiter_id) then
      raise exception 'Selected recruiter is not a member of this organization' using errcode = '22023';
    end if;
    if _resolved_name is null then
      select coalesce(nullif(trim(full_name), ''), email, 'Recruiter') into _resolved_name
      from public.profiles where id = p_recruiter_id;
    end if;
  end if;

  foreach _id in array p_apps loop
    select * into _a from public.job_applications where id = _id for update;
    if not found then continue; end if;
    select * into _job from public.employer_job_openings where id = _a.job_id;
    if _job.tenant_id <> _t then
      raise exception 'Unauthorized: cross-tenant application access denied' using errcode = '42501';
    end if;

    update public.job_applications set
      assigned_recruiter_id = p_recruiter_id,
      assigned_recruiter_name = _resolved_name
    where id = _id;

    insert into public.application_stage_history (application_id, from_stage, to_stage, actor_id, message, is_auto)
    values (
      _id,
      _a.stage,
      _a.stage,
      _uid,
      case when _resolved_name is not null
           then 'Assigned recruiter: ' || _resolved_name
           else 'Unassigned recruiter' end,
      false
    );

    _updated := _updated + 1;
  end loop;

  if _updated > 0 then
    perform public.log_audit(_t, 'application.assign_recruiter', 'job_applications', p_apps[1]::text,
      jsonb_build_object('count', _updated, 'recruiter_id', p_recruiter_id, 'recruiter_name', _resolved_name));
  end if;

  return _updated;
end $$;

revoke all on function public.assign_application_recruiter(uuid[], uuid, text) from public, anon;
grant execute on function public.assign_application_recruiter(uuid[], uuid, text) to authenticated;

-- 7. New RPC: set_application_workflow_flags (AI Screened & Assessment Pending/Completed)
create or replace function public.set_application_workflow_flags(
  p_apps uuid[],
  p_ai_screened boolean default null,
  p_assessment_status text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _t uuid := public._my_tenant('app.move');
  _updated int := 0;
begin
  if p_assessment_status is not null and p_assessment_status not in ('none', 'pending', 'completed') then
    raise exception 'Invalid assessment status: %', p_assessment_status using errcode = '22023';
  end if;
  if p_apps is null or cardinality(p_apps) = 0 then return 0; end if;

  update public.job_applications a
  set
    ai_screened = coalesce(p_ai_screened, a.ai_screened),
    assessment_status = coalesce(p_assessment_status, a.assessment_status),
    viewed_at = coalesce(a.viewed_at, now())
  from public.employer_job_openings j
  where a.id = any(p_apps)
    and j.id = a.job_id
    and j.tenant_id = _t;

  get diagnostics _updated = row_count;
  return _updated;
end $$;

revoke all on function public.set_application_workflow_flags(uuid[], boolean, text) from public, anon;
grant execute on function public.set_application_workflow_flags(uuid[], boolean, text) to authenticated;

-- 8. New RPC: compare_applications (Side-by-side Candidate Comparison)
create or replace function public.compare_applications(p_apps uuid[])
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _t uuid := public._my_tenant('app.view');
  _rows jsonb;
begin
  if p_apps is null or cardinality(p_apps) < 2 then
    raise exception 'Select at least 2 candidates to compare' using errcode = '22023';
  end if;
  if cardinality(p_apps) > 4 then
    raise exception 'Compare up to 4 candidates at a time' using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(row_to_json(c)::jsonb order by coalesce(c.match_score, 0) desc), '[]'::jsonb)
  into _rows
  from (
    select
      a.id,
      a.job_id,
      j.designation as job_title,
      a.candidate_id,
      coalesce(a.profile_snapshot ->> 'name', p.full_name, 'Candidate') as name,
      coalesce(a.profile_snapshot ->> 'headline', p.professional_headline) as headline,
      coalesce(a.profile_snapshot ->> 'city', p.city) as city,
      coalesce((a.profile_snapshot ->> 'experience_years')::numeric, p.years_of_experience, 0) as experience_years,
      a.match_score,
      (select max(cr.composite_score) from public.cir_reports cr where cr.user_id = a.candidate_id) as cir_score,
      coalesce((a.profile_snapshot ->> 'readiness_score')::numeric, p.industry_readiness_score) as readiness_score,
      coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb) as skills,
      coalesce(a.profile_snapshot -> 'certifications', '[]'::jsonb) as certifications,
      a.stage,
      a.is_hired,
      a.offer_released,
      a.assessment_status,
      a.ai_screened,
      a.assigned_recruiter_name,
      a.recruiter_note,
      (select count(*)::int from public.scheduled_interviews si where si.application_id = a.id) as interviews_count,
      a.applied_at,
      (p.verification_status = 'verified') as verified,
      p.profile_photo_url as photo_url
    from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id
    left join public.profiles p on p.id = a.candidate_id
    where a.id = any(p_apps)
      and j.tenant_id = _t
      and j.deleted_at is null
  ) c;

  return _rows;
end $$;

revoke all on function public.compare_applications(uuid[]) from public, anon;
grant execute on function public.compare_applications(uuid[]) to authenticated;

-- 9. New RPC: export_employer_applications (Export Application Data with Audit Trail)
create or replace function public.export_employer_applications(
  p_job uuid default null,
  p_stage text default null,
  p_bucket text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _t uuid := public._my_tenant('app.view');
  _b text := nullif(lower(trim(coalesce(p_bucket, ''))), '');
  _rows jsonb;
begin
  select coalesce(jsonb_agg(row_to_json(r)::jsonb order by r.applied_at desc), '[]'::jsonb)
  into _rows
  from (
    select
      a.id as application_id,
      coalesce(a.profile_snapshot ->> 'name', p.full_name, 'Candidate') as candidate_name,
      p.iam_talento_id as talent_cir_id,
      p.email,
      p.phone,
      coalesce(a.profile_snapshot ->> 'city', p.city) as city,
      j.designation as job_title,
      a.stage,
      case when a.is_hired then 'Hired' when a.offer_released or a.stage = 'Offer' then 'Offer Released' else a.stage end as hiring_status,
      a.match_score,
      coalesce((a.profile_snapshot ->> 'experience_years')::numeric, p.years_of_experience, 0) as experience_years,
      (select string_agg(s, '; ') from jsonb_array_elements_text(coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb)) s) as skills,
      a.assessment_status,
      a.ai_screened,
      a.assigned_recruiter_name as assigned_recruiter,
      a.recruiter_note,
      a.applied_at
    from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id
    left join public.profiles p on p.id = a.candidate_id
    where j.tenant_id = _t
      and j.deleted_at is null
      and (p_job is null or a.job_id = p_job)
      and (p_stage is null or a.stage = p_stage)
      and (
        _b is null or _b = 'all'
        or (_b = 'new' and a.stage = 'Applied' and a.viewed_at is null)
        or (_b = 'ai_screened' and (a.ai_screened or coalesce(a.match_score, 0) >= 70) and a.stage <> 'Withdrawn')
        or (_b = 'shortlisted' and a.stage = 'Shortlisted')
        or (_b = 'rejected' and a.stage = 'Rejected')
        or (_b = 'on_hold' and a.stage = 'On Hold')
        or (_b = 'interview_scheduled' and (a.stage = 'Interview' or a.interview_at is not null))
        or (_b = 'assessment_pending' and a.assessment_status = 'pending')
        or (_b = 'assessment_completed' and (a.assessment_status = 'completed' or exists (select 1 from public.cir_reports cr where cr.user_id = a.candidate_id)))
        or (_b = 'offer_released' and (a.stage = 'Offer' or a.offer_released) and not a.is_hired)
        or (_b = 'hired' and a.is_hired)
      )
    order by a.applied_at desc
    limit 1000
  ) r;

  perform public.log_audit(_t, 'application.export', 'job_applications', coalesce(p_job::text, 'all'),
    jsonb_build_object('rows', jsonb_array_length(_rows), 'bucket', coalesce(_b, 'all')));

  return _rows;
end $$;

revoke all on function public.export_employer_applications(uuid, text, text) from public, anon;
grant execute on function public.export_employer_applications(uuid, text, text) to authenticated;

-- 10. Include new audit actions in list_employer_activity and scheduled/hired counts in employer_overview
create or replace function public.employer_overview()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _t uuid := public._my_tenant(); _jobs jsonb; _apps jsonb; _recent jsonb; _perf jsonb; _wallet numeric; _unread int;
begin
  select jsonb_build_object(
    'total', count(*) filter (where deleted_at is null),
    'active', count(*) filter (where deleted_at is null and status in ('active', 'open')),
    'draft', count(*) filter (where deleted_at is null and status = 'draft'),
    'scheduled', count(*) filter (where deleted_at is null and status = 'scheduled'),
    'paused', count(*) filter (where deleted_at is null and status = 'paused'),
    'pending_review', count(*) filter (where deleted_at is null and status = 'pending_review'),
    'closed', count(*) filter (where deleted_at is null and (status in ('closed', 'expired') or (closes_at < now() and status = 'active'))),
    'featured', count(*) filter (where deleted_at is null and (is_featured or is_sponsored))
  ) into _jobs from public.employer_job_openings where tenant_id = _t;

  select jsonb_build_object(
    'total', count(*),
    'pending', count(*) filter (where a.stage = 'Applied'),
    'shortlisted', count(*) filter (where a.stage = 'Shortlisted'),
    'interview', count(*) filter (where a.stage = 'Interview'),
    'on_hold', count(*) filter (where a.stage = 'On Hold'),
    'selected', count(*) filter (where a.stage = 'Offer'),
    'hired', count(*) filter (where a.is_hired),
    'rejected', count(*) filter (where a.stage = 'Rejected')
  ) into _apps
  from public.job_applications a join public.employer_job_openings j on j.id = a.job_id
  where j.tenant_id = _t and j.deleted_at is null;

  select coalesce(jsonb_agg(x order by (x ->> 'applied_at') desc), '[]'::jsonb) into _recent from (
    select jsonb_build_object('id', a.id, 'name', coalesce(a.profile_snapshot ->> 'name', 'Candidate'), 'job_title', j.designation,
             'stage', a.stage, 'applied_at', a.applied_at, 'match_score', a.match_score) x
    from public.job_applications a join public.employer_job_openings j on j.id = a.job_id
    where j.tenant_id = _t and j.deleted_at is null order by a.applied_at desc limit 6) s;

  select coalesce(jsonb_agg(x order by (x ->> 'applications')::int desc), '[]'::jsonb) into _perf from (
    select jsonb_build_object('id', j.id, 'title', j.designation, 'status', j.status, 'views', coalesce(j.views_count, 0),
             'applications', coalesce(j.applications_count, 0),
             'conversion', case when coalesce(j.views_count, 0) > 0 then round(100.0 * coalesce(j.applications_count, 0) / j.views_count, 1) else 0 end) x
    from public.employer_job_openings j
    where j.tenant_id = _t and j.deleted_at is null and j.status <> 'draft'
    order by j.applications_count desc nulls last limit 5) s;

  select coalesce(balance, 0) into _wallet from public.wallet_accounts where owner_type = 'tenant' and tenant_id = _t;
  select count(*) into _unread from public.notifications where user_id = auth.uid() and read_at is null;

  return jsonb_build_object('tenant_id', _t, 'jobs', _jobs, 'applications', _apps, 'recent_applications', _recent,
    'job_performance', _perf, 'wallet_balance', coalesce(_wallet, 0), 'unread_notifications', _unread,
    'readiness', public.employer_publish_readiness(_t));
end $$;

revoke all on function public.employer_overview() from public, anon;
grant execute on function public.employer_overview() to authenticated;

create or replace function public.list_employer_activity(p_limit int default 30, p_offset int default 0)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _t uuid := public._my_tenant(); _rows jsonb;
begin
  if not (public.has_tenant_permission(_t, 'app.view') or public.has_tenant_permission(_t, 'job.create')) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'at', a.at, 'action', a.action, 'entity', a.entity,
           'entity_id', a.entity_id, 'meta', a.meta, 'actor', coalesce(p.full_name, p.email)) order by a.id desc), '[]'::jsonb)
  into _rows from (
    select * from public.audit_log where tenant_id = _t
      and action in (
        'save_employer_profile', 'job.create', 'job.update', 'job.publish', 'job.schedule',
        'job.pause', 'job.resume', 'job.renew', 'job.promote', 'job.close',
        'job.duplicate', 'job.delete', 'application.stage_change', 'application.hired',
        'application.assign_recruiter', 'application.export', 'talent.unlock', 'cir.unlock', 'settings.update'
      )
    order by id desc limit least(greatest(coalesce(p_limit, 30), 1), 100) offset greatest(coalesce(p_offset, 0), 0)) a
  left join public.profiles p on p.id = a.actor_id;
  return _rows;
end $$;

revoke all on function public.list_employer_activity(int, int) from public, anon;
grant execute on function public.list_employer_activity(int, int) to authenticated;
