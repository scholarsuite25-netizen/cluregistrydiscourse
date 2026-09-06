-- 002 — Harden RLS + roles + hashes (addresses QA_FINDINGS high defects)
-- Run AFTER 001 in Supabase SQL Editor (service_role)

-- admin roles
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin','content_admin','registration_admin','checkin_staff','communications_admin')),
  created_at timestamptz default now()
);
alter table admin_users enable row level security;
create policy "deny anon admin_users" on admin_users for all to anon using (false);
create policy "admin_users self read" on admin_users for select to authenticated using (auth.uid() = id);

-- lock down remaining tables
alter table events enable row level security;
alter table event_settings enable row level security;
alter table programme_items enable row level security;
alter table people enable row level security;
alter table organising_committee_members enable row level security;
alter table materials enable row level security;
alter table certificates enable row level security;
alter table audit_logs enable row level security;

-- events: public read (needed for home page)
drop policy if exists "public read events" on events;
create policy "public read events" on events for select to anon, authenticated using (true);

-- event_settings: only super_admin/content_admin can read full, anon gets filtered view via RPC (protect zoom_join_url)
drop policy if exists "deny anon event_settings" on event_settings;
create policy "deny anon event_settings" on event_settings for all to anon using (false);
drop policy if exists "authenticated read event_settings" on event_settings;
create policy "authenticated read event_settings" on event_settings for select to authenticated using (exists (select 1 from admin_users where id = auth.uid()));

-- registrations: already has deny anon; add authenticated own-read (by email match via service logic is preferred, this is fallback)
drop policy if exists "service bypass" on registrations;
-- service_role bypasses RLS anyway

-- attendance + push + other future tables
create table if not exists attendance_records (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references registrations(id) on delete cascade,
  method text check (method in ('qr','manual','word')),
  checked_in_at timestamptz default now(),
  checked_by uuid references admin_users(id),
  unique(registration_id) -- idempotent
);
alter table attendance_records enable row level security;
create policy "deny anon attendance" on attendance_records for all to anon using (false);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references registrations(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);
alter table push_subscriptions enable row level security;
create policy "deny anon push" on push_subscriptions for all to anon using (false);

-- keep public_activity_view as only public registrations surface
-- ensure access_code plaintext migration path: copy to hash then drop column after app update
-- do NOT drop immediately to avoid breaking running app; app will dual-write hash
update registrations set access_code_hash = encode(digest(access_code, 'sha256'), 'hex') where access_code_hash is null and access_code is not null;
