# We Care Wellness Email Server

A Node.js/Express email service for sending appointment confirmation emails to patients and doctors.

## Features

- ✅ Patient appointment confirmation emails
- ✅ Doctor appointment notification emails
- ✅ Professional HTML email templates
- ✅ Development and production configurations
- ✅ Error handling and logging
- ✅ CORS enabled for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd email-server
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your email configuration:

```env
NODE_ENV=development
PORT=3001
FROM_EMAIL=noreply@wecarewellnessllc.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:3001`

## Email Service Configuration

### Gmail Setup (Recommended for Development)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the 16-character app password in `.env`

### Production Email Services

#### SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

#### AWS SES
```env
EMAIL_SERVICE=ses
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```

## API Endpoints

### POST /api/email

Send an email with HTML content.

**Request Body:**
```json
{
  "to": "patient@example.com",
  "subject": "Appointment Confirmation",
  "html": "<h1>Your appointment is confirmed</h1>",
  "text": "Your appointment is confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "message-id",
  "previewUrl": "https://ethereal.email/message/preview-url"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-05T16:00:00.000Z",
  "service": "We Care Wellness Email Service"
}
```

## Integration with Frontend

The React app's email service (`src/services/emailService.ts`) automatically sends emails when:

1. **New booking created** → Patient confirmation + Doctor notification
2. **Appointment cancelled** → Cancellation notifications
3. **Appointment reminders** → 24-hour reminders (future feature)

## Email Templates

The service generates professional HTML emails with:

### Patient Confirmation Email
- Appointment details (date, time, doctor)
- Patient information summary
- Session instructions (virtual/in-person)
- Cancellation/rescheduling information
- Emergency contact details

### Doctor Notification Email
- New appointment alert
- Complete patient information
- Medical history summary
- Emergency contact details
- Next steps checklist

## Development Testing

In development mode, the server uses Ethereal Email for testing:
- No real emails are sent
- Preview URLs are logged to console
- Perfect for testing email templates

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3001
FROM_EMAIL=noreply@wecarewellnessllc.com
EMAIL_USER=your-production-email
EMAIL_PASSWORD=your-production-password
```

### Deployment Options
- **Heroku**: `git push heroku main`
- **AWS EC2**: PM2 process manager
- **Docker**: Containerized deployment
- **Vercel**: Serverless functions

## Security Considerations

- ✅ Use app passwords, not regular passwords
- ✅ Store credentials in environment variables
- ✅ Enable CORS only for your domain in production
- ✅ Use HTTPS in production
- ✅ Implement rate limiting for production use

## Troubleshooting

### Common Issues

**"Invalid login" error:**
- Ensure 2FA is enabled
- Use app password, not regular password
- Check email service configuration

**CORS errors:**
- Verify frontend URL in CORS configuration
- Check that email server is running

**Emails not sending:**
- Check email service credentials
- Verify internet connection
- Check spam folder for test emails

## Monitoring

Add logging and monitoring for production:
- Email delivery status
- Error rates and types
- Response times
- Queue status (for high volume)

## Future Enhancements

- 📧 Appointment reminder scheduling
- 📊 Email delivery analytics
- 🎨 Custom email template editor
- 📱 SMS notifications integration
- 🔄 Email queue for high volume
