'use client';

export default function CommunityLoading() {
  return (
    <div
      role="main"
      className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:px-8 md:pb-10"
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-32 rounded-lg bg-muted animate-skeleton-pulse" />
          <div className="h-4 w-64 rounded bg-muted animate-skeleton-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="rounded-xl border border-border bg-card p-5 animate-skeleton-pulse">
              <div className="h-20 rounded-lg bg-muted" />
              <div className="mt-3 h-9 w-32 rounded-lg bg-muted" />
            </div>

            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5 animate-skeleton-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="space-y-1">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-2 w-16 rounded bg-muted" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-3/4 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>

          <aside className="hidden lg:col-span-4 lg:flex">
            <div className="w-full rounded-xl border border-border bg-card p-5 animate-skeleton-pulse">
              <div className="mb-4 h-4 w-32 rounded bg-muted" />
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

