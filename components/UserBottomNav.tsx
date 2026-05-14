'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Brain, Home, Sparkles, Users } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Нүүр', Icon: Home, exact: true },
  { href: '/dashboard/lessons', label: 'Хичээл', Icon: BookOpen, exact: false },
  { href: '/dashboard/zodiac', label: 'Тарот', Icon: Sparkles, exact: false },
  { href: '/dashboard/tests', label: 'Тест', Icon: Brain, exact: false },
  { href: '/dashboard/community', label: 'Community', Icon: Users, exact: false },
] as const;

export function UserBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-background px-1 pb-[env(safe-area-inset-bottom)] pt-1 md:hidden"
      aria-label="Доод цэс"
    >
      {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.25 : 2} aria-hidden />
            <span className="max-w-[56px] truncate text-center text-[10px] font-medium leading-tight">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
