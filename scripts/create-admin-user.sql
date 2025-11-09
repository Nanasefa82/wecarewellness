-- Script to create an admin user for nanasefa@gmail.com
-- IMPORTANT: Run get-user-info.sql first to verify the user exists

-- Step 1: If you already have a user with email 'nanasefa@gmail.com'
-- Update their profile to make them admin
UPDATE profiles 
SET role = 'admin', is_active = true
WHERE email = 'nanasefa@gmail.com';

-- Step 2: If the above returns 0 rows, the profile doesn't exist
-- Create the profile using the user's UUID
INSERT INTO profiles (id, email, full_name, role, is_active)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Admin User'),
  'admin',
  true
FROM auth.users u
WHERE u.email = 'nanasefa@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true;

-- Step 3: Verify the admin user was created
SELECT 
  u.id,
  u.email,
  p.role,
  p.is_active,
  p.full_name
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'nanasefa@gmail.com';