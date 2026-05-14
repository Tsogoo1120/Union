/**
 * Subscription status helpers.
 *
 * getEffectiveStatus() is the single source of truth for a user's access level.
 * It NEVER writes to the DB — the DB subscription_status may lag behind the wall
 * clock (e.g., subscription_status = 'active' but the expiry date has passed).
 * Always call this function instead of reading subscription_status directly.
 */

type Profile = {
  role: 'user' | 'admin';
  subscription_status: 'inactive' | 'pending' | 'active' | 'denied' | 'expired';
  subscription_expires_at: string | null;
};

export type EffectiveStatus =
  | 'inactive'
  | 'pending'
  | 'active'
  | 'denied'
  | 'expired'
  | 'admin';

/**
 * Derives the effective subscription status from a profile row.
 *
 * Rules:
 * - null profile          → 'pending'  (no session / profile missing)
 * - role = 'admin'        → 'admin'    (always bypasses subscriber gate)
 * - status = 'active' AND expiry has passed → 'expired' (drift correction)
 * - status = 'active' AND no expiry or expiry in future → 'active'
 * - any other status      → returned as-is
 */
export function getEffectiveStatus(profile: Profile | null): EffectiveStatus {
  if (!profile) return 'pending';
  if (profile.role === 'admin') return 'admin';
  if (profile.subscription_status === 'active') {
    if (
      profile.subscription_expires_at &&
      new Date(profile.subscription_expires_at) < new Date()
    ) {
      return 'expired';
    }
    return 'active';
  }
  return profile.subscription_status;
}

/**
 * Returns true when the user is allowed to access subscriber-only content.
 * Only 'active' and 'admin' statuses grant access.
 */
export function canAccessSubscriberContent(profile: Profile | null): boolean {
  const status = getEffectiveStatus(profile);
  return status === 'active' || status === 'admin';
}
