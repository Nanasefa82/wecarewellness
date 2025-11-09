import { useState } from 'react';
import { useContactForm } from '../../hooks/useContactForm';

const ContactFormTest = () => {
    const { createSubmission, submitting, error } = useContactForm();
    const [testData, setTestData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        message: 'This is a test message to verify the contact form CRUD operations are working correctly.'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createSubmission(testData);
        if (result) {
            alert('Test submission created successfully!');
            console.log('Created submission:', result);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Test Contact Form CRUD</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={testData.firstName}
                        onChange={(e) => setTestData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sage-500 focus:border-sage-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={testData.lastName}
                        onChange={(e) => setTestData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sage-500 focus:border-sage-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={testData.email}
                        onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sage-500 focus:border-sage-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        value={testData.message}
                        onChange={(e) => setTestData(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sage-500 focus:border-sage-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-4 py-2 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 text-white font-medium rounded-md"
                >
                    {submitting ? 'Creating...' : 'Test Create Submission'}
                </button>
            </form>
        </div>
    );
};

export default ContactFormTest;