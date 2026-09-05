-- CLU Registry Discourse — initial schema + RLS
-- Run with: supabase db push  (or paste in Supabase SQL editor)

enable extension if not exists "pgcrypto";

-- events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  date date not null,
  venue text not null,
  created_at timestamptz default now()
);

-- event_settings (editable times etc)
create table if not exists event_settings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  physical_arrival_time text,
  programme_start_time text,
  zoom_open_time text,
  online_start_time text,
  zoom_join_url text, -- protected, not public
  registration_open boolean default true,
  capacity int,
  created_at timestamptz default now()
);

-- registrations
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  title text,
  first_name text not null,
  middle_name text,
  surname text not null,
  email text not null,
  phone text not null,
  institution text not null,
  department text,
  designation text,
  participation_mode text not null check (participation_mode in ('Physical','Online')),
  accessibility text,
  consent_email boolean not null,
  whatsapp_opt_in boolean default false,
  push_opt_in boolean default false,
  public_activity_opt_in boolean default false,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled','pending')),
  access_code text unique,
  access_code_hash text,
  qr_token_hash text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);
create unique index if not exists ux_reg_email_lower on registrations (lower(email)) where deleted_at is null;
create unique index if not exists ux_reg_phone on registrations (phone) where deleted_at is null;
create index if not exists ix_reg_status on registrations(status);

-- public safe view (masked)
create or replace view public_activity_view as
select
  id,
  (first_name || ' ' || left(surname,1) || '.') as masked_name,
  institution as organisation,
  created_at
from registrations
where status='confirmed' and deleted_at is null and public_activity_opt_in = true
order by created_at desc;

-- RLS
alter table registrations enable row level security;
-- no public select * — only via safe view or anon with explicit policy? For now deny anon direct.
create policy "deny anon select registrations" on registrations for select to anon using (false);
-- authenticated participants can read own? service role bypasses. We'll add policies after auth.

-- other tables stubs
create table if not exists programme_items (id uuid primary key default gen_random_uuid(), time text, title text, speaker text, venue text, description text, display_order int, published boolean default true, created_at timestamptz default now());
create table if not exists people (id uuid primary key default gen_random_uuid(), slug text unique, name text, role text, badge text, bio text, published boolean default true);
create table if not exists organising_committee_members (id uuid primary key default gen_random_uuid(), full_name text, department text, committee_role text, display_order int, photo_url text, published boolean default false);
create table if not exists materials (id uuid primary key default gen_random_uuid(), title text, description text, category text, file_path text, mime text, size int, audience text, release_at timestamptz, published boolean default false, created_at timestamptz default now());
create table if not exists certificates (id uuid primary key default gen_random_uuid(), registration_id uuid references registrations(id), serial text unique, issued_at timestamptz default now(), revoked boolean default false);
create table if not exists audit_logs (id uuid primary key default gen_random_uuid(), actor uuid, action text, target text, meta jsonb, created_at timestamptz default now());

-- seed event
insert into events (name, title, date, venue) values ('CLU REGISTRY DISCOURSE','Governance, Innovation and Service: Changing Higher Education Management','2026-10-15','University Auditorium, Chrisland University, Abeokuta') on conflict do nothing;
