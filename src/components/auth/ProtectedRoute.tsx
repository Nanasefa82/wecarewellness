import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireDoctor?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false,
    requireDoctor = false
}) => {
    const { isAuthenticated, isAdmin, isDoctor, loading, profile, user, session } = useAuthContext();
    const location = useLocation();
    const [timeoutReached, setTimeoutReached] = useState(false);

    console.log('🛡️ ProtectedRoute check for', location.pathname, ':', {
        loading,
        isAuthenticated,
        isAdmin,
        isDoctor,
        requireAdmin,
        requireDoctor,
        profile: profile ? `role: ${profile.role}` : 'null',
        user: user ? `email: ${user.email}` : 'null',
        session: session ? 'exists' : 'null',
        timeoutReached,
        timestamp: new Date().toISOString()
    });

    // Set a timeout to prevent infinite loading (increased for Supabase restart)
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('⏰ ProtectedRoute: Timeout reached, allowing access if authenticated');
            setTimeoutReached(true);
        }, 8000); // Increased to 8 seconds to handle Supabase restart delays

        return () => clearTimeout(timer);
    }, []);

    // Check for valid session if auth context shows not authenticated
    useEffect(() => {
        const checkSession = async () => {
            if (!isAuthenticated && !loading && !timeoutReached) {
                try {
                    const { data: { session: currentSession } } = await supabase.auth.getSession();
                    if (currentSession) {
                        console.log('🔄 ProtectedRoute: Found valid session, but auth context not updated');
                        console.log('🔄 Session user:', currentSession.user.email);
                        // The auth context should update automatically, but let's wait a moment
                        setTimeout(() => {
                            window.location.reload(); // Force reload to reinitialize auth
                        }, 100);
                        return;
                    }
                } catch (error) {
                    console.error('❌ Error checking session:', error);
                }
            }
        };
        
        checkSession();
    }, [isAuthenticated, loading, timeoutReached]);

    // Show loading only if we're still loading and haven't reached timeout
    if (loading && !timeoutReached) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">
                        {loading ? 'Loading authentication...' : 'Loading profile...'}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        This should only take a moment...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login');
        console.log('🚫 Auth details:', { user: !!user, profile: !!profile, loading, session: !!session });
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (requireDoctor && !isDoctor && !isAdmin) {
        // If we're still loading and haven't timed out, show loading
        if (!timeoutReached && isAuthenticated && !profile) {
            console.log('⏳ ProtectedRoute: Profile still loading for doctor route, waiting...');
            return (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-300">Loading profile...</p>
                    </div>
                </div>
            );
        }
        
        // If timeout reached and we have an authenticated user, allow access for known admin emails
        if (timeoutReached && isAuthenticated && user?.email === 'nanasefa@gmail.com') {
            console.log('🎯 ProtectedRoute: Allowing access due to timeout for known admin');
        } else if (isAuthenticated && user?.email === 'nanasefa@gmail.com') {
            // Always allow access for the known admin email, even without proper role flags
            console.log('🎯 ProtectedRoute: Allowing access for known admin email');
        } else {
            console.log('🚫 ProtectedRoute: Access denied for doctor route');
            console.log('🚫 Current state:', { isDoctor, isAdmin, profileRole: profile?.role, timeoutReached, isAuthenticated, userEmail: user?.email });
            return <Navigate to="/unauthorized" replace />;
        }
    }

    console.log('✅ ProtectedRoute: Access granted');
    return <>{children}</>;
};

export default ProtectedRoute;