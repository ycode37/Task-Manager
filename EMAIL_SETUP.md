# Email OTP Setup Guide

## Current Issue
The OTP system shows "OTP sent" but no email is actually being sent because the system is running in **development mode**.

## Quick Fix - Development Mode
The system is currently configured to show OTP codes in the **server console** instead of sending emails. This is normal for development.

### How to see the OTP:
1. When you request "Forgot Password" from the frontend
2. Check your **backend server console/terminal**
3. Look for a section like this:
```
🧪 === EMAIL SIMULATION (Development Mode) ===
📧 To: user@example.com
📋 Subject: Password Reset OTP - Task Management System
🔢 OTP CODE: ====================
🎯 123456
================================
💡 Use this OTP in your application!
```

## For Production - Real Email Setup

### Step 1: Get Gmail App Password
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Copy the 16-character password

### Step 2: Update .env file
Replace the placeholder values in `backend/.env`:
```env
GMAIL_USER=your-actual-email@gmail.com
GMAIL_PASS=your-16-character-app-password
DEVELOPMENT_MODE=false
```

### Step 3: Restart the server
```bash
cd backend
npm run server
```

## Testing the System

### Test in Development Mode (Console OTP)
```bash
cd backend
node test-forgot-password.js
```

### Test API directly
```bash
curl -X POST http://localhost:4000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Troubleshooting

### Common Issues:
1. **"OTP sent but no email"** - You're in development mode (check console)
2. **"Email credentials not configured"** - Update .env with real Gmail credentials
3. **"Authentication failed"** - Use App Password, not regular Gmail password
4. **"Invalid or expired OTP"** - OTP expires in 15 minutes

### Environment Variables:
- `DEVELOPMENT_MODE=true` - Shows OTP in console (for development)
- `DEVELOPMENT_MODE=false` - Sends real emails (for production)
- `GMAIL_USER` - Your Gmail address
- `GMAIL_PASS` - Your Gmail App Password (not regular password)

## Security Notes
- Never commit real Gmail credentials to version control
- Use environment variables for sensitive data
- App passwords are more secure than regular passwords
- OTP expires automatically for security
