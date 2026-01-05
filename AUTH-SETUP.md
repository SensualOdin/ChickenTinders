# Authentication Setup Guide

ChickenTinders now supports both **Guest Mode** (anonymous, temporary) and **Authenticated Users** (with full account features).

## Features

### Guest Mode (Default)
- ✅ No signup required
- ✅ Create and join groups immediately
- ✅ Full swipe functionality
- ⚠️ Data is temporary (stored locally)
- ⚠️ No group history or preferences saved

### Authenticated Mode
- ✅ All guest features
- ✅ Group history saved forever
- ✅ View past matches
- ✅ Save preferences (radius, price tier)
- ✅ Access from any device
- ✅ Option to "claim" guest account

---

## Database Setup

### 1. Run the Auth Migration

Go to your Supabase project SQL Editor and run:

```bash
# File: supabase-auth-migration.sql
```

This will:
- Add `auth_user_id`, `email`, and `is_guest` columns to `users` table
- Create `user_preferences` table for saved settings
- Add `creator_id` to `groups` table for history tracking
- Set up database triggers for auto-creating user profiles
- Add RLS policies for authenticated users

### 2. Enable Email Authentication

In your Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Save changes

### 3. Configure Redirect URLs (Optional)

For production deployment:

1. Go to **Authentication** → **URL Configuration**
2. Add your production URL to **Site URL**
3. Add redirect URLs for OAuth providers (if using social auth later)

---

## How It Works

### Guest Users

When someone visits without signing up:

1. They create a "guest" user profile (`is_guest = true`)
2. User ID is stored in local storage
3. They can create/join groups normally
4. Data persists in browser, but not across devices

### Authenticated Users

When someone signs up:

1. Supabase Auth account is created
2. Database trigger auto-creates linked user profile (`is_guest = false`)
3. All groups and history are saved to their account
4. They can access data from any device

### Guest → Auth Conversion

When a guest user signs up:

1. Their existing guest profile is linked to new auth account
2. All past groups are preserved
3. `is_guest` is set to `false`
4. Guest data becomes permanent

---

## API Routes

### Auth Pages

- `/auth/login` - Sign in with email/password
- `/auth/signup` - Create account or link guest account
- `/account` - View profile, manage account
- `/history` - View past groups (auth only)

### Auth Context

Available via `useAuth()` hook:

```typescript
import { useAuth } from '../lib/contexts/AuthContext';

const {
  user,           // Supabase auth user
  profile,        // User profile from database
  isGuest,        // true if guest, false if authenticated
  loading,        // auth state loading
  signUp,         // Sign up function
  signIn,         // Sign in function
  signOut,        // Sign out function
  linkGuestAccount, // Convert guest to auth
  updateProfile,  // Update profile
  refreshProfile, // Reload profile from DB
} = useAuth();
```

---

## UI Changes

### Landing Page

- Added account button (top right)
- Shows username if authenticated
- Shows generic user icon if guest

### Account Page

For guests:
- Encourages signup
- Shows benefits of authenticated account
- Links to signup/login

For authenticated users:
- Shows profile info
- Quick links to history, settings
- Sign out button

### Group History

- Only available to authenticated users
- Shows all past groups with status
- Can re-open lobby or view results

---

## Testing

### Test Guest Mode

1. Open app in incognito
2. Create a group without logging in
3. Verify you can swipe and see results
4. Close browser - data should be lost

### Test Authenticated Mode

1. Sign up with email/password
2. Create a group
3. Close browser and reopen
4. Sign in again
5. Go to History - group should appear

### Test Guest Conversion

1. Open app as guest
2. Create a group
3. Click "Create Account" in account page
4. Sign up with email/password
5. Go to History - guest group should be there!

---

## Security

### Row Level Security (RLS)

- All tables have RLS enabled
- Guest users can read/write their own data
- Authenticated users have same permissions plus history access
- User profiles are linked to auth.users via foreign key

### Password Requirements

- Minimum 6 characters (Supabase default)
- Can be customized in Supabase Dashboard

---

## Future Enhancements

Potential features to add:

- [ ] Social auth (Google, Apple, Facebook)
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Save dietary preferences
- [ ] Save default radius and price tier
- [ ] Group invites via email
- [ ] Push notifications for matches
- [ ] Friend system

---

## Troubleshooting

### "Failed to create account"

- Check Supabase email provider is enabled
- Verify email template is configured
- Check browser console for errors

### "Profile not loading"

- Verify database trigger is created (`handle_new_user`)
- Check RLS policies are set correctly
- Ensure user record exists in `public.users` table

### "Guest account not linking"

- Verify `link_guest_to_auth_user` function exists
- Check guest user ID is valid
- Ensure auth user was created successfully

---

## Support

For issues or questions:
- Check [STATUS.md](STATUS.md) for current state
- Review [The Plan.md](The%20Plan.md) for implementation details
- Open an issue on GitHub

---

**Ready to authenticate!** 🔐🍗
