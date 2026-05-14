"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Sparkles, Brain, Users, GraduationCap, X, Clock, MessageCircle } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export type ZodiacPreview = {
  id: string;
  name: string;
  date_range: string | null;
  image_url: string | null;
  description: string | null;
};

export type TestPreview = {
  id: string;
  title: string;
  description: string | null;
  questionCount: number;
};

export type LessonPreview = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
};

export type FeaturePreviews = {
  zodiac: ZodiacPreview[];
  tests: TestPreview[];
  lessons: LessonPreview[];
};

type CardKey = "tarot" | "psychology" | "community" | "video";

type CardConfig = {
  key: CardKey;
  title: string;
  description: string;
  Icon: typeof Sparkles;
  featured: boolean;
};

const CARDS: CardConfig[] = [
  {
    key: "tarot",
    title: "7 хоног бүрийн collective тарот уншлага",
    description: "12 орд болгоны тарот уншлага энд уншигдах болно.",
    Icon: Sparkles,
    featured: false,
  },
  {
    key: "psychology",
    title: "Сэтгэл зүйн тест",
    description: "Өөрийгөө гүнзгий таньж мэдэх сэтгэл зүйн шинжилгээнүүд.",
    Icon: Brain,
    featured: true,
  },
  {
    key: "community",
    title: "Community",
    description:
      "Та бүхэн өөрт тохиолдсон явдалуудаа бусадтай хуваалцах боломжтой.",
    Icon: Users,
    featured: false,
  },
  {
    key: "video",
    title: "Видео хичээл",
    description: "Одоогоор таны видео хичээлүүд энд байрлана.",
    Icon: GraduationCap,
    featured: false,
  },
];

export function FeatureCardsList({ previews }: { previews: FeaturePreviews }) {
  const [openKey, setOpenKey] = useState<CardKey | null>(null);

  return (
    <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-6 lg:mt-16">
      {CARDS.map((card) => (
        <Reveal key={card.key}>
          <article
            className={cn(
              "group relative flex h-full flex-col rounded-2xl border bg-gradient-to-b from-card to-card/80 p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0 md:p-8",
              card.featured
                ? "border-[#1F4D3F]/45 shadow-[0_24px_80px_-32px_rgba(31,77,63,0.35)] md:scale-[1.02] motion-reduce:md:scale-100"
                : "border-border/60 hover:border-border",
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border border-[#1F4D3F]/20 bg-[#1F4D3F]/[0.08] text-[#1F4D3F]",
                card.featured && "bg-[#1F4D3F]/12",
              )}
            >
              <card.Icon className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
              {card.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
              {card.description}
            </p>
            <button
              type="button"
              onClick={() => setOpenKey(card.key)}
              className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#1F4D3F] transition group-hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3F] focus-visible:ring-offset-2"
            >
              Дэлгэрэнгүй
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            {card.featured && (
              <span className="absolute right-4 top-4 rounded-full bg-[#1F4D3F]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1F4D3F]">
                Онцлох
              </span>
            )}
          </article>
        </Reveal>
      ))}

      <FeatureDialog
        cardKey={openKey}
        onClose={() => setOpenKey(null)}
        previews={previews}
      />
    </div>
  );
}

function FeatureDialog({
  cardKey,
  onClose,
  previews,
}: {
  cardKey: CardKey | null;
  onClose: () => void;
  previews: FeaturePreviews;
}) {
  const card = cardKey ? CARDS.find((c) => c.key === cardKey) : null;

  return (
    <Dialog.Root open={cardKey !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] flex flex-col data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {card && (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-border/60 bg-gradient-to-b from-card to-card/80 px-6 py-5 md:px-8 md:py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1F4D3F]/20 bg-[#1F4D3F]/[0.08] text-[#1F4D3F]">
                    <card.Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <Dialog.Title className="font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                      {card.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                      {card.key === "community"
                        ? "Жишээ нийтлэл — бодит community хэрэглэгчдийн нийтлэлийг харахын тулд бүртгүүлнэ үү."
                        : "Одоогоор боломжтой агуулга. Үзэхийн тулд бүртгүүлнэ үү."}
                    </Dialog.Description>
                  </div>
                </div>
                <Dialog.Close
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3F] focus-visible:ring-offset-2"
                  aria-label="Хаах"
                >
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
                {card.key === "tarot" && <TarotPreviewGrid items={previews.zodiac} />}
                {card.key === "psychology" && <PsychologyPreviewList items={previews.tests} />}
                {card.key === "video" && <LessonsPreviewGrid items={previews.lessons} />}
                {card.key === "community" && <CommunityExample />}
              </div>

              <div className="border-t border-border/60 bg-[#FAFAF7] px-6 py-4 md:px-8 md:py-5">
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    {card.key === "community"
                      ? "Жинхэнэ community-д нэгдэхийн тулд бүртгүүлнэ үү."
                      : "Энэхүү контентыг бүрэн үзэхийн тулд бүртгүүлнэ үү."}
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F4D3F] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a4236] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3F] focus-visible:ring-offset-2"
                  >
                    Бүртгүүлэх
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function LockedOverlay({ label = "Бүртгэлтэй гишүүдэд" }: { label?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background/30 via-background/55 to-background/75 backdrop-blur-[3px]">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1F4D3F]/25 bg-card/90 px-3 py-1.5 text-xs font-semibold text-[#1F4D3F] shadow-sm">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        {label}
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function TarotPreviewGrid({ items }: { items: ZodiacPreview[] }) {
  if (items.length === 0) {
    return <EmptyState message="Одоогоор тарот уншлага байхгүй байна. Удахгүй нэмэгдэх болно." />;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((sign) => (
        <div
          key={sign.id}
          className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
            {sign.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sign.image_url}
                alt={sign.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1F4D3F]/10 to-[#1F4D3F]/5">
                <Sparkles className="h-8 w-8 text-[#1F4D3F]/40" aria-hidden />
              </div>
            )}
          </div>
          <div className="space-y-0.5 p-3">
            <h4 className="text-sm font-medium text-foreground">{sign.name}</h4>
            {sign.date_range && (
              <p className="text-xs text-muted-foreground">{sign.date_range}</p>
            )}
          </div>
          <LockedOverlay />
        </div>
      ))}
    </div>
  );
}

function PsychologyPreviewList({ items }: { items: TestPreview[] }) {
  if (items.length === 0) {
    return <EmptyState message="Одоогоор сэтгэл зүйн тест байхгүй байна. Удахгүй нэмэгдэх болно." />;
  }
  return (
    <div className="space-y-3">
      {items.map((test) => {
        const minutes = test.questionCount > 0 ? Math.ceil(test.questionCount * 0.25) : null;
        return (
          <div
            key={test.id}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-medium text-foreground md:text-base">{test.title}</h4>
            {test.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {test.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              {test.questionCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Brain className="h-3.5 w-3.5" aria-hidden />
                  {test.questionCount} асуулт
                </span>
              )}
              {minutes && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  ~{minutes} минут
                </span>
              )}
            </div>
            <LockedOverlay />
          </div>
        );
      })}
    </div>
  );
}

function LessonsPreviewGrid({ items }: { items: LessonPreview[] }) {
  if (items.length === 0) {
    return <EmptyState message="Одоогоор видео хичээл байхгүй байна. Удахгүй нэмэгдэх болно." />;
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((lesson) => (
        <div
          key={lesson.id}
          className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="aspect-video w-full overflow-hidden bg-muted">
            {lesson.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lesson.thumbnail_url}
                alt={lesson.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1F4D3F]/10 to-[#1F4D3F]/5">
                <GraduationCap className="h-10 w-10 text-[#1F4D3F]/40" aria-hidden />
              </div>
            )}
          </div>
          <div className="space-y-1 p-4">
            <h4 className="text-sm font-medium text-foreground">{lesson.title}</h4>
            {lesson.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {lesson.description}
              </p>
            )}
            {lesson.duration_minutes && (
              <p className="inline-flex items-center gap-1 pt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" aria-hidden />
                {lesson.duration_minutes} минут
              </p>
            )}
          </div>
          <LockedOverlay />
        </div>
      ))}
    </div>
  );
}

