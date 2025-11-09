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

            // Build query based on whether doctorId is provided
            const hasDoctor = doctorId && doctorId.trim() !== '';
            console.log('🔍 Building query...', { doctorId, hasDoctor });
            
            let query = supabase
                .from('availability_slots')
                .select('*')
                .eq('is_available', true)
                .gte('start_time', startDate + 'T00:00:00')
                .lte('start_time', endDate + 'T23:59:59')
                .order('start_time', { ascending: true });

            // Only filter by doctor if doctorId is provided and not empty
            if (hasDoctor) {
                console.log('🔍 Filtering by doctor_id:', doctorId);
                query = query.eq('doctor_id', doctorId);
            } else {
                console.log('🔍 Fetching all available slots (no doctor filter)');
            }

            console.log('🚀 Executing query...');
            const queryStartTime = Date.now();
            const { data, error } = await query;
            const queryDuration = Date.now() - queryStartTime;

            console.log('✅ Query completed in', `${queryDuration}ms`);

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

            console.log('✅ Query returned:', data?.length || 0, 'slots');
            if (data && data.length > 0) {
                console.log('📊 Sample slot:', {
                    id: data[0].id,
                    start_time: data[0].start_time,
                    doctor_id: data[0].doctor_id,
                    is_available: data[0].is_available
                });
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