export default function LessonsLoading() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-[1100px] overflow-x-clip px-4 py-16 pb-24 sm:px-6 md:py-24 md:pb-10 lg:px-8 lg:py-32"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="h-10 max-w-xs rounded-lg bg-muted animate-skeleton-pulse md:h-12" />
          <div className="h-4 max-w-sm rounded bg-muted animate-skeleton-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft animate-skeleton-pulse"
            >
              <div className="aspect-video bg-muted" />
              <div className="space-y-3 p-6 md:p-8">
                <div className="h-6 w-4/5 rounded-lg bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="flex justify-between gap-3 border-t border-border pt-4">
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-4 w-14 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
