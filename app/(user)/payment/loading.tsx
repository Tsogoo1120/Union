export default function PaymentLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <div className="space-y-6">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-5 w-24 rounded-full bg-muted animate-skeleton-pulse" />
            <div className="mx-auto h-6 w-56 rounded bg-muted animate-skeleton-pulse" />
            <div className="mx-auto h-4 w-72 rounded bg-muted animate-skeleton-pulse" />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex justify-between px-5 py-3 animate-skeleton-pulse">
              <div className="h-3 w-12 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 animate-skeleton-pulse">
            <div className="space-y-4">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-32 rounded-lg bg-muted" />
              <div className="h-10 rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
