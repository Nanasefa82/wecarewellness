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
            // Use direct table query with timeout to handle hanging queries
            console.log('🎯 Using direct table query with timeout protection');

            // Create a timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Query timeout after 3 seconds')), 3000);
            });

            // Build query - only filter by doctor_id if provided
            let query = supabase
                .from('availability_slots')
                .select('*')
                .eq('is_available', true)
                .gte('start_time', startDate + 'T00:00:00')
                .lte('start_time', endDate + 'T23:59:59')
                .order('start_time', { ascending: true })
                .limit(200);

            // Only filter by doctor if doctorId is provided and not empty
            if (doctorId && doctorId.trim() !== '') {
                console.log('🔍 Filtering by doctor_id:', doctorId);
                query = query.eq('doctor_id', doctorId);
            } else {
                console.log('🔍 Loading all available slots (no doctor filter)');
            }

            const queryPromise = query;

            console.log('🔍 Querying availability_slots table with timeout...');

            // Race between query and timeout
            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            console.log('✅ Supabase query completed');

            if (error) {
                console.error('❌ Database query error:', error);
                throw error;
            }

            console.log('✅ Query returned:', data?.length || 0, 'slots');
            if (data && data.length > 0) {
                console.log('📊 Sample slot:', data[0]);
            }

            return data || [];

        } catch (error) {
            console.error('💥 AvailabilityService.getAvailabilitySlots error:', error);

            // Return mock data as fallback for development
            console.warn('⚠️ Using mock data due to database connection issue');
            return this.getMockAvailabilitySlots(doctorId, startDate, endDate);
        }
    }

    /**
     * Generate mock availability slots for development/testing
     */
    private static getMockAvailabilitySlots(
        doctorId: string,
        startDate: string,
        endDate: string
    ): AvailabilitySlot[] {
        console.log('🎭 Generating mock availability slots');

        const slots: AvailabilitySlot[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Generate slots for each weekday (Mon-Fri) between 9 AM and 5 PM
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();

            // Skip weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;

            // Create morning slots (9 AM - 12 PM) - using UTC to avoid timezone confusion
            for (let hour = 9; hour < 12; hour++) {
                // Create date in UTC to match what would be stored in database
                const slotDate = new Date(d);
                // Set the time in local timezone, then adjust to store as if it were UTC
                // This ensures 11am local shows as 11am in the calendar
                const localHour = hour;
                const utcDate = new Date(Date.UTC(
                    slotDate.getFullYear(),
                    slotDate.getMonth(),
                    slotDate.getDate(),
                    localHour,
                    0,
                    0,
                    0
                ));

                slots.push({
                    id: `mock-${utcDate.getTime()}-${hour}`,
                    doctor_id: doctorId,
                    start_time: utcDate.toISOString(),
                    end_time: new Date(utcDate.getTime() + 60 * 60 * 1000).toISOString(),
                    is_available: true,
                    appointment_type: 'consultation',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }

            // Create afternoon slots (1 PM - 5 PM) - using UTC to avoid timezone confusion
            for (let hour = 13; hour < 17; hour++) {
                // Create date in UTC to match what would be stored in database
                const slotDate = new Date(d);
                // Set the time in local timezone, then adjust to store as if it were UTC
                const localHour = hour;
                const utcDate = new Date(Date.UTC(
                    slotDate.getFullYear(),
                    slotDate.getMonth(),
                    slotDate.getDate(),
                    localHour,
                    0,
                    0,
                    0
                ));

                slots.push({
                    id: `mock-${utcDate.getTime()}-${hour}`,
                    doctor_id: doctorId,
                    start_time: utcDate.toISOString(),
                    end_time: new Date(utcDate.getTime() + 60 * 60 * 1000).toISOString(),
                    is_available: true,
                    appointment_type: 'consultation',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
        }

        console.log('🎭 Generated', slots.length, 'mock slots');
        return slots;
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