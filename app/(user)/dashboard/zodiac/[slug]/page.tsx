import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/ui/page-shell';

export default async function ZodiacDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();

  // Try by slug first, then by id
  let { data: sign } = await supabase
    .from('zodiac_signs')
    .select('id, name, image_url, date_range, slug, content')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!sign) {
    const { data } = await supabase
      .from('zodiac_signs')
      .select('id, name, image_url, date_range, slug, content')
      .eq('id', params.slug)
      .maybeSingle();
    sign = data;
  }

  if (!sign) notFound();

  // Fetch other signs for carousel
  const { data: otherSigns } = await supabase
    .from('zodiac_signs')
    .select('id, name, image_url, date_range, slug')
    .neq('id', sign.id)
    .order('id', { ascending: true })
    .limit(8);

  const content =
    typeof sign.content === 'string'
      ? sign.content
      : sign.content
      ? JSON.stringify(sign.content)
      : null;

  return (
    <PageShell className="pb-24 md:pb-10">
      <div className="mx-auto w-full max-w-[720px] space-y-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard/zodiac" className="transition-colors hover:text-foreground">
            Зурхай
          </Link>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          <span className="text-foreground">{sign.name}</span>
        </nav>

        {/* Hero */}
        <header className="w-full">
          <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted shadow-sm aspect-[16/9] md:aspect-[2/1]">
            {sign.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sign.image_url}
                alt={sign.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="material-symbols-outlined text-[64px] text-muted-foreground">
                  star
                </span>
              </div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-5 text-left">
              {sign.date_range && (
                <span className="mb-2 text-xs font-medium uppercase tracking-widest text-white/80">
                  {sign.date_range}
                </span>
              )}
              <h1 className="text-2xl font-semibold tracking-tight text-white">{sign.name}</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        {content && (
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm leading-relaxed text-foreground">{content}</p>
          </section>
        )}

      </div>

      {/* Other signs carousel */}
      {otherSigns && otherSigns.length > 0 && (
        <section className="mt-10 border-t border-border pt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-foreground">Бусад архетипүүдийг судлах</h2>
            <Link
              href="/dashboard/zodiac"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:opacity-80"
            >
              Бүгдийг харах
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="hide-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            {otherSigns.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/zodiac/${s.slug ?? s.id}`}
                className="group snap-start w-[200px] flex-shrink-0 rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:bg-accent"
              >
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                  {s.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image_url}
                      alt={s.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="material-symbols-outlined text-[32px] text-muted-foreground">
                        star
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-1 pb-1">
                  <h4 className="text-sm font-medium text-foreground">{s.name}</h4>
                  {s.date_range && (
                    <span className="text-xs text-muted-foreground">{s.date_range}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
