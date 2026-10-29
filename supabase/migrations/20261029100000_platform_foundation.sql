-- =====================================================================
-- IAmTalento (TalentCIR) platform foundation
-- Multi-tenant orgs, jobs/ATS, notifications, support, embeddings.
-- Portable PostgreSQL: Supabase-specific bits (auth.uid, extensions
-- schema) are isolated so this can move to self-hosted Postgres later.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;
create extension if not exists vector   with schema extensions;
create extension if not exists pg_trgm  with schema extensions;

-- ---------------------------------------------------------------------
-- Platform settings + admin allow-list
-- ---------------------------------------------------------------------
create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.platform_settings enable row level security;
create policy "Anyone can read public settings" on public.platform_settings
  for select using (key in ('gst_rate', 'seller_state', 'assessment_weights'));

insert into public.platform_settings (key, value) values
  ('gst_rate', '18'::jsonb),
  ('seller_state', '"Karnataka"'::jsonb),
  ('assessment_weights', '{"core": 0.45, "domain": 0.30, "interview": 0.15, "integrity": 0.10}'::jsonb)
on conflict (key) do nothing;

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.platform_admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid())
$$;

-- ---------------------------------------------------------------------
-- Tenancy (Tier 1 pool / Tier 2 schema / Tier 3 silo routing metadata)
-- ---------------------------------------------------------------------
create table if not exists public.tenant_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tier text not null default 'pool' check (tier in ('pool', 'schema', 'silo')),
  plan text not null default 'free' check (plan in ('free', 'growth', 'enterprise')),
  custom_domain text unique,
  branding jsonb not null default '{}'::jsonb,
  sso_config jsonb not null default '{}'::jsonb,
  employer_id uuid references public.employers(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete set null,
  gstin text,
  billing_state text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'recruiter'
    check (role in ('owner', 'admin', 'recruiter', 'hiring_manager', 'interviewer', 'viewer')),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);
create index if not exists tenant_memberships_user_idx on public.tenant_memberships(user_id);

create table if not exists public.tenant_api_keys_webhooks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant_organizations(id) on delete cascade,
  kind text not null check (kind in ('api_key', 'webhook')),
  name text not null,
  key_prefix text,
  key_hash text,
  endpoint_url text,
  signing_secret text,
  events text[] not null default '{}',
  is_active boolean not null default true,
  last_used_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_tenant_member(_tenant uuid, _roles text[] default null)
returns boolean language sql stable security definer set search_path = public as $$
  select _tenant is not null and exists (
    select 1 from public.tenant_memberships m
    where m.tenant_id = _tenant and m.user_id = auth.uid()
      and (_roles is null or m.role = any(_roles))
  )
$$;

alter table public.tenant_organizations enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.tenant_api_keys_webhooks enable row level security;

create policy "Members read their tenant" on public.tenant_organizations
  for select using (public.is_tenant_member(id) or owner_user_id = auth.uid());
create policy "Owners manage their tenant" on public.tenant_organizations
  for all using (owner_user_id = auth.uid() or public.is_tenant_member(id, array['owner','admin']))
  with check (owner_user_id = auth.uid() or public.is_tenant_member(id, array['owner','admin']));
create policy "Members read memberships" on public.tenant_memberships
  for select using (user_id = auth.uid() or public.is_tenant_member(tenant_id));
create policy "Admins manage memberships" on public.tenant_memberships
  for all using (public.is_tenant_member(tenant_id, array['owner','admin']))
  with check (public.is_tenant_member(tenant_id, array['owner','admin']));
create policy "Admins manage keys and webhooks" on public.tenant_api_keys_webhooks
  for all using (public.is_tenant_member(tenant_id, array['owner','admin']))
  with check (public.is_tenant_member(tenant_id, array['owner','admin']));

create trigger tenant_organizations_updated_at before update on public.tenant_organizations
  for each row execute function public.update_updated_at();

-- ---------------------------------------------------------------------
-- Profiles: referral + extra columns
-- ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references public.profiles(id) on delete set null,
  add column if not exists gstin text,
  add column if not exists profile_visibility text not null default 'public'
    check (profile_visibility in ('public', 'applied_only', 'private')),
  add column if not exists notification_prefs jsonb not null default
    '{"email": true, "sms": false, "marketing": false, "login_alerts": true}'::jsonb;

create or replace function public.set_referral_code()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.referral_code is null then
    new.referral_code := 'REF' || upper(substr(md5(gen_random_uuid()::text), 1, 7));
  end if;
  return new;
end $$;
drop trigger if exists profiles_referral_code on public.profiles;
create trigger profiles_referral_code before insert on public.profiles
  for each row execute function public.set_referral_code();
update public.profiles set referral_code = 'REF' || upper(substr(md5(id::text), 1, 7)) where referral_code is null;

-- ---------------------------------------------------------------------
-- Jobs: extend employer_job_openings into the canonical listing table.
-- employer_id / user_id become nullable for platform-curated listings.
-- ---------------------------------------------------------------------
alter table public.employer_job_openings
  alter column employer_id drop not null,
  alter column user_id drop not null;

