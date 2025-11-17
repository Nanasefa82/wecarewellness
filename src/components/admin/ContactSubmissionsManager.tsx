import { useState, useEffect } from 'react';
import {
    Mail,
    Eye,
    Trash2,
    Archive,
    MessageSquare,
    CheckCircle,
    Clock,
    Search,
    Filter,
    Download,
    AlertCircle,
    TrendingUp
} from 'lucide-react';
import { useContactForm, ContactFormData } from '../../hooks/useContactForm';

const ContactSubmissionsManager = () => {
    const {
        submissions,
        loading,
        error,
        getSubmissions,
        getSubmissionById,
        updateSubmissionStatus,
        deleteSubmission,
        clearError
    } = useContactForm();

    const [selectedSubmission, setSelectedSubmission] = useState<ContactFormData | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadSubmissions();

        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (loading) {
                console.log('⏰ ContactSubmissionsManager: Loading timeout reached');
            }
        }, 10000);

        return () => clearTimeout(timeout);
    }, [statusFilter]);

    const loadSubmissions = async () => {
        try {
            console.log('📧 ContactSubmissionsManager: Loading submissions...');
            const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
            await getSubmissions(filters);
            console.log('✅ ContactSubmissionsManager: Submissions loaded successfully');
        } catch (error) {
            console.error('❌ ContactSubmissionsManager: Error loading submissions:', error);
        }
    };

    const handleViewSubmission = async (id: string) => {
        const submission = await getSubmissionById(id);
        if (submission) {
            setSelectedSubmission(submission);
            // Mark as read if it's new
            if (submission.status === 'new') {
                await updateSubmissionStatus(id, 'read');
                loadSubmissions(); // Refresh the list
            }
        }
    };

    const handleStatusUpdate = async (id: string, status: ContactFormData['status']) => {
        if (status) {
            await updateSubmissionStatus(id, status);
            if (selectedSubmission?.id === id) {
                setSelectedSubmission(prev => prev ? { ...prev, status } : null);
            }
        }
    };

    const handleDelete = async (id: string) => {
        await deleteSubmission(id);
        if (selectedSubmission?.id === id) {
            setSelectedSubmission(null);
        }
        setShowDeleteConfirm(null);
    };

    const filteredSubmissions = submissions.filter(submission => {
        const matchesSearch =
            submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.message.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'read':
                return <Eye className="w-4 h-4 text-yellow-500" />;
            case 'responded':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'archived':
                return <Archive className="w-4 h-4 text-gray-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'read':
                return 'bg-yellow-100 text-yellow-800';
            case 'responded':
                return 'bg-green-100 text-green-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Name', 'Email', 'Status', 'Message'];
        const csvData = filteredSubmissions.map(sub => [
            new Date(sub.createdAt || '').toLocaleDateString(),
            `${sub.firstName} ${sub.lastName}`,
            sub.email,
            sub.status,
            `"${sub.message.replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Calculate statistics
    const stats = [
        {
            name: 'Total Messages',
            value: submissions.length,
            icon: Mail,
            color: 'bg-blue-500',
            change: '+12% from last month'
        },
        {
            name: 'New Messages',
            value: submissions.filter(s => s.status === 'new').length,
            icon: AlertCircle,
            color: 'bg-red-500',
            change: 'Requires attention'
        },
        {
            name: 'Responded',
            value: submissions.filter(s => s.status === 'responded').length,
            icon: CheckCircle,
            color: 'bg-green-500',
            change: 'This month'
        },
        {
            name: 'This Week',
            value: submissions.filter(s => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(s.createdAt || '') >= weekAgo;
            }).length,
            icon: TrendingUp,
            color: 'bg-purple-500',
            change: 'Recent activity'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Contact Messages</h1>
                <p className="text-gray-300">Manage and respond to contact form submissions</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className={`${stat.color} rounded-lg p-3`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-300">{stat.name}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-400">{stat.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center">
                    <div className="text-red-400 text-sm">{error}</div>
                    <button
                        onClick={clearError}
                        className="ml-auto text-red-400 hover:text-red-300"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search submissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            title="Filter submissions by status"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="responded">Responded</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submissions List */}
                <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold text-white">
                            Submissions ({filteredSubmissions.length})
                        </h2>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage-600 border-t-transparent mx-auto"></div>
                                <p className="mt-2 text-gray-300">Loading submissions...</p>
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                <p>No submissions found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-700">
                                {filteredSubmissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className={`p-4 hover:bg-gray-700 cursor-pointer transition-colors ${selectedSubmission?.id === submission.id ? 'bg-sage-900/30 border-r-4 border-sage-500' : ''
                                            }`}
                                        onClick={() => handleViewSubmission(submission.id!)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getStatusIcon(submission.status || 'new')}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status || 'new')}`}>
                                                        {submission.status || 'new'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-white truncate">
                                                    {submission.firstName} {submission.lastName}
                                                </p>
                                                <p className="text-sm text-gray-300 truncate">{submission.email}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(submission.createdAt || '').toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                                            {submission.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submission Detail */}
                <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold text-white">Submission Details</h2>
                    </div>

                    {selectedSubmission ? (
                        <div className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <p className="text-sm text-white">
                                        {selectedSubmission.firstName} {selectedSubmission.lastName}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                    <p className="text-sm text-white">{selectedSubmission.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                    <select
                                        value={selectedSubmission.status || 'new'}
                                        onChange={(e) => handleStatusUpdate(selectedSubmission.id!, e.target.value as ContactFormData['status'])}
                                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-sage-500 focus:border-sage-500 sm:text-sm"
                                        title="Update submission status"
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="responded">Responded</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                    <div className="mt-1 p-3 bg-gray-700 rounded-md">
                                        <p className="text-sm text-white whitespace-pre-wrap">
                                            {selectedSubmission.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                    <div>
                                        <label className="block font-medium">Submitted</label>
                                        <p>{new Date(selectedSubmission.createdAt || '').toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="block font-medium">Last Updated</label>
                                        <p>{new Date(selectedSubmission.updatedAt || '').toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-gray-700">
                                    <a
                                        href={`mailto:${selectedSubmission.email}?subject=Re: Your message to We Care Wellness`}
                                        className="flex-1 px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Reply
                                    </a>

                                    <button
                                        onClick={() => setShowDeleteConfirm(selectedSubmission.id!)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p>Select a submission to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Delete Submission</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this submission? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactSubmissionsManager;