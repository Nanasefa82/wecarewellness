-- Quick verification script to check if the RLS fix worked
-- Run this AFTER applying fix_rls_circular_dependency.sql

-- ============================================
-- 1. Check RLS is enabled
-- ============================================
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'availability_slots')
ORDER BY tablename;

-- Expected: Both should show 't' (true)

-- ============================================
-- 2. Check profiles policies (should be simple)
-- ============================================
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Expected: Should see "Public can view basic profile info" with qual = 'true'

-- ============================================
-- 3. Check availability_slots policies
-- ============================================
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'availability_slots'
ORDER BY policyname;

-- Expected: Should see simple policies without complex subqueries

-- ============================================
-- 4. Verify user profile exists
-- ============================================
SELECT 
  id,
  email,
  full_name,
  role,
  is_active,
  created_at
FROM profiles
WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- Expected: Should return 1 row with role = 'doctor'

-- ============================================
-- 5. Test availability slots query (as admin)
-- ============================================
SELECT 
  COUNT(*) as total_slots,
  COUNT(*) FILTER (WHERE is_available = true) as available_slots,
  COUNT(*) FILTER (WHERE is_available = false) as booked_slots
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

-- Expected: Should return counts immediately (< 100ms)

-- ============================================
-- 6. Test query as authenticated user
-- ============================================
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO '8285ede3-ed62-493f-a3b6-c7a3ed21338c';

SELECT 
  id,
  start_time,
  end_time,
  is_available,
  appointment_type
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
ORDER BY start_time DESC
LIMIT 5;

RESET ROLE;

-- Expected: Should return results immediately

-- ============================================
-- 7. Performance test
-- ============================================
EXPLAIN ANALYZE
SELECT *
FROM availability_slots
WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c'
AND start_time >= '2025-11-01'
AND start_time <= '2025-11-30';

-- Expected: Execution time should be < 10ms

-- ============================================
-- SUCCESS CRITERIA
-- ============================================
-- ✅ All queries complete in < 100ms
-- ✅ User profile exists with role = 'doctor'
-- ✅ RLS policies are simple (no circular dependencies)
-- ✅ Availability slots are accessible
-- ✅ No hanging queries or timeouts
