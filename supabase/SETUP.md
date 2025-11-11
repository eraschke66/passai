# Supabase Setup Guide - Phase 1: Authentication

## Step 1: Run the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the entire contents of `supabase/schema.sql`
5. Click **"Run"** to execute the SQL
6. Verify in the **Table Editor** that the `profiles` table was created

## Step 2: Configure Authentication Settings

### Email Templates

Go to **Authentication → Email Templates** and configure:

#### Confirm Signup Template

- **Subject:** Confirm Your PassAI Account
- Update the confirmation URL to match your app's domain (for development: `http://localhost:5173`)

#### Reset Password Template

- **Subject:** Reset Your PassAI Password
- Update the reset URL to match your app's domain

#### Magic Link Template (Optional)

- Can be configured later if needed

### Auth Settings

Go to **Authentication → Settings**:

1. **Site URL:** Set to `http://localhost:5173` (development) or your production URL
2. **Redirect URLs:** Add these allowed URLs:
   - `http://localhost:5173/**` (development)
   - Your production domain when deploying
3. **Email Auth:** Ensure it's enabled
4. **Email Confirmations:**
   - ✅ Enable email confirmations (recommended)
   - Or disable for easier testing (can enable later)
5. **Password Requirements:**
   - Minimum length: 8 characters

## Step 3: Verify Database Setup

Run these checks in the SQL Editor:

```sql
-- Check profiles table exists
SELECT * FROM public.profiles LIMIT 1;

-- Check RLS policies are active
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'profiles';

-- Check triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'profiles' OR event_object_table = 'users';
```

## Step 4: Test the Setup (After Building Auth UI)

1. Sign up a new user through your app
2. Check the **Authentication → Users** section - user should appear
3. Check the **Table Editor → profiles** - profile should be automatically created
4. Verify email confirmation is sent (check your email or Supabase logs)

## Troubleshooting

### Profile not created automatically?

- Check if the `on_auth_user_created` trigger exists
- Check Supabase logs for errors
- Manually run the trigger function

### Email confirmations not sending?

- Check SMTP settings in Authentication settings
- For development, you can disable email confirmation temporarily
- Check spam folder

### RLS errors when accessing profiles?

- Verify policies exist: `SELECT * FROM pg_policies WHERE tablename = 'profiles'`
- Ensure user is authenticated when making requests
- Check that `auth.uid()` matches the profile `id`

## Next Steps

Once database is set up:

1. ✅ Build authentication UI
2. ✅ Test signup/login flows
3. ✅ Verify profile creation
4. ✅ Test RLS policies
