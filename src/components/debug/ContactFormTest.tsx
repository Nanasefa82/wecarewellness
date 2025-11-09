import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const ContactFormTest: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testDirectInsert = async () => {
        setLoading(true);
        setStatus('Testing direct database insert...');

        try {
            console.log('🧪 Testing direct insert to contact_submissions');

            const testData = {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                message: 'This is a test message from the debug component.',
                status: 'new'
            };

            const { data, error } = await supabase
                .from('contact_submissions')
                .insert([testData])
                .select()
                .single();

            console.log('🧪 Direct insert result:', { data, error });

            if (error) {
                setStatus(`❌ Direct insert failed: ${error.message}`);
            } else {
                setStatus(`✅ Direct insert successful! Created submission with ID: ${data.id}`);
            }
        } catch (error) {
            console.error('💥 Direct insert exception:', error);
            setStatus(`💥 Exception: ${error}`);
        }

        setLoading(false);
    };

    const testRLSPolicies = async () => {
        setLoading(true);
        setStatus('Testing RLS policies...');

        try {
            // Test if we can read (should fail for non-admin)
            const { data: readData, error: readError } = await supabase
                .from('contact_submissions')
                .select('*')
                .limit(1);

            console.log('🧪 Read test result:', { readData, readError });

            if (readError) {
                setStatus(`✅ RLS working correctly - Read blocked: ${readError.message}`);
            } else {
                setStatus(`⚠️ RLS might not be working - Read succeeded with ${readData?.length || 0} records`);
            }
        } catch (error) {
            setStatus(`💥 RLS test exception: ${error}`);
        }

        setLoading(false);
    };

    const checkCurrentUser = async () => {
        setLoading(true);
        setStatus('Checking current user...');

        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                setStatus(`❌ Auth error: ${error.message}`);
            } else if (user) {
                setStatus(`✅ Authenticated as: ${user.email} (ID: ${user.id})`);
            } else {
                setStatus(`ℹ️ Not authenticated (anonymous user)`);
            }
        } catch (error) {
            setStatus(`💥 User check exception: ${error}`);
        }

        setLoading(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Contact Form Debug Test</h3>

            <div className="space-y-4">
                <button
                    onClick={checkCurrentUser}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? 'Checking...' : 'Check Current User'}
                </button>

                <button
                    onClick={testDirectInsert}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
                >
                    {loading ? 'Testing...' : 'Test Direct Insert'}
                </button>

                <button
                    onClick={testRLSPolicies}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
                >
                    {loading ? 'Testing...' : 'Test RLS Policies'}
                </button>

                {status && (
                    <div className="p-3 bg-gray-100 rounded text-sm whitespace-pre-line">
                        {status}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">Expected Results:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Current User:</strong> Should show "Not authenticated" for public form</li>
                    <li>• <strong>Direct Insert:</strong> Should succeed (RLS allows anyone to insert)</li>
                    <li>• <strong>RLS Test:</strong> Should fail to read (only admins can read)</li>
                </ul>
            </div>
        </div>
    );
};

export default ContactFormTest;