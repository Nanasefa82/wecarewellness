-- Aggressive fix for availability_slots RLS hanging issue
-- This completely removes all SELECT policies and creates one simple policy

-- Step 1: Drop ALL existing SELECT policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'availability_slots' 
        AND cmd = 'SELECT'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON availability_slots', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Step 2: Create a single, simple SELECT policy with no joins
CREATE POLICY "allow_public_select_available"
ON availability_slots
FOR SELECT
TO public
USING (is_available = true);

-- Step 3: Verify the new policy
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'availability_slots'
AND cmd = 'SELECT';

-- Step 4: Test the query (should be instant)
SELECT COUNT(*) as total_available_slots
FROM availability_slots
WHERE is_available = true;

-- Step 5: Test with date range (should be instant)
SELECT 
    id,
    doctor_id,
    start_time,
    is_available
FROM availability_slots
WHERE is_available = true
AND start_time >= '2025-11-01T00:00:00'
AND start_time <= '2025-12-31T23:59:59'
ORDER BY start_time
LIMIT 10;
