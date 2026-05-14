import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Profile } from '@/lib/types';

/**
 * Fetch the current user's profile.
 *
 * If the row is missing (trigger race condition or user pre-dating the trigger),
 * it is created on-demand via the service-role admin client which bypasses the
 * RLS INSERT restriction on profiles (regular users cannot INSERT their own row).
 *
 * Returns null when there is no authenticated session or if the upsert fails.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Trigger may not have fired yet (race condition) or user existed before
    // the trigger was deployed. Use the admin (service-role) client so the
    // INSERT is not blocked by RLS. Matches the trigger's default values.
    const admin = createAdminClient();
    await admin.from('profiles').upsert(
      {
        id: user.id,
        email: user.email ?? '',
        full_name: user.user_metadata?.full_name ?? null,
        role: 'user',
        subscription_status: 'inactive',
      },
      { onConflict: 'id' }
    );

    const refetch = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    profile = refetch.data;
  }

  return (profile as Profile) ?? null;
}
