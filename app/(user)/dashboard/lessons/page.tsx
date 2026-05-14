import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/ui/page-shell';
import { LessonsCatalog } from '@/components/dashboard/lessons/LessonsCatalog';

export default async function LessonsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, description, thumbnail_url, duration_minutes')
    .order('created_at', { ascending: false });

  return (
    <PageShell className="max-w-[1100px] pb-24 md:pb-10">
      <LessonsCatalog lessons={lessons ?? []} lessonCount={lessons?.length ?? 0} />
    </PageShell>
  );
}
