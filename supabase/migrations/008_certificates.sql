-- Issued certificate numbers for participants (stable across re-generation)
-- Run in Supabase SQL Editor

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid unique not null references public.registrations(id) on delete cascade,
  certificate_no text unique not null,
  created_at timestamptz default now()
);

alter table public.certificates enable row level security;

-- Admin (authenticated) full access — reads/writes through the admin console
drop policy if exists "cert_admin_all" on certificates;
create policy "cert_admin_all" on certificates
  for all to authenticated
  using (exists (select 1 from admin_users where id = auth.uid()))
  with check (exists (select 1 from admin_users where id = auth.uid()));