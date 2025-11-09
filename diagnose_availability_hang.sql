-- Diagnose why availability_slots query is hanging
-- Run this in Supabase SQL Editor

-- 1. Check if there are any triggers that might be slow
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'availability_slots';

-- 2. Check for any locks on the table
SELECT 
    pid,
    usename,
    pg_blocking_pids(pid) as blocked_by,
    query as blocked_query
FROM pg_stat_activity
WHERE datname = current_database()
AND query ILIKE '%availability_slots%'
AND state != 'idle';

-- 3. Test a simple query with EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT *
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
AND is_available = true
LIMIT 10;

-- 4. Check table statistics
SELECT 
    schemaname,
    relname as tablename,
    n_live_tup as row_count,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
WHERE relname = 'availability_slots';

-- 5. Try the exact query the app is using
SELECT *
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
AND is_available = true
AND start_time >= '2025-10-26T00:00:00'
AND start_time <= '2025-12-06T23:59:59'
ORDER BY start_time ASC;

-- If this query hangs in SQL Editor too, there's a database-level issue
-- If it works in SQL Editor but not in the app, it's a Supabase client issue
