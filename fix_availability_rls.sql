-- Fix RLS policies for availability_slots to prevent hanging queries
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Doctors can manage their own availability slots" ON availability_slots;
DROP POLICY IF EXISTS "Public can view available slots from active doctors" ON availability_slots;

-- Step 2: Create simpler, faster policies without subqueries
-- This policy allows doctors to manage their own slots
CREATE POLICY "Doctors can manage their own availability slots" ON availability_slots
  FOR ALL 
  USING (auth.uid() = doctor_id);

-- This policy allows anyone to view available slots (for booking)
CREATE POLICY "Public can view available slots" ON availability_slots
  FOR SELECT 
  USING (is_available = true);

-- Step 3: Verify the user exists in profiles table
-- Replace with your actual user ID: 8285ede3-ed62-493f-a3b6-c7a3ed21338c
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES (
  '8285ede3-ed62-493f-a3b6-c7a3ed21338c',
  'nanasefa@gmail.com',
  'Admin User',
  'doctor',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'doctor',
  is_active = true,
  updated_at = NOW();

-- Step 4: Verify the fix
SELECT 
  id,
  doctor_id,
  start_time,
  end_time,
  is_available
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
LIMIT 5;
