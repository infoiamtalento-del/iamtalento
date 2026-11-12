-- Employer dashboard: application lifecycle (On Hold), live applicant pipeline, Find Talent
-- (basic + verified, package-gated), CIR report entitlement, follow-up notifications,
-- employer settings/contacts and a real-data overview.
-- Everything is enforced server-side; the UI only reflects these functions.

-- ---------------------------------------------------------------------
-- 0. Helpers
-- ---------------------------------------------------------------------
-- Resolves the caller's tenant and (optionally) enforces a tenant permission.
create or replace function public._my_tenant(p_perm text default null)
returns uuid
language plpgsql stable security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _t uuid;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select e.tenant_id into _t from public.employers e where e.user_id = _uid and e.tenant_id is not null limit 1;
  if _t is null then
    select m.tenant_id into _t from public.tenant_memberships m where m.user_id = _uid order by m.created_at limit 1;
  end if;
  if _t is null then raise exception 'Tenant organization not found' using errcode = 'P0002'; end if;
  if p_perm is not null and not public.has_tenant_permission(_t, p_perm) then
    raise exception 'Unauthorized: % permission required', p_perm using errcode = '42501';
  end if;
  return _t;
end $$;
revoke all on function public._my_tenant(text) from public, anon;
grant execute on function public._my_tenant(text) to authenticated;

-- ---------------------------------------------------------------------
-- 1. Application lifecycle: On Hold + automatic stage history
-- ---------------------------------------------------------------------
alter table public.job_applications drop constraint if exists job_applications_stage_check;
alter table public.job_applications add constraint job_applications_stage_check
  check (stage in ('Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn', 'On Hold'));

alter table public.job_applications
  add column if not exists stage_changed_at timestamptz not null default now();
update public.job_applications set stage_changed_at = coalesce(updated_at, applied_at);

create or replace function public.application_stage_stamp()
returns trigger language plpgsql as $$
begin
  if new.stage is distinct from old.stage then new.stage_changed_at := now(); end if;
  return new;
end $$;
drop trigger if exists application_stage_stamp_trg on public.job_applications;
create trigger application_stage_stamp_trg before update on public.job_applications
  for each row execute function public.application_stage_stamp();

-- History, candidate updates and the employer's new-application alert all live in one trigger
-- function. Replaced here to drop the old SLA wording, support On Hold and a recruiter note.
create or replace function public.on_application_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare _job record; _msg text; _note text;
begin
  select designation, company_name, user_id into _job from public.employer_job_openings where id = new.job_id;

  if tg_op = 'INSERT' then
    insert into public.application_stage_history (application_id, from_stage, to_stage, actor_id, message, is_auto)
    values (new.id, null, new.stage, new.candidate_id, 'Application received', true);
    if _job.user_id is not null then
      insert into public.notifications (user_id, kind, title, body, link, data)
      values (_job.user_id, 'application', 'New application: ' || coalesce(_job.designation, 'Job'),
              coalesce(new.profile_snapshot ->> 'name', 'A candidate') || ' applied to ' || coalesce(_job.designation, 'your opening') || '.',
              '/talento-pro?view=pipe&application=' || new.id::text,
              jsonb_build_object('application_id', new.id, 'job_id', new.job_id,
                                 'dedupe_key', 'received:' || new.id::text || ':' || extract(epoch from new.applied_at)::bigint))
      on conflict do nothing;
    end if;
  elsif new.stage is distinct from old.stage then
    _note := nullif(current_setting('app.stage_note', true), '');
    _msg := case new.stage
      when 'Shortlisted' then 'Great news. You have been shortlisted.'
      when 'Interview'   then 'You have been moved to the interview stage.'
      when 'Offer'       then 'Congratulations. An offer is on its way.'
      when 'Rejected'    then 'Thank you for applying. The team decided not to move forward.'
      when 'On Hold'     then 'The team has put your application on hold and will get back to you.'
      when 'Withdrawn'   then 'You withdrew this application.'
      else 'Your application status changed to ' || new.stage || '.'
    end;
    insert into public.application_stage_history (application_id, from_stage, to_stage, actor_id, message, is_auto)
    values (new.id, old.stage, new.stage, auth.uid(), coalesce(_note, _msg), auth.uid() is null);
    if new.stage <> 'Withdrawn' then
      perform public.push_notification(new.candidate_id, 'application',
        coalesce(_job.designation, 'Application') || ' at ' || coalesce(_job.company_name, 'company') || ': ' || new.stage,
        _msg, '/talento-pro?view=applied', jsonb_build_object('application_id', new.id, 'stage', new.stage));
    end if;
  end if;
  return new;
end $$;

-- Notifications: track whether a follow-up was acted on, and never duplicate one.
alter table public.notifications add column if not exists acted_at timestamptz;
create unique index if not exists notifications_dedupe_uq
  on public.notifications (user_id, (data ->> 'dedupe_key')) where data ? 'dedupe_key';

