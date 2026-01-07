-- Fix matches table RLS policies to allow upsert operations
-- This adds UPDATE policy that was missing, causing 403 errors

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read matches" ON matches;
DROP POLICY IF EXISTS "Anyone can create matches" ON matches;
DROP POLICY IF EXISTS "Anyone can update matches" ON matches;

-- Recreate policies with proper permissions
CREATE POLICY "Anyone can read matches" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create matches" ON matches
  FOR INSERT WITH CHECK (true);

-- Add missing UPDATE policy (needed for upsert operations)
CREATE POLICY "Anyone can update matches" ON matches
  FOR UPDATE USING (true) WITH CHECK (true);
