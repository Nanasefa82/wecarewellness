import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AvailabilitySlot, CreateAvailabilitySlotData, RecurringAvailabilityData } from '../types/booking';
import { cache } from '../utils/cache';
import { AvailabilityService } from '../services/availabilityService';

export const useAvailability = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAvailabilitySlot = useCallback(async (slotData: CreateAvailabilitySlotData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await AvailabilityService.createAvailabilitySlot(slotData);
            
            // Clear cache to force refresh
            cache.clear();
            
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailabilitySlots = useCallback(async (doctorId?: string, startDate?: string, endDate?: string) => {
        if (!startDate || !endDate) {
            console.error('❌ Missing required date parameters:', { doctorId, startDate, endDate });
            return [];
        }

        // Create cache key (include 'all' if no doctorId)
        const cacheKey = `availability_slots_${doctorId || 'all'}_${startDate}_${endDate}`;
        
        // Check cache first
        const cachedData = cache.get<AvailabilitySlot[]>(cacheKey);
        if (cachedData) {
            console.log('📦 Using cached availability slots');
            return cachedData;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔍 useAvailability.getAvailabilitySlots called with:', { doctorId: doctorId || 'all', startDate, endDate });

            // Use the new service (doctorId is optional now)
            const result = await AvailabilityService.getAvailabilitySlots(doctorId || '', startDate, endDate);
            
            // Cache the result for 2 minutes
            cache.set(cacheKey, result, 2 * 60 * 1000);
            
            console.log('✅ useAvailability.getAvailabilitySlots returned:', result.length, 'slots');
            return result;
        } catch (err: unknown) {
            console.error('💥 useAvailability.getAvailabilitySlots error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array since this function doesn't depend on any props or state

    const getAvailableSlotsFunction = async (startDate: string, endDate: string, doctorId?: string) => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 getAvailableSlotsFunction called with:', { startDate, endDate, doctorId });
            const { data, error } = await supabase.rpc('get_available_slots', {
                start_date: startDate,
                end_date: endDate,
                doctor_id_param: doctorId
            });

            if (error) {
                console.error('❌ Database function error:', error);
                throw error;
            }
            console.log('✅ Database function returned:', data);
            return data;
        } catch (err: unknown) {
            console.error('💥 getAvailableSlotsFunction error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createRecurringAvailability = async (recurringData: RecurringAvailabilityData) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.rpc('create_recurring_availability', {
                doctor_id_param: recurringData.doctor_id,
                start_date: recurringData.start_date,
                end_date: recurringData.end_date,
                time_slots: recurringData.time_slots,
                appointment_type_param: recurringData.appointment_type
            });

            if (error) throw error;
            return data;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateAvailabilitySlot = async (id: string, updates: Partial<AvailabilitySlot>) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('availability_slots')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAvailabilitySlot = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            await AvailabilityService.deleteAvailabilitySlot(id);
            
            // Clear cache to force refresh
            cache.clear();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createAvailabilitySlot,
        getAvailabilitySlots,
        getAvailableSlotsFunction,
        createRecurringAvailability,
        updateAvailabilitySlot,
        deleteAvailabilitySlot,
    };
};