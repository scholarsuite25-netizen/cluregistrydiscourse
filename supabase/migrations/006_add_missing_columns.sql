-- Add missing columns to organising_committee_members
ALTER TABLE organising_committee_members ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '';
ALTER TABLE organising_committee_members ADD COLUMN IF NOT EXISTS committee_role TEXT DEFAULT '';
ALTER TABLE organising_committee_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE organising_committee_members ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Add missing columns to registrations for check-in
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT false;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
