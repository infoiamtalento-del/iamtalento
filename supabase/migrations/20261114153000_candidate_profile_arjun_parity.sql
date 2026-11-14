-- =====================================================================
-- Candidate Profile Parity with Reference Dashboard (Arjun Mehta Layout)
-- Adds cover banner, sub-headline/specialty, open_for_freelance, tools,
-- hobbies, video pitch, project preview image & GitHub links, and full
-- round-trip support in save_candidate_profile / load_candidate_profile /
-- get_public_portfolio while preserving all security invariants.
-- =====================================================================

-- 1. Extend public.profiles with missing profile presentation fields
alter table public.profiles
  add column if not exists banner_photo_url text,
  add column if not exists sub_headline text,
  add column if not exists open_for_freelance boolean not null default false,
  add column if not exists tools text[] not null default '{}',
  add column if not exists hobbies text[] not null default '{}',
  add column if not exists video_pitch text;

update public.profiles set
  banner_photo_url = nullif(btrim(banner_photo_url), ''),
  sub_headline = nullif(btrim(sub_headline), ''),
  video_pitch = nullif(btrim(video_pitch), '')
where banner_photo_url = '' or sub_headline = '' or video_pitch = '';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_banner_url_scheme'
  ) then
    alter table public.profiles
      add constraint profiles_banner_url_scheme
      check (banner_photo_url is null or banner_photo_url ~* '^https?://');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_sub_headline_len'
  ) then
    alter table public.profiles
      add constraint profiles_sub_headline_len
      check (coalesce(length(sub_headline), 0) <= 240 and coalesce(length(video_pitch), 0) <= 3000);
  end if;
end $$;

-- Relax legacy enum-style CHECK constraints on profiles so ProfileBuilder & Wizard values never error
alter table public.profiles drop constraint if exists profiles_experience_level_check;
alter table public.profiles add constraint profiles_experience_level_check
  check (
    experience_level is null or
    lower(experience_level) in ('fresher', 'experienced', 'junior', 'mid-level', 'senior', 'lead', 'executive')
  );

alter table public.profiles drop constraint if exists profiles_employment_type_check;
alter table public.profiles add constraint profiles_employment_type_check
  check (
    employment_type is null or
    lower(employment_type) in ('full-time', 'part-time', 'contract', 'freelance', 'internship')
  );

-- 2. Extend public.projects with preview image & GitHub repository URL
alter table public.projects
  add column if not exists github_url text,
  add column if not exists image_url text;

update public.projects set
  github_url = nullif(btrim(github_url), ''),
  image_url = nullif(btrim(image_url), '')
where github_url = '' or image_url = '';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'projects_extra_urls_scheme'
  ) then
    alter table public.projects
      add constraint projects_extra_urls_scheme
      check (
        (github_url is null or github_url ~* '^https?://') and
        (image_url is null or image_url ~* '^https?://')
      );
  end if;
end $$;