-- ---------------------------------------------------------------------
-- 2. Stage changes (the only supported way for employers to move an applicant)
-- ---------------------------------------------------------------------
create or replace function public.change_application_stage(p_app uuid, p_stage text, p_note text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _a public.job_applications; _job public.employer_job_openings;
begin
  if auth.uid() is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if p_stage not in ('Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'On Hold') then
    raise exception 'Invalid stage: %', p_stage using errcode = '22023';
  end if;
  if length(coalesce(p_note, '')) > 1000 then raise exception 'Note is too long' using errcode = '22023'; end if;

  select * into _a from public.job_applications where id = p_app for update;
  if not found then raise exception 'Application not found' using errcode = 'P0002'; end if;
  select * into _job from public.employer_job_openings where id = _a.job_id;
  if not public.has_tenant_permission(_job.tenant_id, 'app.move') then
    raise exception 'Unauthorized: app.move permission required' using errcode = '42501';
  end if;
  if _a.stage = 'Withdrawn' then raise exception 'A withdrawn application cannot be moved' using errcode = '22023'; end if;

  if _a.stage <> p_stage then
    perform set_config('app.stage_note', coalesce(p_note, ''), true);
    update public.job_applications set stage = p_stage, viewed_at = coalesce(viewed_at, now())
    where id = p_app returning * into _a;

    insert into public.audit_log (actor_id, tenant_id, action, entity, entity_id, meta)
    values (auth.uid(), _job.tenant_id, 'application.stage_change', 'job_applications', p_app::text,
            jsonb_build_object('to', p_stage, 'job', _job.designation, 'job_id', _job.id, 'candidate_id', _a.candidate_id,
                               'name', _a.profile_snapshot ->> 'name', 'note', nullif(p_note, '')));

  end if;

  -- Any follow-up for this application has now been acted on.
  update public.notifications set acted_at = now()
  where kind = 'employer_followup' and acted_at is null and data ->> 'application_id' = p_app::text;

  return to_jsonb(_a);
end $$;
revoke all on function public.change_application_stage(uuid, text, text) from public, anon;
grant execute on function public.change_application_stage(uuid, text, text) to authenticated;

-- Move an applicant out of On Hold, back to the stage they were in before.
create or replace function public.release_application_hold(p_app uuid, p_note text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _a public.job_applications; _prev text;
begin
  select * into _a from public.job_applications where id = p_app;
  if not found then raise exception 'Application not found' using errcode = 'P0002'; end if;
  if _a.stage <> 'On Hold' then raise exception 'Application is not on hold' using errcode = '22023'; end if;
  select h.from_stage into _prev from public.application_stage_history h
  where h.application_id = p_app and h.to_stage = 'On Hold' order by h.id desc limit 1;
  if _prev is null or _prev in ('On Hold', 'Withdrawn') then _prev := 'Applied'; end if;
  return public.change_application_stage(p_app, _prev, coalesce(p_note, 'Released from hold'));
end $$;
revoke all on function public.release_application_hold(uuid, text) from public, anon;
grant execute on function public.release_application_hold(uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- 3. Live pipeline reads
-- ---------------------------------------------------------------------
create or replace function public.list_employer_applications(
  p_job uuid default null, p_stage text default null, p_search text default null,
  p_limit int default 100, p_offset int default 0, p_sort text default 'recent')
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _t uuid := public._my_tenant('app.view'); _counts jsonb; _items jsonb; _total int; _q text := nullif(trim(coalesce(p_search, '')), '');
begin
  with base as (
    select a.*, j.designation, j.company_name as job_company, p.full_name, p.iam_talento_id, p.profile_photo_url,
           p.professional_headline, p.verification_status, p.city
    from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id
    left join public.profiles p on p.id = a.candidate_id
    where j.tenant_id = _t and j.deleted_at is null
      and (p_job is null or a.job_id = p_job)
      and (_q is null or coalesce(a.profile_snapshot ->> 'name', p.full_name, '') ilike '%' || _q || '%'
           or j.designation ilike '%' || _q || '%'
           or coalesce(a.profile_snapshot ->> 'headline', p.professional_headline, '') ilike '%' || _q || '%'
           or exists (select 1 from jsonb_array_elements_text(coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb)) s where s ilike '%' || _q || '%'))
  )
  select coalesce(jsonb_object_agg(stage, c), '{}'::jsonb) into _counts
  from (select stage, count(*) c from base group by stage) s;

  select count(*) into _total from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id
    left join public.profiles p on p.id = a.candidate_id
    where j.tenant_id = _t and j.deleted_at is null
      and (p_job is null or a.job_id = p_job)
      and (p_stage is null or a.stage = p_stage)
      and (_q is null or coalesce(a.profile_snapshot ->> 'name', p.full_name, '') ilike '%' || _q || '%'
           or j.designation ilike '%' || _q || '%'
           or coalesce(a.profile_snapshot ->> 'headline', p.professional_headline, '') ilike '%' || _q || '%'
           or exists (select 1 from jsonb_array_elements_text(coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb)) s where s ilike '%' || _q || '%'));

  select coalesce(jsonb_agg(row_to_json(r)::jsonb order by r.sort_key desc), '[]'::jsonb) into _items from (
    select a.id, a.job_id, j.designation as job_title, a.candidate_id,
           coalesce(a.profile_snapshot ->> 'name', p.full_name, 'Candidate') as name,
           coalesce(a.profile_snapshot ->> 'headline', p.professional_headline) as headline,
           coalesce((a.profile_snapshot ->> 'experience_years')::numeric, p.years_of_experience) as experience_years,
           coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb) as skills,
           a.stage, a.match_score, a.cover_note, a.applied_at, a.stage_changed_at,
           floor(extract(epoch from (now() - a.stage_changed_at)) / 86400)::int as days_in_stage,
           p.iam_talento_id as talent_cir_id, p.profile_photo_url as photo_url,
           (p.verification_status = 'verified') as verified,
           case coalesce(p_sort, 'recent') when 'match' then coalesce(a.match_score, 0)
                else extract(epoch from a.applied_at) end as sort_key
    from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id
    left join public.profiles p on p.id = a.candidate_id
    where j.tenant_id = _t and j.deleted_at is null
      and (p_job is null or a.job_id = p_job)
      and (p_stage is null or a.stage = p_stage)
      and (_q is null or coalesce(a.profile_snapshot ->> 'name', p.full_name, '') ilike '%' || _q || '%'
           or j.designation ilike '%' || _q || '%'
           or coalesce(a.profile_snapshot ->> 'headline', p.professional_headline, '') ilike '%' || _q || '%'
           or exists (select 1 from jsonb_array_elements_text(coalesce(a.profile_snapshot -> 'skills', '[]'::jsonb)) s where s ilike '%' || _q || '%'))
    order by sort_key desc
    limit least(greatest(coalesce(p_limit, 100), 1), 200) offset greatest(coalesce(p_offset, 0), 0)
  ) r;

  return jsonb_build_object('total', _total, 'counts', _counts, 'items', _items);
end $$;
revoke all on function public.list_employer_applications(uuid, text, text, int, int, text) from public, anon;
grant execute on function public.list_employer_applications(uuid, text, text, int, int, text) to authenticated;

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

-- Private recruiter note.
create or replace function public.save_application_note(p_app uuid, p_note text)
returns boolean
language plpgsql security definer set search_path = public as $$
declare _job uuid;
begin
  select job_id into _job from public.job_applications where id = p_app;
  if _job is null then raise exception 'Application not found' using errcode = 'P0002'; end if;
  if not public.has_tenant_permission((select tenant_id from public.employer_job_openings where id = _job), 'app.note') then
    raise exception 'Unauthorized: app.note permission required' using errcode = '42501';
  end if;
  if length(coalesce(p_note, '')) > 5000 then raise exception 'Note is too long' using errcode = '22023'; end if;
  update public.job_applications set recruiter_note = nullif(trim(p_note), '') where id = p_app;
  return true;
end $$;
revoke all on function public.save_application_note(uuid, text) from public, anon;
grant execute on function public.save_application_note(uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- 4. Employer settings (follow-up thresholds, notification preferences)
-- ---------------------------------------------------------------------
create table if not exists public.employer_settings (
  tenant_id uuid primary key references public.tenant_organizations(id) on delete cascade,
  followups_enabled boolean not null default true,
  followup_pending_days int not null default 2 check (followup_pending_days between 1 and 30),
  followup_shortlist_days int not null default 3 check (followup_shortlist_days between 1 and 30),
  followup_hold_days int not null default 7 check (followup_hold_days between 1 and 60),
  followup_interview_grace_hours int not null default 24 check (followup_interview_grace_hours between 1 and 168),
  notify_prefs jsonb not null default '{"email": true, "applications": true, "followups": true, "weekly_digest": false}'::jsonb,
  privacy jsonb not null default '{"show_contact_public": false, "show_hiring_activity": true}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.employer_settings enable row level security;
create policy "Tenant members read employer settings" on public.employer_settings
  for select using (public.is_tenant_member(tenant_id));

create or replace function public.get_employer_settings()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _t uuid := public._my_tenant(); _s public.employer_settings;
begin
  insert into public.employer_settings (tenant_id) values (_t) on conflict (tenant_id) do nothing;
  select * into _s from public.employer_settings where tenant_id = _t;
  return to_jsonb(_s);
end $$;
revoke all on function public.get_employer_settings() from public, anon;
grant execute on function public.get_employer_settings() to authenticated;

create or replace function public.save_employer_settings(p jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _t uuid := public._my_tenant('company.edit'); _s public.employer_settings;
begin
  insert into public.employer_settings (tenant_id) values (_t) on conflict (tenant_id) do nothing;
  update public.employer_settings set
    followups_enabled = coalesce((p ->> 'followups_enabled')::boolean, followups_enabled),
    followup_pending_days = coalesce((p ->> 'followup_pending_days')::int, followup_pending_days),
    followup_shortlist_days = coalesce((p ->> 'followup_shortlist_days')::int, followup_shortlist_days),
    followup_hold_days = coalesce((p ->> 'followup_hold_days')::int, followup_hold_days),
    followup_interview_grace_hours = coalesce((p ->> 'followup_interview_grace_hours')::int, followup_interview_grace_hours),
    notify_prefs = case when p ? 'notify_prefs' then notify_prefs || (p -> 'notify_prefs') else notify_prefs end,
    privacy = case when p ? 'privacy' then privacy || (p -> 'privacy') else privacy end,
    updated_at = now()
  where tenant_id = _t returning * into _s;
  insert into public.audit_log (actor_id, tenant_id, action, entity, entity_id, meta)
  values (auth.uid(), _t, 'settings.update', 'employer_settings', _t::text, '{}'::jsonb);
  return to_jsonb(_s);
end $$;
revoke all on function public.save_employer_settings(jsonb) from public, anon;
grant execute on function public.save_employer_settings(jsonb) to authenticated;

-- ---------------------------------------------------------------------
-- 5. Follow-up generator (time-based, no AI call needed for the triggers)
-- ---------------------------------------------------------------------
create or replace function public.generate_employer_followups()
returns int
language plpgsql security definer set search_path = public as $$
declare r record; _recipient uuid; _created int := 0; _rc int; _title text; _body text; _action text; _key text;
begin
  for r in
    select a.id app_id, a.stage, a.stage_changed_at, j.designation, j.user_id job_owner, j.tenant_id,
           coalesce(a.profile_snapshot ->> 'name', 'A candidate') cname,
           floor(extract(epoch from (now() - a.stage_changed_at)) / 86400)::int days,
           coalesce(s.notify_prefs ->> 'followups', 'true') = 'true' wants
    from public.job_applications a
    join public.employer_job_openings j on j.id = a.job_id and j.deleted_at is null
    left join public.employer_settings s on s.tenant_id = j.tenant_id
    where a.stage in ('Applied', 'Shortlisted', 'On Hold') and coalesce(s.followups_enabled, true)
      and ((a.stage = 'Applied' and a.stage_changed_at <= now() - make_interval(days => coalesce(s.followup_pending_days, 2)))
        or (a.stage = 'Shortlisted' and a.stage_changed_at <= now() - make_interval(days => coalesce(s.followup_shortlist_days, 3)))
        or (a.stage = 'On Hold' and a.stage_changed_at <= now() - make_interval(days => coalesce(s.followup_hold_days, 7))))
  loop
    continue when not r.wants;
    _recipient := case when exists (select 1 from public.tenant_memberships m where m.tenant_id = r.tenant_id and m.user_id = r.job_owner)
                       then r.job_owner
                       else (select t.owner_user_id from public.tenant_organizations t where t.id = r.tenant_id) end;
    continue when _recipient is null;

    if r.stage = 'Applied' then
      _title := 'Application pending for ' || r.days || ' days';
      _body := r.cname || ' applied for ' || r.designation || ' and has not been reviewed.';
      _action := 'Review the profile, then shortlist, hold or reject so the candidate is not left waiting.';
    elsif r.stage = 'Shortlisted' then
      _title := 'Shortlisted candidate waiting ' || r.days || ' days';
      _body := r.cname || ' was shortlisted for ' || r.designation || ' with no further action.';
      _action := 'Schedule an interview or move the candidate to the next stage.';
    else
      _title := 'Candidate on hold for ' || r.days || ' days';
      _body := r.cname || ' (' || r.designation || ') is still on hold.';
      _action := 'Make a decision: release the hold, or close the application.';
    end if;
    _key := lower(replace(r.stage, ' ', '_')) || ':' || r.app_id::text || ':' || extract(epoch from r.stage_changed_at)::bigint;

    insert into public.notifications (user_id, kind, title, body, link, data)
    values (_recipient, 'employer_followup', _title, _body || ' ' || _action,
            '/talento-pro?view=pipe&application=' || r.app_id::text,
            jsonb_build_object('application_id', r.app_id, 'stage', r.stage, 'days', r.days,
                               'suggested_action', _action, 'dedupe_key', _key))
    on conflict do nothing;
    get diagnostics _rc = row_count;
    _created := _created + _rc;
  end loop;

  -- Interviews that took place but were never updated.
  for r in
    select i.id iid, i.application_id, j.designation, j.user_id job_owner, j.tenant_id, i.scheduled_at,
           coalesce(a.profile_snapshot ->> 'name', 'A candidate') cname,
           coalesce(s.notify_prefs ->> 'followups', 'true') = 'true' wants
    from public.scheduled_interviews i
    join public.job_applications a on a.id = i.application_id
    join public.employer_job_openings j on j.id = i.job_id and j.deleted_at is null
    left join public.employer_settings s on s.tenant_id = j.tenant_id
    where i.status = 'scheduled' and coalesce(s.followups_enabled, true)
      and i.scheduled_at <= now() - make_interval(hours => coalesce(s.followup_interview_grace_hours, 24))
  loop
    continue when not r.wants;
    _recipient := coalesce(r.job_owner, (select t.owner_user_id from public.tenant_organizations t where t.id = r.tenant_id));
    continue when _recipient is null;
    insert into public.notifications (user_id, kind, title, body, link, data)
    values (_recipient, 'employer_followup', 'Interview outcome not recorded',
            'The interview with ' || r.cname || ' for ' || r.designation || ' has passed. Record the outcome and next step.',
            '/talento-pro?view=pipe&application=' || r.application_id::text,
            jsonb_build_object('application_id', r.application_id, 'interview_id', r.iid,
                               'suggested_action', 'Record the outcome, then move the candidate forward or reject.',
                               'dedupe_key', 'interview:' || r.iid::text))
    on conflict do nothing;
    get diagnostics _rc = row_count;
    _created := _created + _rc;
  end loop;
  return _created;
end $$;
revoke all on function public.generate_employer_followups() from public, anon, authenticated;
grant execute on function public.generate_employer_followups() to service_role;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    begin perform cron.unschedule('employer-followups'); exception when others then null; end;
    perform cron.schedule('employer-followups', '*/30 * * * *', 'select public.generate_employer_followups();');
  end if;
exception when undefined_table or undefined_function then null;
end $$;

-- Notification actions for the employer notification centre.
create or replace function public.mark_notification_acted(p_id uuid)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  update public.notifications set acted_at = coalesce(acted_at, now()), read_at = coalesce(read_at, now())
  where id = p_id and user_id = auth.uid();
  return found;
end $$;
revoke all on function public.mark_notification_acted(uuid) from public, anon;
grant execute on function public.mark_notification_acted(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 6. Publishing gate: company profile must be complete
-- ---------------------------------------------------------------------
create or replace function public.employer_publish_readiness(p_tenant uuid default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _t uuid := coalesce(p_tenant, public._my_tenant()); _e public.employers; _missing text[] := '{}';
begin
  select * into _e from public.employers where tenant_id = _t;
  if _e.id is null then return jsonb_build_object('ready', false, 'completion', 0, 'missing', jsonb_build_array('Company profile')); end if;
  if coalesce(trim(_e.company_name), '') = '' then _missing := array_append(_missing, 'Company name'); end if;
  if coalesce(trim(_e.industry), '') = '' then _missing := array_append(_missing, 'Industry'); end if;
  if length(coalesce(trim(_e.description), '')) < 30 then _missing := array_append(_missing, 'Company description (at least 30 characters)'); end if;
  if coalesce(trim(_e.num_employees), '') = '' then _missing := array_append(_missing, 'Company size'); end if;
  if coalesce(nullif(trim(_e.hq_city), ''), nullif(trim(_e.address), '')) is null then _missing := array_append(_missing, 'Headquarters or address'); end if;
  if coalesce(trim(_e.official_email), '') = '' then _missing := array_append(_missing, 'Primary contact email'); end if;
  return jsonb_build_object('ready', cardinality(_missing) = 0, 'completion', coalesce(_e.profile_completion, 0), 'missing', to_jsonb(_missing));
end $$;
revoke all on function public.employer_publish_readiness(uuid) from public, anon;
grant execute on function public.employer_publish_readiness(uuid) to authenticated;

-- Drafts stay free-form; leaving draft requires a complete company profile.
create or replace function public.jobs_require_complete_profile()
returns trigger language plpgsql security definer set search_path = public as $$
declare _r jsonb;
begin
  if auth.uid() is null or public.is_admin() or coalesce(new.is_demo, false) then return new; end if;
  if new.status in ('active', 'open', 'pending_review')
     and (tg_op = 'INSERT' or old.status in ('draft')) then
    _r := public.employer_publish_readiness(new.tenant_id);
    if not coalesce((_r ->> 'ready')::boolean, false) then
      raise exception 'Complete your company profile before publishing. Missing: %',
        (select string_agg(x, ', ') from jsonb_array_elements_text(_r -> 'missing') x) using errcode = 'P0403';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists jobs_require_complete_profile_trg on public.employer_job_openings;
create trigger jobs_require_complete_profile_trg before insert or update of status on public.employer_job_openings
  for each row execute function public.jobs_require_complete_profile();

-- ---------------------------------------------------------------------
-- 7. Company profile: alternate emails / phones
-- ---------------------------------------------------------------------
alter table public.employers
  add column if not exists alt_emails text[] not null default '{}',
  add column if not exists alt_phones text[] not null default '{}',
  add column if not exists company_category text;
alter table public.employers drop constraint if exists chk_employers_alt_contacts;
alter table public.employers add constraint chk_employers_alt_contacts
  check (cardinality(alt_emails) <= 10 and cardinality(alt_phones) <= 10);

do $$ begin
  if not exists (select 1 from pg_proc where proname = '_get_employer_profile_v1') then
    alter function public.get_employer_profile() rename to _get_employer_profile_v1;
    alter function public.save_employer_profile(jsonb) rename to _save_employer_profile_v1;
    alter function public.get_public_company(text) rename to _get_public_company_v1;
  end if;
end $$;
revoke all on function public._get_employer_profile_v1() from public, anon, authenticated;
revoke all on function public._save_employer_profile_v1(jsonb) from public, anon, authenticated;
revoke all on function public._get_public_company_v1(text) from public, anon, authenticated;

create or replace function public.get_employer_profile()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _base jsonb := public._get_employer_profile_v1(); _e public.employers;
begin
  if _base is null then return null; end if;
  select * into _e from public.employers where id = (_base ->> 'id')::uuid;
  return _base || jsonb_build_object('alt_emails', to_jsonb(_e.alt_emails), 'alt_phones', to_jsonb(_e.alt_phones),
                                     'company_category', _e.company_category);
end $$;
revoke all on function public.get_employer_profile() from public, anon;
grant execute on function public.get_employer_profile() to authenticated;

create or replace function public.save_employer_profile(p jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _emails text[]; _phones text[]; _x text; _t uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if p ? 'alt_emails' then
    select coalesce(array_agg(distinct lower(trim(x))), '{}') into _emails from jsonb_array_elements_text(p -> 'alt_emails') x where trim(x) <> '';
    foreach _x in array _emails loop
      if _x !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Invalid email address: %', _x using errcode = '22023'; end if;
    end loop;
    if cardinality(_emails) > 10 then raise exception 'At most 10 alternate emails' using errcode = '22023'; end if;
  end if;
  if p ? 'alt_phones' then
    select coalesce(array_agg(distinct trim(x)), '{}') into _phones from jsonb_array_elements_text(p -> 'alt_phones') x where trim(x) <> '';
    foreach _x in array _phones loop
      if _x !~ '^\+?[0-9][0-9 ()-]{6,18}$' then raise exception 'Invalid phone number: %', _x using errcode = '22023'; end if;
    end loop;
    if cardinality(_phones) > 10 then raise exception 'At most 10 alternate phone numbers' using errcode = '22023'; end if;
  end if;

  perform public._save_employer_profile_v1(p - 'alt_emails' - 'alt_phones' - 'company_category');

  _t := public._my_tenant();
  update public.employers set
    alt_emails = case when p ? 'alt_emails' then _emails else alt_emails end,
    alt_phones = case when p ? 'alt_phones' then _phones else alt_phones end,
    company_category = case when p ? 'company_category' then nullif(trim(p ->> 'company_category'), '') else company_category end
  where tenant_id = _t;
  return public.get_employer_profile();
end $$;
revoke all on function public.save_employer_profile(jsonb) from public, anon;
grant execute on function public.save_employer_profile(jsonb) to authenticated;

create or replace function public.get_public_company(p_slug text)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _base jsonb := public._get_public_company_v1(p_slug); _e public.employers; _pub boolean; _show_jobs boolean;
begin
  if _base is null then return null; end if;
  select * into _e from public.employers where id = (_base ->> 'id')::uuid;
select coalesce((s.privacy ->> 'show_contact_public')::boolean, false), coalesce((s.privacy ->> 'show_hiring_activity')::boolean, true)    into _pub, _show_jobs from public.employer_settings s where s.tenant_id = _e.tenant_id;
  return _base || jsonb_build_object(
    'company_type', _e.company_type, 'category', _e.company_category,
    'active_jobs_count', case when coalesce(_show_jobs, true) then _base -> 'active_jobs_count' else null end,
    'contact', case when coalesce(_pub, false)
      then jsonb_build_object('email', _e.official_email, 'phone', _e.phone, 'alt_emails', to_jsonb(_e.alt_emails), 'alt_phones', to_jsonb(_e.alt_phones))
      else null end,
    'locations', to_jsonb(coalesce(_e.multiple_locations, '{}'::text[])));
end $$;
revoke all on function public.get_public_company(text) from public;
grant execute on function public.get_public_company(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 8. Overview (real metrics, no SLA) and activity history
-- ---------------------------------------------------------------------
create or replace function public.employer_overview()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _t uuid := public._my_tenant(); _jobs jsonb; _apps jsonb; _recent jsonb; _perf jsonb; _wallet numeric; _unread int;
begin
  select jsonb_build_object(
    'total', count(*) filter (where deleted_at is null),
    'active', count(*) filter (where deleted_at is null and status in ('active', 'open')),
    'draft', count(*) filter (where deleted_at is null and status = 'draft'),
    'paused', count(*) filter (where deleted_at is null and status = 'paused'),
    'pending_review', count(*) filter (where deleted_at is null and status = 'pending_review'),
    'closed', count(*) filter (where deleted_at is null and (status in ('closed', 'expired') or (closes_at < now() and status = 'active')))
  ) into _jobs from public.employer_job_openings where tenant_id = _t;

  select jsonb_build_object(
    'total', count(*),
    'pending', count(*) filter (where a.stage = 'Applied'),
    'shortlisted', count(*) filter (where a.stage = 'Shortlisted'),
    'interview', count(*) filter (where a.stage = 'Interview'),
    'on_hold', count(*) filter (where a.stage = 'On Hold'),
    'selected', count(*) filter (where a.stage = 'Offer'),
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
      and action in ('save_employer_profile', 'job.create', 'job.update', 'job.publish', 'job.pause', 'job.resume', 'job.close',
                     'job.duplicate', 'job.delete', 'application.stage_change', 'talent.unlock', 'cir.unlock', 'settings.update')
    order by id desc limit least(greatest(coalesce(p_limit, 30), 1), 100) offset greatest(coalesce(p_offset, 0), 0)) a
  left join public.profiles p on p.id = a.actor_id;
  return _rows;
end $$;
revoke all on function public.list_employer_activity(int, int) from public, anon;
grant execute on function public.list_employer_activity(int, int) to authenticated;

-- ---------------------------------------------------------------------
-- 9. Find Talent: packages, tenant wallet, entitlements
-- ---------------------------------------------------------------------
create table if not exists public.talent_packages (
  key text primary key,
  name text not null,
  description text not null,
  price_inr numeric not null check (price_inr >= 0),
  scope text not null check (scope in ('per_profile', 'subscription')),
  verified_only boolean not null default true,
  grants_cv boolean not null default false,
  grants_cir boolean not null default false,
  duration_days int,
  sort_order int not null default 0,
  is_active boolean not null default true
);
alter table public.talent_packages enable row level security;
create policy "Anyone signed in reads talent packages" on public.talent_packages for select to authenticated using (is_active);

insert into public.talent_packages (key, name, description, price_inr, scope, verified_only, grants_cv, grants_cir, duration_days, sort_order) values
  ('unverified_profile', 'Candidate profile', 'Unlock the full profile and contact details of one unverified candidate.', 99, 'per_profile', false, false, false, null, 1),
  ('verified_profile', 'Verified profile access', 'Full verified profile, score report with skill breakdown, CIR report, CV and contact details of one verified candidate.', 2999, 'per_profile', true, true, true, null, 2),
  ('verified_monthly', 'Verified subscription', 'Unlimited verified candidate profiles, CV downloads and CIR reports for 30 days.', 2499, 'subscription', true, true, true, 30, 3)
on conflict (key) do nothing;

create table if not exists public.talent_access_grants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_organizations(id) on delete cascade,
  candidate_id uuid references public.profiles(id) on delete cascade,
  package_key text not null references public.talent_packages(key),
  verified_only boolean not null,
  grants_cv boolean not null,
  grants_cir boolean not null,
  amount numeric not null,
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists talent_grants_tenant_idx on public.talent_access_grants(tenant_id, candidate_id);
alter table public.talent_access_grants enable row level security;
create policy "Tenant members read talent grants" on public.talent_access_grants
  for select using (public.is_tenant_member(tenant_id));

create table if not exists public.talent_access_log (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenant_organizations(id) on delete cascade,
  candidate_id uuid not null,
  actor_id uuid,
  kind text not null check (kind in ('profile', 'cv', 'cir')),
  created_at timestamptz not null default now()
);
alter table public.talent_access_log enable row level security;
create policy "Tenant members read talent access log" on public.talent_access_log
  for select using (public.is_tenant_member(tenant_id));

-- Entitlement of one tenant over one candidate.
create or replace function public._talent_access(p_tenant uuid, p_candidate uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _verified boolean; _applicant boolean; _profile boolean := false; _cv boolean := false; _cir boolean := false; _via text := 'none'; g record;
begin
  select (verification_status = 'verified') into _verified from public.profiles where id = p_candidate;
  select exists (select 1 from public.job_applications a join public.employer_job_openings j on j.id = a.job_id
                 where a.candidate_id = p_candidate and j.tenant_id = p_tenant and a.stage <> 'Withdrawn') into _applicant;
  if _applicant then _profile := true; _cv := true; _via := 'applicant'; end if;
  for g in select * from public.talent_access_grants
           where tenant_id = p_tenant and (candidate_id = p_candidate or candidate_id is null)
             and (expires_at is null or expires_at > now())
             and (not verified_only or coalesce(_verified, false)) loop
    _profile := true; _cv := _cv or g.grants_cv; _cir := _cir or g.grants_cir;
    if _via in ('none', 'applicant') then _via := case when g.candidate_id is null then 'subscription' else 'purchase' end; end if;
  end loop;
  return jsonb_build_object('profile', _profile, 'cv', _cv, 'cir', _cir, 'via', _via, 'verified', coalesce(_verified, false), 'applicant', _applicant);
end $$;
revoke all on function public._talent_access(uuid, uuid) from public, anon;
grant execute on function public._talent_access(uuid, uuid) to authenticated;

create or replace function public.get_employer_wallet()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _t uuid := public._my_tenant(); _w public.wallet_accounts; _ledger jsonb;
begin
  if not (public.has_tenant_permission(_t, 'billing.view') or public.has_tenant_permission(_t, 'talent.search')) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  insert into public.wallet_accounts (owner_type, tenant_id) values ('tenant', _t) on conflict (tenant_id) where owner_type = 'tenant' do nothing;
  select * into _w from public.wallet_accounts where owner_type = 'tenant' and tenant_id = _t;
  select coalesce(jsonb_agg(jsonb_build_object('id', l.id, 'type', l.entry_type, 'amount', l.amount, 'balance_after', l.balance_after,
           'reason', l.reason, 'at', l.created_at) order by l.id desc), '[]'::jsonb)
  into _ledger from (select * from public.wallet_ledger_entries where wallet_id = _w.id order by id desc limit 20) l;
  return jsonb_build_object('wallet_id', _w.id, 'balance', _w.balance, 'currency', _w.currency, 'ledger', _ledger);
end $$;
revoke all on function public.get_employer_wallet() from public, anon;
grant execute on function public.get_employer_wallet() to authenticated;

create or replace function public.get_talent_overview()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _t uuid := public._my_tenant('talent.search'); _wallet jsonb := public.get_employer_wallet(); _sub jsonb; _pk jsonb;
begin
  select to_jsonb(g) into _sub from (
    select package_key, expires_at from public.talent_access_grants
    where tenant_id = _t and candidate_id is null and expires_at > now() order by expires_at desc limit 1) g;
  select coalesce(jsonb_agg(to_jsonb(p) order by p.sort_order), '[]'::jsonb) into _pk from public.talent_packages p where p.is_active;
  return jsonb_build_object('wallet', _wallet, 'subscription', _sub, 'packages', _pk,
    'unlocked_count', (select count(distinct candidate_id) from public.talent_access_grants where tenant_id = _t and candidate_id is not null),
    'can_unlock', public.has_tenant_permission(_t, 'talent.unlock'));
end $$;
revoke all on function public.get_talent_overview() from public, anon;
grant execute on function public.get_talent_overview() to authenticated;

-- Limited public overview of candidates. Contact details, links, resume, CIR and the
-- Talent CIR ID are never returned here.
create or replace function public.search_candidates(
  p_query text default null, p_verified boolean default null, p_skill text default null,
  p_min_exp int default null, p_limit int default 24, p_offset int default 0)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _t uuid := public._my_tenant('talent.search'); _q text := nullif(trim(coalesce(p_query, '')), ''); _s text := nullif(trim(coalesce(p_skill, '')), ''); _total int; _items jsonb;
begin
  select count(*) into _total from public.profiles p
  where p.profile_visibility = 'public' and p.onboarding_completed and p.deletion_requested_at is null
    and (p_verified is null or (p.verification_status = 'verified') = p_verified)
    and (p_min_exp is null or coalesce(p.years_of_experience, 0) >= p_min_exp)
    and (_q is null or p.professional_headline ilike '%' || _q || '%' or p.job_role ilike '%' || _q || '%' or p.city ilike '%' || _q || '%')
    and (_s is null or exists (select 1 from public.skills s where s.user_id = p.id and s.skill_name ilike '%' || _s || '%'));

  select coalesce(jsonb_agg(to_jsonb(r) order by r.verified desc, r.years_of_experience desc nulls last), '[]'::jsonb) into _items from (
    select p.id,
           split_part(coalesce(p.full_name, 'Candidate'), ' ', 1) ||
             case when position(' ' in coalesce(p.full_name, '')) > 0 then ' ' || left(split_part(p.full_name, ' ', 2), 1) || '.' else '' end as display_name,
           p.profile_photo_url as photo_url, p.professional_headline as headline, p.job_role, p.city,
           p.years_of_experience, (p.verification_status = 'verified') as verified,
           case when p.open_to_work then coalesce(p.availability_status, 'Open to work') else 'Not actively looking' end as status,
           coalesce((select jsonb_agg(s.skill_name) from (select skill_name from public.skills where user_id = p.id order by is_verified desc, created_at limit 8) s), '[]'::jsonb) as skills,
           (select e.degree || coalesce(' in ' || e.field_of_study, '') from public.educations e where e.user_id = p.id order by e.end_year desc nulls first limit 1) as education,
           coalesce((public._talent_access(_t, p.id) ->> 'profile')::boolean, false) as unlocked
    from public.profiles p
    where p.profile_visibility = 'public' and p.onboarding_completed and p.deletion_requested_at is null
      and (p_verified is null or (p.verification_status = 'verified') = p_verified)
      and (p_min_exp is null or coalesce(p.years_of_experience, 0) >= p_min_exp)
      and (_q is null or p.professional_headline ilike '%' || _q || '%' or p.job_role ilike '%' || _q || '%' or p.city ilike '%' || _q || '%')
      and (_s is null or exists (select 1 from public.skills s where s.user_id = p.id and s.skill_name ilike '%' || _s || '%'))
    order by (p.verification_status = 'verified') desc, p.years_of_experience desc nulls last
    limit least(greatest(coalesce(p_limit, 24), 1), 60) offset greatest(coalesce(p_offset, 0), 0)) r;

  return jsonb_build_object('total', _total, 'items', _items);
end $$;
revoke all on function public.search_candidates(text, boolean, text, int, int, int) from public, anon;
grant execute on function public.search_candidates(text, boolean, text, int, int, int) to authenticated;

-- Buy a package from the employer wallet. Idempotent per candidate/active subscription.
create or replace function public.purchase_talent_package(p_package text, p_candidate uuid default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _t uuid := public._my_tenant('talent.unlock'); _pk public.talent_packages; _w public.wallet_accounts; _verified boolean; _grant public.talent_access_grants; _bal numeric;
begin
  select * into _pk from public.talent_packages where key = p_package and is_active;
  if not found then raise exception 'Package not found' using errcode = 'P0002'; end if;
  if _pk.scope = 'per_profile' and p_candidate is null then raise exception 'Select a candidate to unlock' using errcode = '22023'; end if;
  if _pk.scope = 'subscription' then p_candidate := null; end if;

  if p_candidate is not null then
    select (verification_status = 'verified') into _verified from public.profiles where id = p_candidate and deletion_requested_at is null;
    if _verified is null then raise exception 'Candidate not found' using errcode = 'P0002'; end if;
    if _pk.verified_only and not _verified then raise exception 'This package is only for verified candidates' using errcode = '22023'; end if;
    if not _pk.verified_only and _verified then raise exception 'Use the verified package for verified candidates' using errcode = '22023'; end if;
  end if;

  insert into public.wallet_accounts (owner_type, tenant_id) values ('tenant', _t) on conflict (tenant_id) where owner_type = 'tenant' do nothing;
  select * into _w from public.wallet_accounts where owner_type = 'tenant' and tenant_id = _t for update;  -- serialises concurrent purchases

  select * into _grant from public.talent_access_grants
  where tenant_id = _t and package_key = _pk.key and candidate_id is not distinct from p_candidate and (expires_at is null or expires_at > now())
  order by created_at desc limit 1;
  if found then return jsonb_build_object('granted', true, 'already_owned', true, 'grant_id', _grant.id, 'balance', _w.balance); end if;

  if _w.balance - _w.locked_balance < _pk.price_inr then
    raise exception 'Insufficient wallet balance. Recharge at least % more.', (_pk.price_inr - (_w.balance - _w.locked_balance)) using errcode = 'P0402';
  end if;

  perform public.wallet_transfer(_w.id, public._platform_wallet('platform_revenue'), _pk.price_inr, _pk.name,
    'talent_package', _pk.key || ':' || coalesce(p_candidate::text, 'subscription'),
    'talent-' || _t::text || '-' || _pk.key || '-' || coalesce(p_candidate::text, 'sub') || '-' || extract(epoch from now())::bigint);

  insert into public.talent_access_grants (tenant_id, candidate_id, package_key, verified_only, grants_cv, grants_cir, amount, expires_at, created_by)
  values (_t, p_candidate, _pk.key, _pk.verified_only, _pk.grants_cv, _pk.grants_cir, _pk.price_inr,
          case when _pk.duration_days is not null then now() + make_interval(days => _pk.duration_days) end, auth.uid())
  returning * into _grant;

  insert into public.audit_log (actor_id, tenant_id, action, entity, entity_id, meta)
  values (auth.uid(), _t, 'talent.unlock', 'talent_packages', _pk.key,
          jsonb_build_object('package', _pk.name, 'amount', _pk.price_inr, 'candidate_id', p_candidate));
  select balance into _bal from public.wallet_accounts where id = _w.id;
  return jsonb_build_object('granted', true, 'already_owned', false, 'grant_id', _grant.id, 'balance', _bal);
end $$;
revoke all on function public.purchase_talent_package(text, uuid) from public, anon;
grant execute on function public.purchase_talent_package(text, uuid) to authenticated;

-- Full candidate profile, gated by entitlement.
create or replace function public.get_candidate_profile_for_employer(p_candidate uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _t uuid := public._my_tenant('talent.search'); _access jsonb; _p public.profiles;
begin
  _access := public._talent_access(_t, p_candidate);
  if not (_access ->> 'profile')::boolean then
    raise exception 'Unlock this candidate to view the full profile' using errcode = 'P0402';
  end if;
  select * into _p from public.profiles where id = p_candidate and deletion_requested_at is null;
  if not found then raise exception 'Candidate not found' using errcode = 'P0002'; end if;
  insert into public.talent_access_log (tenant_id, candidate_id, actor_id, kind) values (_t, p_candidate, auth.uid(), 'profile');
  return jsonb_build_object(
    'access', _access,
    'profile', jsonb_build_object('id', _p.id, 'name', _p.full_name, 'email', _p.email, 'phone', _p.phone,
      'headline', _p.professional_headline, 'city', _p.city, 'state', _p.state, 'country', _p.country,
      'years_of_experience', _p.years_of_experience, 'about', _p.about_summary, 'photo_url', _p.profile_photo_url,
      'linkedin_url', _p.linkedin_url, 'github_url', _p.github_url, 'portfolio_url', _p.portfolio_url,
      'notice_period', _p.notice_period, 'preferred_locations', _p.preferred_locations,
      'verified', (_p.verification_status = 'verified'), 'talent_cir_id', _p.iam_talento_id,
      'resume_path', case when (_access ->> 'cv')::boolean then _p.resume_path end,
      'resume_url', case when (_access ->> 'cv')::boolean then _p.resume_url end),
    'skills', coalesce((select jsonb_agg(jsonb_build_object('name', s.skill_name, 'level', s.proficiency_level, 'verified', s.is_verified)) from public.skills s where s.user_id = p_candidate), '[]'::jsonb),
    'experience', coalesce((select jsonb_agg(jsonb_build_object('title', x.job_title, 'company', x.company_name, 'start', x.start_date, 'end', x.end_date, 'current', x.is_current, 'description', x.description) order by x.start_date desc) from public.experiences x where x.user_id = p_candidate), '[]'::jsonb),
    'education', coalesce((select jsonb_agg(jsonb_build_object('degree', e.degree, 'field', e.field_of_study, 'institution', e.institution_name, 'start', e.start_year, 'end', e.end_year) order by e.end_year desc nulls first) from public.educations e where e.user_id = p_candidate), '[]'::jsonb),
    'certifications', coalesce((select jsonb_agg(jsonb_build_object('name', c.name)) from public.certifications c where c.user_id = p_candidate), '[]'::jsonb));
end $$;
revoke all on function public.get_candidate_profile_for_employer(uuid) from public, anon;
grant execute on function public.get_candidate_profile_for_employer(uuid) to authenticated;

-- CIR report: only with a CIR entitlement. The free "employers read applicant CIR" policy is removed.
drop policy if exists "Employers read applicant CIR" on public.cir_reports;

create or replace function public.get_candidate_cir_report(p_candidate uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _t uuid := public._my_tenant('app.view'); _access jsonb; _r public.cir_reports; _p public.profiles;
begin
  _access := public._talent_access(_t, p_candidate);
  if not (_access ->> 'cir')::boolean then
    raise exception 'CIR report access is not unlocked for this candidate' using errcode = 'P0402';
  end if;
  select * into _r from public.cir_reports where user_id = p_candidate order by generated_at desc limit 1;
  if not found then raise exception 'This candidate has no CIR report yet' using errcode = 'P0002'; end if;
  select * into _p from public.profiles where id = p_candidate;
  insert into public.talent_access_log (tenant_id, candidate_id, actor_id, kind) values (_t, p_candidate, auth.uid(), 'cir');
  insert into public.audit_log (actor_id, tenant_id, action, entity, entity_id, meta)
  values (auth.uid(), _t, 'cir.unlock', 'cir_reports', _r.id::text, jsonb_build_object('candidate_id', p_candidate, 'name', _p.full_name));
  return jsonb_build_object('talent_cir_id', _p.iam_talento_id, 'candidate_name', _p.full_name,
    'composite_score', _r.composite_score, 'percentile', _r.percentile, 'tier', _r.tier, 'integrity_score', _r.integrity_score,
    'sections', _r.sections, 'version', _r.version, 'generated_at', _r.generated_at);
end $$;
revoke all on function public.get_candidate_cir_report(uuid) from public, anon;
grant execute on function public.get_candidate_cir_report(uuid) to authenticated;

-- CV: applicants' resumes remain readable (existing policy); unlocked talent needs a grant.
create or replace function public.can_employer_read_resume(p_owner uuid)
returns boolean
language plpgsql stable security definer set search_path = public as $$
declare _t uuid;
begin
  select e.tenant_id into _t from public.employers e where e.user_id = auth.uid() limit 1;
  if _t is null then
    select m.tenant_id into _t from public.tenant_memberships m where m.user_id = auth.uid() order by m.created_at limit 1;
  end if;
  if _t is null then return false; end if;
  return coalesce((public._talent_access(_t, p_owner) ->> 'cv')::boolean, false);
end $$;
revoke all on function public.can_employer_read_resume(uuid) from public, anon;
grant execute on function public.can_employer_read_resume(uuid) to authenticated;

drop policy if exists "resumes unlocked talent read" on storage.objects;
create policy "resumes unlocked talent read" on storage.objects for select using (
  bucket_id = 'resumes' and (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
  and public.can_employer_read_resume(((storage.foldername(name))[1])::uuid));

-- ---------------------------------------------------------------------
-- 10. Employer wallet top-up: credit the tenant wallet, not a personal one
-- ---------------------------------------------------------------------
create or replace function public._fulfill_order(p_order uuid, p_payment_id text)
returns void language plpgsql security definer set search_path = public as $$
declare _o public.payment_orders; _w uuid; _fy text; _tenant uuid;
begin
  select * into _o from public.payment_orders where id = p_order for update;
  if not found then raise exception 'Order not found'; end if;
  if _o.status in ('entitled', 'refunded') then return; end if;  -- a late payment for a cancelled order is still honoured

  _fy := case when extract(month from now()) >= 4
              then to_char(now(), 'YY') || to_char(now() + interval '1 year', 'YY')
              else to_char(now() - interval '1 year', 'YY') || to_char(now(), 'YY') end;

  if _o.item_type = 'wallet_topup' then
    select e.tenant_id into _tenant from public.employers e where e.user_id = _o.user_id and e.tenant_id is not null limit 1;
    if _tenant is not null then
      select id into _w from public.wallet_accounts where owner_type = 'tenant' and tenant_id = _tenant;
      if _w is null then
        insert into public.wallet_accounts (owner_type, tenant_id) values ('tenant', _tenant) returning id into _w;
      end if;
    else
      select id into _w from public.wallet_accounts where owner_type = 'candidate' and user_id = _o.user_id;
      if _w is null then
        insert into public.wallet_accounts (owner_type, user_id) values ('candidate', _o.user_id) returning id into _w;
      end if;
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
revoke execute on function public._fulfill_order(uuid, text) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 11. One stage-change path: the older RPC now delegates to change_application_stage
-- ---------------------------------------------------------------------
create or replace function public.update_application_stage(p_application uuid, p_stage text, p_note text default null)
returns public.job_applications
language plpgsql security definer set search_path = public as $$
declare _app public.job_applications;
begin
  perform public.change_application_stage(p_application, p_stage, p_note);
  if p_note is not null then
    update public.job_applications set recruiter_note = p_note where id = p_application;
  end if;
  select * into _app from public.job_applications where id = p_application;
  return _app;
end $$;

-- Internal helpers are only reachable through the definer RPCs above.
revoke execute on function public._my_tenant(text) from public, anon, authenticated;
revoke execute on function public._talent_access(uuid, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 12. Interviews
-- ---------------------------------------------------------------------
create or replace function public.schedule_interview(
  p_app uuid, p_at timestamptz, p_mode text default 'video', p_duration int default 45, p_url text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _a public.job_applications; _job public.employer_job_openings; _i public.scheduled_interviews;
begin
  select * into _a from public.job_applications where id = p_app for update;
  if not found then raise exception 'Application not found' using errcode = 'P0002'; end if;
  select * into _job from public.employer_job_openings where id = _a.job_id;
  if not public.has_tenant_permission(_job.tenant_id, 'interview.schedule') then
    raise exception 'Unauthorized: interview.schedule permission required' using errcode = '42501';
  end if;
  if _a.stage in ('Withdrawn', 'Rejected') then raise exception 'This application is closed' using errcode = '22023'; end if;
  if p_at is null or p_at < now() - interval '5 minutes' then raise exception 'Choose a future interview time' using errcode = '22023'; end if;
  if p_mode not in ('video', 'phone', 'onsite', 'ai') then raise exception 'Invalid interview mode' using errcode = '22023'; end if;
  if p_duration not between 10 and 480 then raise exception 'Duration must be 10 to 480 minutes' using errcode = '22023'; end if;
  if p_url is not null and p_url <> '' and p_url !~* '^https?://' then raise exception 'Meeting link must start with http(s)' using errcode = '22023'; end if;

  insert into public.scheduled_interviews (application_id, job_id, candidate_id, tenant_id, scheduled_at, duration_min, mode, meeting_url, created_by)
  values (p_app, _a.job_id, _a.candidate_id, _job.tenant_id, p_at, p_duration, p_mode, nullif(p_url, ''), auth.uid())
  returning * into _i;

  perform set_config('app.stage_note', 'Interview scheduled for ' || to_char(p_at at time zone 'UTC', 'DD Mon YYYY HH24:MI') || ' UTC', true);
  update public.job_applications set stage = 'Interview', interview_at = p_at, viewed_at = coalesce(viewed_at, now())
  where id = p_app and stage in ('Applied', 'Shortlisted', 'On Hold', 'Interview');
  update public.job_applications set interview_at = p_at where id = p_app;

  insert into public.audit_log (actor_id, tenant_id, action, entity, entity_id, meta)
  values (auth.uid(), _job.tenant_id, 'interview.schedule', 'scheduled_interviews', _i.id::text,
          jsonb_build_object('name', _a.profile_snapshot ->> 'name', 'job', _job.designation, 'at', p_at));
  perform public.push_notification(_a.candidate_id, 'interview', 'Interview scheduled: ' || _job.designation,
    'Your interview is on ' || to_char(p_at at time zone 'UTC', 'DD Mon YYYY HH24:MI') || ' UTC.', '/talento-pro?view=applied',
    jsonb_build_object('application_id', p_app, 'interview_id', _i.id));
  update public.notifications set acted_at = now()
  where kind = 'employer_followup' and acted_at is null and data ->> 'application_id' = p_app::text;
  return to_jsonb(_i);
end $$;
revoke all on function public.schedule_interview(uuid, timestamptz, text, int, text) from public, anon;
grant execute on function public.schedule_interview(uuid, timestamptz, text, int, text) to authenticated;

create or replace function public.update_interview_status(p_interview uuid, p_status text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _i public.scheduled_interviews;
begin
  if p_status not in ('completed', 'cancelled', 'no_show') then raise exception 'Invalid status' using errcode = '22023'; end if;
  select * into _i from public.scheduled_interviews where id = p_interview for update;
  if not found then raise exception 'Interview not found' using errcode = 'P0002'; end if;
  if not public.has_tenant_permission(_i.tenant_id, 'interview.schedule') then
    raise exception 'Unauthorized: interview.schedule permission required' using errcode = '42501';
  end if;
  update public.scheduled_interviews set status = p_status where id = p_interview returning * into _i;
  update public.notifications set acted_at = now()
  where kind = 'employer_followup' and acted_at is null and data ->> 'interview_id' = p_interview::text;
  return to_jsonb(_i);
end $$;
revoke all on function public.update_interview_status(uuid, text) from public, anon;
grant execute on function public.update_interview_status(uuid, text) to authenticated;

-- ---------------------------------------------------------------------
-- 13. Audit rows can only be written for a tenant the caller belongs to (the activity
--     history shown to employers must not be forgeable by other accounts).
-- ---------------------------------------------------------------------
create or replace function public.log_audit(
  p_tenant uuid, p_action text, p_entity text, p_entity_id text default null,
  p_meta jsonb default '{}'::jsonb, p_ip_hash text default null)
returns bigint
language plpgsql security definer set search_path = public as $$
declare _id bigint;
begin
  if p_tenant is not null and auth.uid() is not null and not (public.is_tenant_member(p_tenant) or public.is_admin()) then
    raise exception 'Unauthorized: not a member of this organization' using errcode = '42501';
  end if;
  insert into public.audit_log (actor_id, tenant_id, action, entity, entity_id, meta, ip_hash, at)
  values (auth.uid(), p_tenant, p_action, p_entity, p_entity_id, coalesce(p_meta, '{}'::jsonb), p_ip_hash, now())
  returning id into _id;
  return _id;
end $$;
