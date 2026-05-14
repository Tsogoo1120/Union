-- =============================================================
-- MIGRATION 009: Videos table + lesson-videos storage bucket
-- =============================================================

-- ----------------------------------------------------------------
-- TABLE: videos
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS videos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  video_path  TEXT NOT NULL,
  thumbnail_path TEXT,
  category    TEXT NOT NULL DEFAULT 'General',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER set_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------
-- RLS POLICIES
-- ----------------------------------------------------------------
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "videos: admin full access"
  ON videos FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Active subscribers can read published videos
CREATE POLICY "videos: active subscribers read published"
  ON videos FOR SELECT
  TO authenticated
  USING (
    is_published = TRUE
    AND is_active_subscriber()
  );


-- ----------------------------------------------------------------
-- STORAGE BUCKET: lesson-videos (PRIVATE)
-- ----------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-videos',
  'lesson-videos',
  FALSE,
  524288000,  -- 500 MB
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
)
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- BUCKET POLICIES: lesson-videos (PRIVATE)
-- Read  : active subscribers and admins (via signed URLs)
-- Write : admin only
-- Delete: admin only
-- ================================================================

CREATE POLICY "lesson-videos: active subscribers and admins read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'lesson-videos'
    AND is_active_subscriber()
  );

CREATE POLICY "lesson-videos: admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lesson-videos' AND is_admin());

CREATE POLICY "lesson-videos: admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING  (bucket_id = 'lesson-videos' AND is_admin())
  WITH CHECK (bucket_id = 'lesson-videos' AND is_admin());

CREATE POLICY "lesson-videos: admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lesson-videos' AND is_admin());
