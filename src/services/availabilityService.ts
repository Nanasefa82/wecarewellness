import { supabase } from '../lib/supabase';
import { requireAuth } from '../utils/authUtils';
import { AvailabilitySlot, CreateAvailabilitySlotData } from '../types/booking';

/**
 * Service for managing availability slots with proper authentication
 */
export class AvailabilityService {

    /**
     * Get availability slots for a doctor within a date range
     */
    static async getAvailabilitySlots(
        doctorId: string,
        startDate: string,
        endDate: string
    ): Promise<AvailabilitySlot[]> {
        console.log('🔍 AvailabilityService.getAvailabilitySlots called:', {
            doctorId,
            startDate,
            endDate
        });

        try {
            // Use direct table query instead of function to avoid timeout issues
            console.log('🎯 Using direct table query for better performance');
            console.log('🔍 Query parameters:', {
                doctorId,
                startDate: startDate + 'T00:00:00',
                endDate: endDate + 'T23:59:59'
            });

            // Try a simpler query first to see if it's a query complexity issue
            console.log('🔍 Testing simple query first...');
            const queryStartTime = Date.now();
            const { data: testData, error: testError } = await supabase
                .from('availability_slots')
                .select('id, start_time, end_time, doctor_id, is_available')
                .eq('doctor_id', doctorId)
                .limit(10);

            const queryDuration = Date.now() - queryStartTime;
            console.log('🧪 Simple test query result:', { 
                count: testData?.length || 0, 
                error: testError,
                duration: `${queryDuration}ms`
            });

            if (testError) {
                console.error('❌ Simple test query failed:', testError);
                throw testError;
            }

            // Now try the full query - removed is_available filter to see all slots
            console.log('🔍 Running full query (including unavailable slots for debugging)...');
            const { data, error } = await supabase
                .from('availability_slots')
                .select('*')
                .eq('doctor_id', doctorId)
                .gte('start_time', startDate + 'T00:00:00')
                .lte('start_time', endDate + 'T23:59:59')
                .order('start_time', { ascending: true });

            if (error) {
                console.error('❌ Database query error:', error);
                console.error('❌ Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }

            console.log('✅ Direct query returned:', data?.length || 0, 'slots');
            if (data && data.length > 0) {
                console.log('📊 Sample slot data:', data[0]);
                console.log('📊 All slots:', data.map(slot => ({
                    id: slot.id,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    doctor_id: slot.doctor_id,
                    is_available: slot.is_available
                })));
            }

            // Data is already in the correct format for AvailabilitySlot interface
            return data || [];

        } catch (error) {
            console.error('💥 AvailabilityService.getAvailabilitySlots error:', error);
            // Return empty array instead of throwing to prevent component crash
            return [];
        }
    }

    /**
     * Create a new availability slot
     */
    static async createAvailabilitySlot(slotData: CreateAvailabilitySlotData): Promise<AvailabilitySlot> {
        console.log('🔍 AvailabilityService.createAvailabilitySlot called');

        await requireAuth('doctor');

        const { data, error } = await supabase
            .from('availability_slots')
            .insert([slotData])
            .select()
            .single();

        if (error) {
            console.error('❌ Create slot error:', error);
            throw error;
        }

        console.log('✅ Slot created successfully');
        return data;
    }

    /**
     * Delete an availability slot
     */
    static async deleteAvailabilitySlot(slotId: string): Promise<void> {
        console.log('🔍 AvailabilityService.deleteAvailabilitySlot called:', slotId);

        await requireAuth('doctor');

        const { error } = await supabase
            .from('availability_slots')
            .delete()
            .eq('id', slotId);

        if (error) {
            console.error('❌ Delete slot error:', error);
            throw error;
        }

        console.log('✅ Slot deleted successfully');
    }
}