-- Update nanasefa@gmail.com role to doctor
-- Run this in your Supabase SQL Editor

-- First, let's check the current user data
SELECT 
    'BEFORE UPDATE' as status,
    id,
    email,
    role,
    is_active,
    created_at
FROM profiles 
WHERE email = 'nanasefa@gmail.com';

-- Update the user role to doctor
UPDATE profiles 
SET 
    role = 'doctor',
    updated_at = NOW()
WHERE email = 'nanasefa@gmail.com';

-- Verify the update
SELECT 
    'AFTER UPDATE' as status,
    id,
    email,
    role,
    is_active,
    created_at,
    updated_at
FROM profiles 
WHERE email = 'nanasefa@gmail.com';

-- Show all users for reference
SELECT 
    'ALL USERS' as status,
    email,
    role,
    is_active
FROM profiles 
ORDER BY created_at;