-- 3. Upgrade save_candidate_profile(p jsonb) for full Arjun-Mehta field parity
create or replace function public.save_candidate_profile(p jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _pr jsonb := coalesce(p -> 'profile', '{}'::jsonb);
  _st jsonb;
  _skills int; _exp int; _edu int;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if octet_length(p::text) > 400000 then raise exception 'Profile payload is too large'; end if;
  perform public.rate_limit_hit('save_profile', 240, interval '1 hour');

  update public.profiles set
    full_name = case when _pr ? 'full_name' then left(btrim(_pr ->> 'full_name'), 200) else full_name end,
    phone = case when _pr ? 'phone' then left(nullif(btrim(_pr ->> 'phone'), ''), 30) else phone end,
    professional_headline = case when _pr ? 'headline' then left(_pr ->> 'headline', 300) else professional_headline end,
    sub_headline = case when _pr ? 'sub_headline' then nullif(left(btrim(_pr ->> 'sub_headline'), 240), '') else sub_headline end,
    about_summary = case when _pr ? 'about' then left(_pr ->> 'about', 5000) else about_summary end,
    city = case when _pr ? 'city' then left(_pr ->> 'city', 100) else city end,
    state = case when _pr ? 'state' then left(_pr ->> 'state', 100) else state end,
    country = case when _pr ? 'country' then left(_pr ->> 'country', 100) else country end,
    job_role = case when _pr ? 'job_role' then left(_pr ->> 'job_role', 150) else job_role end,
    company = case when _pr ? 'company' then left(_pr ->> 'company', 150) else company end,
    industry = case when _pr ? 'industry' then left(_pr ->> 'industry', 100) else industry end,
    years_of_experience = case when _pr ? 'years_of_experience' then least(greatest(coalesce((_pr ->> 'years_of_experience')::numeric, 0), 0), 60)::int else years_of_experience end,
    experience_level = case
      when _pr ? 'experience_level' and lower(btrim(_pr ->> 'experience_level')) in ('fresher', 'experienced', 'junior', 'mid-level', 'senior', 'lead', 'executive')
        then lower(btrim(_pr ->> 'experience_level'))
      else experience_level
    end,
    open_to_work = case when _pr ? 'open_to_work' then coalesce((_pr ->> 'open_to_work')::boolean, false) else open_to_work end,
    open_for_freelance = case when _pr ? 'open_for_freelance' then coalesce((_pr ->> 'open_for_freelance')::boolean, false) else open_for_freelance end,
    preferred_locations = case when _pr ? 'preferred_locations' then public._jsonb_text_array(_pr -> 'preferred_locations') else preferred_locations end,
    areas_of_expertise = case when _pr ? 'areas_of_expertise' then public._jsonb_text_array(_pr -> 'areas_of_expertise') else areas_of_expertise end,
    career_interests = case
      when _pr ? 'interests' then public._jsonb_text_array(_pr -> 'interests')
      when _pr ? 'career_interests' then public._jsonb_text_array(_pr -> 'career_interests')
      else career_interests
    end,
    tools = case when _pr ? 'tools' then public._jsonb_text_array(_pr -> 'tools') else tools end,
    hobbies = case when _pr ? 'hobbies' then public._jsonb_text_array(_pr -> 'hobbies') else hobbies end,
    preferred_salary_range = case when _pr ? 'preferred_salary_range' then left(_pr ->> 'preferred_salary_range', 60) else preferred_salary_range end,
    notice_period = case when _pr ? 'notice_period' then left(_pr ->> 'notice_period', 60) else notice_period end,
    availability_status = case when _pr ? 'availability_status' then left(_pr ->> 'availability_status', 60) else availability_status end,
    linkedin_url = case when _pr ? 'linkedin_url' then nullif(btrim(_pr ->> 'linkedin_url'), '') else linkedin_url end,
    github_url = case when _pr ? 'github_url' then nullif(btrim(_pr ->> 'github_url'), '') else github_url end,
    portfolio_url = case when _pr ? 'portfolio_url' then nullif(btrim(_pr ->> 'portfolio_url'), '') else portfolio_url end,
    kaggle_url = case when _pr ? 'kaggle_url' then nullif(btrim(_pr ->> 'kaggle_url'), '') else kaggle_url end,
    behance_url = case when _pr ? 'behance_url' then nullif(btrim(_pr ->> 'behance_url'), '') else behance_url end,
    video_intro_url = case when _pr ? 'video_intro_url' then nullif(btrim(_pr ->> 'video_intro_url'), '') else video_intro_url end,
    video_pitch = case when _pr ? 'video_pitch' then nullif(left(btrim(_pr ->> 'video_pitch'), 3000), '') else video_pitch end,
    profile_photo_url = case when _pr ? 'profile_photo_url' then nullif(btrim(_pr ->> 'profile_photo_url'), '') else profile_photo_url end,
    banner_photo_url = case when _pr ? 'banner_photo_url' then nullif(btrim(_pr ->> 'banner_photo_url'), '') else banner_photo_url end,
    resume_url = case when _pr ? 'resume_url' then nullif(btrim(_pr ->> 'resume_url'), '') else resume_url end,
    resume_path = case when _pr ? 'resume_path' then nullif(btrim(_pr ->> 'resume_path'), '') else resume_path end,
    portfolio_slug = case when _pr ? 'portfolio_slug' then nullif(lower(btrim(_pr ->> 'portfolio_slug')), '') else portfolio_slug end,
    profile_visibility = case when _pr ->> 'profile_visibility' in ('public', 'applied_only', 'private') then _pr ->> 'profile_visibility' else profile_visibility end,
    notification_prefs = case when jsonb_typeof(_pr -> 'notification_prefs') = 'object' then _pr -> 'notification_prefs' else notification_prefs end
  where id = _uid;

  if p ? 'skills' and jsonb_typeof(p -> 'skills') = 'array' then
    delete from public.skills s where s.user_id = _uid and lower(s.skill_name) not in (
      select lower(btrim(e ->> 'name')) from jsonb_array_elements(p -> 'skills') e where btrim(coalesce(e ->> 'name', '')) <> '');
    insert into public.skills (user_id, skill_name, category, proficiency_level, years_of_experience)
    select distinct on (lower(btrim(e ->> 'name'))) _uid, left(btrim(e ->> 'name'), 80),
      case when lower(e ->> 'category') in ('technical', 'behavioral', 'management') then lower(e ->> 'category') else 'technical' end,
      case when lower(e ->> 'level') in ('beginner', 'intermediate', 'advanced', 'expert') then lower(e ->> 'level') else 'intermediate' end,
      least(greatest(coalesce(nullif(e ->> 'years', '')::numeric, 0), 0), 60)::int
    from jsonb_array_elements(p -> 'skills') e where btrim(coalesce(e ->> 'name', '')) <> '' limit 100
    on conflict (user_id, lower(skill_name)) do update set category = excluded.category,
      proficiency_level = excluded.proficiency_level, years_of_experience = excluded.years_of_experience;
  end if;

  if p ? 'experiences' and jsonb_typeof(p -> 'experiences') = 'array' then
    delete from public.experiences where user_id = _uid;
    insert into public.experiences (
      user_id, job_title, company_name, location, start_date, end_date, is_current, description, tools_technologies
    )
    select _uid,
      left(btrim(e ->> 'title'), 150),
      left(coalesce(nullif(btrim(e ->> 'company'), ''), 'Company'), 150),
      nullif(left(btrim(coalesce(e ->> 'location', '')), 150), ''),
      public.safe_date(e ->> 'start'),
      public.safe_date(e ->> 'end'),
      (coalesce(lower(btrim(e ->> 'end')), '') in ('', 'present', 'current', 'now')),
      left(e ->> 'description', 4000),
      case
        when jsonb_typeof(e -> 'tools') = 'array' then public._jsonb_text_array(e -> 'tools')
        when coalesce(e ->> 'tools', '') <> '' then
          coalesce(array(select left(btrim(t), 60) from unnest(string_to_array(e ->> 'tools', ',')) t where btrim(t) <> '' limit 25), '{}')
        else '{}'
      end
    from jsonb_array_elements(p -> 'experiences') e
    where btrim(coalesce(e ->> 'title', '')) <> '' limit 50;
  end if;

  if p ? 'educations' and jsonb_typeof(p -> 'educations') = 'array' then
    delete from public.educations where user_id = _uid;
    insert into public.educations (
      user_id, degree, field_of_study, institution_name, start_year, end_year, grade
    )
    select _uid,
      left(coalesce(nullif(btrim(e ->> 'degree'), ''), 'Degree'), 150),
      nullif(left(btrim(coalesce(e ->> 'field_of_study', '')), 150), ''),
      left(btrim(e ->> 'institution'), 200),
      case when coalesce(e ->> 'start_year', '') ~ '^\d{4}$' then (e ->> 'start_year')::int end,
      case when coalesce(e ->> 'year', e ->> 'end_year', '') ~ '^\d{4}$' then coalesce(e ->> 'year', e ->> 'end_year')::int end,
      nullif(left(btrim(coalesce(e ->> 'grade', '')), 80), '')
    from jsonb_array_elements(p -> 'educations') e
    where btrim(coalesce(e ->> 'institution', '')) <> '' limit 20;
  end if;

  -- Support rich certification_details array while remaining 100% compatible with string[] certifications
  if p ? 'certification_details' and jsonb_typeof(p -> 'certification_details') = 'array' then
    delete from public.certifications c where c.user_id = _uid and lower(c.name) not in (
      select lower(left(btrim(e ->> 'name'), 200))
      from jsonb_array_elements(p -> 'certification_details') e
      where btrim(coalesce(e ->> 'name', '')) <> ''
    );
    insert into public.certifications (user_id, name, issuing_organization, issue_date, credential_url)
    select distinct on (lower(left(btrim(e ->> 'name'), 200)))
      _uid,
      left(btrim(e ->> 'name'), 200),
      nullif(left(btrim(coalesce(e ->> 'issuer', e ->> 'org', '')), 160), ''),
      public.safe_date(coalesce(e ->> 'date', e ->> 'issue_date')),
      case when coalesce(e ->> 'credential_url', '') ~* '^https?://' then btrim(e ->> 'credential_url') end
    from jsonb_array_elements(p -> 'certification_details') e
    where btrim(coalesce(e ->> 'name', '')) <> '' limit 50
    on conflict (user_id, lower(name)) do update set
      issuing_organization = coalesce(excluded.issuing_organization, public.certifications.issuing_organization),
      issue_date = coalesce(excluded.issue_date, public.certifications.issue_date),
      credential_url = coalesce(excluded.credential_url, public.certifications.credential_url);
  elsif p ? 'certifications' and jsonb_typeof(p -> 'certifications') = 'array' then
    delete from public.certifications c where c.user_id = _uid and lower(c.name) not in (
      select lower(left(btrim(
        case when jsonb_typeof(x) = 'object' then coalesce(x ->> 'name', '') else trim(both '"' from x::text) end
      ), 200))
      from jsonb_array_elements(p -> 'certifications') x
      where btrim(case when jsonb_typeof(x) = 'object' then coalesce(x ->> 'name', '') else trim(both '"' from x::text) end) <> ''
    );
    insert into public.certifications (user_id, name, issuing_organization, issue_date, credential_url)
    select distinct on (lower(left(btrim(nm), 200)))
      _uid,
      left(btrim(nm), 200),
      iss,
      dt,
      curl
    from (
      select
        case when jsonb_typeof(x) = 'object' then coalesce(x ->> 'name', '') else x #>> '{}' end as nm,
        case when jsonb_typeof(x) = 'object' then nullif(left(btrim(coalesce(x ->> 'issuer', x ->> 'org', '')), 160), '') else null end as iss,
        case when jsonb_typeof(x) = 'object' then public.safe_date(coalesce(x ->> 'date', x ->> 'issue_date')) else null end as dt,
        case when jsonb_typeof(x) = 'object' and coalesce(x ->> 'credential_url', '') ~* '^https?://' then btrim(x ->> 'credential_url') else null end as curl
      from jsonb_array_elements(p -> 'certifications') x
    ) parsed
    where btrim(coalesce(nm, '')) <> '' limit 50
    on conflict (user_id, lower(name)) do update set
      issuing_organization = coalesce(excluded.issuing_organization, public.certifications.issuing_organization),
      issue_date = coalesce(excluded.issue_date, public.certifications.issue_date),
      credential_url = coalesce(excluded.credential_url, public.certifications.credential_url);
  end if;

  if p ? 'projects' and jsonb_typeof(p -> 'projects') = 'array' then
    delete from public.projects where user_id = _uid;
    insert into public.projects (
      user_id, title, role_in_project, description, project_url, github_url, image_url, tools_technologies, impact
    )
    select _uid,
      left(btrim(e ->> 'title'), 200),
      nullif(left(btrim(coalesce(e ->> 'role', '')), 120), ''),
      left(e ->> 'description', 3000),
      case when coalesce(e ->> 'url', '') ~* '^https?://' then btrim(e ->> 'url') end,
      case when coalesce(e ->> 'github_url', '') ~* '^https?://' then btrim(e ->> 'github_url') end,
      case when coalesce(e ->> 'image_url', '') ~* '^https?://' then btrim(e ->> 'image_url') end,
      case
        when jsonb_typeof(e -> 'tools') = 'array' then public._jsonb_text_array(e -> 'tools')
        else coalesce(array(select left(btrim(t), 60) from unnest(string_to_array(coalesce(e ->> 'tools', ''), ',')) t where btrim(t) <> '' limit 20), '{}')
      end,
      left(e ->> 'impact', 1000)
    from jsonb_array_elements(p -> 'projects') e
    where btrim(coalesce(e ->> 'title', '')) <> '' limit 30;
  end if;

  if p ? 'awards' and jsonb_typeof(p -> 'awards') = 'array' then
    delete from public.achievements where user_id = _uid;
    insert into public.achievements (user_id, title, organization, achievement_date, description)
    select _uid,
      left(btrim(e ->> 'title'), 200),
      nullif(left(btrim(coalesce(e ->> 'organization', e ->> 'issuer', '')), 160), ''),
      public.safe_date(coalesce(e ->> 'date', e ->> 'year')),
      nullif(left(btrim(coalesce(e ->> 'description', '')), 1000), '')
    from jsonb_array_elements(p -> 'awards') e
    where btrim(coalesce(e ->> 'title', '')) <> '' limit 30;
  end if;

  if p ? 'languages' and jsonb_typeof(p -> 'languages') = 'array' then
    delete from public.accomplishments where user_id = _uid and type = 'language';
    insert into public.accomplishments (user_id, type, title, description)
    select _uid, 'language', left(btrim(e ->> 'name'), 80), left(e ->> 'level', 60)
    from jsonb_array_elements(p -> 'languages') e
    where btrim(coalesce(e ->> 'name', '')) <> '' limit 20;
  end if;

  if jsonb_typeof(p -> 'shell_state') = 'object' then
    _st := (p -> 'shell_state') - 'pw' - 'wal' - 'ver' - 'vr' - 'role' - 'email' - 'saved' - 'seen';
    update public.profiles set shell_state = _st where id = _uid;
  end if;

  select count(*) into _skills from public.skills where user_id = _uid;
  select count(*) into _exp from public.experiences where user_id = _uid;
  select count(*) into _edu from public.educations where user_id = _uid;
  update public.profiles set profile_completion = (
    (case when coalesce(full_name, '') <> '' then 1 else 0 end) +
    (case when coalesce(phone, '') <> '' then 1 else 0 end) +
    (case when coalesce(professional_headline, '') <> '' then 1 else 0 end) +
    (case when coalesce(about_summary, '') <> '' then 1 else 0 end) +
    (case when coalesce(city, '') <> '' then 1 else 0 end) +
    (case when _skills >= 3 then 1 else 0 end) +
    (case when _exp >= 1 or experience_level = 'fresher' then 1 else 0 end) +
    (case when _edu >= 1 then 1 else 0 end) +
    (case when coalesce(resume_url, resume_path, linkedin_url, github_url, portfolio_url, '') <> '' then 1 else 0 end)
  ) * 100 / 9 where id = _uid;

  return public.load_candidate_profile();
end $$;

-- 4. Upgrade load_candidate_profile() to return all Arjun-Mehta layout fields
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
      'id', _p.id,
      'iam_talento_id', _p.iam_talento_id,
      'email', _p.email,
      'full_name', _p.full_name,
      'phone', _p.phone,
      'headline', _p.professional_headline,
      'sub_headline', _p.sub_headline,
      'about', _p.about_summary,
      'city', _p.city,
      'state', _p.state,
      'country', _p.country,
      'job_role', _p.job_role,
      'company', _p.company,
      'industry', _p.industry,
      'years_of_experience', _p.years_of_experience,
      'experience_level', _p.experience_level,
      'open_to_work', _p.open_to_work,
      'open_for_freelance', _p.open_for_freelance,
      'preferred_locations', to_jsonb(coalesce(_p.preferred_locations, '{}')),
      'areas_of_expertise', to_jsonb(coalesce(_p.areas_of_expertise, '{}')),
      'interests', to_jsonb(coalesce(_p.career_interests, '{}')),
      'tools', to_jsonb(coalesce(_p.tools, '{}')),
      'hobbies', to_jsonb(coalesce(_p.hobbies, '{}')),
      'preferred_salary_range', _p.preferred_salary_range,
      'notice_period', _p.notice_period,
      'availability_status', _p.availability_status,
      'linkedin_url', _p.linkedin_url,
      'github_url', _p.github_url,
      'portfolio_url', _p.portfolio_url,
      'kaggle_url', _p.kaggle_url,
      'behance_url', _p.behance_url,
      'video_intro_url', _p.video_intro_url,
      'video_pitch', _p.video_pitch,
      'profile_photo_url', _p.profile_photo_url,
      'banner_photo_url', _p.banner_photo_url,
      'resume_url', _p.resume_url,
      'resume_path', _p.resume_path,
      'portfolio_slug', _p.portfolio_slug,
      'profile_visibility', _p.profile_visibility,
      'notification_prefs', _p.notification_prefs,
      'profile_completion', _p.profile_completion,
      'readiness', _p.industry_readiness_score,
      'referral_code', _p.referral_code,
      'referral_claimed', _p.referred_by is not null,
      'created_at', _p.created_at
    ),
    'skills', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', skill_name,
        'level', proficiency_level,
        'category', category,
        'years', years_of_experience,
        'verified', is_verified
      ) order by created_at)
      from public.skills where user_id = _uid
    ), '[]'),
    'experiences', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', job_title,
        'company', company_name,
        'location', location,
        'start', start_date,
        'end', case when is_current then 'Present' else end_date::text end,
        'description', description,
        'tools', coalesce(tools_technologies, '{}')
      ) order by start_date desc nulls last, created_at desc)
      from public.experiences where user_id = _uid
    ), '[]'),
    'educations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'degree', degree,
        'field_of_study', field_of_study,
        'institution', institution_name,
        'start_year', start_year::text,
        'year', end_year::text,
        'grade', grade
      ) order by end_year desc nulls last, created_at desc)
      from public.educations where user_id = _uid
    ), '[]'),
    'certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name,
        'verified', verification_status = 'verified',
        'issuer', issuing_organization,
        'date', issue_date::text,
        'credential_url', credential_url
      ) order by created_at)
      from public.certifications where user_id = _uid
    ), '[]'),
    'projects', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', title,
        'role', role_in_project,
        'description', description,
        'url', project_url,
        'github_url', github_url,
        'image_url', image_url,
        'tools', array_to_string(tools_technologies, ', '),
        'tools_list', coalesce(tools_technologies, '{}'),
        'impact', impact
      ) order by created_at)
      from public.projects where user_id = _uid
    ), '[]'),
    'awards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', title,
        'organization', organization,
        'date', achievement_date::text,
        'description', description
      ) order by achievement_date desc nulls last, created_at desc)
      from public.achievements where user_id = _uid
    ), '[]'),
    'languages', coalesce((
      select jsonb_agg(jsonb_build_object('name', title, 'level', description) order by created_at)
      from public.accomplishments where user_id = _uid and type = 'language'
    ), '[]'),
    'shell_state', _p.shell_state,
    'verification', jsonb_build_object(
      'profile_status', _p.verification_status,
      'identity_status', _id.verification_status,
      'face_match', _id.face_match_status,
      'rejection_reason', _id.rejection_reason,
      'submitted_at', _id.created_at
    ),
    'latest_cir', _cir
  );
