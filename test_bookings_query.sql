-- Test script to verify bookings are accessible
-- Run this in Supabase SQL Editor to diagnose the issue

-- Step 1: Check if bookings table exists and has data
SELECT 
    'Total bookings in table' as check_name,
    COUNT(*) as result
FROM bookings;

-- Step 2: View all bookings (raw data)
SELECT 
    id,
    first_name,
    last_name,
    email,
    status,
    preferred_date,
    preferred_time,
    created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;

-- Step 3: Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'bookings';

-- Step 4: Check RLS policies
SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'bookings';

-- Step 5: Test the join with availability_slots
SELECT 
    b.id,
    b.first_name,
    b.last_name,
    b.email,
    b.status,
    b.availability_slot_id,
    a.start_time,
    a.end_time,
    a.appointment_type
FROM bookings b
LEFT JOIN availability_slots a ON b.availability_slot_id = a.id
ORDER BY b.created_at DESC
LIMIT 10;

-- Step 6: Check if there are any bookings without RLS (as superuser)
-- This bypasses RLS to see if data exists
SET LOCAL ROLE postgres;
SELECT COUNT(*) as bookings_count_without_rls FROM bookings;
RESET ROLE;
