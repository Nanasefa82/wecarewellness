import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, Phone, Mail, Eye } from 'lucide-react';
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
        if (booking.status === 'pending') {
            return (
                <button
                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    title="Confirm appointment"
                >
                    Confirm
                </button>
            );
        }

        if (booking.status === 'confirmed') {
            return (
                <button
                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    title="Mark as completed"
                >
                    Complete
                </button>
            );
        }

        return null;
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
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date & Time</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Patient</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Reason</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-750 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-sage-400" />
                                                    <div>
                                                        <div className="text-white font-medium">
                                                            {format(new Date(booking.preferred_date), 'MMM d, yyyy')}
                                                        </div>
                                                        <div className="text-gray-400 text-xs flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {booking.preferred_time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center space-x-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm text-white font-medium">
                                                            {booking.first_name} {booking.last_name}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            DOB: {booking.date_of_birth ? new Date(booking.date_of_birth + 'T00:00:00').toLocaleDateString('en-US') : 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm space-y-1">
                                                    <div className="flex items-center text-gray-300">
                                                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                                        <a href={`mailto:${booking.email}`} className="hover:text-sage-400 transition-colors truncate max-w-[150px]">
                                                            {booking.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center text-gray-300">
                                                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                                        <a href={`tel:${booking.phone}`} className="hover:text-sage-400 transition-colors">
                                                            {booking.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs">
                                                <div className="text-sm text-gray-300 truncate" title={booking.reason_for_visit}>
                                                    {booking.reason_for_visit || 'Not provided'}
                                                </div>
                                                {booking.insurance_provider && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Insurance: {booking.insurance_provider}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowRescheduleModal(true);
                                                        }}
                                                        className="text-sage-400 hover:text-sage-300 transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {getStatusActions(booking)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Details Modal */}
            {showRescheduleModal && selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => {
                        setShowRescheduleModal(false);
                        setSelectedBooking(null);
                    }}
                    onStatusUpdate={(status) => {
                        handleStatusUpdate(selectedBooking.id, status);
                        setShowRescheduleModal(false);
                        setSelectedBooking(null);
                    }}
                />
            )}
        </div>
    );
};

interface BookingDetailsModalProps {
    booking: any;
    onClose: () => void;
    onStatusUpdate: (status: BookingStatus) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose, onStatusUpdate }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Booking Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-300"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Appointment Info */}
                        <div>
                            <h3 className="text-lg font-medium text-white mb-3">Appointment Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Date:</span>
                                    <span className="text-white ml-2">{format(new Date(booking.preferred_date), 'EEEE, MMM d, yyyy')}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Time:</span>
                                    <span className="text-white ml-2">{booking.preferred_time}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Booked:</span>
                                    <span className="text-white ml-2">{format(new Date(booking.created_at), 'MMM d, yyyy h:mm a')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-medium text-white mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Name:</span>
                                    <span className="text-white ml-2">{booking.first_name} {booking.last_name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Date of Birth:</span>
                                    <span className="text-white ml-2">
                                        {booking.date_of_birth ? new Date(booking.date_of_birth + 'T00:00:00').toLocaleDateString('en-US') : 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Email:</span>
                                    <a href={`mailto:${booking.email}`} className="text-sage-400 hover:text-sage-300 ml-2">
                                        {booking.email}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-400">Phone:</span>
                                    <a href={`tel:${booking.phone}`} className="text-sage-400 hover:text-sage-300 ml-2">
                                        {booking.phone}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-400">Insurance:</span>
                                    <span className="text-white ml-2">{booking.insurance_provider || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div>
                            <h3 className="text-lg font-medium text-white mb-3">Medical Information</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-400 block mb-1">Reason for Visit:</span>
                                    <span className="text-white">{booking.reason_for_visit || 'Not provided'}</span>
                                </div>
                                {booking.previous_treatment && (
                                    <div>
                                        <span className="text-gray-400 block mb-1">Previous Treatment:</span>
                                        <span className="text-white">{booking.previous_treatment}</span>
                                    </div>
                                )}
                                {booking.current_medications && (
                                    <div>
                                        <span className="text-gray-400 block mb-1">Current Medications:</span>
                                        <span className="text-white">{booking.current_medications}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        {(booking.emergency_contact || booking.emergency_phone) && (
                            <div>
                                <h3 className="text-lg font-medium text-white mb-3">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {booking.emergency_contact && (
                                        <div>
                                            <span className="text-gray-400">Name:</span>
                                            <span className="text-white ml-2">{booking.emergency_contact}</span>
                                        </div>
                                    )}
                                    {booking.emergency_phone && (
                                        <div>
                                            <span className="text-gray-400">Phone:</span>
                                            <a href={`tel:${booking.emergency_phone}`} className="text-sage-400 hover:text-sage-300 ml-2">
                                                {booking.emergency_phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-between items-center">
                        <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                                <button
                                    onClick={() => onStatusUpdate('confirmed')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Confirm Appointment
                                </button>
                            )}
                            {booking.status === 'confirmed' && (
                                <button
                                    onClick={() => onStatusUpdate('completed')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Mark as Completed
                                </button>
                            )}
                            {['pending', 'confirmed'].includes(booking.status) && (
                                <button
                                    onClick={() => onStatusUpdate('cancelled')}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Cancel Appointment
                                </button>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsDashboard;