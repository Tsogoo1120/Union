export default function TestsLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 pb-24 md:px-8 md:pb-10">
      <header className="space-y-2">
        <div className="h-8 w-56 rounded-lg bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-72 rounded bg-muted animate-skeleton-pulse" />
      </header>

      <div className="mt-8 flex border-b border-border">
        <div className="mb-3 h-5 w-24 rounded bg-muted animate-skeleton-pulse" />
      </div>

      <div className="mt-4 flex flex-col">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-2 py-4 -mx-2 animate-skeleton-pulse"
          >
            <div className="flex-grow space-y-2">
              <div className="h-4 w-48 rounded bg-muted" />
              <div className="h-3 w-64 rounded bg-muted" />
              <div className="flex gap-4">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>
            <div className="h-6 w-6 rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
