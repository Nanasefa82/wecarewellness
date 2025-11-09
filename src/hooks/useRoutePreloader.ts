import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Preload routes when user hovers over navigation links
export const useRoutePreloader = () => {
    const location = useLocation();

    useEffect(() => {
        // Preload admin components when user is on admin pages
        if (location.pathname.startsWith('/admin')) {
            // Preload all admin components in the background
            const preloadComponents = async () => {
                try {
                    // These will be cached by the browser
                    await Promise.all([
                        import('../components/admin/AvailabilityManager'),
                        import('../components/admin/AppointmentsDashboard'),
                        import('../components/admin/Settings'),
                    ]);
                    console.log('📦 Admin components preloaded');
                } catch (error) {
                    console.log('⚠️ Failed to preload some components:', error);
                }
            };

            // Preload after a short delay to not interfere with current page loading
            const timer = setTimeout(preloadComponents, 1000);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);
};

// Hook to preload a specific component on hover
export const useHoverPreload = (componentImport: () => Promise<any>) => {
    const preload = () => {
        componentImport().catch(console.error);
    };

    return { onMouseEnter: preload };
};