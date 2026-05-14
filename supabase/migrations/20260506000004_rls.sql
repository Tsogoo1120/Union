-- =============================================================
-- MIGRATION 004: Row Level Security — Enable + Policies
-- =============================================================


-- ----------------------------------------------------------------
-- Enable RLS on all application tables
-- ----------------------------------------------------------------
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_signs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments         ENABLE ROW LEVEL SECURITY;


-- ================================================================
-- PROFILES
-- SELECT  : own row, or admin reads all
-- INSERT  : blocked for regular users (trigger handles creation);
--           admin escape-hatch kept for seeding/tooling
-- UPDATE  : own row (sensitive fields blocked by trigger); admin any
-- DELETE  : admin only
-- ================================================================

CREATE POLICY "profiles: users read own, admins read all"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles: admin insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "profiles: users update own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: admin update any"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "profiles: admin delete"
  ON profiles FOR DELETE
  TO authenticated
  USING (is_admin());


-- ================================================================
-- PAYMENTS
-- SELECT  : own rows, or admin reads all
-- INSERT  : authenticated users (user_id must equal auth.uid())
-- UPDATE  : admin only (review / approve / deny)
-- DELETE  : nobody — payments are a permanent audit trail
-- ================================================================

CREATE POLICY "payments: users read own, admins read all"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "payments: users insert own"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payments: admin update"
  ON payments FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- No DELETE policy — intentionally omitted to protect the audit trail.


-- ================================================================
-- LESSONS
-- SELECT  : published rows for active subscribers; admins see all
-- INSERT  : admin only
-- UPDATE  : admin only
-- DELETE  : admin only
-- ================================================================

CREATE POLICY "lessons: active subscribers read published, admins read all"
  ON lessons FOR SELECT
  TO authenticated
  USING (
    (is_published = TRUE AND is_active_subscriber())
    OR is_admin()
  );

CREATE POLICY "lessons: admin insert"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "lessons: admin update"
  ON lessons FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "lessons: admin delete"
  ON lessons FOR DELETE
  TO authenticated
  USING (is_admin());


-- ================================================================
-- ZODIAC_SIGNS
-- Same access pattern as lessons.
-- ================================================================

CREATE POLICY "zodiac_signs: active subscribers read published, admins read all"
  ON zodiac_signs FOR SELECT
  TO authenticated
  USING (
    (is_published = TRUE AND is_active_subscriber())
    OR is_admin()
  );

CREATE POLICY "zodiac_signs: admin insert"
  ON zodiac_signs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "zodiac_signs: admin update"
  ON zodiac_signs FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "zodiac_signs: admin delete"
  ON zodiac_signs FOR DELETE
  TO authenticated
  USING (is_admin());


-- ================================================================
-- PSYCHOLOGY_TESTS
-- Same access pattern as lessons.
-- ================================================================

CREATE POLICY "psychology_tests: active subscribers read published, admins read all"
  ON psychology_tests FOR SELECT
  TO authenticated
  USING (
    (is_published = TRUE AND is_active_subscriber())
    OR is_admin()
  );

CREATE POLICY "psychology_tests: admin insert"
  ON psychology_tests FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "psychology_tests: admin update"
  ON psychology_tests FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "psychology_tests: admin delete"
  ON psychology_tests FOR DELETE
  TO authenticated
  USING (is_admin());


-- ================================================================
-- TEST_RESULTS
-- SELECT  : own rows, or admin reads all
-- INSERT  : users insert their own results
-- UPDATE  : admin only (e.g., re-scoring)
-- DELETE  : admin only
-- ================================================================

CREATE POLICY "test_results: users read own, admins read all"
  ON test_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "test_results: users insert own"
  ON test_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "test_results: admin update"
  ON test_results FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "test_results: admin delete"
  ON test_results FOR DELETE
  TO authenticated
  USING (is_admin());


-- ================================================================
-- COMMUNITY_POSTS
-- SELECT  : published posts for active subscribers; admins see all
-- INSERT  : active subscribers only (user_id must equal auth.uid())
-- UPDATE  : own post, or admin any
-- DELETE  : own post, or admin any
-- ================================================================

CREATE POLICY "community_posts: active subscribers read published, admins read all"
  ON community_posts FOR SELECT
  TO authenticated
  USING (
    (is_published = TRUE AND is_active_subscriber())
    OR is_admin()
  );

CREATE POLICY "community_posts: active subscribers insert own"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_active_subscriber());

CREATE POLICY "community_posts: users update own, admins update any"
  ON community_posts FOR UPDATE
  TO authenticated
  USING  (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "community_posts: users delete own, admins delete any"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());


-- ================================================================
-- COMMENTS
-- SELECT  : active subscribers and admins
-- INSERT  : active subscribers only (user_id must equal auth.uid())
-- UPDATE  : own comment, or admin any
-- DELETE  : own comment, or admin any
-- ================================================================

CREATE POLICY "comments: active subscribers read, admins read all"
  ON comments FOR SELECT
  TO authenticated
  USING (is_active_subscriber() OR is_admin());

CREATE POLICY "comments: active subscribers insert own"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_active_subscriber());

CREATE POLICY "comments: users update own, admins update any"
  ON comments FOR UPDATE
  TO authenticated
  USING  (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "comments: users delete own, admins delete any"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());
