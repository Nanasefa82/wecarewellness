import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse request body
        const { firstName, lastName, email, message } = JSON.parse(event.body);

        // Validate required fields
        if (!firstName || !lastName || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required fields: firstName, lastName, email, message'
                }),
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' }),
            };
        }

        console.log('📧 Contact form submission:', { firstName, lastName, email });

        // Insert into Supabase using service role (bypasses RLS)
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([{
                first_name: firstName,
                last_name: lastName,
                email: email,
                message: message,
                status: 'new'
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Supabase error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Failed to submit contact form',
                    details: error.message
                }),
            };
        }

        console.log('✅ Contact form submitted successfully:', data.id);

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Contact form submitted successfully',
                id: data.id
            }),
        };

    } catch (error) {
        console.error('💥 Function error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message
            }),
        };
    }
};