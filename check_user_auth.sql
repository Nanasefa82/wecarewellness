-- Check your current authentication status
-- Run this in Supabase SQL Editor

-- Check if you're authenticated
SELECT 
    CASE 
        WHEN auth.uid() IS NULL THEN '❌ NOT AUTHENTICATED - You need to log in!'
        ELSE '✅ AUTHENTICATED'
    END as auth_status,
    auth.uid() as user_id,
    auth.jwt() as jwt_info;

-- Check your user details
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users
WHERE id = auth.uid();

-- Check your profile and role
SELECT 
    id,
    email,
    role,
    created_at
FROM profiles
WHERE id = auth.uid();

-- If no profile exists, you might need to create one
-- Uncomment and run this if needed:
-- INSERT INTO profiles (id, email, role)
-- SELECT id, email, 'admin'
-- FROM auth.users
-- WHERE id = auth.uid()
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
