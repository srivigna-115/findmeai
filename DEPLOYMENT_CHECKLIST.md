# Deployment Checklist ✅

Use this checklist to ensure you have everything ready before deploying.

## Pre-Deployment Setup

### 1. Accounts Created
- [ ] GitHub account (code repository)
- [ ] Render account (hosting) - https://render.com
- [ ] MongoDB Atlas account (database) - https://mongodb.com/atlas
- [ ] Cloudinary account (media storage) - https://cloudinary.com
- [ ] Firebase account (push notifications) - https://firebase.google.com
- [ ] Google Cloud account (speech-to-text) - https://console.cloud.google.com
- [ ] Gmail or SMTP provider (email notifications)

### 2. Code Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or Render has access
- [ ] All sensitive files in .gitignore
- [ ] README.md is complete

### 3. MongoDB Atlas Setup
- [ ] Cluster created (M0 Free tier)
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0 for all IPs)
- [ ] Connection string copied
- [ ] Test connection successful

### 4. Cloudinary Setup
- [ ] Account created
- [ ] Cloud name noted
- [ ] API key copied
- [ ] API secret copied
- [ ] Upload preset configured (optional)

### 5. Firebase Setup
- [ ] Project created
- [ ] Cloud Messaging enabled
- [ ] Service account key downloaded (JSON)
- [ ] Web app created
- [ ] Config values copied (apiKey, authDomain, etc.)
- [ ] VAPID key generated for web push

### 6. Google Cloud Setup
- [ ] Project created
- [ ] Speech-to-Text API enabled
- [ ] Billing enabled (free tier available)
- [ ] Service account created
- [ ] Service account key downloaded (JSON)
- [ ] Permissions granted (Cloud Speech Client)

### 7. Email Setup
- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] SMTP credentials tested

### 8. Environment Variables Prepared
- [ ] JWT_SECRET generated (32+ characters)
- [ ] All MongoDB credentials ready
- [ ] All Cloudinary credentials ready
- [ ] All Firebase credentials ready
- [ ] Google Cloud JSON key ready
- [ ] SMTP credentials ready

## Deployment Steps

### Backend Deployment
- [ ] Service created on Render
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `node src/server.js`
- [ ] All environment variables added
- [ ] Health check path set: `/health`
- [ ] Deployment successful
- [ ] Service URL copied
- [ ] Health check returns 200 OK

### AI Service Deployment
- [ ] Service created on Render
- [ ] Root directory set to `ai-service`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app`
- [ ] Environment variables added
- [ ] Google Cloud JSON added as secret file
- [ ] Deployment successful
- [ ] Service URL copied
- [ ] Health check returns 200 OK

### Frontend Deployment
- [ ] Static site created on Render (or Vercel)
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `build`
- [ ] All environment variables added
- [ ] Backend URL configured correctly
- [ ] Deployment successful
- [ ] Site URL copied
- [ ] Site loads correctly

### Cross-Service Configuration
- [ ] Backend AI_SERVICE_URL updated with AI service URL
- [ ] Backend FRONTEND_URL updated with frontend URL
- [ ] Frontend REACT_APP_API_URL updated with backend URL
- [ ] Frontend REACT_APP_SOCKET_URL updated with backend URL
- [ ] All services redeployed after URL updates

## Post-Deployment Testing

### Basic Functionality
- [ ] Frontend loads without errors
- [ ] Can access registration page
- [ ] Can create new account
- [ ] Can log in
- [ ] Can log out
- [ ] Dashboard loads

### Item Management
- [ ] Can post lost item (text only)
- [ ] Can post found item (text only)
- [ ] Can post item with image
- [ ] Can post item with voice recording
- [ ] Can view all items
- [ ] Can view my items
- [ ] Can view item details
- [ ] Can update item
- [ ] Can delete item

### Matching System
- [ ] Items are automatically matched
- [ ] Match notifications appear
- [ ] Match score is calculated
- [ ] Can view matches page
- [ ] Match details are correct

### Chat System
- [ ] Can access chat from match
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Typing indicators work
- [ ] Read receipts work
- [ ] Chat history persists

### Notifications
- [ ] In-app notifications appear
- [ ] Email notifications sent (if enabled)
- [ ] Push notifications work (if enabled)
- [ ] Can mark notifications as read
- [ ] Notification badge updates

### AI Features
- [ ] Image embeddings generated
- [ ] Text embeddings generated
- [ ] Voice transcription works
- [ ] Similarity matching works
- [ ] Match scores are reasonable (0.7-1.0)

## Performance Checks

- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Image upload works smoothly
- [ ] Voice recording works
- [ ] No console errors
- [ ] No network errors
- [ ] Mobile responsive
- [ ] Works on different browsers

## Security Checks

- [ ] HTTPS enabled (automatic on Render)
- [ ] JWT tokens working
- [ ] Protected routes require authentication
- [ ] Can't access other users' data
- [ ] File upload validation works
- [ ] Rate limiting active
- [ ] CORS configured correctly
- [ ] No sensitive data in client

## Monitoring Setup

- [ ] Error logging configured
- [ ] Uptime monitoring set up (UptimeRobot)
- [ ] Performance monitoring enabled
- [ ] Database monitoring active
- [ ] Log aggregation configured

## Documentation

- [ ] Deployment URLs documented
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Known issues documented
- [ ] Troubleshooting guide updated

## Backup & Recovery

- [ ] MongoDB automated backups enabled
- [ ] Environment variables backed up securely
- [ ] Cloudinary backup configured
- [ ] Recovery procedure documented

## Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] CDN configured
- [ ] Analytics added (Google Analytics)
- [ ] Error tracking added (Sentry)
- [ ] SEO optimized
- [ ] Social media meta tags added
- [ ] Favicon added
- [ ] PWA configured

## Cost Monitoring

- [ ] Render usage tracked
- [ ] MongoDB Atlas usage tracked
- [ ] Cloudinary usage tracked
- [ ] Firebase usage tracked
- [ ] Google Cloud usage tracked
- [ ] Billing alerts configured

## Maintenance Plan

- [ ] Update schedule defined
- [ ] Backup schedule defined
- [ ] Security patch process defined
- [ ] Monitoring alerts configured
- [ ] Incident response plan created

---

## Quick Reference

### Service URLs
```
Frontend: https://findme.onrender.com
Backend: https://findme-backend.onrender.com
AI Service: https://findme-ai-service.onrender.com
```

### Important Commands

```bash
# Check backend health
curl https://findme-backend.onrender.com/health

# Check AI service health
curl https://findme-ai-service.onrender.com/health

# View logs (Render Dashboard)
# Services → Select Service → Logs tab
```

### Support Resources
- Render Docs: https://render.com/docs
- MongoDB Atlas Support: https://support.mongodb.com
- Firebase Support: https://firebase.google.com/support
- Cloudinary Support: https://support.cloudinary.com

---

**Once all items are checked, your deployment is complete!** 🎉
