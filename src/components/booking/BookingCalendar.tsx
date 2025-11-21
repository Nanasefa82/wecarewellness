import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAvailability } from '../../hooks/useAvailability';
import { AvailabilitySlot } from '../../types/booking';
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
import { Header, Footer } from '../layout';

// Helper to parse UTC timestamps as local time (for display purposes)
const parseUTCDate = (dateString: string): Date => {
    // The date comes from DB as UTC but represents local time
    // We need to interpret the UTC time as if it were local time
    const utcDate = new Date(dateString);
    
    // Get the UTC components
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth();
    const date = utcDate.getUTCDate();
    const hours = utcDate.getUTCHours();
    const minutes = utcDate.getUTCMinutes();
    const seconds = utcDate.getUTCSeconds();
    
    // Create a new date treating UTC components as local time
    return new Date(year, month, date, hours, minutes, seconds);
};

const BookingCalendar: React.FC = () => {
    const navigate = useNavigate();
    const { getAvailabilitySlots } = useAvailability();

    const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showSlotSelection, setShowSlotSelection] = useState(false);
    const [selectedDateSlots, setSelectedDateSlots] = useState<AvailabilitySlot[]>([]);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadAvailableSlots = async () => {
            setLoading(true);
            try {
                const monthStart = startOfMonth(selectedDate);
                const monthEnd = endOfMonth(selectedDate);
                const calendarStart = startOfWeek(monthStart);
                const calendarEnd = addDays(startOfWeek(monthEnd), 6);
                const startDate = format(calendarStart, 'yyyy-MM-dd');
                const endDate = format(calendarEnd, 'yyyy-MM-dd');
                console.log('📅 BookingCalendar: Loading slots for month range:', { startDate, endDate });

                // Load slots directly without timeout fallback
                console.log('🔍 Loading available slots...');
                
                const slots = await getAvailabilitySlots(undefined, startDate, endDate);
                console.log('📅 Query returned:', slots?.length || 0, 'slots');
                
                // Filter out overdue appointments (past date/time)
                const now = new Date();
                const futureSlots = (slots || []).filter(slot => {
                    const slotDateTime = new Date(slot.start_time);
                    return slotDateTime > now;
                });
                
                console.log('✅ Filtered to', futureSlots.length, 'future slots (removed', (slots?.length || 0) - futureSlots.length, 'overdue)');
                setAvailableSlots(futureSlots);
            } catch (error) {
                console.error('❌ BookingCalendar: Error loading available slots:', error);
                setAvailableSlots([]);
            } finally {
                setLoading(false);
            }
        };

        loadAvailableSlots();
    }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSlotSelect = (slot: AvailabilitySlot) => {
        // Store slot information in localStorage to pass to booking form page
        localStorage.setItem('selectedSlot', JSON.stringify({
            id: slot.id,
            start_time: slot.start_time,
            end_time: slot.end_time,
            appointment_type: slot.appointment_type,
            doctor_id: slot.doctor_id
        }));
        
        // Navigate to the booking form page
        navigate('/book-appointment-form');
    };

    const handleDateBooking = (date: Date) => {
        const daySlots = getSlotsForDate(date);
        if (daySlots.length === 1) {
            // If only one slot, book it directly
            handleSlotSelect(daySlots[0]);
        } else if (daySlots.length > 1) {
            // If multiple slots, show selection modal
            setSelectedDateSlots(daySlots);
            setShowSlotSelection(true);
        }
    };


    const getMonthDays = () => {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = addDays(startOfWeek(monthEnd), 6);
        
        return eachDayOfInterval({
            start: calendarStart,
            end: calendarEnd
        });
    };

    const getWeeksInMonth = () => {
        const days = getMonthDays();
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    };

    const getSlotsForDate = (date: Date) => {
        return availableSlots.filter(slot => {
            const slotDate = parseUTCDate(slot.start_time);
            // Compare just the date parts (year, month, day) in local time
            return slotDate.getFullYear() === date.getFullYear() &&
                   slotDate.getMonth() === date.getMonth() &&
                   slotDate.getDate() === date.getDate();
        });
    };

    if (bookingSuccess) {
        return (
            <>
                <Header />
                <div className="max-w-2xl mx-auto p-6 text-center">
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-serif text-secondary-800 mb-4">
                        Appointment Booked Successfully!
                    </h2>
                    <p className="text-secondary-600 mb-6">
                        Thank you for booking your appointment with We Care Wellness. You'll receive a confirmation email shortly with all the details.
                    </p>
                    <button
                        onClick={() => setBookingSuccess(false)}
                        className="w-full px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                    >
                        Book Another Appointment
                    </button>
                </div>
            </div>
            <Footer />
            </>
        );
    }

    return (
        <>
        <Header />
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="w-full max-w-full md:max-w-[95%] lg:max-w-[85%] mx-auto">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8 px-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-secondary-800 mb-3 md:mb-4">
                    Book Your Consultation
                </h1>
                <p className="text-base md:text-lg text-secondary-600 max-w-2xl mx-auto mb-3 md:mb-4">
                    Choose an available time slot that works best for you. We're here to support your mental health journey.
                </p>

                {/* Quick booking for today */}
                {(() => {
                    const todaySlots = getSlotsForDate(new Date());
                    return todaySlots.length > 0 ? (
                        <div className="inline-flex items-center space-x-2 bg-sage-100 text-sage-700 px-4 py-2 rounded-lg">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                                {todaySlots.length} slot{todaySlots.length > 1 ? 's' : ''} available today
                            </span>
                            <button
                                onClick={() => handleDateBooking(new Date())}
                                className="text-sm bg-sage-600 text-white px-3 py-1 rounded hover:bg-sage-700 transition-colors ml-2"
                            >
                                Book Today
                            </button>
                        </div>
                    ) : null;
                })()}
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
                <button
                    onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                    className="px-2 sm:px-3 md:px-4 py-2 text-sm md:text-base text-secondary-600 hover:text-secondary-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <span className="hidden sm:inline">← Previous</span>
                    <span className="sm:hidden">←</span>
                </button>
                <h2 className="text-base sm:text-lg font-medium text-secondary-800">
                    {format(selectedDate, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                    className="px-2 sm:px-3 md:px-4 py-2 text-sm md:text-base text-secondary-600 hover:text-secondary-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <span className="hidden sm:inline">Next →</span>
                    <span className="sm:hidden">→</span>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-secondary-600">Loading available appointments...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {/* Days of week header */}
                        <div className="grid grid-cols-7 divide-x divide-gray-200 bg-gray-50">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-secondary-700">
                                    <span className="hidden sm:inline">{day}</span>
                                    <span className="sm:hidden">{day.charAt(0)}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Calendar weeks */}
                        {getWeeksInMonth().map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-200">
                                {week.map((date, dayIndex) => {
                                    const daySlots = getSlotsForDate(date);
                                    const isToday = isSameDay(date, new Date());
                                    const isPast = date < new Date() && !isToday;
                                    const isCurrentMonth = format(date, 'M') === format(selectedDate, 'M');

                                    return (
                                        <div key={dayIndex} className={`p-1 sm:p-2 md:p-3 min-h-[100px] sm:min-h-[120px] md:min-h-[160px] ${!isCurrentMonth ? 'bg-gray-50' : ''}`}>
                                            <div className={`text-center mb-2 ${isToday ? 'text-sage-600 font-medium' : isCurrentMonth ? 'text-secondary-700' : 'text-gray-400'}`}>
                                                <div className={`text-sm ${isToday ? 'bg-sage-100 rounded-full w-6 h-6 flex items-center justify-center mx-auto font-medium' : ''}`}>
                                                    {format(date, 'd')}
                                                </div>
                                            </div>

                                            {isCurrentMonth && (
                                                <div className="space-y-1">
                                                    {isPast ? (
                                                        <p className="text-xs text-gray-400 text-center">Past</p>
                                                    ) : daySlots.length === 0 ? (
                                                        <p className="text-xs text-gray-500 text-center">No slots</p>
                                                    ) : (
                                                        <>
                                                            {/* Available slots count and book button */}
                                                            <div className="text-center">
                                                                <div className="bg-sage-100 rounded p-1 mb-1">
                                                                    <p className="text-xs text-sage-700 font-medium">
                                                                        {daySlots.length} slot{daySlots.length > 1 ? 's' : ''}
                                                                    </p>
                                                                    <button
                                                                        onClick={() => handleDateBooking(date)}
                                                                        className="text-xs bg-sage-600 text-white px-2 py-1 rounded hover:bg-sage-700 transition-colors mt-1 w-full"
                                                                        title={`Book appointment for ${format(date, 'EEEE, MMM d')}`}
                                                                    >
                                                                        Book
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Available time slots preview (first 4 slots) */}
                                                            <div className="space-y-1">
                                                                {daySlots.slice(0, 4).map((slot) => (
                                                                    <button
                                                                        key={slot.id}
                                                                        onClick={() => handleSlotSelect(slot)}
                                                                        className="w-full p-1.5 text-xs bg-white hover:bg-sage-50 text-sage-600 rounded border border-sage-100 hover:border-sage-200 transition-colors"
                                                                    >
                                                                        <div className="flex items-center justify-center space-x-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            <span className="font-medium">{format(parseUTCDate(slot.start_time), 'h:mm a')}</span>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                                {daySlots.length > 4 && (
                                                                    <button
                                                                        onClick={() => handleDateBooking(date)}
                                                                        className="w-full p-1 text-xs text-sage-600 hover:text-sage-700 transition-colors font-medium"
                                                                    >
                                                                        +{daySlots.length - 4} more slots
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-3">Before Your Appointment</h3>
                <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">You'll receive a confirmation email with appointment details</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Please arrive 10 minutes early for your first visit</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Bring a valid ID and insurance card if applicable</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">If you need to cancel, please call us at least 24 hours in advance</span>
                    </li>
                </ul>
            </div>

            {/* Slot Selection Modal */}
            {showSlotSelection && selectedDateSlots.length > 0 && (
                <SlotSelectionModal
                    slots={selectedDateSlots}
                    onClose={() => {
                        setShowSlotSelection(false);
                        setSelectedDateSlots([]);
                    }}
                    onSlotSelect={(slot) => {
                        setShowSlotSelection(false);
                        setSelectedDateSlots([]);
                        handleSlotSelect(slot);
                    }}
                />
            )}

            </div>
        </div>
        <Footer />
        </>
    );
};

interface SlotSelectionModalProps {
    slots: AvailabilitySlot[];
    onClose: () => void;
    onSlotSelect: (slot: AvailabilitySlot) => void;
}

const SlotSelectionModal: React.FC<SlotSelectionModalProps> = ({ slots, onClose, onSlotSelect }) => {
    const selectedDate = slots[0] ? parseUTCDate(slots[0].start_time) : new Date();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-serif text-secondary-800">Select Time Slot</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center space-x-2 text-sage-700 mb-4">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">
                                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                            </span>
                        </div>
                        <p className="text-secondary-600 text-sm">
                            Choose your preferred time slot for this date:
                        </p>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {slots.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => onSlotSelect(slot)}
                                className="w-full p-4 text-left bg-sage-50 hover:bg-sage-100 border border-sage-200 hover:border-sage-300 rounded-lg transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center space-x-2 text-sage-700 font-medium">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {format(parseUTCDate(slot.start_time), 'h:mm a')} - {format(parseUTCDate(slot.end_time), 'h:mm a')}
                                            </span>
                                        </div>
                                        <div className="text-sm text-secondary-600 mt-1">
                                            <span className="capitalize">{slot.appointment_type}</span>
                                            {slot.doctor_name && (
                                                <span> with {slot.doctor_name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sage-600">
                                        →
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BookingCalendar;