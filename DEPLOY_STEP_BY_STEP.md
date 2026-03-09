# Deploy FindMe - Interactive Step-by-Step Guide

Follow this guide exactly. I'll walk you through each step with screenshots descriptions and exact clicks.

## ⏱️ Total Time: ~45 minutes

---

## STEP 1: MongoDB Atlas Setup (5 minutes)

### 1.1 Create Account
1. Open browser → Go to **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google/Email
3. Verify email if needed

### 1.2 Create Free Cluster
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** (should be selected by default)
3. Provider: **AWS** (or any)
4. Region: Choose closest to you
5. Cluster Name: **findme-cluster**
6. Click **"Create"**
7. Wait 1-3 minutes for cluster creation

### 1.3 Create Database User
1. Security Quickstart appears
2. Authentication Method: **Username and Password**
3. Username: `findmeadmin`
4. Password: Click **"Autogenerate Secure Password"** → COPY IT!
5. Click **"Create User"**

### 1.4 Add IP Address
1. Where would you like to connect from?
2. Click **"Add My Current IP Address"**
3. Also click **"Add a Different IP Address"**
4. IP Address: `0.0.0.0/0` (allows all IPs - for deployment)
5. Description: `Allow all`
6. Click **"Add Entry"**
7. Click **"Finish and Close"**

### 1.5 Get Connection String
1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://findmeadmin:<password>@findme-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you copied earlier
6. Add database name: Change `/?retryWrites` to `/findme?retryWrites`
7. **SAVE THIS STRING** - You'll need it!

**✅ MongoDB Done! Save your connection string.**

---

## STEP 2: Cloudinary Setup (3 minutes)

### 2.1 Create Account
1. Go to **https://cloudinary.com/users/register_free**
2. Sign up with Google/Email
3. Verify email

