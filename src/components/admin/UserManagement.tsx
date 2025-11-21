import React, { useState, useEffect } from 'react';
import { 
    Users, 
    UserPlus, 
    Edit3, 
    ShieldCheck, 
    Stethoscope, 
    User, 
    Search,
    Filter,
    Check,
    X,
    AlertCircle,
    Key
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../hooks/useAuth';

interface ExtendedProfile extends Profile {
    doctor_profile?: {
        id: string;
        name: string;
        specialization?: string;
        bio?: string;
    };
}

const UserManagement: React.FC = () => {
    const { isAdmin, isDoctor } = useAuthContext();
    const [users, setUsers] = useState<ExtendedProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'doctor' | 'admin'>('all');
    const [selectedUser, setSelectedUser] = useState<ExtendedProfile | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Load users on component mount
    useEffect(() => {
        if (isAdmin || isDoctor) {
            loadUsers();
        }
    }, [isAdmin, isDoctor]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Loading users...');

            // Fetch all profiles first
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('📊 Profiles query result:', { profiles, profilesError });

            if (profilesError) {
                throw profilesError;
            }

            // Fetch doctor profiles separately
            const { data: doctorProfiles, error: doctorError } = await supabase
                .from('doctor_profiles')
                .select('id, user_id, name, specialization, bio');

            console.log('👨‍⚕️ Doctor profiles query result:', { doctorProfiles, doctorError });

            // Don't throw error for doctor profiles if they don't exist
            if (doctorError) {
                console.warn('⚠️ Could not fetch doctor profiles:', doctorError);
            }

            // Create a map of doctor profiles by user_id for easy lookup
            const doctorProfileMap = new Map<string, { id: string; name: string; specialization?: string; bio?: string }>();
            doctorProfiles?.forEach(doctorProfile => {
                doctorProfileMap.set(doctorProfile.user_id, doctorProfile);
            });

            // Transform the data to match our interface
            const transformedUsers: ExtendedProfile[] = profiles?.map(profile => ({
                ...profile,
                doctor_profile: doctorProfileMap.get(profile.id) || undefined
            })) || [];

            console.log('👥 Transformed users:', transformedUsers);
            setUsers(transformedUsers);
        } catch (err) {
            console.error('Error loading users:', err);
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'client' | 'doctor' | 'admin') => {
        try {
            setError(null);
            
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    role: newRole,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;

            // Reload users to reflect changes
            await loadUsers();
            setSuccess(`User role updated to ${newRole} successfully!`);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error updating user role:', err);
            setError(err instanceof Error ? err.message : 'Failed to update user role');
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            setError(null);
            
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    is_active: !currentStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;

            await loadUsers();
            setSuccess(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error updating user status:', err);
            setError(err instanceof Error ? err.message : 'Failed to update user status');
        }
    };

    // Filter users based on search term and role filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.doctor_profile?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
    });


    if (!isAdmin && !isDoctor) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-700">Access denied. Doctor or Admin privileges required.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage user accounts and assign roles</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowCreateUserModal(true)}
                        className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Create User</span>
                    </button>
                    <button
                        onClick={() => setShowCreateDoctorModal(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Create Doctor Profile</span>
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-green-700">{success}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'client' | 'doctor' | 'admin')}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            title="Filter users by role"
                        >
                            <option value="all">All Roles</option>
                            <option value="client">Clients</option>
                            <option value="doctor">Doctors</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No users found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onUpdateRole={updateUserRole}
                                        onToggleStatus={toggleUserStatus}
                                        onEdit={() => {
                                            setSelectedUser(user);
                                            setShowEditModal(true);
                                        }}
                                        onResetPassword={() => {
                                            setSelectedUser(user);
                                            setShowResetPasswordModal(true);
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                    }}
                    onSave={async () => {
                        await loadUsers();
                        setShowEditModal(false);
                        setSelectedUser(null);
                        setSuccess('User updated successfully!');
                        setTimeout(() => setSuccess(null), 3000);
                    }}
                />
            )}

            {/* Create User Modal */}
            {showCreateUserModal && (
                <CreateUserModal
                    onClose={() => setShowCreateUserModal(false)}
                    onSave={async () => {
                        await loadUsers();
                        setShowCreateUserModal(false);
                        setSuccess('User created successfully!');
                        setTimeout(() => setSuccess(null), 3000);
                    }}
                />
            )}

            {/* Reset Password Modal */}
            {showResetPasswordModal && selectedUser && (
                <ResetPasswordModal
                    user={selectedUser}
                    onClose={() => {
                        setShowResetPasswordModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={() => {
                        setShowResetPasswordModal(false);
                        setSelectedUser(null);
                        setSuccess('Password reset email sent!');
                        setTimeout(() => setSuccess(null), 3000);
                    }}
                />
            )}

            {/* Create Doctor Profile Modal */}
            {showCreateDoctorModal && (
                <CreateDoctorModal
                    onClose={() => setShowCreateDoctorModal(false)}
                    onSave={async () => {
                        await loadUsers();
                        setShowCreateDoctorModal(false);
                        setSuccess('Doctor profile created successfully!');
                        setTimeout(() => setSuccess(null), 3000);
                    }}
                />
            )}
        </div>
    );
};

// User Row Component
interface UserRowProps {
    user: ExtendedProfile;
    onUpdateRole: (userId: string, role: 'client' | 'doctor' | 'admin') => void;
    onToggleStatus: (userId: string, currentStatus: boolean) => void;
    onEdit: () => void;
    onResetPassword: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onUpdateRole, onToggleStatus, onEdit, onResetPassword }) => {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-sage-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-sage-600" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.doctor_profile && (
                            <div className="text-xs text-blue-600">
                                Dr. {user.doctor_profile.name}
                                {user.doctor_profile.specialization && (
                                    <span className="text-gray-500"> • {user.doctor_profile.specialization}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <span className={getRoleBadge(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    {/* Edit Button */}
                    <button
                        onClick={onEdit}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit user"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    
                    {/* Reset Password Button */}
                    <button
                        onClick={onResetPassword}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Reset password"
                    >
                        <Key className="w-4 h-4" />
                    </button>
                    
                    {/* Role Buttons */}
                    <button
                        onClick={() => onUpdateRole(user.id, 'client')}
                        className={`p-2 rounded-lg transition-colors ${
                            user.role === 'client' 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title="Make client"
                    >
                        <User className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={() => onUpdateRole(user.id, 'doctor')}
                        className={`p-2 rounded-lg transition-colors ${
                            user.role === 'doctor' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-400 hover:bg-blue-50'
                        }`}
                        title="Make doctor"
                    >
                        <Stethoscope className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={() => onUpdateRole(user.id, 'admin')}
                        className={`p-2 rounded-lg transition-colors ${
                            user.role === 'admin' 
                                ? 'bg-red-100 text-red-700' 
                                : 'text-gray-400 hover:bg-red-50'
                        }`}
                        title="Make admin"
                    >
                        <ShieldCheck className="w-4 h-4" />
                    </button>
                    
                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-300"></div>
                    
                    {/* Toggle Status Button */}
                    <button
                        onClick={() => onToggleStatus(user.id, user.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                            user.is_active 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.is_active ? 'Deactivate user' : 'Activate user'}
                    >
                        {user.is_active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                </div>
            </td>
        </tr>
    );

    function getRoleIcon(role: string) {
        switch (role) {
            case 'admin':
                return <ShieldCheck className="w-4 h-4 text-red-600" />;
            case 'doctor':
                return <Stethoscope className="w-4 h-4 text-blue-600" />;
            default:
                return <User className="w-4 h-4 text-gray-600" />;
        }
    }

    function getRoleBadge(role: string) {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        switch (role) {
            case 'admin':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'doctor':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    }
};

// Edit User Modal Component
interface EditUserModalProps {
    user: ExtendedProfile;
    onClose: () => void;
    onSave: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        full_name: user.full_name || '',
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        is_active: user.is_active
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    role: formData.role,
                    is_active: formData.is_active,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            onSave();
        } catch (err) {
            console.error('Error updating user:', err);
            setError(err instanceof Error ? err.message : 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        title="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-full-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="edit-full-name"
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="Enter full name"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="edit-email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            id="edit-phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="edit-role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' | 'doctor' | 'admin' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                        >
                            <option value="client">Client</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="edit-is-active"
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-gray-300 rounded"
                        />
                        <label htmlFor="edit-is-active" className="ml-2 block text-sm text-gray-700">
                            Active user
                        </label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:bg-sage-400"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Create Doctor Modal Component
interface CreateDoctorModalProps {
    onClose: () => void;
    onSave: () => void;
}

const CreateDoctorModal: React.FC<CreateDoctorModalProps> = ({ onClose, onSave }) => {
    const [step, setStep] = useState<'select-user' | 'create-profile'>('select-user');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [clientUsers, setClientUsers] = useState<ExtendedProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [doctorData, setDoctorData] = useState({
        name: '',
        specialization: '',
        bio: '',
        default_appointment_duration: 60,
        buffer_time: 15,
    });

    // Load client users when modal opens
    useEffect(() => {
        loadClientUsers();
    }, []);

    const loadClientUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'client')
                .eq('is_active', true)
                .order('full_name');

            if (error) throw error;
            setClientUsers(data || []);
        } catch (err) {
            console.error('Error loading client users:', err);
            setError('Failed to load users');
        }
    };

    const handleUserSelect = (userId: string) => {
        setSelectedUserId(userId);
        const selectedUser = clientUsers.find(u => u.id === userId);
        if (selectedUser) {
            setDoctorData(prev => ({
                ...prev,
                name: selectedUser.full_name || selectedUser.email.split('@')[0]
            }));
        }
        setStep('create-profile');
    };

    const handleCreateDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // First, update the user's role to doctor
            const { error: roleError } = await supabase
                .from('profiles')
                .update({ 
                    role: 'doctor',
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedUserId);

            if (roleError) throw roleError;

            // Then create the doctor profile
            const { error: doctorError } = await supabase
                .from('doctor_profiles')
                .insert({
                    user_id: selectedUserId,
                    name: doctorData.name,
                    specialization: doctorData.specialization || null,
                    bio: doctorData.bio || null,
                    default_appointment_duration: doctorData.default_appointment_duration,
                    buffer_time: doctorData.buffer_time,
                });

            if (doctorError) throw doctorError;

            onSave();
        } catch (err) {
            console.error('Error creating doctor profile:', err);
            setError(err instanceof Error ? err.message : 'Failed to create doctor profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        {step === 'select-user' ? 'Select User to Promote' : 'Create Doctor Profile'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        title="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {step === 'select-user' ? (
                    <div>
                        <p className="text-gray-600 mb-4">
                            Select a client user to promote to doctor role:
                        </p>
                        
                        {clientUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No client users available to promote.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {clientUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleUserSelect(user.id)}
                                        className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-sage-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.full_name || 'No name'}
                                                </div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleCreateDoctor} className="space-y-4">
                        <div>
                            <label htmlFor="doctor-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Doctor Name *
                            </label>
                            <input
                                id="doctor-name"
                                type="text"
                                value={doctorData.name}
                                onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                placeholder="Dr. John Smith"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="doctor-specialization" className="block text-sm font-medium text-gray-700 mb-1">
                                Specialization
                            </label>
                            <input
                                id="doctor-specialization"
                                type="text"
                                value={doctorData.specialization}
                                onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                placeholder="Psychiatry, Psychology, etc."
                            />
                        </div>

                        <div>
                            <label htmlFor="doctor-bio" className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                id="doctor-bio"
                                value={doctorData.bio}
                                onChange={(e) => setDoctorData({ ...doctorData, bio: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                rows={3}
                                placeholder="Brief professional bio..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="appointment-duration" className="block text-sm font-medium text-gray-700 mb-1">
                                    Default Appointment Duration (minutes)
                                </label>
                                <input
                                    id="appointment-duration"
                                    type="number"
                                    value={doctorData.default_appointment_duration}
                                    onChange={(e) => setDoctorData({ ...doctorData, default_appointment_duration: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                    min="15"
                                    max="180"
                                />
                            </div>

                            <div>
                                <label htmlFor="buffer-time" className="block text-sm font-medium text-gray-700 mb-1">
                                    Buffer Time (minutes)
                                </label>
                                <input
                                    id="buffer-time"
                                    type="number"
                                    value={doctorData.buffer_time}
                                    onChange={(e) => setDoctorData({ ...doctorData, buffer_time: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                                    min="0"
                                    max="60"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep('select-user')}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:bg-sage-400"
                                disabled={loading || !doctorData.name}
                            >
                                {loading ? 'Creating...' : 'Create Doctor Profile'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// Create User Modal Component
interface CreateUserModalProps {
    onClose: () => void;
    onSave: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'client' as 'client' | 'doctor' | 'admin'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Use regular signup (requires email confirmation unless disabled in Supabase settings)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.full_name
                    }
                }
            });

            if (authError) throw authError;
            
            if (!authData.user) {
                throw new Error('User creation failed - no user data returned');
            }

            // Update the profile with additional info and role
            // (Profile should be auto-created by trigger, but we'll update it)
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    email: formData.email,
                    full_name: formData.full_name,
                    phone: formData.phone,
                    role: formData.role,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

            onSave();
        } catch (err) {
            console.error('Error creating user:', err);
            setError(err instanceof Error ? err.message : 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="(555) 123-4567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role *
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' | 'doctor' | 'admin' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                        >
                            <option value="client">Client</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:bg-sage-400"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Reset Password Modal Component
interface ResetPasswordModalProps {
    user: ExtendedProfile;
    onClose: () => void;
    onSuccess: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (resetError) throw resetError;

            onSuccess();
        } catch (err) {
            console.error('Error sending password reset:', err);
            setError(err instanceof Error ? err.message : 'Failed to send password reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-gray-600">
                        Send a password reset email to:
                    </p>
                    <p className="font-medium text-gray-900 mt-2">{user.email}</p>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleResetPassword}
                        className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:bg-sage-400"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
