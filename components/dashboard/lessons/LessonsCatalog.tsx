import { LessonCard, type LessonSummary } from "./LessonCard";
import { PageHeader } from "@/components/ui/page-header";

export function LessonsCatalog({
  lessons,
  lessonCount,
}: {
  lessons: LessonSummary[];
  lessonCount: number;
}) {
  const empty = lessons.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Хичээлүүд"
        description={`${lessonCount} хичээл боломжтой`}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}

        {empty ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm leading-relaxed text-muted-foreground shadow-soft">
            Одоогоор хичээл байхгүй байна.
          </div>
        ) : null}
      </div>
    </div>
  );
}
