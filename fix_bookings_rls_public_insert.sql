-- Fix RLS policies for bookings table to allow public booking submissions
-- This allows anonymous users to create bookings (public booking form)
-- while keeping read/update/delete restricted to authenticated users

-- Drop existing policies
DROP POLICY IF EXISTS "bookings_public_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_authenticated_select" ON bookings;
DROP POLICY IF EXISTS "bookings_authenticated_update" ON bookings;
DROP POLICY IF EXISTS "bookings_authenticated_delete" ON bookings;
DROP POLICY IF EXISTS "authenticated_can_read_all_bookings" ON bookings;
DROP POLICY IF EXISTS "authenticated_can_update_bookings" ON bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous users) to insert bookings
-- This is needed for the public booking form
CREATE POLICY "allow_public_booking_insert"
ON bookings
FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users to read all bookings
CREATE POLICY "allow_authenticated_read_bookings"
ON bookings
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update bookings
CREATE POLICY "allow_authenticated_update_bookings"
ON bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete bookings
CREATE POLICY "allow_authenticated_delete_bookings"
ON bookings
FOR DELETE
TO authenticated
USING (true);

-- Verify the policies
SELECT 
    policyname,
    roles,
    cmd,
    CASE 
        WHEN qual IS NULL THEN 'No restriction'
        ELSE 'Has restriction'
    END as using_clause,
    CASE 
        WHEN with_check IS NULL THEN 'No restriction'
        ELSE 'Has restriction'
    END as with_check_clause
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;
