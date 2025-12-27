# 🚀 Quick Start Guide

## Run Locally (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=AIzaSyDslO-K6UlB8INnP_gwUNNbMU5PvfNp4fQ
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser!

---

## Deploy to Netlify (5 Steps)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 2. Connect to Netlify
- Go to [netlify.com](https://www.netlify.com)
- Click "Add new site" → "Import an existing project"
- Connect your GitHub repository

### 3. Build Settings (Auto-detected)
- Build command: `npm run build`
- Publish directory: `dist`

### 4. Add Environment Variables
In Netlify dashboard → Site settings → Environment variables:
- `VITE_GEMINI_API_KEY` = `AIzaSyDslO-K6UlB8INnP_gwUNNbMU5PvfNp4fQ`
- `VITE_SUPABASE_URL` = your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase key

### 5. Deploy!
Click "Deploy site" and wait for build to complete.

---

## ⚠️ Important Notes

- **Supabase Setup Required**: You need a Supabase account and database for authentication to work
- **LinkedIn OAuth**: Configure LinkedIn OAuth in Supabase for login to work
- **Voice Feature**: Works best in Chrome/Edge browsers
- **Environment Variables**: Never commit `.env` file to git (already in `.gitignore`)

For detailed instructions, see [RUN_AND_DEPLOY.md](./RUN_AND_DEPLOY.md)

