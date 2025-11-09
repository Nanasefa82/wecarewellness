import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

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
    const { isAuthenticated, isAdmin, isDoctor, loading, profile, user } = useAuthContext();
    const location = useLocation();
    const [timeoutReached, setTimeoutReached] = useState(false);

    console.log('🛡️ ProtectedRoute check:', {
        path: location.pathname,
        loading,
        isAuthenticated,
        isAdmin,
        isDoctor,
        requireAdmin,
        requireDoctor,
        profile: profile ? `role: ${profile.role}` : 'null',
        user: user ? `email: ${user.email}` : 'null',
        timeoutReached
    });

    // Set a timeout to prevent infinite loading
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('⏰ ProtectedRoute: Timeout reached, allowing access if authenticated');
            setTimeoutReached(true);
        }, 2000); // Reduced to 2 seconds for faster page loads

        return () => clearTimeout(timer);
    }, []);

    // Show loading only if we're still loading and haven't reached timeout
    if ((loading || (isAuthenticated && !profile)) && !timeoutReached) {
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
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (requireDoctor && !isDoctor && !isAdmin) {
        // If timeout reached and we have an authenticated user, allow access for known admin emails
        if (timeoutReached && isAuthenticated && user?.email === 'nanasefa@gmail.com') {
            console.log('🎯 ProtectedRoute: Allowing access due to timeout for known admin');
        } else {
            console.log('🚫 ProtectedRoute: Access denied for doctor route');
            console.log('🚫 Current state:', { isDoctor, isAdmin, profileRole: profile?.role });
            return <Navigate to="/unauthorized" replace />;
        }
    }

    console.log('✅ ProtectedRoute: Access granted');
    return <>{children}</>;
};

export default ProtectedRoute;