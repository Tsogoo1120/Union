import Link from "next/link";
import { Reveal } from "./reveal";

export default function CTASection() {
  return (
    <section
      className="border-b border-border/40 bg-[#1F4D3F] py-16 text-white md:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2
            id="cta-heading"
            className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl"
          >
            Өнөөдөр өөрийн аяллыг эхлүүл
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Нэг дорх агуулга, тогтмол завсарласан орон зай — өөрийгөө илүү тод
            харахад зориулсан.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 min-w-[200px] items-center justify-center rounded-2xl bg-white px-8 text-sm font-semibold text-[#1F4D3F] shadow-sm transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F4D3F]"
          >
            Бүртгүүлэх
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
