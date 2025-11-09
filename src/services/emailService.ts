import { BookingRecord } from '../types/booking';

// Email configuration - uses environment variables with fallbacks
const EMAIL_CONFIG = {
    apiUrl: import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/email',
    fromEmail: import.meta.env.VITE_FROM_EMAIL || 'noreply@wecarewellnessllc.com',
    companyName: 'We Care Wellness LLC',
    websiteUrl: 'https://www.wecarewellnessllc.com',
    supportEmail: 'support@wecarewellnessllc.com',
    supportPhone: '(703) 828-7620'
};

export interface EmailData {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export interface BookingEmailData {
    booking: BookingRecord;
    doctorName?: string;
    doctorCredentials?: string;
    doctorEmail?: string;
    appointmentType?: string;
    sessionType?: 'virtual' | 'in-person';
    timezone?: string;
    cancelUrl?: string;
}

class EmailService {
    private async sendEmail(emailData: EmailData): Promise<boolean> {
        try {
            const response = await fetch(EMAIL_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                throw new Error(`Email service responded with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Email sent successfully:', result);
            return true;
        } catch (error) {
            console.error('❌ Failed to send email:', error);
            // In development, we'll simulate success
            if (import.meta.env.DEV) {
                console.log('📧 Email would be sent in production:', emailData);
                return true;
            }
            return false;
        }
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    private formatTime(timeString: string, timezone: string = 'PST'): string {
        // Convert time string to 12-hour format
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm} (${timezone})`;
    }

    private generatePatientConfirmationEmail(data: BookingEmailData): EmailData {
        const { booking, doctorName, doctorCredentials, sessionType, timezone, cancelUrl } = data;
        
        const appointmentDate = this.formatDate(booking.preferred_date);
        const appointmentTime = this.formatTime(booking.preferred_time, timezone || 'PST');
        const fullDoctorName = doctorName || 'Dr. Emma Boateng';
        const credentials = doctorCredentials || 'DNP, MSN, PMHNP-BC';
        const sessionTypeText = sessionType === 'virtual' ? 'Virtual Session' : 'In-Person';
        const instructions = sessionType === 'virtual' 
            ? 'This will be a virtual session. You will receive a meeting link 24 hours before your appointment.'
            : 'Please arrive 15 minutes early for your in-person appointment.';

        const subject = `Appointment Confirmation - ${appointmentDate}`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6B7280; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .appointment-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
        .patient-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .button { display: inline-block; background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .highlight { color: #10B981; font-weight: bold; }
        .warning { color: #F59E0B; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Appointment Confirmation</h1>
        <p>We Care Wellness LLC</p>
    </div>
    
    <div class="content">
        <p>Hi <strong>${booking.first_name} ${booking.last_name}</strong>,</p>
        
        <p>This is a confirmation of the appointment you just booked on <a href="${EMAIL_CONFIG.websiteUrl}">${EMAIL_CONFIG.websiteUrl}</a></p>
        
        <div class="appointment-details">
            <h3>📅 Appointment Details</h3>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Type:</strong> <span class="highlight">${sessionTypeText} Consultation with ${fullDoctorName.toUpperCase()} (${credentials})</span></p>
            <p><strong>Instructions:</strong> ${instructions}</p>
        </div>
        
        <div class="patient-details">
            <h3>👤 Your Details</h3>
            <p><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            ${booking.reason_for_visit ? `<p><strong>Reason for Visit:</strong> ${booking.reason_for_visit}</p>` : ''}
            ${booking.current_medications ? `<p><strong>Current Medications:</strong> ${booking.current_medications}</p>` : ''}
            ${booking.insurance_provider ? `<p><strong>Insurance:</strong> ${booking.insurance_provider}</p>` : ''}
        </div>
        
        <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p class="warning">⚠️ Important Reminders:</p>
            <ul>
                <li>Please arrive 10 minutes early (or log in early for virtual sessions)</li>
                <li>Bring a valid ID and insurance card</li>
                <li>Have your current medications list ready</li>
                <li>Prepare any questions you'd like to discuss</li>
            </ul>
        </div>
        
        <p>If you need to cancel or change your appointment, please contact us at least 24 hours in advance:</p>
        <ul>
            <li>📞 Phone: <a href="tel:${EMAIL_CONFIG.supportPhone}">${EMAIL_CONFIG.supportPhone}</a></li>
            <li>📧 Email: <a href="mailto:${EMAIL_CONFIG.supportEmail}">${EMAIL_CONFIG.supportEmail}</a></li>
            ${cancelUrl ? `<li>🔗 <a href="${cancelUrl}" class="button">Cancel/Reschedule Online</a></li>` : ''}
        </ul>
        
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>The We Care Wellness Team</p>
    </div>
    
    <div class="footer">
        <p>We Care Wellness LLC<br>
        ${EMAIL_CONFIG.supportPhone} | ${EMAIL_CONFIG.supportEmail}<br>
        <a href="${EMAIL_CONFIG.websiteUrl}">${EMAIL_CONFIG.websiteUrl}</a></p>
        <p><small>This is an automated message. Please do not reply to this email.</small></p>
    </div>
</body>
</html>`;

        const text = `
Hi ${booking.first_name} ${booking.last_name},

This is a confirmation of the appointment you just booked on ${EMAIL_CONFIG.websiteUrl}

Appointment scheduled for ${appointmentDate} ${appointmentTime}
Instructions: ${instructions}

Type: ${sessionTypeText} Consultation with ${fullDoctorName.toUpperCase()} (${credentials})

Your details:
Name: ${booking.first_name} ${booking.last_name}
Email: ${booking.email}
Phone: ${booking.phone}
${booking.reason_for_visit ? `Reason for Visit: ${booking.reason_for_visit}` : ''}

If you need to cancel or change your appointment, please contact us:
Phone: ${EMAIL_CONFIG.supportPhone}
Email: ${EMAIL_CONFIG.supportEmail}

Best regards,
The We Care Wellness Team
`;

        return {
            to: booking.email,
            subject,
            html,
            text
        };
    }

    private generateDoctorNotificationEmail(data: BookingEmailData): EmailData {
        const { booking, doctorEmail, sessionType, timezone } = data;
        
        const appointmentDate = this.formatDate(booking.preferred_date);
        const appointmentTime = this.formatTime(booking.preferred_time, timezone || 'PST');
        const sessionTypeText = sessionType === 'virtual' ? 'Virtual Session' : 'In-Person';

        const subject = `New Appointment Booking - ${booking.first_name} ${booking.last_name} - ${appointmentDate}`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Appointment Booking</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1F2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .patient-info { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6; }
        .appointment-info { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
        .medical-info { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .status-badge { background-color: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🩺 New Appointment Booking</h1>
        <p>We Care Wellness LLC - Doctor Portal</p>
    </div>
    
    <div class="content">
        <p>Dear Doctor,</p>
        
        <p>A new appointment has been booked through the online booking system.</p>
        
        <div class="appointment-info">
            <h3>📅 Appointment Information</h3>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Type:</strong> ${sessionTypeText}</p>
            <p><strong>Status:</strong> <span class="status-badge">${booking.status.toUpperCase()}</span></p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        
        <div class="patient-info">
            <h3>👤 Patient Information</h3>
            <p><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${booking.phone}">${booking.phone}</a></p>
            <p><strong>Date of Birth:</strong> ${booking.date_of_birth ? new Date(booking.date_of_birth + 'T00:00:00').toLocaleDateString('en-US') : 'N/A'}</p>
            <p><strong>Insurance:</strong> ${booking.insurance_provider || 'Not provided'}</p>
        </div>
        
        <div class="medical-info">
            <h3>🏥 Medical Information</h3>
            <p><strong>Reason for Visit:</strong> ${booking.reason_for_visit || 'Not specified'}</p>
            <p><strong>Previous Treatment:</strong> ${booking.previous_treatment || 'None specified'}</p>
            <p><strong>Current Medications:</strong> ${booking.current_medications || 'None specified'}</p>
        </div>
        
        <div class="patient-info">
            <h3>🚨 Emergency Contact</h3>
            <p><strong>Contact Name:</strong> ${booking.emergency_contact || 'Not provided'}</p>
            <p><strong>Contact Phone:</strong> ${booking.emergency_phone || 'Not provided'}</p>
        </div>
        
        <div style="background-color: #DBEAFE; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📋 Next Steps:</strong></p>
            <ul>
                <li>Review patient information and medical history</li>
                <li>Confirm appointment availability in your calendar</li>
                <li>Update appointment status if needed</li>
                <li>Send meeting link for virtual sessions (if applicable)</li>
            </ul>
        </div>
        
        <p>Please log into the admin portal to manage this appointment or contact the patient if needed.</p>
        
        <p>Best regards,<br>We Care Wellness Booking System</p>
    </div>
    
    <div class="footer">
        <p>We Care Wellness LLC - Doctor Portal<br>
        This is an automated notification from the booking system.</p>
    </div>
</body>
</html>`;

        const text = `
New Appointment Booking - We Care Wellness LLC

Patient: ${booking.first_name} ${booking.last_name}
Date: ${appointmentDate}
Time: ${appointmentTime}
Type: ${sessionTypeText}
Status: ${booking.status.toUpperCase()}

Patient Contact:
Email: ${booking.email}
Phone: ${booking.phone}
DOB: ${booking.date_of_birth ? new Date(booking.date_of_birth + 'T00:00:00').toLocaleDateString('en-US') : 'N/A'}

Medical Information:
Reason: ${booking.reason_for_visit || 'Not specified'}
Previous Treatment: ${booking.previous_treatment || 'None specified'}
Current Medications: ${booking.current_medications || 'None specified'}

Emergency Contact: ${booking.emergency_contact || 'Not provided'} - ${booking.emergency_phone || 'Not provided'}

Please review and confirm this appointment in the admin portal.
`;

        return {
            to: doctorEmail || 'sboat_kwame@hotmail.com',
            subject,
            html,
            text
        };
    }

    async sendBookingConfirmation(data: BookingEmailData): Promise<{ patientEmailSent: boolean; doctorEmailSent: boolean }> {
        console.log('📧 Sending booking confirmation emails...');
        
        try {
            // Send patient confirmation email
            const patientEmail = this.generatePatientConfirmationEmail(data);
            const patientEmailSent = await this.sendEmail(patientEmail);

            // Send doctor notification email
            const doctorEmail = this.generateDoctorNotificationEmail(data);
            const doctorEmailSent = await this.sendEmail(doctorEmail);

            console.log(`📧 Email results - Patient: ${patientEmailSent ? '✅' : '❌'}, Doctor: ${doctorEmailSent ? '✅' : '❌'}`);

            return {
                patientEmailSent,
                doctorEmailSent
            };
        } catch (error) {
            console.error('❌ Error sending booking confirmation emails:', error);
            return {
                patientEmailSent: false,
                doctorEmailSent: false
            };
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendAppointmentReminder(_data: BookingEmailData): Promise<boolean> {
        // Implementation for appointment reminders (24 hours before)
        console.log('📧 Sending appointment reminder...');
        // This would be implemented for scheduled reminders
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendCancellationNotification(_data: BookingEmailData): Promise<boolean> {
        // Implementation for cancellation notifications
        console.log('📧 Sending cancellation notification...');
        // This would be implemented when appointments are cancelled
        return true;
    }
}

export const emailService = new EmailService();
export default EmailService;
