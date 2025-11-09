-- COMPREHENSIVE FIX: Fix RLS on all tables causing hanging issues
-- Run this once to fix all RLS problems

-- ============================================
-- 1. FIX AVAILABILITY_SLOTS
-- ============================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    RAISE NOTICE '=== Fixing availability_slots ===';
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'availability_slots'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON availability_slots', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
    
    -- Disable RLS entirely for availability_slots (public booking calendar)
    ALTER TABLE availability_slots DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ Disabled RLS for availability_slots';
END $$;

-- ============================================
-- 2. FIX PROFILES
-- ============================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    RAISE NOTICE '=== Fixing profiles ===';
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles'
        AND cmd = 'SELECT'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

DO $$
BEGIN
    -- Simple policy: users can read their own profile
    CREATE POLICY "users_can_read_own_profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

    RAISE NOTICE '✅ Fixed profiles RLS';
END $$;

-- ============================================
-- 3. FIX CONTACT_SUBMISSIONS
-- ============================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    RAISE NOTICE '=== Fixing contact_submissions ===';
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'contact_submissions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON contact_submissions', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

DO $$
BEGIN
    -- Allow public insert, authenticated read/update
    CREATE POLICY "allow_insert_contact"
    ON contact_submissions
    FOR INSERT
    TO public
    WITH CHECK (true);

    CREATE POLICY "authenticated_can_read_all"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

    CREATE POLICY "authenticated_can_update"
    ON contact_submissions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

    RAISE NOTICE '✅ Fixed contact_submissions RLS';
END $$;

-- ============================================
-- 4. FIX BOOKINGS
-- ============================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    RAISE NOTICE '=== Fixing bookings ===';
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'bookings'
        AND cmd = 'SELECT'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON bookings', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

DO $$
BEGIN
    -- Allow public insert (for booking form), authenticated read all
    CREATE POLICY "allow_insert_booking"
    ON bookings
    FOR INSERT
    TO public
    WITH CHECK (true);

    CREATE POLICY "authenticated_can_read_all_bookings"
    ON bookings
    FOR SELECT
    TO authenticated
    USING (true);

    CREATE POLICY "authenticated_can_update_bookings"
    ON bookings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

    RAISE NOTICE '✅ Fixed bookings RLS';
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check RLS status
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename IN ('availability_slots', 'profiles', 'contact_submissions', 'bookings')
ORDER BY tablename;

-- Check policies
SELECT 
    tablename,
    policyname,
    cmd,
    CASE WHEN permissive = 'PERMISSIVE' THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END as type
FROM pg_policies 
WHERE tablename IN ('availability_slots', 'profiles', 'contact_submissions', 'bookings')
ORDER BY tablename, cmd, policyname;

-- Test queries
SELECT 'availability_slots' as table_name, COUNT(*) as count FROM availability_slots WHERE is_available = true
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'contact_submissions', COUNT(*) FROM contact_submissions
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings;
