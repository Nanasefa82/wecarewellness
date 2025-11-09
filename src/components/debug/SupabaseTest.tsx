import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const SupabaseTest: React.FC = () => {
    const [testResult, setTestResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        setLoading(true);
        setTestResult('Testing connection...');

        try {
            // Test 1: Basic connection
            console.log('🧪 Testing Supabase connection...');
            const { error: testError } = await supabase
                .from('profiles')
                .select('count')
                .limit(1);

            if (testError) {
                setTestResult(`❌ Connection failed: ${testError.message}`);
                setLoading(false);
                return;
            }

            // Test 2: Auth test
            console.log('🧪 Testing auth...');
            const { data: sessionData } = await supabase.auth.getSession();

            setTestResult(`✅ Connection successful! 
            - Supabase URL: ${import.meta.env.VITE_SUPABASE_URL}
            - Has session: ${!!sessionData.session}
            - User: ${sessionData.session?.user?.email || 'None'}`);

        } catch (error) {
            console.error('💥 Test error:', error);
            setTestResult(`💥 Test failed: ${error}`);
        }

        setLoading(false);
    };

    const testLogin = async () => {
        setLoading(true);
        setTestResult('Testing login...');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'nanasefa@gmail.com',
                password: 'test123' // You'll need to use the actual password
            });

            if (error) {
                setTestResult(`❌ Login failed: ${error.message}`);
            } else {
                setTestResult(`✅ Login successful! User: ${data.user?.email}`);
            }
        } catch (error) {
            setTestResult(`💥 Login error: ${error}`);
        }

        setLoading(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Supabase Connection Test</h3>

            <div className="space-y-4">
                <button
                    onClick={testConnection}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                    onClick={testLogin}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
                >
                    {loading ? 'Testing...' : 'Test Login'}
                </button>

                {testResult && (
                    <div className="p-3 bg-gray-100 rounded text-sm whitespace-pre-line">
                        {testResult}
                    </div>
                )}
            </div>

            <div className="mt-4 text-xs text-gray-500">
                <p>Environment:</p>
                <p>URL: {import.meta.env.VITE_SUPABASE_URL}</p>
                <p>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}</p>
            </div>
        </div>
    );
};

export default SupabaseTest;