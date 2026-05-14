import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: pendingCount }, { count: totalUsers }] = await Promise.all([
    supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user'),
  ]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of platform activity.</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 md:px-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/payments?tab=pending"
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Pending Payments
              </p>
              <span className="material-symbols-outlined text-[20px] text-muted-foreground transition-colors group-hover:text-foreground">
                payments
              </span>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">{pendingCount ?? 0}</p>
            {(pendingCount ?? 0) > 0 && (
              <p className="mt-2 text-sm font-medium text-primary">Review now →</p>
            )}
          </Link>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total Subscribers
              </p>
              <span className="material-symbols-outlined text-[20px] text-muted-foreground">
                group
              </span>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">{totalUsers ?? 0}</p>
          </div>
        </div>

        {/* Quick nav */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Management</p>
          </div>
          <div className="divide-y divide-border">
            <Link
              href="/admin/payments"
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-muted-foreground">payments</span>
                <span className="text-sm font-medium text-foreground">Payment Review</span>
              </div>
              <div className="flex items-center gap-2">
                {(pendingCount ?? 0) > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {pendingCount}
                  </span>
                )}
                <span className="material-symbols-outlined text-[20px] text-muted-foreground">chevron_right</span>
              </div>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-muted-foreground">group</span>
                <span className="text-sm font-medium text-foreground">Subscribers</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-muted-foreground">chevron_right</span>
            </Link>
            <Link
              href="/admin/lessons"
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-muted-foreground">auto_stories</span>
                <span className="text-sm font-medium text-foreground">Content / Lessons</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-muted-foreground">chevron_right</span>
            </Link>
            <Link
              href="/admin/zodiac"
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-muted-foreground">star</span>
                <span className="text-sm font-medium text-foreground">Zodiac Signs</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-muted-foreground">chevron_right</span>
            </Link>
            <Link
              href="/admin/tests"
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-muted-foreground">psychology</span>
                <span className="text-sm font-medium text-foreground">Psychology Tests</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-muted-foreground">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
