# Quick GitHub Setup - 5 Minutes

## 1. Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 2. Commit Your Code
```bash
git add LICENSE CONTRIBUTING.md GITHUB_SETUP.md QUICK_GITHUB_SETUP.md
git commit -m "Initial commit: FindMe AI-powered Lost and Found platform"
```

## 3. Create GitHub Repository
1. Go to: https://github.com/new
2. Name: `findme`
3. Description: "AI-powered Lost and Found platform"
4. **Don't** check any initialization options
5. Click "Create repository"

## 4. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/findme.git
git branch -M main
git push -u origin main
```

## 5. Done! 🎉

Your repository is now on GitHub at:
`https://github.com/YOUR_USERNAME/findme`

---

## Daily Workflow

```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push
```

That's it! See GITHUB_SETUP.md for detailed instructions.
