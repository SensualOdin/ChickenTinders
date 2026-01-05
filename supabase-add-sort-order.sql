-- Add sort_order column to matches table to preserve match ranking
-- Run this in your Supabase SQL Editor

ALTER TABLE matches
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_matches_sort_order ON matches(group_id, sort_order);

-- Add comment
COMMENT ON COLUMN matches.sort_order IS 'Ranking order of matches (0=best, 1=second, etc)';
