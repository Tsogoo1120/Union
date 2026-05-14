'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

function canGoBack() {
  if (typeof window === 'undefined') return false;
  // window.history.length is not perfect, but good enough for deciding fallback behavior.
  return window.history.length > 1;
}

export function UserMobileTopNav() {
  const router = useRouter();
  const pathname = usePathname();

  const showBack = pathname !== '/dashboard';

  const onBack = React.useCallback(() => {
    if (canGoBack()) {
      router.back();
      return;
    }
    router.push('/dashboard');
  }, [router]);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border bg-background pt-[env(safe-area-inset-top)] md:hidden"
      aria-label="Гар утасны дээд самбар"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex w-12 items-center justify-start">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-foreground transition-colors duration-200 ease-out hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Буцах"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </div>

        <Link
          href="/dashboard"
          className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/90"
        >
          Tsogoo_1120
        </Link>

        <div className="flex w-12 items-center justify-end" aria-hidden />
      </div>
    </nav>
  );
}

