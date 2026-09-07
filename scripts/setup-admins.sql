-- Run this AFTER creating auth users in Supabase Dashboard > Auth > Users
-- First create the 3 auth users manually, then get their UUIDs and run this:

-- Super Admin: scholarsuite25@gmail.com
INSERT INTO admin_users (id, role) 
SELECT id, 'super_admin' FROM auth.users WHERE email = 'scholarsuite25@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Content Admin: content@cluregistrydiscourse.com
INSERT INTO admin_users (id, role) 
SELECT id, 'content_admin' FROM auth.users WHERE email = 'content@cluregistrydiscourse.com'
ON CONFLICT (id) DO NOTHING;

-- Check-in Staff: checkin@cluregistrydiscourse.com
INSERT INTO admin_users (id, role) 
SELECT id, 'checkin_staff' FROM auth.users WHERE email = 'checkin@cluregistrydiscourse.com'
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT au.id, au.role, u.email 
FROM admin_users au 
JOIN auth.users u ON u.id = au.id;
