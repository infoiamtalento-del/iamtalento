-- =====================================================================
-- Assessment engine: catalog, journeys (4 core + 1 domain), attempts,
-- server-side grading, proctoring ledger, AI interviews, CIR, credentials
-- =====================================================================

create table if not exists public.assessments_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  kind text not null default 'domain' check (kind in ('core', 'domain')),
  core_position smallint check (core_position between 1 and 4),
  industry text,
  domain text,
  test_type text not null default 'Knowledge' check (test_type in ('Knowledge', 'Practical', 'Functional')),
  difficulty text not null default 'Intermediate',
  experience_levels text[] not null default '{}',
  skills text[] not null default '{}',
  duration_minutes integer not null default 30,
  question_count integer not null default 10,
  price_inr numeric not null default 0 check (price_inr >= 0),
  proctored boolean not null default true,
  passing_score numeric not null default 40,
  creator_name text,
  creator_company text,
  creator_photo_url text,
  tenant_id uuid references public.tenant_organizations(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint core_has_position check (kind <> 'core' or core_position is not null)
);
create unique index if not exists assessments_core_position_uq
  on public.assessments_catalog(core_position) where kind = 'core' and tenant_id is null;

create table if not exists public.assessment_blueprints (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  rules jsonb not null default '{"core_count": 4, "domain_count": 1, "core_first": true}'::jsonb,
  weights jsonb not null default '{"core": 0.45, "domain": 0.30, "interview": 0.15, "integrity": 0.10}'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.question_bank (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments_catalog(id) on delete cascade,
  section text,
  qtype text not null default 'mcq' check (qtype in ('mcq', 'multi', 'descriptive', 'audio', 'practical', 'coding')),
  prompt text not null,
  options jsonb,
  marks numeric not null default 1,
  negative_marks numeric not null default 0,
  irt_difficulty numeric not null default 0,
  irt_discrimination numeric not null default 1,
  irt_guessing numeric not null default 0.2,
  tags text[] not null default '{}',
  rubric jsonb,
  time_limit_sec integer,
  version integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists question_bank_assessment_idx on public.question_bank(assessment_id) where is_active;

-- Answer keys live apart from questions: no client policy exists, so only
-- SECURITY DEFINER functions and the service role can read them.
create table if not exists public.question_answer_keys (
  question_id uuid primary key references public.question_bank(id) on delete cascade,
  correct jsonb not null,
  explanation text
);

create table if not exists public.coding_test_cases (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.question_bank(id) on delete cascade,
  stdin text not null default '',
  expected_stdout text not null,
  is_hidden boolean not null default true,
  weight numeric not null default 1,
  time_limit_ms integer not null default 5000,
  memory_limit_mb integer not null default 256
);

create table if not exists public.assessment_journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  blueprint_id uuid references public.assessment_blueprints(id),
  domain_assessment_id uuid not null references public.assessments_catalog(id),
  order_id uuid,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);
create unique index if not exists assessment_journeys_active_uq
  on public.assessment_journeys(user_id, domain_assessment_id) where status = 'in_progress';

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  assessment_id uuid not null references public.assessments_catalog(id),
  journey_id uuid references public.assessment_journeys(id) on delete set null,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'graded', 'expired', 'invalidated')),
  seed text not null default encode(extensions.gen_random_bytes(8), 'hex'),
  question_order jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  server_expires_at timestamptz not null,
  submitted_at timestamptz,
  graded_at timestamptz,
  score numeric,
  max_score numeric,
  percentage numeric,
  theta numeric,
  integrity_score numeric not null default 100,
  needs_manual_review boolean not null default false
);
create unique index if not exists attempts_one_active_uq
  on public.assessment_attempts(user_id, assessment_id, coalesce(journey_id, '00000000-0000-0000-0000-000000000000'::uuid))
  where status = 'in_progress';
create index if not exists attempts_user_idx on public.assessment_attempts(user_id, started_at desc);

