# Deploy FindMe - Quick Start Guide 🚀

## Fastest Deployment: Render (Free Tier Available)

This guide will get your app live in ~30 minutes using Render's free tier.

## Prerequisites Checklist

Before deploying, you need accounts for:

- [ ] **GitHub** - Your code repository
- [ ] **Render** - Hosting platform (https://render.com)
- [ ] **MongoDB Atlas** - Database (https://mongodb.com/atlas)
- [ ] **Cloudinary** - Image storage (https://cloudinary.com)
- [ ] **Firebase** - Push notifications (https://firebase.google.com)
- [ ] **Google Cloud** - Speech-to-Text (https://console.cloud.google.com)
- [ ] **Gmail** - Email notifications (or any SMTP provider)

## Step-by-Step Deployment

### Step 1: Push to GitHub (If not done)

```bash
git remote add origin https://github.com/YOUR_USERNAME/findme.git
git push -u origin main
```

### Step 2: Set Up MongoDB Atlas (5 minutes)

1. Go to https://mongodb.com/atlas
2. Sign up / Log in
3. Create a **FREE** cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/findme?retryWrites=true&w=majority
   ```
6. Save this - you'll need it later!

### Step 3: Set Up Cloudinary (3 minutes)

1. Go to https://cloudinary.com
2. Sign up for FREE account
3. Go to Dashboard
4. Copy these values:
   - Cloud Name
   - API Key
   - API Secret
5. Save these!

### Step 4: Set Up Firebase (5 minutes)

1. Go to https://console.firebase.google.com
2. Create new project
3. Enable **Cloud Messaging**
4. Go to Project Settings → Service Accounts
5. Click "Generate new private key" → Download JSON
6. Go to Project Settings → General → Your apps
7. Add Web App → Copy config values
8. Save all these!

### Step 5: Set Up Google Cloud Speech-to-Text (5 minutes)

1. Go to https://console.cloud.google.com
2. Create new project or use existing
3. Enable "Cloud Speech-to-Text API"
4. Go to IAM & Admin → Service Accounts
5. Create Service Account
6. Grant "Cloud Speech Client" role
7. Create Key (JSON) → Download
8. Save this JSON file!

### Step 6: Deploy Backend on Render (5 minutes)

1. Go to https://render.com → Sign up/Login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `findme-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free

5. Add Environment Variables (click "Advanced"):

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-random-string-32-chars>
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
AI_SERVICE_URL=<will-add-after-ai-service-deployed>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-gmail>
SMTP_PASS=<your-gmail-app-password>
EMAIL_FROM=FindMe <noreply@findme.com>
FRONTEND_URL=<will-add-after-frontend-deployed>
FIREBASE_PROJECT_ID=<from-firebase-json>
FIREBASE_PRIVATE_KEY=<from-firebase-json>
FIREBASE_CLIENT_EMAIL=<from-firebase-json>
```

6. Click "Create Web Service"
7. Wait for deployment (~5 minutes)
8. Copy the URL (e.g., `https://findme-backend.onrender.com`)

### Step 7: Deploy AI Service on Render (5 minutes)

1. Click "New +" → "Web Service"
2. Connect same GitHub repository
3. Configure:
   - **Name**: `findme-ai-service`
   - **Root Directory**: `ai-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app`
   - **Instance Type**: Free

4. Add Environment Variables:

```env
PORT=5001
GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/google-credentials.json
```

5. Add Secret File:
   - Click "Advanced" → "Secret Files"
   - Filename: `/etc/secrets/google-credentials.json`
   - Contents: Paste your Google Cloud JSON key content

6. Click "Create Web Service"
7. Copy the URL (e.g., `https://findme-ai-service.onrender.com`)

### Step 8: Update Backend Environment

1. Go back to your backend service on Render
2. Environment → Edit
3. Update these variables:
   ```env
   AI_SERVICE_URL=https://findme-ai-service.onrender.com
   ```
4. Save changes (will auto-redeploy)

### Step 9: Deploy Frontend on Render (5 minutes)

1. Click "New +" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - **Name**: `findme-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables:

```env
REACT_APP_API_URL=https://findme-backend.onrender.com/api
REACT_APP_SOCKET_URL=https://findme-backend.onrender.com
REACT_APP_FIREBASE_API_KEY=<from-firebase-config>
REACT_APP_FIREBASE_AUTH_DOMAIN=<from-firebase-config>
REACT_APP_FIREBASE_PROJECT_ID=<from-firebase-config>
REACT_APP_FIREBASE_STORAGE_BUCKET=<from-firebase-config>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<from-firebase-config>
REACT_APP_FIREBASE_APP_ID=<from-firebase-config>
REACT_APP_FIREBASE_VAPID_KEY=<from-firebase-messaging>
```

5. Click "Create Static Site"
6. Copy the URL (e.g., `https://findme.onrender.com`)

### Step 10: Final Backend Update

1. Go back to backend service
2. Update environment variable:
   ```env
   FRONTEND_URL=https://findme.onrender.com
   ```
3. Save (will redeploy)

### Step 11: Test Your Deployment! 🎉

1. Visit your frontend URL
2. Register a new account
3. Post a lost item
4. Post a found item
5. Check for matches!

## Important Notes

### Free Tier Limitations

- **Render Free**: Services sleep after 15 min of inactivity (first request takes ~30s to wake up)
- **MongoDB Atlas Free**: 512MB storage
- **Cloudinary Free**: 25GB storage, 25GB bandwidth/month

### Generate Secure JWT Secret

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Gmail App Password

1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use this in SMTP_PASS

### Firebase Private Key Format

The private key in the JSON has `\n` characters. In Render, paste it as-is with the newlines.

## Troubleshooting

### Backend won't start
- Check MongoDB connection string (whitelist all IPs: 0.0.0.0/0)
- Verify all environment variables are set
- Check Render logs for errors

### AI Service timeout
- Increase timeout in start command: `--timeout 300`
- First request takes longer (model loading)

### Frontend can't connect
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running

### Socket.io connection fails
- Check REACT_APP_SOCKET_URL
- Verify backend allows frontend URL in CORS

## Alternative Deployment Options

### Vercel (Frontend Only)
- Faster than Render for static sites
- Better for React apps
- Free tier with custom domains

### Railway (All Services)
- Similar to Render
- $5/month credit on free tier
- Easier environment variable management

### Heroku (All Services)
- No longer has free tier
- $7/month per service minimum

### DigitalOcean App Platform
- $5/month per service
- More control than Render

## Cost Optimization

### Free Tier (Total: $0/month)
- Render Free (3 services)
- MongoDB Atlas Free (512MB)
- Cloudinary Free (25GB)
- Firebase Free (10GB/month)
- Google Cloud Free ($300 credit)

### Paid Tier (Total: ~$21/month)
- Render Starter ($7 × 3 = $21)
- MongoDB Atlas M10 ($0.08/hr = ~$57/month)
- Cloudinary Plus ($99/month)

## Monitoring Your Deployment

### Check Service Health

```bash
# Backend
curl https://findme-backend.onrender.com/health

# AI Service
curl https://findme-ai-service.onrender.com/health
```

### View Logs

1. Go to Render Dashboard
2. Click on service
3. Click "Logs" tab
4. Monitor real-time logs

## Next Steps

1. Set up custom domain
2. Enable HTTPS (automatic on Render)
3. Set up monitoring (UptimeRobot)
4. Configure backups
5. Add analytics
6. Set up error tracking (Sentry)

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Firebase Docs: https://firebase.google.com/docs

---

**Your app is now live! Share the URL and start helping people find their lost items!** 🎉
