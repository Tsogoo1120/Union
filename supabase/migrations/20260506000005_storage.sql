-- =============================================================
-- MIGRATION 005: Storage Buckets and Policies
-- =============================================================
-- Folder convention for user-scoped buckets:
--   {user_id}/{filename}
-- storage.foldername(name) splits the object path by '/' and
-- returns it as text[]. Index [1] is the first path segment.
-- =============================================================


-- ----------------------------------------------------------------
-- CREATE BUCKETS
-- ----------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  -- Private: payment screenshots uploaded by users
  (
    'payment-screenshots',
    'payment-screenshots',
    FALSE,
    5242880,   -- 5 MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  -- Public: zodiac sign images (no auth required to read)
  (
    'zodiac-images',
    'zodiac-images',
    TRUE,
    10485760,  -- 10 MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  -- Public: lesson thumbnail images (no auth required to read)
  (
    'lesson-thumbnails',
    'lesson-thumbnails',
    TRUE,
    5242880,   -- 5 MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  -- Protected: zodiac audio — active subscribers and admins only
  (
    'zodiac-audio',
    'zodiac-audio',
    FALSE,
    52428800,  -- 50 MB
    ARRAY['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm']
  ),
  -- Protected: community post images — active subscribers and admins only
  (
    'community-images',
    'community-images',
    FALSE,
    10485760,  -- 10 MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- BUCKET: payment-screenshots  (PRIVATE)
-- Read  : own folder or admin
-- Write : own folder only
-- Delete: admin only
-- ================================================================

CREATE POLICY "payment-screenshots: users upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-screenshots'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "payment-screenshots: users read own, admins read all"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-screenshots'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR is_admin()
    )
  );

CREATE POLICY "payment-screenshots: admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'payment-screenshots'
    AND is_admin()
  );


-- ================================================================
-- BUCKET: zodiac-images  (PUBLIC read)
-- Read  : everyone (bucket is public, but policy makes it explicit)
-- Write : admin only
-- ================================================================

CREATE POLICY "zodiac-images: public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'zodiac-images');

CREATE POLICY "zodiac-images: admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'zodiac-images' AND is_admin());

CREATE POLICY "zodiac-images: admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING  (bucket_id = 'zodiac-images' AND is_admin())
  WITH CHECK (bucket_id = 'zodiac-images' AND is_admin());

CREATE POLICY "zodiac-images: admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'zodiac-images' AND is_admin());


-- ================================================================
-- BUCKET: lesson-thumbnails  (PUBLIC read)
-- Read  : everyone
-- Write : admin only
-- ================================================================

CREATE POLICY "lesson-thumbnails: public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'lesson-thumbnails');

CREATE POLICY "lesson-thumbnails: admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lesson-thumbnails' AND is_admin());

CREATE POLICY "lesson-thumbnails: admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING  (bucket_id = 'lesson-thumbnails' AND is_admin())
  WITH CHECK (bucket_id = 'lesson-thumbnails' AND is_admin());

CREATE POLICY "lesson-thumbnails: admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lesson-thumbnails' AND is_admin());


-- ================================================================
-- BUCKET: zodiac-audio  (PROTECTED)
-- Read  : active subscribers and admins
-- Write : admin only
-- ================================================================

CREATE POLICY "zodiac-audio: active subscribers and admins read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'zodiac-audio'
    AND is_active_subscriber()
  );

CREATE POLICY "zodiac-audio: admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'zodiac-audio' AND is_admin());

CREATE POLICY "zodiac-audio: admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING  (bucket_id = 'zodiac-audio' AND is_admin())
  WITH CHECK (bucket_id = 'zodiac-audio' AND is_admin());

CREATE POLICY "zodiac-audio: admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'zodiac-audio' AND is_admin());


-- ================================================================
-- BUCKET: community-images  (PROTECTED)
-- Read  : active subscribers and admins
-- Write : active subscribers to own folder; admins anywhere
-- Delete: own folder or admin
-- ================================================================

CREATE POLICY "community-images: active subscribers and admins read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'community-images'
    AND is_active_subscriber()
  );

CREATE POLICY "community-images: active subscribers upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'community-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND is_active_subscriber()
  );

CREATE POLICY "community-images: users delete own, admins delete any"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'community-images'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR is_admin()
    )
  );
