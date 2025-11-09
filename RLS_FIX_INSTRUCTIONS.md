# RLS Fix Instructions - URGENT

## Problem
Your availability slots page is not loading because of a **circular dependency in RLS policies** causing database queries to hang indefinitely.

## Root Cause
The `profiles` table RLS policy has a circular dependency:
```sql
-- This policy queries profiles WITHIN a profiles policy check!
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles  -- ❌ CIRCULAR!
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'doctor')
    )
  );
```

When `availability_slots` tries to check the `profiles` table, it triggers this circular check and hangs forever.

## Solution
Run the SQL script `fix_rls_circular_dependency.sql` in your Supabase SQL Editor.

## Quick Steps

### Option 1: Run the Full Fix (Recommended)
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `fix_rls_circular_dependency.sql`
3. Click "Run"
4. Refresh your app

### Option 2: Quick Manual Fix
Run these commands in Supabase SQL Editor:

```sql
-- 1. Fix profiles table RLS
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Public can view basic profile info" ON profiles
  FOR SELECT USING (true);

-- 2. Simplify availability_slots RLS
DROP POLICY IF EXISTS "Doctors can manage their own availability slots" ON availability_slots;
CREATE POLICY "Doctors can manage their own availability slots" ON availability_slots
  FOR ALL USING (auth.uid() = doctor_id);

-- 3. Ensure your user exists
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES (
  '8285ede3-ed62-493f-a3b6-c7a3ed21338c',
  'nanasefa@gmail.com',
  'Admin User',
  'doctor',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'doctor',
  is_active = true;
```

### Option 3: Temporary Fix (Testing Only)
If you just want to test quickly:

```sql
-- Temporarily disable RLS
ALTER TABLE availability_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: This removes all security! Only use for testing, then re-enable with proper policies.

## After Running the Fix

1. Refresh your browser (hard refresh: Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Navigate to the Availability page
3. You should see slots loading immediately
4. Check console logs - you should see:
   ```
   🧪 Simple test query result: { count: X, duration: "XXms" }
   ✅ Direct query returned: X slots
   ```

## Verification

After running the fix, you should see in the console:
- ✅ Query completes in < 100ms
- ✅ Slots appear on the calendar
- ✅ No hanging queries

## Why This Happened

1. **Circular RLS**: The profiles policy checked profiles table within itself
2. **Subquery in RLS**: availability_slots policy used a subquery to profiles
3. **Infinite Loop**: This created an infinite recursion causing queries to hang

## The Fix

1. **Remove circular dependency**: Allow public read access to profiles (safe for booking system)
2. **Simplify policies**: Remove complex subqueries from RLS policies
3. **Ensure user exists**: Make sure your user profile is in the database

## Need Help?

If the fix doesn't work:
1. Check Supabase logs for errors
2. Verify your user ID matches: `8285ede3-ed62-493f-a3b6-c7a3ed21338c`
3. Run the verification queries in the SQL script
4. Check if RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('profiles', 'availability_slots');`
