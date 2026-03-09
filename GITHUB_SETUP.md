# GitHub Repository Setup Guide

## Step 1: Configure Git Identity

Run these commands in your terminal (replace with your information):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Or to set it only for this repository:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 2: Create Initial Commit

```bash
git add LICENSE CONTRIBUTING.md GITHUB_SETUP.md
git commit -m "Initial commit: FindMe AI-powered Lost and Found platform"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `findme` (or your preferred name)
3. Description: "AI-powered Lost and Found platform with image recognition, voice input, and real-time chat"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 4: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Verify Upload

1. Go to your GitHub repository URL
2. Verify all files are uploaded
3. Check that README.md displays correctly

## Step 6: Add Repository Topics (Optional)

On your GitHub repository page:
1. Click "Add topics"
2. Add relevant topics:
   - `lost-and-found`
   - `ai`
   - `machine-learning`
   - `react`
   - `nodejs`
   - `mongodb`
   - `clip`
   - `image-recognition`
   - `real-time-chat`
   - `socketio`

## Step 7: Configure Repository Settings (Optional)

### Enable Issues
Settings → Features → Check "Issues"

### Add Description and Website
Settings → General → Add description and website URL

### Branch Protection (Recommended for teams)
Settings → Branches → Add rule for `main` branch:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

## Step 8: Create .github Folder (Optional)

For better project management:

```bash
mkdir .github
```

Create issue templates, PR templates, and workflows:

**.github/ISSUE_TEMPLATE/bug_report.md**
**.github/ISSUE_TEMPLATE/feature_request.md**
**.github/PULL_REQUEST_TEMPLATE.md**
**.github/workflows/ci.yml** (for CI/CD)

## Common Git Commands

### Check Status
```bash
git status
```

### Add Changes
```bash
git add .                    # Add all changes
git add filename.js          # Add specific file
```

### Commit Changes
```bash
git commit -m "Your message"
```

### Push Changes
```bash
git push                     # Push to current branch
git push origin main         # Push to main branch
```

### Pull Changes
```bash
git pull                     # Pull from current branch
git pull origin main         # Pull from main branch
```

### Create Branch
```bash
git checkout -b feature-name # Create and switch to new branch
git branch                   # List branches
git checkout main            # Switch to main branch
```

### Merge Branch
```bash
git checkout main            # Switch to main
git merge feature-name       # Merge feature branch
```

## Troubleshooting

### Authentication Issues

If you get authentication errors when pushing:

**Option 1: Use Personal Access Token (Recommended)**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when prompted

**Option 2: Use SSH**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your.email@example.com"`
2. Add to SSH agent: `ssh-add ~/.ssh/id_ed25519`
3. Add public key to GitHub: Settings → SSH and GPG keys
4. Change remote URL: `git remote set-url origin git@github.com:USERNAME/REPO.git`

### Large Files

If you have files larger than 100MB:
1. Add to .gitignore
2. Use Git LFS: `git lfs install` and `git lfs track "*.large"`

### Undo Last Commit
```bash
git reset --soft HEAD~1      # Keep changes
git reset --hard HEAD~1      # Discard changes
```

## Next Steps

1. Add badges to README.md (build status, license, etc.)
2. Set up CI/CD with GitHub Actions
3. Enable GitHub Pages for documentation
4. Add code coverage reports
5. Set up automated testing

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)

---

Need help? Open an issue or check the documentation!
