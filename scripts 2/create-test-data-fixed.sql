-- Create test data for the booking system
-- Run this in your Supabase SQL Editor

-- Step 1: Create a test user in auth.users (this creates the user account)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'doctor@wecarewellness.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Create doctor profile
INSERT INTO doctor_profiles (
  user_id,
  name,
  specialization,
  bio
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'Dr. Sarah Johnson',
  'Mental Health Counselor',
  'Experienced therapist specializing in anxiety and depression treatment.'
) ON CONFLICT (user_id) DO NOTHING;

-- Step 3: Create availability slots for the next 7 days
DO $$
DECLARE
    profile_id UUID;
    doctor_user_id UUID := '550e8400-e29b-41d4-a716-446655440000'::uuid;
BEGIN
    -- Get the doctor_profile_id
    SELECT id INTO profile_id FROM doctor_profiles WHERE user_id = doctor_user_id;
    
    -- Insert availability slots
    INSERT INTO availability_slots (doctor_id, doctor_profile_id, start_time, end_time, appointment_type, is_available, notes) VALUES
    -- Tomorrow
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '1 day' + TIME '09:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00')::timestamptz,
      'consultation',
      true,
      'Morning consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '1 day' + TIME '11:00:00')::timestamptz,
      'consultation',
      true,
      'Morning consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '1 day' + TIME '14:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '1 day' + TIME '15:00:00')::timestamptz,
      'consultation',
      true,
      'Afternoon consultation slot'
    ),

    -- Day after tomorrow
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '2 days' + TIME '09:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '2 days' + TIME '10:00:00')::timestamptz,
      'consultation',
      true,
      'Morning consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '2 days' + TIME '11:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '2 days' + TIME '12:00:00')::timestamptz,
      'consultation',
      true,
      'Late morning consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '2 days' + TIME '15:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '2 days' + TIME '16:00:00')::timestamptz,
      'consultation',
      true,
      'Afternoon consultation slot'
    ),

    -- 3 days from now
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '3 days' + TIME '10:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '3 days' + TIME '11:00:00')::timestamptz,
      'consultation',
      true,
      'Morning consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '3 days' + TIME '13:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '3 days' + TIME '14:00:00')::timestamptz,
      'consultation',
      true,
      'Early afternoon consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '3 days' + TIME '16:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '3 days' + TIME '17:00:00')::timestamptz,
      'consultation',
      true,
      'Late afternoon consultation slot'
    ),

    -- 4 days from now
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '4 days' + TIME '09:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '4 days' + TIME '10:00:00')::timestamptz,
      'consultation',
      true,
      'Morning consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '4 days' + TIME '14:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '4 days' + TIME '15:00:00')::timestamptz,
      'consultation',
      true,
      'Afternoon consultation slot'
    ),

    -- 5 days from now
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '5 days' + TIME '11:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '5 days' + TIME '12:00:00')::timestamptz,
      'consultation',
      true,
      'Late morning consultation slot'
    ),
    (
      doctor_user_id,
      profile_id,
      (CURRENT_DATE + INTERVAL '5 days' + TIME '15:00:00')::timestamptz,
      (CURRENT_DATE + INTERVAL '5 days' + TIME '16:00:00')::timestamptz,
      'consultation',
      true,
      'Afternoon consultation slot'
    );
END $$;

-- Verify the data was created
SELECT 
  'Users created:' as type,
  COUNT(*) as count
FROM auth.users 
WHERE email = 'doctor@wecarewellness.com'

UNION ALL

SELECT 
  'Doctor profiles created:' as type,
  COUNT(*) as count
FROM doctor_profiles 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'::uuid

UNION ALL

SELECT 
  'Availability slots created:' as type,
  COUNT(*) as count
FROM availability_slots 
WHERE doctor_id = '550e8400-e29b-41d4-a716-446655440000'::uuid
AND start_time >= CURRENT_DATE;
