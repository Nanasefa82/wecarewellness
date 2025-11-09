// Test utility to debug auth issues
import { supabase } from '../lib/supabase';

export const testAuth = async () => {
    try {
        console.log('🧪 Testing auth flow...');
        
        // Test 1: Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('📋 Current session:', { 
            user: session?.user?.email, 
            error: sessionError,
            hasSession: !!session 
        });
        
        if (!session?.user) {
            console.log('❌ No active session');
            return;
        }
        
        // Test 2: Test profile query directly
        console.log('🔍 Testing profile query...');
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        console.log('📊 Profile query result:', { profile, error: profileError });
        
        // Test 3: Test auth state change
        console.log('🔄 Testing auth state change...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔔 Auth state changed:', event, session?.user?.email);
        });
        
        // Clean up after 5 seconds
        setTimeout(() => {
            subscription.unsubscribe();
            console.log('🧹 Test cleanup completed');
        }, 5000);
        
        return { session, profile };
    } catch (error) {
        console.error('💥 Test failed:', error);
        return null;
    }
};

// Call this function from browser console to test
(window as any).testAuth = testAuth;