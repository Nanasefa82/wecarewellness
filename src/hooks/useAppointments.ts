import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '../types/booking';
import { AppointmentsService } from '../services/appointmentsService';

export const useAppointments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bookAppointment = useCallback(async (appointmentData: CreateAppointmentData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await AppointmentsService.bookAppointment(appointmentData);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAppointments = async (doctorId?: string, _startDate?: string, _endDate?: string) => {
        setLoading(true);
        setError(null);

        try {
            let query = supabase
                .from('appointments')
                .select(`
          *,
          availability_slots!inner(
            start_time,
            end_time,
            doctor_id,
            doctor_profiles(name)
          )
        `)
                .order('created_at', { ascending: false });

            if (doctorId) {
                query = query.eq('availability_slots.doctor_id', doctorId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data as Appointment[];
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDoctorAppointments = useCallback(async (doctorId: string, startDate: string, endDate: string) => {
        if (!doctorId || !startDate || !endDate) {
            console.error('❌ Missing required parameters:', { doctorId, startDate, endDate });
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔍 useAppointments.getDoctorAppointments called with:', { doctorId, startDate, endDate });
            const result = await AppointmentsService.getDoctorAppointments(doctorId, startDate, endDate);
            console.log('✅ useAppointments.getDoctorAppointments returned:', result?.length || 0, 'appointments');
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('💥 useAppointments.getDoctorAppointments error:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAppointmentDetails = useCallback(async (appointmentId: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await AppointmentsService.getAppointmentDetails(appointmentId);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAppointment = useCallback(async (id: string, updates: UpdateAppointmentData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await AppointmentsService.updateAppointment(id, updates);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelAppointment = useCallback(async (id: string) => {
        return updateAppointment(id, { status: 'cancelled' });
    }, [updateAppointment]);

    const getDashboardStats = useCallback(async (doctorId: string) => {
        if (!doctorId) {
            console.error('❌ Missing doctorId parameter');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔍 useAppointments.getDashboardStats called with:', doctorId);
            const result = await AppointmentsService.getDashboardStats(doctorId);
            console.log('✅ useAppointments.getDashboardStats returned:', result);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('💥 useAppointments.getDashboardStats error:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        bookAppointment,
        getAppointments,
        getDoctorAppointments,
        getAppointmentDetails,
        updateAppointment,
        cancelAppointment,
        getDashboardStats,
    };
};