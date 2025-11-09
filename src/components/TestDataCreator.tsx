import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const TestDataCreator: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const createSampleData = async () => {
        setLoading(true);
        setMessage('');

        try {
            console.log('🚀 Creating sample availability slots...');

            // Use a placeholder doctor ID - you'll need to replace this with a real user ID
            // You can get a real user ID from your Supabase auth.users table
            const doctorId = '00000000-0000-0000-0000-000000000000'; // Replace with actual user ID
            
            console.log('👨‍⚕️ Using doctor ID:', doctorId);
            
            // Note: You'll need to manually create a user in Supabase and update the doctorId above

            // Create availability slots for the next 7 days
            const slots = [];
            const today = new Date();
            
            for (let i = 1; i <= 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                
                // Skip weekends for this example
                if (date.getDay() === 0 || date.getDay() === 6) continue;
                
                // Create morning slots (9 AM, 10 AM, 11 AM)
                for (let hour = 9; hour <= 11; hour++) {
                    const startTime = new Date(date);
                    startTime.setHours(hour, 0, 0, 0);
                    
                    const endTime = new Date(startTime);
                    endTime.setHours(hour + 1, 0, 0, 0);
                    
                    slots.push({
                        doctor_id: doctorId,
                        start_time: startTime.toISOString(),
                        end_time: endTime.toISOString(),
                        appointment_type: 'consultation',
                        is_available: true,
                        notes: 'Available for new patient consultations'
                    });
                }
                
                // Create afternoon slots (2 PM, 3 PM, 4 PM)
                for (let hour = 14; hour <= 16; hour++) {
                    const startTime = new Date(date);
                    startTime.setHours(hour, 0, 0, 0);
                    
                    const endTime = new Date(startTime);
                    endTime.setHours(hour + 1, 0, 0, 0);
                    
                    slots.push({
                        doctor_id: doctorId,
                        start_time: startTime.toISOString(),
                        end_time: endTime.toISOString(),
                        appointment_type: 'consultation',
                        is_available: true,
                        notes: 'Available for follow-up appointments'
                    });
                }
            }

            console.log(`📅 Creating ${slots.length} availability slots...`);

            // Insert all slots
            const { data: createdSlots, error: slotsError } = await supabase
                .from('availability_slots')
                .insert(slots)
                .select();

            if (slotsError) {
                console.error('❌ Error creating availability slots:', slotsError);
                setMessage('Error creating availability slots: ' + slotsError.message);
            } else {
                console.log(`✅ Successfully created ${createdSlots?.length || 0} availability slots!`);
                setMessage(`✅ Successfully created ${createdSlots?.length || 0} availability slots! You can now test the booking functionality.`);
            }

        } catch (error: unknown) {
            console.error('💥 Unexpected error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setMessage('Unexpected error: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-serif text-secondary-800 mb-4">
                    Test Data Creator
                </h2>
                <p className="text-secondary-600 mb-4">
                    Click the button below to create sample availability slots for testing the booking system.
                </p>
                
                <button
                    onClick={createSampleData}
                    disabled={loading}
                    className="px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:bg-sage-400 transition-colors"
                >
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Sample Data...</span>
                        </div>
                    ) : (
                        'Create Sample Availability Slots'
                    )}
                </button>

                {message && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        message.includes('✅') 
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 text-sm text-secondary-500">
                    <p><strong>Note:</strong> This will create sample availability slots for the next 7 days (weekdays only) with morning and afternoon time slots.</p>
                </div>
            </div>
        </div>
    );
};

export default TestDataCreator;
