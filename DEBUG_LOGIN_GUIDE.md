# 🔐 Login Debugging Guide

## Current Setup Analysis

Your login system has two entry points:

1. **Staff Login Button** (in Header) → Opens `SimpleLoginModal` on homepage
2. **Direct Admin Login** → Navigate to `/admin/login` → Uses `AdminLogin` component

## 🧪 How to Debug

### Step 1: Check Console Logs
I've added comprehensive logging to all login components. Open your browser's Developer Tools (F12) and watch the Console tab while testing login.

### Step 2: Test the Staff Login Button
1. Go to your homepage (`/`)
2. Click "Staff Login" in the header
3. Watch console for: `🔐 Staff Login button clicked`
4. The login modal should appear

### Step 3: Test Login Process
1. Enter your credentials (nanasefa@gmail.com)
2. Click "Sign In"
3. Watch for these console messages in order:
   ```
   🔐 Login form submitted
   📧 Email: nanasefa@gmail.com
   🚀 Attempting to sign in...
   🔐 useAuth signIn called
   📊 Supabase signIn result: {...}
   ✅ User authenticated: [user-id] nanasefa@gmail.com
   🔍 Fetching user profile...
   👤 Profile result: {...}
   🎉 Login successful! Role: admin Active: true
   📞 Calling onSuccess callback...
   🎉 SimpleLoginModal handleLoginSuccess called
   🚀 Redirecting to /admin/dashboard
   ```

### Step 4: Alternative - Direct Admin Login
If the modal doesn't work, try:
1. Navigate directly to `/admin/login`
2. Enter credentials
3. Watch for similar console logs

## 🔍 Common Issues & Solutions

### Issue 1: Modal Doesn't Open
**Symptoms:** Clicking "Staff Login" does nothing
**Check:** Console should show `🔐 Staff Login button clicked`
**Solution:** If no log appears, there's a JavaScript error preventing the click handler

### Issue 2: Login Form Doesn't Submit
**Symptoms:** No console logs after clicking "Sign In"
**Check:** Look for JavaScript errors in console
**Solution:** Check if form validation is preventing submission

### Issue 3: Authentication Fails
**Symptoms:** See `❌ Sign in error` in console
**Check:** The error message will show the specific issue
**Common causes:**
- Wrong email/password
- User doesn't exist
- Supabase connection issues

### Issue 4: Profile Not Found
**Symptoms:** See `❌ Profile error` in console
**Check:** User exists in auth.users but not in profiles table
**Solution:** Run the admin user creation script

### Issue 5: Access Denied
**Symptoms:** See `🚫 Access denied` in console
**Check:** User role and active status
**Solution:** Ensure user has 'admin' or 'doctor' role and is_active = true

### Issue 6: Redirect Doesn't Work
**Symptoms:** Login succeeds but stays on same page
**Check:** Look for `🚀 Redirecting to /admin/dashboard` in console
**Solution:** Check if there are JavaScript errors preventing the redirect

## 🛠️ Manual Testing Tools

I've created a test script at `scripts/test-login.js`. To use it:

1. Open your website in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Copy and paste the contents of `scripts/test-login.js`
5. Run these commands:
   ```javascript
   // Check current auth state
   checkAuthState()
   
   // Test login (replace with your actual password)
   testLogin("nanasefa@gmail.com", "your-password")
   ```

## 🔧 Quick Fixes

### If Modal Doesn't Open:
```javascript
// Test in console:
document.querySelector('[data-testid="staff-login"]')?.click()
```

### If Login Succeeds But No Redirect:
```javascript
// Manual redirect test:
window.location.href = '/admin/dashboard'
```

### If User Profile Issues:
Run the SQL scripts in `scripts/` folder to verify user setup.

## 📊 Expected Console Output

When everything works correctly, you should see this sequence:
1. `🔐 Staff Login button clicked` (when clicking Staff Login)
2. `🔄 SimpleLoginModal render - isOpen: true` (modal opens)
3. `🔐 Login form submitted` (when submitting form)
4. `✅ useAuth signIn successful` (authentication succeeds)
5. `🔄 updateAuthState called with session: nanasefa@gmail.com` (auth state updates)
6. `🎉 Login successful! Role: admin Active: true` (profile verified)
7. `🎉 SimpleLoginModal handleLoginSuccess called` (success callback)
8. `🚀 Redirecting to /admin/dashboard` (redirect happens)

## 🚨 Next Steps

1. **Test the Staff Login button** - Click it and see if modal opens
2. **Check console logs** - Look for the debugging messages
3. **Try login** - Enter credentials and watch the full flow
4. **Report back** - Tell me exactly what console messages you see

The debugging logs will tell us exactly where the issue is occurring!