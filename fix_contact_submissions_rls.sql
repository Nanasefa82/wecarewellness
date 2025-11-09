-- Fix RLS on contact_submissions table to prevent hanging

-- Step 1: Check current policies
SELECT policyname, cmd, qual
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- Step 2: Drop all existing policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'contact_submissions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON contact_submissions', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- Step 3: Create simple policies
-- Allow anyone to insert (for contact form submissions)
CREATE POLICY "allow_insert_contact"
ON contact_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Allow authenticated users to read all (for admin dashboard)
CREATE POLICY "authenticated_can_read_all"
ON contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update
CREATE POLICY "authenticated_can_update"
ON contact_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 4: Verify new policies
SELECT policyname, cmd, qual
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- Step 5: Test query
SELECT id, name, email, created_at
FROM contact_submissions
ORDER BY created_at DESC
LIMIT 5;
