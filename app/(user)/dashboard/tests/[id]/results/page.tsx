import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/ui/page-shell';
import { PageHeader } from '@/components/ui/page-header';

export default async function TestResultsIndexPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();

  const [{ data: test }, { data: results }] = await Promise.all([
    supabase
      .from('psychology_tests')
      .select('id, title')
      .eq('id', params.id)
      .single(),
    supabase
      .from('test_results')
      .select('id, created_at')
      .eq('test_id', params.id)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false }),
  ]);

  return (
    <PageShell className="max-w-3xl pb-24 md:pb-10">
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <PageHeader title="Миний тестийн үр дүн" description={test?.title ?? ''} />
          <Link
            href={`/dashboard/tests/${params.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:opacity-80"
          >
            Тест рүү буцах
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-medium text-foreground">Оролтууд</h2>
              <Link
                href={`/dashboard/tests/${params.id}/results/latest`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:opacity-80"
              >
                Сүүлийн үр дүн
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {(results ?? []).length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Та одоогоор энэ тест дээр үр дүн үүсгээгүй байна.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(results ?? []).map((r, idx) => {
                const dt = r.created_at ? new Date(r.created_at) : null;
                const label = dt
                  ? dt.toLocaleString()
                  : `Attempt #${idx + 1}`;
                return (
                  <Link
                    key={r.id}
                    href={`/dashboard/tests/${params.id}/results/${r.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-accent"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">{label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Үр дүн харах</div>
                    </div>
                    <span className="material-symbols-outlined text-[22px] text-muted-foreground">
                      chevron_right
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

