# 🚀 GitHub Repository Setup & Deployment Guide

## 📋 Prerequisites
- GitHub account
- Git installed on your computer
- Node.js and npm installed

## 🏗️ Step 1: Create GitHub Repository

1. **Go to GitHub**: Visit [github.com](https://github.com) and log in
2. **Create New Repository**:
   - Click the "+" button in the top-right corner
   - Select "New repository"
   - Name: `oriflame-store`
   - Description: `Modern Oriflame Store with SQLite Database`
   - Set to Public (for GitHub Pages)
   - Don't initialize with README (we already have one)

## 🚀 Step 2: Initialize Git and Push Code

Open terminal in your project directory (`C:\Users\pc\Desktop\O STORE\V2`) and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Oriflame Store with SQLite database"

# Add GitHub repository as remote (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/oriflame-store.git

# Push to GitHub
git push -u origin main
```

## ⚙️ Step 3: Enable GitHub Pages

1. **Go to Repository Settings**:
   - Navigate to your repository on GitHub
   - Click the "Settings" tab

2. **Configure GitHub Pages**:
   - Scroll down to "Pages" section in the left sidebar
   - Source: Select "GitHub Actions"
   - The workflow will automatically deploy your app

## 🎯 Step 4: Update Repository URL

After creating your repository, update these files with your actual GitHub username:

### Update package.json:
```json
"homepage": "https://yourusername.github.io/oriflame-store"
```

### Update vite.config.js:
```javascript
base: '/oriflame-store/'
```

### Update README.md:
Replace `yourusername` with your actual GitHub username in the live demo link.

## 🔧 Step 5: Deploy

The app will automatically deploy when you push to the `main` branch. You can also deploy manually:

```bash
# Build and deploy manually
npm run deploy
```

## 📱 Step 6: Access Your Live App

Your app will be available at:
`https://yourusername.github.io/oriflame-store`

## 🧪 Testing Your Deployment

1. **Visit your live app**
2. **Register a new account** to test user registration
3. **Browse products** to test the product catalog
4. **Place an order** to test the order system
5. **Login as admin** (`admin@oriflame.com` / `admin123`) to test admin features
6. **Use testing tools** in Admin Dashboard → Settings tab

## 🔄 Making Updates

To update your deployed app:

```bash
# Make your changes, then:
git add .
git commit -m "Description of your changes"
git push origin main
```

The GitHub Action will automatically rebuild and deploy your app.

## 🆘 Troubleshooting

### Common Issues:

1. **404 Error on GitHub Pages**:
   - Check that GitHub Pages is enabled
   - Verify the base URL in vite.config.js matches your repository name

2. **Build Fails**:
   - Check that all dependencies are installed
   - Ensure Node.js version is 20+

3. **App Doesn't Load**:
   - Check browser console for errors
   - Verify the live URL matches your repository settings

### Debug Steps:

1. **Check GitHub Actions**:
   - Go to your repository → Actions tab
   - Check if the deployment workflow succeeded

2. **Verify Build**:
   - Run `npm run build` locally to test the build process

3. **Test Locally**:
   - Run `npm run preview` to test the built version locally

## 🎉 Success!

Once deployed, your Oriflame Store will be:
- ✅ Live on GitHub Pages
- ✅ Automatically updated on every push
- ✅ Fully functional with SQLite database
- ✅ Mobile-responsive and fast
- ✅ Ready for customers to use

## 📊 Features Available on GitHub Pages

- **🛍️ Product Catalog**: Browse all Oriflame products
- **👤 User Registration**: Create accounts and login
- **🛒 Order System**: Place orders with address validation
- **📋 Order History**: View past orders
- **📊 Admin Dashboard**: Complete management system
- **🗄️ SQLite Database**: Persistent data storage in browser
- **📱 Mobile Responsive**: Works on all devices

Your Oriflame Store is now ready for the world! 🌟
