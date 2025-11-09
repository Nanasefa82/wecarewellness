-- Debug RLS policies on availability_slots table

-- 1. Check all current policies
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
WHERE tablename = 'availability_slots'
ORDER BY policyname;

-- 2. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'availability_slots';

-- 3. Try a simple query to see if it hangs
EXPLAIN ANALYZE
SELECT 
    id,
    doctor_id,
    start_time,
    end_time,
    is_available
FROM availability_slots
WHERE is_available = true
AND start_time >= '2025-11-01T00:00:00'
AND start_time <= '2025-11-30T23:59:59'
LIMIT 5;

-- 4. Check for any foreign key constraints that might cause issues
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'availability_slots';
