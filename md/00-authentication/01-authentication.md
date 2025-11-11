# Phase 1: User Authentication System

## 🎯 What We're Building

A complete user authentication system that allows students to create accounts, log in securely, and access their personal study data. This is the foundation of PassAI - every other feature depends on knowing who the user is.

## 👤 User Experience

### New User Journey

1. Student visits PassAI
2. Clicks "Sign Up"
3. Enters email, password, and full name
4. Receives confirmation email
5. Clicks confirmation link
6. Lands on dashboard, ready to create first subject

### Returning User Journey

1. Student visits PassAI
2. Clicks "Log In"
3. Enters email and password
4. Lands on dashboard with all their subjects and data

### Forgot Password Journey

1. Student clicks "Forgot Password?"
2. Enters email address
3. Receives password reset email
4. Clicks reset link
5. Sets new password
6. Redirected to log in

### Logged-In Experience

- User stays logged in even after closing browser/refreshing page
- Can log out at any time
- Cannot access any features without being logged in
- Can view/edit their profile (name, email)

## 📋 Requirements

### Authentication Features

- ✅ **Sign Up** with email, password, and full name
- ✅ **Email Confirmation** - Users must confirm email before full access
- ✅ **Log In** with email and password
- ✅ **Log Out** - Clear session completely
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Session Persistence** - Users stay logged in across browser sessions
- ✅ **Auto Logout** - After extended inactivity (optional but nice)

### Security Requirements

- ✅ **Password Requirements:** Minimum 8 characters
- ✅ **Email Validation:** Must be valid email format
- ✅ **Secure Password Storage:** Never store plaintext passwords (Supabase handles this)
- ✅ **Protected Routes:** Redirect to login if not authenticated
- ✅ **Public Routes:** Login and signup pages accessible without auth

### User Profile

- ✅ **View Profile:** Name, email, account creation date
- ✅ **Edit Profile:** Change name, change email
- ✅ **Change Password:** Update password while logged in
- ✅ **Delete Account:** Optional - permanently delete account and all data

### Error Handling

- ✅ **Clear Error Messages:**
  - "Email already registered"
  - "Invalid email or password"
  - "Passwords must be at least 8 characters"
  - "Please confirm your email before logging in"
  - "Password reset email sent"
- ✅ **Loading States:** Show spinners during authentication operations
- ✅ **Network Errors:** Handle offline/connection issues gracefully

## 🔄 User Flow

### Sign Up Flow

```
Landing Page
    ↓
Click "Sign Up"
    ↓
Sign Up Form (email, password, name)
    ↓
Submit → Show loading
    ↓
Success → "Check your email to confirm"
    ↓
User clicks email confirmation link
    ↓
Confirmation page → "Email confirmed! Please log in"
    ↓
Redirect to Login
```

### Login Flow

```
Login Page
    ↓
Enter email and password
    ↓
Submit → Show loading
    ↓
Success → Redirect to Dashboard
    ↓
User sees all their subjects
```

### Password Reset Flow

```
Login Page
    ↓
Click "Forgot Password?"
    ↓
Enter email address
    ↓
Submit → "If that email exists, we sent reset instructions"
    ↓
User clicks email reset link
    ↓
Reset Password Page (enter new password)
    ↓
Submit → "Password updated!"
    ↓
Redirect to Login
```

## 🎨 UI/UX Considerations

### Login/Signup Pages

- **Clean, simple design** - No distractions, focus on the form
- **Clear call to action** - Big "Sign Up" or "Log In" button
- **Switch between forms** - Easy toggle between login and signup
- **Remember me option** - Optional checkbox to stay logged in longer
- **Social login future-ready** - Layout accommodates "Sign in with Google" later

### Loading States

- **Button shows spinner** when submitting
- **Disable form** during submission to prevent double-submit
- **Show progress** if operation takes more than 2 seconds

### Error Display

- **Inline errors** below each field for validation errors
- **Alert banner** at top of form for authentication errors
- **Auto-dismiss success messages** after 5 seconds
- **Persist error messages** until user corrects the issue

### Responsive Design

- **Mobile-first** - Form works great on phone screens
- **Large touch targets** - Easy to tap on mobile
- **Proper keyboard types** - Email keyboard for email field, etc.

## 🔗 Integration Points

### Supabase Auth

- Use Supabase authentication service

### Database (profiles table)

After user signs up, create a profile record:

- `id` (matches auth user ID)
- `email` (from auth)
- `first_name` (from signup form)
- `last_name` (from signup form)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `subscription_tier` (default: 'free')
- `subscription_status` (default: 'active')

### Protected Routes

Once auth is working, all other pages require authentication:

- Dashboard
- Subjects
- Quiz
- Analytics
- Study Garden
- Account Settings

### Public Routes

These pages are accessible without login:

- Landing page (marketing/home)
- Login page
- Signup page
- Password reset page
- Email confirmation page

## ⚙️ Technical Considerations

- Supabase sends confirmation and reset emails
- Validate inputs on both client and server (Supabase validates server-side)
- Auth state should be globally accessible
- Consider React Context for current user
- React Query for profile data fetching
- Loading and error states at the app level

## ✅ Acceptance Criteria

The authentication system is complete when:

1. **Sign Up Works:**

   - ✅ User can create account with email, password, name
   - ✅ Validation errors show for invalid inputs
   - ✅ Confirmation email is sent
   - ✅ Cannot log in until email is confirmed

2. **Login Works:**

   - ✅ User can log in with correct credentials
   - ✅ Error shown for wrong password
   - ✅ Error shown for unconfirmed email
   - ✅ Session persists after page refresh

3. **Password Reset Works:**

   - ✅ User can request password reset
   - ✅ Reset email is sent
   - ✅ User can set new password via email link
   - ✅ Can log in with new password

4. **Protected Routes Work:**

   - ✅ Unauthenticated users redirected to login
   - ✅ After login, redirected to originally requested page
   - ✅ Logged-in users can access all features

5. **Profile Management Works:**

   - ✅ User can view their profile
   - ✅ User can update their name
   - ✅ User can change their password
   - ✅ User can log out

6. **Error Handling Works:**

   - ✅ All error cases show helpful messages
   - ✅ Network errors handled gracefully
   - ✅ Loading states shown during async operations

7. **Responsive Design Works:**
   - ✅ Forms work on mobile, tablet, desktop
   - ✅ No horizontal scrolling
   - ✅ Touch targets are large enough

## 🚧 Prerequisites

**None** - This is the first feature to build. Start here!

However, you should have:

- React + TypeScript project set up with Vite
- Supabase project created with credentials in `.env`
- TailwindCSS and ShadCN configured
- Basic routing set up (React Router, already installed)

---

**Once authentication is complete, users can securely access their personal study data, and we can build all other features on top of this foundation.**
