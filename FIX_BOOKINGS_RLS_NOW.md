# Fix Bookings RLS Issue - IMMEDIATE ACTION REQUIRED

## Problem
The booking form is failing with error: `new row violates row-level security policy for table "bookings"`

This happens because the `bookings` table has RLS enabled but no policy allows anonymous (public) users to insert bookings.

## Solution
You need to run the SQL migration to allow public inserts on the bookings table.

## Steps to Fix (Choose ONE method)

### Method 1: Using Supabase Dashboard (RECOMMENDED - Fastest)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/tfpkkleonhhzexbmbped
   - Or: https://app.supabase.com

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the SQL**
   - Open the file: `supabase/migrations/019_create_bookings_table_with_rls.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor

4. **Run the SQL**
   - Click "Run" or press Cmd/Ctrl + Enter
   - Wait for success message

5. **Verify**
   - You should see a success message
   - The policies should be listed at the bottom of the results

6. **Test**
   - Go back to your booking form
   - Try submitting a booking
   - It should now work!

---

### Method 2: Using psql (If you have database credentials)

```bash
# If you have the database connection string
psql "postgresql://postgres:[YOUR-PASSWORD]@db.tfpkkleonhhzexbmbped.supabase.co:5432/postgres" -f supabase/migrations/019_create_bookings_table_with_rls.sql
```

---

### Method 3: Quick Fix SQL (Copy this directly)

If you just want a quick fix, copy and paste this into Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "allow_public_booking_insert" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_read_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_update_bookings" ON bookings;
DROP POLICY IF EXISTS "allow_authenticated_delete_bookings" ON bookings;

-- Allow public inserts (for booking form)
CREATE POLICY "allow_public_booking_insert"
ON bookings FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated users to read bookings (for admin)
CREATE POLICY "allow_authenticated_read_bookings"
ON bookings FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to update bookings (for admin)
CREATE POLICY "allow_authenticated_update_bookings"
ON bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete bookings (for admin)
CREATE POLICY "allow_authenticated_delete_bookings"
ON bookings FOR DELETE TO authenticated USING (true);
```

---

## What This Does

1. **Enables RLS** on the bookings table (if not already enabled)
2. **Allows public inserts** - Anyone can submit a booking (needed for public form)
3. **Restricts reads** - Only authenticated users (admins/doctors) can view bookings
4. **Restricts updates** - Only authenticated users can update booking status
5. **Restricts deletes** - Only authenticated users can delete bookings

## After Running the SQL

1. The booking form should work immediately
2. No need to restart the app
3. Test by submitting a booking

## Troubleshooting

If it still doesn't work after running the SQL:

1. **Check if the policies were created:**
   ```sql
   SELECT policyname, roles, cmd 
   FROM pg_policies 
   WHERE tablename = 'bookings';
   ```

2. **Check if RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'bookings';
   ```
   (rowsecurity should be `true`)

3. **Clear browser cache and try again**

## Need Help?

If you're still having issues, let me know and I can help debug further!
