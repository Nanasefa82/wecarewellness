import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
    BookingRecord, 
    CreateBookingData, 
    UpdateBookingData, 
    BookingFilters,
    ExtendedBookingFormData,
    PaginatedResponse 
} from '../types/booking';
import { emailService, BookingEmailData } from '../services/emailService';

export const useBookings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // CREATE - Submit a new booking
    const createBooking = async (bookingData: CreateBookingData): Promise<BookingRecord> => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert([{
                    availability_slot_id: bookingData.availability_slot_id,
                    first_name: bookingData.first_name,
                    last_name: bookingData.last_name,
                    email: bookingData.email,
                    phone: bookingData.phone,
                    date_of_birth: bookingData.date_of_birth,
                    preferred_date: bookingData.preferred_date,
                    preferred_time: bookingData.preferred_time,
                    reason_for_visit: bookingData.reason_for_visit,
                    previous_treatment: bookingData.previous_treatment,
                    current_medications: bookingData.current_medications,
                    insurance_provider: bookingData.insurance_provider,
                    emergency_contact: bookingData.emergency_contact,
                    emergency_phone: bookingData.emergency_phone,
                    consent_accepted: bookingData.consent_accepted,
                    status: 'pending'
                }])
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
                .single();

            if (error) throw error;
            
            // Send confirmation emails after successful booking creation
            try {
                const emailData: BookingEmailData = {
                    booking: data,
                    doctorName: data.availability_slot?.doctor_profiles?.name || 'Dr. Emma Boateng',
                    doctorCredentials: 'DNP, MSN, PMHNP-BC',
                    doctorEmail: 'doctor@wecarewellnessllc.com', // This should come from the doctor profile
                    appointmentType: data.availability_slot?.appointment_type || 'consultation',
                    sessionType: 'virtual', // Default to virtual, could be determined from appointment type
                    timezone: 'EST',
                    cancelUrl: `${window.location.origin}/cancel-appointment/${data.id}`
                };
                
                // Send emails (don't wait for completion to avoid blocking the user)
                emailService.sendBookingConfirmation(emailData).then((result) => {
                    console.log('📧 Email sending results:', result);
                }).catch((emailError) => {
                    console.error('📧 Email sending failed:', emailError);
                    // Don't throw error here - booking was successful even if emails failed
                });
                
            } catch (emailError) {
                console.error('📧 Email preparation failed:', emailError);
                // Don't throw error here - booking was successful even if emails failed
            }
            
            return data;
        } catch (err: unknown) {
            console.error('💥 createBooking error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // READ - Get booking by ID
    const getBooking = async (id: string): Promise<BookingRecord> => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
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
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (err: unknown) {
            console.error('💥 getBooking error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch booking';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // READ - Get all bookings with filters and pagination
    const getBookings = async (
        filters?: BookingFilters,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResponse<BookingRecord>> => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 getBookings called with filters:', filters, 'page:', page, 'limit:', limit);
            
            let query = supabase
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
                `, { count: 'exact' });

            // Apply filters
            if (filters?.email) {
                query = query.ilike('email', `%${filters.email}%`);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.start_date) {
                query = query.gte('preferred_date', filters.start_date);
            }
            if (filters?.end_date) {
                query = query.lte('preferred_date', filters.end_date);
            }
            if (filters?.search) {
                query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            // Order by creation date (newest first)
            query = query.order('created_at', { ascending: false });

            const { data, error, count } = await query;

            if (error) {
                console.error('❌ Supabase query error:', error);
                throw error;
            }

            console.log('✅ getBookings success:', { count, dataLength: data?.length });

            return {
                data: data || [],
                count: count || 0,
                page,
                limit,
                total_pages: Math.ceil((count || 0) / limit)
            };
        } catch (err: unknown) {
            console.error('💥 getBookings error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // UPDATE - Update booking
    const updateBooking = async (id: string, updateData: UpdateBookingData): Promise<BookingRecord> => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('bookings')
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
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
                .single();

            if (error) throw error;
            return data;
        } catch (err: unknown) {
            console.error('💥 updateBooking error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // DELETE - Delete booking
    const deleteBooking = async (id: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err: unknown) {
            console.error('💥 deleteBooking error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete booking';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // UTILITY - Transform form data to create data
    const transformFormDataToCreateData = (formData: ExtendedBookingFormData): CreateBookingData => {
        return {
            availability_slot_id: formData.availability_slot_id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth,
            preferred_date: formData.preferredDate,
            preferred_time: formData.preferredTime,
            reason_for_visit: formData.reasonForVisit,
            previous_treatment: formData.previousTreatment,
            current_medications: formData.currentMedications,
            insurance_provider: formData.insuranceProvider,
            emergency_contact: formData.emergencyContact,
            emergency_phone: formData.emergencyPhone,
            consent_accepted: formData.consent_accepted
        };
    };

    // UTILITY - Get bookings by email (for client lookup)
    const getBookingsByEmail = async (email: string): Promise<BookingRecord[]> => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
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
                .eq('email', email)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (err: unknown) {
            console.error('💥 getBookingsByEmail error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings by email';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // UTILITY - Update booking status
    const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<BookingRecord> => {
        return updateBooking(id, { status });
    };

    return {
        loading,
        error,
        createBooking,
        getBooking,
        getBookings,
        updateBooking,
        deleteBooking,
        getBookingsByEmail,
        updateBookingStatus,
        transformFormDataToCreateData
    };
};
