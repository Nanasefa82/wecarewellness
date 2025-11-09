-- Fix doctor active status for nanasefa@gmail.com
-- Run this in your Supabase SQL Editor

-- Check current status
SELECT 
    'BEFORE FIX' as status,
    id,
    email,
    role,
    is_active,
    created_at
FROM profiles 
WHERE email = 'nanasefa@gmail.com';

-- Update the user to be active
UPDATE profiles 
SET 
    is_active = true,
    updated_at = NOW()
WHERE email = 'nanasefa@gmail.com';

-- Verify the fix
SELECT 
    'AFTER FIX' as status,
    id,
    email,
    role,
    is_active,
    created_at,
    updated_at
FROM profiles 
WHERE email = 'nanasefa@gmail.com';

-- Check if there are any availability slots for this doctor
SELECT 
    'AVAILABILITY SLOTS' as status,
    COUNT(*) as slot_count,
    COUNT(CASE WHEN is_available = true THEN 1 END) as available_count
FROM availability_slots 
WHERE doctor_id = (
    SELECT id FROM profiles WHERE email = 'nanasefa@gmail.com'
);

-- Test the get_available_slots function
SELECT 
    'FUNCTION TEST' as status,
    COUNT(*) as returned_slots
FROM get_available_slots(
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days'
);