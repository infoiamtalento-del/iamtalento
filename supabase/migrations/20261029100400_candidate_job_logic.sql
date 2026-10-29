-- =====================================================================
-- Candidate job logic: match scoring, apply, save, withdraw, notifications
-- =====================================================================

-- 0.45 CIR + 0.25 skill overlap + 0.15 semantic + 0.10 experience + 0.05 integrity.
-- Candidates without a CIR yet are scored on the remaining signals, renormalised.
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
grant execute on function public.compute_match_score(uuid, uuid) to authenticated;

create or replace function public.apply_to_job(p_job uuid, p_cover_note text default null)
returns public.job_applications
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid(); _job public.employer_job_openings; _app public.job_applications;
  _m jsonb; _snap jsonb; _best numeric;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _job from public.employer_job_openings where id = p_job and status = 'active';
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
    'readiness_score', p.industry_readiness_score,
    'verification', p.verification_status)
  into _snap from public.profiles p where p.id = _uid;

  insert into public.job_applications (job_id, candidate_id, tenant_id, cover_note, match_score, match_breakdown, profile_snapshot)
  values (p_job, _uid, _job.tenant_id, p_cover_note, (_m ->> 'score')::numeric, _m, coalesce(_snap, '{}'::jsonb))
  returning * into _app;
  return _app;
end $$;

create or replace function public.withdraw_application(p_application uuid)
returns public.job_applications
language plpgsql security definer set search_path = public as $$
declare _app public.job_applications;
begin
  update public.job_applications set stage = 'Withdrawn'
   where id = p_application and candidate_id = auth.uid() and stage in ('Applied', 'Shortlisted', 'Interview')
   returning * into _app;
  if not found then raise exception 'This application can no longer be withdrawn'; end if;
  return _app;
end $$;

create or replace function public.toggle_saved_job(p_job uuid)
returns boolean
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid();
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if exists (select 1 from public.saved_jobs where user_id = _uid and job_id = p_job) then
    delete from public.saved_jobs where user_id = _uid and job_id = p_job;
    return false;
  end if;
  insert into public.saved_jobs (user_id, job_id) values (_uid, p_job);
  return true;
end $$;

-- Employer: move an application along the pipeline (triggers candidate notification).
create or replace function public.update_application_stage(p_application uuid, p_stage text, p_note text default null)
returns public.job_applications
language plpgsql security definer set search_path = public as $$
declare _app public.job_applications;
begin
  if p_stage not in ('Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected') then
    raise exception 'Invalid stage %', p_stage;
  end if;
  select * into _app from public.job_applications where id = p_application;
  if not found or not public.can_manage_job(_app.job_id) then raise exception 'Application not found'; end if;
  update public.job_applications set stage = p_stage, recruiter_note = coalesce(p_note, recruiter_note),
    viewed_at = coalesce(viewed_at, now())
  where id = p_application returning * into _app;
  return _app;
end $$;

create or replace function public.mark_notifications_read(p_ids uuid[] default null)
returns integer
language plpgsql security definer set search_path = public as $$
declare _n int;
begin
  update public.notifications set read_at = now()
   where user_id = auth.uid() and read_at is null and (p_ids is null or id = any(p_ids));
  get diagnostics _n = row_count;
  return _n;
end $$;

-- Aggregated dashboard counters for the candidate shell (single round trip).
create or replace function public.candidate_dashboard()
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'applications', (select count(*) from public.job_applications where candidate_id = auth.uid() and stage <> 'Withdrawn'),
    'shortlisted',  (select count(*) from public.job_applications where candidate_id = auth.uid() and stage in ('Shortlisted','Interview','Offer')),
    'saved_jobs',   (select count(*) from public.saved_jobs where user_id = auth.uid()),
    'unread',       (select count(*) from public.notifications where user_id = auth.uid() and read_at is null),
    'wallet',       coalesce((select balance from public.wallet_accounts where owner_type = 'candidate' and user_id = auth.uid()), 0),
    'readiness',    (select industry_readiness_score from public.profiles where id = auth.uid()),
    'latest_cir',   (select jsonb_build_object('id', id, 'score', composite_score, 'tier', tier, 'percentile', percentile)
                       from public.cir_reports where user_id = auth.uid() order by generated_at desc limit 1),
    'courses_in_progress', (select count(*) from public.course_enrollments where user_id = auth.uid() and status = 'active'));
$$;

-- Marks assessments overdue; schedule with pg_cron: select cron.schedule('expire-attempts','* * * * *','select public.expire_overdue_attempts()');
create or replace function public.expire_overdue_attempts()
returns integer
language plpgsql security definer set search_path = public as $$
declare _a record; _n int := 0;
begin
  for _a in select id from public.assessment_attempts where status = 'in_progress' and server_expires_at < now() loop
    perform public._grade_attempt(_a.id);
    _n := _n + 1;
  end loop;
  return _n;
end $$;
revoke execute on function public.expire_overdue_attempts() from public, anon, authenticated;
grant execute on function public.expire_overdue_attempts() to service_role;

-- Realtime for live UI updates
do $$ begin
  begin alter publication supabase_realtime add table public.notifications; exception when others then null; end;
  begin alter publication supabase_realtime add table public.job_applications; exception when others then null; end;
  begin alter publication supabase_realtime add table public.wallet_ledger_entries; exception when others then null; end;
end $$;
