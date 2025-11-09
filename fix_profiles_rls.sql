-- Fix RLS on profiles table to prevent session timeouts

-- Step 1: Check current policies
SELECT policyname, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- Step 2: Drop all existing SELECT policies on profiles
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles'
        AND cmd = 'SELECT'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Step 3: Create simple policy for authenticated users to read their own profile
CREATE POLICY "users_can_read_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Step 4: Allow service role to read all profiles (for admin functions)
CREATE POLICY "service_role_can_read_all"
ON profiles
FOR SELECT
TO service_role
USING (true);

-- Step 5: Verify new policies
SELECT policyname, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles'
AND cmd = 'SELECT';

-- Step 6: Test query
SELECT id, email, full_name, role
FROM profiles
LIMIT 5;
