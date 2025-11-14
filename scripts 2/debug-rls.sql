-- Debug RLS issues
-- Run this in your Supabase SQL editor

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- Temporarily disable RLS to test (ONLY FOR DEBUGGING)
-- WARNING: This removes security - only use for testing!
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Test query without RLS
SELECT 
    'NO RLS TEST' as test_type,
    id,
    email,
    role,
    is_active
FROM profiles 
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- Re-enable RLS after test
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all authenticated users to read profiles
CREATE POLICY "Allow all authenticated reads" ON profiles
    FOR SELECT USING (true);

-- Final test with new policy
SELECT 
    'FINAL RLS TEST' as test_type,
    id,
    email,
    role,
    is_active
FROM profiles 
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';