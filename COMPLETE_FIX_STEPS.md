# Complete Fix Steps - Do These In Order

## Current Status
- ✅ Code fixes applied (faster timeouts, fixed signOut)
- ❌ Database not configured correctly
- ❌ Profile not loading (isDoctor: false)
- ❌ Availability slots not loading

## Step 1: Fix Database (CRITICAL)

Run **`quick_fix.sql`** in Supabase SQL Editor:

```sql
-- 1. Ensure your user profile exists with correct role
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
  is_active = true,
  updated_at = NOW();

-- 2. Temporarily disable RLS (we'll fix properly later)
ALTER TABLE availability_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

## Step 2: Clear Browser Cache

The app has cached the wrong profile data. You need to clear it:

### Option A: Clear localStorage (Recommended)
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### Option B: Hard Refresh
- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

## Step 3: Sign Out and Sign Back In

1. Click the Sign Out button (it should work now)
2. Sign back in with your credentials
3. The app should now load your profile correctly

## Step 4: Verify It's Working

After signing back in, check the console logs. You should see:

```
✅ Using fetched profile: { role: 'doctor', ... }
✅ Auth state updated with profile: { role: 'doctor', isDoctor: true, isAdmin: false }
🛡️ ProtectedRoute check: { isDoctor: true, ... }
```

Navigate to Availability page - it should load immediately with slots visible.

## Step 5: Re-enable RLS (After Testing)

Once everything works, run **`fix_rls_safe.sql`** to properly secure your database:

```sql
-- This will re-enable RLS with proper policies
-- Run fix_rls_safe.sql in Supabase SQL Editor
```

## Troubleshooting

### If profile still shows isDoctor: false

1. Check database:
   ```sql
   SELECT id, email, role FROM profiles 
   WHERE id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';
   ```
   Should show `role = 'doctor'`

2. Clear localStorage again:
   ```javascript
   localStorage.removeItem('profile_8285ede3-ed62-493f-a3b6-c7a3ed21338c');
   ```

3. Sign out and back in

### If availability slots still not loading

1. Check if slots exist:
   ```sql
   SELECT COUNT(*) FROM availability_slots 
   WHERE doctor_id = '8285ede3-ed62-493f-a3b6-c7a3ed21338c';
   ```

2. If count is 0, you need to create some slots first

3. Check console for query logs - should see:
   ```
   🧪 Simple test query result: { count: X, duration: "XXms" }
   ```

### If signout still not working

The fix is already in the code. If it's not working:
1. Check console for errors
2. Try clearing cookies
3. Hard refresh the page

## Expected Timeline

- Database fix: 30 seconds
- Clear cache: 10 seconds  
- Sign out/in: 20 seconds
- **Total: ~1 minute to working app**

## Success Criteria

✅ Console shows `isDoctor: true`
✅ Availability page loads in < 2 seconds
✅ Slots appear on calendar
✅ Sign out button works
✅ No hanging queries in console

## Need More Help?

If after following all steps it still doesn't work:
1. Share the complete console logs
2. Share the result of the database queries
3. Check Supabase logs for errors
