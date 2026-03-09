# ✏️ How to Edit backend/.env File

## File Location
```
Findmeai/
  └── backend/
      └── .env  ← Edit this file
```

## What to Change

### BEFORE (Current - Not Working):
```env
# Email - Optional for now
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=demo@gmail.com          ← Change this
SMTP_PASS=demo                     ← Change this
EMAIL_FROM=FindMe <noreply@findme.com>  ← Change this
```

### AFTER (Your Real Credentials):
```env
# Email - Working configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com       ← Your Gmail
SMTP_PASS=abcdefghijklmnop         ← Your 16-char App Password
EMAIL_FROM=FindMe <yourname@gmail.com>  ← Your Gmail
```

## Example

If your Gmail is `john.doe@gmail.com` and App Password is `wxyz abcd 1234 5678`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john.doe@gmail.com
SMTP_PASS=wxyzabcd12345678
EMAIL_FROM=FindMe <john.doe@gmail.com>
```

**Note:** Remove spaces from App Password!

## How to Edit

### Option 1: VS Code (Recommended)
1. Open VS Code
2. Open folder: `Findmeai`
3. Navigate to: `backend/.env`
4. Edit the 3 lines
5. Save (Ctrl+S)

### Option 2: Notepad
1. Open File Explorer
2. Go to: `C:\Users\srivi\Findmeai\backend`
3. Right-click `.env`
4. Open with Notepad
5. Edit the 3 lines
6. Save

### Option 3: Command Line
```bash
cd backend
notepad .env
```

## After Editing

1. **Save the file**
2. **Restart backend:**
   ```bash
   # In backend terminal
   Ctrl+C
   npm start
   ```
3. **Test:**
   ```bash
   node test-email.js
   ```

## Complete .env File Reference

Your complete `backend/.env` should look like this:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

MONGODB_URI=mongodb://localhost:27017/findme

JWT_SECRET=findme-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRE=7d

BCRYPT_SALT_ROUNDS=12

# Cloudinary - Optional for now
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo

AI_SERVICE_URL=http://localhost:5001

# Email - UPDATE THESE 3 LINES
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com     ← CHANGE
SMTP_PASS=your-app-password        ← CHANGE
EMAIL_FROM=FindMe <your-email@gmail.com>  ← CHANGE

# Firebase - Optional for now
FIREBASE_PROJECT_ID=demo
FIREBASE_PRIVATE_KEY=demo
FIREBASE_CLIENT_EMAIL=demo@demo.com

IMAGE_SIMILARITY_THRESHOLD=0.001
TEXT_SIMILARITY_THRESHOLD=0.70
CROSS_MODAL_THRESHOLD=0.65

MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,audio/webm,audio/wav
```

## Verification

After editing and restarting, you should see in backend logs:
```
Server running on port 5000
MongoDB Connected: localhost
```

No email errors should appear.

## Test Command

```bash
cd backend
node test-email.js your-email@gmail.com
```

Expected output:
```
📧 Testing Email Configuration...
✅ SMTP connection successful!
📨 Sending test email to: your-email@gmail.com
✅ Test email sent successfully!
📬 Check your inbox (and spam folder) for the test email.
```

---

**Need help?** Just update those 3 lines in `backend/.env` and restart! 📧