alter table public.employer_job_openings
  add column if not exists tenant_id uuid references public.tenant_organizations(id) on delete set null,
  add column if not exists company_name text,
  add column if not exists work_mode text check (work_mode in ('Remote', 'Hybrid', 'Onsite')),
  add column if not exists job_type text check (job_type in ('Full-time', 'Internship', 'Contract')),
  add column if not exists skills text[] not null default '{}',
  add column if not exists experience_min numeric not null default 0,
  add column if not exists min_cir_score numeric not null default 0,
  add column if not exists is_public boolean not null default true,
  add column if not exists source text not null default 'employer' check (source in ('employer', 'platform')),
  add column if not exists closes_at timestamptz,
  add column if not exists jd_embedding extensions.vector(1536);

create index if not exists job_openings_status_idx on public.employer_job_openings(status, is_public, created_at desc);
create index if not exists job_openings_skills_idx on public.employer_job_openings using gin (skills);
create index if not exists job_openings_title_trgm on public.employer_job_openings using gin (designation extensions.gin_trgm_ops);
create index if not exists job_openings_embedding_idx on public.employer_job_openings
  using hnsw (jd_embedding extensions.vector_cosine_ops);

create or replace function public.can_manage_job(_job uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.employer_job_openings j
    where j.id = _job and (j.user_id = auth.uid() or public.is_tenant_member(j.tenant_id) or public.is_admin())
  )
$$;

create policy "Anyone can browse active public jobs" on public.employer_job_openings
  for select to anon, authenticated using (status = 'active' and is_public = true);
create policy "Tenant members manage tenant jobs" on public.employer_job_openings
  for all using (public.is_tenant_member(tenant_id, array['owner','admin','recruiter','hiring_manager']))
  with check (public.is_tenant_member(tenant_id, array['owner','admin','recruiter','hiring_manager']));
create policy "Admins manage all jobs" on public.employer_job_openings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- ATS: applications, stage history, evaluations, interviews, saved jobs
-- ---------------------------------------------------------------------
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.employer_job_openings(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  tenant_id uuid references public.tenant_organizations(id) on delete set null,
  stage text not null default 'Applied'
    check (stage in ('Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn')),
  cover_note text,
  match_score numeric,
  match_breakdown jsonb not null default '{}'::jsonb,
  profile_snapshot jsonb not null default '{}'::jsonb,
  recruiter_note text,
  viewed_at timestamptz,
  interview_at timestamptz,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);
create index if not exists job_applications_candidate_idx on public.job_applications(candidate_id, applied_at desc);
create index if not exists job_applications_job_idx on public.job_applications(job_id, stage);

create table if not exists public.application_stage_history (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.job_applications(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  actor_id uuid references auth.users(id) on delete set null,
  message text,
  is_auto boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists stage_history_app_idx on public.application_stage_history(application_id, created_at);

create table if not exists public.recruiter_evaluations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(id) on delete cascade,
  evaluator_id uuid not null references auth.users(id) on delete cascade,
  rating smallint check (rating between 1 and 5),
  scorecard jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.scheduled_interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(id) on delete cascade,
  job_id uuid not null references public.employer_job_openings(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  tenant_id uuid references public.tenant_organizations(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_min integer not null default 45,
  mode text not null default 'video' check (mode in ('video', 'phone', 'onsite', 'ai')),
  meeting_url text,
  livekit_room text,
  calendar_event_id text,
  panelist_ids uuid[] not null default '{}',
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists scheduled_interviews_candidate_idx on public.scheduled_interviews(candidate_id, scheduled_at);

create table if not exists public.saved_jobs (
  user_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.employer_job_openings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

alter table public.job_applications enable row level security;
alter table public.application_stage_history enable row level security;
alter table public.recruiter_evaluations enable row level security;
alter table public.scheduled_interviews enable row level security;
alter table public.saved_jobs enable row level security;

-- Candidates read their own applications; all writes go through RPCs.
create policy "Candidates read own applications" on public.job_applications
  for select using (candidate_id = auth.uid());
create policy "Employers read applications for their jobs" on public.job_applications
  for select using (public.can_manage_job(job_id));
create policy "Employers update applications for their jobs" on public.job_applications
  for update using (public.can_manage_job(job_id)) with check (public.can_manage_job(job_id));

create policy "Candidates read own stage history" on public.application_stage_history
  for select using (exists (select 1 from public.job_applications a
    where a.id = application_id and a.candidate_id = auth.uid()));
create policy "Employers read stage history" on public.application_stage_history
  for select using (exists (select 1 from public.job_applications a
    where a.id = application_id and public.can_manage_job(a.job_id)));

create policy "Employers manage evaluations" on public.recruiter_evaluations
  for all using (exists (select 1 from public.job_applications a
    where a.id = application_id and public.can_manage_job(a.job_id)))
  with check (exists (select 1 from public.job_applications a
    where a.id = application_id and public.can_manage_job(a.job_id)));

create policy "Candidates read own interviews" on public.scheduled_interviews
  for select using (candidate_id = auth.uid());
create policy "Employers manage interviews" on public.scheduled_interviews
  for all using (public.can_manage_job(job_id)) with check (public.can_manage_job(job_id));

create policy "Users manage own saved jobs" on public.saved_jobs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create trigger job_applications_updated_at before update on public.job_applications
  for each row execute function public.update_updated_at();

-- Employers may read profile data of candidates who applied to their jobs.
create policy "Employers view applicant profiles" on public.profiles
  for select using (exists (select 1 from public.job_applications a
    where a.candidate_id = profiles.id and public.can_manage_job(a.job_id)));

do $$
declare t text;
begin
  foreach t in array array['experiences','educations','skills','projects','certifications','achievements','courses','accomplishments']
  loop
    execute format(
      'create policy "Employers view applicant %1$s" on public.%1$I for select using (exists (
         select 1 from public.job_applications a
         where a.candidate_id = %1$I.user_id and public.can_manage_job(a.job_id)))', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Notifications + support
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'general',
  title text not null,
  body text,
  link text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "Users read own notifications" on public.notifications
  for select using (user_id = auth.uid());
create policy "Users update own notifications" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users delete own notifications" on public.notifications
  for delete using (user_id = auth.uid());

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenant_organizations(id) on delete set null,
  category text not null default 'general',
  subject text not null,
  status text not null default 'open' check (status in ('open', 'pending', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  is_staff boolean not null default false,
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
create policy "Users manage own tickets" on public.support_tickets
  for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid());
create policy "Users read ticket messages" on public.support_messages
  for select using (exists (select 1 from public.support_tickets t
    where t.id = ticket_id and (t.user_id = auth.uid() or public.is_admin())));
create policy "Users post ticket messages" on public.support_messages
  for insert with check (sender_id = auth.uid() and exists (select 1 from public.support_tickets t
    where t.id = ticket_id and t.user_id = auth.uid()));
create trigger support_tickets_updated_at before update on public.support_tickets
  for each row execute function public.update_updated_at();

create or replace function public.push_notification(
  _user uuid, _kind text, _title text, _body text default null, _link text default null, _data jsonb default '{}'::jsonb
) returns void language sql security definer set search_path = public as $$
  insert into public.notifications (user_id, kind, title, body, link, data)
  values (_user, _kind, _title, _body, _link, coalesce(_data, '{}'::jsonb));
$$;
revoke execute on function public.push_notification(uuid, text, text, text, text, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Candidate embeddings (semantic matching)
-- ---------------------------------------------------------------------
create table if not exists public.candidate_embeddings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  embedding extensions.vector(1536) not null,
  source_hash text,
  model text not null default 'text-embedding-3-small',
  updated_at timestamptz not null default now()
);
create index if not exists candidate_embeddings_idx on public.candidate_embeddings
  using hnsw (embedding extensions.vector_cosine_ops);
alter table public.candidate_embeddings enable row level security;
create policy "Users manage own embedding" on public.candidate_embeddings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Application triggers: stage history + notifications
-- ---------------------------------------------------------------------
create or replace function public.on_application_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _job record;
  _msg text;
begin
  select designation, company_name, user_id into _job
  from public.employer_job_openings where id = new.job_id;

  if tg_op = 'INSERT' then
    insert into public.application_stage_history (application_id, from_stage, to_stage, actor_id, message, is_auto)
    values (new.id, null, new.stage, new.candidate_id,
            'Application received. 24-hour review SLA activated.', true);
    if _job.user_id is not null then
      perform public.push_notification(_job.user_id, 'application',
        'New application: ' || coalesce(_job.designation, 'Job'),
        'A verified candidate applied to ' || coalesce(_job.designation, 'your opening') || '.',
        '/talento-pro?view=pipe', jsonb_build_object('application_id', new.id));
    end if;
  elsif new.stage is distinct from old.stage then
    _msg := case new.stage
      when 'Shortlisted' then 'Great news. You have been shortlisted.'
      when 'Interview'   then 'You have been moved to the interview stage.'
      when 'Offer'       then 'Congratulations. An offer is on its way.'
      when 'Rejected'    then 'Thank you for applying. The team decided not to move forward.'
      when 'Withdrawn'   then 'You withdrew this application.'
      else 'Your application status changed to ' || new.stage || '.'
    end;
    insert into public.application_stage_history (application_id, from_stage, to_stage, actor_id, message, is_auto)
    values (new.id, old.stage, new.stage, auth.uid(), _msg, auth.uid() is null);
    if new.stage <> 'Withdrawn' then
      perform public.push_notification(new.candidate_id, 'application',
        coalesce(_job.designation, 'Application') || ' at ' || coalesce(_job.company_name, 'company') || ': ' || new.stage,
        _msg, '/talento-pro?view=applied', jsonb_build_object('application_id', new.id, 'stage', new.stage));
    end if;
  end if;
  return new;
end $$;

drop trigger if exists job_applications_audit on public.job_applications;
create trigger job_applications_audit after insert or update of stage on public.job_applications
  for each row execute function public.on_application_change();
