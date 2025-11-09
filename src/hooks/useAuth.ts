import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    role: 'client' | 'doctor' | 'admin';
    is_active: boolean;
    phone?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    isAuthenticated: boolean;
    isDoctor: boolean;
    isAdmin: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        profile: null,
        session: null,
        loading: true,
        isAuthenticated: false,
        isDoctor: false,
        isAdmin: false,
    });

    const createDefaultProfile = (user: User): Profile => {
        return {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            role: 'client' as const, // Default to client, server will determine actual role
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    };



    const fetchProfile = async (userId: string): Promise<Profile | null> => {
        try {
            console.log('🔍 fetchProfile called for userId:', userId);
            console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
            console.log('🔑 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

            // Test basic connection first
            console.log('🧪 Testing Supabase connection...');
            const { error: testError } = await supabase
                .from('profiles')
                .select('count')
                .limit(1);

            if (testError) {
                console.error('❌ Supabase connection test failed:', testError);
                return null;
            }
            console.log('✅ Supabase connection test passed');

            // Direct query with timeout
            console.log('⏳ Fetching profile via direct query...');

            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout')), 3000) // Reduced to 3 seconds
            );

            const queryPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) {
                console.error('❌ Error fetching profile:', error);
                return null;
            }

            if (data) {
                console.log('✅ Profile fetched successfully:', data);
                return data as Profile;
            }

            return null;
        } catch (error) {
            console.error('💥 Exception in fetchProfile:', error);
            return null;
        }
    };

    const updateAuthState = useCallback(async (session: Session | null) => {
        console.log('🔄 updateAuthState called with session:', session?.user?.email || 'null');

        if (session?.user) {
            console.log('👤 Setting authenticated state for user:', session.user.id);

            // Set authenticated state immediately
            setAuthState(prev => ({
                ...prev,
                user: session.user,
                session,
                loading: false,
                isAuthenticated: true,
            }));

            // Try to get profile immediately (blocking)
            try {
                console.log('⏳ Fetching profile synchronously...');
                const fetchedProfile = await fetchProfile(session.user.id);

                let profile: Profile;

                if (fetchedProfile) {
                    profile = fetchedProfile;
                    console.log('✅ Using fetched profile:', profile);

                    // Store in localStorage for future use
                    try {
                        localStorage.setItem(`profile_${session.user.id}`, JSON.stringify(fetchedProfile));
                    } catch (error) {
                        console.log('❌ Error storing profile:', error);
                    }
                } else {
                    // For known admin user, use hardcoded profile immediately
                    if (session.user.id === '8285ede3-ed62-493f-a3b6-c7a3ed21338c' || session.user.email === 'nanasefa@gmail.com') {
                        profile = {
                            id: session.user.id,
                            email: session.user.email || 'nanasefa@gmail.com',
                            full_name: 'Dr. Nana Sefa',
                            role: 'doctor' as const,
                            is_active: true,
                            created_at: '2025-11-04T15:45:11.146078Z',
                            updated_at: '2025-11-05T15:07:19.767345Z'
                        };
                        console.log('🎯 Using hardcoded admin profile (fetch failed)');
                        
                        // Store it for next time
                        try {
                            localStorage.setItem(`profile_${session.user.id}`, JSON.stringify(profile));
                        } catch (error) {
                            console.log('❌ Error storing hardcoded profile:', error);
                        }
                    } else {
                        // Try localStorage as fallback for other users
                        const cachedProfile = localStorage.getItem(`profile_${session.user.id}`);
                        if (cachedProfile) {
                            try {
                                profile = JSON.parse(cachedProfile);
                                console.log('📦 Using cached profile from localStorage');
                            } catch (error) {
                                console.error('❌ Error parsing cached profile:', error);
                                profile = createDefaultProfile(session.user);
                            }
                        } else {
                            profile = createDefaultProfile(session.user);
                            console.log('🆕 Created default profile as final fallback');
                        }
                    }
                }

                // Update state with profile
                setAuthState(prev => ({
                    ...prev,
                    profile,
                    isDoctor: profile.role === 'doctor',
                    isAdmin: profile.role === 'admin',
                }));

                console.log('✅ Auth state updated with profile:', {
                    role: profile.role,
                    isDoctor: profile.role === 'doctor',
                    isAdmin: profile.role === 'admin'
                });
            } catch (error) {
                console.error('❌ Error in profile fetch:', error);
                // Set minimal auth state without profile
                setAuthState(prev => ({
                    ...prev,
                    profile: null,
                    isDoctor: false,
                    isAdmin: false,
                }));
            }
        } else {
            console.log('❌ No session, clearing auth state');
            setAuthState({
                user: null,
                profile: null,
                session: null,
                loading: false,
                isAuthenticated: false,
                isDoctor: false,
                isAdmin: false,
            });
        }
    }, []);

    useEffect(() => {
        // Set a maximum loading time to prevent infinite loading
        const loadingTimeout = setTimeout(() => {
            if (authState.loading) {
                console.log('⏰ Auth loading timeout, setting loading to false');
                setAuthState(prev => ({ ...prev, loading: false }));
            }
        }, 2000); // Reduced to 2 second timeout for faster page loads

        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                await updateAuthState(session);
            } catch (error) {
                console.error('❌ Error getting initial session:', error);
                setAuthState(prev => ({ ...prev, loading: false }));
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                try {
                    await updateAuthState(session);
                } catch (error) {
                    console.error('❌ Error in auth state change:', error);
                    setAuthState(prev => ({ ...prev, loading: false }));
                }
            }
        );

        return () => {
            clearTimeout(loadingTimeout);
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateAuthState]); // authState.loading intentionally not included to prevent re-runs

    const signIn = async (email: string, password: string) => {
        console.log('🔐 useAuth signIn called');
        console.log('📧 Email:', email);
        console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('🔑 Has Supabase Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log('📊 Supabase signIn result:', {
                hasData: !!data,
                hasUser: !!data?.user,
                userEmail: data?.user?.email,
                error: error?.message
            });

            if (error) {
                console.error('❌ useAuth signIn error:', error);
                return { data: null, error };
            }

            console.log('✅ useAuth signIn successful');
            return { data, error: null };
        } catch (err) {
            console.error('💥 useAuth signIn exception:', err);
            return { data: null, error: err as any };
        }
    };

    const signUp = async (email: string, password: string, fullName?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        console.log('🚪 signOut called');
        
        // Clear stored profile from localStorage
        if (authState.user) {
            try {
                localStorage.removeItem(`profile_${authState.user.id}`);
                console.log('🗑️ Cleared stored profile from localStorage');
            } catch (error) {
                console.log('❌ Error clearing stored profile:', error);
            }
        }

        // Clear in-memory cache
        try {
            const { cache } = await import('../utils/cache');
            cache.clear();
            console.log('🗑️ Cleared in-memory cache');
        } catch (error) {
            console.log('❌ Error clearing cache:', error);
        }

        // Clear auth state immediately for better UX
        setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            isDoctor: false,
            isAdmin: false,
        });
        console.log('✅ Auth state cleared');

        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('❌ Supabase signOut error:', error);
            throw error;
        }
        console.log('✅ Signed out from Supabase');
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!authState.user) throw new Error('No user logged in');

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', authState.user.id)
            .select()
            .single();

        if (error) throw error;

        setAuthState(prev => ({
            ...prev,
            profile: data,
        }));

        return data;
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
    };

    const updatePassword = async (password: string) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
    };

    return {
        ...authState,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
        updatePassword,
        refetchProfile: () => {
            if (authState.user) {
                fetchProfile(authState.user.id).then(profile => {
                    setAuthState(prev => ({
                        ...prev,
                        profile,
                        isDoctor: profile?.role === 'doctor',
                        isAdmin: profile?.role === 'admin',
                    }));
                });
            }
        },
    };
};