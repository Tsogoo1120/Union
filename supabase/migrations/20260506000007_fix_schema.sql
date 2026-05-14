-- =============================================================
-- MIGRATION 007: Fix schema mismatches between DB and app code
-- =============================================================

-- ----------------------------------------------------------------
-- community_posts: rename body → content, make title nullable
-- App code (PostComposer, community page) uses 'content' field.
-- title was NOT NULL but PostComposer never sets it.
-- ----------------------------------------------------------------
ALTER TABLE community_posts RENAME COLUMN body TO content;
ALTER TABLE community_posts ALTER COLUMN title DROP NOT NULL;
ALTER TABLE community_posts ALTER COLUMN title SET DEFAULT NULL;

-- ----------------------------------------------------------------
-- comments: rename body → content
-- App code queries 'content' but DB had 'body'.
-- ----------------------------------------------------------------
ALTER TABLE comments RENAME COLUMN body TO content;

-- ----------------------------------------------------------------
-- lessons: add missing columns used by user-facing pages
-- App queries: description, video_url, thumbnail_url, duration_minutes
-- ----------------------------------------------------------------
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description     TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url       TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS thumbnail_url   TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
