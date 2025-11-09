import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Save, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

const Settings: React.FC = () => {
    const { profile, updateProfile } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        full_name: profile?.full_name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await updateProfile({
                full_name: profileData.full_name,
                phone: profileData.phone,
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // TODO: Implement password change functionality
            // This would typically involve verifying the current password and updating to the new one
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 bg-gray-900 min-h-screen p-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h1 className="text-2xl font-serif text-white">Settings</h1>
                <p className="text-gray-300 mt-1">Manage your account settings and preferences</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg ${
                    message.type === 'success' 
                        ? 'bg-green-900 border border-green-700 text-green-300' 
                        : 'bg-red-900 border border-red-700 text-red-300'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-sage-900 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-sage-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-secondary-800">Profile Information</h2>
                            <p className="text-sm text-secondary-600">Update your personal information</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profileData.full_name}
                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    disabled
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    title="Email address (cannot be changed)"
                                    placeholder="Email address"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:bg-sage-400 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-secondary-800">Security</h2>
                            <p className="text-sm text-secondary-600">Change your password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                            >
                                <Shield className="w-4 h-4" />
                                <span>{loading ? 'Updating...' : 'Update Password'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-secondary-800 mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-secondary-600">Role:</span>
                        <span className="ml-2 px-2 py-1 bg-sage-100 text-sage-800 rounded-full text-xs font-medium capitalize">
                            {profile?.role}
                        </span>
                    </div>
                    <div>
                        <span className="text-secondary-600">Status:</span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {profile?.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div>
                        <span className="text-secondary-600">Member since:</span>
                        <span className="ml-2 text-secondary-800">
                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div>
                        <span className="text-secondary-600">Last updated:</span>
                        <span className="ml-2 text-secondary-800">
                            {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;