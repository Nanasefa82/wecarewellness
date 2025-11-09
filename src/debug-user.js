// Quick debug script to test user authentication
// Run this in the browser console on your login page

console.log('🧪 Starting user debug test...');

// Test function to check if user exists and has correct role
async function testUserLogin(email, password) {
    try {
        console.log('🔐 Testing login for:', email);

        // Import Supabase (this assumes you're running in browser with the app loaded)
        const { supabase } = await import('./lib/supabase.js');

        // Test login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('❌ Login failed:', error);
            return;
        }

        console.log('✅ Login successful:', data.user.email);

        // Check profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.error('❌ Profile fetch failed:', profileError);
            return;
        }

        console.log('👤 User profile:', profile);
        console.log('🎯 Role:', profile.role);
        console.log('✅ Active:', profile.is_active);

        if (profile.role === 'admin' || profile.role === 'doctor') {
            console.log('🎉 User has admin/doctor access!');
        } else {
            console.log('🚫 User does NOT have admin/doctor access');
        }

        // Sign out
        await supabase.auth.signOut();
        console.log('👋 Signed out');

    } catch (error) {
        console.error('💥 Test failed:', error);
    }
}

// Export for manual testing
window.testUserLogin = testUserLogin;

console.log('🎯 Test function ready! Use: testUserLogin("nanasefa@gmail.com", "your-password")');