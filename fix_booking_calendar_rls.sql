-- Fix for BookingCalendar hanging issue
-- The problem: RLS policies on availability_slots are causing queries to hang
-- Solution: Allow public read access to available slots

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Public can view available slots" ON availability_slots;
DROP POLICY IF EXISTS "Anyone can view available slots" ON availability_slots;
DROP POLICY IF EXISTS "Public read access to available slots" ON availability_slots;

-- Create a simple, non-blocking policy for public reads
CREATE POLICY "Public can read available slots"
ON availability_slots
FOR SELECT
USING (is_available = true);

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'availability_slots'
ORDER BY policyname;

-- Test query (should return results immediately)
SELECT 
    id,
    doctor_id,
    start_time,
    end_time,
    is_available,
    appointment_type
FROM availability_slots
WHERE is_available = true
AND start_time >= '2025-11-08T00:00:00'
AND start_time <= '2025-12-31T23:59:59'
ORDER BY start_time
LIMIT 10;
