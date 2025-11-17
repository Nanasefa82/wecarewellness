import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const DebugLogin: React.FC = () => {
    const [email, setEmail] = useState('nanasefa@gmail.com');
    const [password, setPassword] = useState('');
    const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(false);

    const { signIn, user, profile, isAuthenticated, isAdmin, isDoctor } = useAuthContext();

    const handleDebugLogin = async () => {
        setLoading(true);
        setDebugInfo(null);

        try {
            // Step 1: Sign in
            console.log('Step 1: Signing in...');
            await signIn(email, password);

            // Step 2: Get session
            console.log('Step 2: Getting session...');
            const { data: { session } } = await supabase.auth.getSession();

            // Step 3: Get profile
            console.log('Step 3: Getting profile...');
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.user?.id)
                .single();

            const debug = {
                step1_signin: 'SUCCESS',
                step2_session: session ? 'SUCCESS' : 'FAILED',
                step3_profile: profileData ? 'SUCCESS' : 'FAILED',
                session_user_id: session?.user?.id,
                session_email: session?.user?.email,
                profile_data: profileData,
                profile_error: profileError,
                auth_context: {
                    user: user?.id,
                    profile_role: profile?.role,
                    isAuthenticated,
                    isAdmin,
                    isDoctor
                }
            };

            setDebugInfo(debug);
            console.log('Debug Info:', debug);

            // Step 4: Check if user should have access
            if (profileData && (profileData.role === 'admin' || profileData.role === 'doctor') && profileData.is_active) {
                console.log('User should have admin access');
                setTimeout(() => {
                    window.location.href = '/admin/dashboard';
                }, 2000);
            } else {
                console.log('User does NOT have admin access');
            }

        } catch (error) {
            console.error('Login error:', error);
            setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Debug Login</h2>

                <div className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="debug-email" className="block text-sm font-medium mb-2">Email</label>
                        <input
                            id="debug-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="debug-password" className="block text-sm font-medium mb-2">Password</label>
                        <input
                            id="debug-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        onClick={handleDebugLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {loading ? 'Debugging...' : 'Debug Login'}
                    </button>
                </div>

                {debugInfo && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Debug Information:</h3>
                        <pre className="text-sm overflow-auto">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <a href="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Website
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DebugLogin;