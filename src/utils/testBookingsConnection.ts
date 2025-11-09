// Test utility to verify bookings table connection
// Run this in browser console: import('./utils/testBookingsConnection').then(m => m.testBookingsConnection())

import { supabase } from '../lib/supabase';

export async function testBookingsConnection() {
    console.log('🧪 Testing bookings table connection...');
    
    try {
        // Test 1: Simple count query
        console.log('\n📊 Test 1: Count all bookings');
        const { count, error: countError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });
        
        if (countError) {
            console.error('❌ Count query failed:', countError);
        } else {
            console.log('✅ Total bookings:', count);
        }

        // Test 2: Fetch without joins
        console.log('\n📊 Test 2: Fetch bookings (no joins)');
        const { data: simpleData, error: simpleError } = await supabase
            .from('bookings')
            .select('id, first_name, last_name, email, status, created_at')
            .limit(5);
        
        if (simpleError) {
            console.error('❌ Simple query failed:', simpleError);
        } else {
            console.log('✅ Fetched bookings:', simpleData);
        }

        // Test 3: Fetch with availability_slots join
        console.log('\n📊 Test 3: Fetch bookings (with join)');
        const { data: joinData, error: joinError } = await supabase
            .from('bookings')
            .select(`
                *,
                availability_slots(
                    id,
                    start_time,
                    end_time,
                    appointment_type,
                    doctor_id
                )
            `)
            .limit(5);
        
        if (joinError) {
            console.error('❌ Join query failed:', joinError);
        } else {
            console.log('✅ Fetched bookings with slots:', joinData);
        }

        // Test 4: Check current user
        console.log('\n👤 Test 4: Current user info');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user?.email, 'ID:', user?.id);

        // Test 5: Check user profile/role
        if (user) {
            console.log('\n🔐 Test 5: User profile/role');
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, email, role')
                .eq('id', user.id)
                .single();
            
            if (profileError) {
                console.error('❌ Profile query failed:', profileError);
            } else {
                console.log('✅ User profile:', profile);
            }
        }

        console.log('\n✅ All tests completed!');
        return { success: true };
        
    } catch (error) {
        console.error('💥 Test failed with exception:', error);
        return { success: false, error };
    }
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
    (window as any).testBookingsConnection = testBookingsConnection;
    console.log('💡 Run testBookingsConnection() in console to test');
}
