import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { computeSchmishekScores, getDominantSchmishekScales } from '@/lib/schmishek';
import { PageShell } from '@/components/ui/page-shell';
import { PageHeader } from '@/components/ui/page-header';

export default async function TestResultPage({
  params,
}: {
  params: { id: string; resultId: string };
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();

  // Support `/results/latest` as a stable entry point.
  if (params.resultId === 'latest') {
    const { data: latest } = await supabase
      .from('test_results')
      .select('id')
      .eq('test_id', params.id)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latest?.id) notFound();
    redirect(`/dashboard/tests/${params.id}/results/${latest.id}`);
  }

  const [{ data: test }, { data: result }] = await Promise.all([
    supabase
      .from('psychology_tests')
      .select('id, title, slug, description')
      .eq('id', params.id)
      .single(),
    supabase
      .from('test_results')
      .select('id, answers, created_at')
      .eq('id', params.resultId)
      .eq('test_id', params.id)
      .eq('user_id', profile.id)
      .single(),
  ]);

  if (!test || !result) notFound();

  const answers = (result.answers ?? {}) as Record<number, number>;

  const isSchmishek = test.slug === 'schmishek';
  const scores = isSchmishek ? computeSchmishekScores(answers) : [];
  const dominant = isSchmishek ? getDominantSchmishekScales(scores) : [];

  return (
    <PageShell className="max-w-3xl pb-24 md:pb-10">
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <PageHeader title="Тестийн үр дүн" description={test.title} />
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/tests/${params.id}/results`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:opacity-80"
            >
              Миний үр дүн
              <span className="material-symbols-outlined text-[16px]">history</span>
            </Link>
            <Link
              href="/dashboard/tests"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:opacity-80"
            >
              Буцах
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {isSchmishek ? (
          <section className="space-y-4">
            {dominant.length > 0 ? (
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-medium text-foreground">Таны давамгай хэв шинжүүд</h2>
                <div className="mt-4 space-y-4">
                  {dominant.map((s) => (
                    <div key={s.scale.key} className="rounded-lg border border-border bg-background p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-foreground">{s.scale.nameMn}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{s.levelLabel}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-foreground">{s.total}</div>
                          <div className="text-xs text-muted-foreground">оноо</div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{s.scale.summary}</p>

                      {s.scale.detailsMn && (
                        <details className="mt-4 rounded-md border border-border bg-card px-4 py-3">
                          <summary className="cursor-pointer text-sm font-medium text-foreground">
                            Дэлгэрэнгүй тайлбар
                          </summary>
                          <div className="mt-3 space-y-4 text-sm text-muted-foreground">
                            <p>{s.scale.detailsMn.general}</p>

                            {s.scale.detailsMn.strengths && s.scale.detailsMn.strengths.length > 0 && (
                              <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-foreground">
                                  Давуу тал
                                </div>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                  {s.scale.detailsMn.strengths.map((t) => (
                                    <li key={t}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {s.scale.detailsMn.weaknesses && s.scale.detailsMn.weaknesses.length > 0 && (
                              <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-foreground">
                                  Сул тал / эрсдэл
                                </div>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                  {s.scale.detailsMn.weaknesses.map((t) => (
                                    <li key={t}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {s.scale.detailsMn.stressors && s.scale.detailsMn.stressors.length > 0 && (
                              <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-foreground">
                                  Стресс үүсгэгч
                                </div>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                  {s.scale.detailsMn.stressors.map((t) => (
                                    <li key={t}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {s.scale.detailsMn.coping && s.scale.detailsMn.coping.length > 0 && (
                              <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-foreground">
                                  Даван туулах
                                </div>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                  {s.scale.detailsMn.coping.map((t) => (
                                    <li key={t}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {s.scale.detailsMn.work && s.scale.detailsMn.work.length > 0 && (
                              <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-foreground">
                                  Ажил/орчны зөвлөмж
                                </div>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                  {s.scale.detailsMn.work.map((t) => (
                                    <li key={t}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-sm">
                Таны оноонуудын түвшин “дундаас дээш” хүрээгүй байна. Доорх хүснэгтээс нийт оноог харна уу.
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-sm font-medium text-foreground">Бүх шкалын оноо</h2>
              </div>
              <div className="divide-y divide-border">
                {[...scores]
                  .sort((a, b) => b.total - a.total)
                  .map((s) => (
                    <div key={s.scale.key} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">{s.scale.nameMn}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{s.levelLabel}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold text-foreground">{s.total}</div>
                        <div className="text-xs text-muted-foreground">оноо</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Энэ тестийн хувьд автомат оноо тооцоолол хараахан холбогдоогүй байна. Гэхдээ таны хариултууд
              амжилттай хадгалагдсан.
            </p>
          </section>
        )}
      </div>
    </PageShell>
  );
}

