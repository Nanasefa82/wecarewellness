-- Setup script to create the first admin user
-- Run this in your Supabase SQL editor after running the migrations

-- First, you need to sign up a user through the Supabase Auth UI or API
-- Then run this script with the user's ID to make them an admin

-- Replace 'USER_ID_HERE' with the actual UUID of the user you want to make admin
-- You can find this in the Supabase Auth dashboard

UPDATE profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_HERE';

-- Optionally, create an admin_users record
INSERT INTO admin_users (id, profile_id, permissions)
VALUES (
  'USER_ID_HERE',
  'USER_ID_HERE',
  '{"manage_doctors": true, "manage_appointments": true, "manage_users": true, "view_analytics": true}'
);

-- Example: Create a doctor profile for testing
-- UPDATE profiles SET role = 'doctor' WHERE email = 'doctor@wecarewellness.com';

-- Verify the setup
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.is_active
FROM profiles p
WHERE p.role IN ('admin', 'doctor');