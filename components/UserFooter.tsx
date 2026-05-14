export function UserFooter() {
  return (
    <footer className="mt-auto mb-16 border-t border-border bg-background md:mb-0">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] lg:items-start lg:gap-12 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Вэб
          </p>
          <p className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
            tsogoo_1120
          </p>
        </div>
        <div className="md:max-w-lg lg:max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Холбоо барих
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Холбоо барих=96133655 эсвэл tsogoo_1120 insta шууд бичээрэй
          </p>
        </div>
        <div className="text-sm text-muted-foreground md:col-span-2 lg:col-span-1 lg:text-right">
          &copy; {new Date().getFullYear()} Г.Алтанцог
        </div>
      </div>
    </footer>
  );
}
