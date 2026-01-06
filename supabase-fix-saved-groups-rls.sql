-- Fix: Update Saved Groups RLS Policies
-- Run this to fix the infinite loading issue on My Groups page

-- First, let's ensure the users table has the necessary columns
-- (These may already exist if you have authentication working)
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Now, let's drop the old RLS policies and create simpler ones
-- that work with the current user context

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own saved groups" ON saved_groups;
DROP POLICY IF EXISTS "Users can create own saved groups" ON saved_groups;
DROP POLICY IF EXISTS "Users can update own saved groups" ON saved_groups;
DROP POLICY IF EXISTS "Users can delete own saved groups" ON saved_groups;
DROP POLICY IF EXISTS "Users can read members of own saved groups" ON saved_group_members;
DROP POLICY IF EXISTS "Users can add members to own saved groups" ON saved_group_members;
DROP POLICY IF EXISTS "Users can update members in own saved groups" ON saved_group_members;
DROP POLICY IF EXISTS "Users can delete members from own saved groups" ON saved_group_members;

-- Create new, simpler policies

-- Saved Groups Policies
-- Allow authenticated users to see their own saved groups
CREATE POLICY "Users can read own saved groups" ON saved_groups
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Allow authenticated users to create saved groups
CREATE POLICY "Users can create own saved groups" ON saved_groups
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Allow authenticated users to update their own saved groups
CREATE POLICY "Users can update own saved groups" ON saved_groups
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Allow authenticated users to delete their own saved groups
CREATE POLICY "Users can delete own saved groups" ON saved_groups
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Saved Group Members Policies
-- Allow users to see members of their own saved groups
CREATE POLICY "Users can read members of own saved groups" ON saved_group_members
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    saved_group_id IN (
      SELECT id FROM saved_groups
      WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Allow users to add members to their own saved groups
CREATE POLICY "Users can add members to own saved groups" ON saved_group_members
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    saved_group_id IN (
      SELECT id FROM saved_groups
      WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Allow users to update members in their own saved groups
CREATE POLICY "Users can update members in own saved groups" ON saved_group_members
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    saved_group_id IN (
      SELECT id FROM saved_groups
      WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Allow users to delete members from their own saved groups
CREATE POLICY "Users can delete members from own saved groups" ON saved_group_members
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    saved_group_id IN (
      SELECT id FROM saved_groups
      WHERE owner_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Add helpful comments
COMMENT ON COLUMN users.auth_user_id IS 'Links to Supabase auth.users.id for authenticated users';
COMMENT ON COLUMN users.is_guest IS 'True if user is a guest (not authenticated)';
COMMENT ON COLUMN users.email IS 'User email address (for authenticated users)';
