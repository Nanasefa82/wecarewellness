-- Test query to check availability slots
-- Replace YOUR_USER_ID with the actual user ID from the logs: 8285ede3-ed62-493f-a3b6-c7a3ed21338c

-- 1. Check if there are any slots at all
SELECT COUNT(*) as total_slots FROM availability_slots;

-- 2. Check slots for specific doctor
SELECT COUNT(*) as doctor_slots 
FROM availability_slots 
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- 3. Check available slots for specific doctor
SELECT COUNT(*) as available_slots 
FROM availability_slots 
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
AND is_available = true;

-- 4. Check slots with date range
SELECT 
    id,
    doctor_id,
    start_time,
    end_time,
    is_available,
    appointment_type
FROM availability_slots 
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
AND start_time >= '2025-11-01T00:00:00'
AND start_time <= '2025-11-30T23:59:59'
ORDER BY start_time;

-- 5. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'availability_slots';

-- 6. Check RLS policies
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
WHERE tablename = 'availability_slots';
