'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Хянах самбар', icon: 'dashboard' },
  { href: '/admin/users', label: 'Хэрэглэгчид', icon: 'group' },
  { href: '/admin/payments', label: 'Төлбөрүүд', icon: 'payments' },
  { href: '/admin/lessons', label: 'Хичээл', icon: 'auto_stories' },
  { href: '/admin/zodiac', label: 'Зурхай / Тарот', icon: 'star' },
  { href: '/admin/tests', label: 'Тест', icon: 'psychology' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col h-screen w-56 bg-card border-r border-border p-5 space-y-2 flex-shrink-0 sticky top-0">
      <div className="mb-6">
        <h1 className="text-base font-bold text-foreground">Manifest</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Админ
        </p>
      </div>

      <div className="flex-grow space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-border space-y-1">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Гарах</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
