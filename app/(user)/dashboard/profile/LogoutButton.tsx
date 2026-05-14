'use client';

import { useTransition } from 'react';
import { logout } from '@/app/actions/auth';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex h-12 min-h-[44px] w-full items-center justify-center rounded-xl bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors duration-200 ease-out hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
    >
      {isPending ? 'Гарч байна…' : 'Гарах'}
    </button>
  );
}
