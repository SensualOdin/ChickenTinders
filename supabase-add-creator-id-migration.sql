-- Migration: Add creator_id to groups table
-- Run this in your Supabase SQL Editor after the main schema

-- Add creator_id column to groups table (optional, for tracking who created the group)
ALTER TABLE groups ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);

-- Comment for documentation
COMMENT ON COLUMN groups.creator_id IS 'User who created the group (optional)';
