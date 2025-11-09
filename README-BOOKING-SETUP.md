# We Care Wellness - Booking System Setup Guide

## Overview
This guide will help you set up the complete booking system with authentication and admin panel for We Care Wellness.

## Prerequisites
- Supabase project created and configured
- Environment variables set in `.env` file
- Node.js and npm installed

## Step 1: Install Dependencies

```bash
npm install
```

The following packages will be installed:
- `@supabase/supabase-js` - Supabase client
- `react-router-dom` - Routing for admin panel
- `date-fns` - Date manipulation utilities

## Step 2: Run Database Migrations

In your Supabase SQL Editor, run the migration files in order:

1. `supabase/migrations/001_create_booking_tables.sql`
2. `supabase/migrations/002_create_rls_policies.sql`
3. `supabase/migrations/003_create_functions.sql`
4. `supabase/migrations/004_create_auth_profiles.sql`
5. `supabase/migrations/005_create_auth_policies.sql`

## Step 3: Create First Admin User

1. Go to your Supabase Auth dashboard
2. Create a new user with email/password
3. Copy the user's UUID
4. Run the setup script in `scripts/setup-admin.sql`, replacing `USER_ID_HERE` with the actual UUID

## Step 4: Update Your App.tsx

Add the AuthProvider and routing to your main App component:

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminLogin from './components/auth/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Existing routes */}
          <Route path="/" element={<YourExistingApp />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireDoctor>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireDoctor>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

## Step 5: Add Admin Link to Header

Update your Header component to include an admin link:

```tsx
// In your Header component
const { isAuthenticated, isDoctor, isAdmin } = useAuthContext();

// Add this to your navigation
{(isDoctor || isAdmin) && (
  <a href="/admin/dashboard" className="...">
    Dashboard
  </a>
)}

// Or add a login link for non-authenticated users
{!isAuthenticated && (
  <a href="/admin/login" className="...">
    Staff Login
  </a>
)}
```

## Step 6: Test the System

1. Start your development server: `npm run dev`
2. Navigate to `/admin/login`
3. Sign in with your admin credentials
4. You should be redirected to the admin dashboard

## Features Included

### Authentication System
- ✅ User registration and login
- ✅ Role-based access (client, doctor, admin)
- ✅ Protected routes
- ✅ Session management

### Database Schema
- ✅ User profiles with roles
- ✅ Doctor profiles
- ✅ Availability slots
- ✅ Appointments
- ✅ Audit logging
- ✅ Row Level Security (RLS)

### Admin Dashboard
- ✅ Dashboard overview
- ✅ Navigation sidebar
- ✅ User management (for admins)
- ✅ Quick actions
- ✅ Recent activity feed

### Security Features
- ✅ Row Level Security policies
- ✅ Role-based permissions
- ✅ Audit trail
- ✅ Secure authentication

## Next Steps

After completing the setup, you can:

1. **Create Availability Management**: Build components for doctors to create time slots
2. **Build Booking Calendar**: Create public-facing booking interface
3. **Add Email Notifications**: Integrate email service for confirmations
4. **Enhance Dashboard**: Add more statistics and management features
5. **Mobile Optimization**: Ensure responsive design for mobile devices

## Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure migrations are run in the correct order
2. **Auth Issues**: Check that RLS policies are properly set up
3. **Role Assignment**: Make sure the first user is properly assigned admin role
4. **Environment Variables**: Verify all Supabase credentials are correct

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase connection in Network tab
3. Check RLS policies in Supabase dashboard
4. Ensure user roles are properly assigned

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── AdminLogin.tsx
│   │   └── ProtectedRoute.tsx
│   └── admin/
│       └── AdminDashboard.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── supabase.ts
└── types/
    └── booking.ts
```

This setup provides a solid foundation for the complete booking system. The next phase would involve building the actual booking calendar and availability management components.