-- Check and create admin user profile
-- Run this in your Supabase SQL editor

-- First, let's check if the user exists in auth.users
SELECT 
    'AUTH USER CHECK' as check_type,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'nanasefa@gmail.com';

-- Check if profile exists
SELECT 
    'PROFILE CHECK' as check_type,
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
FROM profiles 
WHERE email = 'nanasefa@gmail.com';

-- If profile doesn't exist, create it
-- Replace 'USER_ID_HERE' with the actual user ID from the first query
INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    '8285ede3-ed62-493f-a3b6-c7a3ed21338c', -- Replace with actual user ID
    'nanasefa@gmail.com',
    'Admin User',
    'admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Verify the profile was created/updated
SELECT 
    'FINAL CHECK' as check_type,
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
FROM profiles 
WHERE email = 'nanasefa@gmail.com';