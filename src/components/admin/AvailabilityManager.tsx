import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAvailability } from '../../hooks/useAvailability';
import { AvailabilitySlot, CreateAvailabilitySlotData } from '../../types/booking';
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
import ConfirmDialog from '../ui/ConfirmDialog';
import LoadingSkeleton from '../ui/LoadingSkeleton';

const AvailabilityManager: React.FC = React.memo(() => {
    const startTime = performance.now();
    console.log('📅 AvailabilityManager component rendered at', startTime);
    const { user, loading: authLoading } = useAuthContext();
    const {
        error,
        createAvailabilitySlot,
        getAvailabilitySlots,
        deleteAvailabilitySlot,
        createRecurringAvailability
    } = useAvailability();

    // State declarations must come before any early returns
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showRecurringForm, setShowRecurringForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        slotId: string | null;
        slotInfo: string;
    }>({ isOpen: false, slotId: null, slotInfo: '' });
    const [localLoading, setLocalLoading] = useState(false);

    // Helper functions for calendar
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
        const daySlots = slots.filter(slot => {
            const slotDate = new Date(slot.start_time);
            const isSame = isSameDay(slotDate, date);
            if (slots.length > 0) {
                console.log('🗓️ Checking slot for date:', {
                    date: date.toDateString(),
                    slotStartTime: slot.start_time,
                    slotDate: slotDate.toDateString(),
                    isSameDay: isSame
                });
            }
            return isSame;
        });

        if (daySlots.length > 0) {
            console.log('📅 Found', daySlots.length, 'slots for', date.toDateString());
        }

        return daySlots;
    };



    // Create a stable reload function for manual calls
    const reloadSlots = useCallback(async () => {
        if (!user?.id) return;

        setLocalLoading(true);
        try {
            const monthStart = startOfMonth(selectedDate);
            const monthEnd = endOfMonth(selectedDate);
            const calendarStart = startOfWeek(monthStart);
            const calendarEnd = addDays(startOfWeek(monthEnd), 6);
            const startDate = format(calendarStart, 'yyyy-MM-dd');
            const endDate = format(calendarEnd, 'yyyy-MM-dd');

            const data = await getAvailabilitySlots(user.id, startDate, endDate);
            setSlots(data || []);
        } catch (error) {
            console.error('❌ Error reloading slots:', error);
            setSlots([]);
        } finally {
            setLocalLoading(false);
        }
    }, [user?.id, selectedDate, getAvailabilitySlots]);

    useEffect(() => {
        const loadSlots = async () => {
            if (!user?.id) {
                console.log('❌ No user ID, skipping slot loading');
                return;
            }

            console.log('🔄 useEffect triggered, loading slots...');
            setLocalLoading(true);

            try {
                console.log('📅 Loading availability slots for month:', format(selectedDate, 'yyyy-MM-dd'));
                const monthStart = startOfMonth(selectedDate);
                const monthEnd = endOfMonth(selectedDate);
                const calendarStart = startOfWeek(monthStart);
                const calendarEnd = addDays(startOfWeek(monthEnd), 6);
                const startDate = format(calendarStart, 'yyyy-MM-dd');
                const endDate = format(calendarEnd, 'yyyy-MM-dd');

                console.log('📊 Calling getAvailabilitySlots with:', {
                    doctorId: user.id,
                    startDate,
                    endDate,
                    selectedDate: selectedDate.toISOString(),
                    monthStart: monthStart.toISOString(),
                    monthEnd: monthEnd.toISOString()
                });

                // Remove timeout to see what's actually happening
                console.log('🚀 Calling getAvailabilitySlots without timeout...');
                const data = await getAvailabilitySlots(user.id, startDate, endDate);

                console.log('📊 getAvailabilitySlots returned:', data?.length || 0, 'slots');
                console.log('📊 Raw slot data:', data);
                setSlots(data || []);
            } catch (error) {
                console.error('❌ Error in loadAvailabilitySlots:', error);
                setSlots([]);
            } finally {
                console.log('🏁 loadAvailabilitySlots finished');
                setLocalLoading(false);
            }
        };

        if (user?.id) {
            loadSlots();
        }
    }, [user?.id, selectedDate, getAvailabilitySlots]); // Stable dependencies

    // Show loading if auth is still loading
    if (authLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-serif text-secondary-800">Availability Management</h1>
                        <p className="text-secondary-600 mt-1">Loading...</p>
                    </div>
                </div>
                <LoadingSkeleton rows={5} />
            </div>
        );
    }

    // Show error if no user
    if (!user) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">Please log in to manage availability</p>
                </div>
            </div>
        );
    }

    const handleCreateSlot = async (slotData: CreateAvailabilitySlotData) => {
        try {
            await createAvailabilitySlot(slotData);
            setShowCreateForm(false);
            reloadSlots();
        } catch (error) {
            console.error('Error creating slot:', error);
        }
    };

    const handleDeleteSlot = (slotId: string, startTime: string, endTime: string) => {
        const slotInfo = `${new Date(startTime).toLocaleDateString()} from ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        setDeleteConfirm({
            isOpen: true,
            slotId,
            slotInfo
        });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.slotId) return;

        try {
            await deleteAvailabilitySlot(deleteConfirm.slotId);
            console.log('✅ Availability slot deleted successfully');

            // Reload slots to reflect the deletion
            await reloadSlots();

            // Show success message (you could replace this with a toast notification)
            alert('Availability slot deleted successfully!');
        } catch (error) {
            console.error('❌ Error deleting availability slot:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Failed to delete availability slot: ${errorMessage}`);
        }
    };



    const handleCreateRecurring = async (recurringData: {
        startDate: string;
        endDate: string;
        daysOfWeek: number[];
        timeSlots: { startTime: string; endTime: string }[];
        appointmentType: string;
    }) => {
        try {
            console.log('🔄 handleCreateRecurring called with:', recurringData);

            // Transform the data to match the expected API structure
            const apiData = {
                doctor_id: user?.id || '',
                start_date: recurringData.startDate,
                end_date: recurringData.endDate,
                days_of_week: recurringData.daysOfWeek,
                time_slots: recurringData.timeSlots.map(slot => ({
                    start: slot.startTime,
                    end: slot.endTime,
                    days: recurringData.daysOfWeek
                })),
                appointment_type: recurringData.appointmentType as 'consultation' | 'therapy' | 'evaluation' | 'follow_up'
            };

            console.log('🚀 Calling createRecurringAvailability with:', apiData);
            await createRecurringAvailability(apiData);

            console.log('✅ Recurring availability created successfully');
            setShowRecurringForm(false);
            reloadSlots();
        } catch (error) {
            console.error('❌ Error creating recurring availability:', error);
            alert(`Failed to create recurring schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="space-y-6 bg-gray-900 min-h-screen p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-6">
                <div>
                    <h1 className="text-2xl font-serif text-white">Availability Management</h1>
                    <p className="text-gray-300 mt-1">Manage your available appointment slots</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowRecurringForm(true)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Recurring Schedule
                        </button>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Single Slot
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                    <p className="text-red-300">{error}</p>
                </div>
            )}

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-gray-800 rounded-lg border border-gray-700 p-4">
                <button
                    onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                    className="px-3 py-1 text-gray-300 hover:text-white transition-colors"
                >
                    ← Previous Month
                </button>
                <h2 className="text-lg font-medium text-white">
                    {format(selectedDate, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                    className="px-3 py-1 text-gray-300 hover:text-white transition-colors"
                >
                    Next Month →
                </button>
            </div>

            {/* Monthly Calendar Grid */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                {localLoading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-300">Loading availability slots...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {/* Days of week header */}
                        <div className="grid grid-cols-7 divide-x divide-gray-700 bg-gray-900">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-3 text-center text-sm font-medium text-gray-300">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar weeks */}
                        {getWeeksInMonth().map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-700">
                                {week.map((date, dayIndex) => {
                                    const daySlots = getSlotsForDate(date);
                                    const isToday = isSameDay(date, new Date());
                                    const isCurrentMonth = format(date, 'M') === format(selectedDate, 'M');

                                    return (
                                        <div key={dayIndex} className={`p-3 min-h-[140px] ${!isCurrentMonth ? 'bg-gray-900' : 'bg-gray-800'}`}>
                                            <div className={`text-center mb-2 ${isToday ? 'text-blue-400 font-medium' : isCurrentMonth ? 'text-gray-200' : 'text-gray-500'}`}>
                                                <div className={`text-sm ${isToday ? 'bg-blue-900 rounded-full w-6 h-6 flex items-center justify-center mx-auto font-medium' : ''}`}>
                                                    {format(date, 'd')}
                                                </div>
                                            </div>

                                            {isCurrentMonth && (
                                                <div className="space-y-1">
                                                    {daySlots.length === 0 ? (
                                                        <p className="text-xs text-gray-500 text-center">No slots</p>
                                                    ) : (
                                                        <>
                                                            {/* Available slots count */}
                                                            <div className="text-center mb-2">
                                                                <div className="bg-green-900 rounded p-1 mb-1">
                                                                    <p className="text-xs text-green-300 font-medium">
                                                                        {daySlots.length} slot{daySlots.length > 1 ? 's' : ''}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Available time slots (first 3) */}
                                                            <div className="space-y-1">
                                                                {daySlots.slice(0, 3).map((slot) => (
                                                                    <div
                                                                        key={slot.id}
                                                                        className="flex items-center justify-between p-1.5 text-xs bg-gray-700 border border-green-800 rounded group hover:bg-green-900 hover:border-green-600 transition-all cursor-pointer"
                                                                    >
                                                                        <span className="text-green-300 font-medium flex-1">
                                                                            {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteSlot(slot.id, slot.start_time, slot.end_time);
                                                                            }}
                                                                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-all"
                                                                            title="Delete slot"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                {daySlots.length > 3 && (
                                                                    <div className="text-center">
                                                                        <span className="text-xs text-green-400 font-medium">
                                                                            +{daySlots.length - 3} more
                                                                        </span>
                                                                    </div>
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

            {/* Create Single Slot Modal */}
            {showCreateForm && (
                <CreateSlotModal
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={handleCreateSlot}
                    doctorId={user?.id || ''}
                />
            )}

            {/* Create Recurring Schedule Modal */}
            {showRecurringForm && (
                <RecurringScheduleModal
                    onClose={() => setShowRecurringForm(false)}
                    onSubmit={handleCreateRecurring}
                    doctorId={user?.id || ''}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, slotId: null, slotInfo: '' })}
                onConfirm={confirmDelete}
                title="Delete Availability Slot"
                message={`Are you sure you want to delete the availability slot for ${deleteConfirm.slotInfo}? This action cannot be undone and any appointments booked for this slot will need to be rescheduled.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
});

interface CreateSlotModalProps {
    onClose: () => void;
    onSubmit: (data: CreateAvailabilitySlotData) => void;
    doctorId: string;
}

const CreateSlotModal: React.FC<CreateSlotModalProps> = ({ onClose, onSubmit, doctorId }) => {
    const [formData, setFormData] = useState<{
        date: string;
        startTime: string;
        endTime: string;
        appointmentType: 'consultation' | 'therapy' | 'evaluation' | 'follow_up';
        notes: string;
    }>({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
        appointmentType: 'consultation',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

        onSubmit({
            doctor_id: doctorId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            appointment_type: formData.appointmentType,
            notes: formData.notes || undefined
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-secondary-800">Create Availability Slot</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close availability form">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            required
                            title="Select appointment date"
                            placeholder="Select date"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                required
                                title="Select start time"
                                placeholder="Start time"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                required
                                title="Select end time"
                                placeholder="End time"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Appointment Type</label>
                        <select
                            value={formData.appointmentType}
                            onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value as typeof formData.appointmentType })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            title="Select appointment type"
                        >
                            <option value="consultation">Consultation</option>
                            <option value="therapy">Therapy</option>
                            <option value="evaluation">Evaluation</option>
                            <option value="follow_up">Follow Up</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            rows={3}
                            placeholder="Any additional notes about this slot..."
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                        >
                            Create Slot
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface RecurringScheduleModalProps {
    onClose: () => void;
    onSubmit: (data: {
        startDate: string;
        endDate: string;
        daysOfWeek: number[];
        timeSlots: { startTime: string; endTime: string }[];
        appointmentType: string;
    }) => void;
    doctorId: string;
}

const RecurringScheduleModal: React.FC<RecurringScheduleModalProps> = ({ onClose, onSubmit }) => {
    // Helper function to format date for input
    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        startDate: formatDateForInput(new Date()),
        endDate: formatDateForInput(addDays(new Date(), 30)),
        appointmentType: 'consultation' as 'consultation' | 'therapy' | 'evaluation' | 'follow_up',
        timeSlots: [
            { start: '09:00', end: '10:00', days: [1, 2, 3, 4, 5] } // Monday to Friday (dayIndex: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
        ]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('📝 RecurringScheduleModal: Form submitted with data:', formData);

        const submitData = {
            startDate: formData.startDate,
            endDate: formData.endDate,
            daysOfWeek: formData.timeSlots.flatMap(slot => slot.days || []),
            timeSlots: formData.timeSlots.map(slot => ({
                startTime: slot.start,
                endTime: slot.end
            })),
            appointmentType: formData.appointmentType
        };

        console.log('📤 RecurringScheduleModal: Submitting transformed data:', submitData);

        onSubmit(submitData);
    };

    const addTimeSlot = () => {
        setFormData({
            ...formData,
            timeSlots: [...formData.timeSlots, { start: '09:00', end: '10:00', days: [1, 2, 3, 4, 5] }]
        });
    };

    const removeTimeSlot = (index: number) => {
        setFormData({
            ...formData,
            timeSlots: formData.timeSlots.filter((_, i) => i !== index)
        });
    };

    const updateTimeSlot = (index: number, field: string, value: string | number[]) => {
        console.log('⏰ updateTimeSlot called:', { index, field, value });
        const updatedSlots = [...formData.timeSlots];
        updatedSlots[index] = { ...updatedSlots[index], [field]: value };
        console.log('⏰ Updated slot:', updatedSlots[index]);
        setFormData({ ...formData, timeSlots: updatedSlots });
    };

    const toggleDay = (slotIndex: number, day: number) => {
        const slot = formData.timeSlots[slotIndex];
        const days = slot.days.includes(day)
            ? slot.days.filter(d => d !== day)
            : [...slot.days, day].sort();
        updateTimeSlot(slotIndex, 'days', days);
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-secondary-800">Create Recurring Schedule</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close recurring schedule form">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => {
                                    console.log('Start date changed to:', e.target.value);
                                    setFormData({ ...formData, startDate: e.target.value });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-gray-900 bg-white"
                                required
                                title="Select recurring schedule start date"
                                min={formatDateForInput(new Date())}
                            />
                            <div className="text-xs text-gray-500 mt-1">Current: {formData.startDate}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => {
                                    console.log('End date changed to:', e.target.value);
                                    setFormData({ ...formData, endDate: e.target.value });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-gray-900 bg-white"
                                required
                                title="Select recurring schedule end date"
                                min={formData.startDate}
                            />
                            <div className="text-xs text-gray-500 mt-1">Current: {formData.endDate}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Appointment Type</label>
                        <select
                            value={formData.appointmentType}
                            onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value as 'consultation' | 'therapy' | 'evaluation' | 'follow_up' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            title="Select appointment type"
                        >
                            <option value="consultation">Consultation</option>
                            <option value="therapy">Therapy</option>
                            <option value="evaluation">Evaluation</option>
                            <option value="follow_up">Follow Up</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-secondary-700">Time Slots</label>
                            <button
                                type="button"
                                onClick={addTimeSlot}
                                className="flex items-center px-3 py-1 text-sm bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Slot
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.timeSlots.map((slot, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium text-secondary-700">Time Slot {index + 1}</h4>
                                        {formData.timeSlots.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTimeSlot(index)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Remove time slot"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs text-secondary-600 mb-1">Start Time</label>
                                            <input
                                                type="time"
                                                value={slot.start}
                                                onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-gray-900 bg-white"
                                                title="Set start time for slot"
                                                required
                                            />
                                            <div className="text-xs text-gray-500 mt-1">Current: {slot.start}</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-secondary-600 mb-1">End Time</label>
                                            <input
                                                type="time"
                                                value={slot.end}
                                                onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-sage-500 focus:border-sage-500 text-gray-900 bg-white"
                                                title="Set end time for slot"
                                                required
                                            />
                                            <div className="text-xs text-gray-500 mt-1">Current: {slot.end}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-secondary-600 mb-2">Days of Week</label>
                                        <div className="flex space-x-1">
                                            {dayNames.map((day, dayIndex) => (
                                                <button
                                                    key={dayIndex}
                                                    type="button"
                                                    onClick={() => toggleDay(index, dayIndex)}
                                                    className={`px-3 py-2 text-sm font-medium rounded transition-colors ${slot.days.includes(dayIndex)
                                                        ? 'bg-sage-600 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    title={`Toggle ${day}`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                        >
                            Create Schedule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AvailabilityManager;