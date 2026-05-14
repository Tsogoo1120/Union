export default function TestDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 pb-24 md:px-8 md:pb-10">
      <div className="space-y-4">
        <div className="h-8 w-64 rounded-lg bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-2/3 rounded bg-muted animate-skeleton-pulse" />
        <div className="mt-2 flex gap-4">
          <div className="h-4 w-24 rounded bg-muted animate-skeleton-pulse" />
          <div className="h-4 w-24 rounded bg-muted animate-skeleton-pulse" />
        </div>
        <div className="mt-6 h-12 w-40 rounded-lg bg-muted animate-skeleton-pulse" />
      </div>
    </main>
  );
}
