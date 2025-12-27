# Fix LinkedIn OAuth "Provider Not Enabled" Error

## Error Message
```
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

## Solution

This error means LinkedIn OAuth is not enabled in your Supabase project. Here's how to fix it:

### Step 1: Enable LinkedIn in Supabase

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Authentication → Providers**
   - Click "Authentication" in the left sidebar
   - Click "Providers" (under Authentication)

3. **Find and Enable LinkedIn**
   - Scroll down or search for "LinkedIn"
   - Click on "LinkedIn" or "LinkedIn (OIDC)"

4. **Toggle LinkedIn to ON**
   - Switch "LinkedIn enabled" to **ON** (green)

5. **Add Your LinkedIn Credentials**
   - **API Key**: Your LinkedIn Client ID
   - **API Secret Key**: Your LinkedIn Client Secret
   - Get these from [LinkedIn Developers](https://www.linkedin.com/developers/apps)

6. **Save the Configuration**
   - Click "Save" at the bottom

### Step 2: Get LinkedIn Credentials

If you don't have LinkedIn credentials yet:

1. **Go to LinkedIn Developers**
   - Visit [https://www.linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
   - Sign in with your LinkedIn account

2. **Create a New App**
   - Click "Create app"
   - Fill in:
     - **App name**: Jobz (or your preferred name)
     - **LinkedIn Page**: Select or create a page
     - **Privacy policy URL**: `https://your-domain.com/privacy` (can be placeholder)
   - Accept terms and create

3. **Get Your Credentials**
   - Go to "Auth" tab
   - Copy your **Client ID** (this is your API Key)
   - Copy your **Client Secret** (this is your API Secret Key)

4. **Configure Redirect URLs**
   - In LinkedIn app "Auth" tab:
     - Add redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - In Supabase:
     - The callback URL is automatically set to: `https://your-project-ref.supabase.co/auth/v1/callback`

5. **Request OIDC Product**
   - Go to "Products" tab in LinkedIn app
   - Request "Sign In with LinkedIn using OpenID Connect"
   - Usually approved instantly
   - **Important**: Make sure this product is approved before using LinkedIn OAuth

6. **Configure Scopes in Supabase**
   - In Supabase → Authentication → Providers → LinkedIn
   - The scopes should be: `openid profile email`
   - **Note**: The old scopes `r_liteprofile` and `r_emailaddress` are deprecated
   - Supabase should automatically use the correct OpenID Connect scopes

### Step 3: Verify Configuration

After enabling LinkedIn in Supabase:

1. **Check the Provider Status**
   - Should show "LinkedIn enabled: ON" (green)

2. **Test the Login**
   - Try logging in with LinkedIn
   - You should be redirected to LinkedIn authorization page

## Automatic User Creation

✅ **Good News**: Supabase automatically creates users in `auth.users` table when they sign in via OAuth. You don't need to do anything extra!

When a user signs in with LinkedIn:
1. Supabase creates a user record in `auth.users`
2. User metadata includes LinkedIn profile data
3. You can then create a profile in the `profiles` table using the user's ID

## Troubleshooting

### Still Getting "Provider Not Enabled" Error?

1. **Double-check LinkedIn is enabled**
   - Go to Supabase → Authentication → Providers
   - Make sure "LinkedIn enabled" toggle is ON (green)

2. **Verify Credentials**
   - Check that Client ID and Client Secret are correct
   - No extra spaces or characters

3. **Check Redirect URLs Match**
   - LinkedIn app redirect URL must match Supabase callback URL exactly
   - Both should be: `https://your-project-ref.supabase.co/auth/v1/callback`

4. **Verify OIDC Product is Approved**
   - In LinkedIn Developers → Products
   - Make sure "Sign In with LinkedIn using OpenID Connect" is approved

5. **Clear Browser Cache**
   - Sometimes cached errors persist
   - Try in incognito/private mode

### Other Common Issues

**"Invalid redirect URI"**
- Make sure redirect URLs match exactly in both LinkedIn and Supabase
- No trailing slashes

**"App not approved"**
- Wait for LinkedIn to approve your OIDC product request
- Usually instant, but can take a few minutes

**"Client ID not found"**
- Verify you're using the correct Client ID from LinkedIn
- Check for typos or extra spaces

## OpenID Connect Scopes

According to [LinkedIn's OpenID Connect documentation](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2), the app uses these scopes:

| Scope | Description |
|-------|-------------|
| `openid` | Required to indicate the application wants to use OIDC to authenticate the member |
| `profile` | Required to retrieve the member's lite profile including their id, name, and profile picture |
| `email` | Required to retrieve the member's email address |

**Note**: The old scopes `r_liteprofile` and `r_emailaddress` are deprecated and should not be used.

### Available Profile Fields

With OpenID Connect, you get these fields in the user metadata:
- `sub` - Subject identifier (LinkedIn user ID)
- `name` - Full name
- `given_name` - First name
- `family_name` - Last name
- `picture` - Profile picture URL
- `locale` - User's locale
- `email` - Email address (optional)
- `email_verified` - Email verification status (optional)

## Quick Checklist

- [ ] LinkedIn app created in LinkedIn Developers
- [ ] OIDC product requested and approved
- [ ] Client ID and Secret copied
- [ ] LinkedIn enabled in Supabase (toggle ON)
- [ ] Client ID added to Supabase (as API Key)
- [ ] Client Secret added to Supabase (as API Secret Key)
- [ ] Redirect URLs match in both places
- [ ] Saved configuration in Supabase
- [ ] Using OpenID Connect scopes (`openid profile email`)

Once all these are done, LinkedIn OAuth should work! 🎉

## References

- [LinkedIn OpenID Connect Documentation](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)

