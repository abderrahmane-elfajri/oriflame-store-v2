# Firebase Setup Guide

This guide will help you set up Firebase Authentication for your Oriflame Store application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: "oriflame-store" (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Web App to Firebase

1. In your Firebase project dashboard, click the web icon `</>`
2. Register your app with a nickname: "Oriflame Store Web"
3. Check "Also set up Firebase Hosting" if you plan to deploy to Firebase
4. Click "Register app"

## Step 3: Get Firebase Configuration

After registering, you'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Enable Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Toggle "Email link (passwordless sign-in)" if desired
   - Click "Save"

## Step 5: Configure Environment Variables

Add your Firebase configuration to the `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Step 6: Set Up Admin Account

1. Start your development server: `npm run dev`
2. Go to the registration page and create an account with: `admin@oriflame.com`
3. Use the password you set in your environment variables

Alternatively, you can create the admin account directly in Firebase Console:
1. Go to "Authentication" > "Users" tab
2. Click "Add user"
3. Enter email: `admin@oriflame.com`
4. Enter your admin password
5. Click "Add user"

## Step 7: Configure Security Rules (Optional)

For enhanced security, you can set up authentication rules:

1. Go to "Authentication" > "Settings" tab
2. Configure password policy requirements
3. Set up authorized domains for production

## Step 8: Test Authentication

1. Start your app: `npm run dev`
2. Try registering a new account
3. Try logging in with existing credentials
4. Test admin access with admin@oriflame.com

## Environment Variables Explanation

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Your Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Authentication domain |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Your Firebase app ID |

## Security Best Practices

1. **API Key Security**: Your Firebase API key is safe to expose in client-side code for authentication
2. **Domain Restriction**: In production, restrict your API key to your domain
3. **Admin Protection**: Admin routes are protected by checking email against environment variable
4. **Password Requirements**: Encourage strong passwords for users

## Deployment Considerations

### For Netlify/Vercel:
1. Add all environment variables to your deployment platform
2. Ensure your production domain is added to Firebase authorized domains
3. Update CORS settings if needed

### Authorized Domains:
Add your production domains to Firebase:
1. Go to "Authentication" > "Settings" > "Authorized domains"
2. Add your production domain (e.g., `your-app.netlify.app`)

## Troubleshooting

### Common Issues:

1. **API Key Error**: Ensure all environment variables are correctly set
2. **Domain Not Authorized**: Add your local and production domains to Firebase
3. **Authentication Failed**: Check if Email/Password is enabled in Firebase Console
4. **Admin Access Denied**: Verify admin email matches environment variable exactly

### Testing Firebase Connection:

You can test if Firebase is properly configured by checking the browser console for any Firebase errors when the app loads.

## Advanced Features (Optional)

### Email Verification:
```javascript
// Enable email verification for new users
import { sendEmailVerification } from 'firebase/auth';

await sendEmailVerification(user);
```

### Password Reset:
```javascript
// Implement password reset functionality
import { sendPasswordResetEmail } from 'firebase/auth';

await sendPasswordResetEmail(auth, email);
```

### Social Authentication:
You can also enable Google, Facebook, or other social login providers in the Firebase Console under Authentication > Sign-in method.
