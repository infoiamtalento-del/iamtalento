-- =====================================================================
-- Stage 3: Employer Profile, Company Page, Dashboard & Job Sync
-- Migration: 20261029101500_employer_profile_dashboard.sql
-- =====================================================================

-- 1. Extend employers table with missing fields from UI and public company page
alter table public.employers
  add column if not exists mission text,
  add column if not exists benefits text[] not null default '{}',
  add column if not exists hq_city text,
  add column if not exists social_links jsonb not null default '{}'::jsonb,
  add column if not exists gstin text,
  add column if not exists pan text,
  add column if not exists billing_address jsonb not null default '{}'::jsonb,
  add column if not exists slug text,
  add column if not exists cover_url text,
  add column if not exists culture_tags text[] not null default '{}',
  add column if not exists hiring_regions text[] not null default '{}';

-- Validation constraints on employers
alter table public.employers
  drop constraint if exists chk_employers_mission_len,
  drop constraint if exists chk_employers_description_len,
  drop constraint if exists chk_employers_hq_city_len,
  drop constraint if exists chk_employers_company_name_len,
  drop constraint if exists chk_employers_website_url,
  drop constraint if exists chk_employers_logo_url,
  drop constraint if exists chk_employers_cover_url,
  drop constraint if exists chk_employers_gstin_format;

alter table public.employers
  add constraint chk_employers_mission_len
    check (mission is null or char_length(mission) <= 2000),
  add constraint chk_employers_description_len
    check (description is null or char_length(description) <= 5000),
  add constraint chk_employers_hq_city_len
    check (hq_city is null or char_length(hq_city) <= 100),
  add constraint chk_employers_company_name_len
    check (company_name is null or char_length(company_name) between 2 and 200),
  add constraint chk_employers_website_url
    check (website is null or website = '' or website ~* '^https?://'),
  add constraint chk_employers_logo_url
    check (logo_url is null or logo_url = '' or logo_url ~* '^https?://'),
  add constraint chk_employers_cover_url
    check (cover_url is null or cover_url = '' or cover_url ~* '^https?://'),
  add constraint chk_employers_gstin_format
    check (gstin is null or gstin = '' or gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');

-- Extend employer_job_openings with company_slug and company_logo for denormalized sync
alter table public.employer_job_openings
  add column if not exists company_slug text,
  add column if not exists company_logo text;

-- 2. Backfill existing employer slugs from tenant_organizations or company name
update public.employers e
set slug = t.slug
from public.tenant_organizations t
where e.tenant_id = t.id and e.slug is null;

update public.employers
set slug = public.generate_tenant_slug(coalesce(nullif(company_name, ''), 'company'))
where slug is null;

create unique index if not exists idx_employers_slug on public.employers(slug);

-- Backfill company_slug and company_logo on employer_job_openings
update public.employer_job_openings j
set
  company_name = coalesce(j.company_name, e.company_name),
  company_slug = coalesce(j.company_slug, e.slug),
  company_logo = coalesce(j.company_logo, e.logo_url)
from public.employers e
where (j.tenant_id = e.tenant_id or j.employer_id = e.id)
  and (j.company_name is null or j.company_slug is null or j.company_logo is null);

-- 3. PAN Encryption & Masking Utilities
create or replace function public.encrypt_pan(p_pan text)
returns text
language plpgsql
immutable
security definer
set search_path = public, extensions
as $$
declare
  _secret text := coalesce(nullif(current_setting('app.settings.jwt_secret', true), ''), 'talento_pan_master_secret_2026_key');
begin
  if p_pan is null or trim(p_pan) = '' then
    return null;
  end if;
  return extensions.armor(extensions.pgp_sym_encrypt(trim(upper(p_pan)), _secret));
end $$;

create or replace function public.decrypt_pan(p_cipher text)
returns text
language plpgsql
immutable
security definer
set search_path = public, extensions
as $$
declare
  _secret text := coalesce(nullif(current_setting('app.settings.jwt_secret', true), ''), 'talento_pan_master_secret_2026_key');
begin
  if p_cipher is null or trim(p_cipher) = '' then
    return null;
  end if;
  if p_cipher like '%BEGIN PGP MESSAGE%' then
    return extensions.pgp_sym_decrypt(extensions.dearmor(p_cipher), _secret);
  end if;
  return p_cipher;
exception when others then
  return null;
end $$;

create or replace function public.mask_pan(p_cipher_or_pan text)
returns text
language plpgsql
immutable
security definer
set search_path = public, extensions
as $$
declare
  _plain text;
begin
  if p_cipher_or_pan is null or trim(p_cipher_or_pan) = '' then
    return null;
  end if;
  if p_cipher_or_pan like '%BEGIN PGP MESSAGE%' then
    _plain := public.decrypt_pan(p_cipher_or_pan);
  else
    _plain := p_cipher_or_pan;
  end if;

  if _plain is null or length(_plain) < 10 then
    return null;
  end if;

  return 'XXXXX' || substring(_plain from 6 for 5);
end $$;

revoke all on function public.encrypt_pan(text) from public, anon, authenticated;
revoke all on function public.decrypt_pan(text) from public, anon, authenticated;
revoke all on function public.mask_pan(text) from public, anon, authenticated;
grant execute on function public.encrypt_pan(text) to service_role;
grant execute on function public.decrypt_pan(text) to service_role;
grant execute on function public.mask_pan(text) to service_role;

-- 4. Employer Profile Completion Calculator
create or replace function public.calculate_employer_completion(e public.employers)
returns integer
language plpgsql
immutable
security definer
set search_path = public
as $$
declare
  _points integer := 0;
begin
  if e is null then
    return 0;
  end if;

  if coalesce(nullif(trim(e.company_name), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.contact_name), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.official_email), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.website), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.num_employees), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.industry), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.description), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.mission), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.hq_city), ''), nullif(trim(e.address), '')) is not null then _points := _points + 1; end if;
  if coalesce(nullif(trim(e.logo_url), ''), '') <> '' then _points := _points + 1; end if;
  if coalesce(cardinality(e.benefits), 0) > 0 then _points := _points + 1; end if;

  return (_points * 100) / 11;
end $$;

revoke all on function public.calculate_employer_completion(public.employers) from public, anon, authenticated;
grant execute on function public.calculate_employer_completion(public.employers) to service_role;

-- 5. Storage: public-read bucket company-logos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'company-logos', 'company-logos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Company logos are publicly readable" on storage.objects;
create policy "Company logos are publicly readable" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'company-logos');

drop policy if exists "Tenant members with company.edit can upload logos" on storage.objects;
create policy "Tenant members with company.edit can upload logos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'company-logos' and (
      public.is_admin() or (
        split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        and public.has_tenant_permission((split_part(name, '/', 1))::uuid, 'company.edit')
      )
    )
  );

drop policy if exists "Tenant members with company.edit can update/delete logos" on storage.objects;
create policy "Tenant members with company.edit can update/delete logos" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'company-logos' and (
      public.is_admin() or (
        split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        and public.has_tenant_permission((split_part(name, '/', 1))::uuid, 'company.edit')
      )
    )
  )
  with check (
    bucket_id = 'company-logos' and (
      public.is_admin() or (
        split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        and public.has_tenant_permission((split_part(name, '/', 1))::uuid, 'company.edit')
      )
    )
  );

-- 6. Trigger: sync jobs company_name, slug and logo when employer changes
create or replace function public.employers_sync_jobs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1. Sync tenant_organizations
  if new.tenant_id is not null then
    update public.tenant_organizations
    set
      name = coalesce(new.company_name, name),
      slug = coalesce(new.slug, slug)
    where id = new.tenant_id
      and (name is distinct from new.company_name or slug is distinct from new.slug);
  end if;

  -- 2. Sync employer_job_openings
  update public.employer_job_openings
  set
    company_name = new.company_name,
    company_slug = new.slug,
    company_logo = new.logo_url
  where (tenant_id = new.tenant_id or employer_id = new.id)
    and (company_name is distinct from new.company_name
         or company_slug is distinct from new.slug
         or company_logo is distinct from new.logo_url);

  return new;
end $$;

drop trigger if exists employers_sync_jobs_trg on public.employers;
create trigger employers_sync_jobs_trg
after update of company_name, logo_url, slug, tenant_id on public.employers
for each row
execute function public.employers_sync_jobs();

-- Update jobs_protect() trigger to auto-populate company info on insert
create or replace function public.jobs_protect()
returns trigger
language plpgsql
as $$
declare
  _emp public.employers;
  _susp boolean;
begin
  if public.is_client_role() then
    if not public.has_role(auth.uid(), 'employer') and not public.is_admin() then
      raise exception 'Only employers can manage job openings' using errcode = '42501';
    end if;

    select (verification_status = 'suspended') into _susp
    from public.employers where user_id = auth.uid();
    if coalesce(_susp, false) then
      raise exception 'Suspended employer accounts cannot modify job openings' using errcode = '42501';
    end if;

    new.source := 'employer';
    if tg_op = 'INSERT' then
      new.user_id := auth.uid();
      if new.tenant_id is null then
        select tenant_id into new.tenant_id from public.employers where user_id = auth.uid();
      end if;
    else
      new.user_id := old.user_id;
    end if;

    if new.tenant_id is not null and not public.is_tenant_member(new.tenant_id, array['owner','admin','recruiter','hiring_manager']) then
      new.tenant_id := null;
    end if;

    if tg_op = 'UPDATE' then
      new.jd_embedding := old.jd_embedding;
    end if;
  end if;

  -- Populate company_name, company_slug, company_logo from employer if missing
  if new.tenant_id is not null or new.employer_id is not null then
    select * into _emp from public.employers
    where (new.tenant_id is not null and tenant_id = new.tenant_id)
       or (new.employer_id is not null and id = new.employer_id)
    limit 1;

    if _emp.id is not null then
      new.company_name := coalesce(new.company_name, _emp.company_name);
      new.company_slug := coalesce(new.company_slug, _emp.slug);
      new.company_logo := coalesce(new.company_logo, _emp.logo_url);
    end if;
  end if;

  return new;
end $$;

-- 7. RPC: get_employer_profile
create or replace function public.get_employer_profile()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _tenant_id uuid;
  _emp public.employers;
begin
  if _uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select * into _emp from public.employers where user_id = _uid;

  if _emp.id is null then
    select tenant_id into _tenant_id
    from public.tenant_memberships
    where user_id = _uid
    order by created_at asc
    limit 1;

    if _tenant_id is not null then
      select * into _emp from public.employers where tenant_id = _tenant_id;
    end if;
  end if;

  if _emp.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'id', _emp.id,
    'employer_id', _emp.employer_id,
    'tenant_id', _emp.tenant_id,
    'company_name', _emp.company_name,
    'contact_name', _emp.contact_name,
    'official_email', _emp.official_email,
    'phone', _emp.phone,
    'company_type', _emp.company_type,
    'registration_type', _emp.registration_type,
    'website', _emp.website,
    'num_employees', _emp.num_employees,
    'address', _emp.address,
    'hq_city', _emp.hq_city,
    'multiple_locations', coalesce(_emp.multiple_locations, '{}'::text[]),
    'logo_url', _emp.logo_url,
    'cover_url', _emp.cover_url,
    'description', _emp.description,
    'mission', _emp.mission,
    'established_year', _emp.established_year,
    'industry', _emp.industry,
    'benefits', coalesce(_emp.benefits, '{}'::text[]),
    'culture_tags', coalesce(_emp.culture_tags, '{}'::text[]),
    'hiring_regions', coalesce(_emp.hiring_regions, '{}'::text[]),
    'social_links', coalesce(_emp.social_links, '{}'::jsonb),
    'gstin', _emp.gstin,
    'pan', public.mask_pan(_emp.pan),
    'billing_address', coalesce(_emp.billing_address, '{}'::jsonb),
    'slug', _emp.slug,
    'email_verified', coalesce(_emp.email_verified, false),
    'phone_verified', coalesce(_emp.phone_verified, false),
    'verification_status', coalesce(_emp.verification_status, 'pending'),
    'profile_completion', coalesce(_emp.profile_completion, 0),
    'created_at', _emp.created_at,
    'updated_at', _emp.updated_at
  );
