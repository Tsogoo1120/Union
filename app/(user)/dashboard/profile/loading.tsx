export default function ProfileLoading() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-2xl overflow-x-clip px-4 py-16 pb-24 sm:px-6 md:py-24 md:pb-10 lg:px-8 lg:py-32"
    >
      <header className="space-y-3">
        <div className="h-10 w-40 rounded-lg bg-muted animate-skeleton-pulse md:h-12 md:w-48" />
        <div className="h-4 w-56 max-w-full rounded bg-muted animate-skeleton-pulse" />
      </header>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-skeleton-pulse px-6 py-5 md:px-8 md:py-6">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="mt-2 h-4 w-48 max-w-full rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="mx-auto h-12 max-w-sm rounded-xl bg-muted animate-skeleton-pulse" />
      </div>
    </main>
  );
}
