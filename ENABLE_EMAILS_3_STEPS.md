# 📧 Enable Email Notifications - 3 Simple Steps

## Current Status
✅ Matching works perfectly (100% score!)
✅ In-app notifications work
❌ Email notifications need SMTP setup

## 3 Steps to Enable Emails

### Step 1: Get Gmail App Password (2 minutes)

1. Open: https://myaccount.google.com/apppasswords
2. You may need to enable 2-Step Verification first
3. Create app password:
   - App: Mail
   - Device: Windows Computer
4. Click "Generate"
5. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update backend/.env (1 minute)

Open the file: `backend/.env`

Find these lines (around line 20):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=demo@gmail.com
SMTP_PASS=demo
EMAIL_FROM=FindMe <noreply@findme.com>
```

Replace with your details:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=abcdefghijklmnop
EMAIL_FROM=FindMe <your-actual-email@gmail.com>
```

**Important:**
- Use your real Gmail address
- Use the 16-char App Password (remove spaces)
- Don't use your regular Gmail password!

### Step 3: Restart Backend (30 seconds)

In your backend terminal:
1. Press `Ctrl+C`
2. Type `npm start`
3. Wait for "Server running on port 5000"

## Test It!

### Quick Test:
```bash
cd backend
node test-email.js your-email@gmail.com
```

You should receive a test email!

### Real Test:
1. Create a match (post lost + found items)
2. Both users receive emails with chat link
3. Check your inbox (and spam folder)

## What the Email Looks Like

```
From: FindMe <your-email@gmail.com>
To: user@example.com
Subject: Match Found - FindMe

Hi John Doe,

We found a potential match for your lost item!

Click here to chat: http://localhost:3000/chat/abc-123-xyz

---
FindMe - Lost and Found Platform
```

## Troubleshooting

### Can't find App Passwords?
- Make sure 2-Step Verification is enabled first
- Go to: https://myaccount.google.com → Security → 2-Step Verification → App passwords

### "Invalid login" error?
- Double-check you're using App Password, not regular password
- Remove spaces from the 16-char password
- Make sure email address is correct

### Emails not arriving?
- Check spam/junk folder
- Run `node test-email.js` to verify setup
- Check backend logs for error messages

## Alternative: Mailtrap (No Real Emails)

If you want to test without sending real emails:

1. Sign up at https://mailtrap.io (free)
2. Get SMTP credentials from dashboard
3. Update `backend/.env`:
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your-mailtrap-username
   SMTP_PASS=your-mailtrap-password
   EMAIL_FROM=FindMe <test@findme.com>
   ```
4. Restart backend
5. Emails will appear in Mailtrap inbox (not real email)

## Summary

1. ✅ Get Gmail App Password
2. ✅ Update `backend/.env` with your credentials
3. ✅ Restart backend
4. ✅ Test with `node test-email.js`
5. ✅ Create a match - emails sent automatically!

---

**Ready?** Get your Gmail App Password and update the `.env` file! 🚀
