-- =============================================================
-- MANIFEST — Full Schema (single file, fresh database)
-- Run this once in Supabase SQL Editor.
-- Order: extensions → functions → tables → triggers → RLS → storage → seed
-- =============================================================


-- ----------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ----------------------------------------------------------------
-- 2. ENUM TYPES
-- ----------------------------------------------------------------
CREATE TYPE user_role           AS ENUM ('user', 'admin');
CREATE TYPE subscription_status AS ENUM ('inactive', 'pending', 'active', 'expired');
CREATE TYPE payment_status      AS ENUM ('pending', 'approved', 'denied');


-- ----------------------------------------------------------------
-- 3. TABLES
-- ----------------------------------------------------------------

CREATE TABLE profiles (
  id                      UUID                NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name               TEXT,
  email                   TEXT                NOT NULL,
  role                    user_role           NOT NULL DEFAULT 'user',
  subscription_status     subscription_status NOT NULL DEFAULT 'inactive',
  subscription_expires_at TIMESTAMPTZ,
  created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role                ON profiles(role);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX idx_profiles_email               ON profiles(email);


CREATE TABLE payments (
  id              UUID           NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID           NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  screenshot_path TEXT           NOT NULL,
  status          payment_status NOT NULL DEFAULT 'pending',
  amount          NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  bank_reference  TEXT,
  admin_note      TEXT,
  submitted_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,
  reviewed_by     UUID           REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_payments_user_id      ON payments(user_id);
CREATE INDEX idx_payments_status       ON payments(status);
CREATE INDEX idx_payments_submitted_at ON payments(submitted_at DESC);


CREATE TABLE lessons (
  id             UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  slug           TEXT        NOT NULL,
  body           TEXT        NOT NULL,
  category       TEXT        NOT NULL,
  thumbnail_path TEXT,
  is_published   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT lessons_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_lessons_slug         ON lessons(slug);
CREATE INDEX idx_lessons_category     ON lessons(category);
CREATE INDEX idx_lessons_is_published ON lessons(is_published);


CREATE TABLE zodiac_signs (
  id           UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  symbol       TEXT,
  date_range   TEXT,
  description  TEXT        NOT NULL,
  image_path   TEXT,
  audio_path   TEXT,
  is_published BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zodiac_signs_name_unique UNIQUE (name)
);

CREATE INDEX idx_zodiac_signs_name         ON zodiac_signs(name);
CREATE INDEX idx_zodiac_signs_is_published ON zodiac_signs(is_published);


CREATE TABLE psychology_tests (
  id           UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL,
  description  TEXT,
  questions    JSONB       NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT psychology_tests_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_psychology_tests_slug         ON psychology_tests(slug);
CREATE INDEX idx_psychology_tests_is_published ON psychology_tests(is_published);


CREATE TABLE test_results (
  id             UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_id        UUID        NOT NULL REFERENCES psychology_tests(id) ON DELETE CASCADE,
  answers        JSONB       NOT NULL DEFAULT '{}'::jsonb,
  result_summary TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_test_results_user_id   ON test_results(user_id);
CREATE INDEX idx_test_results_test_id   ON test_results(test_id);
CREATE INDEX idx_test_results_user_test ON test_results(user_id, test_id);


CREATE TABLE community_posts (
  id           UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  body         TEXT        NOT NULL,
  image_path   TEXT,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_community_posts_user_id      ON community_posts(user_id);
CREATE INDEX idx_community_posts_is_published ON community_posts(is_published);
CREATE INDEX idx_community_posts_created_at   ON community_posts(created_at DESC);


CREATE TABLE comments (
  id         UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);


-- ----------------------------------------------------------------
-- 4. HELPER FUNCTIONS
-- Defined before triggers and RLS policies that call them.
-- SECURITY DEFINER + fixed search_path avoids recursive RLS on profiles.
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;


CREATE OR REPLACE FUNCTION public.is_active_subscriber()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND (
        role = 'admin'
        OR (
          subscription_status = 'active'
          AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
        )
      )
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_active_subscriber() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_active_subscriber() TO authenticated;


-- ----------------------------------------------------------------
-- 5. TRIGGER FUNCTIONS
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role (no JWT): allow unrestricted updates.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Admins may change any field.
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Regular users: block sensitive field mutations.
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'permission denied: cannot change role';
  END IF;

  IF NEW.subscription_status IS DISTINCT FROM OLD.subscription_status THEN
    RAISE EXCEPTION 'permission denied: cannot change subscription_status';
  END IF;

  IF NEW.subscription_expires_at IS DISTINCT FROM OLD.subscription_expires_at THEN
    RAISE EXCEPTION 'permission denied: cannot change subscription_expires_at';
  END IF;

  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    'user',
    'inactive'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;


-- ----------------------------------------------------------------
-- 6. TRIGGERS
-- ----------------------------------------------------------------

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_zodiac_signs_updated_at
  BEFORE UPDATE ON zodiac_signs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_psychology_tests_updated_at
  BEFORE UPDATE ON psychology_tests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_protect_profile_sensitive_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_sensitive_fields();

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ----------------------------------------------------------------
-- 7. ROW LEVEL SECURITY — Enable
-- ----------------------------------------------------------------

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_signs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments         ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------
-- 8. RLS POLICIES
-- ----------------------------------------------------------------

-- PROFILES
CREATE POLICY "profiles: users read own, admins read all"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles: admin insert"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "profiles: users update own"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: admin update any"
  ON profiles FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "profiles: admin delete"
  ON profiles FOR DELETE TO authenticated
  USING (public.is_admin());


-- PAYMENTS
CREATE POLICY "payments: users read own, admins read all"
  ON payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "payments: users insert own"
  ON payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payments: admin update"
  ON payments FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- No DELETE policy — payments are a permanent audit trail.


-- LESSONS
CREATE POLICY "lessons: active subscribers read published, admins read all"
  ON lessons FOR SELECT TO authenticated
  USING (
    (is_published = TRUE AND public.is_active_subscriber())
    OR public.is_admin()
  );

CREATE POLICY "lessons: admin insert"
  ON lessons FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "lessons: admin update"
  ON lessons FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "lessons: admin delete"
  ON lessons FOR DELETE TO authenticated
  USING (public.is_admin());


-- ZODIAC_SIGNS
CREATE POLICY "zodiac_signs: active subscribers read published, admins read all"
  ON zodiac_signs FOR SELECT TO authenticated
  USING (
    (is_published = TRUE AND public.is_active_subscriber())
    OR public.is_admin()
  );

CREATE POLICY "zodiac_signs: admin insert"
  ON zodiac_signs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "zodiac_signs: admin update"
  ON zodiac_signs FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "zodiac_signs: admin delete"
  ON zodiac_signs FOR DELETE TO authenticated
  USING (public.is_admin());


-- PSYCHOLOGY_TESTS
CREATE POLICY "psychology_tests: active subscribers read published, admins read all"
  ON psychology_tests FOR SELECT TO authenticated
  USING (
    (is_published = TRUE AND public.is_active_subscriber())
    OR public.is_admin()
  );

CREATE POLICY "psychology_tests: admin insert"
  ON psychology_tests FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "psychology_tests: admin update"
  ON psychology_tests FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "psychology_tests: admin delete"
  ON psychology_tests FOR DELETE TO authenticated
  USING (public.is_admin());


-- TEST_RESULTS
CREATE POLICY "test_results: users read own, admins read all"
  ON test_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "test_results: users insert own"
  ON test_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "test_results: admin update"
  ON test_results FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "test_results: admin delete"
  ON test_results FOR DELETE TO authenticated
  USING (public.is_admin());


-- COMMUNITY_POSTS
CREATE POLICY "community_posts: active subscribers read published, admins read all"
  ON community_posts FOR SELECT TO authenticated
  USING (
    (is_published = TRUE AND public.is_active_subscriber())
    OR public.is_admin()
  );

CREATE POLICY "community_posts: active subscribers insert own"
  ON community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_active_subscriber());

CREATE POLICY "community_posts: users update own, admins update any"
  ON community_posts FOR UPDATE TO authenticated
  USING  (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "community_posts: users delete own, admins delete any"
  ON community_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());


-- COMMENTS
CREATE POLICY "comments: active subscribers read, admins read all"
  ON comments FOR SELECT TO authenticated
  USING (public.is_active_subscriber() OR public.is_admin());

CREATE POLICY "comments: active subscribers insert own"
  ON comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_active_subscriber());

CREATE POLICY "comments: users update own, admins update any"
  ON comments FOR UPDATE TO authenticated
  USING  (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "comments: users delete own, admins delete any"
  ON comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());


-- ----------------------------------------------------------------
-- 9. STORAGE BUCKETS
-- ----------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'payment-screenshots',
    'payment-screenshots',
    FALSE,
    5242880,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'zodiac-images',
    'zodiac-images',
    TRUE,
    10485760,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'lesson-thumbnails',
    'lesson-thumbnails',
    TRUE,
    5242880,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'zodiac-audio',
    'zodiac-audio',
    FALSE,
    52428800,
    ARRAY['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm']
  ),
  (
    'community-images',
    'community-images',
    FALSE,
    10485760,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------
-- 10. STORAGE POLICIES
-- ----------------------------------------------------------------

-- payment-screenshots (PRIVATE)
CREATE POLICY "payment-screenshots: users upload to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'payment-screenshots'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "payment-screenshots: users read own, admins read all"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-screenshots'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin()
    )
  );

CREATE POLICY "payment-screenshots: admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'payment-screenshots'
    AND public.is_admin()
  );


-- zodiac-images (PUBLIC read)
CREATE POLICY "zodiac-images: public read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'zodiac-images');

CREATE POLICY "zodiac-images: admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'zodiac-images' AND public.is_admin());

CREATE POLICY "zodiac-images: admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING  (bucket_id = 'zodiac-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'zodiac-images' AND public.is_admin());

CREATE POLICY "zodiac-images: admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'zodiac-images' AND public.is_admin());


-- lesson-thumbnails (PUBLIC read)
CREATE POLICY "lesson-thumbnails: public read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'lesson-thumbnails');

CREATE POLICY "lesson-thumbnails: admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lesson-thumbnails' AND public.is_admin());

CREATE POLICY "lesson-thumbnails: admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING  (bucket_id = 'lesson-thumbnails' AND public.is_admin())
  WITH CHECK (bucket_id = 'lesson-thumbnails' AND public.is_admin());

CREATE POLICY "lesson-thumbnails: admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'lesson-thumbnails' AND public.is_admin());


-- zodiac-audio (PROTECTED)
CREATE POLICY "zodiac-audio: active subscribers and admins read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'zodiac-audio'
    AND public.is_active_subscriber()
  );

