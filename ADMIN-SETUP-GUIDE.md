# Admin User Setup Guide

## Step 1: Create User in Supabase (if not done already)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** or **"Invite a user"**
4. Enter:
   - Email: `nanasefa@gmail.com`
   - Password: Choose a secure password
   - Auto Confirm User: **Yes** (check this box)
5. Click **"Send invitation"** or **"Create user"**

## Step 2: Check if User Exists

Run this SQL in your Supabase SQL Editor:

```sql
-- Check if user exists and get their info
SELECT 
  u.id as user_uuid,
  u.email,
  u.created_at,
  p.role,
  p.is_active,
  CASE 
    WHEN p.id IS NULL THEN 'NO PROFILE - Need to create one'
    ELSE 'Profile exists'
  END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'nanasefa@gmail.com';
```

## Step 3: Create Admin Profile

Run this SQL in your Supabase SQL Editor:

```sql
-- Create or update profile to admin
INSERT INTO profiles (id, email, full_name, role, is_active)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Admin User'),
  'admin',
  true
FROM auth.users u
WHERE u.email = 'nanasefa@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true;
```

## Step 4: Verify Admin User

Run this SQL to confirm:

```sql
-- Verify admin user was created
SELECT 
  u.id,
  u.email,
  p.role,
  p.is_active,
  p.full_name
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'nanasefa@gmail.com';
```

You should see:
- email: `nanasefa@gmail.com`
- role: `admin`
- is_active: `true`

## Step 5: Test Login

1. Go to your website
2. Click **"Staff Login"**
3. Enter:
   - Email: `nanasefa@gmail.com`
   - Password: (the password you set in Step 1)
4. You should be redirected to the admin dashboard

## Troubleshooting

### If Step 1 fails with "Database error saving new user":
1. Run the fix migration: `009_fix_user_creation.sql`
2. Try creating the user again

### If you can't create a user through Supabase UI:
Use the simple admin access instead:
1. Go to `/admin/simple` (add this route to your app)
2. Use password: `wecare2025`

### If login doesn't work:
1. Check browser console for errors
2. Verify the user exists in Step 2
3. Make sure all migrations have been run

## Alternative: Simple Password Access

If Supabase auth is still having issues, you can use the simple admin access:

1. Add this route to your App.tsx:
```tsx
<Route path="/admin/simple" element={<SimpleAdminAccess />} />
```

2. Go to `yourwebsite.com/admin/simple`
3. Use password: `wecare2025`

This bypasses Supabase auth entirely for testing purposes.