create table if not exists public.attempt_item_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.question_bank(id) on delete cascade,
  response jsonb,
  is_correct boolean,
  marks_awarded numeric,
  latency_ms integer,
  sandbox_log jsonb,
  saved_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table if not exists public.proctoring_events (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  layer_id smallint not null check (layer_id between 1 and 28),
  layer_group text not null check (layer_group in ('A', 'B', 'C')),
  signal_code text not null,
  severity text not null check (severity in ('minor', 'medium', 'critical')),
  confidence numeric not null default 1 check (confidence between 0 and 1),
  snapshot_url text,
  meta jsonb not null default '{}'::jsonb,
  prev_hash text,
  event_hash text,
  created_at timestamptz not null default now()
);
create index if not exists proctoring_attempt_idx on public.proctoring_events(attempt_id, id);

create table if not exists public.ai_interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  journey_id uuid references public.assessment_journeys(id) on delete set null,
  application_id uuid references public.job_applications(id) on delete set null,
  livekit_room text,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'completed', 'failed')),
  started_at timestamptz,
  ended_at timestamptz,
  recording_url text,
  rubric_scores jsonb not null default '{}'::jsonb,
  overall_score numeric check (overall_score between 0 and 100),
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_interview_transcripts (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.ai_interview_sessions(id) on delete cascade,
  speaker text not null check (speaker in ('candidate', 'linda')),
  start_ms integer not null,
  end_ms integer not null,
  text text not null,
  competency_tag text,
  score numeric,
  sentiment numeric
);
create index if not exists transcripts_session_idx on public.ai_interview_transcripts(session_id, start_ms);

create table if not exists public.cir_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  journey_id uuid not null unique references public.assessment_journeys(id) on delete cascade,
  composite_score numeric not null,
  percentile numeric,
  tier text,
  integrity_score numeric,
  sections jsonb not null default '{}'::jsonb,
  pdf_url text,
  version integer not null default 1,
  generated_at timestamptz not null default now()
);
create index if not exists cir_reports_user_idx on public.cir_reports(user_id, generated_at desc);

create table if not exists public.verifiable_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cir_report_id uuid not null unique references public.cir_reports(id) on delete cascade,
  token text not null unique default encode(extensions.gen_random_bytes(18), 'hex'),
  payload jsonb not null,
  payload_hash text not null,
  signature text,
  signing_key_id text,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 years'),
  revoked_at timestamptz
);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.assessments_catalog enable row level security;
alter table public.assessment_blueprints enable row level security;
alter table public.question_bank enable row level security;
alter table public.question_answer_keys enable row level security;
alter table public.coding_test_cases enable row level security;
alter table public.assessment_journeys enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.attempt_item_responses enable row level security;
alter table public.proctoring_events enable row level security;
alter table public.ai_interview_sessions enable row level security;
alter table public.ai_interview_transcripts enable row level security;
alter table public.cir_reports enable row level security;
alter table public.verifiable_credentials enable row level security;

create policy "Anyone browses active assessments" on public.assessments_catalog
  for select to anon, authenticated using (is_active);
create policy "Tenant members manage own assessments" on public.assessments_catalog
  for all using (public.is_tenant_member(tenant_id, array['owner','admin','recruiter']))
  with check (public.is_tenant_member(tenant_id, array['owner','admin','recruiter']));
create policy "Admins manage assessments" on public.assessments_catalog
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Anyone reads blueprints" on public.assessment_blueprints
  for select to anon, authenticated using (true);

-- question_bank / answer keys / test cases: authors only (candidates use RPCs)
create policy "Authors manage questions" on public.question_bank
  for all using (public.is_admin() or exists (select 1 from public.assessments_catalog a
    where a.id = assessment_id and public.is_tenant_member(a.tenant_id, array['owner','admin','recruiter'])))
  with check (public.is_admin() or exists (select 1 from public.assessments_catalog a
    where a.id = assessment_id and public.is_tenant_member(a.tenant_id, array['owner','admin','recruiter'])));
create policy "Authors manage answer keys" on public.question_answer_keys
  for all using (public.is_admin() or exists (select 1 from public.question_bank q
    join public.assessments_catalog a on a.id = q.assessment_id
    where q.id = question_id and public.is_tenant_member(a.tenant_id, array['owner','admin','recruiter'])))
  with check (public.is_admin());