CREATE POLICY "zodiac-audio: admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'zodiac-audio' AND public.is_admin());

CREATE POLICY "zodiac-audio: admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING  (bucket_id = 'zodiac-audio' AND public.is_admin())
  WITH CHECK (bucket_id = 'zodiac-audio' AND public.is_admin());

CREATE POLICY "zodiac-audio: admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'zodiac-audio' AND public.is_admin());


-- community-images (PROTECTED)
CREATE POLICY "community-images: active subscribers and admins read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'community-images'
    AND public.is_active_subscriber()
  );

CREATE POLICY "community-images: active subscribers upload to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'community-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND public.is_active_subscriber()
  );

CREATE POLICY "community-images: users delete own, admins delete any"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'community-images'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin()
    )
  );


-- ----------------------------------------------------------------
-- 11. SEED DATA — 12 Zodiac Signs
-- is_published = FALSE by default; flip to TRUE via admin panel.
-- ----------------------------------------------------------------

INSERT INTO zodiac_signs (name, symbol, date_range, description, is_published) VALUES
  ('Aries',       '♈', 'March 21 – April 19',      'Aries is the first sign of the zodiac, known for its boldness, ambition, and pioneering spirit. Ruled by Mars, Aries charges forward with confidence and fearless energy.',       FALSE),
  ('Taurus',      '♉', 'April 20 – May 20',         'Taurus is an earth sign ruled by Venus, embodying patience, reliability, and a deep appreciation for beauty, comfort, and the finer things in life.',                          FALSE),
  ('Gemini',      '♊', 'May 21 – June 20',          'Gemini is an air sign ruled by Mercury, celebrated for its quick wit, adaptability, and curiosity. Geminis are natural communicators who thrive on variety and connection.',     FALSE),
  ('Cancer',      '♋', 'June 21 – July 22',         'Cancer is a water sign ruled by the Moon, deeply intuitive and sentimental. Cancers are nurturing and empathetic, with a powerful bond to home and family.',                    FALSE),
  ('Leo',         '♌', 'July 23 – August 22',       'Leo is a fire sign ruled by the Sun, radiating warmth, creativity, and natural leadership. Leos are generous, dramatic, and fiercely loyal to those they love.',               FALSE),
  ('Virgo',       '♍', 'August 23 – September 22',  'Virgo is an earth sign ruled by Mercury, known for its analytical mind, attention to detail, and dedication to service. Virgos strive for perfection in all they do.',          FALSE),
  ('Libra',       '♎', 'September 23 – October 22', 'Libra is an air sign ruled by Venus, representing balance, harmony, and justice. Libras are diplomatic, charming, and deeply committed to fairness in all relationships.',       FALSE),
  ('Scorpio',     '♏', 'October 23 – November 21',  'Scorpio is a water sign ruled by Pluto and Mars, known for its intensity, depth, and transformative power. Scorpios are passionate, perceptive, and fiercely determined.',      FALSE),
  ('Sagittarius', '♐', 'November 22 – December 21', 'Sagittarius is a fire sign ruled by Jupiter, the sign of the explorer and philosopher. Sagittarians are optimistic, adventurous, and always seeking truth and meaning.',        FALSE),
  ('Capricorn',   '♑', 'December 22 – January 19',  'Capricorn is an earth sign ruled by Saturn, embodying discipline, ambition, and perseverance. Capricorns are patient builders who set lofty goals and steadily achieve them.',  FALSE),
  ('Aquarius',    '♒', 'January 20 – February 18',  'Aquarius is an air sign ruled by Uranus, the visionary of the zodiac. Aquarians are innovative, humanitarian, and fiercely independent, driven by ideals of progress.',         FALSE),
  ('Pisces',      '♓', 'February 19 – March 20',    'Pisces is a water sign ruled by Neptune, the most intuitive and empathetic of all signs. Pisceans are imaginative, compassionate, and deeply connected to the emotional realm.', FALSE)
ON CONFLICT (name) DO NOTHING;
