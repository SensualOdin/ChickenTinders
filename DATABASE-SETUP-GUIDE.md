# Database Setup Guide for Saved Groups

## Problem: Infinite Loading on My Groups Page

The "My Groups" page shows infinite loading because the Row Level Security (RLS) policies can't find your user record. This happens when the `auth_user_id` column in the `users` table is not properly linked to your Supabase auth account.

## Solution: Run These SQL Scripts in Order

### Step 1: Ensure the auth_user_id column exists

Run this first to make sure the column exists with the right constraints:

```sql
-- Add auth_user_id column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT true;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
```

### Step 2: Create the Auth Trigger

Run the `supabase-auth-trigger-fix.sql` file in your Supabase SQL Editor. This will:
- Create a trigger that automatically creates user profiles when someone signs up
- Create a function to link guest accounts to authenticated accounts
- Fix any existing users who are missing the `auth_user_id` link

**Important**: This script includes a migration that will automatically link existing authenticated users to their profiles based on email matching.

### Step 3: Update RLS Policies

Run the `supabase-fix-saved-groups-rls.sql` file in your Supabase SQL Editor. This will:
- Drop old RLS policies
- Create new RLS policies that properly check `auth_user_id`

### Step 4: Verify the Setup

Run this query to check if everything is set up correctly:

```sql
-- Check if your current auth user has a linked profile
SELECT
  au.id as auth_user_id,
  au.email as auth_email,
  pu.id as profile_id,
  pu.display_name,
  pu.is_guest,
  pu.auth_user_id as linked_auth_id
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.auth_user_id
WHERE au.email = 'YOUR_EMAIL_HERE';  -- Replace with your email
```

If you see a row with matching `auth_user_id` and `linked_auth_id`, you're good!

### Step 5: Test

1. Sign in to your account
2. Navigate to Account → My Groups
3. The page should load instantly showing your groups (or "No saved groups yet" if you haven't created any)

## Troubleshooting

### Still seeing infinite loading?

1. **Check if you're signed in**: Open browser console and look for "Auth state changed: SIGNED_IN"

2. **Check if your user has auth_user_id set**:
```sql
SELECT * FROM users WHERE email = 'YOUR_EMAIL_HERE';
```
The `auth_user_id` column should NOT be null.

3. **Manually link your account** (if the trigger didn't work):
```sql
UPDATE users
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE'),
    is_guest = false
WHERE email = 'YOUR_EMAIL_HERE';
```

4. **Check RLS policies are enabled**:
```sql
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('saved_groups', 'saved_group_members');
```
You should see policies for SELECT, INSERT, UPDATE, and DELETE.

### Guest users can't see My Groups?

This is expected! The My Groups feature requires authentication. Guests will be redirected to the signup page.

## How It Works

### Authentication Flow

1. **Sign Up**: User creates account → Trigger creates user profile with `auth_user_id` set
2. **Sign In**: User logs in → AuthContext loads profile by matching `auth_user_id`
3. **My Groups**: Page loads saved groups → RLS checks `auth_user_id` matches current user

### RLS Policy Logic

```sql
-- Example: Users can read their own saved groups
owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
```

This means:
1. Get the current authenticated user's ID: `auth.uid()`
2. Find the profile with matching `auth_user_id`
3. Check if the saved group's `owner_id` matches that profile

## Files Reference

- `supabase-auth-trigger-fix.sql` - Creates triggers and fixes existing users
- `supabase-fix-saved-groups-rls.sql` - Updates RLS policies
- `supabase-saved-groups-migration.sql` - Original table creation (already run)
- `supabase-simplify-saved-groups.sql` - Made ZIP/radius/price nullable (already run)
