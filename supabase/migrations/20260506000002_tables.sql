-- =============================================================
-- MIGRATION 002: Tables, Constraints, and Indexes
-- =============================================================

-- ----------------------------------------------------------------
-- ENUM TYPES
-- ----------------------------------------------------------------
CREATE TYPE user_role            AS ENUM ('user', 'admin');
CREATE TYPE subscription_status  AS ENUM ('inactive', 'pending', 'active', 'expired');
CREATE TYPE payment_status       AS ENUM ('pending', 'approved', 'denied');


-- ----------------------------------------------------------------
-- TABLE: profiles
-- One row per auth.users row; auto-created by trigger (migration 003).
-- ----------------------------------------------------------------
CREATE TABLE profiles (
  id                      UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name               TEXT,
  email                   TEXT        NOT NULL,
  role                    user_role   NOT NULL DEFAULT 'user',
  subscription_status     subscription_status NOT NULL DEFAULT 'inactive',
  subscription_expires_at TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role                ON profiles(role);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX idx_profiles_email               ON profiles(email);


-- ----------------------------------------------------------------
-- TABLE: payments
-- Manual screenshot-based payment submissions.
-- reviewed_by references the admin who processed the payment;
-- ON DELETE SET NULL keeps the audit record if the admin leaves.
-- ----------------------------------------------------------------
CREATE TABLE payments (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX idx_payments_user_id     ON payments(user_id);
CREATE INDEX idx_payments_status      ON payments(status);
CREATE INDEX idx_payments_submitted_at ON payments(submitted_at DESC);


-- ----------------------------------------------------------------
-- TABLE: lessons
-- Premium educational content managed by admins.
-- ----------------------------------------------------------------
CREATE TABLE lessons (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
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


-- ----------------------------------------------------------------
-- TABLE: zodiac_signs
-- Zodiac content with optional image and audio assets.
-- ----------------------------------------------------------------
CREATE TABLE zodiac_signs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
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


-- ----------------------------------------------------------------
-- TABLE: psychology_tests
-- Tests with a JSONB question array:
--   [{ id, text, options: [{ value, label }] }, ...]
-- ----------------------------------------------------------------
CREATE TABLE psychology_tests (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
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


-- ----------------------------------------------------------------
-- TABLE: test_results
-- User answers + computed summary for a single test attempt.
-- Cascade-deletes if the parent test or user profile is removed.
-- ----------------------------------------------------------------
CREATE TABLE test_results (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_id        UUID        NOT NULL REFERENCES psychology_tests(id) ON DELETE CASCADE,
  answers        JSONB       NOT NULL DEFAULT '{}'::jsonb,
  result_summary TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_test_results_user_id   ON test_results(user_id);
CREATE INDEX idx_test_results_test_id   ON test_results(test_id);
CREATE INDEX idx_test_results_user_test ON test_results(user_id, test_id);


-- ----------------------------------------------------------------
-- TABLE: community_posts
-- User-generated posts visible to active subscribers.
-- ----------------------------------------------------------------
CREATE TABLE community_posts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
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


-- ----------------------------------------------------------------
-- TABLE: comments
-- Comments on community posts.
-- Cascade-deletes with both the post and the commenter's profile.
-- ----------------------------------------------------------------
CREATE TABLE comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
