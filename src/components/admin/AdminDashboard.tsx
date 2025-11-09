import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Users,
    Clock,
    Settings,
    LogOut,
    Plus,
    BarChart3,
    Bell,
    Menu,
    X,
    MessageSquare
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useRoutePreloader, useHoverPreload } from '../../hooks/useRoutePreloader';

interface AdminDashboardProps {
    children?: React.ReactNode;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    current: boolean;
}

interface UserProfile {
    full_name?: string;
    email?: string;
    role?: string;
}

interface SidebarContentProps {
    navigationItems: NavigationItem[];
    profile: UserProfile | null;
    onSignOut: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ children }) => {
    console.log('🏠 AdminDashboard rendered with children:', !!children);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { profile, signOut, isDoctor, isAdmin, user } = useAuthContext();
    const { getDashboardStats } = useAppointments();
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const navigate = useNavigate();

    // Preload routes for faster navigation
    useRoutePreloader();

    const loadDashboardStats = useCallback(async () => {
        if (!user) return;

        try {
            const data = await getDashboardStats(user.id);
            setStats(data);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }, [user, getDashboardStats]);

    useEffect(() => {
        if (user && (isDoctor || isAdmin)) {
            loadDashboardStats();
        }
    }, [user, isDoctor, isAdmin, loadDashboardStats]);


    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const currentPath = window.location.pathname;

    const navigationItems = [
        {
            name: 'Dashboard',
            icon: BarChart3,
            href: '/admin/dashboard',
            current: currentPath === '/admin/dashboard',
        },
        {
            name: 'Calendar',
            icon: Calendar,
            href: '/admin/calendar',
            current: currentPath === '/admin/calendar',
        },
        {
            name: 'Appointments',
            icon: Clock,
            href: '/admin/appointments',
            current: currentPath === '/admin/appointments',
        },
        {
            name: 'Availability',
            icon: Plus,
            href: '/admin/availability',
            current: currentPath === '/admin/availability',
        },
        ...(isAdmin ? [{
            name: 'Users',
            icon: Users,
            href: '/admin/users',
            current: currentPath === '/admin/users',
        }] : []),
        {
            name: 'Contact Messages',
            icon: MessageSquare,
            href: '/admin/contact-messages',
            current: currentPath === '/admin/contact-messages',
        },
        {
            name: 'Settings',
            icon: Settings,
            href: '/admin/settings',
            current: currentPath === '/admin/settings',
        },
    ];

    const dashboardStats = stats ? [
        {
            name: 'Total Appointments',
            value: stats.total_appointments?.toString() || '0',
            change: 'All time',
            changeType: 'neutral' as const,
        },
        {
            name: 'Upcoming',
            value: stats.upcoming_appointments?.toString() || '0',
            change: 'Scheduled appointments',
            changeType: 'positive' as const,
        },
        {
            name: 'Available Slots',
            value: stats.available_slots?.toString() || '0',
            change: 'Ready for booking',
            changeType: 'neutral' as const,
        },
        {
            name: 'This Month',
            value: stats.this_month_appointments?.toString() || '0',
            change: 'Monthly appointments',
            changeType: 'positive' as const,
        },
    ] : [];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                            title="Close sidebar"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <SidebarContent
                        navigationItems={navigationItems}
                        profile={profile}
                        onSignOut={handleSignOut}
                    />
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <SidebarContent
                    navigationItems={navigationItems}
                    profile={profile}
                    onSignOut={handleSignOut}
                />
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-gray-800 shadow-sm border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                            title="Open sidebar"
                        >
                            <Menu className="h-6 w-6 text-gray-300" />
                        </button>

                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-serif text-white">
                                {isAdmin ? 'Admin Dashboard' : 'Doctor Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                className="p-2 text-gray-300 hover:text-white transition-colors"
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                            </button>
                            <div className="text-sm text-gray-300">
                                Welcome, {profile?.full_name || profile?.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
                    {children || <DashboardContent stats={dashboardStats} loading={!stats} />}
                </main>
            </div>
        </div>
    );
};

const SidebarContent: React.FC<SidebarContentProps> = ({ navigationItems, profile, onSignOut }) => {
    const navigate = useNavigate();

    // Preload hooks for navigation items
    const availabilityPreload = useHoverPreload(() => import('./AvailabilityManager'));
    const appointmentsPreload = useHoverPreload(() => import('./AppointmentsDashboard'));
    const settingsPreload = useHoverPreload(() => import('./Settings'));

    return (
        <div className="flex flex-1 flex-col bg-gray-800 border-r border-gray-700">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center">
                        <div className="text-white font-serif text-sm font-bold">WC</div>
                    </div>
                    <div>
                        <div className="text-lg font-serif text-white">We Care Wellness</div>
                        <div className="text-xs text-sage-400">Admin Portal</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                    // Get preload handler based on route
                    let preloadHandler = {};
                    if (item.href.includes('availability') || item.href.includes('calendar')) {
                        preloadHandler = availabilityPreload;
                    } else if (item.href.includes('appointments')) {
                        preloadHandler = appointmentsPreload;
                    } else if (item.href.includes('settings')) {
                        preloadHandler = settingsPreload;
                    }

                    return (
                        <button
                            key={item.name}
                            onClick={() => {
                                console.log('🔗 Navigating to:', item.href);
                                navigate(item.href); // Use navigate instead of window.location for faster routing
                            }}
                            {...preloadHandler} // Add preload on hover
                            className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left ${item.current
                                ? 'bg-sage-900 text-sage-300'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center">
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </div>
                            {item.name === 'Contact Messages' && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                    3
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User info and sign out */}
            <div className="border-t border-gray-700 p-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-sage-900 rounded-full flex items-center justify-center">
                        <span className="text-sage-300 font-medium text-sm">
                            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {profile?.role === 'admin' ? 'Administrator' : 'Doctor'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onSignOut}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    title="Sign out"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

interface DashboardStat {
    name: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
}

interface DashboardStatsData {
    total_appointments?: number;
    upcoming_appointments?: number;
    available_slots?: number;
    this_month_appointments?: number;
}

interface DashboardContentProps {
    stats: DashboardStat[];
    loading?: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ stats, loading }) => {
    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    stats.map((stat) => (
                        <div key={stat.name} className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-300">{stat.name}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-400' :
                                    stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                                    }`}>
                                    {stat.change}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => window.location.href = '/admin/availability'}
                        className="flex items-center justify-center px-4 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Availability
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/availability'}
                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Calendar className="w-5 h-5 mr-2" />
                        View Calendar
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/appointments'}
                        className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Clock className="w-5 h-5 mr-2" />
                        Manage Appointments
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm text-white">New appointment booked</p>
                            <p className="text-xs text-gray-400">John Doe - Tomorrow at 2:00 PM</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm text-white">Availability updated</p>
                            <p className="text-xs text-gray-400">Added slots for next week</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm text-white">Appointment rescheduled</p>
                            <p className="text-xs text-gray-400">Jane Smith - Moved to Friday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;