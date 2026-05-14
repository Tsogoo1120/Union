import { createClient } from '@/lib/supabase/server';
import { ZodiacDialog } from './ZodiacDialog';
import { ZodiacRowActions } from './ZodiacRowActions';

export default async function AdminZodiacPage() {
  const supabase = await createClient();

  const { data: signs, error } = await supabase
    .from('zodiac_signs')
    .select('id, name, slug, date_range, image_url, content, is_published, created_at')
    .order('name', { ascending: true });

  const published = (signs ?? []).filter((s) => s.is_published).length;
  const total = (signs ?? []).length;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Zodiac Signs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {published} published · {total} total
            </p>
          </div>
          <ZodiacDialog mode="create" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
        {error && (
          <p className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load zodiac signs: {error.message}
          </p>
        )}

        {!error && total === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-muted-foreground">
              star
            </span>
            <p className="mb-2 text-sm text-muted-foreground">No zodiac signs yet.</p>
            <p className="text-sm text-muted-foreground">
              Click &quot;New Sign&quot; to add your first zodiac reading.
            </p>
          </div>
        )}

        {total > 0 && (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Name
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">
                      Date Range
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(signs ?? []).map((sign) => (
                    <tr
                      key={sign.id}
                      className="transition-colors hover:bg-accent"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-foreground">
                          {sign.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          /{sign.slug}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                        {sign.date_range ?? '—'}
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            sign.is_published
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border bg-muted text-muted-foreground'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {sign.is_published ? 'public' : 'edit_note'}
                          </span>
                          {sign.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ZodiacRowActions
                          sign={{
                            id: sign.id,
                            name: sign.name,
                            slug: sign.slug,
                            date_range: sign.date_range,
                            image_url: sign.image_url,
                            content: sign.content,
                            is_published: sign.is_published,
                          }}
                          isPublished={sign.is_published}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border bg-muted/30 px-6 py-3">
              <span className="text-sm text-muted-foreground">
                {total} sign{total !== 1 ? 's' : ''} total
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
