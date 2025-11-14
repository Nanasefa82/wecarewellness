// Simple test script to verify login functionality
// Run this in the browser console on your website

console.log('🧪 Testing login functionality...');

// Test 1: Check if Supabase is available
if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase client is available');
} else {
    console.log('❌ Supabase client not found');
}

// Test 2: Check current auth state
async function checkAuthState() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Current session:', session);

        if (session?.user) {
            console.log('👤 Current user:', session.user.email);

            // Check profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            console.log('📋 User profile:', profile);
            console.log('🔍 Profile error:', error);
        } else {
            console.log('❌ No active session');
        }
    } catch (error) {
        console.error('💥 Error checking auth state:', error);
    }
}

// Test 3: Test login with your credentials
async function testLogin(email, password) {
    try {
        console.log('🔐 Testing login with:', email);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('❌ Login failed:', error);
            return;
        }

        console.log('✅ Login successful:', data);

        // Check profile after login
        if (data.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            console.log('📋 Profile after login:', profile);
            console.log('🔍 Profile error:', profileError);
        }

    } catch (error) {
        console.error('💥 Login test error:', error);
    }
}

// Run initial check
checkAuthState();

// Export functions for manual testing
window.testLogin = testLogin;
window.checkAuthState = checkAuthState;

console.log('🎯 Test functions available:');
console.log('- checkAuthState() - Check current auth state');
console.log('- testLogin(email, password) - Test login with credentials');
console.log('');
console.log('Example: testLogin("nanasefa@gmail.com", "your-password")');