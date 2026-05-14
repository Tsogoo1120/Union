'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/dashboard/lessons', label: 'Хичээлүүд' },
  { href: '/dashboard/zodiac', label: 'Тарот' },
  { href: '/dashboard/tests', label: 'Тестүүд' },
  { href: '/dashboard/community', label: 'Грүп' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function UserNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 hidden h-16 w-full border-b border-border bg-background shadow-sm md:flex"
      aria-label="Гол цэс"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className={`${focusRing} font-display text-base font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/90`}
        >
          Tsogoo_1120
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${focusRing} rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 ease-out ${
                  isActive
                    ? 'bg-primary/5 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/dashboard/profile"
          className={`${focusRing} rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 ease-out ${
            pathname.startsWith('/dashboard/profile')
              ? 'bg-primary/5 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          Профайл
        </Link>
      </div>
    </nav>
  );
}
