-- =====================================================================
-- Learning (LMS), mentorship, hackathons, event registrations
-- =====================================================================

create table if not exists public.lms_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  category text,
  level text not null default 'Beginner',
  languages text[] not null default '{EN}',
  price_inr numeric not null default 0 check (price_inr >= 0),
  original_price_inr numeric,
  instructor_name text,
  instructor_avatar_url text,
  thumbnail_url text,
  duration_hours numeric,
  rating numeric default 0,
  learners_count integer not null default 0,
  skills text[] not null default '{}',
  is_free boolean generated always as (price_inr = 0) stored,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  position integer not null,
  title text not null,
  kind text not null default 'video' check (kind in ('video', 'reading', 'quiz', 'project')),
  video_url text,
  hls_url text,
  duration_sec integer,
  content jsonb not null default '{}'::jsonb,
  is_preview boolean not null default false,
  unique (course_id, position)
);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  order_id uuid references public.payment_orders(id),
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  progress_pct numeric not null default 0,
  completed_module_ids uuid[] not null default '{}',
  last_module_id uuid references public.lms_modules(id) on delete set null,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create table if not exists public.mentor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  headline text,
  bio text,
  expertise text[] not null default '{}',
  languages text[] not null default '{EN}',
  hourly_rate_inr numeric not null default 0,
  rating numeric default 0,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mentor_slots (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.mentor_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  price_inr numeric not null default 0,
  status text not null default 'open' check (status in ('open', 'booked', 'cancelled')),
  unique (mentor_id, starts_at),
  check (ends_at > starts_at)
);
create index if not exists mentor_slots_open_idx on public.mentor_slots(starts_at) where status = 'open';

create table if not exists public.mentor_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.mentor_slots(id) on delete restrict,
  mentor_id uuid not null references public.mentor_profiles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.payment_orders(id),
  topic text,
  status text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled')),
  livekit_room text,
  meeting_url text,
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists mentor_bookings_active_slot_uq on public.mentor_bookings(slot_id) where status <> 'cancelled';

