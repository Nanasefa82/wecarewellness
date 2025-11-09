// Debug script to check user profile
// Copy and paste this into your browser console on the login page

async function checkUserProfile() {
    try {
        console.log('🔍 Checking user profile...');

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            console.log('❌ No active session');
            return;
        }

        console.log('✅ Active session for:', session.user.email);
        console.log('👤 User ID:', session.user.id);

        // Check profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('❌ Profile fetch error:', error);

            // Try to create profile
            console.log('🔧 Attempting to create profile...');
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: session.user.id,
                    email: session.user.email,
                    full_name: 'Admin User',
                    role: 'admin',
                    is_active: true
                })
                .select()
                .single();

            if (createError) {
                console.error('❌ Failed to create profile:', createError);
            } else {
                console.log('✅ Profile created:', newProfile);
            }
            return;
        }

        console.log('📋 Profile found:', profile);
        console.log('🎯 Role:', profile.role);
        console.log('✅ Active:', profile.is_active);

        if (profile.role === 'admin' || profile.role === 'doctor') {
            console.log('🎉 User has admin/doctor access!');
            console.log('🚀 Should redirect to dashboard');
        } else {
            console.log('🚫 User does NOT have admin/doctor access');
            console.log('🔧 Updating role to admin...');

            const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin', is_active: true })
                .eq('id', session.user.id)
                .select()
                .single();

            if (updateError) {
                console.error('❌ Failed to update role:', updateError);
            } else {
                console.log('✅ Role updated:', updatedProfile);
            }
        }

    } catch (error) {
        console.error('💥 Debug failed:', error);
    }
}

// Make function available globally
window.checkUserProfile = checkUserProfile;

console.log('🎯 Debug function ready! Run: checkUserProfile()');