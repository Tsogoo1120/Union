import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "./reveal";

const ITEMS = [
  {
    quote:
      "Өмнө нь зөвхөн ‘эргэлзээтэй’ гэж мэдэрдэг байсан зүйлсээ одоо үгээр илэрхийлж чаддаг болсон. Олон нийтийн уншлага надад өөрийгөө шүүмжлэхгүйгээр ажиглахад тусалсан.",
    name: "Б. Оюуннара",
    role: "Маркетингийн зөвлөх",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=75&auto=format&fm=webp",
  },
  {
    quote:
      "Видео хичээлүүд урт биш, гэхдээ нягт. Өдөр бүр товч тэмдэглэл хөтлөх дадал суусны ачаар ачаалал намжаагүй ч харилцах хэл загвар минь өөрчлөгдсөн.",
    name: "Э. Мөнхбат",
    role: "Инженер",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&q=75&auto=format&fm=webp",
  },
  {
    quote:
      "Тестүүд ‘түүнийг аваад дуус’ гэсэн биш, дараагийн асуултыг өөртөө тавихад хүргэдэг. Энэ нь надад хамгийн их өөрчлөлт авчирсан.",
    name: "С. Номин",
    role: "Багш",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&q=75&auto=format&fm=webp",
  },
] as const;

export default function Testimonials() {
  return (
    <section
      className="border-b border-border/40 bg-background py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F4D3F]">
            Гишүүдийн үг
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Нэг дор олон төрлийн дэмжлэг
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {ITEMS.map((item) => (
            <Reveal key={item.name}>
              <figure className="flex h-full flex-col rounded-2xl border border-border/60 bg-gradient-to-b from-card to-muted/20 p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0 md:p-8">
                <Quote
                  className="h-8 w-8 text-[#1F4D3F]/70"
                  aria-hidden
                />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/50 pt-6">
                  <Image
                    src={item.image}
                    alt=""
                    width={48}
                    height={48}
                    quality={75}
                    sizes="48px"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
