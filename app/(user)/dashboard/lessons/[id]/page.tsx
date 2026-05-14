import { redirect, notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/ui/page-shell';
import { LessonDetailView } from '@/components/dashboard/lessons/LessonDetailView';

export default async function LessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, description, video_url, thumbnail_url, duration_minutes, created_at')
    .eq('id', params.id)
    .single();

  if (!lesson) notFound();

  // Fetch prev/next for navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title')
    .order('created_at', { ascending: false });

  const currentIndex = (allLessons ?? []).findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons![currentIndex - 1] : null;
  const nextLesson =
    currentIndex < (allLessons?.length ?? 0) - 1
      ? allLessons![currentIndex + 1]
      : null;

  return (
    <PageShell className="max-w-[800px] pb-24 md:pb-10">
      <LessonDetailView
        lesson={{
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          video_url: lesson.video_url,
          thumbnail_url: lesson.thumbnail_url,
          duration_minutes: lesson.duration_minutes,
        }}
        prevLesson={prevLesson ? { id: prevLesson.id } : null}
        nextLesson={nextLesson ? { id: nextLesson.id } : null}
      />
    </PageShell>
  );
}
