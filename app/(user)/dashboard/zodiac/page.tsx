import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/ui/page-shell';
import { PageHeader } from '@/components/ui/page-header';

export default async function ZodiacPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();
  const { data: signs } = await supabase
    .from('zodiac_signs')
    .select('id, name, image_url, date_range, slug')
    .eq('is_published', true)
    .order('id', { ascending: true });

  return (
    <PageShell className="pb-24 md:pb-10">
      <div className="space-y-8">
        <PageHeader
          title="Зурхайн уншлага"
          description="Зурхайн 12 тэмдэг дэх архетип сэдвүүд болон танин мэдэхүйн ойлголтуудыг судална уу."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(signs ?? []).map((sign) => (
          <Link
            key={sign.id}
            href={`/dashboard/zodiac/${sign.slug ?? sign.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:bg-accent"
          >
            <div className="h-40 w-full overflow-hidden bg-muted">
              {sign.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sign.image_url}
                  alt={sign.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-muted-foreground">
                    star
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-sm font-medium text-foreground">{sign.name}</h3>
              {sign.date_range && (
                <p className="text-xs text-muted-foreground">{sign.date_range}</p>
              )}
            </div>
          </Link>
        ))}

        {(signs ?? []).length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Одоогоор зурхайн уншлага байхгүй байна.
          </div>
        )}
      </div>
      </div>
    </PageShell>
  );
}
