-- Safe RLS fix that handles existing policies
-- Run this in your Supabase SQL Editor

-- ============================================
-- STEP 1: Drop ALL existing policies first
-- ============================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view basic profile info" ON profiles;

-- Drop availability_slots policies
DROP POLICY IF EXISTS "Doctors can manage their own availability slots" ON availability_slots;
DROP POLICY IF EXISTS "Public can view available slots from active doctors" ON availability_slots;
DROP POLICY IF EXISTS "Public can view available slots" ON availability_slots;

-- ============================================
-- STEP 2: Create new simple policies
-- ============================================

-- Profiles policies (simple, no circular dependencies)
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view basic profile info" ON profiles
  FOR SELECT USING (true);

-- Availability slots policies (simple, no subqueries)
CREATE POLICY "Doctors can manage their own availability slots" ON availability_slots
  FOR ALL USING (auth.uid() = doctor_id);

CREATE POLICY "Public can view available slots" ON availability_slots
  FOR SELECT USING (is_available = true);

-- ============================================
-- STEP 3: Ensure user exists in profiles
-- ============================================

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

-- Check user profile
SELECT 
  id,
  email,
  role,
  is_active
FROM profiles
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- Check availability slots
SELECT 
  COUNT(*) as total_slots
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- List all policies to verify
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'availability_slots')
ORDER BY tablename, policyname;
