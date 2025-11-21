export interface DoctorProfile {
    id: string;
    user_id: string;
    name: string;
    specialization?: string;
    bio?: string;
    default_appointment_duration: number;
    buffer_time: number;
    working_hours: WorkingHours;
    created_at: string;
    updated_at: string;
}

export interface WorkingHours {
    [key: string]: {
        start: string;
        end: string;
        enabled: boolean;
    };
}

export interface AvailabilitySlot {
    id: string;
    doctor_id: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    appointment_type: AppointmentType;
    notes?: string;
    created_at: string;
    updated_at: string;
    doctor_name?: string;
}

export interface Appointment {
    id: string;
    availability_slot_id: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    appointment_type: AppointmentType;
    status: AppointmentStatus;
    client_notes?: string;
    doctor_notes?: string;
    created_at: string;
    updated_at: string;
    availability_slot?: AvailabilitySlot;
    start_time?: string;
    end_time?: string;
    doctor_name?: string;
}

export type AppointmentType = 'consultation' | 'therapy' | 'evaluation' | 'follow_up';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface CreateAvailabilitySlotData {
    doctor_id: string;
    start_time: string;
    end_time: string;
    appointment_type?: AppointmentType;
    notes?: string;
}

export interface CreateAppointmentData {
    availability_slot_id: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    appointment_type?: AppointmentType;
    client_notes?: string;
}

export interface UpdateAppointmentData {
    status?: AppointmentStatus;
    client_notes?: string;
    doctor_notes?: string;
    client_name?: string;
    client_email?: string;
    client_phone?: string;
}

export interface CreateDoctorProfileData {
    user_id: string;
    name: string;
    specialization?: string;
    bio?: string;
    default_appointment_duration?: number;
    buffer_time?: number;
    working_hours?: WorkingHours;
}

export interface DateRange {
    start: Date;
    end: Date;
}

export interface TimeSlot {
    start: string;
    end: string;
    days: number[]; // 0=Sunday, 1=Monday, etc.
}

export interface RecurringAvailabilityData {
    doctor_id: string;
    start_date: string;
    end_date: string;
    time_slots: TimeSlot[];
    appointment_type?: AppointmentType;
}

export interface AppointmentFilters {
    doctor_id?: string;
    client_email?: string;
    status?: AppointmentStatus;
    appointment_type?: AppointmentType;
    start_date?: string;
    end_date?: string;
}

export interface AvailabilityFilters {
    doctor_id?: string;
    start_date?: string;
    end_date?: string;
    appointment_type?: AppointmentType;
    is_available?: boolean;
}

// Calendar related types
export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'available' | 'booked' | 'blocked';
    data?: AvailabilitySlot | Appointment;
}

export interface CalendarViewProps {
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
    onDateSelect?: (date: Date) => void;
    view?: 'month' | 'week' | 'day';
}

// Form validation schemas (for use with zod)
export interface BookingFormData {
    client_name: string;
    client_email: string;
    client_phone?: string;
    appointment_type: AppointmentType;
    client_notes?: string;
    availability_slot_id: string;
}

export interface AvailabilityFormData {
    start_time: string;
    end_time: string;
    appointment_type: AppointmentType;
    notes?: string;
    is_recurring?: boolean;
    recurring_days?: number[];
    recurring_end_date?: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    page: number;
    limit: number;
    total_pages: number;
}

// Notification types
export interface BookingNotification {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

// Dashboard statistics
export interface DashboardStats {
    total_appointments: number;
    upcoming_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    available_slots: number;
    this_week_appointments: number;
    this_month_appointments: number;
}

export interface ClientStats {
    total_bookings: number;
    upcoming_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
}

// Extended booking form data that matches the BookingFormPage
export interface ExtendedBookingFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    preferredDate: string;
    preferredTime: string;
    reasonForVisit: string;
    previousTreatment: string;
    currentMedications: string;
    insuranceProvider: string;
    emergencyContact: string;
    emergencyPhone: string;
    availability_slot_id?: string;
    consent_accepted: boolean;
}

// Database booking record interface
export interface BookingRecord {
    id: string;
    availability_slot_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    preferred_date: string;
    preferred_time: string;
    reason_for_visit: string;
    previous_treatment: string;
    current_medications: string;
    insurance_provider: string;
    emergency_contact: string;
    emergency_phone: string;
    consent_accepted: boolean;
    status: BookingStatus;
    created_at: string;
    updated_at: string;
    availability_slot?: AvailabilitySlot;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// API interfaces for CRUD operations
export interface CreateBookingData {
    availability_slot_id?: string;
    doctor_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    preferred_date: string;
    preferred_time: string;
    reason_for_visit: string;
    previous_treatment: string;
    current_medications: string;
    insurance_provider: string;
    emergency_contact: string;
    emergency_phone: string;
    consent_accepted: boolean;
}

export interface UpdateBookingData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    preferred_date?: string;
    preferred_time?: string;
    reason_for_visit?: string;
    previous_treatment?: string;
    current_medications?: string;
    insurance_provider?: string;
    emergency_contact?: string;
    emergency_phone?: string;
    status?: BookingStatus;
    consent_accepted?: boolean;
}

export interface BookingFilters {
    email?: string;
    status?: BookingStatus;
    start_date?: string;
    end_date?: string;
    search?: string; // For searching by name, email, or phone
}