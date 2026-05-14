-- =============================================================
-- MIGRATION 008: Fix zodiac_signs schema to match app code
-- =============================================================
-- App code queries: slug, image_url, content
-- DB has:           (no slug), image_path, description
-- This migration adds the missing columns and renames to match.

-- Add slug column (app uses it for URL routing)
ALTER TABLE zodiac_signs ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_zodiac_signs_slug ON zodiac_signs(slug);

-- Add content column (app queries 'content' for the detail page body text)
ALTER TABLE zodiac_signs ADD COLUMN IF NOT EXISTS content TEXT;

-- Add image_url column (app queries 'image_url', DB had 'image_path')
-- Keep image_path for backward compat; app only reads image_url.
ALTER TABLE zodiac_signs ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Backfill: copy image_path values into image_url where image_url is still NULL
UPDATE zodiac_signs SET image_url = image_path WHERE image_url IS NULL AND image_path IS NOT NULL;

-- Backfill: copy description into content where content is still NULL
UPDATE zodiac_signs SET content = description WHERE content IS NULL AND description IS NOT NULL;

-- Backfill: generate slug from name where slug is still NULL
UPDATE zodiac_signs
SET slug = LOWER(REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL AND name IS NOT NULL;
