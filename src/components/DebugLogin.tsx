import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const DebugLogin: React.FC = () => {
    const [email, setEmail] = useState('nanasefa@gmail.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleTest = async () => {
        setLoading(true);
        setResult(null);

        try {
            // Step 1: Try to sign in
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setResult({ error: `Auth Error: ${authError.message}` });
                setLoading(false);
                return;
            }

            // Step 2: Check if user exists in profiles
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (profileError) {
                setResult({
                    error: `Profile Error: ${profileError.message}`,
                    user: authData.user,
                    profileError: profileError
                });
                setLoading(false);
                return;
            }

            // Step 3: Success
            setResult({
                success: true,
                user: authData.user,
                profile: profile,
                message: `Login successful! Role: ${profile.role}`
            });

            // Step 4: Redirect if admin/doctor
            if (profile.role === 'admin' || profile.role === 'doctor') {
                setTimeout(() => {
                    window.location.href = '/admin/dashboard';
                }, 2000);
            }

        } catch (err: any) {
            setResult({ error: `Unexpected error: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Debug Login Test</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <button
                    onClick={handleTest}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? 'Testing...' : 'Test Login'}
                </button>
            </div>

            {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Result:</h3>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default DebugLogin;