create table if not exists public.hackathons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  industry text,
  city text,
  mode text not null default 'offline' check (mode in ('online', 'offline', 'hybrid')),
  format text not null default 'team' check (format in ('team', 'individual', 'both')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  registration_deadline timestamptz,
  prize_pool_inr numeric not null default 0,
  entry_fee_inr numeric not null default 0,
  max_team_size integer not null default 4,
  banner_url text,
  sponsors jsonb not null default '[]'::jsonb,
  status text not null default 'open' check (status in ('draft', 'open', 'live', 'judging', 'completed')),
  tenant_id uuid references public.tenant_organizations(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.hackathon_teams (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  name text not null,
  leader_id uuid not null references public.profiles(id) on delete cascade,
  invite_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  created_at timestamptz not null default now(),
  unique (hackathon_id, name)
);

create table if not exists public.hackathon_registrations (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  team_id uuid references public.hackathon_teams(id) on delete set null,
  order_id uuid references public.payment_orders(id),
  status text not null default 'registered' check (status in ('registered', 'checked_in', 'withdrawn')),
  registered_at timestamptz not null default now(),
  unique (hackathon_id, user_id)
);

create table if not exists public.hackathon_submissions (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  team_id uuid references public.hackathon_teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  repo_url text,
  demo_url text,
  submitted_at timestamptz not null default now(),
  score numeric,
  rank integer,
  judge_scores jsonb not null default '[]'::jsonb,
  unique (hackathon_id, user_id)
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_kind text not null check (event_kind in ('podcast', 'webinar', 'networking', 'meetup')),
  event_ref text not null,
  city text,
  created_at timestamptz not null default now(),
  unique (user_id, event_kind, event_ref)
);

alter table public.lms_courses enable row level security;
alter table public.lms_modules enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.mentor_slots enable row level security;
alter table public.mentor_bookings enable row level security;
alter table public.hackathons enable row level security;
alter table public.hackathon_teams enable row level security;
alter table public.hackathon_registrations enable row level security;
alter table public.hackathon_submissions enable row level security;
alter table public.event_registrations enable row level security;

create policy "Anyone browses published courses" on public.lms_courses for select to anon, authenticated using (is_published);
create policy "Admins manage courses" on public.lms_courses for all using (public.is_admin()) with check (public.is_admin());

-- Modules: previews are public; the rest require an active enrollment.
create policy "Read preview or enrolled modules" on public.lms_modules for select to anon, authenticated
  using (is_preview or exists (select 1 from public.course_enrollments e
    where e.course_id = lms_modules.course_id and e.user_id = auth.uid() and e.status <> 'cancelled'));
create policy "Admins manage modules" on public.lms_modules for all using (public.is_admin()) with check (public.is_admin());

create policy "Users read own enrollments" on public.course_enrollments for select using (user_id = auth.uid());
create policy "Anyone browses mentors" on public.mentor_profiles for select to anon, authenticated using (is_active);
create policy "Mentors edit self" on public.mentor_profiles for update using (user_id = auth.uid());
create policy "Anyone browses open slots" on public.mentor_slots for select to anon, authenticated using (status = 'open' or
  exists (select 1 from public.mentor_bookings b where b.slot_id = mentor_slots.id and b.user_id = auth.uid()));
create policy "Mentors manage slots" on public.mentor_slots for all
  using (exists (select 1 from public.mentor_profiles m where m.id = mentor_id and m.user_id = auth.uid()))
  with check (exists (select 1 from public.mentor_profiles m where m.id = mentor_id and m.user_id = auth.uid()));
create policy "Users and mentors read bookings" on public.mentor_bookings for select
  using (user_id = auth.uid() or exists (select 1 from public.mentor_profiles m where m.id = mentor_id and m.user_id = auth.uid()));

create policy "Anyone browses hackathons" on public.hackathons for select to anon, authenticated using (status <> 'draft');
create policy "Tenant members manage hackathons" on public.hackathons for all
  using (public.is_tenant_member(tenant_id, array['owner','admin'])) with check (public.is_tenant_member(tenant_id, array['owner','admin']));
create policy "Members read their team" on public.hackathon_teams for select
  using (leader_id = auth.uid() or exists (select 1 from public.hackathon_registrations r where r.team_id = hackathon_teams.id and r.user_id = auth.uid()));
create policy "Users read own registrations" on public.hackathon_registrations for select using (user_id = auth.uid());
create policy "Users read own submissions" on public.hackathon_submissions for select using (user_id = auth.uid());
create policy "Users manage own event registrations" on public.event_registrations for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Entitlement helper: free item, or an entitled unconsumed order
-- ---------------------------------------------------------------------
create or replace function public._consume_order(p_order uuid, p_user uuid, p_item_type text, p_item_id uuid, p_price numeric)
returns void language plpgsql security definer set search_path = public as $$
declare _o public.payment_orders;
begin
  if coalesce(p_price, 0) = 0 then return; end if;
  select * into _o from public.payment_orders
    where id = p_order and user_id = p_user and item_type = p_item_type and item_id = p_item_id
      and status = 'entitled' and consumed_at is null for update;
  if not found then
    raise exception 'Payment required for this purchase' using errcode = 'P0402';
  end if;
  update public.payment_orders set consumed_at = now() where id = _o.id;
end $$;
revoke execute on function public._consume_order(uuid, uuid, text, uuid, numeric) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Courses
-- ---------------------------------------------------------------------
create or replace function public.enroll_in_course(p_course uuid, p_order uuid default null)
returns public.course_enrollments
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _c public.lms_courses; _e public.course_enrollments;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _c from public.lms_courses where id = p_course and is_published;
  if not found then raise exception 'Course not found'; end if;
  select * into _e from public.course_enrollments where user_id = _uid and course_id = p_course;
  if found then return _e; end if;
  perform public._consume_order(p_order, _uid, 'course', p_course, _c.price_inr);
  insert into public.course_enrollments (user_id, course_id, order_id) values (_uid, p_course, p_order) returning * into _e;
  update public.lms_courses set learners_count = learners_count + 1 where id = p_course;
  perform public.push_notification(_uid, 'learning', 'Enrolled: ' || _c.title, 'Your course is ready. Start learning.', '/learning/courses/' || _c.slug);
  return _e;
end $$;

create or replace function public.complete_module(p_course uuid, p_module uuid)
returns public.course_enrollments
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _e public.course_enrollments; _total int; _done int; _c public.lms_courses;
begin
  select * into _e from public.course_enrollments where user_id = _uid and course_id = p_course for update;
  if not found then raise exception 'Not enrolled in this course'; end if;
  if not exists (select 1 from public.lms_modules where id = p_module and course_id = p_course) then
    raise exception 'Module does not belong to this course';
  end if;
  select count(*) into _total from public.lms_modules where course_id = p_course;
  update public.course_enrollments set
    completed_module_ids = (select array(select distinct x from unnest(completed_module_ids || p_module) x)),
    last_module_id = p_module
  where id = _e.id returning * into _e;
  _done := cardinality(_e.completed_module_ids);
  update public.course_enrollments set progress_pct = round(100.0 * _done / greatest(_total, 1), 1),
    status = case when _done >= _total and _total > 0 then 'completed' else status end,
    completed_at = case when _done >= _total and _total > 0 then coalesce(completed_at, now()) else completed_at end
  where id = _e.id returning * into _e;

  if _e.status = 'completed' and not exists (
      select 1 from public.certifications where user_id = _uid and credential_id = 'COURSE-' || p_course::text) then
    select * into _c from public.lms_courses where id = p_course;
    insert into public.certifications (user_id, name, issuing_organization, issue_date, credential_id, verification_status)
    values (_uid, _c.title, 'IAmTalento Learning', current_date, 'COURSE-' || p_course::text, 'verified');
    perform public.push_notification(_uid, 'learning', 'Course completed', 'Certificate added to your profile: ' || _c.title, '/talento-pro?view=my-certifications');
  end if;
  return _e;
end $$;

-- ---------------------------------------------------------------------
-- Mentor sessions
-- ---------------------------------------------------------------------
create or replace function public.book_mentor_slot(p_slot uuid, p_topic text default null, p_order uuid default null)
returns public.mentor_bookings
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _s public.mentor_slots; _b public.mentor_bookings;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _s from public.mentor_slots where id = p_slot for update;
  if not found or _s.status <> 'open' or _s.starts_at <= now() then raise exception 'This slot is no longer available'; end if;
  perform public._consume_order(p_order, _uid, 'mentor_session', p_slot, _s.price_inr);
  update public.mentor_slots set status = 'booked' where id = p_slot;
  insert into public.mentor_bookings (slot_id, mentor_id, user_id, order_id, topic, livekit_room)
  values (p_slot, _s.mentor_id, _uid, p_order, p_topic, 'mentor-' || replace(p_slot::text, '-', ''))
  returning * into _b;
  perform public.push_notification(_uid, 'mentor', '1:1 session confirmed', 'Starts ' || to_char(_s.starts_at at time zone 'Asia/Kolkata', 'DD Mon, HH12:MI AM') || ' IST', '/talento-pro?view=learning-mentors');
  return _b;
end $$;

create or replace function public.cancel_mentor_booking(p_booking uuid)
returns void language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _b public.mentor_bookings; _s public.mentor_slots;
begin
  select * into _b from public.mentor_bookings where id = p_booking and user_id = _uid and status = 'confirmed' for update;
  if not found then raise exception 'Booking not found'; end if;
  select * into _s from public.mentor_slots where id = _b.slot_id for update;
  if _s.starts_at - now() < interval '24 hours' then raise exception 'Bookings can only be cancelled 24 hours before the session'; end if;
  update public.mentor_bookings set status = 'cancelled' where id = p_booking;
  update public.mentor_slots set status = 'open' where id = _b.slot_id;
end $$;

-- ---------------------------------------------------------------------
-- Hackathons
-- ---------------------------------------------------------------------
create or replace function public.register_for_hackathon(p_hackathon uuid, p_team_name text default null, p_order uuid default null)
returns public.hackathon_registrations
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _h public.hackathons; _team uuid; _r public.hackathon_registrations;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _h from public.hackathons where id = p_hackathon and status = 'open';
  if not found then raise exception 'Registrations are closed for this hackathon'; end if;
  if _h.registration_deadline is not null and _h.registration_deadline < now() then raise exception 'Registration deadline has passed'; end if;
  select * into _r from public.hackathon_registrations where hackathon_id = p_hackathon and user_id = _uid;
  if found then return _r; end if;
  perform public._consume_order(p_order, _uid, 'hackathon_ticket', p_hackathon, _h.entry_fee_inr);
  if p_team_name is not null and length(trim(p_team_name)) > 0 and _h.format <> 'individual' then
    insert into public.hackathon_teams (hackathon_id, name, leader_id) values (p_hackathon, trim(p_team_name), _uid) returning id into _team;
  end if;
  insert into public.hackathon_registrations (hackathon_id, user_id, team_id, order_id) values (p_hackathon, _uid, _team, p_order) returning * into _r;
  perform public.push_notification(_uid, 'hackathon', 'Registered: ' || _h.title, 'You are in. Good luck.', '/hackathon3');
  return _r;
end $$;

create or replace function public.join_hackathon_team(p_invite_code text)
returns public.hackathon_registrations
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _t public.hackathon_teams; _h public.hackathons; _size int; _r public.hackathon_registrations;
begin
  select * into _t from public.hackathon_teams where invite_code = upper(trim(p_invite_code));
  if not found then raise exception 'Invalid team invite code'; end if;
  select * into _h from public.hackathons where id = _t.hackathon_id and status = 'open';
  if not found then raise exception 'Registrations are closed for this hackathon'; end if;
  select count(*) into _size from public.hackathon_registrations where team_id = _t.id;
  if _size >= _h.max_team_size then raise exception 'This team is full'; end if;
  if _h.entry_fee_inr > 0 and not exists (select 1 from public.hackathon_registrations where hackathon_id = _h.id and user_id = _uid) then
    raise exception 'Complete your own registration payment before joining a team' using errcode = 'P0402';
  end if;
  insert into public.hackathon_registrations (hackathon_id, user_id, team_id) values (_h.id, _uid, _t.id)
  on conflict (hackathon_id, user_id) do update set team_id = excluded.team_id returning * into _r;
  return _r;
end $$;

create or replace function public.submit_hackathon_project(
  p_hackathon uuid, p_title text, p_description text default null, p_repo_url text default null, p_demo_url text default null)
returns public.hackathon_submissions
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _h public.hackathons; _reg public.hackathon_registrations; _s public.hackathon_submissions;
begin
  select * into _h from public.hackathons where id = p_hackathon;
  if not found or _h.status not in ('open', 'live') then raise exception 'Submissions are closed'; end if;
  if _h.ends_at < now() then raise exception 'The submission window has ended'; end if;
  select * into _reg from public.hackathon_registrations where hackathon_id = p_hackathon and user_id = _uid and status <> 'withdrawn';
  if not found then raise exception 'Register for the hackathon first'; end if;
  insert into public.hackathon_submissions (hackathon_id, team_id, user_id, title, description, repo_url, demo_url)
  values (p_hackathon, _reg.team_id, _uid, p_title, p_description, p_repo_url, p_demo_url)
  on conflict (hackathon_id, user_id) do update set title = excluded.title, description = excluded.description,
    repo_url = excluded.repo_url, demo_url = excluded.demo_url, submitted_at = now()
  returning * into _s;
  return _s;
end $$;

create or replace function public.register_for_event(p_kind text, p_ref text, p_city text default null)
returns public.event_registrations
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _r public.event_registrations;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  insert into public.event_registrations (user_id, event_kind, event_ref, city) values (_uid, p_kind, p_ref, p_city)
  on conflict (user_id, event_kind, event_ref) do update set city = coalesce(excluded.city, public.event_registrations.city)
  returning * into _r;
  return _r;
end $$;
