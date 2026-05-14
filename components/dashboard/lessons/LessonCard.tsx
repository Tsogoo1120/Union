import Link from "next/link";
import { ArrowRight, Clock, PlayCircle } from "lucide-react";

export type LessonSummary = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function LessonCard({ lesson }: { lesson: LessonSummary }) {
  const href = `/dashboard/lessons/${lesson.id}`;

  return (
    <Link
      href={href}
      className={`${focusRing} group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent motion-reduce:transition-colors motion-reduce:hover:translate-y-0`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {lesson.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lesson.thumbnail_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <PlayCircle className="h-10 w-10" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col p-6 md:p-8">
        <h2 className="line-clamp-2 font-display text-lg font-medium tracking-tight text-foreground md:text-xl">
          {lesson.title}
        </h2>
        {lesson.description ? (
          <p className="mb-4 mt-2 line-clamp-2 flex-grow text-sm leading-relaxed text-muted-foreground">
            {lesson.description}
          </p>
        ) : (
          <span className="mb-4 mt-2 flex-grow" aria-hidden />
        )}

        <div className="mt-auto flex min-h-11 items-center justify-between gap-3 border-t border-border pt-4">
          {lesson.duration_minutes ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" aria-hidden />
              {lesson.duration_minutes} мин
            </span>
          ) : (
            <span aria-hidden />
          )}
          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary transition-colors duration-200 ease-out group-hover:text-primary">
            Үзэх
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
