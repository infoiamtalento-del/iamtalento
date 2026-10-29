-- =====================================================================
-- Candidate features: profile save/load, portfolio, job search, alerts,
-- freelancing, support, analytics, public-function allow-list
-- =====================================================================

-- ---------------------------------------------------------------------
-- Profile save / load (single transactional call from the Pro shell)
-- ---------------------------------------------------------------------
create or replace function public._jsonb_text_array(p jsonb)
returns text[] language sql immutable as $$
  select coalesce(array(select left(btrim(x), 120) from jsonb_array_elements_text(
    case when jsonb_typeof(p) = 'array' then p else '[]'::jsonb end) x where btrim(x) <> '' limit 50), '{}')
$$;

create or replace function public.save_candidate_profile(p jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _pr jsonb := coalesce(p -> 'profile', '{}'::jsonb);
  _st jsonb;
  _n int; _skills int; _exp int; _edu int;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if octet_length(p::text) > 400000 then raise exception 'Profile payload is too large'; end if;
  perform public.rate_limit_hit('save_profile', 240, interval '1 hour');

  update public.profiles set
    full_name = case when _pr ? 'full_name' then left(btrim(_pr ->> 'full_name'), 200) else full_name end,
    phone = case when _pr ? 'phone' then left(nullif(btrim(_pr ->> 'phone'), ''), 30) else phone end,
    professional_headline = case when _pr ? 'headline' then left(_pr ->> 'headline', 300) else professional_headline end,
    about_summary = case when _pr ? 'about' then left(_pr ->> 'about', 5000) else about_summary end,
    city = case when _pr ? 'city' then left(_pr ->> 'city', 100) else city end,
    state = case when _pr ? 'state' then left(_pr ->> 'state', 100) else state end,
    country = case when _pr ? 'country' then left(_pr ->> 'country', 100) else country end,
    job_role = case when _pr ? 'job_role' then left(_pr ->> 'job_role', 150) else job_role end,
    company = case when _pr ? 'company' then left(_pr ->> 'company', 150) else company end,
    industry = case when _pr ? 'industry' then left(_pr ->> 'industry', 100) else industry end,
    years_of_experience = case when _pr ? 'years_of_experience' then least(greatest(coalesce((_pr ->> 'years_of_experience')::numeric, 0), 0), 60)::int else years_of_experience end,
    open_to_work = case when _pr ? 'open_to_work' then coalesce((_pr ->> 'open_to_work')::boolean, false) else open_to_work end,
    preferred_locations = case when _pr ? 'preferred_locations' then public._jsonb_text_array(_pr -> 'preferred_locations') else preferred_locations end,
    preferred_salary_range = case when _pr ? 'preferred_salary_range' then left(_pr ->> 'preferred_salary_range', 60) else preferred_salary_range end,
    notice_period = case when _pr ? 'notice_period' then left(_pr ->> 'notice_period', 60) else notice_period end,
    availability_status = case when _pr ? 'availability_status' then left(_pr ->> 'availability_status', 60) else availability_status end,
    linkedin_url = case when _pr ? 'linkedin_url' then nullif(_pr ->> 'linkedin_url', '') else linkedin_url end,
    github_url = case when _pr ? 'github_url' then nullif(_pr ->> 'github_url', '') else github_url end,
    portfolio_url = case when _pr ? 'portfolio_url' then nullif(_pr ->> 'portfolio_url', '') else portfolio_url end,
    profile_photo_url = case when _pr ? 'profile_photo_url' then nullif(_pr ->> 'profile_photo_url', '') else profile_photo_url end,
    resume_url = case when _pr ? 'resume_url' then nullif(_pr ->> 'resume_url', '') else resume_url end,
    resume_path = case when _pr ? 'resume_path' then nullif(_pr ->> 'resume_path', '') else resume_path end,
    portfolio_slug = case when _pr ? 'portfolio_slug' then nullif(lower(btrim(_pr ->> 'portfolio_slug')), '') else portfolio_slug end,
    profile_visibility = case when _pr ->> 'profile_visibility' in ('public', 'applied_only', 'private') then _pr ->> 'profile_visibility' else profile_visibility end,
    notification_prefs = case when jsonb_typeof(_pr -> 'notification_prefs') = 'object' then _pr -> 'notification_prefs' else notification_prefs end
  where id = _uid;

  if p ? 'skills' and jsonb_typeof(p -> 'skills') = 'array' then
    delete from public.skills s where s.user_id = _uid and lower(s.skill_name) not in (
      select lower(btrim(e ->> 'name')) from jsonb_array_elements(p -> 'skills') e where btrim(coalesce(e ->> 'name', '')) <> '');
    insert into public.skills (user_id, skill_name, category, proficiency_level, years_of_experience)
    select distinct on (lower(btrim(e ->> 'name'))) _uid, left(btrim(e ->> 'name'), 80),
      case when lower(e ->> 'category') in ('technical', 'behavioral', 'management') then lower(e ->> 'category') end,
      case when lower(e ->> 'level') in ('beginner', 'intermediate', 'advanced', 'expert') then lower(e ->> 'level') end,
      least(greatest(coalesce(nullif(e ->> 'years', '')::numeric, 0), 0), 60)::int
    from jsonb_array_elements(p -> 'skills') e where btrim(coalesce(e ->> 'name', '')) <> '' limit 100
    on conflict (user_id, lower(skill_name)) do update set category = excluded.category,
      proficiency_level = excluded.proficiency_level, years_of_experience = excluded.years_of_experience;
  end if;

  if p ? 'experiences' and jsonb_typeof(p -> 'experiences') = 'array' then
    delete from public.experiences where user_id = _uid;
    insert into public.experiences (user_id, job_title, company_name, start_date, end_date, is_current, description)
    select _uid, left(btrim(e ->> 'title'), 150), left(coalesce(nullif(btrim(e ->> 'company'), ''), 'Company'), 150),
      public.safe_date(e ->> 'start'), public.safe_date(e ->> 'end'),
      (coalesce(lower(e ->> 'end'), '') in ('', 'present', 'current', 'now')), left(e ->> 'description', 4000)
    from jsonb_array_elements(p -> 'experiences') e where btrim(coalesce(e ->> 'title', '')) <> '' limit 50;
  end if;

  if p ? 'educations' and jsonb_typeof(p -> 'educations') = 'array' then
    delete from public.educations where user_id = _uid;
    insert into public.educations (user_id, degree, institution_name, end_year)
    select _uid, left(coalesce(nullif(btrim(e ->> 'degree'), ''), 'Degree'), 150), left(btrim(e ->> 'institution'), 200),
      case when e ->> 'year' ~ '^\d{4}$' then (e ->> 'year')::int end
    from jsonb_array_elements(p -> 'educations') e where btrim(coalesce(e ->> 'institution', '')) <> '' limit 20;
  end if;

  if p ? 'certifications' and jsonb_typeof(p -> 'certifications') = 'array' then
    delete from public.certifications c where c.user_id = _uid and lower(c.name) not in (
      select lower(left(btrim(x), 200)) from jsonb_array_elements_text(p -> 'certifications') x where btrim(x) <> '');
    insert into public.certifications (user_id, name)
    select distinct on (lower(left(btrim(x), 200))) _uid, left(btrim(x), 200)
    from jsonb_array_elements_text(p -> 'certifications') x where btrim(x) <> '' limit 50
    on conflict (user_id, lower(name)) do nothing;
  end if;

  if p ? 'projects' and jsonb_typeof(p -> 'projects') = 'array' then
    delete from public.projects where user_id = _uid;
    insert into public.projects (user_id, title, description, project_url, tools_technologies, impact)
    select _uid, left(btrim(e ->> 'title'), 200), left(e ->> 'description', 3000),
      case when e ->> 'url' ~* '^https?://' then e ->> 'url' end,
      coalesce(array(select left(btrim(t), 60) from unnest(string_to_array(coalesce(e ->> 'tools', ''), ',')) t where btrim(t) <> '' limit 20), '{}'),
      left(e ->> 'impact', 1000)
    from jsonb_array_elements(p -> 'projects') e where btrim(coalesce(e ->> 'title', '')) <> '' limit 30;
  end if;

  if p ? 'languages' and jsonb_typeof(p -> 'languages') = 'array' then
    delete from public.accomplishments where user_id = _uid and type = 'language';
    insert into public.accomplishments (user_id, type, title, description)
    select _uid, 'language', left(btrim(e ->> 'name'), 80), left(e ->> 'level', 60)
    from jsonb_array_elements(p -> 'languages') e where btrim(coalesce(e ->> 'name', '')) <> '' limit 20;
  end if;

  if jsonb_typeof(p -> 'shell_state') = 'object' then
    _st := (p -> 'shell_state') - 'pw' - 'wal' - 'ver' - 'vr' - 'role' - 'email' - 'saved' - 'seen';
    update public.profiles set shell_state = _st where id = _uid;
  end if;

  select count(*) into _skills from public.skills where user_id = _uid;
  select count(*) into _exp from public.experiences where user_id = _uid;
  select count(*) into _edu from public.educations where user_id = _uid;
  update public.profiles set profile_completion = (
    (case when coalesce(full_name, '') <> '' then 1 else 0 end) + (case when coalesce(phone, '') <> '' then 1 else 0 end) +
    (case when coalesce(professional_headline, '') <> '' then 1 else 0 end) + (case when coalesce(about_summary, '') <> '' then 1 else 0 end) +
    (case when coalesce(city, '') <> '' then 1 else 0 end) + (case when _skills >= 3 then 1 else 0 end) +
    (case when _exp >= 1 or experience_level = 'fresher' then 1 else 0 end) + (case when _edu >= 1 then 1 else 0 end) +
    (case when coalesce(resume_url, resume_path, linkedin_url, github_url, portfolio_url, '') <> '' then 1 else 0 end)
  ) * 100 / 9 where id = _uid;

  return public.load_candidate_profile();
end $$;

create or replace function public.load_candidate_profile()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _p public.profiles; _id public.identity_verifications; _cir jsonb;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _p from public.profiles where id = _uid;
  if not found then return null; end if;
  select * into _id from public.identity_verifications where user_id = _uid;
  select jsonb_build_object('id', id, 'score', composite_score, 'tier', tier, 'percentile', percentile, 'generated_at', generated_at)
    into _cir from public.cir_reports where user_id = _uid order by generated_at desc limit 1;

  return jsonb_build_object(
    'profile', jsonb_build_object(
      'id', _p.id, 'iam_talento_id', _p.iam_talento_id, 'email', _p.email, 'full_name', _p.full_name, 'phone', _p.phone,
      'headline', _p.professional_headline, 'about', _p.about_summary, 'city', _p.city, 'state', _p.state, 'country', _p.country,
      'job_role', _p.job_role, 'company', _p.company, 'industry', _p.industry, 'years_of_experience', _p.years_of_experience,
      'experience_level', _p.experience_level, 'open_to_work', _p.open_to_work, 'preferred_locations', to_jsonb(_p.preferred_locations),
      'preferred_salary_range', _p.preferred_salary_range, 'notice_period', _p.notice_period, 'availability_status', _p.availability_status,
      'linkedin_url', _p.linkedin_url, 'github_url', _p.github_url, 'portfolio_url', _p.portfolio_url,
      'profile_photo_url', _p.profile_photo_url, 'resume_url', _p.resume_url, 'resume_path', _p.resume_path,
      'portfolio_slug', _p.portfolio_slug, 'profile_visibility', _p.profile_visibility, 'notification_prefs', _p.notification_prefs,
      'profile_completion', _p.profile_completion, 'readiness', _p.industry_readiness_score, 'referral_code', _p.referral_code,
      'referral_claimed', _p.referred_by is not null, 'created_at', _p.created_at),
    'skills', coalesce((select jsonb_agg(jsonb_build_object('name', skill_name, 'level', proficiency_level, 'category', category, 'years', years_of_experience, 'verified', is_verified) order by created_at) from public.skills where user_id = _uid), '[]'),
    'experiences', coalesce((select jsonb_agg(jsonb_build_object('title', job_title, 'company', company_name, 'start', start_date, 'end', case when is_current then 'Present' else end_date::text end, 'description', description) order by start_date desc nulls last) from public.experiences where user_id = _uid), '[]'),
    'educations', coalesce((select jsonb_agg(jsonb_build_object('degree', degree, 'institution', institution_name, 'year', end_year::text) order by end_year desc nulls last) from public.educations where user_id = _uid), '[]'),
    'certifications', coalesce((select jsonb_agg(jsonb_build_object('name', name, 'verified', verification_status = 'verified', 'issuer', issuing_organization) order by created_at) from public.certifications where user_id = _uid), '[]'),
    'projects', coalesce((select jsonb_agg(jsonb_build_object('title', title, 'description', description, 'url', project_url, 'tools', array_to_string(tools_technologies, ', '), 'impact', impact) order by created_at) from public.projects where user_id = _uid), '[]'),
    'languages', coalesce((select jsonb_agg(jsonb_build_object('name', title, 'level', description) order by created_at) from public.accomplishments where user_id = _uid and type = 'language'), '[]'),
    'shell_state', _p.shell_state,
    'verification', jsonb_build_object('profile_status', _p.verification_status, 'identity_status', _id.verification_status,
      'face_match', _id.face_match_status, 'rejection_reason', _id.rejection_reason, 'submitted_at', _id.created_at),
    'latest_cir', _cir
  );
end $$;

-- ---------------------------------------------------------------------
-- Public portfolio by custom URL (anonymous-readable, limited fields)
-- ---------------------------------------------------------------------
create table if not exists public.profile_views (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  viewer_key text not null,
  day date not null default current_date,
  primary key (profile_id, viewer_key, day)
);
alter table public.profile_views enable row level security;
create policy "Owners read own profile views" on public.profile_views for select using (profile_id = auth.uid());

create or replace function public.get_public_portfolio(p_slug text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare _p public.profiles; _out jsonb;
begin
  select * into _p from public.profiles where lower(portfolio_slug) = lower(btrim(p_slug)) and profile_visibility = 'public';
  if not found then return null; end if;
  if auth.uid() is distinct from _p.id then
    insert into public.profile_views (profile_id, viewer_key) values (_p.id, coalesce(auth.uid()::text, 'anon')) on conflict do nothing;
  end if;
  select jsonb_build_object(
    'name', _p.full_name, 'headline', _p.professional_headline, 'about', _p.about_summary, 'city', _p.city,
    'photo', _p.profile_photo_url, 'verified', _p.verification_status = 'verified', 'readiness', _p.industry_readiness_score,
    'linkedin', _p.linkedin_url, 'github', _p.github_url, 'website', _p.portfolio_url, 'open_to_work', _p.open_to_work,
    'skills', coalesce((select jsonb_agg(jsonb_build_object('name', skill_name, 'verified', is_verified)) from public.skills where user_id = _p.id), '[]'),
    'experiences', coalesce((select jsonb_agg(jsonb_build_object('title', job_title, 'company', company_name, 'description', description) order by start_date desc nulls last) from public.experiences where user_id = _p.id), '[]'),
    'projects', coalesce((select jsonb_agg(jsonb_build_object('title', title, 'description', description, 'url', project_url)) from public.projects where user_id = _p.id), '[]'),
    'certifications', coalesce((select jsonb_agg(jsonb_build_object('name', name, 'verified', verification_status = 'verified')) from public.certifications where user_id = _p.id), '[]'),
    'cir', (select jsonb_build_object('score', composite_score, 'tier', tier) from public.cir_reports where user_id = _p.id order by generated_at desc limit 1)
  ) into _out;
  return _out;
end $$;

-- ---------------------------------------------------------------------
-- Job search (server side filters + match score for signed-in users)
-- ---------------------------------------------------------------------
create or replace function public.search_jobs(
  p_query text default null, p_work_mode text default null, p_job_type text default null, p_max_exp numeric default null,
  p_location text default null, p_min_salary numeric default null, p_skills text[] default null,
  p_sort text default 'recent', p_limit integer default 24, p_offset integer default 0)
returns table (id uuid, designation text, company_name text, job_location text, work_mode text, job_type text,
               experience_min numeric, salary_min numeric, salary_max numeric, skills text[], created_at timestamptz,
               match_score numeric, total_count bigint)
language plpgsql stable security definer set search_path = public, extensions as $$
declare _q text := nullif(btrim(p_query), ''); _uid uuid := auth.uid();
begin
  return query
  with filtered as (
    select j.* from public.employer_job_openings j
    where j.status = 'active' and j.is_public
      and (j.closes_at is null or j.closes_at > now())
      and (_q is null or j.designation ilike '%' || _q || '%' or j.company_name ilike '%' || _q || '%'
           or exists (select 1 from unnest(j.skills) s where s ilike '%' || _q || '%'))
      and (p_work_mode is null or j.work_mode = p_work_mode)
      and (p_job_type is null or j.job_type = p_job_type)
      and (p_max_exp is null or j.experience_min <= p_max_exp)
      and (p_location is null or j.job_location ilike '%' || p_location || '%' or j.work_mode = 'Remote')
      and (p_min_salary is null or coalesce(j.salary_max, 0) >= p_min_salary)
      and (p_skills is null or j.skills && p_skills)),
  scored as (
    select f.*, case when _uid is not null and p_sort = 'match'
                     then (public.compute_match_score(_uid, f.id) ->> 'score')::numeric end as ms
    from filtered f),
  paged as (
    select s.*, count(*) over () as tc from scored s
    order by case when p_sort = 'match' then s.ms end desc nulls last,
             case when p_sort = 'salary' then s.salary_max end desc nulls last,
             s.created_at desc
    limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0))
  select p.id, p.designation, p.company_name, p.job_location, p.work_mode, p.job_type, p.experience_min,
         p.salary_min, p.salary_max, p.skills, p.created_at,
         coalesce(p.ms, case when _uid is not null then (public.compute_match_score(_uid, p.id) ->> 'score')::numeric end),
         p.tc
  from paged p
  order by case when p_sort = 'match' then p.ms end desc nulls last,
           case when p_sort = 'salary' then p.salary_max end desc nulls last,
           p.created_at desc;
end $$;

-- ---------------------------------------------------------------------
-- Job alerts
-- ---------------------------------------------------------------------
create table if not exists public.job_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  keywords text[] not null default '{}',
  location text,
  work_mode text check (work_mode in ('Remote', 'Hybrid', 'Onsite')),
  is_active boolean not null default true,
  unsubscribe_token text not null unique default encode(extensions.gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now(),
  unique (email, keywords)
);
create table if not exists public.job_alert_queue (
  id bigint generated always as identity primary key,
  alert_id uuid not null references public.job_alerts(id) on delete cascade,
  job_id uuid not null references public.employer_job_openings(id) on delete cascade,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (alert_id, job_id)
);
alter table public.job_alerts enable row level security;
alter table public.job_alert_queue enable row level security;
create policy "Users read own alerts" on public.job_alerts for select using (user_id = auth.uid());
create policy "Users delete own alerts" on public.job_alerts for delete using (user_id = auth.uid());

create or replace function public.subscribe_job_alerts(p_email text, p_keywords text[] default '{}', p_location text default null, p_work_mode text default null)
returns uuid
language plpgsql security definer set search_path = public as $$
declare _id uuid; _email text := lower(btrim(p_email)); _kw text[];
begin
  perform public.rate_limit_hit('job_alert_sub', 5, interval '1 hour', coalesce(auth.uid()::text, _email));
  _kw := coalesce(array(select lower(left(btrim(k), 60)) from unnest(p_keywords) k where btrim(k) <> '' limit 10), '{}');
  insert into public.job_alerts (user_id, email, keywords, location, work_mode)
  values (auth.uid(), _email, _kw, left(p_location, 80), p_work_mode)
  on conflict (email, keywords) do update set is_active = true, location = excluded.location, work_mode = excluded.work_mode,
    user_id = coalesce(public.job_alerts.user_id, excluded.user_id)
  returning id into _id;
  return _id;
end $$;

create or replace function public.unsubscribe_job_alert(p_token text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.job_alerts set is_active = false where unsubscribe_token = p_token;
  return found;
end $$;

create or replace function public.queue_job_alerts()
returns trigger language plpgsql security definer set search_path = public as $$
declare _a record;
begin
  if new.status <> 'active' or not new.is_public then return new; end if;
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
      perform public.push_notification(_a.user_id, 'job_alert', 'New job: ' || new.designation,
        coalesce(new.company_name, 'A company') || ' is hiring' || coalesce(' in ' || new.job_location, ''), '/talento-pro?view=jobs');
    end if;
  end loop;
  return new;
end $$;
drop trigger if exists job_alerts_trg on public.employer_job_openings;
create trigger job_alerts_trg after insert on public.employer_job_openings for each row execute function public.queue_job_alerts();

-- ---------------------------------------------------------------------
-- Freelancing
-- ---------------------------------------------------------------------
create table if not exists public.freelance_gigs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  client_name text,
  budget_min numeric not null default 0,
  budget_max numeric not null default 0,
  duration_days integer,
  skills text[] not null default '{}',
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);
create table if not exists public.gig_proposals (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.freelance_gigs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  cover_note text not null check (length(cover_note) between 10 and 3000),
  bid_amount numeric not null check (bid_amount > 0),
  status text not null default 'submitted' check (status in ('submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  unique (gig_id, user_id)
);
alter table public.freelance_gigs enable row level security;
alter table public.gig_proposals enable row level security;
create policy "Anyone browses open gigs" on public.freelance_gigs for select to anon, authenticated using (status = 'open');
create policy "Admins manage gigs" on public.freelance_gigs for all using (public.is_admin()) with check (public.is_admin());
create policy "Users read own proposals" on public.gig_proposals for select using (user_id = auth.uid());

create or replace function public.submit_gig_proposal(p_gig uuid, p_cover_note text, p_bid numeric)
returns public.gig_proposals
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _g public.freelance_gigs; _r public.gig_proposals;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('gig_proposal', 30, interval '1 day');
  select * into _g from public.freelance_gigs where id = p_gig and status = 'open';
  if not found then raise exception 'This gig is no longer open'; end if;
  if p_bid < _g.budget_min * 0.5 or p_bid > _g.budget_max * 2 then raise exception 'Bid is outside a reasonable range for this gig'; end if;
  insert into public.gig_proposals (gig_id, user_id, cover_note, bid_amount) values (p_gig, _uid, btrim(p_cover_note), p_bid)
  on conflict (gig_id, user_id) do update set cover_note = excluded.cover_note, bid_amount = excluded.bid_amount, status = 'submitted'
  returning * into _r;
  return _r;
end $$;

create or replace function public.withdraw_gig_proposal(p_proposal uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.gig_proposals set status = 'withdrawn' where id = p_proposal and user_id = auth.uid() and status in ('submitted', 'shortlisted');
end $$;

insert into public.freelance_gigs (title, description, client_name, budget_min, budget_max, duration_days, skills)
select * from (values
  ('Landing page in React + Tailwind', 'Build a responsive marketing page from a Figma file. Clean components, accessible, fast.', 'Northwind Studio', 15000, 30000, 10, array['React', 'Tailwind', 'TypeScript']),
  ('Dashboard analytics in SQL + Tableau', 'Model sales data and ship three executive dashboards.', 'Kiran Retail', 25000, 45000, 14, array['SQL', 'Tableau', 'Excel']),
  ('Technical SEO audit and fix list', 'Crawl a 500-page site, prioritise issues, hand over an actionable roadmap.', 'Bloom Commerce', 12000, 22000, 7, array['SEO', 'Analytics']),
  ('Node.js REST API with PostgreSQL', 'CRUD API, auth and docs for a booking platform.', 'Voyager Labs', 40000, 70000, 21, array['Node.js', 'PostgreSQL', 'AWS']),
  ('Brand video script and storyboard', 'Write a 60 second explainer script plus shot list.', 'Orchid Foods', 8000, 15000, 5, array['Writing', 'Storytelling']),
  ('Python data cleaning pipeline', 'Automate cleaning of weekly CSV exports into a warehouse.', 'DataBridge', 20000, 38000, 12, array['Python', 'SQL'])
) as v(t, d, c, bmin, bmax, dur, sk)
where not exists (select 1 from public.freelance_gigs g where g.title = v.t);

-- ---------------------------------------------------------------------
-- Support tickets via RPC only (rate limited)
-- ---------------------------------------------------------------------
drop policy if exists "Users manage own tickets" on public.support_tickets;
drop policy if exists "Users post ticket messages" on public.support_messages;
create policy "Users read own tickets" on public.support_tickets for select using (user_id = auth.uid() or public.is_admin());

create or replace function public.create_support_ticket(p_category text, p_subject text, p_body text)
returns public.support_tickets
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _t public.support_tickets;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('support_ticket', 10, interval '1 day');
  insert into public.support_tickets (user_id, category, subject) values (_uid, left(coalesce(p_category, 'general'), 40), btrim(p_subject)) returning * into _t;
  insert into public.support_messages (ticket_id, sender_id, body) values (_t.id, _uid, btrim(p_body));
  return _t;
end $$;

create or replace function public.reply_support_ticket(p_ticket uuid, p_body text)
returns public.support_messages
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _m public.support_messages;
begin
  perform public.rate_limit_hit('support_reply', 60, interval '1 day');
  if not exists (select 1 from public.support_tickets where id = p_ticket and user_id = _uid and status <> 'closed') then
    raise exception 'Ticket not found';
  end if;
  insert into public.support_messages (ticket_id, sender_id, body) values (p_ticket, _uid, btrim(p_body)) returning * into _m;
  update public.support_tickets set status = 'open' where id = p_ticket;
  return _m;
end $$;

-- ---------------------------------------------------------------------
-- Analytics
-- ---------------------------------------------------------------------
create or replace function public.candidate_analytics()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare _uid uuid := auth.uid();
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  return jsonb_build_object(
    'by_stage', coalesce((select jsonb_object_agg(stage, n) from (select stage, count(*) n from public.job_applications where candidate_id = _uid group by stage) s), '{}'),
    'applications_total', (select count(*) from public.job_applications where candidate_id = _uid and stage <> 'Withdrawn'),
    'avg_match', (select round(avg(match_score)) from public.job_applications where candidate_id = _uid),
    'profile_views_total', (select count(*) from public.profile_views where profile_id = _uid),
    'profile_views_30d', (select count(*) from public.profile_views where profile_id = _uid and day > current_date - 30),
    'views_by_day', coalesce((select jsonb_agg(jsonb_build_object('day', d, 'views', n) order by d) from (
        select day d, count(*) n from public.profile_views where profile_id = _uid and day > current_date - 30 group by day) v), '[]'),
    'weekly_applications', coalesce((select jsonb_agg(jsonb_build_object('week', w, 'count', n) order by w) from (
        select date_trunc('week', applied_at)::date w, count(*) n from public.job_applications
        where candidate_id = _uid and applied_at > now() - interval '8 weeks' group by 1) a), '[]'),
    'saved_jobs', (select count(*) from public.saved_jobs where user_id = _uid),
    'assessments_completed', (select count(*) from public.assessment_attempts where user_id = _uid and status in ('graded', 'submitted')),
    'best_assessment', (select max(percentage) from public.assessment_attempts where user_id = _uid and status = 'graded'),
    'courses_completed', (select count(*) from public.course_enrollments where user_id = _uid and status = 'completed'),
    'readiness', (select industry_readiness_score from public.profiles where id = _uid)
  );
end $$;

-- ---------------------------------------------------------------------
-- Function privileges: anonymous callers get an explicit allow-list only
-- ---------------------------------------------------------------------
revoke execute on all functions in schema public from public, anon;
grant execute on function
  public.is_admin(), public.is_owner(uuid), public.is_tenant_member(uuid, text[]), public.can_manage_job(uuid),
  public.has_role(uuid, public.app_role), public.all_http_urls(text[]), public.is_client_role(),
  public.verify_credential(text), public.get_public_portfolio(text),
  public.search_jobs(text, text, text, numeric, text, numeric, text[], text, integer, integer),
  public.subscribe_job_alerts(text, text[], text, text), public.unsubscribe_job_alert(text)
to anon, authenticated;

grant execute on function
  public.submit_identity_verification(text, text, text, text),
  public.cancel_payment_order(uuid),
  public.validate_coupon(text, text, numeric),
  public.create_payment_order(text, uuid, text, text, text, text, text, numeric),
  public.claim_referral(text),
  public.save_attempt_response(uuid, uuid, jsonb, integer),
  public.log_proctoring_event(uuid, smallint, text, text, numeric, text, jsonb),
  public.compute_match_score(uuid, uuid),
  public.apply_to_job(uuid, text),
  public.join_hackathon_team(text),
  public.save_candidate_profile(jsonb),
  public.load_candidate_profile(),
  public.submit_gig_proposal(uuid, text, numeric),
  public.withdraw_gig_proposal(uuid),
  public.create_support_ticket(text, text, text),
  public.reply_support_ticket(uuid, text),
  public.candidate_analytics()
to authenticated;

alter default privileges in schema public revoke execute on functions from public, anon;

-- Internal helpers must never be callable straight from the API (they trust their arguments).
revoke execute on function public.rate_limit_hit(text, integer, interval, text) from public, anon, authenticated;
revoke execute on function public._grant_referral_reward(public.payment_orders) from public, anon, authenticated;
revoke execute on function public._fulfill_order(uuid, text) from public, anon, authenticated;
revoke execute on function public.cancel_stale_orders() from public, anon, authenticated;
revoke execute on function public.review_identity_verification(uuid, boolean, text) from public, anon;
grant execute on function public.cancel_stale_orders() to service_role;
