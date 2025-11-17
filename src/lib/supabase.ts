import { createClient, Session } from '@supabase/supabase-js';

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
    },
    global: {
        headers: {
            'x-client-info': 'wecare-wellness-app'
        }
    }
});

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
    try {
        console.log('🔗 Testing Supabase connection...');
        const { error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
            console.error('❌ Supabase connection test failed:', error);
            return false;
        }
        
        console.log('✅ Supabase connection test successful');
        return true;
    } catch (error: unknown) {
        console.error('💥 Supabase connection test exception:', error);
        return false;
    }
};

// Clear potentially stale cache after Supabase restart
export const clearSupabaseCache = (): void => {
    try {
        console.log('🗑️ Clearing Supabase-related cache...');
        const keys = Object.keys(localStorage);
        const supabaseKeys = keys.filter(key => 
            key.startsWith('profile_') || 
            key.startsWith('supabase.') ||
            key.includes('auth')
        );
        
        supabaseKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️ Removed cache key: ${key}`);
        });
        
        console.log(`✅ Cleared ${supabaseKeys.length} cache entries`);
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
    }
};

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
                    working_hours: Record<string, unknown>;
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
                    working_hours?: Record<string, unknown>;
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
                    working_hours?: Record<string, unknown>;
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
                    time_slots: Record<string, unknown>[];
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

    onAuthStateChange: (callback: (event: string, session: Session | null) => void) =>
        supabase.auth.onAuthStateChange(callback),
};

export default supabase;