-- Simplify Saved Groups: Remove redundant session settings
-- Keep only name and members in saved groups
-- Session settings (ZIP, radius, price) should be set when starting each session

-- Make location/preference columns nullable (for existing groups)
ALTER TABLE saved_groups ALTER COLUMN zip_code DROP NOT NULL;
ALTER TABLE saved_groups ALTER COLUMN radius DROP NOT NULL;
ALTER TABLE saved_groups ALTER COLUMN price_tier DROP NOT NULL;

-- Add default values for backward compatibility
ALTER TABLE saved_groups ALTER COLUMN zip_code SET DEFAULT NULL;
ALTER TABLE saved_groups ALTER COLUMN radius SET DEFAULT NULL;
ALTER TABLE saved_groups ALTER COLUMN price_tier SET DEFAULT NULL;

-- Update comment to reflect new purpose
COMMENT ON TABLE saved_groups IS 'Templates for recurring dining groups - stores group name and member list only';
COMMENT ON COLUMN saved_groups.zip_code IS 'DEPRECATED: Session setting, not needed in saved groups';
COMMENT ON COLUMN saved_groups.radius IS 'DEPRECATED: Session setting, not needed in saved groups';
COMMENT ON COLUMN saved_groups.price_tier IS 'DEPRECATED: Session setting, not needed in saved groups';