### 2.2 Get Credentials
1. You'll land on Dashboard automatically
2. Look for **"Account Details"** section
3. Copy these three values:
   - **Cloud Name**: (e.g., `dxxxxx`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: Click **"Reveal"** → Copy
4. **SAVE THESE** - You'll need them!

**✅ Cloudinary Done! Save: Cloud Name, API Key, API Secret**

---

## STEP 3: Firebase Setup (7 minutes)

### 3.1 Create Project
1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** or **"Create a project"**
3. Project name: `findme-app`
4. Click **"Continue"**
5. Google Analytics: **Disable** (or enable if you want)
6. Click **"Create project"**
7. Wait ~30 seconds
8. Click **"Continue"**

### 3.2 Add Web App
1. Click the **Web icon** (</>) to add Firebase to your web app
2. App nickname: `FindMe Web`
3. **Check** "Also set up Firebase Hosting"
4. Click **"Register app"**
5. You'll see Firebase SDK config - **COPY THIS**:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "findme-app.firebaseapp.com",
     projectId: "findme-app",
     storageBucket: "findme-app.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
6. **SAVE THESE VALUES**
7. Click **"Continue to console"**

### 3.3 Enable Cloud Messaging
1. In left sidebar, click **"Build"** → **"Cloud Messaging"**
2. Click **"Get started"** (if shown)
3. Scroll down to **"Web configuration"**
4. Click **"Generate key pair"** under "Web Push certificates"
5. **COPY the VAPID key** (starts with `B...`)
6. **SAVE THIS**

### 3.4 Get Service Account Key
1. Click **⚙️ (Settings icon)** → **"Project settings"**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"**
5. A JSON file downloads - **SAVE THIS FILE**
6. Open the JSON file and note:
   - `project_id`
   - `private_key`
   - `client_email`

**✅ Firebase Done! Save: Config values, VAPID key, Service account JSON**

---

## STEP 4: Google Cloud Speech-to-Text (5 minutes)

### 4.1 Create/Select Project
1. Go to **https://console.cloud.google.com**
2. Click project dropdown (top left)
3. Click **"New Project"**
4. Project name: `findme-speech`
5. Click **"Create"**
6. Wait for creation, then select the project

### 4.2 Enable Speech-to-Text API
1. In search bar (top), type: **"Speech-to-Text API"**
2. Click **"Cloud Speech-to-Text API"**
3. Click **"Enable"**
4. Wait ~30 seconds

### 4.3 Enable Billing (Required - Free $300 credit)
1. Click **"Enable Billing"** if prompted
2. Follow prompts to add payment method
3. You get **$300 free credit** (won't be charged unless you exceed it)

### 4.4 Create Service Account
1. In left menu, click **"IAM & Admin"** → **"Service Accounts"**
2. Click **"Create Service Account"**
3. Service account name: `findme-speech-service`
4. Click **"Create and Continue"**
5. Role: Select **"Cloud Speech Client"**
6. Click **"Continue"**
7. Click **"Done"**

### 4.5 Create Key
1. Find your service account in the list
2. Click the **three dots (⋮)** → **"Manage keys"**
3. Click **"Add Key"** → **"Create new key"**
4. Key type: **JSON**
5. Click **"Create"**
6. JSON file downloads - **SAVE THIS FILE**

**✅ Google Cloud Done! Save: Service account JSON file**

---

## STEP 5: Gmail App Password (2 minutes)

### 5.1 Enable 2-Factor Authentication
1. Go to **https://myaccount.google.com/security**
2. Find **"2-Step Verification"**
3. If not enabled, click and enable it
4. Follow the prompts

### 5.2 Generate App Password
1. Go to **https://myaccount.google.com/apppasswords**
2. App name: `FindMe Email`
3. Click **"Create"**
4. **COPY the 16-character password** (e.g., `abcd efgh ijkl mnop`)
5. Remove spaces: `abcdefghijklmnop`
6. **SAVE THIS**

**✅ Gmail Done! Save: Your email and app password**

---

## STEP 6: Generate JWT Secret (1 minute)

### Option A: Using PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Option B: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option C: Online Generator
Go to: **https://generate-secret.vercel.app/32**

**COPY the generated secret** (should be 32+ characters)

**✅ JWT Secret Done! Save it**

---

## STEP 7: Prepare Environment Variables (5 minutes)

Create a text file with all your values:

```env
# MongoDB
MONGODB_URI=mongodb+srv://findmeadmin:YOUR_PASSWORD@findme-cluster.xxxxx.mongodb.net/findme?retryWrites=true&w=majority

# JWT
JWT_SECRET=YOUR_GENERATED_SECRET_HERE

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password

# Firebase (from config)
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=findme-app.firebaseapp.com
FIREBASE_PROJECT_ID=findme-app
FIREBASE_STORAGE_BUCKET=findme-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
FIREBASE_VAPID_KEY=BPxxxxx...

# Firebase Admin (from service account JSON)
FIREBASE_PROJECT_ID=findme-app
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@findme-app.iam.gserviceaccount.com
```

**✅ All credentials ready!**

---

## STEP 8: Deploy on Render (15 minutes)

### 8.1 Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access your repositories

### 8.2 Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect repository: **findmeai**
3. Configure:
   - **Name**: `findme-backend`
   - **Region**: Choose closest
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: `Free`

4. Click **"Advanced"** → Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<paste your MongoDB connection string>
   JWT_SECRET=<paste your JWT secret>
   JWT_EXPIRE=7d
   BCRYPT_SALT_ROUNDS=12
   CLOUDINARY_CLOUD_NAME=<paste>
   CLOUDINARY_API_KEY=<paste>
   CLOUDINARY_API_SECRET=<paste>
   AI_SERVICE_URL=https://findme-ai.onrender.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your gmail>
   SMTP_PASS=<your app password>
   EMAIL_FROM=FindMe <noreply@findme.com>
   FRONTEND_URL=https://findme-frontend.onrender.com
   FIREBASE_PROJECT_ID=<paste>
   FIREBASE_PRIVATE_KEY=<paste entire private key with \n>
   FIREBASE_CLIENT_EMAIL=<paste>
   ```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **COPY the URL** (e.g., `https://findme-backend.onrender.com`)

### 8.3 Deploy AI Service

1. Click **"New +"** → **"Web Service"**
2. Connect same repository
3. Configure:
   - **Name**: `findme-ai`
   - **Region**: Same as backend
   - **Root Directory**: `ai-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app`
   - **Instance Type**: `Free`

4. Click **"Advanced"** → Add Secret File:
   - **Filename**: `/etc/secrets/google-credentials.json`
   - **Contents**: Paste entire Google Cloud JSON file content

5. Add Environment Variable:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/google-credentials.json
   ```

6. Click **"Create Web Service"**
7. Wait 5-10 minutes
8. **COPY the URL** (e.g., `https://findme-ai.onrender.com`)

### 8.4 Update Backend with AI Service URL

1. Go back to **findme-backend** service
2. Click **"Environment"** in left sidebar
3. Find `AI_SERVICE_URL`
4. Update to: `https://findme-ai.onrender.com` (your actual AI service URL)
5. Click **"Save Changes"**
6. Service will auto-redeploy (~2 minutes)

### 8.5 Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect same repository
3. Configure:
   - **Name**: `findme-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://findme-backend.onrender.com/api
   REACT_APP_SOCKET_URL=https://findme-backend.onrender.com
   REACT_APP_FIREBASE_API_KEY=<paste>
   REACT_APP_FIREBASE_AUTH_DOMAIN=<paste>
   REACT_APP_FIREBASE_PROJECT_ID=<paste>
   REACT_APP_FIREBASE_STORAGE_BUCKET=<paste>
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<paste>
   REACT_APP_FIREBASE_APP_ID=<paste>
   REACT_APP_FIREBASE_VAPID_KEY=<paste>
   ```

5. Click **"Create Static Site"**
6. Wait 3-5 minutes
7. **COPY the URL** (e.g., `https://findme-frontend.onrender.com`)

### 8.6 Final Backend Update

1. Go back to **findme-backend**
2. Click **"Environment"**
3. Update `FRONTEND_URL` to your frontend URL
4. Click **"Save Changes"**
5. Wait for redeploy

**✅ All services deployed!**

---

## STEP 9: Test Your Deployment (5 minutes)

1. Open your frontend URL in browser
2. Click **"Register"**
3. Create account with email/password
4. Log in
5. Click **"Post Item"**
6. Post a **Lost** item with image
7. Post a **Found** item with similar image
8. Wait 30 seconds
9. Check **"Matches"** page
10. Click **"Chat"** on a match
11. Send a message

### If everything works:
✅ Registration works
✅ Login works
✅ Can post items
✅ Images upload
✅ Matches appear
✅ Chat works

**🎉 DEPLOYMENT COMPLETE!**

---

## Your Live URLs

```
Frontend: https://findme-frontend.onrender.com
Backend: https://findme-backend.onrender.com
AI Service: https://findme-ai.onrender.com
```

---

## Troubleshooting

### Backend won't start
- Check Render logs: Service → Logs tab
- Verify MongoDB connection string
- Check all environment variables are set

### AI Service timeout
- First request takes 30-60s (model loading)
- Check Google Cloud credentials are correct
- Verify secret file path is correct

### Frontend can't connect
- Verify REACT_APP_API_URL is correct
- Check backend is running (visit /health endpoint)
- Check browser console for errors

### No matches appearing
- Wait 30-60 seconds after posting items
- Check backend logs for errors
- Verify AI service is running

---

## Important Notes

- **Free tier services sleep after 15 min inactivity**
- **First request after sleep takes ~30 seconds**
- **MongoDB free tier: 512MB storage limit**
- **Cloudinary free tier: 25GB/month bandwidth**

---

## Next Steps

1. Share your app URL with friends
2. Set up custom domain (optional)
3. Monitor usage in Render dashboard
4. Set up uptime monitoring (UptimeRobot)
5. Add analytics (Google Analytics)

**Congratulations! Your FindMe app is live!** 🚀
