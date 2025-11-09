import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const DatabaseSetup: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const checkTable = async () => {
        setLoading(true);
        setStatus('Checking contact_submissions table...');

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .select('count')
                .limit(1);

            if (error) {
                if (error.message.includes('relation "contact_submissions" does not exist')) {
                    setStatus('❌ Table does not exist. Need to run migration.');
                } else {
                    setStatus(`❌ Error: ${error.message}`);
                }
            } else {
                setStatus('✅ Table exists and is accessible!');
            }
        } catch (error) {
            setStatus(`💥 Exception: ${error}`);
        }

        setLoading(false);
    };

    const createTable = async () => {
        setLoading(true);
        setStatus('Creating contact_submissions table...');

        try {
            // Create the table using raw SQL
            const { error } = await supabase.rpc('exec_sql', {
                sql: `
                    CREATE TABLE IF NOT EXISTS contact_submissions (
                        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                        first_name VARCHAR(100) NOT NULL,
                        last_name VARCHAR(100) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        message TEXT NOT NULL,
                        status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                    
                    -- Enable RLS
                    ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
                    
                    -- Allow anyone to insert
                    CREATE POLICY IF NOT EXISTS "Anyone can submit contact form" ON contact_submissions
                        FOR INSERT WITH CHECK (true);
                `
            });

            if (error) {
                setStatus(`❌ Failed to create table: ${error.message}`);
            } else {
                setStatus('✅ Table created successfully!');
            }
        } catch (error) {
            // Fallback: try direct SQL execution
            setStatus('⚠️ Cannot create table automatically. Please run the migration manually in Supabase dashboard.');
        }

        setLoading(false);
    };

    const addSampleData = async () => {
        setLoading(true);
        setStatus('Adding sample data...');

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .insert([
                    {
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john.doe@example.com',
                        message: 'This is a test message to verify the contact form is working properly.',
                        status: 'new'
                    },
                    {
                        first_name: 'Jane',
                        last_name: 'Smith',
                        email: 'jane.smith@example.com',
                        message: 'I would like to schedule an appointment for next week.',
                        status: 'read'
                    },
                    {
                        first_name: 'Bob',
                        last_name: 'Johnson',
                        email: 'bob.johnson@example.com',
                        message: 'Thank you for the excellent service!',
                        status: 'responded'
                    }
                ]);

            if (error) {
                setStatus(`❌ Failed to add sample data: ${error.message}`);
            } else {
                setStatus('✅ Sample data added successfully!');
            }
        } catch (error) {
            setStatus(`💥 Exception: ${error}`);
        }

        setLoading(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Database Setup for Contact Messages</h3>

            <div className="space-y-4">
                <button
                    onClick={checkTable}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? 'Checking...' : 'Check Table Status'}
                </button>

                <button
                    onClick={createTable}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
                >
                    {loading ? 'Creating...' : 'Create Table (if needed)'}
                </button>

                <button
                    onClick={addSampleData}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
                >
                    {loading ? 'Adding...' : 'Add Sample Data'}
                </button>

                {status && (
                    <div className="p-3 bg-gray-100 rounded text-sm whitespace-pre-line">
                        {status}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Manual Setup Instructions:</h4>
                <p className="text-yellow-700 text-sm">
                    If automatic setup fails, please run the migration file manually:
                    <br />
                    1. Go to your Supabase dashboard
                    <br />
                    2. Navigate to SQL Editor
                    <br />
                    3. Copy and paste the contents of <code>supabase/migrations/017_create_contact_submissions_table.sql</code>
                    <br />
                    4. Execute the query
                </p>
            </div>
        </div>
    );
};

export default DatabaseSetup;