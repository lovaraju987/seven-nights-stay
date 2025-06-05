-- Migration: Add missing columns to hostels table for new admin form fields
ALTER TABLE hostels
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS reference_code text,
ADD COLUMN IF NOT EXISTS on_site_manager text,
ADD COLUMN IF NOT EXISTS primary_phone text,
ADD COLUMN IF NOT EXISTS primary_email text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS video_urls text[];

-- (Optional) If you want to keep video_url as a single field, you can skip video_urls
-- If you want to migrate existing video_url to video_urls, you can run an update statement after this migration.
