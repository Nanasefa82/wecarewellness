-- EMERGENCY: Completely disable RLS to stop infinite recursion
-- Run this IMMEDIATELY in your Supabase SQL Editor

-- 1. Drop ALL policies (be thorough)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON profiles';
    END LOOP;
END $$;

-- 2. Completely disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Test query (should work now)
SELECT 
    'EMERGENCY TEST' as test_type,
    id,
    email,
    role,
    is_active,
    created_at
FROM profiles 
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- 4. Show all profiles to verify table works
SELECT 
    'ALL PROFILES' as test_type,
    id,
    email,
    role,
    is_active
FROM profiles;

-- 5. Verify NO policies exist
SELECT 
    'POLICY CHECK' as test_type,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'profiles';