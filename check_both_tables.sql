-- Check both bookings and appointments tables
-- This will help you understand what data exists where

-- Temporarily disable RLS to see all data
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- Check bookings table
SELECT 
    '📋 BOOKINGS TABLE' as table_name,
    COUNT(*) as total_count
FROM bookings;

SELECT 
    'Booking' as type,
    id,
    first_name || ' ' || last_name as name,
    email,
    status,
    preferred_date,
    preferred_time,
    availability_slot_id,
    created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;

-- Check appointments table
SELECT 
    '📅 APPOINTMENTS TABLE' as table_name,
    COUNT(*) as total_count
FROM appointments;

SELECT 
    'Appointment' as type,
    id,
    client_name as name,
    client_email as email,
    status,
    availability_slot_id,
    created_at
FROM appointments
ORDER BY created_at DESC
LIMIT 10;

-- Check availability_slots table
SELECT 
    '🕐 AVAILABILITY SLOTS TABLE' as table_name,
    COUNT(*) as total_count
FROM availability_slots;

SELECT 
    'Slot' as type,
    id,
    doctor_id,
    start_time,
    end_time,
    is_available,
    appointment_type,
    created_at
FROM availability_slots
ORDER BY start_time DESC
LIMIT 10;

-- Re-enable RLS (IMPORTANT!)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Summary
SELECT 
    '📊 SUMMARY' as info,
    (SELECT COUNT(*) FROM bookings) as bookings_count,
    (SELECT COUNT(*) FROM appointments) as appointments_count,
    (SELECT COUNT(*) FROM availability_slots) as slots_count;
