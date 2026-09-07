-- 004 — Allow public registration inserts
-- The registration form runs as anonymous user in the browser
-- Without this, participants cannot register

-- Allow anonymous users to insert registrations (public sign-up)
drop policy if exists "anon insert registrations" on registrations;
create policy "anon insert registrations" on registrations
  for insert to anon
  with check (true);

-- Allow anonymous users to check for duplicate email before inserting
drop policy if exists "anon select registrations for duplicate check" on registrations;
create policy "anon select registrations for duplicate check" on registrations
  for select to anon
  using (true);
