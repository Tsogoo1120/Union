-- =============================================================
-- MIGRATION 003: Helper Functions and Triggers
-- Functions are defined before triggers that depend on them.
-- =============================================================


-- ----------------------------------------------------------------
-- HELPER: is_admin()
-- Returns TRUE when the calling authenticated user has role = 'admin'.
-- SECURITY DEFINER + fixed search_path: runs as the function owner
-- (postgres), bypassing RLS on profiles to avoid infinite recursion
-- when profiles itself has an RLS policy that calls is_admin().
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin()
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

-- Only authenticated users should be able to call these helpers.
REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION is_admin() TO authenticated;


-- ----------------------------------------------------------------
-- HELPER: is_active_subscriber()
-- Returns TRUE for:
--   - admins (always considered active), or
--   - users whose subscription_status = 'active' and has not expired.
-- Same SECURITY DEFINER pattern as is_admin().
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_active_subscriber()
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

REVOKE EXECUTE ON FUNCTION is_active_subscriber() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION is_active_subscriber() TO authenticated;


-- ----------------------------------------------------------------
-- TRIGGER FUNCTION: set_updated_at()
-- Keeps updated_at current on every UPDATE.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Attach to every table that has updated_at.
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_zodiac_signs_updated_at
  BEFORE UPDATE ON zodiac_signs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_psychology_tests_updated_at
  BEFORE UPDATE ON psychology_tests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ----------------------------------------------------------------
-- TRIGGER FUNCTION: protect_profile_sensitive_fields()
-- Prevents regular authenticated users from changing role,
-- subscription_status, or subscription_expires_at.
-- Service-role calls (auth.uid() IS NULL) and admins are allowed
-- to change anything — they bypass this guard.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION protect_profile_sensitive_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role has no JWT; allow unrestricted updates.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Admins may change any field.
  IF is_admin() THEN
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

CREATE TRIGGER trg_protect_profile_sensitive_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_sensitive_fields();


-- ----------------------------------------------------------------
-- TRIGGER FUNCTION: handle_new_user()
-- Auto-creates a profile row immediately after auth.users INSERT.
-- Reads full_name from the raw_user_meta_data JSONB if provided
-- (e.g., passed during signUp({ data: { full_name: '...' } })).
-- ON CONFLICT DO NOTHING: safe to re-run / idempotent.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
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

-- Fire once per auth.users insert (e.g., email signup, OAuth, magic link).
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