create policy "Authors manage test cases" on public.coding_test_cases
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Users read own journeys" on public.assessment_journeys
  for select using (user_id = auth.uid());
create policy "Users read own attempts" on public.assessment_attempts
  for select using (user_id = auth.uid());
create policy "Users read own responses" on public.attempt_item_responses
  for select using (exists (select 1 from public.assessment_attempts a
    where a.id = attempt_id and a.user_id = auth.uid()));
create policy "Users read own proctoring log" on public.proctoring_events
  for select using (user_id = auth.uid());
create policy "Users read own interviews" on public.ai_interview_sessions
  for select using (user_id = auth.uid());
create policy "Users read own transcripts" on public.ai_interview_transcripts
  for select using (exists (select 1 from public.ai_interview_sessions s
    where s.id = session_id and s.user_id = auth.uid()));
create policy "Users read own CIR" on public.cir_reports
  for select using (user_id = auth.uid());
create policy "Users read own credentials" on public.verifiable_credentials
  for select using (user_id = auth.uid());
-- Employers may read CIR + credentials for candidates who applied to them.
create policy "Employers read applicant CIR" on public.cir_reports
  for select using (exists (select 1 from public.job_applications a
    where a.candidate_id = cir_reports.user_id and public.can_manage_job(a.job_id)));

-- Proctoring log is append-only and hash-chained.
create or replace function public.proctoring_chain()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare _prev text;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.attempt_id::text, 0));
  select event_hash into _prev from public.proctoring_events
    where attempt_id = new.attempt_id order by id desc limit 1;
  new.prev_hash := coalesce(_prev, 'GENESIS');
  new.created_at := coalesce(new.created_at, now());
  new.event_hash := encode(extensions.digest(
    new.prev_hash || '|' || new.attempt_id::text || '|' || extract(epoch from new.created_at)::text
      || '|' || new.layer_id::text || '|' || new.signal_code || '|' || coalesce(new.snapshot_url, ''),
    'sha256'), 'hex');
  return new;
end $$;
drop trigger if exists proctoring_events_chain on public.proctoring_events;
create trigger proctoring_events_chain before insert on public.proctoring_events
  for each row execute function public.proctoring_chain();

create or replace function public.proctoring_immutable()
returns trigger language plpgsql as $$
begin raise exception 'proctoring_events is append-only'; end $$;
drop trigger if exists proctoring_events_no_change on public.proctoring_events;
create trigger proctoring_events_no_change before update or delete on public.proctoring_events
  for each row execute function public.proctoring_immutable();

-- ---------------------------------------------------------------------
-- RPC: start a journey (4 mandatory core tests first, then ONE domain test)
-- ---------------------------------------------------------------------
create or replace function public.start_journey(p_domain_assessment_id uuid, p_order_id uuid default null)
returns public.assessment_journeys
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _domain public.assessments_catalog;
  _journey public.assessment_journeys;
  _bp uuid;
  _order public.payment_orders;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _domain from public.assessments_catalog
    where id = p_domain_assessment_id and is_active and kind = 'domain';
  if not found then raise exception 'Domain assessment not found'; end if;

  select * into _journey from public.assessment_journeys
    where user_id = _uid and domain_assessment_id = p_domain_assessment_id and status = 'in_progress';
  if found then return _journey; end if;

  if _domain.price_inr > 0 then
    select * into _order from public.payment_orders
      where id = p_order_id and user_id = _uid and item_type = 'assessment_journey'
        and item_id = p_domain_assessment_id and status = 'entitled' and consumed_at is null
      for update;
    if not found then
      raise exception 'Payment required: a paid, unused order is needed for this assessment' using errcode = 'P0402';
    end if;
    update public.payment_orders set consumed_at = now() where id = _order.id;
  end if;

  select id into _bp from public.assessment_blueprints where is_default limit 1;
  insert into public.assessment_journeys (user_id, blueprint_id, domain_assessment_id, order_id)
  values (_uid, _bp, p_domain_assessment_id, p_order_id)
  returning * into _journey;
  return _journey;
end $$;

-- Where is the candidate in the journey? Returns ordered steps with status.
create or replace function public.get_journey_progress(p_journey uuid)
returns table (step_no integer, assessment_id uuid, slug text, title text, kind text,
               status text, attempt_id uuid, percentage numeric, is_unlocked boolean)
language plpgsql stable security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _j public.assessment_journeys; _prev_done boolean := true;
        _core_done boolean := true; r record;
begin
  select * into _j from public.assessment_journeys where id = p_journey and user_id = _uid;
  if not found then raise exception 'Journey not found'; end if;

  for r in
    select c.id, c.slug, c.title, c.kind, coalesce(c.core_position, 5)::int as pos,
      (select a.id from public.assessment_attempts a where a.journey_id = p_journey and a.assessment_id = c.id
         order by (a.status in ('graded','submitted')) desc, a.started_at desc limit 1) as att
    from public.assessments_catalog c
    where (c.kind = 'core' and c.tenant_id is null and c.is_active) or c.id = _j.domain_assessment_id
    order by pos
  loop
    step_no := r.pos; assessment_id := r.id; slug := r.slug; title := r.title; kind := r.kind;
    attempt_id := r.att;
    select a.status, a.percentage into status, percentage from public.assessment_attempts a where a.id = r.att;
    status := coalesce(status, 'not_started');
    is_unlocked := _prev_done;
    _prev_done := _prev_done and status in ('graded', 'submitted');
    return next;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- RPC: start (or resume) an attempt; enforces core-first ordering
-- ---------------------------------------------------------------------
create or replace function public.start_assessment_attempt(p_journey uuid, p_assessment uuid)
returns public.assessment_attempts
language plpgsql security definer set search_path = public, extensions as $$
declare
  _uid uuid := auth.uid();
  _j public.assessment_journeys;
  _a public.assessments_catalog;
  _attempt public.assessment_attempts;
  _unlocked boolean;
  _order jsonb;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _j from public.assessment_journeys where id = p_journey and user_id = _uid and status = 'in_progress';
  if not found then raise exception 'Journey not found or already completed'; end if;
  select * into _a from public.assessments_catalog where id = p_assessment and is_active;
  if not found then raise exception 'Assessment not found'; end if;
  if not ((_a.kind = 'core' and _a.tenant_id is null) or _a.id = _j.domain_assessment_id) then
    raise exception 'This assessment is not part of the journey';
  end if;

  select * into _attempt from public.assessment_attempts
    where journey_id = p_journey and assessment_id = p_assessment and status = 'in_progress';
  if found then
    if _attempt.server_expires_at < now() then
      update public.assessment_attempts set status = 'expired' where id = _attempt.id;
    else
      return _attempt;
    end if;
  end if;

  if exists (select 1 from public.assessment_attempts
             where journey_id = p_journey and assessment_id = p_assessment and status in ('graded', 'submitted')) then
    raise exception 'This assessment is already completed for the journey';
  end if;

  select p.is_unlocked into _unlocked from public.get_journey_progress(p_journey) p where p.assessment_id = p_assessment;
  if not coalesce(_unlocked, false) then
    raise exception 'Complete the earlier tests first: core tests come before the domain test' using errcode = 'P0403';
  end if;

  -- Seeded random question order + per-question option permutation.
  select coalesce(jsonb_agg(jsonb_build_object(
           'q', t.id,
           'perm', (select coalesce(jsonb_agg(g.i order by md5(t.id::text || _uid::text || g.i::text || clock_timestamp()::text)), '[]'::jsonb)
                    from generate_series(0, greatest(coalesce(jsonb_array_length(t.options), 0) - 1, -1)) as g(i))
         ) order by t.rn), '[]'::jsonb)
  into _order
  from (
    select q.id, q.options, row_number() over (order by random()) as rn
    from public.question_bank q where q.assessment_id = p_assessment and q.is_active
    order by random() limit _a.question_count
  ) t;

  if jsonb_array_length(_order) = 0 then raise exception 'This assessment has no questions yet'; end if;

  insert into public.assessment_attempts (user_id, assessment_id, journey_id, question_order, server_expires_at)
  values (_uid, p_assessment, p_journey, _order, now() + make_interval(mins => _a.duration_minutes))
  returning * into _attempt;
  return _attempt;
end $$;

-- Questions for a live attempt, WITHOUT answer keys.
create or replace function public.get_attempt_questions(p_attempt uuid)
returns table (step_no integer, question_id uuid, section text, qtype text, prompt text,
               options jsonb, marks numeric, time_limit_sec integer, saved_response jsonb)
language plpgsql stable security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _att public.assessment_attempts;
begin
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status <> 'in_progress' then raise exception 'Attempt is not in progress'; end if;
  if _att.server_expires_at < now() then raise exception 'Attempt time is over' using errcode = 'P0410'; end if;

  return query
  select (o.ord)::int, q.id, q.section, q.qtype, q.prompt,
    case when q.options is null then null else
      (select jsonb_agg(jsonb_build_object('id', pe.v::int, 'text', q.options ->> pe.v::int) order by pe.n)
       from jsonb_array_elements_text(o.item -> 'perm') with ordinality as pe(v, n)) end,
    q.marks, q.time_limit_sec,
    (select r.response from public.attempt_item_responses r where r.attempt_id = p_attempt and r.question_id = q.id)
  from jsonb_array_elements(_att.question_order) with ordinality as o(item, ord)
  join public.question_bank q on q.id = (o.item ->> 'q')::uuid
  order by o.ord;
end $$;

-- Idempotent autosave. Rejects writes after the server deadline.
create or replace function public.save_attempt_response(
  p_attempt uuid, p_question uuid, p_response jsonb, p_latency_ms integer default null)
returns void language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _att public.assessment_attempts;
begin
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid for update;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status <> 'in_progress' then raise exception 'Attempt is not in progress'; end if;
  if _att.server_expires_at < now() then raise exception 'Attempt time is over' using errcode = 'P0410'; end if;
  if not exists (select 1 from jsonb_array_elements(_att.question_order) e where (e ->> 'q')::uuid = p_question) then
    raise exception 'Question is not part of this attempt';
  end if;
  insert into public.attempt_item_responses (attempt_id, question_id, response, latency_ms, saved_at)
  values (p_attempt, p_question, p_response, p_latency_ms, now())
  on conflict (attempt_id, question_id)
  do update set response = excluded.response, latency_ms = excluded.latency_ms, saved_at = now();
end $$;

-- Server-side grading. MCQ/multi are exact; descriptive uses keyword coverage;
-- coding/practical/audio wait for the sandbox/AI grader (needs_manual_review).
create or replace function public._grade_attempt(p_attempt uuid)
returns public.assessment_attempts
language plpgsql security definer set search_path = public as $$
declare
  _att public.assessment_attempts;
  r record;
  _score numeric := 0; _max numeric := 0; _pending boolean := false;
  _awarded numeric; _ok boolean; _kw jsonb; _hits int; _total int; _txt text; _p numeric;
begin
  select * into _att from public.assessment_attempts where id = p_attempt for update;
  for r in
    select q.id, q.qtype, q.marks, q.negative_marks, k.correct, resp.response
    from jsonb_array_elements(_att.question_order) e
    join public.question_bank q on q.id = (e ->> 'q')::uuid
    left join public.question_answer_keys k on k.question_id = q.id
    left join public.attempt_item_responses resp on resp.attempt_id = p_attempt and resp.question_id = q.id
  loop
    _max := _max + r.marks; _awarded := 0; _ok := null;
    if r.response is null or r.response = 'null'::jsonb then
      _awarded := 0; _ok := false;
    elsif r.qtype = 'mcq' then
      _ok := (r.response -> 'selected') = (r.correct -> 'selected');
      _awarded := case when _ok then r.marks else -r.negative_marks end;
    elsif r.qtype = 'multi' then
      _ok := (select coalesce(jsonb_agg(x order by x), '[]') from jsonb_array_elements(r.response -> 'selected') x)
           = (select coalesce(jsonb_agg(x order by x), '[]') from jsonb_array_elements(r.correct -> 'selected') x);
      _awarded := case when _ok then r.marks else -r.negative_marks end;
    elsif r.qtype = 'descriptive' then
      _kw := coalesce(r.correct -> 'keywords', '[]'::jsonb);
      _total := jsonb_array_length(_kw);
      _txt := lower(coalesce(r.response ->> 'text', ''));
      if _total = 0 then _pending := true; _awarded := 0;
      else
        select count(*) into _hits from jsonb_array_elements_text(_kw) kw where position(lower(kw) in _txt) > 0;
        _awarded := round(r.marks * _hits::numeric / _total, 2); _ok := _hits >= ceil(_total / 2.0);
      end if;
    else
      _pending := true; _awarded := 0;
    end if;
    insert into public.attempt_item_responses (attempt_id, question_id, response, is_correct, marks_awarded)
    values (p_attempt, r.id, r.response, _ok, _awarded)
    on conflict (attempt_id, question_id) do update set is_correct = excluded.is_correct, marks_awarded = excluded.marks_awarded;
    _score := _score + _awarded;
  end loop;

  _score := greatest(_score, 0);
  _p := least(greatest(case when _max > 0 then _score / _max else 0 end, 0.02), 0.98);
  update public.assessment_attempts set
    score = _score, max_score = _max,
    percentage = round(case when _max > 0 then 100 * _score / _max else 0 end, 2),
    theta = round(least(greatest(ln(_p / (1 - _p)), -3), 3)::numeric, 3),
    needs_manual_review = _pending,
    status = case when _pending then 'submitted' else 'graded' end,
    submitted_at = coalesce(submitted_at, now()), graded_at = case when _pending then null else now() end
  where id = p_attempt returning * into _att;
  return _att;
end $$;
revoke execute on function public._grade_attempt(uuid) from public, anon, authenticated;

create or replace function public.submit_assessment_attempt(p_attempt uuid)
returns public.assessment_attempts
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _att public.assessment_attempts;
begin
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid for update;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status not in ('in_progress', 'expired') then return _att; end if;
  -- A late submit is still graded on whatever was autosaved before the deadline.
  return public._grade_attempt(p_attempt);
end $$;

-- Sandbox / AI grader posts results for practical + coding items (service role).
create or replace function public.apply_sandbox_result(p_attempt uuid, p_question uuid, p_marks numeric, p_log jsonb)
returns public.assessment_attempts
language plpgsql security definer set search_path = public as $$
declare _att public.assessment_attempts; _open int; _score numeric; _max numeric; _p numeric;
begin
  update public.attempt_item_responses set marks_awarded = p_marks, is_correct = p_marks > 0, sandbox_log = p_log
    where attempt_id = p_attempt and question_id = p_question;
  select count(*) into _open from jsonb_array_elements((select question_order from public.assessment_attempts where id = p_attempt)) e
    join public.question_bank q on q.id = (e ->> 'q')::uuid
    left join public.attempt_item_responses r on r.attempt_id = p_attempt and r.question_id = q.id
    where q.qtype in ('coding', 'practical', 'audio') and r.sandbox_log is null and r.response is not null;
  if _open = 0 then
    select coalesce(sum(marks_awarded), 0) into _score from public.attempt_item_responses where attempt_id = p_attempt;
    select coalesce(sum(q.marks), 0) into _max from jsonb_array_elements((select question_order from public.assessment_attempts where id = p_attempt)) e
      join public.question_bank q on q.id = (e ->> 'q')::uuid;
    _score := greatest(_score, 0);
    _p := least(greatest(case when _max > 0 then _score / _max else 0 end, 0.02), 0.98);
    update public.assessment_attempts set score = _score, max_score = _max,
      percentage = round(case when _max > 0 then 100 * _score / _max else 0 end, 2),
      theta = round(least(greatest(ln(_p / (1 - _p)), -3), 3)::numeric, 3),
      needs_manual_review = false, status = 'graded', graded_at = now()
    where id = p_attempt;
  end if;
  select * into _att from public.assessment_attempts where id = p_attempt;
  return _att;
end $$;
revoke execute on function public.apply_sandbox_result(uuid, uuid, numeric, jsonb) from public, anon, authenticated;
grant execute on function public.apply_sandbox_result(uuid, uuid, numeric, jsonb) to service_role;

