-- Create contact_submissions table for storing contact form submissions
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to insert (submit contact forms)
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can read contact submissions
CREATE POLICY "Only authenticated users can read contact submissions" ON contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users (admin) can update contact submissions
CREATE POLICY "Only authenticated users can update contact submissions" ON contact_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users (admin) can delete contact submissions
CREATE POLICY "Only authenticated users can delete contact submissions" ON contact_submissions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT INSERT ON contact_submissions TO anon;
GRANT SELECT, UPDATE, DELETE ON contact_submissions TO authenticated;

-- Create a view for admin dashboard (optional)
CREATE OR REPLACE VIEW contact_submissions_summary AS
SELECT 
    status,
    COUNT(*) as count,
    MAX(created_at) as latest_submission
FROM contact_submissions 
GROUP BY status;

GRANT SELECT ON contact_submissions_summary TO authenticated;

-- Insert some sample data for testing (optional)
-- INSERT INTO contact_submissions (first_name, last_name, email, message) VALUES
-- ('John', 'Doe', 'john.doe@example.com', 'I would like to schedule an appointment for anxiety counseling.'),
-- ('Jane', 'Smith', 'jane.smith@example.com', 'Can you provide more information about your ADHD treatment options?'),
-- ('Mike', 'Johnson', 'mike.j@example.com', 'I am interested in your virtual therapy sessions. What is the process?');
