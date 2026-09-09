-- Live registrations widget: show full names of opt-in participants (no longer masked)
-- Run in Supabase SQL Editor

create or replace view public_activity_view as
select
  id,
  trim(both ' ' from (first_name || ' ' || coalesce(nullif(middle_name, '') || ' ', '') || surname)) as full_name,
  institution as organisation,
  created_at
from registrations
where status='confirmed' and deleted_at is null and public_activity_opt_in = true
order by created_at desc;

-- Give anon read access to the view (kept from before)
grant select on public_activity_view to anon, authenticated;