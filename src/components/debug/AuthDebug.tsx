import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthDebug: React.FC = () => {
    const auth = useAuthContext();
    const navigate = useNavigate();

    const forceNavigate = () => {
        navigate('/admin/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Current Auth State</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Loading:</strong> {auth.loading ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Authenticated:</strong> {auth.isAuthenticated ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Is Admin:</strong> {auth.isAdmin ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>Is Doctor:</strong> {auth.isDoctor ? 'Yes' : 'No'}
                        </div>
                        <div>
                            <strong>User Email:</strong> {auth.user?.email || 'None'}
                        </div>
                        <div>
                            <strong>User ID:</strong> {auth.user?.id || 'None'}
                        </div>
                        <div>
                            <strong>Profile Role:</strong> {auth.profile?.role || 'None'}
                        </div>
                        <div>
                            <strong>Profile Name:</strong> {auth.profile?.full_name || 'None'}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Raw Data</h2>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                        {JSON.stringify({
                            user: auth.user,
                            profile: auth.profile,
                            session: auth.session,
                            loading: auth.loading,
                            isAuthenticated: auth.isAuthenticated,
                            isAdmin: auth.isAdmin,
                            isDoctor: auth.isDoctor
                        }, null, 2)}
                    </pre>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Actions</h2>
                    <div className="space-x-4">
                        <button
                            onClick={forceNavigate}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Force Navigate to Dashboard
                        </button>
                        <button
                            onClick={() => auth.refetchProfile()}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Refetch Profile
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthDebug;