import React, { useState } from 'react';
import { Shield } from 'lucide-react';

const SimpleAdminAccess: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple password check (replace with your chosen password)
        if (password === 'wecare2025') {
            // Store simple auth token
            localStorage.setItem('admin_access', 'true');
            window.location.href = '/admin/dashboard';
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="min-h-screen bg-sage-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-serif text-secondary-800">Admin Access</h2>
                    <p className="text-secondary-600 mt-2">Enter the admin password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-sage-600 hover:bg-sage-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Access Admin Panel
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sage-600 hover:text-sage-700 text-sm transition-colors"
                    >
                        ← Back to Website
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SimpleAdminAccess;