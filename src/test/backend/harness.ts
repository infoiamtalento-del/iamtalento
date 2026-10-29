// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import fs from "node:fs";
import path from "node:path";

/**
 * Boots a real PostgreSQL engine (PGlite), mimics the Supabase surface (auth.uid(), roles,
 * default privileges, storage tables) and applies every migration in order. pgvector is not
 * bundled with PGlite, so the vector column is swapped for text during tests only.
 */
const MIGRATIONS = path.resolve(__dirname, "../../../supabase/migrations");

export type Db = Awaited<ReturnType<typeof createDb>>;

export const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

export async function createDb() {
  const pg = new PGlite({ extensions: { pgcrypto, pg_trgm } });

  await pg.exec(`
    create schema if not exists auth; create schema if not exists extensions; create schema if not exists storage;
    create table auth.users (
      instance_id uuid default '00000000-0000-0000-0000-000000000000'::uuid,
      id uuid primary key default gen_random_uuid(),
      aud varchar(255) default 'authenticated',
      role varchar(255) default 'authenticated',
      email varchar(255),
      encrypted_password varchar(255),
      email_confirmed_at timestamptz,
      invited_at timestamptz,
      confirmation_token varchar(255) default '',
      confirmation_sent_at timestamptz,
      recovery_token varchar(255) default '',
      recovery_sent_at timestamptz,
      email_change_token_new varchar(255) default '',
      email_change varchar(255) default '',
      email_change_sent_at timestamptz,
      last_sign_in_at timestamptz,
      raw_app_meta_data jsonb default '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data jsonb default '{}'::jsonb,
      is_super_admin boolean,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      phone text,
      phone_confirmed_at timestamptz,
      phone_change text default '',
      phone_change_token varchar(255) default '',
      phone_change_sent_at timestamptz,
      email_change_token_current varchar(255) default '',
      email_change_confirm_status smallint default 0,
      banned_until timestamptz,
      reauthentication_token varchar(255) default '',
      reauthentication_sent_at timestamptz,
      is_sso_user boolean not null default false,
      deleted_at timestamptz,
      is_anonymous boolean not null default false
    );
    create table auth.identities (
      provider_id text not null,
      user_id uuid not null references auth.users(id) on delete cascade,
      identity_data jsonb not null default '{}'::jsonb,
      provider text not null,
      last_sign_in_at timestamptz,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      id uuid primary key default gen_random_uuid(),
      unique (provider_id, provider)
    );
    create or replace function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create or replace function auth.role() returns text language sql stable as
      $$ select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), 'anon') $$;
    create table storage.buckets (id text primary key, name text, public boolean default false, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid);
    alter table storage.objects enable row level security;
    create or replace function storage.foldername(n text) returns text[] language sql as $$ select string_to_array(n, '/') $$;
    create role anon nologin; create role authenticated nologin; create role service_role nologin;
    grant usage on schema public, auth, extensions, storage to anon, authenticated, service_role;
    grant select on auth.users to authenticated, service_role;
    grant all on storage.objects to authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
  `);

  for (const file of fs.readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
    const sql = fs.readFileSync(path.join(MIGRATIONS, file), "utf8")
      .replace(/create extension if not exists vector[^;]*;/g, "")
      .replace(/extensions\.vector\(1536\)/g, "text")
      .replace(/create index if not exists \w+\s+on public\.\w+\s+using hnsw[^;]*;/g, "");
    try {
      await pg.exec(sql);
    } catch (e) {
      throw new Error(`Migration ${file} failed: ${(e as Error).message}`);
    }
  }

  const claims = (sub: string, role: string) =>
    `select set_config('request.jwt.claim.sub', '${sub}', false), set_config('request.jwt.claim.role', '${role}', false)`;

  const api = {
    pg,
    /** Superuser: seeds data and plays the service role. */
    async admin() { await pg.exec(`reset role; ${claims("", "service_role")}`); },
    async user(id: string) { await pg.exec(`reset role; ${claims(id, "authenticated")}; set role authenticated`); },
    async anon() { await pg.exec(`reset role; ${claims("", "anon")}; set role anon`); },
    async q<T = Record<string, any>>(sql: string, params: unknown[] = []): Promise<T[]> {
      return (await pg.query<T>(sql, params)).rows;
    },
    /** Runs a query and returns the error message (or null if it succeeded). */
    async fails(sql: string, params: unknown[] = []): Promise<string | null> {
      try { await pg.query(sql, params); return null; } catch (e) { return (e as Error).message; }
    },
    async signUp(id: string, email: string, meta: Record<string, unknown> = {}) {
      await api.admin();
      await pg.query(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3::jsonb)`, [id, email, JSON.stringify(meta)]);
    },
  };
  return api;
}
