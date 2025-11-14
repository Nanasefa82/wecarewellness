# Contact Form CRUD Operations Setup

## Overview
This document explains the complete CRUD (Create, Read, Update, Delete) implementation for the contact form submissions in the We Care Wellness website.

## Database Setup

### 1. Run the Migration
Execute the migration file to create the necessary database table and functions:

```sql
-- File: supabase/migrations/017_create_contact_submissions_table.sql
```

You can run this migration in your Supabase dashboard by:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `017_create_contact_submissions_table.sql`
4. Execute the query

### 2. Database Schema
The migration creates:
- `contact_submissions` table with proper indexes
- Row Level Security (RLS) policies
- Helper functions for statistics and status updates
- Automatic timestamp updates

## CRUD Operations

### Available Operations

#### 1. CREATE - Submit Contact Form
```typescript
const { createSubmission } = useContactForm();

const result = await createSubmission({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  message: 'Hello, I need help with...'
});
```

#### 2. READ - Get Submissions
```typescript
const { getSubmissions, getSubmissionById } = useContactForm();

// Get all submissions (admin only)
const submissions = await getSubmissions();

// Get submissions with filters
const newSubmissions = await getSubmissions({ status: 'new', limit: 10 });

// Get single submission
const submission = await getSubmissionById('submission-id');
```

#### 3. UPDATE - Update Status
```typescript
const { updateSubmissionStatus } = useContactForm();

// Mark as read
await updateSubmissionStatus('submission-id', 'read');

// Mark as responded
await updateSubmissionStatus('submission-id', 'responded');
```

#### 4. DELETE - Remove Submission
```typescript
const { deleteSubmission } = useContactForm();

await deleteSubmission('submission-id');
```

## Components

### 1. ContactUs Component
- **Location**: `src/components/ContactUs.tsx`
- **Purpose**: Public-facing contact form
- **Features**: Form validation, submission handling, user feedback

### 2. ContactSubmissionsManager Component
- **Location**: `src/components/admin/ContactSubmissionsManager.tsx`
- **Purpose**: Admin interface for managing submissions
- **Features**: 
  - View all submissions
  - Filter by status
  - Search functionality
  - Update submission status
  - Delete submissions
  - Export to CSV
  - Email reply integration

### 3. ContactFormTest Component
- **Location**: `src/components/admin/ContactFormTest.tsx`
- **Purpose**: Testing CRUD operations
- **Usage**: For development and testing purposes

## Security Features

### Row Level Security (RLS)
- **Public Access**: Anyone can submit contact forms (INSERT)
- **Admin Access**: Only authenticated admin users can view, update, and delete submissions
- **Role-based**: Uses `auth.users.raw_user_meta_data->>'role' = 'admin'` for admin verification

### Data Validation
- Required fields: firstName, lastName, email, message
- Email format validation
- Message minimum length (10 characters)
- XSS protection through proper escaping

## Usage Examples

### Adding to Admin Dashboard
```typescript
import ContactSubmissionsManager from '../components/admin/ContactSubmissionsManager';

// In your admin dashboard component
<ContactSubmissionsManager />
```

### Testing the Implementation
```typescript
import ContactFormTest from '../components/admin/ContactFormTest';

// For testing purposes
<ContactFormTest />
```

## API Functions

### Database Functions Created
1. `get_contact_submission_stats()` - Returns submission statistics
2. `mark_submission_as_read(submission_id)` - Automatically marks submissions as read

### Hook Functions
- `createSubmission()` - Create new submission
- `getSubmissions()` - Fetch submissions with optional filters
- `getSubmissionById()` - Fetch single submission
- `updateSubmissionStatus()` - Update submission status
- `deleteSubmission()` - Delete submission
- `clearError()` - Clear error state
- `resetState()` - Reset hook state

## Status Workflow
1. **new** - Initial status when form is submitted
2. **read** - Automatically set when admin views the submission
3. **responded** - Manually set when admin has replied
4. **archived** - For completed/closed submissions

## Environment Variables Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Next Steps
1. Run the migration in your Supabase dashboard
2. Test the contact form submission
3. Set up admin user roles in your authentication system
4. Integrate the ContactSubmissionsManager into your admin dashboard
5. Configure email notifications for new submissions (optional)

## Troubleshooting
- Ensure RLS policies are properly configured
- Verify admin users have the correct role metadata
- Check Supabase connection and environment variables
- Test with both authenticated and unauthenticated users