import { Reveal } from "./reveal";

const ITEMS = [
  {
    q: "Төлбөрийг хэрхэн хийх вэ?",
    a: "Эхлээт бүртгүүлэх товч дээр дараад өөрийн email хаягаа бүртгүүлнэ.Дараа нь email хаягт нь баталгаажуулах линк ирнэ. Ирээгүй бол spam хэсгээ шалгаарай тэрний дараа төлбөрөө төлөөд эрх нээгдэх болно",
  },
  {
    q: "Тусламж хэрэгтэй бол хэнтэй холбогдох вэ?",
    a: "Tsogoo_1120 гээд миний инстаграмаар холбогдоно уу",
  },
] as const;

export default function FAQ() {
  return (
    <section
      id="asuult"
      className="scroll-mt-24 border-b border-border/40 bg-[#FAFAF7] py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            id="faq-heading"
            className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Тодруулах зүйлс
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {ITEMS.map((item) => (
            <Reveal key={item.q}>
              <details className="group rounded-2xl border border-border/60 bg-card px-5 py-1 shadow-sm transition hover:shadow-md open:shadow-md">
                <summary className="cursor-pointer list-none py-4 font-medium text-foreground outline-none transition marker:content-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    <h3 className="flex-1 text-left text-base font-medium">
                      {item.q}
                    </h3>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/40 text-muted-foreground transition group-open:rotate-180"
                      aria-hidden
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </span>
                </summary>
                <div className="border-t border-border/50 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
