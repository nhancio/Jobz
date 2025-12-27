# How to Run and Deploy Jobz

This guide will walk you through running the application locally and deploying it to production.

## 🚀 Quick Start - Running Locally

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment Variables

Create a `.env` file in the root directory with your API keys:

```env
# Google Gemini API Key (for voice-to-profile feature)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (for authentication and database)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** Replace the placeholder values with your actual credentials.

### Step 3: Run the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000` (or the port shown in the terminal).

### Step 4: Test the Application

1. Open your browser to the local URL
2. Click "Continue with LinkedIn" to sign in (requires Supabase + LinkedIn OAuth setup)
3. Select your role (Job Seeker or Employer)
4. Create a profile using voice input or manual entry
5. Start swiping through matches!

---

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

To preview the production build locally:

```bash
# Install a simple server (if you don't have one)
npm install -g serve

# Serve the dist folder
serve -s dist
```

---

## 🌐 Deployment Options

### Option 1: Deploy to Netlify (Recommended)

Netlify is already configured for this project!

#### Method A: Deploy via Netlify Dashboard

1. **Create a Netlify Account**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up or log in

2. **Connect Your Repository**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub/GitLab/Bitbucket
   - Select your Jobz repository

3. **Configure Build Settings**
   - Build command: `npm run build` (already set in `netlify.toml`)
   - Publish directory: `dist` (already set in `netlify.toml`)
   - Netlify will auto-detect these from `netlify.toml`

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following:
     ```
     VITE_GEMINI_API_KEY = your_gemini_api_key_here
     VITE_SUPABASE_URL = your_supabase_project_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```

5. **Deploy!**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

#### Method B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

#### Update Supabase Redirect URLs

After deployment, update your Supabase redirect URLs:

1. Go to your Supabase project dashboard
2. Navigate to Authentication → URL Configuration
3. Add your Netlify URL:
   - `https://your-site-name.netlify.app/**`
   - `https://your-site-name.netlify.app`

4. Update LinkedIn OAuth redirect URL in LinkedIn Developer Console:
   - `https://your-project-ref.supabase.co/auth/v1/callback`

---

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to your Vercel project settings
   - Add the same environment variables as listed above

4. **Update Supabase Redirect URLs**
   - Add your Vercel domain to Supabase redirect URLs

---

### Option 3: Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

---

### Option 4: Deploy to Any Static Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your hosting provider:
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps
   - Any static file hosting service

3. Configure environment variables in your hosting platform

4. Update Supabase redirect URLs with your domain

---

## 🔧 Prerequisites Setup

### Setting Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to initialize

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy your Project URL and anon/public key

3. **Set Up Database Schema**
   - Go to SQL Editor in Supabase
   - Run this SQL to create the profiles table:

   ```sql
   -- Create profiles table
   CREATE TABLE IF NOT EXISTS profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     mode TEXT NOT NULL CHECK (mode IN ('seeker', 'employer')),
     name TEXT NOT NULL,
     title TEXT NOT NULL,
     location TEXT NOT NULL,
     avatar TEXT,
     logo TEXT,
     bio TEXT,
     description TEXT,
     skills TEXT[],
     requirements TEXT[],
     experience TEXT,
     education TEXT,
     salary TEXT,
     type TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view their own profiles"
     ON profiles FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own profiles"
     ON profiles FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own profiles"
     ON profiles FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own profiles"
     ON profiles FOR DELETE
     USING (auth.uid() = user_id);

   -- Create index for faster queries
   CREATE INDEX IF NOT EXISTS profiles_user_id_mode_idx ON profiles(user_id, mode);

   -- Create function to update updated_at timestamp
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   -- Create trigger
   CREATE TRIGGER update_profiles_updated_at
     BEFORE UPDATE ON profiles
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();
   ```

4. **Set Up LinkedIn OAuth**
   - Go to Authentication → Providers
   - Enable LinkedIn provider
   - Get your LinkedIn Client ID and Secret from [LinkedIn Developers](https://www.linkedin.com/developers/apps)
   - Add redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Add the same redirect URL in your LinkedIn app settings

---

## 🐛 Troubleshooting

### Build Errors

- **Missing dependencies**: Run `npm install`
- **Type errors**: Check that all TypeScript types are correct
- **Environment variables**: Ensure `.env` file exists and has all required variables

### Runtime Errors

- **"Supabase is not configured"**: Check your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **"Gemini API key is not configured"**: Check your `.env` file has `VITE_GEMINI_API_KEY`
- **LinkedIn login not working**: Verify Supabase and LinkedIn redirect URLs match
- **Voice recognition not working**: Use Chrome or Edge browser (Web Speech API support)

### Deployment Issues

- **404 errors on routes**: Ensure `public/_redirects` file exists for Netlify
- **Environment variables not working**: Make sure they're set in your hosting platform's dashboard
- **Build fails**: Check build logs for specific errors

---

## 📝 Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for voice-to-profile | Yes |
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes (for auth) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes (for auth) |

---

## 🎯 Next Steps After Deployment

1. ✅ Test all features on the live site
2. ✅ Update Supabase redirect URLs with production domain
3. ✅ Update LinkedIn OAuth redirect URLs
4. ✅ Set up custom domain (optional)
5. ✅ Configure SSL certificate (usually automatic)
6. ✅ Set up monitoring and error tracking (optional)

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/)

---

**Need Help?** Check the main [SETUP.md](./SETUP.md) file for detailed setup instructions.

