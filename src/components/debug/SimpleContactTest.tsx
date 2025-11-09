import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const SimpleContactTest: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testSimpleInsert = async () => {
        setLoading(true);
        setStatus('Testing simple contact form submission...');

        try {
            console.log('🧪 Starting simple contact form test');

            const testData = {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                message: 'This is a test message.',
                status: 'new'
            };

            console.log('🧪 Test data:', testData);
            console.log('🧪 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
            console.log('🧪 Has Supabase key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

            const { data, error } = await supabase
                .from('contact_submissions')
                .insert([testData])
                .select()
                .single();

            console.log('🧪 Supabase response:', { data, error });

            if (error) {
                console.error('❌ Supabase error:', error);
                setStatus(`❌ Database error: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
            } else if (data) {
                console.log('✅ Success! Created submission:', data);
                setStatus(`✅ Success! Created submission with ID: ${data.id}\nName: ${data.first_name} ${data.last_name}\nEmail: ${data.email}`);
            } else {
                console.log('⚠️ No data returned');
                setStatus('⚠️ No data returned from database');
            }
        } catch (error) {
            console.error('💥 Exception:', error);
            setStatus(`💥 Exception: ${error}`);
        }

        setLoading(false);
    };

    const testFormSubmission = async () => {
        setLoading(true);
        setStatus('Testing form submission with useContactForm hook...');

        try {
            // Import the hook dynamically to test it
            const { useContactForm } = await import('../../hooks/useContactForm');

            // This won't work directly since we're not in a component, but let's see what happens
            setStatus('⚠️ Cannot test hook directly from here. Use the actual contact form instead.');
        } catch (error) {
            setStatus(`💥 Hook test error: ${error}`);
        }

        setLoading(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Simple Contact Form Test</h3>

            <div className="space-y-4">
                <button
                    onClick={testSimpleInsert}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
                >
                    {loading ? 'Testing...' : 'Test Direct Database Insert'}
                </button>

                <button
                    onClick={testFormSubmission}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? 'Testing...' : 'Test Hook (Limited)'}
                </button>

                {status && (
                    <div className="p-3 bg-gray-100 rounded text-sm whitespace-pre-line font-mono">
                        {status}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
                <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
                    <li>First, test "Direct Database Insert" - this should work if RLS is disabled</li>
                    <li>If that works, try the actual contact form at <code>/contact</code></li>
                    <li>Check the browser console for detailed logs starting with 📧</li>
                    <li>If direct insert fails, the issue is with database permissions</li>
                    <li>If direct insert works but form fails, the issue is with the hook</li>
                </ol>
            </div>
        </div>
    );
};

export default SimpleContactTest;