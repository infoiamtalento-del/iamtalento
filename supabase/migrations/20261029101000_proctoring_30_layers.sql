-- =====================================================================
-- 30-Layer Proctoring Architecture (6 Before + 16 During + 8 After)
-- Portable PostgreSQL + Supabase RLS/Storage integration.
-- Preserves backwards compatibility with existing assessment & CIR flows.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Upgrade proctoring_events layer_id constraint from 1..28 to 1..30
-- ---------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'proctoring_events'
      and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ilike '%layer_id%'
  loop
    execute format('alter table public.proctoring_events drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.proctoring_events
  add constraint proctoring_events_layer_id_check check (layer_id between 1 and 30);

-- ---------------------------------------------------------------------
-- 2. Canonical 30-Layer Proctoring Catalog (matches UI 1-for-1)
-- ---------------------------------------------------------------------
create table if not exists public.proctoring_layers_catalog (
  id smallint primary key check (id between 1 and 30),
  phase text not null check (phase in ('before', 'during', 'after')),
  layer_group text not null check (layer_group in ('A', 'B', 'C')),
  code text not null unique,
  name text not null,
  description text not null,
  default_severity text not null check (default_severity in ('minor', 'medium', 'critical'))
);
alter table public.proctoring_layers_catalog enable row level security;

drop policy if exists "Anyone reads proctoring layers catalog" on public.proctoring_layers_catalog;
create policy "Anyone reads proctoring layers catalog" on public.proctoring_layers_catalog
  for select to anon, authenticated using (true);

insert into public.proctoring_layers_catalog (id, phase, layer_group, code, name, description, default_severity) values
  -- Phase A: Before Assessment (Layers 1..6)
  (1,  'before', 'A', 'biometric_face_match',  'Biometric Face Match',  'AI verifies candidate identity via facial biometrics',       'critical'),
  (2,  'before', 'A', 'id_verification',       'ID Verification',       'Government ID checked against live photo',                   'critical'),
  (3,  'before', 'A', 'multi_factor_auth',     'Multi-Factor Auth',     'Email + session OTP before test access',                     'critical'),
  (4,  'before', 'A', 'live_photo_capture',    'Live Photo Capture',    'Snapshot taken at session start for audit',                  'medium'),
  (5,  'before', 'A', 'environment_scan',      'Environment Scan',      '360° room check for unauthorized materials',                 'medium'),
  (6,  'before', 'A', 'identity_confirmation', 'Identity Confirmation', 'Final identity match before test begins',                    'critical'),
  -- Phase B: During Assessment (Layers 7..22)
  (7,  'during', 'B', 'gaze_eye_tracking',     'Gaze & Eye Tracking',   'Monitors where the candidate is looking',                    'minor'),
  (8,  'during', 'B', 'behavior_monitoring',   'Behavior Monitoring',   'Flags suspicious movement patterns',                         'critical'),
  (9,  'during', 'B', 'audio_detection',       'Audio Detection',       'Detects voices, AI speech, and background audio',            'medium'),
  (10, 'during', 'B', 'browser_lockdown',      'Browser Lockdown',      'Locks browser to prevent tab switching',                     'medium'),
  (11, 'during', 'B', 'keystroke_analysis',    'Keystroke Analysis',    'Analyzes typing patterns for authenticity',                  'medium'),
  (12, 'during', 'B', 'multi_device_block',    'Multi-Device Block',    'Prevents simultaneous device usage',                         'critical'),
  (13, 'during', 'B', 'screen_recording',      'Screen Recording',      'Records full screen for post-review',                        'medium'),
  (14, 'during', 'B', 'distraction_alerts',    'Distraction Alerts',    'AI flags when candidate looks away',                         'minor'),
  (15, 'during', 'B', 'ip_geo_tracking',       'IP & Geo Tracking',     'Tracks location and IP for anomalies',                       'medium'),
  (16, 'during', 'B', 'copy_paste_block',      'Copy-Paste Block',      'Blocks all clipboard operations',                            'minor'),
  (17, 'during', 'B', 'session_time_tracking', 'Session Time Tracking', 'Flags unusual per-question timing',                          'minor'),
  (18, 'during', 'B', 'exit_monitoring',       'Exit Monitoring',       'Logs all test exit attempts',                                'medium'),
  (19, 'during', 'B', 'geo_fencing',           'Geo-Fencing',           'Restricts access to approved locations',                     'medium'),
  (20, 'during', 'B', 'proctor_live_chat',     'Proctor Live Chat',     'Real-time support during assessment',                        'minor'),
  (21, 'during', 'B', 'screenshot_block',      'Screenshot Block',      'Prevents screen capture and recording',                      'critical'),
  (22, 'during', 'B', 'vm_detection',          'VM Detection',          'Detects virtual machines and emulators',                     'critical'),
  -- Phase C: After Assessment (Layers 23..30)
  (23, 'after',  'C', 'ai_cheating_detection', 'AI Cheating Detection', 'ML algorithms flag suspicious patterns',                     'critical'),
  (24, 'after',  'C', 'chatgpt_detection',     'ChatGPT Detection',     'Identifies AI-generated responses',                          'critical'),
  (25, 'after',  'C', 'plagiarism_check',      'Plagiarism Check',      'Cross-references against known sources',                     'critical'),
  (26, 'after',  'C', 'full_session_replay',   'Full Session Replay',   'Complete video playback for review',                         'minor'),
  (27, 'after',  'C', 'integrity_score',       'Integrity Score',       'Composite score from all proctoring signals',                'minor'),
  (28, 'after',  'C', 'audit_trail',           'Audit Trail',           'Tamper-proof log of every action',                           'critical'),
  (29, 'after',  'C', 'integrity_rating',      'Integrity Rating',      'Overall candidate trustworthiness grade',                    'minor'),
  (30, 'after',  'C', 'post_test_monitoring',  'Post-Test Monitoring',  'Continued checks after submission',                          'medium')
on conflict (id) do update set
  phase = excluded.phase,
  layer_group = excluded.layer_group,
  code = excluded.code,
  name = excluded.name,
  description = excluded.description,
  default_severity = excluded.default_severity;

-- ---------------------------------------------------------------------
-- 3. Private Storage Bucket for Proctoring Audit Snapshots
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('proctoring-snapshots', 'proctoring-snapshots', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "proctoring-snapshots owner read" on storage.objects;
drop policy if exists "proctoring-snapshots owner insert" on storage.objects;
drop policy if exists "proctoring-snapshots staff read" on storage.objects;
drop policy if exists "proctoring-snapshots employer read" on storage.objects;

-- Candidates may upload and view their own audit frames, never overwrite or delete them.
create policy "proctoring-snapshots owner read" on storage.objects
  for select using (bucket_id = 'proctoring-snapshots' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "proctoring-snapshots owner insert" on storage.objects
  for insert with check (bucket_id = 'proctoring-snapshots' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "proctoring-snapshots staff read" on storage.objects
  for select using (bucket_id = 'proctoring-snapshots' and public.is_admin());
create policy "proctoring-snapshots employer read" on storage.objects
  for select using (
    bucket_id = 'proctoring-snapshots' and exists (
      select 1 from public.job_applications a
      where a.candidate_id::text = (storage.foldername(name))[1]
        and public.can_manage_job(a.job_id)
    )
  );

-- ---------------------------------------------------------------------
-- 4. Proctoring Sessions, Server-Only MFA Challenges & Live Proctor Chat
-- ---------------------------------------------------------------------
create table if not exists public.proctoring_sessions (
  attempt_id uuid primary key references public.assessment_attempts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  face_match_score numeric check (face_match_score is null or (face_match_score between 0 and 100)),
  liveness_passed boolean not null default false,
  id_verified boolean not null default false,
  id_snapshot_path text,
  mfa_verified_at timestamptz,
  baseline_snapshot_path text,
  env_scan_paths text[] not null default '{}',
  env_metrics jsonb not null default '{}'::jsonb,
  identity_confirmed_at timestamptz,
  device_fingerprint text,
  vm_flags text[] not null default '{}',
  initial_ip_hash text,
  latest_ip_hash text,
  ip_drift_count integer not null default 0,
  timezone text,
  clock_skew_ms bigint not null default 0,
  noise_floor_db numeric,
  screen_share_active boolean not null default false,
  precheck_completed boolean not null default false,
  typing_metrics jsonb not null default '{}'::jsonb,
  foreground_stats jsonb not null default '{}'::jsonb,
  replay_keyframes jsonb not null default '[]'::jsonb,
  ai_anomaly_score numeric not null default 0,
  chatgpt_risk_score numeric not null default 0,
  plagiarism_max_sim numeric not null default 0,
  collusion_flag boolean not null default false,
  chain_valid boolean not null default true,
  chain_head_hash text,
  integrity_grade text,
  post_test_summary jsonb not null default '{}'::jsonb,
  last_heartbeat_at timestamptz not null default now(),
  sealed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint proctoring_sessions_json_size check (
    octet_length(env_metrics::text) <= 16384 and
    octet_length(typing_metrics::text) <= 16384 and
    octet_length(foreground_stats::text) <= 16384 and
    octet_length(replay_keyframes::text) <= 131072 and
    octet_length(post_test_summary::text) <= 65536
  )
);
create index if not exists proctoring_sessions_user_idx on public.proctoring_sessions(user_id, created_at desc);
create index if not exists proctoring_sessions_fp_idx on public.proctoring_sessions(device_fingerprint) where device_fingerprint is not null;
create index if not exists proctoring_sessions_ip_idx on public.proctoring_sessions(initial_ip_hash) where initial_ip_hash is not null;
alter table public.proctoring_sessions enable row level security;

drop policy if exists "Users read own proctoring sessions" on public.proctoring_sessions;
drop policy if exists "Employers read applicant proctoring sessions" on public.proctoring_sessions;
create policy "Users read own proctoring sessions" on public.proctoring_sessions
  for select using (user_id = auth.uid() or public.is_admin());
create policy "Employers read applicant proctoring sessions" on public.proctoring_sessions
  for select using (exists (
    select 1 from public.job_applications a
    where a.candidate_id = proctoring_sessions.user_id and public.can_manage_job(a.job_id)
  ));

-- Server-only OTP challenge store (no client SELECT/INSERT/UPDATE policy)
create table if not exists public.proctoring_mfa_challenges (
  attempt_id uuid primary key references public.assessment_attempts(id) on delete cascade,
  code_hash text not null,
  attempts smallint not null default 0,
  expires_at timestamptz not null default (now() + interval '20 minutes'),
  created_at timestamptz not null default now()
);
alter table public.proctoring_mfa_challenges enable row level security;

drop policy if exists "Admins inspect mfa challenges" on public.proctoring_mfa_challenges;
create policy "Admins inspect mfa challenges" on public.proctoring_mfa_challenges
  for select using (public.is_admin());

-- Layer 20: Live Proctor Support Chat
create table if not exists public.proctor_chat_messages (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  sender text not null check (sender in ('candidate', 'proctor_ai', 'proctor_human')),
  body text not null check (length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists proctor_chat_attempt_idx on public.proctor_chat_messages(attempt_id, created_at asc);
alter table public.proctor_chat_messages enable row level security;

drop policy if exists "Users read own proctor chat" on public.proctor_chat_messages;
create policy "Users read own proctor chat" on public.proctor_chat_messages
  for select using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- 5. Internal Helper: Extract Request IP Hash Safely
-- ---------------------------------------------------------------------
create or replace function public._request_ip_hash()
returns text
language plpgsql stable security definer set search_path = public, extensions as $$
declare
  _raw_headers text := nullif(current_setting('request.headers', true), '');
  _hdr jsonb;
  _ip text;
begin
  if _raw_headers is not null then
    begin
      _hdr := _raw_headers::jsonb;
      _ip := coalesce(
        nullif(btrim(split_part(coalesce(_hdr ->> 'x-forwarded-for', ''), ',', 1)), ''),
        nullif(btrim(_hdr ->> 'cf-connecting-ip'), ''),
        nullif(btrim(_hdr ->> 'x-real-ip'), '')
      );
    exception when others then
      _ip := null;
    end;
  end if;
  if _ip is null then
    _ip := coalesce(nullif(current_setting('request.test_ip', true), ''), 'local-session');
  end if;
  return encode(extensions.digest(_ip, 'sha256'), 'hex');
end $$;
revoke execute on function public._request_ip_hash() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. Upgraded log_proctoring_event (Layers 1..30 + Storage Snapshot Paths)
-- ---------------------------------------------------------------------
create or replace function public.log_proctoring_event(
  p_attempt uuid, p_layer_id smallint, p_signal_code text, p_severity text,
  p_confidence numeric default 1, p_snapshot_url text default null, p_meta jsonb default '{}'::jsonb)
returns numeric
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _penalty numeric;
  _score numeric;
  _group text := case when p_layer_id <= 6 then 'A' when p_layer_id <= 22 then 'B' else 'C' end;
  _n int;
begin
  if p_layer_id not between 1 and 30
     or p_severity not in ('minor', 'medium', 'critical')
     or p_signal_code is null
     or length(btrim(p_signal_code)) = 0
     or length(p_signal_code) > 60 then
    raise exception 'Invalid proctoring event';
  end if;
  if pg_column_size(coalesce(p_meta, '{}'::jsonb)) > 4000 then
    raise exception 'Event metadata too large';
  end if;
  if p_snapshot_url is not null
     and p_snapshot_url !~* '^https?://'
     and split_part(p_snapshot_url, '/', 1) <> coalesce(_uid::text, '') then
    raise exception 'Invalid snapshot URL';
  end if;

  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status <> 'in_progress' then return _att.integrity_score; end if;

  select count(*) into _n from public.proctoring_events where attempt_id = p_attempt;
  if _n >= 1000 then return _att.integrity_score; end if;

  insert into public.proctoring_events (
    attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, snapshot_url, meta
  ) values (
    p_attempt, _uid, p_layer_id, _group, p_signal_code, p_severity,
    least(greatest(coalesce(p_confidence, 1), 0), 1),
    p_snapshot_url,
    coalesce(p_meta, '{}'::jsonb)
  );

  select coalesce(sum(case severity when 'minor' then 1 when 'medium' then 3 else 10 end * confidence), 0)
    into _penalty
  from public.proctoring_events
  where attempt_id = p_attempt;

  _score := greatest(0, round(100 - _penalty, 2));
  update public.assessment_attempts set
    integrity_score = _score,
    status = case when _score < 40 then 'invalidated' else status end
  where id = p_attempt;

  return _score;
end $$;

-- ---------------------------------------------------------------------
-- 7. Phase A (Layers 1..6): Session Init, MFA OTP & Pre-Check Gate
-- ---------------------------------------------------------------------
create or replace function public.init_proctoring_session(
  p_attempt uuid,
  p_device_fingerprint text,
  p_timezone text default null,
  p_client_epoch_ms bigint default null,
  p_vm_flags text[] default '{}'
)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _sess public.proctoring_sessions;
  _ip_hash text := public._request_ip_hash();
  _fp text := left(coalesce(nullif(btrim(p_device_fingerprint), ''), 'unknown-device'), 128);
  _tz text := left(nullif(btrim(p_timezone), ''), 80);
  _skew_ms bigint := 0;
  _vm text[] := coalesce(array(select left(btrim(f), 60) from unnest(coalesce(p_vm_flags, '{}')) f where btrim(f) <> '' limit 12), '{}');
  _id_ok boolean := false;
  _otp text;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('proctor_init', 40, interval '1 hour');

  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;

  if p_client_epoch_ms is not null then
    _skew_ms := abs((extract(epoch from now()) * 1000)::bigint - p_client_epoch_ms);
  end if;

  select (
    exists (select 1 from public.profiles where id = _uid and verification_status = 'verified') or
    exists (select 1 from public.identity_verifications where user_id = _uid and verification_status in ('verified', 'pending'))
  ) into _id_ok;

  insert into public.proctoring_sessions (
    attempt_id, user_id, id_verified, device_fingerprint, vm_flags,
    initial_ip_hash, latest_ip_hash, timezone, clock_skew_ms, last_heartbeat_at
  ) values (
    p_attempt, _uid, _id_ok, _fp, _vm,
    _ip_hash, _ip_hash, _tz, _skew_ms, now()
  )
  on conflict (attempt_id) do update set
    vm_flags = case when cardinality(excluded.vm_flags) > 0 then excluded.vm_flags else public.proctoring_sessions.vm_flags end,
    timezone = coalesce(excluded.timezone, public.proctoring_sessions.timezone),
    clock_skew_ms = greatest(public.proctoring_sessions.clock_skew_ms, excluded.clock_skew_ms),
    last_heartbeat_at = now()
  returning * into _sess;

  -- Issue a fresh 6-digit MFA code if Layer 3 is not yet verified for this attempt
  if _sess.mfa_verified_at is null then
    _otp := lpad((floor(random() * 900000) + 100000)::int::text, 6, '0');
    insert into public.proctoring_mfa_challenges (attempt_id, code_hash, attempts, expires_at)
    values (p_attempt, encode(extensions.digest(_otp, 'sha256'), 'hex'), 0, now() + interval '20 minutes')
    on conflict (attempt_id) do update set
      code_hash = excluded.code_hash,
      attempts = 0,
      expires_at = now() + interval '20 minutes';

    perform public.push_notification(
      _uid,
      'proctoring_mfa',
      'Assessment Security Code: ' || _otp,
      'Use verification code ' || _otp || ' to unlock your 30-layer proctored session.',
      null,
      jsonb_build_object('attempt_id', p_attempt, 'otp_code', _otp)
    );
  end if;

  -- Layer 19: Geo-Fencing / Clock Skew Tamper check (> 5 minutes skew)
  if _att.status = 'in_progress' and _skew_ms > 300000 and not exists (
    select 1 from public.proctoring_events where attempt_id = p_attempt and layer_id = 19 and signal_code = 'clock_skew_anomaly'
  ) then
    perform public.log_proctoring_event(
      p_attempt, 19::smallint, 'clock_skew_anomaly', 'medium', 0.8, null,
      jsonb_build_object('skew_ms', _skew_ms, 'timezone', _tz)
    );
  end if;

  -- Layer 22: VM / Emulator / Automation Renderer check
  if _att.status = 'in_progress' and cardinality(_vm) > 0 and not exists (
    select 1 from public.proctoring_events where attempt_id = p_attempt and layer_id = 22 and signal_code = 'vm_or_automation_detected'
  ) then
    perform public.log_proctoring_event(
      p_attempt, 22::smallint, 'vm_or_automation_detected', 'critical', 0.85, null,
      jsonb_build_object('flags', to_jsonb(_vm))
    );
  end if;

  select * into _att from public.assessment_attempts where id = p_attempt;
  return jsonb_build_object(
    'attempt_id', p_attempt,
    'precheck_completed', _sess.precheck_completed,
    'mfa_verified', _sess.mfa_verified_at is not null,
    'id_verified', _sess.id_verified,
    'clock_skew_ms', _sess.clock_skew_ms,
    'vm_flags', to_jsonb(_sess.vm_flags),
    'integrity_score', _att.integrity_score,
    'otp_dispatched', _sess.mfa_verified_at is null
  );
end $$;

create or replace function public.verify_proctoring_mfa(p_attempt uuid, p_code text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _ch public.proctoring_mfa_challenges;
  _sess public.proctoring_sessions;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  perform public.rate_limit_hit('proctor_mfa', 20, interval '15 minutes');

  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;

  select * into _sess from public.proctoring_sessions where attempt_id = p_attempt;
  if not found then raise exception 'Initialize proctoring session first'; end if;
  if _sess.mfa_verified_at is not null then
    return jsonb_build_object('verified', true, 'already_verified', true);
  end if;

  select * into _ch from public.proctoring_mfa_challenges where attempt_id = p_attempt for update;
  if not found or _ch.expires_at < now() then
    raise exception 'Verification code expired. Please request a new code.';
  end if;
  if _ch.attempts >= 5 then
    raise exception 'Too many incorrect OTP attempts. Please request a new code.';
  end if;

  if encode(extensions.digest(btrim(coalesce(p_code, '')), 'sha256'), 'hex') = _ch.code_hash then
    update public.proctoring_sessions set mfa_verified_at = now() where attempt_id = p_attempt;
    delete from public.proctoring_mfa_challenges where attempt_id = p_attempt;
    if _att.status = 'in_progress' and not exists (
      select 1 from public.proctoring_events where attempt_id = p_attempt and layer_id = 3 and signal_code = 'mfa_otp_verified'
    ) then
      perform public.log_proctoring_event(p_attempt, 3::smallint, 'mfa_otp_verified', 'minor', 0, null, '{"channel":"session_otp"}'::jsonb);
    end if;
    return jsonb_build_object('verified', true);
  else
    update public.proctoring_mfa_challenges set attempts = attempts + 1 where attempt_id = p_attempt;
    return jsonb_build_object('verified', false, 'remaining_attempts', greatest(0, 5 - (_ch.attempts + 1)));
  end if;
end $$;

create or replace function public.complete_proctoring_precheck(p_attempt uuid, p_payload jsonb)
returns public.proctoring_sessions
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _sess public.proctoring_sessions;
  _base_path text := nullif(btrim(p_payload ->> 'baseline_snapshot_path'), '');
  _id_path text := nullif(btrim(p_payload ->> 'id_snapshot_path'), '');
  _env_paths text[] := public._jsonb_text_array(coalesce(p_payload -> 'env_scan_paths', '[]'::jsonb));
  _face_score numeric := least(greatest(coalesce((p_payload ->> 'face_match_score')::numeric, 0), 0), 100);
  _liveness boolean := coalesce((p_payload ->> 'liveness_passed')::boolean, false);
  _id_ver boolean := coalesce((p_payload ->> 'id_verified')::boolean, false);
  _noise numeric := (p_payload ->> 'noise_floor_db')::numeric;
  _p text;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;

  select * into _sess from public.proctoring_sessions where attempt_id = p_attempt for update;
  if not found then raise exception 'Initialize proctoring session first'; end if;
  if _sess.mfa_verified_at is null then
    raise exception 'Complete Multi-Factor Auth (Layer 3) before confirming pre-check';
  end if;

  if _base_path is not null and split_part(_base_path, '/', 1) <> _uid::text then
    raise exception 'Invalid baseline snapshot path';
  end if;
  if _id_path is not null and split_part(_id_path, '/', 1) <> _uid::text then
    raise exception 'Invalid ID snapshot path';
  end if;
  foreach _p in array _env_paths loop
    if split_part(_p, '/', 1) <> _uid::text then
      raise exception 'Invalid environment scan path';
    end if;
  end loop;

  update public.proctoring_sessions set
    face_match_score = _face_score,
    liveness_passed = _liveness,
    id_verified = _sess.id_verified or _id_ver or (_id_path is not null),
    id_snapshot_path = coalesce(_id_path, id_snapshot_path),
    baseline_snapshot_path = coalesce(_base_path, baseline_snapshot_path),
    env_scan_paths = case when cardinality(_env_paths) > 0 then _env_paths else env_scan_paths end,
    env_metrics = case when jsonb_typeof(p_payload -> 'env_metrics') = 'object' then p_payload -> 'env_metrics' else env_metrics end,
    noise_floor_db = coalesce(_noise, noise_floor_db),
    identity_confirmed_at = now(),
    precheck_completed = true,
    last_heartbeat_at = now()
  where attempt_id = p_attempt
  returning * into _sess;

  -- Record zero-penalty hash-chained audit milestones for Layers 1, 2, 4, 5, 6
  if _att.status = 'in_progress' and not exists (
    select 1 from public.proctoring_events where attempt_id = p_attempt and layer_id = 6 and signal_code = 'precheck_sealed'
  ) then
    perform public.log_proctoring_event(p_attempt, 1::smallint, 'biometric_face_verified', 'minor', 0, null,
      jsonb_build_object('face_match_score', _face_score, 'liveness_passed', _liveness));
    perform public.log_proctoring_event(p_attempt, 2::smallint, 'id_check_completed', 'minor', 0, _id_path,
      jsonb_build_object('id_verified', _sess.id_verified));
    perform public.log_proctoring_event(p_attempt, 4::smallint, 'baseline_photo_captured', 'minor', 0, _base_path, '{}'::jsonb);
    perform public.log_proctoring_event(p_attempt, 5::smallint, 'environment_360_scanned', 'minor', 0, null,
      jsonb_build_object('angles', cardinality(_sess.env_scan_paths)));
    perform public.log_proctoring_event(p_attempt, 6::smallint, 'precheck_sealed', 'minor', 0, null,
      jsonb_build_object('noise_floor_db', _noise));
  end if;

  return _sess;
end $$;

-- ---------------------------------------------------------------------
-- 8. Phase B (Layers 12, 13, 15, 17, 20): Heartbeat & Live Proctor Chat
-- ---------------------------------------------------------------------
create or replace function public.heartbeat_proctoring_session(
  p_attempt uuid,
  p_device_fingerprint text,
  p_metrics jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _sess public.proctoring_sessions;
  _fp text := left(coalesce(nullif(btrim(p_device_fingerprint), ''), 'unknown-device'), 128);
  _cur_ip text := public._request_ip_hash();
  _device_conflict boolean := false;
  _ip_drift boolean := false;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;

  select * into _sess from public.proctoring_sessions where attempt_id = p_attempt for update;
  if not found then
    insert into public.proctoring_sessions (attempt_id, user_id, device_fingerprint, initial_ip_hash, latest_ip_hash)
    values (p_attempt, _uid, _fp, _cur_ip, _cur_ip)
    returning * into _sess;
  end if;

  -- Layer 12: Multi-Device Block (simultaneous lease from different device fingerprint within 45s)
  if _att.status = 'in_progress'
     and _sess.device_fingerprint is not null
     and _sess.device_fingerprint <> _fp
     and _sess.last_heartbeat_at > now() - interval '45 seconds' then
    _device_conflict := true;
    if not exists (
      select 1 from public.proctoring_events
      where attempt_id = p_attempt and layer_id = 12 and signal_code = 'concurrent_device_lease'
        and created_at > now() - interval '60 seconds'
    ) then
      perform public.log_proctoring_event(
        p_attempt, 12::smallint, 'concurrent_device_lease', 'critical', 0.9, null,
        jsonb_build_object('expected_fp', left(_sess.device_fingerprint, 16), 'seen_fp', left(_fp, 16))
      );
    end if;
  end if;

  -- Layer 15: IP & Geo Tracking (mid-session IP / VPN change)
  if _att.status = 'in_progress'
     and _sess.latest_ip_hash is not null
     and _sess.latest_ip_hash <> _cur_ip then
    _ip_drift := true;
    update public.proctoring_sessions
       set latest_ip_hash = _cur_ip, ip_drift_count = ip_drift_count + 1
     where attempt_id = p_attempt;
    perform public.log_proctoring_event(
      p_attempt, 15::smallint, 'ip_network_drift', 'medium', 0.8, null,
      jsonb_build_object('drift_number', _sess.ip_drift_count + 1)
    );
  end if;

  update public.proctoring_sessions set
    device_fingerprint = case when _device_conflict then device_fingerprint else _fp end,
    screen_share_active = coalesce((p_metrics ->> 'screen_share_active')::boolean, screen_share_active),
    typing_metrics = case when jsonb_typeof(p_metrics -> 'typing_metrics') = 'object' then p_metrics -> 'typing_metrics' else typing_metrics end,
    foreground_stats = case when jsonb_typeof(p_metrics -> 'foreground_stats') = 'object' then p_metrics -> 'foreground_stats' else foreground_stats end,
    replay_keyframes = case
      when jsonb_typeof(p_metrics -> 'replay_keyframes') = 'array'
           and octet_length((p_metrics -> 'replay_keyframes')::text) <= 120000
      then p_metrics -> 'replay_keyframes'
      else replay_keyframes
    end,
    last_heartbeat_at = now()
  where attempt_id = p_attempt
  returning * into _sess;

  select * into _att from public.assessment_attempts where id = p_attempt;
  return jsonb_build_object(
    'integrity_score', _att.integrity_score,
    'status', _att.status,
    'device_conflict', _device_conflict,
    'ip_drift', _ip_drift,
    'ip_drift_count', _sess.ip_drift_count
  );
end $$;

create or replace function public.send_proctor_chat_message(p_attempt uuid, p_body text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _clean text := btrim(coalesce(p_body, ''));
  _lower text;
  _reply text;
  _cand_msg public.proctor_chat_messages;
  _ai_msg public.proctor_chat_messages;
begin
  if _uid is null then raise exception 'Not authenticated' using errcode = '28000'; end if;
  if length(_clean) < 1 or length(_clean) > 2000 then
    raise exception 'Chat message must be between 1 and 2000 characters';
  end if;
  perform public.rate_limit_hit('proctor_chat', 30, interval '1 hour');

  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid;
  if not found then raise exception 'Attempt not found'; end if;

  insert into public.proctor_chat_messages (attempt_id, user_id, sender, body)
  values (p_attempt, _uid, 'candidate', _clean)
  returning * into _cand_msg;

  if _att.status = 'in_progress' then
    perform public.log_proctoring_event(p_attempt, 20::smallint, 'proctor_chat_support', 'minor', 0, null, '{"sender":"candidate"}'::jsonb);
  end if;

  _lower := lower(_clean);
  if _lower ~ '(camera|webcam|video|face|light)' then
    _reply := 'Proctor Desk: Your camera incident has been noted on the audit log. Keep your face centered with front lighting; if the stream momentarily drops, stay in fullscreen while it reconnects.';
  elsif _lower ~ '(mic|audio|sound|noise|voice)' then
    _reply := 'Proctor Desk: Ambient noise note recorded. Brief background sounds will not invalidate your test—avoid speaking aloud or playing media.';
  elsif _lower ~ '(fullscreen|screen|tab|window|popup|notification)' then
    _reply := 'Proctor Desk: Use the "Return to Fullscreen" button in the top bar immediately. Accidental OS popups are reviewed in context alongside your session timeline.';
  elsif _lower ~ '(time|timer|clock|disconnect|internet|wifi|network)' then
    _reply := 'Proctor Desk: Every answer is autosaved to the server as you select or type it. Your server timer continues securely and saved answers are always graded even if your network blips.';
  else
    _reply := 'Proctor Desk: Message logged onto your tamper-proof audit trail (Current Integrity: ' || round(_att.integrity_score)::text || '%). Stay in fullscreen and continue your assessment—a human reviewer will see this note.';
  end if;

  insert into public.proctor_chat_messages (attempt_id, user_id, sender, body)
  values (p_attempt, _uid, 'proctor_ai', _reply)
  returning * into _ai_msg;

  return jsonb_build_object(
    'candidate_message', to_jsonb(_cand_msg),
    'proctor_reply', to_jsonb(_ai_msg)
  );
end $$;

-- ---------------------------------------------------------------------
-- 9. Phase C (Layers 23..30): Cryptographic Chain Verifier & Post-Test Audit
-- ---------------------------------------------------------------------
create or replace function public.verify_proctoring_chain(p_attempt uuid)
returns jsonb
language plpgsql stable security definer set search_path = public, extensions as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _allowed boolean := false;
  r record;
  _prev text := 'GENESIS';
  _expected text;
  _count int := 0;
  _valid boolean := true;
  _broken_id bigint := null;
begin
  select * into _att from public.assessment_attempts where id = p_attempt;
  if not found then raise exception 'Attempt not found'; end if;

  _allowed := (_att.user_id = _uid)
    or public.is_admin()
    or auth.role() = 'service_role'
    or exists (
      select 1 from public.job_applications a
      where a.candidate_id = _att.user_id and public.can_manage_job(a.job_id)
    );
  if not _allowed then raise exception 'Attempt not found'; end if;

  for r in
    select * from public.proctoring_events where attempt_id = p_attempt order by id asc
  loop
    _count := _count + 1;
    _expected := encode(extensions.digest(
      _prev || '|' || r.attempt_id::text || '|' || extract(epoch from r.created_at)::text
        || '|' || r.layer_id::text || '|' || r.signal_code || '|' || coalesce(r.snapshot_url, ''),
      'sha256'), 'hex');
    if r.prev_hash is distinct from _prev or r.event_hash is distinct from _expected then
      _valid := false;
      _broken_id := r.id;
      exit;
    end if;
    _prev := r.event_hash;
  end loop;

  return jsonb_build_object(
    'valid', _valid,
    'event_count', _count,
    'head_hash', _prev,
    'broken_at_id', _broken_id
  );
end $$;

create or replace function public.finalize_proctoring_audit(
  p_attempt uuid,
  p_client_summary jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _sess public.proctoring_sessions;
  _fast_correct int := 0;
  _focus_events int := 0;
  _ai_score numeric := 0;
  _chatgpt_score numeric := 0;
  _llm_hits int := 0;
  _plag_sim numeric := 0;
  _collusion boolean := false;
  _chain jsonb;
  _grade text;
  _post_penalty numeric := 0;
  _final_integrity numeric;
  _summary jsonb;
  r record;
  _txt text;
  _sim numeric;
  _kc_ratio numeric;
  _paste_bursts int;
begin
  select * into _att from public.assessment_attempts where id = p_attempt;
  if not found or (_att.user_id is distinct from _uid and not public.is_admin() and auth.role() <> 'service_role') then
    raise exception 'Attempt not found';
  end if;

  insert into public.proctoring_sessions (attempt_id, user_id)
  values (p_attempt, _att.user_id)
  on conflict (attempt_id) do nothing;

  select * into _sess from public.proctoring_sessions where attempt_id = p_attempt for update;

  -- Idempotent return if already sealed
  if _sess.sealed_at is not null then
    _chain := public.verify_proctoring_chain(p_attempt);
    return _sess.post_test_summary || jsonb_build_object('chain', _chain, 'sealed_at', _sess.sealed_at);
  end if;

  -- Layer 23: AI Cheating Detection (sub-1.5s correct answers + focus/behavior clustering)
  select count(*) into _fast_correct
  from public.attempt_item_responses
  where attempt_id = p_attempt and is_correct is true and latency_ms is not null and latency_ms < 1500;

  select count(*) into _focus_events
  from public.proctoring_events
  where attempt_id = p_attempt and layer_id in (7, 8, 9, 10, 12, 14, 18) and confidence > 0;

  _ai_score := least(100, round(
    _fast_correct * 22 + _focus_events * 7
    + coalesce((p_client_summary ->> 'hidden_answer_correlations')::numeric, 0) * 18, 2
  ));

  -- Layer 24: ChatGPT / LLM Stylometry & Keystroke Authenticity Detection
  _kc_ratio := coalesce((p_client_summary ->> 'keystroke_char_ratio')::numeric, 1);
  _paste_bursts := coalesce((p_client_summary ->> 'paste_burst_count')::int, 0);

  for r in
    select coalesce(response ->> 'text', response ->> 'code', '') as body
    from public.attempt_item_responses
    where attempt_id = p_attempt
  loop
    _txt := lower(btrim(r.body));
    if length(_txt) >= 40 then
      if _txt ~ '(as an ai language model|certainly! here|in conclusion, it is|furthermore, it is important to note|delve into the intricacies|here is a comprehensive breakdown)' then
        _llm_hits := _llm_hits + 1;
      end if;
    end if;
  end loop;

  _chatgpt_score := least(100, round(
    _llm_hits * 45
    + (case when _kc_ratio < 0.55 then 40 when _kc_ratio < 0.75 then 20 else 0 end)
    + _paste_bursts * 20, 2
  ));

  -- Layer 25: Cross-Candidate Plagiarism Check (pg_trgm similarity across question responses)
  for r in
    select ir.question_id, lower(btrim(coalesce(ir.response ->> 'text', ir.response ->> 'code', ''))) as body
    from public.attempt_item_responses ir
    where ir.attempt_id = p_attempt
      and length(btrim(coalesce(ir.response ->> 'text', ir.response ->> 'code', ''))) >= 40
  loop
    select coalesce(max(extensions.similarity(
      left(r.body, 2000),
      left(lower(btrim(coalesce(o.response ->> 'text', o.response ->> 'code', ''))), 2000)
    )), 0)
    into _sim
    from public.attempt_item_responses o
    join public.assessment_attempts oa on oa.id = o.attempt_id
    where o.question_id = r.question_id
      and oa.user_id <> _att.user_id
      and length(btrim(coalesce(o.response ->> 'text', o.response ->> 'code', ''))) >= 40;

    if _sim > _plag_sim then _plag_sim := round(_sim::numeric, 3); end if;
  end loop;

  -- Layer 30: Post-Test Cross-Attempt Collusion Monitoring (shared device fingerprint on same assessment within 24h)
  if _sess.device_fingerprint is not null and _sess.device_fingerprint <> 'unknown-device' then
    select exists (
      select 1
      from public.proctoring_sessions ps
      join public.assessment_attempts oa on oa.id = ps.attempt_id
      where ps.user_id <> _att.user_id
        and oa.assessment_id = _att.assessment_id
        and ps.device_fingerprint = _sess.device_fingerprint
        and ps.created_at > now() - interval '24 hours'
    ) into _collusion;
  end if;

  -- Log post-test forensic events directly onto the append-only hash chain
  if _ai_score >= 60 then
    insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, meta)
    values (p_attempt, _att.user_id, 23, 'C', 'ai_pattern_anomaly', 'critical', 0.6, jsonb_build_object('ai_anomaly_score', _ai_score));
    _post_penalty := _post_penalty + 6;
  end if;

  if _chatgpt_score >= 65 then
    insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, meta)
    values (p_attempt, _att.user_id, 24, 'C', 'llm_stylometry_detected', 'critical', 0.8, jsonb_build_object('chatgpt_risk_score', _chatgpt_score));
    _post_penalty := _post_penalty + 8;
  end if;

  if _plag_sim >= 0.80 then
    insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, meta)
    values (p_attempt, _att.user_id, 25, 'C', 'plagiarism_match_detected', 'critical', 0.9, jsonb_build_object('similarity', _plag_sim));
    _post_penalty := _post_penalty + 9;
  end if;

  if _collusion then
    insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, meta)
    values (p_attempt, _att.user_id, 30, 'C', 'cross_candidate_device_overlap', 'medium', 0.8, '{}'::jsonb);
    _post_penalty := _post_penalty + 2.4;
  end if;

  -- Final Layer 30 cryptographic seal block (zero penalty)
  insert into public.proctoring_events (attempt_id, user_id, layer_id, layer_group, signal_code, severity, confidence, meta)
  values (p_attempt, _att.user_id, 30, 'C', 'session_sealed', 'minor', 0, '{"layers_verified":30}'::jsonb);

  if _post_penalty > 0 then
    _final_integrity := greatest(0, round(_att.integrity_score - _post_penalty, 2));
    update public.assessment_attempts set
      integrity_score = _final_integrity,
      needs_manual_review = true,
      status = case when _final_integrity < 40 then 'invalidated' else status end
    where id = p_attempt
    returning * into _att;
  else
    _final_integrity := _att.integrity_score;
  end if;

  -- Layer 28: Verify full SHA-256 chain
  _chain := public.verify_proctoring_chain(p_attempt);

  -- Layer 29: Compute Integrity Rating Grade
  _grade := case
    when _att.status = 'invalidated' or _final_integrity < 40 or not coalesce((_chain ->> 'valid')::boolean, true) then 'F'
    when _final_integrity >= 95 and _ai_score < 35 and _chatgpt_score < 35 and _plag_sim < 0.5 then 'A+'
    when _final_integrity >= 85 and _ai_score < 50 and _chatgpt_score < 50 then 'A'
    when _final_integrity >= 70 then 'B'
    else 'C'
  end;

  _summary := jsonb_build_object(
    'attempt_id', p_attempt,
    'layers_total', 30,
    'integrity_score', _final_integrity,
    'integrity_grade', _grade,
    'verdict', case
      when _grade in ('A+', 'A') then 'Verified High'
      when _grade = 'B' then 'Monitored Clean'
      when _grade = 'C' then 'Review Flagged'
      else 'Invalidated'
    end,
    'ai_anomaly_score', _ai_score,
    'chatgpt_risk_score', _chatgpt_score,
    'plagiarism_max_sim', round(_plag_sim * 100, 1),
    'collusion_flag', _collusion,
    'fast_correct_count', _fast_correct,
    'chain', _chain
  );

  update public.proctoring_sessions set
    replay_keyframes = case
      when jsonb_typeof(p_client_summary -> 'replay_keyframes') = 'array'
           and octet_length((p_client_summary -> 'replay_keyframes')::text) <= 120000
      then p_client_summary -> 'replay_keyframes'
      else replay_keyframes
    end,
    typing_metrics = case when jsonb_typeof(p_client_summary -> 'typing_metrics') = 'object' then p_client_summary -> 'typing_metrics' else typing_metrics end,
    foreground_stats = case when jsonb_typeof(p_client_summary -> 'foreground_stats') = 'object' then p_client_summary -> 'foreground_stats' else foreground_stats end,
    ai_anomaly_score = _ai_score,
    chatgpt_risk_score = _chatgpt_score,
    plagiarism_max_sim = _plag_sim,
    collusion_flag = _collusion,
    chain_valid = coalesce((_chain ->> 'valid')::boolean, true),
    chain_head_hash = _chain ->> 'head_hash',
    integrity_grade = _grade,
    post_test_summary = _summary,
    sealed_at = now()
  where attempt_id = p_attempt;

  return _summary;
end $$;

-- Read complete 30-layer dossier for candidate or authorized hiring team
create or replace function public.get_proctoring_dossier(p_attempt uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
  _sess public.proctoring_sessions;
  _chain jsonb;
  _events jsonb;
  _chat_count int;
  _allowed boolean := false;
begin
  select * into _att from public.assessment_attempts where id = p_attempt;
  if not found then raise exception 'Attempt not found'; end if;

  _allowed := (_att.user_id = _uid)
    or public.is_admin()
    or auth.role() = 'service_role'
    or exists (
      select 1 from public.job_applications a
      where a.candidate_id = _att.user_id and public.can_manage_job(a.job_id)
    );
  if not _allowed then raise exception 'Attempt not found'; end if;

  select * into _sess from public.proctoring_sessions where attempt_id = p_attempt;
  _chain := public.verify_proctoring_chain(p_attempt);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'layer_id', e.layer_id,
    'layer_group', e.layer_group,
    'signal_code', e.signal_code,
    'severity', e.severity,
    'confidence', e.confidence,
    'snapshot_url', e.snapshot_url,
    'meta', e.meta,
    'prev_hash', left(e.prev_hash, 16),
    'event_hash', left(e.event_hash, 16),
    'created_at', e.created_at
  ) order by e.id asc), '[]'::jsonb)
  into _events
  from public.proctoring_events e
  where e.attempt_id = p_attempt;

  select count(*) into _chat_count from public.proctor_chat_messages where attempt_id = p_attempt;

  return jsonb_build_object(
    'attempt_id', _att.id,
    'status', _att.status,
    'integrity_score', _att.integrity_score,
    'integrity_grade', coalesce(_sess.integrity_grade, case
      when _att.integrity_score >= 95 then 'A+'
      when _att.integrity_score >= 85 then 'A'
      when _att.integrity_score >= 70 then 'B'
      when _att.integrity_score >= 40 then 'C'
      else 'F'
    end),
    'session', case when _sess.attempt_id is null then null else to_jsonb(_sess) end,
    'chain', _chain,
    'events', _events,
    'chat_messages_count', _chat_count
  );
end $$;

-- ---------------------------------------------------------------------
-- 10. Auto-seal active proctoring_sessions when submit_assessment_attempt runs
--     (Only when a proctoring_sessions row was initialized for this attempt)
-- ---------------------------------------------------------------------
create or replace function public.submit_assessment_attempt(p_attempt uuid)
returns public.assessment_attempts
language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _att public.assessment_attempts;
begin
  select * into _att from public.assessment_attempts where id = p_attempt and user_id = _uid for update;
  if not found then raise exception 'Attempt not found'; end if;
  if _att.status not in ('in_progress', 'expired') then return _att; end if;

  _att := public._grade_attempt(p_attempt);

  if exists (select 1 from public.proctoring_sessions where attempt_id = p_attempt and sealed_at is null) then
    perform public.finalize_proctoring_audit(p_attempt, '{}'::jsonb);
    select * into _att from public.assessment_attempts where id = p_attempt;
  end if;

  return _att;
end $$;

-- ---------------------------------------------------------------------
-- 11. Enrich generate_cir_report integrity section with 30-layer summary
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
  _missing int; _grade text; _dom_att uuid;
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
  select a.id, coalesce(a.percentage, 0) into _dom_att, _dom_pct from public.assessment_attempts a
    where a.journey_id = p_journey and a.assessment_id = _dom.id and a.status in ('graded', 'submitted')
    order by a.percentage desc nulls last limit 1;
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
  _grade := case when _integrity >= 95 then 'A+' when _integrity >= 85 then 'A'
                 when _integrity >= 70 then 'B' when _integrity >= 40 then 'C' else 'F' end;

  _sections := jsonb_build_object(
    'readiness',     jsonb_build_object('composite', _composite, 'tier', _tier, 'percentile', _pct),
    'domain',        jsonb_build_object('assessment', _dom.title, 'score', _dom_pct, 'skills', to_jsonb(_dom.skills), 'attempt_id', _dom_att),
    'communication', (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 1 and a.status in ('graded','submitted') limit 1),
    'psychometric',  (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 2 and a.status in ('graded','submitted') limit 1),
    'vocational',    (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 3 and a.status in ('graded','submitted') limit 1),
    'hr_judgment',   (select jsonb_build_object('score', a.percentage, 'theta', a.theta) from public.assessment_attempts a join public.assessments_catalog c on c.id = a.assessment_id where a.journey_id = p_journey and c.core_position = 4 and a.status in ('graded','submitted') limit 1),
    'ai_interview',  jsonb_build_object('score', _interview, 'completed', _interview is not null),
    'integrity',     jsonb_build_object(
                       'score', round(_integrity, 2),
                       'grade', _grade,
                       'layers_total', 30,
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
    'tier', _tier, 'percentile', _pct, 'integrity', _integrity, 'integrity_grade', _grade, 'domain', _dom.title, 'issued', now());
  insert into public.verifiable_credentials (user_id, cir_report_id, payload, payload_hash)
  values (_uid, _report.id, _payload, encode(extensions.digest(_payload::text, 'sha256'), 'hex'))
  on conflict (cir_report_id) do update set payload = excluded.payload, payload_hash = excluded.payload_hash,
    signature = null, issued_at = now();

  update public.assessment_journeys set status = 'completed', completed_at = now() where id = p_journey;
  update public.profiles set industry_readiness_score = _composite where id = _uid;
  perform public.push_notification(_uid, 'cir', 'Your Career Intelligence Report is ready',
    'Composite score ' || _composite || ' (' || _tier || ', Integrity ' || _grade || ').', '/talento-pro?view=cert', jsonb_build_object('report_id', _report.id));
  return _report;
end $$;

-- ---------------------------------------------------------------------
-- 12. Strict Function Privilege Allow-Listing
-- ---------------------------------------------------------------------
revoke execute on function
  public.init_proctoring_session(uuid, text, text, bigint, text[]),
  public.verify_proctoring_mfa(uuid, text),
  public.complete_proctoring_precheck(uuid, jsonb),
  public.heartbeat_proctoring_session(uuid, text, jsonb),
  public.send_proctor_chat_message(uuid, text),
  public.verify_proctoring_chain(uuid),
  public.finalize_proctoring_audit(uuid, jsonb),
  public.get_proctoring_dossier(uuid),
  public.log_proctoring_event(uuid, smallint, text, text, numeric, text, jsonb),
  public.submit_assessment_attempt(uuid),
  public.generate_cir_report(uuid)
from public, anon;

grant execute on function
  public.init_proctoring_session(uuid, text, text, bigint, text[]),
  public.verify_proctoring_mfa(uuid, text),
  public.complete_proctoring_precheck(uuid, jsonb),
  public.heartbeat_proctoring_session(uuid, text, jsonb),
  public.send_proctor_chat_message(uuid, text),
  public.verify_proctoring_chain(uuid),
  public.finalize_proctoring_audit(uuid, jsonb),
  public.get_proctoring_dossier(uuid),
  public.log_proctoring_event(uuid, smallint, text, text, numeric, text, jsonb),
  public.submit_assessment_attempt(uuid),
  public.generate_cir_report(uuid)
to authenticated, service_role;
