"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#taniltsuulga", label: "Танилцуулга" },
  { href: "#uilchilgee", label: "Үйлчилгээ" },
  { href: "#une", label: "Үнэ" },
  { href: "#asuult", label: "Асуулт хариулт" },
  { href: "#holboo", label: "Холбоо барих" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-colors",
        scrolled && "border-b border-border/70 bg-background/85",
        !scrolled && "bg-background/70",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="font-display text-lg font-medium tracking-tight text-foreground md:text-xl">
            Tsogoo&apos;s site
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border/80 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Нэвтрэх
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1F4D3F] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1a4236] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3F] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Бүртгүүлэх
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Цэс хаах" : "Цэс нээх"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      <div
        id="mobile-nav-panel"
        className={cn(
          "border-b border-border/60 bg-background/95 md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4"
          aria-label="Гар утасны цэс"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setMobileOpen(false)}
            >
              Нэвтрэх
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1F4D3F] text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3F] focus-visible:ring-offset-2"
              onClick={() => setMobileOpen(false)}
            >
              Бүртгүүлэх
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
