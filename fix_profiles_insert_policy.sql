-- Fix RLS to allow profile creation

-- Step 1: Check current INSERT policies
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
AND cmd = 'INSERT';

-- Step 2: Drop any restrictive INSERT policies
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_insert_profiles" ON profiles;

-- Step 3: Create policy to allow authenticated users to insert profiles
-- This is needed for user creation and the signup trigger
CREATE POLICY "authenticated_can_insert_profiles"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 4: Also allow public insert (for signup trigger)
CREATE POLICY "public_can_insert_profiles"
ON profiles
FOR INSERT
TO public
WITH CHECK (true);

-- Step 5: Verify policies
SELECT 
    policyname,
    cmd,
    CASE WHEN permissive = 'PERMISSIVE' THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END as type,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Profile INSERT policies updated';
    RAISE NOTICE '✅ Authenticated users can now create profiles';
    RAISE NOTICE '✅ User creation should now work';
END $$;
