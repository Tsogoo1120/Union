import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Reveal } from "./reveal";
import tarotImage from "@/components/assets/tarot.jpg";


export default function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-border/40 bg-[#FAFAF7]"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-[115px]">
        <Reveal>
          <div className="max-w-xl">
            <h1
              id="hero-heading"
              className="font-display text-4xl font-medium tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Existence precedes essence
            </h1>
            <p className="mt-5 font-medium italic text-foreground/90">
            гэдэг нь хүн эхлээд оршин байдаг, харин дараа нь өөрийн сонголт,
            үйлдэл, туршлагаараа “хэн болохоо” бүтээдэг. — Jean-Paul Sartre
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1F4D3F] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a4236] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7]"
              >
                Бүртгүүлэх
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="relative lg:justify-self-end">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="pointer-events-none absolute -right-8 -top-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#1F4D3F]/20 via-amber-100/40 to-transparent blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-6 h-56 w-56 rounded-full bg-gradient-to-tr from-stone-200/80 to-transparent blur-2xl"
              aria-hidden
            />

<div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_24px_80px_-24px_rgba(0,0,0,0.15)]">
  <Image
    src={tarotImage}
    alt="Өдрийн тэмдэглэл хөтлөж буй хүн, ажил төлөвлөлт"
    width={800}
    height={1000}
    quality={85}
    className="h-auto w-full object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
    priority
    fetchPriority="high"
  />
</div>

            <div className="absolute -bottom-6 right-2 max-w-[220px] rounded-2xl border border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur-sm sm:right-6 md:-right-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F4D3F]/10 text-[#1F4D3F]">
                  <Calendar className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-display text-base font-medium text-foreground">
                    7 хоног бүрийн 
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Collective tarot уншлага
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
