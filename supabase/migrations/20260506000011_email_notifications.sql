-- =============================================================
-- MIGRATION 011: User-controlled email notification preference
-- =============================================================
-- Opt-out model: defaults to TRUE because the initial use cases
-- (payment approved / denied, new lesson published) are all
-- transactional or directly user-relevant. Users can disable
-- non-transactional content emails from their profile settings.

ALTER TABLE profiles
  ADD COLUMN email_notifications BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX idx_profiles_email_notifications ON profiles(email_notifications);
