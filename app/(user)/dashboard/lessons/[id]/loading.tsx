export default function LessonDetailLoading() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-[800px] overflow-x-clip px-4 py-16 pb-24 sm:px-6 md:py-24 md:pb-10 lg:px-8 lg:py-32"
    >
      <div className="mb-8 flex min-h-11 items-center gap-2">
        <div className="h-4 w-20 rounded bg-muted animate-skeleton-pulse" />
        <div className="h-4 w-4 rounded bg-muted animate-skeleton-pulse" />
        <div className="h-4 flex-1 rounded bg-muted animate-skeleton-pulse" />
      </div>
      <div className="mb-10 aspect-video w-full overflow-hidden rounded-3xl border border-border bg-muted animate-skeleton-pulse shadow-soft" />
      <div className="space-y-4">
        <div className="h-10 max-w-xl rounded-lg bg-muted animate-skeleton-pulse md:h-12" />
        <div className="h-4 w-24 rounded bg-muted animate-skeleton-pulse" />
      </div>
      <div className="mt-10 flex justify-between border-t border-border pt-6">
        <div className="h-11 w-24 rounded-xl bg-muted animate-skeleton-pulse" />
        <div className="h-11 w-28 rounded-xl bg-muted animate-skeleton-pulse" />
      </div>
    </main>
  );
}
