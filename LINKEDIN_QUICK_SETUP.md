# Quick LinkedIn Setup Guide

## Where to Add LinkedIn Details in Supabase

### Step 1: Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **dywrmnqcuhtynsxmhimr**

### Step 2: Navigate to LinkedIn Provider
1. Click **"Authentication"** in the left sidebar
2. Click **"Providers"** (under Authentication)
3. Find and click on **"LinkedIn"** in the list

### Step 3: Fill in LinkedIn Credentials
In the LinkedIn configuration form:

1. **LinkedIn enabled**: Toggle this to **ON** (green)

2. **API Key**: 
   - This is your **LinkedIn Client ID**
   - Get it from: [LinkedIn Developers](https://www.linkedin.com/developers/apps)
   - Create an app if you don't have one
   - Copy the **Client ID** from the "Auth" tab

3. **API Secret Key**: 
   - This is your **LinkedIn Client Secret**
   - Same location as Client ID
   - Click "Show" to reveal it
   - Copy the **Client Secret**

4. **Allow users without an email**: Toggle **ON** (recommended)

5. **Callback URL**: 
   - This should already be set to:
   ```
   https://dywrmnqcuhtynsxmhimr.supabase.co/auth/v1/callback
   ```
   - **Copy this URL** - you'll need it for LinkedIn app configuration

6. Click **"Save"** at the bottom

### Step 4: Configure LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Select your app (or create a new one)
3. Go to **"Auth"** tab
4. Under **"Authorized redirect URLs for your app"**:
   - Click **"Add redirect URL"**
   - Paste: `https://dywrmnqcuhtynsxmhimr.supabase.co/auth/v1/callback`
   - Click **"Update"**
5. Go to **"Products"** tab:
   - Request **"Sign In with LinkedIn using OpenID Connect"**
   - This is usually approved instantly

### Step 5: Test It!
1. Restart your dev server: `npm run dev`
2. Click **"Continue with LinkedIn"** button
3. You should be redirected to LinkedIn to authorize
4. After authorization, you'll be redirected back
5. Your LinkedIn profile data will be automatically loaded!

## What Gets Fetched from LinkedIn?

When users sign in with LinkedIn, the app automatically fetches:
- ✅ Full name
- ✅ Email address  
- ✅ Profile picture
- ✅ Headline (job title)
- ✅ Location
- ✅ LinkedIn profile ID

This data is used to:
- Auto-fill the profile creation form
- Display user information
- Create user profiles

## Troubleshooting

**"Invalid redirect URI" error?**
- Make sure the redirect URL in LinkedIn matches exactly: `https://dywrmnqcuhtynsxmhimr.supabase.co/auth/v1/callback`
- No trailing slashes!

**Can't find LinkedIn in Supabase?**
- Make sure you're in: Authentication → Providers
- Use the search box to find "LinkedIn"

**Profile data not loading?**
- Check browser console for errors
- Verify LinkedIn app is approved
- Make sure you requested the OIDC product in LinkedIn

For detailed setup, see [LINKEDIN_SETUP.md](./LINKEDIN_SETUP.md)

