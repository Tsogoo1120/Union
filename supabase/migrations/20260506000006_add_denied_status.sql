-- =============================================================
-- MIGRATION 006: Add 'denied' to subscription_status enum
-- =============================================================
-- When an admin explicitly denies a payment, the user's
-- subscription_status is set to 'denied' so the effective-status
-- helper can route them to the /status/denied page with context.
-- Previously denyPayment reset to 'inactive'; that comment is
-- superseded by this migration.

ALTER TYPE subscription_status ADD VALUE IF NOT EXISTS 'denied';
