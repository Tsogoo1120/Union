import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Client-only: redirects to Google then back to /auth/callback.
 * Enable Google in Supabase Dashboard → Authentication → Providers,
 * and add your site URL + https://…/auth/callback to Redirect URLs.
 */
export async function signInWithGoogle(
  supabase: SupabaseClient,
  options?: { next?: string },
) {
  const next = options?.next ?? '/payment';
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });
}
