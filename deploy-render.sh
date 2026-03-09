#!/bin/bash

# FindMe - Render Deployment Helper Script
# This script helps you prepare for Render deployment

echo "🚀 FindMe Deployment Helper"
echo "============================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote repository configured"
    echo "Add remote with: git remote add origin https://github.com/YOUR_USERNAME/findme.git"
    echo ""
else
    echo "✅ Remote repository configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   $REMOTE_URL"
    echo ""
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes"
    echo "Commit them with:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo ""
else
    echo "✅ No uncommitted changes"
    echo ""
fi

# Check if pushed to remote
if git remote get-url origin > /dev/null 2>&1; then
    LOCAL_COMMIT=$(git rev-parse HEAD)
    REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null || git rev-parse origin/master 2>/dev/null || echo "")
    
    if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
        echo "⚠️  Local commits not pushed to remote"
        echo "Push with: git push origin main"
        echo ""
    else
        echo "✅ Code pushed to remote"
        echo ""
    fi
fi

# Check for required files
echo "📁 Checking required files..."
REQUIRED_FILES=(
    "backend/package.json"
    "backend/src/server.js"
    "ai-service/requirements.txt"
    "ai-service/app.py"
    "frontend/package.json"
    "frontend/src/App.js"
    "render.yaml"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
        ALL_FILES_EXIST=false
    fi
done
echo ""

if [ "$ALL_FILES_EXIST" = false ]; then
    echo "❌ Some required files are missing"
    exit 1
fi

# Check for .env.example files
echo "🔐 Checking environment templates..."
ENV_FILES=(
    "backend/.env.example"
    "ai-service/.env.example"
    "frontend/.env.example"
)

for file in "${ENV_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ⚠️  $file (missing - recommended)"
    fi
done
echo ""

# Summary
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "Before deploying to Render, make sure you have:"
echo ""
echo "1. ✅ MongoDB Atlas cluster created"
echo "   → https://mongodb.com/atlas"
echo ""
echo "2. ✅ Cloudinary account set up"
echo "   → https://cloudinary.com"
echo ""
echo "3. ✅ Firebase project created"
echo "   → https://firebase.google.com"
echo ""
echo "4. ✅ Google Cloud project with Speech-to-Text API"
echo "   → https://console.cloud.google.com"
echo ""
echo "5. ✅ Gmail app password generated"
echo "   → Google Account → Security → App Passwords"
echo ""
echo "6. ✅ All environment variables prepared"
echo "   → See .env.template for required variables"
echo ""
echo "📖 Next Steps:"
echo "=============="
echo ""
echo "1. Push your code to GitHub (if not done):"
echo "   git push origin main"
echo ""
echo "2. Go to Render Dashboard:"
echo "   https://dashboard.render.com"
echo ""
echo "3. Follow the deployment guide:"
echo "   → DEPLOY_NOW.md (quick start)"
echo "   → DEPLOYMENT_CHECKLIST.md (detailed)"
echo ""
echo "🎉 Good luck with your deployment!"
