import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getEffectiveStatus } from '@/lib/subscription';
import { supabaseUrl, supabaseAnonKey } from './env';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl(),
    supabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not add any logic between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Routes that require an active subscription (or admin role).
  const isSubscriberRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/lessons') ||
    pathname.startsWith('/zodiac') ||
    pathname.startsWith('/tests') ||
    pathname.startsWith('/community');

  // All routes that require authentication (superset of subscriber routes).
  const isProtectedRoute =
    isSubscriberRoute ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/status') ||
    pathname.startsWith('/admin');

  const isAuthRoute =
    pathname === '/' || pathname === '/login' || pathname === '/register';

  // Unauthenticated user hitting a protected route → send to login.
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const isAdminRoute = pathname.startsWith('/admin');
  if (user && isAdminRoute) {
    const { data: roleProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (roleProfile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // For auth routes and subscriber routes we need the effective status.
  // Profile query is limited to these two cases to avoid a DB hit on every request.
  //
  // NOTE: Middleware runs on the Edge Runtime (Node.js APIs unavailable), so
  // the service-role admin client cannot be used here. On-demand profile
  // creation is handled by getCurrentProfile() in each server-component page.
  // If the profile row is missing, getEffectiveStatus(null) returns 'pending'
  // and the user is routed to /status/pending (harmless — they'll be asked to wait).
  if (user && (isAuthRoute || isSubscriberRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, subscription_status, subscription_expires_at')
      .eq('id', user.id)
      .single();

    const status = getEffectiveStatus(profile);
    const url = request.nextUrl.clone();

    if (isAuthRoute) {
      // Redirect authenticated users away from /login and /register.
      if (status === 'admin') {
        url.pathname = '/admin/dashboard';
      } else if (status === 'active') {
        url.pathname = '/dashboard';
      } else if (status === 'pending') {
        url.pathname = '/status/pending';
      } else if (status === 'denied') {
        url.pathname = '/status/denied';
      } else if (status === 'expired') {
        url.pathname = '/status/expired';
      } else {
        // 'inactive' — new user with no payment yet.
        url.pathname = '/payment';
      }
      return NextResponse.redirect(url);
    }

    if (isSubscriberRoute) {
      // Allow admins and active subscribers through.
      if (status === 'active' || status === 'admin') {
        return supabaseResponse;
      }

      // Redirect everyone else to the appropriate status page.
      if (status === 'pending') {
        url.pathname = '/status/pending';
      } else if (status === 'denied') {
        url.pathname = '/status/denied';
      } else if (status === 'expired') {
        url.pathname = '/status/expired';
      } else {
        // 'inactive' — has not submitted a payment yet.
        url.pathname = '/payment';
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
