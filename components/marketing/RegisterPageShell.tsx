"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Heart, Video } from "lucide-react";

export default function RegisterPageShell({
  emailSent,
  children,
}: {
  emailSent: boolean;
  children: React.ReactNode;
}) {
  if (emailSent) {
    return (
      <div className="min-h-screen overflow-x-clip bg-background text-foreground antialiased">
        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32"
        >
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 ease-out hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Нүүр хуудас
          </Link>

          <div className="mx-auto mt-12 w-full max-w-md md:mt-16">{children}</div>

          <footer className="mt-16 border-t border-border pt-10 text-center md:mt-24">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 &middot; Г.Алтанцог
            </p>
          </footer>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 ease-out hover:bg-accent motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Нүүр хуудас
        </Link>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="order-2 space-y-6 lg:sticky lg:order-1 lg:top-24">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Бүртгэл
            </p>
            <h1 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Бүртгэл үүсгэх
            </h1>
            <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
              Тарот болон сэтгэл зүйн контентод хандахын тулд бүртгүүлнэ үү.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                  <BookOpen className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="font-medium text-foreground">Уншлага</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Тарот болон сэтгэл зүйн уншлага — тайван орчинд.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                  <Video className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="font-medium text-foreground">Видео</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Видео хичээл, агуулга — нэг дор.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                  <Heart className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="font-medium text-foreground">Гишүүнчлэл</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Гишүүнчлэлээр бүх контентод нэвтрэх эрх.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="relative order-1 lg:order-2">
            <div
              className="pointer-events-none absolute -right-6 -top-8 h-48 w-48 rounded-full bg-muted/80 blur-3xl motion-reduce:blur-none"
              aria-hidden
            />
            <div className="relative">{children}</div>
          </div>
        </div>

        <footer className="mt-16 border-t border-border pt-10 text-center md:mt-24">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 &middot; Г.Алтанцог
          </p>
        </footer>
      </main>
    </div>
  );
}
