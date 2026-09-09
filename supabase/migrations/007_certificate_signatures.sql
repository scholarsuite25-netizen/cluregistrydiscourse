-- Certificate settings (digital signatures etc.) + signature storage bucket
-- Run in Supabase SQL Editor

-- Settings table (key/value)
create table if not exists public.certificate_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);

-- Public read for the certificate sample on the public site
drop policy if exists "cert_settings_read" on certificate_settings;
create policy "cert_settings_read" on certificate_settings
  for select to anon, authenticated
  using (true);

-- Admin write (upload/remove signatures)
drop policy if exists "admin all cert_settings" on certificate_settings;
create policy "admin all cert_settings" on certificate_settings
  for all to authenticated
  using (exists (select 1 from admin_users where id = auth.uid()))
  with check (exists (select 1 from admin_users where id = auth.uid()));

-- Storage bucket for signature images (public so they render on certificates)
insert into storage.buckets (id, name, public)
values ('certificate-signatures', 'certificate-signatures', true)
on conflict (id) do nothing;

-- Anon/authenticated can read files (public bucket renders them)
drop policy if exists "sig_public_read" on storage.objects;
create policy "sig_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'certificate-signatures');

-- Admin (authenticated) can upload/replace/delete signatures
drop policy if exists "sig_admin_write" on storage.objects;
create policy "sig_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'certificate-signatures' and exists (select 1 from admin_users where id = auth.uid()));

drop policy if exists "sig_admin_update" on storage.objects;
create policy "sig_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'certificate-signatures' and exists (select 1 from admin_users where id = auth.uid()));

drop policy if exists "sig_admin_delete" on storage.objects;
create policy "sig_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'certificate-signatures' and exists (select 1 from admin_users where id = auth.uid()));