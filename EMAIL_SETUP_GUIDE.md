# 📧 Email Notification Setup Guide

## Current Status
✅ Email notification code is already implemented
❌ SMTP credentials are set to "demo" (not working)

## How Email Notifications Work

When a match is found, the system automatically sends emails to both users:
- **Lost item owner**: "We found a potential match for your lost item!"
- **Found item owner**: "Your found item matches someone's lost item!"

Both emails include a link to the chat room.

## Setup Options

### Option 1: Gmail SMTP (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. **Update backend/.env**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=FindMe <your-email@gmail.com>
```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up** at https://sendgrid.com (Free tier: 100 emails/day)
2. **Create API Key** in Settings → API Keys
3. **Update backend/.env**:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=FindMe <noreply@yourdomain.com>
```

### Option 3: Mailgun

1. **Sign up** at https://mailgun.com (Free tier: 5,000 emails/month)
2. **Get SMTP credentials** from Sending → Domain Settings
3. **Update backend/.env**:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
EMAIL_FROM=FindMe <noreply@your-domain.mailgun.org>
```

### Option 4: Mailtrap (Testing Only)

1. **Sign up** at https://mailtrap.io (Free)
2. **Get credentials** from Email Testing → Inboxes
3. **Update backend/.env**:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
EMAIL_FROM=FindMe <test@findme.com>
```

Note: Mailtrap doesn't send real emails - it captures them for testing.

## Quick Setup (Gmail Example)

1. Edit `backend/.env`:
```bash
# Replace these with your actual Gmail credentials
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # Your 16-char app password
EMAIL_FROM=FindMe <yourname@gmail.com>
```

2. Restart backend:
```bash
# In backend terminal: Ctrl+C
npm start
```

3. Test by creating a match - both users will receive emails!

## Email Template

The current email is simple text. Here's what users receive:

```
Subject: Match Found - FindMe

Hi [User Name],

We found a potential match for your lost item!

Click here to chat: http://localhost:3000/chat/[chat-room-id]

---
FindMe - Lost and Found Platform
```

## Troubleshooting

### "Invalid login" error
- Gmail: Make sure you're using an App Password, not your regular password
- Enable 2FA first, then generate App Password
- Remove spaces from the App Password

### "Connection timeout" error
- Check SMTP_HOST and SMTP_PORT are correct
- Some networks block port 587 - try port 465 with `secure: true`

### Emails not arriving
- Check spam folder
- Verify email address is correct in database
- Check backend logs for errors
- Try Mailtrap first to confirm emails are being sent

### "Self-signed certificate" error
Add to notificationService.js transporter config:
```javascript
tls: {
  rejectUnauthorized: false
}
```

## Testing Email Notifications

1. Set up SMTP credentials (use Mailtrap for safe testing)
2. Restart backend
3. Create two test accounts with real email addresses
4. Post matching items (one lost, one found)
5. Check both email inboxes for match notifications

## Current Implementation

The notification service sends:
- ✅ In-app notifications (stored in database)
- ✅ Email notifications (via SMTP)
- ⚠️ Push notifications (requires Firebase setup)

All three run in parallel, so if email fails, in-app notifications still work.

## Next Steps

1. Choose an email provider (Gmail for testing, SendGrid/Mailgun for production)
2. Get SMTP credentials
3. Update backend/.env
4. Restart backend
5. Test with a match

Would you like me to help you set up a specific email provider?
