// Simple Email Server for We Care Wellness
// This is a basic Node.js/Express server that handles email sending
// In production, you would deploy this separately and use environment variables

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
// For production, use your actual email service (Gmail, SendGrid, AWS SES, etc.)
const createTransporter = () => {
    if (process.env.NODE_ENV === 'production') {
        // Production email configuration
        return nodemailer.createTransporter({
            service: 'gmail', // or your email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
            }
        });
    } else {
        // Development configuration using Ethereal Email (test emails)
        return nodemailer.createTransporter({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'ethereal.user@ethereal.email',
                pass: 'ethereal.pass'
            }
        });
    }
};

// Email sending endpoint
app.post('/api/email', async (req, res) => {
    try {
        const { to, subject, html, text } = req.body;

        // Validate required fields
        if (!to || !subject || !html) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, html'
            });
        }

        // Create transporter
        const transporter = createTransporter();

        // Email options
        const mailOptions = {
            from: process.env.FROM_EMAIL || 'noreply@wecarewellnessllc.com',
            to: to,
            subject: subject,
            html: html,
            text: text || '' // Fallback to empty string if no text provided
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully:', {
            messageId: info.messageId,
            to: to,
            subject: subject
        });

        // In development, log the preview URL
        if (process.env.NODE_ENV !== 'production') {
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        res.json({
            success: true,
            messageId: info.messageId,
            previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
        });

    } catch (error) {
        console.error('❌ Email sending failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'We Care Wellness Email Service'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`📧 Email server running on port ${PORT}`);
    console.log(`🏥 We Care Wellness Email Service`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
