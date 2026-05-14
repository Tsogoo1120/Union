import { createAdminClient } from "@/lib/supabase/admin";
import { Reveal } from "./reveal";
import {
  FeatureCardsList,
  type FeaturePreviews,
  type ZodiacPreview,
  type TestPreview,
  type LessonPreview,
} from "./FeatureCardsList";

async function fetchPreviews(): Promise<FeaturePreviews> {
  try {
    const admin = createAdminClient();

    const [zodiacRes, testsRes, lessonsRes] = await Promise.all([
      admin
        .from("zodiac_signs")
        .select("id, name, date_range, image_url, description")
        .eq("is_published", true)
        .order("created_at", { ascending: true })
        .limit(12),
      admin
        .from("psychology_tests")
        .select("id, title, description, questions")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6),
      admin
        .from("lessons")
        .select("id, title, description, thumbnail_url, duration_minutes")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const zodiac: ZodiacPreview[] = (zodiacRes.data ?? []).map((z) => ({
      id: z.id,
      name: z.name,
      date_range: z.date_range,
      image_url: z.image_url,
      description: z.description,
    }));

    const tests: TestPreview[] = (testsRes.data ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      questionCount: Array.isArray(t.questions) ? t.questions.length : 0,
    }));

    const lessons: LessonPreview[] = (lessonsRes.data ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      thumbnail_url: l.thumbnail_url,
      duration_minutes: l.duration_minutes,
    }));

    return { zodiac, tests, lessons };
  } catch {
    return { zodiac: [], tests: [], lessons: [] };
  }
}

export default async function FeatureCards() {
  const previews = await fetchPreviews();

  return (
    <section
      id="uilchilgee"
      className="scroll-mt-24 border-b border-border/40 bg-background py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2
              id="features-heading"
              className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Үйлчилгээ
            </h2>
          </div>
        </Reveal>

        <FeatureCardsList previews={previews} />

        <svg
          className="mx-auto mt-16 h-6 w-48 text-border md:mt-20"
          viewBox="0 0 200 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 6c24-4 48 8 72 0s48-8 72 0 48 8 72 0"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    </section>
  );
}
