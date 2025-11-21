-- Fix RLS on profiles table so admins can see all users

-- Step 1: Check current RLS policies on profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Step 2: Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "users_can_read_own_profile" ON profiles;

-- Step 3: Create policies that allow:
-- - Users can read their own profile
-- - Authenticated users can read all profiles (for admin/doctor dashboards)

-- Allow users to read their own profile
CREATE POLICY "users_read_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to read all profiles (for admin features)
CREATE POLICY "authenticated_read_all_profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "users_update_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to update any profile (for admin role management)
CREATE POLICY "authenticated_update_all_profiles"
ON profiles
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 4: Verify new policies
SELECT 
    policyname,
    cmd,
    CASE WHEN permissive = 'PERMISSIVE' THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END as type
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Step 5: Test query (should return all 3 users)
SELECT 
    email,
    full_name,
    role,
    is_active
FROM profiles
ORDER BY created_at DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Profiles RLS policies updated';
    RAISE NOTICE '✅ Authenticated users can now read all profiles';
    RAISE NOTICE '✅ Admin user management should now work';
END $$;
