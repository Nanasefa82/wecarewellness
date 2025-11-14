-- Fix Row Level Security policies for profiles table
-- Run this in your Supabase SQL editor

-- First, let's check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop existing policies if they're too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;

-- Create more permissive policies for authenticated users
CREATE POLICY "Allow authenticated users to read all profiles" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Test the policy by selecting the admin user profile
SELECT 
    'POLICY TEST' as test_type,
    id,
    email,
    role,
    is_active
FROM profiles 
WHERE email = 'nanasefa@gmail.com';

-- Also check if we can access it by ID
SELECT 
    'ID TEST' as test_type,
    id,
    email,
    role,
    is_active
FROM profiles 
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';