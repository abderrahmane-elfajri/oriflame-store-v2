# Deployment Guide

This guide covers deploying your Oriflame Store application to popular hosting platforms.

## 🚀 Netlify Deployment

Netlify is recommended for its ease of use and excellent support for React SPAs.

### Step 1: Prepare for Deployment

1. **Build the project locally to test:**
   ```bash
   npm run build
   ```

2. **Test the production build:**
   ```bash
   npm run preview
   ```

### Step 2: Deploy to Netlify

#### Option A: Git-based Deployment (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://netlify.com) and sign up/login
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Add environment variables in Netlify dashboard
7. Deploy!

#### Option B: Manual Deployment

1. Build your project: `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the `dist` folder to Netlify
4. Configure environment variables in site settings

### Step 3: Configure Environment Variables

In Netlify dashboard, go to Site settings > Environment variables and add:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_SHEETS_API_KEY=your_sheets_api_key
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
VITE_ADMIN_EMAIL=admin@oriflame.com
VITE_ADMIN_PASSWORD=your_admin_password
```

### Step 4: Configure Redirects

Create `public/_redirects` file for proper React Router support:

```
/*    /index.html   200
```

This ensures all routes are handled by React Router.

## ⚡ Vercel Deployment

Vercel offers excellent performance and seamless GitHub integration.

### Step 1: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign up/login
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add environment variables
7. Deploy!

### Step 2: Environment Variables

In Vercel dashboard, add the same environment variables as listed for Netlify.

### Step 3: Domain Configuration

1. Add your custom domain in Vercel dashboard
2. Update Firebase authorized domains
3. Update any hardcoded URLs

## 🔥 Firebase Hosting

If you prefer to host on Firebase:

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Initialize Firebase Hosting

```bash
firebase login
firebase init hosting
```

Configure:
- Select your Firebase project
- Set public directory to `dist`
- Configure as single-page app: Yes
- Set up automatic builds: No (we'll build manually)

### Step 3: Build and Deploy

```bash
npm run build
firebase deploy
```

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All environment variables configured
- [ ] Build runs without errors: `npm run build`
- [ ] Preview works correctly: `npm run preview`
- [ ] All images have proper URLs and alt texts
- [ ] No console errors in production build

### Firebase Configuration
- [ ] Authentication is set up and working
- [ ] Authorized domains include your production URL
- [ ] Admin account exists and is accessible

### Google Sheets Configuration
- [ ] Spreadsheet is properly structured
- [ ] API key has correct permissions
- [ ] Spreadsheet is shared with proper permissions
- [ ] Test API connection works

### Content Verification
- [ ] All product images load correctly
- [ ] Product information is accurate
- [ ] Order modal functions properly
- [ ] Admin dashboard is accessible to admin only

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different API keys for development and production
- Regularly rotate API keys

### Firebase Security
- Configure authorized domains properly
- Enable additional security features as needed
- Monitor authentication logs

### Content Security
- Validate all image URLs
- Sanitize user inputs
- Implement proper error handling

## 📊 Performance Optimization

### Image Optimization
- Use optimized image URLs (WebP format when possible)
- Implement lazy loading for product images
- Use appropriate image sizes for different screen sizes

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Caching Strategy
- Leverage browser caching for static assets
- Implement proper cache headers
- Use CDN for image assets when possible

## 🐛 Troubleshooting Deployment Issues

### Common Build Errors

1. **Environment Variables Not Found**
   - Ensure all VITE_ prefixed variables are set
   - Check for typos in variable names

2. **Firebase Connection Issues**
   - Verify Firebase configuration is correct
   - Check if authorized domains are configured

3. **Google Sheets API Errors**
   - Verify API key permissions
   - Check spreadsheet sharing settings

### Runtime Errors

1. **404 Errors on Page Refresh**
   - Ensure proper redirect rules are configured
   - Check that hosting platform supports SPA routing

2. **Images Not Loading**
   - Verify image URLs are accessible
   - Check CORS settings for external images

3. **Authentication Issues**
   - Verify Firebase authorized domains
   - Check environment variables are correctly set

## 📱 Testing Your Deployment

### Functionality Testing
1. Visit your deployed site
2. Test user registration and login
3. Browse products and test ordering
4. Login as admin and test dashboard
5. Test on mobile devices

### Performance Testing
- Use Google PageSpeed Insights
- Test loading times
- Check mobile responsiveness
- Verify SEO meta tags

## 🔄 Continuous Deployment

### Setting Up Auto-Deploy

For GitHub + Netlify/Vercel:
1. Every push to main branch triggers deployment
2. Preview deployments for pull requests
3. Automatic builds on dependency updates

### Environment Management
- Use separate Firebase projects for staging/production
- Configure different Google Sheets for different environments
- Use different admin credentials per environment

## 📈 Monitoring and Analytics

### Performance Monitoring
- Set up error tracking (e.g., Sentry)
- Monitor Core Web Vitals
- Track user engagement

### Usage Analytics
- Implement Google Analytics (optional)
- Monitor order completion rates
- Track popular products

---

Your Oriflame Store is now ready for the world! 🌟
