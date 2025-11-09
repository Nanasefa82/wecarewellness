-- Check the role of the user who is trying to log in
-- Replace 'nanasefa@gmail.com' with the email you're using to log in

SELECT 
  u.id,
  u.email,
  u.created_at,
  p.role,
  p.is_active,
  p.full_name,
  CASE 
    WHEN p.role IN ('admin', 'doctor') AND p.is_active = true THEN 'CAN ACCESS ADMIN'
    WHEN p.role = 'client' THEN 'CLIENT - NO ADMIN ACCESS'
    WHEN p.is_active = false THEN 'INACTIVE USER'
    WHEN p.id IS NULL THEN 'NO PROFILE - NEED TO CREATE'
    ELSE 'UNKNOWN STATUS'
  END as access_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'nanasefa@gmail.com';

-- If the user exists but has wrong role, fix it:
UPDATE profiles 
SET role = 'admin', is_active = true 
WHERE email = 'nanasefa@gmail.com';

-- Verify the fix:
SELECT 
  u.email,
  p.role,
  p.is_active,
  'Should now have admin access' as status
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'nanasefa@gmail.com';