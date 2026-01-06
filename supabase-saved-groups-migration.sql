-- Migration: Add Saved Groups Feature
-- Run this in your Supabase SQL Editor
-- This allows authenticated users to save recurring groups with members

-- Saved Groups Table
CREATE TABLE IF NOT EXISTS saved_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  radius INTEGER NOT NULL DEFAULT 5, -- in miles
  price_tier INTEGER NOT NULL DEFAULT 2 CHECK (price_tier BETWEEN 1 AND 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Group Members Table
CREATE TABLE IF NOT EXISTS saved_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  saved_group_id UUID NOT NULL REFERENCES saved_groups(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  dietary_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(saved_group_id, display_name) -- Prevent duplicate names in same group
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_groups_owner_id ON saved_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_saved_group_members_group_id ON saved_group_members(saved_group_id);

-- Row Level Security (RLS) Policies
ALTER TABLE saved_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_group_members ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved groups
CREATE POLICY "Users can read own saved groups" ON saved_groups
  FOR SELECT USING (
    owner_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Users can create their own saved groups
CREATE POLICY "Users can create own saved groups" ON saved_groups
  FOR INSERT WITH CHECK (
    owner_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Users can update their own saved groups
CREATE POLICY "Users can update own saved groups" ON saved_groups
  FOR UPDATE USING (
    owner_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Users can delete their own saved groups
CREATE POLICY "Users can delete own saved groups" ON saved_groups
  FOR DELETE USING (
    owner_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Users can read members of their saved groups
CREATE POLICY "Users can read members of own saved groups" ON saved_group_members
  FOR SELECT USING (
    saved_group_id IN (
      SELECT id FROM saved_groups WHERE owner_id IN (
        SELECT id FROM users WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Users can add members to their saved groups
CREATE POLICY "Users can add members to own saved groups" ON saved_group_members
  FOR INSERT WITH CHECK (
    saved_group_id IN (
      SELECT id FROM saved_groups WHERE owner_id IN (
        SELECT id FROM users WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Users can update members in their saved groups
CREATE POLICY "Users can update members in own saved groups" ON saved_group_members
  FOR UPDATE USING (
    saved_group_id IN (
      SELECT id FROM saved_groups WHERE owner_id IN (
        SELECT id FROM users WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Users can delete members from their saved groups
CREATE POLICY "Users can delete members from own saved groups" ON saved_group_members
  FOR DELETE USING (
    saved_group_id IN (
      SELECT id FROM saved_groups WHERE owner_id IN (
        SELECT id FROM users WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_group_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
CREATE TRIGGER update_saved_groups_timestamp
  BEFORE UPDATE ON saved_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_group_timestamp();

-- Comments for documentation
COMMENT ON TABLE saved_groups IS 'Recurring groups that authenticated users can save and reuse';
COMMENT ON TABLE saved_group_members IS 'Members saved to a recurring group';
COMMENT ON COLUMN saved_groups.owner_id IS 'The authenticated user who owns this saved group';
COMMENT ON COLUMN saved_groups.price_tier IS '1=$, 2=$$, 3=$$$, 4=$$$$';
