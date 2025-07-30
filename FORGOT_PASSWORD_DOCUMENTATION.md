# Forgot Password with OTP

This feature allows users to reset their password securely using a one-time password (OTP) sent to their registered email address.

## How It Works

### 1. Forgot Password Request
- The user enters their email address and requests a password reset
- An OTP is generated and sent to their email
- The OTP and its expiration time are stored in the database

### 2. OTP Verification
- The user enters the OTP they received
- The system verifies if the OTP is valid and has not expired
- Once verified, the user is allowed to set a new password

### 3. Password Reset
- The user enters and confirms their new password
- The password is updated in the database
- The OTP is cleared from the database

## API Endpoints

- `POST /auth/forgot-password` - Request an OTP for password reset
- `POST /auth/verify-otp` - Verify the OTP
- `POST /auth/reset-password` - Reset the password with a new one

## Database Schema Changes

Added to User model:
```javascript
resetPasswordOTP: {
  type: String,
},
resetPasswordOTPExpires: {
  type: Date,
},
isOTPVerified: {
  type: Boolean,
  default: false,
}
```

## Environment Variables

You need to add the following to your `.env` file:
```
# Gmail Configuration for OTP
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

**Note**: You need to generate an "App Password" from your Google Account settings for `GMAIL_PASS`.

## Usage Examples

### 1. Request OTP
```bash
POST /auth/forgot-password
{
  "email": "user@example.com"
}
# Response: OTP sent to your email
```

### 2. Verify OTP
```bash
POST /auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
# Response: OTP verified successfully
```

### 3. Reset Password
```bash
POST /auth/reset-password
{
  "email": "user@example.com",
  "newPassword": "new-secure-password"
}
# Response: Password reset successfully
```

## Security Features

- **Secure OTP Generation**: Uses `crypto` for random OTPs
- **OTP Expiration**: OTPs are valid for only 10 minutes
- **Verified OTP Check**: Password can only be reset after successful OTP verification
- **Email Confirmation**: Ensures the user has access to the registered email account
