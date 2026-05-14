import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { getEffectiveStatus } from '@/lib/subscription';
import { exchangeCodeForSessionWithRetries } from '@/lib/auth/exchange-session-with-retries';
import { authDebug } from '@/lib/auth/auth-debug';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/payment';
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  const errorDescription = searchParams.get('error_description');
  type StatusProfile = Parameters<typeof getEffectiveStatus>[0];

  authDebug('callback.hit', {
    path: new URL(request.url).pathname,
    hasCode: !!code,
    codeLen: code?.length ?? 0,
    hasNext: searchParams.has('next'),
  });

  // Supabase can redirect with error params (e.g. redirect URL not allowlisted).
  if (error || errorCode || errorDescription) {
    const url = new URL('/login', origin);
    url.searchParams.set('error', error ?? errorCode ?? 'auth_callback_error');
    if (errorDescription) url.searchParams.set('error_description', errorDescription);
    return NextResponse.redirect(url);
  }

  if (code) {
    // Never blindly trust `next`; keep redirects same-origin + path-only.
    const safeNext =
      typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
        ? next
        : '/payment';

    const response = NextResponse.redirect(`${origin}${safeNext}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers
              .get('cookie')
              ?.split('; ')
              .map((c) => {
                const [name, ...rest] = c.split('=');
                return { name, value: rest.join('=') };
              }) ?? [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await exchangeCodeForSessionWithRetries(supabase, code);

    if (!error) {
      // Fetch the user bound to the new session.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If we somehow can't read the user, fall back to login.
      if (!user) {
        return NextResponse.redirect(`${origin}/login?error=auth_user_missing`);
      }

      // Ensure a profile row exists (trigger *should* do this, but be defensive).
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, role, subscription_status, subscription_expires_at')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        const admin = createAdminClient();
        await admin.from('profiles').upsert(
          {
            id: user.id,
            email: user.email ?? '',
            role: 'user',
            subscription_status: 'inactive',
          },
          { onConflict: 'id' },
        );
      }

      // Route users consistently with existing app logic.
      const statusProfile: StatusProfile = profile
        ? {
            role: profile.role,
            subscription_status: profile.subscription_status,
            subscription_expires_at: profile.subscription_expires_at,
          }
        : {
            role: 'user',
            subscription_status: 'inactive',
            subscription_expires_at: null,
          };

      const status = getEffectiveStatus(statusProfile);
      if (status === 'admin') return NextResponse.redirect(`${origin}/admin/dashboard`);
      if (status === 'active') return NextResponse.redirect(`${origin}/dashboard`);
      if (status === 'pending') return NextResponse.redirect(`${origin}/status/pending`);
      if (status === 'denied') return NextResponse.redirect(`${origin}/status/denied`);
      if (status === 'expired') return NextResponse.redirect(`${origin}/status/expired`);
      // inactive/new users go to payment (matches existing flow).
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
