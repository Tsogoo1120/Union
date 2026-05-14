import Link from "next/link";
import { Facebook, Instagram, Mail, Youtube } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "#taniltsuulga", label: "Танилцуулга" },
  { href: "#uilchilgee", label: "Үйлчилгээ" },
  { href: "#une", label: "Үнэ" },
] as const;

const COMPANY_LINKS = [
  { href: "#holboo", label: "Холбоо барих" },
  { href: "#asuult", label: "Тусламж" },
] as const;

export default function Footer() {
  return (
    <footer
      id="holboo"
      className="scroll-mt-24 border-t border-border/60 bg-card"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="max-w-sm">
            <p className="font-display text-lg font-medium text-foreground">
              Tsogoo&apos;s site
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Сэтгэл зүйн агуулга, олон нийтийн уншлага, видео хичээл — таны өдөр
              тутмын ажиглалтыг дэмжих зориулалттай.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#holboo"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Холбоо барих (доорх хэсэг)"
              >
                <Mail className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Бүтээгдэхүүн
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Компани</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Нэвтрэх
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Г.Алтанцог. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-[11px] sm:text-right">
            Платформ нь боловсролын агуулгыг түгээх зориулалттай.
          </p>
        </div>
      </div>
    </footer>
  );
}
