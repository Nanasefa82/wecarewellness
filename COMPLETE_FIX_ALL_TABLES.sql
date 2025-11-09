-- COMPLETE FIX: Apply RLS policies to all booking-related tables
-- Run this once in Supabase SQL Editor to fix everything

-- ============================================
-- PART 1: FIX BOOKINGS TABLE
-- ============================================

-- Drop existing bookings policies
DROP POLICY IF EXISTS "Anyone can submit booking form" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings by email" ON bookings;
DROP POLICY IF EXISTS "Admin users can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin users can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admin users can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
DROP POLICY IF EXISTS "authenticated_view_all_bookings" ON bookings;
DROP POLICY IF EXISTS "authenticated_update_bookings" ON bookings;
DROP POLICY IF EXISTS "authenticated_delete_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_public_insert_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_select_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_update_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_delete_bookings" ON bookings;

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create new bookings policies
CREATE POLICY "bookings_public_insert" 
ON bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_authenticated_select" 
ON bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "bookings_authenticated_update" 
ON bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "bookings_authenticated_delete" 
ON bookings FOR DELETE TO authenticated USING (true);

-- ============================================
-- PART 2: FIX APPOINTMENTS TABLE
-- ============================================

-- Drop existing appointments policies
DROP POLICY IF EXISTS "Doctors can view their appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;
DROP POLICY IF EXISTS "allow_public_insert_appointments" ON appointments;
DROP POLICY IF EXISTS "allow_authenticated_select_appointments" ON appointments;
DROP POLICY IF EXISTS "allow_authenticated_update_appointments" ON appointments;
DROP POLICY IF EXISTS "allow_authenticated_delete_appointments" ON appointments;

-- Enable RLS on appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create new appointments policies
CREATE POLICY "appointments_public_insert" 
ON appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "appointments_authenticated_select" 
ON appointments FOR SELECT TO authenticated USING (true);

CREATE POLICY "appointments_authenticated_update" 
ON appointments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "appointments_authenticated_delete" 
ON appointments FOR DELETE TO authenticated USING (true);

-- ============================================
-- PART 3: FIX AVAILABILITY_SLOTS TABLE
-- ============================================

-- Drop existing availability_slots policies
DROP POLICY IF EXISTS "Anyone can view available slots" ON availability_slots;
DROP POLICY IF EXISTS "Doctors can manage their slots" ON availability_slots;
DROP POLICY IF EXISTS "Authenticated users can view slots" ON availability_slots;
DROP POLICY IF EXISTS "Authenticated users can manage slots" ON availability_slots;

-- Enable RLS on availability_slots
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- Create new availability_slots policies
CREATE POLICY "slots_public_select" 
ON availability_slots FOR SELECT USING (true);

CREATE POLICY "slots_authenticated_insert" 
ON availability_slots FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "slots_authenticated_update" 
ON availability_slots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "slots_authenticated_delete" 
ON availability_slots FOR DELETE TO authenticated USING (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Show all policies created
SELECT 
    '✅ ' || tablename || ' - ' || policyname as policy_status,
    cmd as operation
FROM pg_policies 
WHERE tablename IN ('bookings', 'appointments', 'availability_slots')
ORDER BY tablename, policyname;

-- Show RLS status
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN '✅ RLS ENABLED' ELSE '❌ RLS DISABLED' END as status
FROM pg_tables 
WHERE tablename IN ('bookings', 'appointments', 'availability_slots')
ORDER BY tablename;

-- Show data counts
SELECT 
    '📊 Data Summary' as info,
    (SELECT COUNT(*) FROM bookings) as bookings_count,
    (SELECT COUNT(*) FROM appointments) as appointments_count,
    (SELECT COUNT(*) FROM availability_slots) as slots_count;

-- Success message
SELECT '🎉 All RLS policies have been applied successfully!' as status;
SELECT '👉 Now log into your app and test the BookingManager and AppointmentsDashboard' as next_step;
