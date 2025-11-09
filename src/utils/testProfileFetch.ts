// Test utility to debug profile fetch issues
import { supabase } from '../lib/supabase';

export const testProfileFetch = async () => {
    try {
        console.log('🧪 Testing profile fetch...');
        
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('📋 Current session:', { session: session?.user?.email, error: sessionError });
        
        if (!session?.user) {
            console.log('❌ No active session');
            return;
        }
        
        // Test direct profile query
        console.log('🔍 Testing direct profile query...');
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        console.log('📊 Profile query result:', { data, error });
        
        if (error) {
            console.error('❌ Profile fetch error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
        }
        
        // Test if profile exists at all
        console.log('🔍 Testing if any profiles exist...');
        const { data: allProfiles, error: allError } = await supabase
            .from('profiles')
            .select('id, email, role')
            .limit(5);
            
        console.log('📊 All profiles query result:', { data: allProfiles, error: allError });
        
        return { session, profile: data, allProfiles };
    } catch (error) {
        console.error('💥 Test failed:', error);
        return null;
    }
};

// Call this function from browser console to test
(window as any).testProfileFetch = testProfileFetch;