# LinkedIn OAuth Setup Guide

This guide will help you configure LinkedIn OAuth in Supabase to enable LinkedIn login and fetch user profile data.

## Step 1: Create LinkedIn App

1. **Go to LinkedIn Developers**
   - Visit [https://www.linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
   - Sign in with your LinkedIn account

2. **Create a New App**
   - Click "Create app"
   - Fill in the required information:
     - **App name**: Jobz (or your preferred name)
     - **LinkedIn Page**: Select or create a LinkedIn page
     - **Privacy policy URL**: `https://your-domain.com/privacy` (can be a placeholder)
     - **App logo**: Upload a logo (optional)
   - Accept the terms and click "Create app"

3. **Get Your Credentials**
   - After creating the app, go to the "Auth" tab
   - You'll see:
     - **Client ID** (this is your API Key)
     - **Client Secret** (this is your API Secret Key)
   - Copy both values (you'll need them in Step 3)

## Step 2: Configure OAuth Redirect URLs

1. **In LinkedIn App Settings (Auth tab)**
   - Scroll down to "Authorized redirect URLs for your app"
   - Click "Add redirect URL"
   - Add your Supabase callback URL:
     ```
     https://dywrmnqcuhtynsxmhimr.supabase.co/auth/v1/callback
     ```
   - Click "Update"

2. **Request Permissions (Products)**
   - In the "Products" tab, request access to:
     - **Sign In with LinkedIn using OpenID Connect** (OIDC)
     - This is required for authentication
   - LinkedIn may need to approve your app (usually instant for development)

## Step 3: Configure Supabase

1. **Go to Your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project: `dywrmnqcuhtynsxmhimr`

2. **Navigate to Authentication → Providers**
   - Click on "LinkedIn" in the providers list
   - Or search for "LinkedIn" in the providers

3. **Enable and Configure LinkedIn**
   - **Toggle "LinkedIn enabled"** to ON (green)
   - **API Key**: Paste your LinkedIn **Client ID** here
   - **API Secret Key**: Paste your LinkedIn **Client Secret** here
   - **Allow users without an email**: Toggle ON (recommended)
   - **Callback URL**: This should already be set to:
     ```
     https://dywrmnqcuhtynsxmhimr.supabase.co/auth/v1/callback
     ```
     - Copy this URL if you need it for LinkedIn configuration

4. **Save the Configuration**
   - Click "Save" at the bottom of the page

## Step 4: Configure Redirect URLs in Supabase

1. **Go to Authentication → URL Configuration**
   - In your Supabase dashboard

2. **Add Site URL**
   - **Site URL**: `http://localhost:3000` (for development)
   - Or your production URL: `https://your-domain.com`

3. **Add Redirect URLs**
   - Add these redirect URLs:
     ```
     http://localhost:3000/**
     http://localhost:3000
     ```
   - For production, add:
     ```
     https://your-domain.com/**
     https://your-domain.com
     ```

## Step 5: Request LinkedIn Profile Data

The app is already configured to request LinkedIn profile data. When users sign in, Supabase will automatically fetch:

- **Email address**
- **Full name**
- **Profile picture**
- **LinkedIn profile ID**
- **Additional metadata** (if available)

This data will be available in:
- `user.user_metadata.full_name`
- `user.user_metadata.avatar_url` or `user.user_metadata.picture`
- `user.user_metadata.email`
- `user.user_metadata.sub` (LinkedIn user ID)

## Step 6: Test the Integration

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Test LinkedIn Login**
   - Click "Continue with LinkedIn" button
   - You should be redirected to LinkedIn
   - Authorize the app
   - You'll be redirected back to your app
   - Your profile data should be available

3. **Test Demo Mode**
   - Click "Try Demo Mode" to test the app without LinkedIn
   - This allows you to explore features without OAuth setup

## Troubleshooting

### "Invalid redirect URI" Error
- **Problem**: LinkedIn says the redirect URI doesn't match
- **Solution**: 
  - Make sure the redirect URL in LinkedIn matches exactly: `https://dywrmnqcuhtynsxmhimr.supabase.co/auth/v1/callback`
  - No trailing slashes
  - Use HTTPS (not HTTP)

### "App not approved" Error
- **Problem**: LinkedIn hasn't approved your app yet
- **Solution**: 
  - For development, LinkedIn usually approves instantly
  - Make sure you've requested the "Sign In with LinkedIn" product
  - Check your app status in LinkedIn Developers dashboard

### Profile Data Not Available
- **Problem**: User metadata is empty after login
- **Solution**:
  - Check that you've requested the correct LinkedIn products
  - Verify the OAuth scopes in `AuthContext.tsx` include profile permissions
  - Check Supabase logs for any errors

### Supabase URL Error
- **Problem**: "Invalid supabaseUrl" error in console
- **Solution**:
  - Make sure your `.env` file has the correct URL:
    ```
    VITE_SUPABASE_URL=https://dywrmnqcuhtynsxmhimr.supabase.co
    ```
  - No trailing slashes
  - Restart your dev server after changing `.env`

## Where to Add LinkedIn Details in Supabase

**Exact Location:**
1. Supabase Dashboard → Your Project
2. **Authentication** (left sidebar)
3. **Providers** (under Authentication)
4. Click on **"LinkedIn"** or search for it
5. Fill in:
   - **LinkedIn enabled**: Toggle ON
   - **API Key**: Your LinkedIn Client ID
   - **API Secret Key**: Your LinkedIn Client Secret
   - **Allow users without an email**: Toggle ON
6. Click **"Save"**

## Additional Resources

- [LinkedIn OAuth Documentation](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase LinkedIn Provider Guide](https://supabase.com/docs/guides/auth/social-login/auth-linkedin)

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to git (already in `.gitignore`)
- Never share your LinkedIn Client Secret publicly
- Use environment variables for all sensitive keys
- For production, set environment variables in your hosting platform (Netlify, Vercel, etc.)

