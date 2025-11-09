-- Debug availability slots and profiles
-- This will help us understand what's in the database

-- Check profiles table
SELECT 
    'PROFILES CHECK' as check_type,
    id,
    email,
    role,
    is_active,
    created_at
FROM profiles 
WHERE email = 'nanasefa@gmail.com';

-- Check availability_slots table
SELECT 
    'AVAILABILITY SLOTS CHECK' as check_type,
    COUNT(*) as total_slots,
    COUNT(CASE WHEN is_available = true THEN 1 END) as available_slots,
    MIN(start_time) as earliest_slot,
    MAX(start_time) as latest_slot
FROM availability_slots;

-- Check availability_slots with doctor info
SELECT 
    'SLOTS WITH DOCTOR INFO' as check_type,
    a.id,
    a.doctor_id,
    p.email as doctor_email,
    p.is_active as doctor_active,
    a.start_time,
    a.end_time,
    a.is_available,
    a.appointment_type
FROM availability_slots a
LEFT JOIN profiles p ON a.doctor_id = p.id
ORDER BY a.start_time;

-- Test the RLS policy by checking what anonymous users can see
SET ROLE anon;
SELECT 
    'ANONYMOUS USER VIEW' as check_type,
    COUNT(*) as visible_slots
FROM availability_slots 
WHERE is_available = true;

-- Reset role
RESET ROLE;

-- Ensure doctor is active
UPDATE profiles 
SET 
    is_active = true,
    updated_at = NOW()
WHERE email = 'nanasefa@gmail.com';

-- Final verification
SELECT 
    'FINAL CHECK' as check_type,
    p.email,
    p.role,
    p.is_active,
    COUNT(a.id) as slot_count
FROM profiles p
LEFT JOIN availability_slots a ON p.id = a.doctor_id AND a.is_available = true
WHERE p.email = 'nanasefa@gmail.com'
GROUP BY p.id, p.email, p.role, p.is_active;