-- ---------------------------------------------------------------------
-- RPC: proctoring event ingestion (updates live integrity score)
-- ---------------------------------------------------------------------
create or replace function public.log_proctoring_event(
  p_attempt uuid, p_layer_id smallint, p_signal_code text, p_severity text,
  p_confidence numeric default 1, p_snapshot_url text default null, p_meta jsonb default '{}'::jsonb)
returns numeric
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _att public.assessment_attempts; _penalty numeric; _score numeric;
        _group text := case when p_layer_id <= 10 then 'A' when p_layer_id <= 20 then 'B' else 'C' end;
begin
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status <> 'in_progress' then return _att.integrity_score; end if;

  insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, snapshot_url, meta)
  values (p_attempt, _uid, p_layer_id, _group, p_signal_code, p_severity, least(greatest(p_confidence, 0), 1), p_snapshot_url, coalesce(p_meta, '{}'::jsonb));

  select coalesce(sum(case severity when 'minor' then 1 when 'medium' then 3 else 10 end * confidence), 0)
    into _penalty from public.proctoring_events where attempt_id = p_attempt;
  _score := greatest(0, round(100 - _penalty, 2));
  update public.assessment_attempts set integrity_score = _score,
    status = case when _score < 40 then 'invalidated' else status end
  where id = p_attempt;
  return _score;
end $$;

-- ---------------------------------------------------------------------
-- RPC: Career Intelligence Report (8-in-1) + verifiable credential
-- ---------------------------------------------------------------------
create or replace function public.generate_cir_report(p_journey uuid)
returns public.cir_reports
language plpgsql security definer set search_path = public, extensions as $$
declare
  _uid uuid := auth.uid();
  _j public.assessment_journeys;
  _dom public.assessments_catalog;
  _w jsonb; _core_avg numeric; _dom_pct numeric; _interview numeric; _integrity numeric;
  _wc numeric; _wd numeric; _wi numeric; _wg numeric; _tot numeric; _composite numeric;
  _pct numeric; _tier text; _sections jsonb; _report public.cir_reports; _payload jsonb;
  _missing int;
