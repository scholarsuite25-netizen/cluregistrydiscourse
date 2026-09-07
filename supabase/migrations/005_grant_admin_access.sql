-- Grant content_admin and checkin_staff read access to all admin tables
-- Run this in Supabase SQL Editor

-- registrations: allow admin read
DROP POLICY IF EXISTS "admin read registrations" ON registrations;
CREATE POLICY "admin read registrations" ON registrations
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- registrations: allow admin update (for check-in status)
DROP POLICY IF EXISTS "admin update registrations" ON registrations;
CREATE POLICY "admin update registrations" ON registrations
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- attendance_records: allow admin full access
DROP POLICY IF EXISTS "admin all attendance" ON attendance_records;
CREATE POLICY "admin all attendance" ON attendance_records
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- programme_items: allow admin full access
DROP POLICY IF EXISTS "admin all programme" ON programme_items;
CREATE POLICY "admin all programme" ON programme_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- materials: allow admin full access
DROP POLICY IF EXISTS "admin all materials" ON materials;
CREATE POLICY "admin all materials" ON materials
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- people: allow admin full access
DROP POLICY IF EXISTS "admin all people" ON people;
CREATE POLICY "admin all people" ON people
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- events: allow admin full access
DROP POLICY IF EXISTS "admin all events" ON events;
CREATE POLICY "admin all events" ON events
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- event_settings: allow admin full access
DROP POLICY IF EXISTS "admin all event_settings" ON event_settings;
CREATE POLICY "admin all event_settings" ON event_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- certificates: allow admin full access
DROP POLICY IF EXISTS "admin all certificates" ON certificates;
CREATE POLICY "admin all certificates" ON certificates
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- audit_logs: allow admin full access
DROP POLICY IF EXISTS "admin all audit_logs" ON audit_logs;
CREATE POLICY "admin all audit_logs" ON audit_logs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- organising_committee_members: allow admin full access
DROP POLICY IF EXISTS "admin all loc" ON organising_committee_members;
CREATE POLICY "admin all loc" ON organising_committee_members
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- push_subscriptions: allow admin full access
DROP POLICY IF EXISTS "admin all push" ON push_subscriptions;
CREATE POLICY "admin all push" ON push_subscriptions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- hotels: allow admin full access (for visitors guide)
DROP POLICY IF EXISTS "admin all hotels" ON hotels;
CREATE POLICY "admin all hotels" ON hotels
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Verify
SELECT schemaname, tablename, policyname, roles, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND qual LIKE '%admin_users%'
ORDER BY tablename, policyname;
