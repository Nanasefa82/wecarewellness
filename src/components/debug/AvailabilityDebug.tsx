import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AvailabilityDebug: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [doctorId, setDoctorId] = useState('');

    const testDirectQuery = async () => {
        if (!doctorId.trim()) {
            alert('Please enter a doctor ID');
            return;
        }

        setLoading(true);
        try {
            console.log('🔍 Testing direct availability query...');

            // Query all slots for this doctor
            const { data: allSlots, error: allError } = await supabase
                .from('availability_slots')
                .select('*')
                .eq('doctor_id', doctorId.trim())
                .order('start_time', { ascending: true });

            if (allError) {
                console.error('❌ Error querying all slots:', allError);
                alert(`Error: ${allError.message}`);
                return;
            }

            console.log('📊 All slots for doctor:', allSlots);

            // Query November 2025 slots specifically
            const { data: novSlots, error: novError } = await supabase
                .from('availability_slots')
                .select('*')
                .eq('doctor_id', doctorId.trim())
                .gte('start_time', '2025-11-01T00:00:00')
                .lte('start_time', '2025-11-30T23:59:59')
                .order('start_time', { ascending: true });

            if (novError) {
                console.error('❌ Error querying November slots:', novError);
                alert(`Error: ${novError.message}`);
                return;
            }

            console.log('📅 November 2025 slots:', novSlots);

            setResults([
                { type: 'All Slots', count: allSlots?.length || 0, data: allSlots },
                { type: 'November 2025 Slots', count: novSlots?.length || 0, data: novSlots }
            ]);

        } catch (error) {
            console.error('💥 Debug query error:', error);
            alert(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Availability Debug Tool</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor ID:
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        placeholder="Enter doctor ID (UUID)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={testDirectQuery}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Testing...' : 'Test Query'}
                    </button>
                </div>
            </div>

            {results.length > 0 && (
                <div className="space-y-6">
                    {results.map((result, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                {result.type} ({result.count} slots)
                            </h3>

                            {result.count === 0 ? (
                                <p className="text-gray-500 italic">No slots found</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {result.data?.map((slot: any) => (
                                                <tr key={slot.id}>
                                                    <td className="px-3 py-2 text-sm text-gray-900 font-mono">{slot.id.slice(0, 8)}...</td>
                                                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(slot.start_time).toLocaleString()}</td>
                                                    <td className="px-3 py-2 text-sm text-gray-900">{new Date(slot.end_time).toLocaleString()}</td>
                                                    <td className="px-3 py-2 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${slot.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {slot.is_available ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-sm text-gray-900">{slot.appointment_type}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Instructions:</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Enter your doctor ID (you can find this in the browser console when you log in)</li>
                    <li>2. Click "Test Query" to see all availability slots</li>
                    <li>3. Check if your November slots appear in the results</li>
                    <li>4. Open browser console to see detailed logs</li>
                </ol>
            </div>
        </div>
    );
};

export default AvailabilityDebug;