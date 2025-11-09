import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { BookingRecord, BookingFilters, BookingStatus } from '../../types/booking';
import { format } from 'date-fns';

const BookingManager: React.FC = () => {
    const { getBookings, updateBookingStatus, deleteBooking, loading, error } = useBookings();
    
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [filters, setFilters] = useState<BookingFilters>({});
    const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Load bookings on component mount and when filters change
    useEffect(() => {
        loadBookings();
    }, [currentPage, filters]); // loadBookings is stable since it uses useCallback internally

    const loadBookings = async () => {
        try {
            const result = await getBookings(filters, currentPage, pageSize);
            setBookings(result.data);
            setTotalCount(result.count);
        } catch (err) {
            console.error('Failed to load bookings:', err);
        }
    };

    const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            // Refresh the bookings list
            loadBookings();
        } catch (err) {
            console.error('Failed to update booking status:', err);
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            try {
                await deleteBooking(bookingId);
                // Refresh the bookings list
                loadBookings();
            } catch (err) {
                console.error('Failed to delete booking:', err);
            }
        }
    };

    const handleFilterChange = (key: keyof BookingFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
        setCurrentPage(1); // Reset to first page when filtering
    };

    const getStatusBadge = (status: BookingStatus) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusStyles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-6 bg-gray-900 min-h-screen p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Booking Management</h1>
                    <p className="text-gray-400 mt-1">View and manage appointment bookings</p>
                </div>
                <div className="text-sm text-gray-400">
                    Total: {totalCount} bookings
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Name, email, or phone..."
                                value={filters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            title="Filter by booking status"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.start_date || ''}
                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            title="Filter by start date"
                            placeholder="Start date"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.end_date || ''}
                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            title="Filter by end date"
                            placeholder="End date"
                        />
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                    <p className="text-red-200">Error: {error}</p>
                </div>
            )}

            {/* Bookings Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No bookings found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Preferred Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {booking.first_name} {booking.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        DOB: {format(new Date(booking.date_of_birth), 'MMM dd, yyyy')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">
                                                <div className="flex items-center mb-1">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {booking.email}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {booking.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-300">
                                                <Calendar className="w-4 h-4 mr-2 text-sage-400" />
                                                <div>
                                                    <div>{format(new Date(booking.preferred_date), 'MMM dd, yyyy')}</div>
                                                    <div className="text-xs text-gray-400 flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {booking.preferred_time}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowDetails(true);
                                                    }}
                                                    className="text-sage-400 hover:text-sage-300"
                                                    title="View details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                
                                                {/* Status Update Dropdown */}
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value as BookingStatus)}
                                                    className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                                                    title="Update status"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                
                                                <button
                                                    onClick={() => handleDeleteBooking(booking.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                    title="Delete booking"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 bg-sage-600 text-white rounded">
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Booking Details Modal */}
            {showDetails && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Booking Details</h2>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-400 hover:text-gray-300"
                                    title="Close details"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Name:</span>
                                            <span className="text-white ml-2">{selectedBooking.first_name} {selectedBooking.last_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Email:</span>
                                            <span className="text-white ml-2">{selectedBooking.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Phone:</span>
                                            <span className="text-white ml-2">{selectedBooking.phone}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Date of Birth:</span>
                                            <span className="text-white ml-2">{format(new Date(selectedBooking.date_of_birth), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3">Appointment Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Preferred Date:</span>
                                            <span className="text-white ml-2">{format(new Date(selectedBooking.preferred_date), 'MMM dd, yyyy')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Preferred Time:</span>
                                            <span className="text-white ml-2">{selectedBooking.preferred_time}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Status:</span>
                                            <span className="ml-2">{getStatusBadge(selectedBooking.status)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Insurance:</span>
                                            <span className="text-white ml-2">{selectedBooking.insurance_provider || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3">Medical Information</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-400 block">Reason for Visit:</span>
                                            <span className="text-white">{selectedBooking.reason_for_visit || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Previous Treatment:</span>
                                            <span className="text-white">{selectedBooking.previous_treatment || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Current Medications:</span>
                                            <span className="text-white">{selectedBooking.current_medications || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3">Emergency Contact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Contact Name:</span>
                                            <span className="text-white ml-2">{selectedBooking.emergency_contact || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Contact Phone:</span>
                                            <span className="text-white ml-2">{selectedBooking.emergency_phone || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Consent */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3">Consent</h3>
                                    <div className="text-sm">
                                        <span className="text-gray-400">Consent Accepted:</span>
                                        <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedBooking.consent_accepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {selectedBooking.consent_accepted ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-3">Timestamps</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Created:</span>
                                            <span className="text-white ml-2">{format(new Date(selectedBooking.created_at), 'MMM dd, yyyy HH:mm')}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Updated:</span>
                                            <span className="text-white ml-2">{format(new Date(selectedBooking.updated_at), 'MMM dd, yyyy HH:mm')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManager;
