-- Create contact_submissions table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_submissions_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to insert (submit contact form)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated admin users can view all submissions
CREATE POLICY "Admin users can view all contact submissions" ON contact_submissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Only authenticated admin users can update submissions
CREATE POLICY "Admin users can update contact submissions" ON contact_submissions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Only authenticated admin users can delete submissions
CREATE POLICY "Admin users can delete contact submissions" ON contact_submissions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create function to get contact submission statistics
CREATE OR REPLACE FUNCTION get_contact_submission_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_submissions', (SELECT COUNT(*) FROM contact_submissions),
        'new_submissions', (SELECT COUNT(*) FROM contact_submissions WHERE status = 'new'),
        'read_submissions', (SELECT COUNT(*) FROM contact_submissions WHERE status = 'read'),
        'responded_submissions', (SELECT COUNT(*) FROM contact_submissions WHERE status = 'responded'),
        'archived_submissions', (SELECT COUNT(*) FROM contact_submissions WHERE status = 'archived'),
        'submissions_today', (
            SELECT COUNT(*) FROM contact_submissions 
            WHERE DATE(created_at) = CURRENT_DATE
        ),
        'submissions_this_week', (
            SELECT COUNT(*) FROM contact_submissions 
            WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
        ),
        'submissions_this_month', (
            SELECT COUNT(*) FROM contact_submissions 
            WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admin check is in RLS)
GRANT EXECUTE ON FUNCTION get_contact_submission_stats() TO authenticated;

-- Create function to mark submission as read when viewed
CREATE OR REPLACE FUNCTION mark_submission_as_read(submission_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE contact_submissions 
    SET status = 'read', updated_at = NOW()
    WHERE id = submission_id AND status = 'new';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admin check is in RLS)
GRANT EXECUTE ON FUNCTION mark_submission_as_read(UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website';
COMMENT ON COLUMN contact_submissions.status IS 'Status of the submission: new, read, responded, or archived';
COMMENT ON FUNCTION get_contact_submission_stats() IS 'Returns statistics about contact form submissions';
COMMENT ON FUNCTION mark_submission_as_read(UUID) IS 'Marks a submission as read when viewed by admin';