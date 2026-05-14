import Link from "next/link";
import { Check } from "lucide-react";
import { MARKETING_FEATURES } from "./constants";
import { Reveal } from "./reveal";

export default function PricingCard() {
  return (
    <section
      id="une"
      className="scroll-mt-24 border-b border-border/40 bg-[#FAFAF7] py-20 md:py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2
            id="pricing-heading"
            className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            Нэг энгийн төлөвлөгөө
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-lg">
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-[0_28px_100px_-40px_rgba(0,0,0,0.18)] md:p-10">
            <div className="text-center">
              <p className="font-display text-5xl font-medium tracking-tight text-foreground md:text-6xl">
                50,000₮
              </p>
              <p className="mt-1 text-sm text-muted-foreground">/ сар</p>
            </div>

            <ul className="mt-8 space-y-4 border-t border-border/60 pt-8">
              {MARKETING_FEATURES.map((f) => (
                <li key={f.key} className="flex gap-3 text-left">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1F4D3F]/10 text-[#1F4D3F]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground md:text-base">
                    {f.title}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="mt-10 flex h-12 w-full items-center justify-center rounded-2xl bg-[#1F4D3F] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a4236] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3F] focus-visible:ring-offset-2"
            >
              Бүртгүүлэх
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
