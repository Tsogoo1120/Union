import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/ui/page-shell';
import { PageHeader } from '@/components/ui/page-header';

export default async function TestsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();
  const { data: tests } = await supabase
    .from('psychology_tests')
    .select('id, title, description, questions')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <PageShell className="max-w-3xl pb-24 md:pb-10">
      <div className="space-y-8">
        <PageHeader
          title="Сэтгэл зүйн тестүүд"
          description="Дотоод архетип болон зан үйлийн хэв маягийг илрүүлэхэд зориулагдсан гүнзгий танин мэдэхүйн үнэлгээнүүдийг судлаарай."
        />

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button className="border-b-2 border-primary pb-3 text-sm font-medium text-foreground">
            Боломжтой
          </button>
        </div>

        {/* Test list */}
        <div className="flex flex-col">
        {(tests ?? []).map((test) => {
          const questionCount = Array.isArray(test.questions) ? test.questions.length : 0;
          const estimatedMinutes = questionCount > 0 ? Math.ceil(questionCount * 0.25) : null;

          return (
            <Link
              key={test.id}
              href={`/dashboard/tests/${test.id}`}
              className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-4 transition-colors hover:bg-accent"
            >
              <div className="flex-grow pr-4">
                <h3 className="mb-1 text-sm font-medium text-foreground">{test.title}</h3>
                {test.description && (
                  <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                    {test.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {questionCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">help</span>
                      {questionCount} асуулт
                    </span>
                  )}
                  {estimatedMinutes && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      ~{estimatedMinutes} минут
                    </span>
                  )}
                </div>
              </div>
              <span className="material-symbols-outlined text-[22px] text-muted-foreground transition-colors group-hover:text-foreground">
                chevron_right
              </span>
            </Link>
          );
        })}

        {(tests ?? []).length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Одоогоор тест байхгүй байна.
          </div>
        )}
      </div>
      </div>
    </PageShell>
  );
}
