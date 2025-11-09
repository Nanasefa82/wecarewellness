-- Sample availability slots for testing the booking system
-- Run this in your Supabase SQL editor to create test data

-- First, create a sample doctor user (you may need to adjust the UUID)
-- You can get a real user ID from your auth.users table or create one through the admin interface

-- Insert sample availability slots for the next 7 days
-- Replace 'your-doctor-user-id-here' with an actual user ID from your auth.users table

INSERT INTO availability_slots (doctor_id, start_time, end_time, appointment_type, is_available, notes) VALUES
-- Today + 1 day
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '1 day' + TIME '09:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00')::timestamptz,
  'consultation',
  true,
  'Morning consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '1 day' + TIME '11:00:00')::timestamptz,
  'consultation',
  true,
  'Morning consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '1 day' + TIME '14:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '1 day' + TIME '15:00:00')::timestamptz,
  'consultation',
  true,
  'Afternoon consultation slot'
),

-- Today + 2 days
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '2 days' + TIME '09:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '2 days' + TIME '10:00:00')::timestamptz,
  'consultation',
  true,
  'Morning consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '2 days' + TIME '11:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '2 days' + TIME '12:00:00')::timestamptz,
  'consultation',
  true,
  'Late morning consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '2 days' + TIME '15:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '2 days' + TIME '16:00:00')::timestamptz,
  'consultation',
  true,
  'Afternoon consultation slot'
),

-- Today + 3 days
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '3 days' + TIME '10:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '3 days' + TIME '11:00:00')::timestamptz,
  'consultation',
  true,
  'Morning consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '3 days' + TIME '13:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '3 days' + TIME '14:00:00')::timestamptz,
  'consultation',
  true,
  'Early afternoon consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '3 days' + TIME '16:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '3 days' + TIME '17:00:00')::timestamptz,
  'consultation',
  true,
  'Late afternoon consultation slot'
),

-- Today + 4 days
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '4 days' + TIME '09:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '4 days' + TIME '10:00:00')::timestamptz,
  'consultation',
  true,
  'Morning consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '4 days' + TIME '14:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '4 days' + TIME '15:00:00')::timestamptz,
  'consultation',
  true,
  'Afternoon consultation slot'
),

-- Today + 5 days
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '5 days' + TIME '11:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '5 days' + TIME '12:00:00')::timestamptz,
  'consultation',
  true,
  'Late morning consultation slot'
),
(
  'your-doctor-user-id-here',
  (CURRENT_DATE + INTERVAL '5 days' + TIME '15:00:00')::timestamptz,
  (CURRENT_DATE + INTERVAL '5 days' + TIME '16:00:00')::timestamptz,
  'consultation',
  true,
  'Afternoon consultation slot'
);

-- Verify the data was inserted
SELECT 
  id,
  doctor_id,
  start_time,
  end_time,
  appointment_type,
  is_available,
  notes
FROM availability_slots 
WHERE start_time >= CURRENT_DATE
ORDER BY start_time;
