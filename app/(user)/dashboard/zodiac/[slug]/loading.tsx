export default function ZodiacDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 pb-24 md:px-8 md:pb-10">
      <div className="mb-8 h-48 w-full rounded-xl bg-muted animate-skeleton-pulse" />
      <div className="space-y-3">
        <div className="h-8 w-40 rounded-lg bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-32 rounded bg-muted animate-skeleton-pulse" />
        <div className="mt-4 h-4 w-full rounded bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-3/4 rounded bg-muted animate-skeleton-pulse" />
      </div>
    </main>
  );
}
