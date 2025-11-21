-- Add doctor_id column to bookings table if it doesn't exist

-- Step 1: Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name = 'doctor_id';

-- Step 2: Add doctor_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'doctor_id'
    ) THEN
        ALTER TABLE bookings 
        ADD COLUMN doctor_id UUID REFERENCES auth.users(id);
        
        RAISE NOTICE '✅ Added doctor_id column to bookings table';
    ELSE
        RAISE NOTICE 'ℹ️ doctor_id column already exists';
    END IF;
END $$;

-- Step 3: Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name = 'doctor_id';

-- Step 4: Show current bookings table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
