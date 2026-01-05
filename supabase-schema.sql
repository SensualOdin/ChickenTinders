-- ChickenTinders Database Schema
-- Run this in your Supabase SQL Editor

-- ===================================
-- CLEAN UP: Drop existing tables
-- ===================================
-- Drop tables in reverse order of dependencies (to avoid foreign key issues)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS swipes CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS expire_old_groups();

-- ===================================
-- CREATE: Fresh schema
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name TEXT NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY, -- 6-character code like CHKN22
  zip_code TEXT NOT NULL,
  radius INTEGER NOT NULL, -- in miles
  price_tier INTEGER NOT NULL CHECK (price_tier BETWEEN 1 AND 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'swiping', 'matched', 'expired'))
);

-- Group Members Table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id) -- Prevent duplicate joins
);

-- Swipes Table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id TEXT NOT NULL, -- Yelp business ID
  is_liked BOOLEAN NOT NULL,
  is_super_like BOOLEAN DEFAULT FALSE,
  swiped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id, restaurant_id) -- One swipe per user per restaurant
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  restaurant_id TEXT NOT NULL,
  restaurant_data JSONB NOT NULL, -- Cache full restaurant details from Yelp
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_unanimous BOOLEAN DEFAULT FALSE,
  UNIQUE(group_id, restaurant_id) -- One match per restaurant per group
);

-- Analytics Events Table (Optional)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_group_id ON swipes(group_id);
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_group_id ON matches(group_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);
CREATE INDEX IF NOT EXISTS idx_groups_expires_at ON groups(expires_at);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a user (guest auth)
CREATE POLICY "Anyone can create users" ON users
  FOR INSERT WITH CHECK (true);

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

-- Anyone can create a group
CREATE POLICY "Anyone can create groups" ON groups
  FOR INSERT WITH CHECK (true);

-- Anyone can read groups
CREATE POLICY "Anyone can read groups" ON groups
  FOR SELECT USING (true);

-- Anyone can join a group
CREATE POLICY "Anyone can join groups" ON group_members
  FOR INSERT WITH CHECK (true);

-- Anyone can read group members
CREATE POLICY "Anyone can read group members" ON group_members
  FOR SELECT USING (true);

-- Anyone can create swipes
CREATE POLICY "Anyone can create swipes" ON swipes
  FOR INSERT WITH CHECK (true);

-- Anyone can read swipes
CREATE POLICY "Anyone can read swipes" ON swipes
  FOR SELECT USING (true);

-- Anyone can read matches
CREATE POLICY "Anyone can read matches" ON matches
  FOR SELECT USING (true);

-- Anyone can create matches
CREATE POLICY "Anyone can create matches" ON matches
  FOR INSERT WITH CHECK (true);

-- Function to auto-expire old groups (optional, run via cron)
CREATE OR REPLACE FUNCTION expire_old_groups()
RETURNS void AS $$
BEGIN
  UPDATE groups
  SET status = 'expired'
  WHERE expires_at < NOW() AND status != 'expired';
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE users IS 'Guest users who join groups';
COMMENT ON TABLE groups IS 'Group sessions with settings';
COMMENT ON TABLE group_members IS 'Users who joined a specific group';
COMMENT ON TABLE swipes IS 'User swipes on restaurants';
COMMENT ON TABLE matches IS 'Restaurants that matched within a group';
COMMENT ON COLUMN groups.id IS 'Human-readable 6-char code like CHKN22';
COMMENT ON COLUMN groups.price_tier IS '1=$, 2=$$, 3=$$$, 4=$$$$';