end $$;

revoke all on function public.get_employer_profile() from public, anon;
grant execute on function public.get_employer_profile() to authenticated;

-- 8. RPC: save_employer_profile
create or replace function public.save_employer_profile(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _tenant_id uuid;
  _emp public.employers;
  _new_company_name text;
  _new_website text;
  _new_logo_url text;
  _new_cover_url text;
  _new_mission text;
  _new_description text;
  _new_gstin text;
  _new_pan text;
  _new_slug text;
  _encrypted_pan text;
  _clean_slug text;
begin
  if _uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select * into _emp from public.employers where user_id = _uid;
  if _emp.id is not null then
    _tenant_id := _emp.tenant_id;
  else
    select m.tenant_id into _tenant_id
    from public.tenant_memberships m
    where m.user_id = _uid
    order by m.created_at asc
    limit 1;

    if _tenant_id is not null then
      select * into _emp from public.employers where tenant_id = _tenant_id;
    end if;
  end if;

  if _emp.id is null then
    raise exception 'Employer profile not found' using errcode = 'P0002';
  end if;

  -- Require permission company.edit
  if not public.has_tenant_permission(_tenant_id, 'company.edit') and not public.is_admin() then
    raise exception 'Unauthorized: company.edit permission required' using errcode = '42501';
  end if;

  _new_company_name := trim(coalesce(p->>'company_name', _emp.company_name, ''));
  if length(_new_company_name) < 2 then
    raise exception 'Company name must be at least 2 characters' using errcode = '22023';
  end if;
  if length(_new_company_name) > 200 then
    raise exception 'Company name cannot exceed 200 characters' using errcode = '22023';
  end if;

  _new_website := trim(coalesce(p->>'website', _emp.website, ''));
  if _new_website <> '' and _new_website !~* '^https?://' then
    raise exception 'Website must be a valid HTTP/HTTPS URL' using errcode = '22023';
  end if;

  _new_logo_url := trim(coalesce(p->>'logo_url', _emp.logo_url, ''));
  if _new_logo_url <> '' and _new_logo_url !~* '^https?://' then
    raise exception 'Logo URL must be a valid HTTP/HTTPS URL' using errcode = '22023';
  end if;

  _new_cover_url := trim(coalesce(p->>'cover_url', _emp.cover_url, ''));
  if _new_cover_url <> '' and _new_cover_url !~* '^https?://' then
    raise exception 'Cover URL must be a valid HTTP/HTTPS URL' using errcode = '22023';
  end if;

  _new_mission := trim(coalesce(p->>'mission', _emp.mission, ''));
  if length(_new_mission) > 2000 then
    raise exception 'Mission cannot exceed 2000 characters' using errcode = '22023';
  end if;

  _new_description := trim(coalesce(p->>'description', _emp.description, ''));
  if length(_new_description) > 5000 then
    raise exception 'Description cannot exceed 5000 characters' using errcode = '22023';
  end if;

  -- GSTIN validation
  if p ? 'gstin' and nullif(trim(p->>'gstin'), '') is not null then
    _new_gstin := upper(trim(p->>'gstin'));
    if _new_gstin !~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$' then
      raise exception 'Invalid GSTIN format' using errcode = '22023';
    end if;
  else
    _new_gstin := _emp.gstin;
  end if;

  -- PAN encryption
  if p ? 'pan' and nullif(trim(p->>'pan'), '') is not null then
    _new_pan := upper(trim(p->>'pan'));
    if _new_pan ~ '^X{5}[0-9]{4}[A-Z]{1}$' then
      _encrypted_pan := _emp.pan;
    else
      if _new_pan !~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' then
        raise exception 'Invalid PAN format' using errcode = '22023';
      end if;
      _encrypted_pan := public.encrypt_pan(_new_pan);
    end if;
  else
    _encrypted_pan := _emp.pan;
  end if;

  -- Slug update & validation
  if p ? 'slug' and nullif(trim(p->>'slug'), '') is not null then
    _clean_slug := lower(regexp_replace(trim(p->>'slug'), '[^a-z0-9-]+', '-', 'g'));
    _clean_slug := trim(both '-' from _clean_slug);
    if length(_clean_slug) < 2 then
      raise exception 'Slug must be at least 2 characters' using errcode = '22023';
    end if;
    if exists (select 1 from public.employers where slug = _clean_slug and id <> _emp.id) then
      raise exception 'Slug is already taken' using errcode = '23505';
    end if;
    _new_slug := _clean_slug;
  else
    _new_slug := coalesce(_emp.slug, public.generate_tenant_slug(_new_company_name));
  end if;

  update public.employers set
    company_name = _new_company_name,
    contact_name = coalesce(p->>'contact_name', contact_name),
    official_email = coalesce(p->>'official_email', official_email),
    phone = coalesce(p->>'phone', phone),
    company_type = coalesce(p->>'company_type', company_type),
    registration_type = coalesce(p->>'registration_type', registration_type),
    website = nullif(_new_website, ''),
    num_employees = coalesce(p->>'num_employees', num_employees),
    address = coalesce(p->>'address', address),
    hq_city = coalesce(p->>'hq_city', hq_city),
    multiple_locations = case when p ? 'multiple_locations' then (select coalesce(array_agg(x::text), '{}') from jsonb_array_elements_text(p->'multiple_locations') x) else multiple_locations end,
    logo_url = nullif(_new_logo_url, ''),
    cover_url = nullif(_new_cover_url, ''),
    description = nullif(_new_description, ''),
    mission = nullif(_new_mission, ''),
    established_year = case when p ? 'established_year' and (p->>'established_year') ~ '^[0-9]+$' then (p->>'established_year')::integer else established_year end,
    industry = coalesce(p->>'industry', industry),
    benefits = case when p ? 'benefits' then (select coalesce(array_agg(x::text), '{}') from jsonb_array_elements_text(p->'benefits') x) else benefits end,
    culture_tags = case when p ? 'culture_tags' then (select coalesce(array_agg(x::text), '{}') from jsonb_array_elements_text(p->'culture_tags') x) else culture_tags end,
    hiring_regions = case when p ? 'hiring_regions' then (select coalesce(array_agg(x::text), '{}') from jsonb_array_elements_text(p->'hiring_regions') x) else hiring_regions end,
    social_links = coalesce(p->'social_links', social_links),
    gstin = _new_gstin,
    pan = _encrypted_pan,
    billing_address = coalesce(p->'billing_address', billing_address),
    slug = _new_slug,
    updated_at = now()
  where id = _emp.id
  returning * into _emp;

  -- Recompute completion score
  update public.employers set
    profile_completion = public.calculate_employer_completion(_emp)
  where id = _emp.id;

  -- Audit log
  perform public.log_audit(
    _tenant_id,
    'save_employer_profile',
    'employers',
    _emp.id::text,
    jsonb_build_object('slug', _emp.slug, 'company_name', _emp.company_name)
  );

  return public.get_employer_profile();
end $$;

revoke all on function public.save_employer_profile(jsonb) from public, anon;
grant execute on function public.save_employer_profile(jsonb) to authenticated;

-- 9. RPC: get_public_company (anonymous-safe public projection)
create or replace function public.get_public_company(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _clean text := lower(trim(coalesce(p_slug, '')));
  _emp public.employers;
  _active_jobs int := 0;
begin
  if _clean = '' then
    return null;
  end if;

  select * into _emp
  from public.employers
  where slug = _clean
     or id::text = _clean
  limit 1;

  if _emp.id is null then
    select e.* into _emp
    from public.employers e
    join public.tenant_organizations t on t.id = e.tenant_id
    where t.slug = _clean
    limit 1;
  end if;

  if _emp.id is null then
    return null;
  end if;

  select count(*) into _active_jobs
  from public.employer_job_openings j
  where (j.tenant_id = _emp.tenant_id or j.employer_id = _emp.id)
    and j.status in ('active', 'open')
    and j.is_public = true;

  return jsonb_build_object(
    'id', _emp.id,
    'name', _emp.company_name,
    'slug', _emp.slug,
    'logo_url', _emp.logo_url,
    'cover_url', _emp.cover_url,
    'about', _emp.description,
    'mission', _emp.mission,
    'industry', _emp.industry,
    'size', _emp.num_employees,
    'hq', coalesce(_emp.hq_city, _emp.address),
    'website', _emp.website,
    'established_year', _emp.established_year,
    'benefits', coalesce(_emp.benefits, '{}'::text[]),
    'culture_tags', coalesce(_emp.culture_tags, '{}'::text[]),
    'hiring_regions', coalesce(_emp.hiring_regions, '{}'::text[]),
    'social_links', coalesce(_emp.social_links, '{}'::jsonb),
    'active_jobs_count', _active_jobs,
    'verified', (_emp.verification_status = 'verified')
  );
end $$;

revoke all on function public.get_public_company(text) from public;
grant execute on function public.get_public_company(text) to anon, authenticated;

-- 10. Composite Indexes for Fast Dashboard Queries (<10ms on 10k+ rows)
create index if not exists idx_employer_job_openings_tenant_status
  on public.employer_job_openings(tenant_id, status);

create index if not exists idx_job_applications_tenant_stage
  on public.job_applications(tenant_id, stage, applied_at desc);

create index if not exists idx_job_applications_sla
  on public.job_applications(tenant_id, viewed_at)
  where viewed_at is null;

create index if not exists idx_scheduled_interviews_tenant_sched
  on public.scheduled_interviews(tenant_id, status, scheduled_at);

-- 11. RPC: employer_dashboard
create or replace function public.employer_dashboard(p_tenant uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _tenant_id uuid := p_tenant;
  _emp public.employers;
  _tenant_row public.tenant_organizations;
  _open_jobs int := 0;
  _draft_jobs int := 0;
  _paused_jobs int := 0;
  _total_jobs int := 0;
  _total_applicants int := 0;
  _applicants_by_stage jsonb;
  _sla_breaches int := 0;
  _interviews_next_7_days int := 0;
  _offers_pending int := 0;
  _wallet_balance numeric := 0;
  _unread_notifications int := 0;
  _trend jsonb;
  _top_jobs jsonb;
begin
  if auth.role() = 'authenticated' and not public.is_admin() then
    if _uid is null then
      raise exception 'Not authenticated' using errcode = '28000';
    end if;
  end if;

  if _tenant_id is null then
    select tenant_id into _tenant_id
    from public.employers
    where user_id = _uid
    limit 1;

    if _tenant_id is null and _uid is not null then
      select tenant_id into _tenant_id
      from public.tenant_memberships
      where user_id = _uid
      order by created_at asc
      limit 1;
    end if;
  end if;

  if _tenant_id is null then
    raise exception 'Tenant organization not found' using errcode = 'P0002';
  end if;

  if auth.role() = 'authenticated' and not public.is_admin() then
    if not public.is_tenant_member(_tenant_id) then
      raise exception 'Unauthorized access to tenant dashboard' using errcode = '42501';
    end if;
  end if;

  select * into _tenant_row from public.tenant_organizations where id = _tenant_id;
  select * into _emp from public.employers where tenant_id = _tenant_id or id = _tenant_row.employer_id limit 1;

  -- Jobs counts
  select
    count(*) filter (where status in ('active', 'open')),
    count(*) filter (where status = 'draft'),
    count(*) filter (where status in ('paused', 'closed')),
    count(*)
  into _open_jobs, _draft_jobs, _paused_jobs, _total_jobs
  from public.employer_job_openings
  where tenant_id = _tenant_id;

  -- Applicants counts & stage breakdown
  with app_stages as (
    select stage, count(*) as cnt
    from public.job_applications a
    where a.tenant_id = _tenant_id
       or a.job_id in (select id from public.employer_job_openings where tenant_id = _tenant_id)
    group by stage
  )
  select
    coalesce(sum(cnt), 0),
    coalesce(jsonb_object_agg(stage, cnt), '{}'::jsonb)
  into _total_applicants, _applicants_by_stage
  from app_stages;

  -- SLA breaches: applied > 24 hours ago, unviewed, stage = 'Applied'
  select count(*) into _sla_breaches
  from public.job_applications a
  where (a.tenant_id = _tenant_id or a.job_id in (select id from public.employer_job_openings where tenant_id = _tenant_id))
    and a.stage = 'Applied'
    and a.viewed_at is null
    and a.applied_at < (now() - interval '24 hours');

  -- Interviews next 7 days
  select count(*) into _interviews_next_7_days
  from public.scheduled_interviews i
  where (i.tenant_id = _tenant_id or i.job_id in (select id from public.employer_job_openings where tenant_id = _tenant_id))
    and i.status = 'scheduled'
    and i.scheduled_at >= now()
    and i.scheduled_at <= (now() + interval '7 days');

  -- Offers pending
  select count(*) into _offers_pending
  from public.job_applications a
  where (a.tenant_id = _tenant_id or a.job_id in (select id from public.employer_job_openings where tenant_id = _tenant_id))
    and a.stage = 'Offer';

  -- Wallet balance
  select coalesce(balance, 0) into _wallet_balance
  from public.wallet_accounts
  where owner_type = 'tenant' and tenant_id = _tenant_id
  limit 1;

  -- Unread notifications
  if _uid is not null then
    select count(*) into _unread_notifications
    from public.notifications
    where user_id = _uid and read_at is null;
  else
    _unread_notifications := 0;
  end if;

  -- 14-day trend: daily application counts
  with dates as (
    select generate_series(
      (current_date - interval '13 days')::date,
      current_date::date,
      interval '1 day'
    )::date as day
  ),
  counts as (
    select
      d.day,
      count(a.id) as cnt
    from dates d
    left join public.job_applications a
      on a.applied_at::date = d.day
     and (a.tenant_id = _tenant_id or a.job_id in (select id from public.employer_job_openings where tenant_id = _tenant_id))
    group by d.day
    order by d.day asc
  )
  select coalesce(jsonb_agg(jsonb_build_object('date', to_char(day, 'YYYY-MM-DD'), 'count', cnt)), '[]'::jsonb)
  into _trend
  from counts;

  -- Top 5 jobs by applicants
  with job_applicant_counts as (
    select
      j.id,
      j.designation,
      j.status,
      j.created_at,
      count(a.id) as applicants_count
    from public.employer_job_openings j
    left join public.job_applications a on a.job_id = j.id
    where j.tenant_id = _tenant_id
    group by j.id, j.designation, j.status, j.created_at
    order by applicants_count desc, j.created_at desc
    limit 5
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', id,
    'title', designation,
    'status', status,
    'created_at', created_at,
    'applicants_count', applicants_count
  )), '[]'::jsonb)
  into _top_jobs
  from job_applicant_counts;

  return jsonb_build_object(
    'tenant_id', _tenant_id,
    'open_jobs', _open_jobs,
    'draft_jobs', _draft_jobs,
    'paused_jobs', _paused_jobs,
    'total_jobs', _total_jobs,
    'total_applicants', _total_applicants,
    'applicants_by_stage', coalesce(_applicants_by_stage, '{}'::jsonb),
    'sla_breaches', _sla_breaches,
    'interviews_next_7_days', _interviews_next_7_days,
    'offers_pending', _offers_pending,
    'wallet_balance', _wallet_balance,
    'plan_usage', jsonb_build_object(
      'plan', coalesce(_tenant_row.plan, 'free'),
      'tier', coalesce(_tenant_row.tier, 'pool'),
      'seats_used', (select count(*) from public.tenant_memberships where tenant_id = _tenant_id),
      'seats_limit', 5,
      'active_jobs', _open_jobs,
      'active_jobs_limit', 10
    ),
    'unread_notifications', _unread_notifications,
    'applications_trend', _trend,
    'top_jobs', _top_jobs,
    'verification_status', jsonb_build_object(
      'status', coalesce(_emp.verification_status, 'pending'),
      'email_verified', coalesce(_emp.email_verified, false),
      'phone_verified', coalesce(_emp.phone_verified, false),
      'can_post_jobs', public.employer_can(_tenant_id, 'job.post')
    )
  );
end $$;

revoke all on function public.employer_dashboard(uuid) from public, anon;
grant execute on function public.employer_dashboard(uuid) to authenticated;
