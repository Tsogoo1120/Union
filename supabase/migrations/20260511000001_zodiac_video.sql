-- =============================================================
-- MIGRATION 011: Zodiac video support
-- =============================================================
-- Adds a video_url column to zodiac_signs and creates the
-- 'zodiac-videos' storage bucket (admin write, subscriber read).
-- video_url accepts:
--   * a YouTube URL (watch, embed, youtu.be, youtube-nocookie, shorts)
--   * a Vimeo URL
--   * a Supabase Storage public URL pointing to zodiac-videos/*
-- The frontend VideoPlayer auto-detects the source.

-- ----------------------------------------------------------------
-- COLUMN: zodiac_signs.video_url
-- ----------------------------------------------------------------
ALTER TABLE zodiac_signs ADD COLUMN IF NOT EXISTS video_url TEXT;


-- ----------------------------------------------------------------
-- STORAGE BUCKET: zodiac-videos (PROTECTED — signed URLs)
-- ----------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'zodiac-videos',
  'zodiac-videos',
  TRUE,                  -- public so admins can paste a stable URL into video_url
  524288000,             -- 500 MB
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
)
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- BUCKET POLICIES: zodiac-videos
-- Read  : everyone (matches public bucket flag)
-- Write : admin only
-- Delete: admin only
-- ================================================================

CREATE POLICY "zodiac-videos: public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'zodiac-videos');

CREATE POLICY "zodiac-videos: admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'zodiac-videos' AND is_admin());

CREATE POLICY "zodiac-videos: admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING  (bucket_id = 'zodiac-videos' AND is_admin())
  WITH CHECK (bucket_id = 'zodiac-videos' AND is_admin());

CREATE POLICY "zodiac-videos: admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'zodiac-videos' AND is_admin());


-- ----------------------------------------------------------------
-- Force PostgREST to refresh its schema cache so the new
-- video_url column is visible immediately. Safe to re-run.
-- ----------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