begin
  select * into _j from public.assessment_journeys where id = p_journey and user_id = _uid;
  if not found then raise exception 'Journey not found'; end if;
  select * into _dom from public.assessments_catalog where id = _j.domain_assessment_id;

  select count(*) into _missing from public.get_journey_progress(p_journey) p
    where p.status not in ('graded', 'submitted');
  if _missing > 0 then raise exception 'Finish all 4 core tests and the domain test first (% remaining)', _missing; end if;

  select weights into _w from public.assessment_blueprints where id = _j.blueprint_id;
  _w := coalesce(_w, '{"core": 0.45, "domain": 0.30, "interview": 0.15, "integrity": 0.10}'::jsonb);

  select coalesce(avg(a.percentage), 0) into _core_avg from public.assessment_attempts a
    join public.assessments_catalog c on c.id = a.assessment_id
    where a.journey_id = p_journey and c.kind = 'core' and a.status in ('graded', 'submitted');
  select coalesce(max(a.percentage), 0) into _dom_pct from public.assessment_attempts a
    where a.journey_id = p_journey and a.assessment_id = _dom.id and a.status in ('graded', 'submitted');
  select s.overall_score into _interview from public.ai_interview_sessions s
    where s.user_id = _uid and s.journey_id = p_journey and s.status = 'completed'
    order by s.ended_at desc nulls last limit 1;
  select coalesce(avg(a.integrity_score), 100) into _integrity from public.assessment_attempts a where a.journey_id = p_journey;

  _wc := (_w ->> 'core')::numeric; _wd := (_w ->> 'domain')::numeric;
  _wi := case when _interview is null then 0 else (_w ->> 'interview')::numeric end;
  _wg := (_w ->> 'integrity')::numeric;
  _tot := _wc + _wd + _wi + _wg;
  _composite := round((_wc * _core_avg + _wd * _dom_pct + _wi * coalesce(_interview, 0) + _wg * _integrity) / _tot, 2);

  select case when count(*) = 0 then 50
         else round(100.0 * count(*) filter (where r.composite_score < _composite) / count(*), 1) end
    into _pct
  from public.cir_reports r join public.assessment_journeys j on j.id = r.journey_id
  where j.domain_assessment_id = _j.domain_assessment_id and r.journey_id <> p_journey;

  _tier := case when _composite >= 85 then 'Elite' when _composite >= 70 then 'Job-Ready'
                when _composite >= 55 then 'Developing' else 'Foundation' end;

  _sections := jsonb_build_object(
    'readiness',     jsonb_build_object('composite', _composite, 'tier', _tier, 'percentile', _pct),
    'domain',        jsonb_build_object('assessment', _dom.title, 'score', _dom_pct, 'skills', to_jsonb(_dom.skills)),
    'communication', (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 1 and a.status in ('graded','submitted') limit 1),
    'psychometric',  (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 2 and a.status in ('graded','submitted') limit 1),
    'vocational',    (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 3 and a.status in ('graded','submitted') limit 1),
    'hr_judgment',   (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 4 and a.status in ('graded','submitted') limit 1),
    'ai_interview',  jsonb_build_object('score', _interview, 'completed', _interview is not null),
    'integrity',     jsonb_build_object('score', _integrity,
                       'events', (select count(*) from public.proctoring_events e join public.assessment_attempts a on a.id = e.attempt_id where a.journey_id = p_journey),
                       'verdict', case when _integrity >= 90 then 'Verified High' when _integrity >= 70 then 'Review Flagged' else 'Invalidated' end),
    'pending_review', exists (select 1 from public.assessment_attempts a where a.journey_id = p_journey and a.needs_manual_review));

  insert into public.cir_reports (user_id, journey_id, composite_score, percentile, tier, integrity_score, sections)
  values (_uid, p_journey, _composite, _pct, _tier, _integrity, _sections)
  on conflict (journey_id) do update set composite_score = excluded.composite_score,
    percentile = excluded.percentile, tier = excluded.tier, integrity_score = excluded.integrity_score,
    sections = excluded.sections, version = public.cir_reports.version + 1, generated_at = now()
  returning * into _report;

  _payload := jsonb_build_object('report_id', _report.id, 'holder', _uid, 'composite', _composite,
    'tier', _tier, 'percentile', _pct, 'integrity', _integrity, 'domain', _dom.title, 'issued', now());
  insert into public.verifiable_credentials (user_id, cir_report_id, payload, payload_hash)
  values (_uid, _report.id, _payload, encode(extensions.digest(_payload::text, 'sha256'), 'hex'))
  on conflict (cir_report_id) do update set payload = excluded.payload, payload_hash = excluded.payload_hash,
    signature = null, issued_at = now();

  update public.assessment_journeys set status = 'completed', completed_at = now() where id = p_journey;
  update public.profiles set industry_readiness_score = _composite where id = _uid;
  perform public.push_notification(_uid, 'cir', 'Your Career Intelligence Report is ready',
    'Composite score ' || _composite || ' (' || _tier || ').', '/talento-pro?view=cert', jsonb_build_object('report_id', _report.id));
  return _report;
end $$;

-- Public verification (QR scan). Exposes only non-sensitive fields.
create or replace function public.verify_credential(p_token text)
returns table (valid boolean, holder_name text, composite_score numeric, tier text, domain text,
               integrity_score numeric, issued_at timestamptz, expires_at timestamptz, signed boolean)
language sql stable security definer set search_path = public as $$
  select (c.revoked_at is null and c.expires_at > now()),
         p.full_name, r.composite_score, r.tier, c.payload ->> 'domain',
         r.integrity_score, c.issued_at, c.expires_at, c.signature is not null
  from public.verifiable_credentials c
  join public.cir_reports r on r.id = c.cir_report_id
  join public.profiles p on p.id = c.user_id
  where c.token = p_token
$$;
grant execute on function public.verify_credential(text) to anon, authenticated;

create trigger assessments_catalog_updated_at before update on public.assessments_catalog
  for each row execute function public.update_updated_at();
