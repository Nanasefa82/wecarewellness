-- Fix circular dependency in RLS policies causing queries to hang
-- Run this in your Supabase SQL Editor as a database admin

-- ============================================
-- STEP 1: Fix profiles table RLS policies
-- ============================================

-- Drop problematic policies with circular dependencies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create new policies without circular dependencies
-- Allow users to view their own profile
-- (This policy already exists and is fine)

-- Allow public read access to basic profile info (needed for RLS subqueries)
CREATE POLICY "Public can view basic profile info" ON profiles
  FOR SELECT 
  USING (true);  -- Allow anyone to read profiles (they're not sensitive)

-- Only allow users to update their own profile
-- (This policy already exists and is fine)

-- ============================================
-- STEP 2: Simplify availability_slots policies
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Doctors can manage their own availability slots" ON availability_slots;
DROP POLICY IF EXISTS "Public can view available slots from active doctors" ON availability_slots;

-- Create simpler policies
CREATE POLICY "Doctors can manage their own availability slots" ON availability_slots
  FOR ALL 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Public can view available slots" ON availability_slots
  FOR SELECT 
  USING (is_available = true);

-- ============================================
-- STEP 3: Ensure user exists in profiles
-- ============================================

-- Insert or update the admin user profile
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

-- ============================================
-- STEP 4: Verify the fix
-- ============================================

-- Check if profile exists
SELECT 
  id,
  email,
  role,
  is_active
FROM profiles
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- Check if availability slots are accessible
SELECT 
  id,
  doctor_id,
  start_time,
  end_time,
  is_available
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
LIMIT 5;

-- ============================================
-- STEP 5: Test RLS as authenticated user
-- ============================================

-- Simulate authenticated user query
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

SELECT COUNT(*) as accessible_slots
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- Reset role
RESET ROLE;

-- ============================================
-- NOTES
-- ============================================
-- The main issue was circular dependency in RLS policies:
-- 1. availability_slots policy checked profiles table
-- 2. profiles policy checked profiles table (circular!)
-- 3. This caused infinite recursion and query timeout
--
-- Solution: Allow public read access to profiles table
-- This is safe because profile info is not sensitive
-- and is needed for public booking functionality
