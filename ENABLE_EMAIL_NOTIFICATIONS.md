# 📧 Enable Email Notifications - Quick Start

## Current Status
✅ Email notification code is implemented and working
✅ Fixed missing Match model import
❌ SMTP credentials need to be configured

## What Happens When a Match is Found

The system automatically sends:
1. **In-app notification** (already working ✅)
2. **Email notification** (needs SMTP setup ❌)
3. **Push notification** (needs Firebase setup ❌)

## Quick Setup (5 Minutes)

### Option 1: Gmail (Easiest for Testing)

#### Step 1: Get Gmail App Password
1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" → "2-Step Verification" (enable if not already)
3. Scroll down to "App passwords"
4. Select "Mail" and "Windows Computer"
5. Click "Generate"
6. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")

#### Step 2: Update backend/.env
Open `backend/.env` and replace these lines:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
EMAIL_FROM=FindMe <your-email@gmail.com>
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with your 16-character app password (no spaces)

#### Step 3: Restart Backend
In your backend terminal:
- Press `Ctrl+C` to stop
- Run `npm start` to restart

#### Step 4: Test Email
```bash
cd backend
node test-email.js your-email@gmail.com
```

You should receive a test email!

### Option 2: Mailtrap (Safe Testing - No Real Emails)

Perfect for testing without sending real emails!

1. Sign up at https://mailtrap.io (free)
2. Go to "Email Testing" → "Inboxes" → "My Inbox"
3. Copy the SMTP credentials
4. Update `backend/.env`:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
EMAIL_FROM=FindMe <test@findme.com>
```
5. Restart backend
6. Create a match - emails will appear in Mailtrap inbox (not real inboxes)

## Email Template

When a match is found, users receive:

**Subject:** Match Found - FindMe

**Body:**
```
Hi [User Name],

We found a potential match for your lost item!

Click here to chat: http://localhost:3000/chat/[chat-room-id]

---
FindMe - Lost and Found Platform
```

## Test the Full Flow

1. **Setup SMTP** (follow steps above)
2. **Restart backend**
3. **Create two test accounts** with real email addresses:
   - user1@gmail.com
   - user2@gmail.com
4. **Post matching items**:
   - User 1: Post LOST item
   - User 2: Post FOUND item (same category, similar description)
5. **Check emails** - Both users should receive match notifications!

## Verify Email Configuration

Run the test script:
```bash
cd backend
node test-email.js
```

This will:
- ✅ Verify SMTP connection
- ✅ Send a test email
- ✅ Confirm configuration is working

## Troubleshooting

### "Invalid login" Error
- **Gmail**: Make sure you're using App Password, not your regular password
- Enable 2-Factor Authentication first
- Remove spaces from App Password

### "Connection refused" Error
- Check SMTP_HOST and SMTP_PORT
- Try port 465 instead of 587
- Check firewall/antivirus settings

### Emails Not Arriving
- Check spam/junk folder
- Verify email address in user account
- Run `node test-email.js` to test configuration
- Check backend logs for errors

### "Self-signed certificate" Error
This is common with some SMTP providers. The code already handles this, but if you still see it, the email should still send.

## Production Recommendations

For production, use a dedicated email service:

1. **SendGrid** (Free: 100 emails/day)
   - https://sendgrid.com
   - Reliable, good deliverability
   
2. **Mailgun** (Free: 5,000 emails/month)
   - https://mailgun.com
   - Easy setup, good for transactional emails

3. **AWS SES** (Very cheap, $0.10 per 1,000 emails)
   - https://aws.amazon.com/ses
   - Best for high volume

## Current Implementation Details

The notification service (`backend/src/services/notificationService.js`) sends emails when:
- ✅ A match is found between lost and found items
- ✅ Both users receive separate emails
- ✅ Emails include chat room link
- ✅ Errors are logged but don't break the matching process

## Next Steps

1. Choose email provider (Gmail for quick testing)
2. Get SMTP credentials
3. Update `backend/.env`
4. Restart backend: `Ctrl+C` then `npm start`
5. Test: `node test-email.js`
6. Create a match and check emails!

---

**Need help?** Run `node test-email.js` to diagnose email configuration issues.
