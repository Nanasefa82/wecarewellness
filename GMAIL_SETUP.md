# Gmail Email Service Setup Guide

This guide will help you configure Gmail as the email service for We Care Wellness appointment confirmations.

## 📧 Gmail Account Setup

### Step 1: Prepare Gmail Account
1. **Use a dedicated Gmail account** (recommended: `wecarewellness@gmail.com` or similar)
2. **Enable 2-Factor Authentication**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification" 
   - Follow the setup process

### Step 2: Generate App Password
1. **Access App Passwords**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification"
   - Scroll down and click "App passwords"

2. **Create Mail App Password**:
   - Select "Mail" from the dropdown
   - Click "Generate"
   - **Copy the 16-character password** (format: `xxxx xxxx xxxx xxxx`)
   - **Important**: Use this app password, NOT your regular Gmail password

## 🚀 Production Deployment Options

### Option A: Heroku Deployment (Recommended)

1. **Deploy Email Server to Heroku**:
```bash
cd email-server
git init
git add .
git commit -m "Initial email server"
heroku create wecarewellness-email
git push heroku main
```

2. **Set Heroku Environment Variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set FROM_EMAIL=noreply@wecarewellnessllc.com
heroku config:set EMAIL_USER=wecarewellness@gmail.com
heroku config:set EMAIL_PASSWORD="your-16-character-app-password"
```

3. **Update React App Environment**:
```bash
# In your main project .env.local file:
VITE_EMAIL_API_URL=https://wecarewellness-email.herokuapp.com/api/email
```

### Option B: Railway Deployment

1. **Deploy to Railway**:
```bash
cd email-server
npm install -g @railway/cli
railway login
railway init
railway up
```

2. **Set Railway Environment Variables**:
```bash
railway variables set NODE_ENV=production
railway variables set FROM_EMAIL=noreply@wecarewellnessllc.com
railway variables set EMAIL_USER=wecarewellness@gmail.com
railway variables set EMAIL_PASSWORD="your-16-character-app-password"
```

### Option C: Render Deployment

1. **Create Render Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

2. **Set Environment Variables in Render**:
   - `NODE_ENV` = `production`
   - `FROM_EMAIL` = `noreply@wecarewellnessllc.com`
   - `EMAIL_USER` = `wecarewellness@gmail.com`
   - `EMAIL_PASSWORD` = `your-16-character-app-password`

## 🧪 Testing the Setup

### Local Testing
1. **Start Email Server**:
```bash
cd email-server
cp .env.example .env
# Edit .env with your Gmail credentials
npm install
npm run dev
```

2. **Test Email Endpoint**:
```bash
curl -X POST http://localhost:3001/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test Email</h1><p>This is a test.</p>"
  }'
```

### Production Testing
1. **Test Deployed Service**:
```bash
curl -X POST https://your-email-service.herokuapp.com/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "subject": "Production Test",
    "html": "<h1>Production Email Test</h1>"
  }'
```

## 🔧 Configuration Files

### React App (.env.local)
```env
VITE_SUPABASE_URL=https://tfpkkleonhhzexbmbped.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_EMAIL_API_URL=https://your-email-service.herokuapp.com/api/email
VITE_FROM_EMAIL=noreply@wecarewellnessllc.com
```

### Email Server (.env)
```env
NODE_ENV=production
PORT=3001
FROM_EMAIL=noreply@wecarewellnessllc.com
EMAIL_USER=wecarewellness@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

## 🛡️ Security Best Practices

1. **Never commit .env files** to version control
2. **Use app passwords**, not regular Gmail passwords
3. **Rotate app passwords** periodically
4. **Monitor email usage** for suspicious activity
5. **Set up email alerts** for failed authentication attempts

## 📊 Monitoring & Troubleshooting

### Common Issues

**"Invalid login" error**:
- Verify 2FA is enabled on Gmail
- Ensure you're using the app password, not regular password
- Check that the Gmail account isn't locked

**"Authentication failed" error**:
- Regenerate the app password
- Verify the email address is correct
- Check Gmail security settings

**Emails going to spam**:
- Set up SPF/DKIM records for your domain
- Use a consistent "From" email address
- Include unsubscribe links in emails

### Monitoring Commands
```bash
# Check Heroku logs
heroku logs --tail -a wecarewellness-email

# Test health endpoint
curl https://your-email-service.herokuapp.com/health
```

## 🎯 Next Steps

1. ✅ Set up Gmail account with 2FA
2. ✅ Generate app password
3. ✅ Deploy email server to chosen platform
4. ✅ Configure environment variables
5. ✅ Update React app configuration
6. ✅ Test email functionality
7. ✅ Monitor email delivery

Your Gmail email service will now handle:
- ✅ Patient appointment confirmations
- ✅ Doctor appointment notifications  
- ✅ Professional HTML email templates
- ✅ Reliable email delivery through Gmail SMTP
