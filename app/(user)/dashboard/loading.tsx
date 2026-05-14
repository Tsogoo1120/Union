export default function DashboardLoading() {
  return (
    <main
      id="main-content"
      className="overflow-x-clip bg-background pb-24 md:pb-12"
    >
      <section className="border-b border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-32">
          <div className="max-w-2xl space-y-4">
            <div className="h-3 w-36 rounded bg-muted animate-skeleton-pulse" />
            <div className="h-12 max-w-md rounded-lg bg-muted animate-skeleton-pulse sm:h-14" />
            <div className="h-4 w-full max-w-prose rounded bg-muted animate-skeleton-pulse" />
            <div className="h-4 w-5/6 max-w-prose rounded bg-muted animate-skeleton-pulse" />
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <div className="h-12 w-full rounded-xl bg-muted animate-skeleton-pulse sm:w-40" />
              <div className="h-12 w-full rounded-xl bg-muted animate-skeleton-pulse sm:w-44" />
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <div className="flex justify-between gap-6">
              <div className="space-y-3">
                <div className="h-3 w-32 rounded bg-muted animate-skeleton-pulse" />
                <div className="h-10 w-48 rounded-lg bg-muted animate-skeleton-pulse" />
              </div>
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-muted animate-skeleton-pulse" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded bg-muted animate-skeleton-pulse" />
              <div className="h-4 w-full rounded bg-muted animate-skeleton-pulse" />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background p-4">
                  <div className="h-3 w-6 rounded bg-muted animate-skeleton-pulse" />
                  <div className="mt-2 h-4 w-16 rounded bg-muted animate-skeleton-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-24 rounded bg-muted animate-skeleton-pulse" />
          <div className="mt-3 h-10 max-w-md rounded-lg bg-muted animate-skeleton-pulse md:h-12" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft animate-skeleton-pulse md:p-8"
              >
                <div className="flex items-start gap-6">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-muted" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-6 w-40 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-4/5 rounded bg-muted" />
                    <div className="h-4 w-28 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/40 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="h-3 w-28 rounded bg-muted animate-skeleton-pulse" />
              <div className="h-10 w-56 rounded-lg bg-muted animate-skeleton-pulse md:h-12 md:w-72" />
            </div>
            <div className="h-11 w-full rounded-xl bg-muted animate-skeleton-pulse sm:w-40" />
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-muted">
                <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="mt-6 h-3 w-28 rounded bg-muted animate-skeleton-pulse" />
              <div className="mt-3 h-8 w-4/5 rounded-lg bg-muted animate-skeleton-pulse" />
              <div className="mt-3 h-4 w-full rounded bg-muted animate-skeleton-pulse" />
            </div>
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-muted animate-skeleton-pulse" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-full rounded bg-muted animate-skeleton-pulse" />
                      <div className="h-3 w-20 rounded bg-muted animate-skeleton-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
