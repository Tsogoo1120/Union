-- =============================================================
-- MIGRATION 012: Subscription-expiry reminder stage
-- =============================================================
-- The daily expiry-reminder cron uses this column to remember
-- which warning each user has already received for the *current*
-- subscription cycle, so it never spams.
--
--   0 = no reminder sent for this cycle (initial / post-renewal)
--   1 = 3-day reminder has been sent
--   2 = 1-day reminder has been sent (final)
--
-- approvePayment() resets this back to 0 on every renewal, so the
-- next cycle's reminders fire correctly.

ALTER TABLE profiles
  ADD COLUMN expiry_reminder_stage SMALLINT NOT NULL DEFAULT 0;

-- Composite index for the cron's filter (status + stage + expiry window).
CREATE INDEX idx_profiles_expiry_reminders
  ON profiles (subscription_status, expiry_reminder_stage, subscription_expires_at)
  WHERE subscription_status = 'active';