function CommunityExample() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-[#1F4D3F]/30 bg-[#1F4D3F]/[0.04] px-4 py-3 text-xs text-[#1F4D3F]">
        <span className="font-semibold">Жишээ:</span> Бодит хэрэглэгчдийн нийтлэлийг хувийн нууцлалын үүднээс энд харуулахгүй. Доорх жишээ нь community хэсэг хэрхэн харагдахыг л үзүүлж байна.
      </div>

      <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 px-4 pt-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-foreground">
            СО
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Сансар О.</p>
            <p className="text-xs text-muted-foreground">2 цаг өмнө</p>
          </div>
        </div>

        <div className="px-4 py-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            Энэ долоо хоногийн collective тарот уншлага миний амьдралд яг таарч байсан нь гайхалтай. Сүүлийн үед өөртөө итгэх итгэлээ алдаад байсан ч өнөөдөр энэ платформын тестүүдийг хийсний дараа өөрийгөө илүү гүнзгий ойлгож эхэллээ. Танд бас ийм мэдрэмж төрсөн үү?
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-4 pb-4 pt-3">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" aria-hidden />
            3 сэтгэгдэл
          </span>
        </div>

        <div className="space-y-3 border-t border-border bg-muted/30 px-4 py-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] font-medium text-muted-foreground">
              БТ
            </div>
            <div className="flex-grow">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">Болор Т.</span>
                <span className="text-xs text-muted-foreground">1 цаг өмнө</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                Танай бичлэг яг миний мэдрэмжийг илэрхийлсэн юм шиг санагдлаа. Бид адилхан замаар явж байгаа бололтой.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] font-medium text-muted-foreground">
              УН
            </div>
            <div className="flex-grow">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">Уянга Н.</span>
                <span className="text-xs text-muted-foreground">30 мин өмнө</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                Сэтгэл зүйн тест үнэхээр гүн гүнзгий хийгдсэн байсан. Хуваалцсанд баярлалаа.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
