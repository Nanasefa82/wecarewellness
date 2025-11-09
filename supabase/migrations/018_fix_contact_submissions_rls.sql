-- Fix RLS policy for contact_submissions to allow anonymous users to submit
-- Drop existing INSERT policy and recreate with explicit anonymous access

DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create new INSERT policy that explicitly allows anonymous users
CREATE POLICY "Allow anonymous contact form submissions" ON contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Also ensure the table has proper permissions for anonymous users
GRANT INSERT ON contact_submissions TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Verify RLS is enabled (should already be enabled from previous migration)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;