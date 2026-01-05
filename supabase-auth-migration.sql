-- ChickenTinders Authentication Migration
-- Run this in your Supabase SQL Editor to add authentication support

-- ===================================
-- UPDATE: Users table to support auth
-- ===================================

-- Add auth_user_id column to link to Supabase Auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_guest ON users(is_guest);

-- Add unique constraint for auth_user_id (one profile per auth user)
ALTER TABLE users ADD CONSTRAINT unique_auth_user_id UNIQUE (auth_user_id);

-- ===================================
-- NEW: User Preferences Table
-- ===================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_radius INTEGER DEFAULT 10,
  default_price_tier INTEGER DEFAULT 2,
  default_dietary_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for preferences
CREATE POLICY "Users can read own preferences" ON user_preferences
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ===================================
-- NEW: Group History View
-- ===================================
-- Add creator_id to groups table to track who created the group
ALTER TABLE groups ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);

-- ===================================
-- FUNCTION: Auto-create user profile on signup
-- ===================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, display_name, is_guest)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- TRIGGER: Create profile on auth signup
-- ===================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===================================
-- FUNCTION: Link guest account to auth user
-- ===================================
CREATE OR REPLACE FUNCTION link_guest_to_auth_user(
  guest_user_id UUID,
  auth_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update the guest user to link to auth user
  UPDATE users
  SET
    auth_user_id = link_guest_to_auth_user.auth_user_id,
    is_guest = FALSE,
    email = (SELECT email FROM auth.users WHERE id = link_guest_to_auth_user.auth_user_id)
  WHERE id = guest_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- UPDATE: RLS Policies for authenticated users
-- ===================================

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (
    auth_user_id = auth.uid() OR is_guest = TRUE
  );

-- Users can delete their own profile (for account deletion)
CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE USING (auth_user_id = auth.uid());

-- ===================================
-- COMMENTS
-- ===================================
COMMENT ON COLUMN users.auth_user_id IS 'Links to Supabase Auth user (NULL for guest users)';
COMMENT ON COLUMN users.is_guest IS 'TRUE for guest users, FALSE for authenticated users';
COMMENT ON COLUMN users.email IS 'Email for authenticated users (NULL for guests)';
COMMENT ON TABLE user_preferences IS 'Saved preferences for authenticated users';
COMMENT ON COLUMN groups.creator_id IS 'User who created the group (for history tracking)';
