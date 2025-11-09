import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CalendarClock } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { BookingStatus } from '../../types/booking';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

const AppointmentsDashboard: React.FC = () => {
    const { getBookings, updateBookingStatus, loading } = useBookings();

    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    type FilterStatus = 'all' | BookingStatus;
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);

    const loadBookings = useCallback(async () => {
        console.log('🚀 Starting loadBookings');
        
        try {
            // Get the entire month
            const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
            const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
            
            console.log('📊 Fetching bookings for date range:', {
                startDate,
                endDate
            });
            
            const result = await getBookings({
                start_date: startDate,
                end_date: endDate
            }, 1, 1000); // Get up to 1000 bookings for the month
            
            console.log('📊 getBookings returned:', result.data?.length || 0, 'bookings');
            setBookings(result.data || []);
        } catch (error) {
            console.error('❌ Error in loadBookings:', error);
            setBookings([]);
        }
    }, [selectedDate]); // Removed getBookings from dependencies to prevent infinite loop

    useEffect(() => {
        console.log('🔄 useEffect triggered, loading bookings...');
        loadBookings();
    }, [loadBookings]);

    const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
        try {
            await updateBookingStatus(bookingId, status);
            loadBookings();
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    const handleReschedule = (booking: any) => {
        setSelectedBooking(booking);
        setShowRescheduleModal(true);
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusActions = (booking: any) => {
        const actions = [];

        if (booking.status === 'pending') {
            actions.push(
                <button
                    key="confirm"
                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                    Confirm
                </button>
            );
        }

        if (['pending', 'confirmed'].includes(booking.status)) {
            actions.push(
                <button
                    key="reschedule"
                    onClick={() => handleReschedule(booking)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                    Reschedule
                </button>
            );
            actions.push(
                <button
                    key="complete"
                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                    Complete
                </button>
            );
            actions.push(
                <button
                    key="cancel"
                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                    Cancel
                </button>
            );
        }

        return actions;
    };

    return (
        <div className="space-y-6 bg-gray-900 min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-6">
                <div>
                    <h1 className="text-2xl font-serif text-white">Appointments</h1>
                    <p className="text-gray-300 mt-1">Manage patient bookings and appointments</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex space-x-2">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption as FilterStatus)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors capitalize ${filter === filterOption
                                ? 'bg-sage-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {filterOption}
                        </button>
                    ))}
                </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-gray-800 rounded-lg border border-gray-700 p-4">
                <button
                    onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                    className="px-3 py-1 text-gray-300 hover:text-white transition-colors"
                    title="Previous month"
                >
                    ← Previous Month
                </button>
                <h2 className="text-lg font-medium text-white">
                    {format(selectedDate, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                    className="px-3 py-1 text-gray-300 hover:text-white transition-colors"
                    title="Next month"
                >
                    Next Month →
                </button>
            </div>

            {/* Bookings List */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                        Bookings ({filteredBookings.length})
                    </h3>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-300">Loading bookings...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-300">No bookings found</p>
                            <p className="text-gray-400 text-sm">
                                {filter === 'all' ? 'No bookings scheduled for this month' : `No ${filter} bookings`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors bg-gray-800">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Date and Time */}
                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-sage-400" />
                                                    <span className="font-medium text-white">
                                                        {format(new Date(booking.preferred_date), 'EEEE, MMM d, yyyy')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4 text-sage-400" />
                                                    <span className="text-gray-300">
                                                        {booking.preferred_time}
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            {/* Patient Information */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-white font-medium">{booking.first_name} {booking.last_name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        <a
                                                            href={`mailto:${booking.email}`}
                                                            className="text-sage-400 hover:text-sage-300 transition-colors"
                                                        >
                                                            {booking.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        <a
                                                            href={`tel:${booking.phone}`}
                                                            className="text-sage-400 hover:text-sage-300 transition-colors"
                                                        >
                                                            {booking.phone}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="text-sm">
                                                        <span className="text-gray-400">DOB:</span>
                                                        <span className="ml-2 text-gray-300">{format(new Date(booking.date_of_birth), 'MMM d, yyyy')}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-gray-400">Insurance:</span>
                                                        <span className="ml-2 text-gray-300">{booking.insurance_provider || 'None'}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-gray-400">Booked:</span>
                                                        <span className="ml-2 text-gray-300">
                                                            {format(new Date(booking.created_at), 'MMM d, h:mm a')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reason for Visit */}
                                            {booking.reason_for_visit && (
                                                <div className="mb-3">
                                                    <div className="flex items-start space-x-2">
                                                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <span className="text-sm text-gray-400">Reason for Visit:</span>
                                                            <p className="text-gray-300 text-sm mt-1">{booking.reason_for_visit}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Medical Info */}
                                            {(booking.previous_treatment || booking.current_medications) && (
                                                <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {booking.previous_treatment && (
                                                        <div className="text-sm">
                                                            <span className="text-gray-400">Previous Treatment:</span>
                                                            <p className="text-gray-300 mt-1">{booking.previous_treatment}</p>
                                                        </div>
                                                    )}
                                                    {booking.current_medications && (
                                                        <div className="text-sm">
                                                            <span className="text-gray-400">Current Medications:</span>
                                                            <p className="text-gray-300 mt-1">{booking.current_medications}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col space-y-2 ml-4">
                                            {getStatusActions(booking)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && selectedBooking && (
                <RescheduleModal
                    booking={selectedBooking}
                    onClose={() => {
                        setShowRescheduleModal(false);
                        setSelectedBooking(null);
                    }}
                    onSave={loadBookings}
                />
            )}
        </div>
    );
};

interface RescheduleModalProps {
    booking: any;
    onClose: () => void;
    onSave: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ booking, onClose, onSave }) => {
    const { updateBooking } = useBookings();
    const [newDate, setNewDate] = useState(booking.preferred_date);
    const [newTime, setNewTime] = useState(booking.preferred_time);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateBooking(booking.id, {
                preferred_date: newDate,
                preferred_time: newTime
            });
            onSave();
            onClose();
        } catch (error) {
            console.error('Error rescheduling booking:', error);
            alert('Failed to reschedule. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <CalendarClock className="w-5 h-5 text-sage-600" />
                            <h3 className="text-xl font-serif text-secondary-800">Reschedule Appointment</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Patient Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="text-sm">
                            <span className="text-gray-500">Patient:</span>
                            <span className="ml-2 font-medium">{booking.first_name} {booking.last_name}</span>
                        </div>
                        <div className="text-sm mt-1">
                            <span className="text-gray-500">Current Date:</span>
                            <span className="ml-2">{format(new Date(booking.preferred_date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="text-sm mt-1">
                            <span className="text-gray-500">Current Time:</span>
                            <span className="ml-2">{booking.preferred_time}</span>
                        </div>
                    </div>

                    {/* New Date/Time */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                New Date
                            </label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                New Time
                            </label>
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Reschedule'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsDashboard;