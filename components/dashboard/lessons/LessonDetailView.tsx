import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Clock } from "lucide-react";
import { VideoPlayer } from "@/components/ui/video-player";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type LessonDetailModel = {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
};

export type LessonNavItem = {
  id: string;
};

export function LessonDetailView({
  lesson,
  prevLesson,
  nextLesson,
}: {
  lesson: LessonDetailModel;
  prevLesson: LessonNavItem | null;
  nextLesson: LessonNavItem | null;
}) {
  return (
    <div className="space-y-8">
      <nav
        className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground"
        aria-label="Түргэн навигаци"
      >
        <Link
          href="/dashboard/lessons"
          className={`${focusRing} rounded-lg transition-colors duration-200 ease-out hover:text-foreground`}
        >
          Хичээлүүд
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
        <span className="line-clamp-1 min-w-0 text-foreground">{lesson.title}</span>
      </nav>

      {lesson.video_url ? (
        <VideoPlayer url={lesson.video_url} title={lesson.title} />
      ) : lesson.thumbnail_url ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lesson.thumbnail_url}
            alt=""
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl">
          {lesson.title}
        </h1>
        {lesson.duration_minutes ? (
          <p className="mt-3 flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground md:text-base">
            <Clock className="h-4 w-4 shrink-0" aria-hidden />
            {lesson.duration_minutes} мин
          </p>
        ) : null}
      </header>

      {lesson.description ? (
        <section className="border-t border-border pt-6" aria-labelledby="lesson-desc-heading">
          <h2 id="lesson-desc-heading" className="sr-only">
            Тайлбар
          </h2>
          <p className="max-w-prose text-base leading-relaxed text-foreground">{lesson.description}</p>
        </section>
      ) : null}

      <nav
        className="flex items-center justify-between gap-4 border-t border-border pt-6"
        aria-label="Хичээлийн дараалал"
      >
        <div className="min-w-0 flex-1">
          {prevLesson ? (
            <Link
              href={`/dashboard/lessons/${prevLesson.id}`}
              className={`${focusRing} inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out hover:bg-accent hover:text-foreground`}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Өмнөх
            </Link>
          ) : (
            <span />
          )}
        </div>

        <div className="flex shrink-0 justify-end">
          {nextLesson ? (
            <Link
              href={`/dashboard/lessons/${nextLesson.id}`}
              className={`${focusRing} inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 ease-out hover:bg-primary/90`}
            >
              Дараах
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          ) : (
            <Link
              href="/dashboard/lessons"
              className={`${focusRing} inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out hover:bg-accent hover:text-foreground`}
            >
              Бүх хичээлүүд
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
