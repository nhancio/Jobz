# Setup Guide

This guide will help you set up the Jobz application with Firebase/Supabase database, Gemini voice-to-text API, and LinkedIn OAuth authentication.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account
- A Google Cloud account with Gemini API access
- A LinkedIn Developer account (for OAuth)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your Project URL and anon/public key
4. Go to Authentication > Providers
5. Enable LinkedIn provider and configure it:
   - Get your LinkedIn Client ID and Client Secret from [LinkedIn Developers](https://www.linkedin.com/developers/apps)
   - Add the redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Add the same redirect URL in your LinkedIn app settings

## Step 3: Set Up Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

## Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your actual credentials.

## Step 5: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase-schema.sql`:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

This will create:
- `profiles` table for storing user profiles
- Row Level Security (RLS) policies
- Indexes for better performance
- Automatic timestamp updates

## Step 6: Configure LinkedIn OAuth Redirect

In your Supabase project:
1. Go to Authentication > URL Configuration
2. Add your site URL (e.g., `http://localhost:5173` for development)
3. Add redirect URLs:
   - `http://localhost:5173/**` (for development)
   - `https://yourdomain.com/**` (for production)

## Step 7: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

### Authentication
- LinkedIn OAuth login via Supabase
- Automatic session management
- Protected routes

### Voice Profile Creation
- Click the microphone button to start recording
- Speak about yourself (for job seekers) or the job (for employers)
- AI processes the voice input using Gemini API
- Structured profile data is automatically extracted and saved

### Profile Management
- Profiles are saved to Supabase database
- Users can have separate profiles for seeker and employer modes
- Profiles are automatically loaded when users return

## Troubleshooting

### Voice Recognition Not Working
- Make sure you're using Chrome or Edge browser (Web Speech API support)
- Check microphone permissions in browser settings
- Ensure you have a stable internet connection for Gemini API calls

### LinkedIn Login Not Working
- Verify your LinkedIn app redirect URLs match Supabase settings
- Check that LinkedIn provider is enabled in Supabase
- Ensure your Supabase project URL is correctly configured

### Database Errors
- Verify the `profiles` table was created successfully
- Check Row Level Security policies are set up correctly
- Ensure your Supabase anon key has the correct permissions

## Browser Compatibility

- **Voice Recognition**: Chrome, Edge (Web Speech API)
- **Authentication**: All modern browsers
- **Database**: All modern browsers

## Production Deployment

1. Update environment variables in your hosting platform
2. Update Supabase redirect URLs to include your production domain
3. Update LinkedIn app redirect URLs
4. Build the application: `npm run build`
5. Deploy the `dist` folder to your hosting service

