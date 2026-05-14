'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Нүүр',
  '/dashboard/lessons': 'Хичээлүүд',
  '/dashboard/videos': 'Видео хичээл',
  '/dashboard/zodiac': 'Тарот хөзөр',
  '/dashboard/tests': 'Сэтгэл зүйн тест',
  '/dashboard/community': 'Грүп',
  '/dashboard/profile': 'Профайл',
};

export function MobileTopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === '/dashboard';

  // Match exact or find the closest parent title
  const title =
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES)
      .filter(([key]) => key !== '/dashboard' && pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ??
    'Manifest';

  return (
    <header className="md:hidden flex items-center h-14 px-4 bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      {/* Back button — hidden on home */}
      {!isHome ? (
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 -ml-1 rounded-xl text-foreground active:bg-muted transition-colors"
          aria-label="Буцах"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
      ) : (
        <div className="w-9" />
      )}

      {/* Title */}
      <h1 className="flex-1 text-center text-base font-semibold text-foreground truncate">
        {isHome ? 'Manifest' : title}
      </h1>

      {/* Profile link */}
      <Link
        href="/dashboard/profile"
        className="flex items-center justify-center w-9 h-9 -mr-1 rounded-xl text-muted-foreground active:bg-muted transition-colors"
        aria-label="Профайл"
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={
            pathname.startsWith('/dashboard/profile')
              ? { fontVariationSettings: "'FILL' 1", color: 'var(--primary)' }
              : undefined
          }
        >
          account_circle
        </span>
      </Link>
    </header>
  );
}
