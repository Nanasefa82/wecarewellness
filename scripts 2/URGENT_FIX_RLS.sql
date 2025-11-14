-- URGENT: Fix infinite recursion in RLS policies
-- Run this IMMEDIATELY in your Supabase SQL Editor

-- 1. Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow all authenticated reads" ON profiles;

-- 2. Temporarily disable RLS to clear any issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Test query without RLS (should work now)
SELECT 
    'TEST WITHOUT RLS' as test_type,
    id,
    email,
    role,
    is_active
FROM profiles 
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- 4. Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create ONE simple, non-recursive policy
CREATE POLICY "simple_authenticated_read" ON profiles
    FOR SELECT 
    USING (true);

-- 6. Final test with new policy
SELECT 
    'TEST WITH NEW POLICY' as test_type,
    id,
    email,
    role,
    is_active
FROM profiles 
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- 7. Verify policy was created
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles';