-- Test script to verify the booking system is working
-- Run this in your Supabase SQL editor

-- 1. Check if all tables exist
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'doctor_profiles', 'availability_slots', 'appointments')
ORDER BY tablename;

-- 2. Check if all functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN (
  'handle_new_user',
  'update_updated_at_column',
  'get_available_slots',
  'book_appointment',
  'get_doctor_dashboard_stats'
)
ORDER BY routine_name;

-- 3. Check if triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- 4. Test basic functionality
-- Check if we can insert a test profile (this should work)
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- Test profile creation
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (test_user_id, 'test@example.com', 'Test User', 'client');
  
  RAISE NOTICE 'Profile creation test: SUCCESS';
  
  -- Clean up test data
  DELETE FROM profiles WHERE id = test_user_id;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Profile creation test: FAILED - %', SQLERRM;
END $$;

-- 5. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;