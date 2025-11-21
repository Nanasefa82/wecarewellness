-- Create bookings table for public booking form submissions
-- This is separate from appointments table which is used internally

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    availability_slot_id UUID REFERENCES availability_slots(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME,
    reason_for_visit TEXT NOT NULL,
    previous_treatment TEXT,
    current_medications TEXT,
    insurance_provider TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    consent_accepted BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_doctor_id ON bookings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_public_booking_insert" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_read_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_update_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_delete_bookings" ON bookings;
DROP POLICY IF EXISTS "bookings_public_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_authenticated_select" ON bookings;
DROP POLICY IF EXISTS "bookings_authenticated_update" ON bookings;
DROP POLICY IF EXISTS "bookings_authenticated_delete" ON bookings;
DROP POLICY IF EXISTS "authenticated_can_read_all_bookings" ON bookings;
DROP POLICY IF EXISTS "authenticated_can_update_bookings" ON bookings;

-- Create RLS policies

-- 1. Allow anyone (including anonymous users) to insert bookings
-- This is essential for the public booking form to work
CREATE POLICY "allow_public_booking_insert"
ON bookings
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Allow authenticated users to read all bookings
-- This is for admin dashboard and doctor views
CREATE POLICY "allow_authenticated_read_bookings"
ON bookings
FOR SELECT
TO authenticated
USING (true);

-- 3. Allow authenticated users to update bookings
-- This is for admin/doctor to update booking status
CREATE POLICY "allow_authenticated_update_bookings"
ON bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Allow authenticated users to delete bookings
-- This is for admin to remove spam or test bookings
CREATE POLICY "allow_authenticated_delete_bookings"
ON bookings
FOR DELETE
TO authenticated
USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bookings_updated_at_trigger ON bookings;
CREATE TRIGGER update_bookings_updated_at_trigger
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_bookings_updated_at();

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;
