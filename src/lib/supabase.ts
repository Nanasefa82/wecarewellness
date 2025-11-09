import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Database type definitions for better TypeScript support
export type Database = {
    public: {
        Tables: {
            doctor_profiles: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    specialization: string | null;
                    bio: string | null;
                    default_appointment_duration: number;
                    buffer_time: number;
                    working_hours: any;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    specialization?: string | null;
                    bio?: string | null;
                    default_appointment_duration?: number;
                    buffer_time?: number;
                    working_hours?: any;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    specialization?: string | null;
                    bio?: string | null;
                    default_appointment_duration?: number;
                    buffer_time?: number;
                    working_hours?: any;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            availability_slots: {
                Row: {
                    id: string;
                    doctor_id: string;
                    start_time: string;
                    end_time: string;
                    is_available: boolean;
                    appointment_type: string;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    doctor_id: string;
                    start_time: string;
                    end_time: string;
                    is_available?: boolean;
                    appointment_type?: string;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    doctor_id?: string;
                    start_time?: string;
                    end_time?: string;
                    is_available?: boolean;
                    appointment_type?: string;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            appointments: {
                Row: {
                    id: string;
                    availability_slot_id: string;
                    client_name: string;
                    client_email: string;
                    client_phone: string | null;
                    appointment_type: string;
                    status: string;
                    client_notes: string | null;
                    doctor_notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    availability_slot_id: string;
                    client_name: string;
                    client_email: string;
                    client_phone?: string | null;
                    appointment_type?: string;
                    status?: string;
                    client_notes?: string | null;
                    doctor_notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    availability_slot_id?: string;
                    client_name?: string;
                    client_email?: string;
                    client_phone?: string | null;
                    appointment_type?: string;
                    status?: string;
                    client_notes?: string | null;
                    doctor_notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
        Functions: {
            get_available_slots: {
                Args: {
                    start_date: string;
                    end_date: string;
                    doctor_id_param?: string;
                };
                Returns: {
                    id: string;
                    doctor_id: string;
                    doctor_name: string;
                    start_time: string;
                    end_time: string;
                    appointment_type: string;
                    notes: string | null;
                }[];
            };
            create_recurring_availability: {
                Args: {
                    doctor_id_param: string;
                    start_date: string;
                    end_date: string;
                    time_slots: any;
                    appointment_type_param?: string;
                };
                Returns: number;
            };
            get_doctor_appointments: {
                Args: {
                    doctor_id_param: string;
                    start_date: string;
                    end_date: string;
                };
                Returns: {
                    appointment_id: string;
                    slot_id: string;
                    client_name: string;
                    client_email: string;
                    client_phone: string | null;
                    appointment_type: string;
                    status: string;
                    start_time: string;
                    end_time: string;
                    client_notes: string | null;
                    doctor_notes: string | null;
                    created_at: string;
                }[];
            };
            get_appointment_details: {
                Args: {
                    appointment_id_param: string;
                };
                Returns: {
                    appointment_id: string;
                    slot_id: string;
                    doctor_id: string;
                    doctor_name: string;
                    client_name: string;
                    client_email: string;
                    client_phone: string | null;
                    appointment_type: string;
                    status: string;
                    start_time: string;
                    end_time: string;
                    client_notes: string | null;
                    doctor_notes: string | null;
                    created_at: string;
                }[];
            };
        };
    };
};

// Typed supabase client
export const typedSupabase = supabase as ReturnType<typeof createClient<Database>>;

// Auth helpers
export const auth = {
    signIn: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),

    signUp: (email: string, password: string) =>
        supabase.auth.signUp({ email, password }),

    signOut: () => supabase.auth.signOut(),

    getUser: () => supabase.auth.getUser(),

    getSession: () => supabase.auth.getSession(),

    onAuthStateChange: (callback: (event: string, session: any) => void) =>
        supabase.auth.onAuthStateChange(callback),
};

export default supabase;