end $$;

-- 5. Upgrade get_public_portfolio(p_slug text) (never exposes email or phone)
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
    'name', _p.full_name,
    'headline', _p.professional_headline,
    'sub_headline', _p.sub_headline,
    'about', _p.about_summary,
    'city', _p.city,
    'state', _p.state,
    'country', _p.country,
    'industry', _p.industry,
    'photo', _p.profile_photo_url,
    'banner', _p.banner_photo_url,
    'verified', _p.verification_status = 'verified',
    'readiness', _p.industry_readiness_score,
    'linkedin', _p.linkedin_url,
    'github', _p.github_url,
    'website', _p.portfolio_url,
    'kaggle', _p.kaggle_url,
    'behance', _p.behance_url,
    'video_intro_url', _p.video_intro_url,
    'video_pitch', _p.video_pitch,
    'open_to_work', _p.open_to_work,
    'open_for_freelance', _p.open_for_freelance,
    'tools', coalesce(_p.tools, '{}'),
    'hobbies', coalesce(_p.hobbies, '{}'),
    'interests', coalesce(_p.career_interests, '{}'),
    'areas_of_expertise', coalesce(_p.areas_of_expertise, '{}'),
    'focus_badges', coalesce(_p.shell_state #> '{arjun_profile_v1,focus_badges}', to_jsonb(coalesce(_p.areas_of_expertise, '{}'))),
    'expertise_cards', coalesce(_p.shell_state #> '{arjun_profile_v1,expertise_cards}', '[]'::jsonb),
    'skills', coalesce((
      select jsonb_agg(jsonb_build_object('name', skill_name, 'level', proficiency_level, 'verified', is_verified) order by created_at)
      from public.skills where user_id = _p.id
    ), '[]'),
    'experiences', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', job_title,
        'company', company_name,
        'location', location,
        'start', start_date,
        'end', case when is_current then 'Present' else end_date::text end,
        'description', description,
        'tools', coalesce(tools_technologies, '{}')
      ) order by start_date desc nulls last)
      from public.experiences where user_id = _p.id
    ), '[]'),
    'educations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'institution', institution_name,
        'degree', degree,
        'field_of_study', field_of_study,
        'start_year', start_year::text,
        'year', end_year::text,
        'grade', grade
      ) order by end_year desc nulls last)
      from public.educations where user_id = _p.id
    ), '[]'),
    'projects', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', title,
        'role', role_in_project,
        'description', description,
        'url', project_url,
        'github_url', github_url,
        'image_url', image_url,
        'tools', coalesce(tools_technologies, '{}')
      ) order by created_at)
      from public.projects where user_id = _p.id
    ), '[]'),
    'certifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name,
        'issuer', issuing_organization,
        'date', issue_date::text,
        'verified', verification_status = 'verified'
      ) order by created_at)
      from public.certifications where user_id = _p.id
    ), '[]'),
    'awards', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', title,
        'organization', organization,
        'date', achievement_date::text,
        'description', description
      ) order by achievement_date desc nulls last)
      from public.achievements where user_id = _p.id
    ), '[]'),
    'languages', coalesce((
      select jsonb_agg(jsonb_build_object('name', title, 'level', description) order by created_at)
      from public.accomplishments where user_id = _p.id and type = 'language'
    ), '[]'),
    'cir', (
      select jsonb_build_object('score', composite_score, 'tier', tier)
      from public.cir_reports where user_id = _p.id order by generated_at desc limit 1
    )
  ) into _out;
  return _out;
end $$;
