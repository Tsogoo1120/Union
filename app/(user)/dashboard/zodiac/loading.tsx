export default function ZodiacLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:px-8 md:pb-10">
      <header className="max-w-2xl space-y-2">
        <div className="h-8 w-48 rounded-lg bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-80 rounded bg-muted animate-skeleton-pulse" />
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-card animate-skeleton-pulse"
          >
            <div className="h-40 w-full bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
