-- Step 1: Find your user ID and check if profile exists
-- Run this first to get the correct UUID

SELECT 
  u.id as user_uuid,
  u.email,
  u.created_at,
  p.role,
  p.is_active,
  CASE 
    WHEN p.id IS NULL THEN 'NO PROFILE - Need to create one'
    ELSE 'Profile exists'
  END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'nanasefa@gmail.com';

-- If no results, the user doesn't exist in auth.users
-- You need to create the user first through Supabase Auth UI