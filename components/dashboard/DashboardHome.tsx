import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Compass,
  MessageCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";

type RecentLesson = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
};

const contentSections = [
  {
    href: "/dashboard/lessons",
    Icon: BookOpen,
    label: "Видео хичээл",
    description: "Сэтгэл зүйн ойлголтоо өдөр тутмын амьдралтай холбох богино хичээлүүд.",
  },
  {
    href: "/dashboard/zodiac",
    Icon: Sparkles,
    label: "Тарот уншлага",
    description: "7 хоног бүрийн 12 ордын уншлага, өөртөө тавих тайван асуултууд.",
  },
  {
    href: "/dashboard/tests",
    Icon: Brain,
    label: "Сэтгэл зүйн тест",
    description: "Өөрийгөө ажиглах, хэв маягаа танихад туслах асуулга ба тайлбарууд.",
  },
  {
    href: "/dashboard/community",
    Icon: MessageCircle,
    label: "Community",
    description: "Түүх, мэдрэмжээ хуваалцаж, ганцаараа биш гэдгээ мэдрэх хэсэг.",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function DashboardHome({
  firstName,
  recentLessons,
}: {
  firstName: string;
  recentLessons: RecentLesson[];
}) {
  const featuredLesson = recentLessons[0];
  const hasLessons = recentLessons.length > 0;

  return (
    <main id="main-content" className="overflow-x-clip bg-background pb-24 md:pb-12">
      <section className="border-b border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-32">
          <div className="max-w-2xl">

            <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Тавтай морил, {firstName}
            </h1>
               <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">
              Миний үйлчилгээг сонгосонд танд баярлалаа. Би өдөр болгон вэбсайт аа шинчилж, бас контент оор таслахгүй байхыг хичээх болно
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/lessons"
                className={`${focusRing} inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto`}
              >
                Эхлэх
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/dashboard/zodiac"
                className={`${focusRing} inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent sm:w-auto`}
              >
                <Compass className="h-4 w-4" aria-hidden />
                Тарот уншлага
              </Link>
            </div>
          </div>

          <article className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                  2026.05.12
                </h2>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-foreground">
                <Compass className="h-7 w-7" aria-hidden />
              </div>
            </div>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Шинээр контент ороход таны email-д мэдэгдэл ирдэг боллоо. UI/UX шинэчлэлт хийлээ.
            </p>
          </article>
        </div>
      </section>

      <section className="scroll-mt-24 py-12 md:py-16" aria-labelledby="dashboard-sections">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2
              id="dashboard-sections"
              className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl"
            >
              Танд зориулсан хэсгүүд
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {contentSections.map(({ href, Icon, label, description }) => (
              <Link
                key={href}
                href={href}
                className={`${focusRing} group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent motion-reduce:hover:translate-y-0 md:p-8`}
              >
                <div className="flex items-start gap-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-foreground">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                      {label}
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </span>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      Дэлгэрэнгүй
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        aria-hidden
                      />
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-24 border-t border-border/60 bg-muted/40 py-12 md:py-16"
        aria-labelledby="recent-lessons"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Сүүлийн нэмэлт
              </p>
              <h2
                id="recent-lessons"
                className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl"
              >
                Үргэлжлүүлэн үзэх
              </h2>
            </div>
            {hasLessons ? (
              <Link
                href="/dashboard/lessons"
                className={`${focusRing} inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 ease-out hover:bg-accent sm:w-auto`}
              >
                Бүгдийг харах
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>

          {hasLessons ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              {featuredLesson ? (
                <Link
                  href={`/dashboard/lessons/${featuredLesson.id}`}
                  className={`${focusRing} group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent motion-reduce:hover:translate-y-0 md:p-8`}
                >
                  <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted text-muted-foreground">
                    <PlayCircle className="h-7 w-7" aria-hidden />
                  </div>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Онцлох хичээл
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-foreground">
                    {featuredLesson.title}
                  </h3>
                  {featuredLesson.description ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {featuredLesson.description}
                    </p>
                  ) : null}
                  {featuredLesson.duration_minutes ? (
                    <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" aria-hidden />
                      {featuredLesson.duration_minutes} мин
                    </p>
                  ) : null}
                </Link>
              ) : null}

              <div className="grid gap-4">
                {recentLessons.slice(1, 8).map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/dashboard/lessons/${lesson.id}`}
                    className={`${focusRing} group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors duration-200 ease-out hover:bg-accent md:p-6`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
                        <PlayCircle className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="line-clamp-2 block text-sm font-medium leading-relaxed text-foreground">
                          {lesson.title}
                        </span>
                        {lesson.duration_minutes ? (
                          <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" aria-hidden />
                            {lesson.duration_minutes} мин
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground shadow-soft md:p-8">
              Шинэ хичээл хараахан нэмэгдээгүй байна. Удахгүй энд таны үзэх
              дараагийн агуулга гарч ирнэ.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
