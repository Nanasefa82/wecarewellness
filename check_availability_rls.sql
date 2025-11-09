-- Diagnostic script to check availability slots and RLS
-- Run this in your Supabase SQL Editor

-- 1. Check current user
SELECT auth.uid() as current_user_id;

-- 2. Check if user exists in profiles
SELECT id, email, role, is_active 
FROM profiles 
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- 3. Check total slots in table (bypassing RLS as admin)
SELECT COUNT(*) as total_slots FROM availability_slots;

-- 4. Check slots for this specific doctor (bypassing RLS)
SELECT 
    id,
    doctor_id,
    doctor_profile_id,
    start_time,
    end_time,
    is_available,
    appointment_type,
    created_at
FROM availability_slots 
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
ORDER BY start_time DESC
LIMIT 10;

-- 5. Test RLS policy - this simulates what the app sees
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

SELECT 
    id,
    doctor_id,
    start_time,
    end_time,
    is_available
FROM availability_slots 
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
LIMIT 5;

-- Reset role
RESET ROLE;

-- 6. Check RLS policies on availability_slots
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'availability_slots';
