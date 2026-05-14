import { createClient } from '@/lib/supabase/server';
import { TestDialog } from './TestDialog';
import { TestRowActions } from './TestRowActions';

export default async function AdminTestsPage() {
  const supabase = await createClient();

  const { data: tests, error } = await supabase
    .from('psychology_tests')
    .select('id, title, slug, description, questions, is_published, created_at')
    .order('created_at', { ascending: false });

  const published = (tests ?? []).filter((t) => t.is_published).length;
  const total = (tests ?? []).length;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Psychology Tests</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {published} published · {total} total
            </p>
          </div>
          <TestDialog mode="create" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
        {error && (
          <p className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load tests: {error.message}
          </p>
        )}

        {!error && total === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-muted-foreground">
              psychology
            </span>
            <p className="mb-2 text-sm text-muted-foreground">No tests yet.</p>
            <p className="text-sm text-muted-foreground">
              Click &quot;New Test&quot; to create your first psychology test.
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
                      Title
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">
                      Questions
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
                  {(tests ?? []).map((test) => {
                    const qCount = Array.isArray(test.questions) ? test.questions.length : 0;
                    return (
                      <tr
                        key={test.id}
                        className="transition-colors hover:bg-accent"
                      >
                        <td className="py-3 px-4">
                          <span className="line-clamp-1 text-sm font-medium text-foreground">
                            {test.title}
                          </span>
                          {test.description && (
                            <span className="block line-clamp-1 text-xs text-muted-foreground">
                              {test.description}
                            </span>
                          )}
                        </td>
                        <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                          {qCount} question{qCount !== 1 ? 's' : ''}
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              test.is_published
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-muted text-muted-foreground'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {test.is_published ? 'public' : 'edit_note'}
                            </span>
                            {test.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <TestRowActions
                            test={{
                              id: test.id,
                              title: test.title,
                              slug: test.slug,
                              description: test.description,
                              questions: test.questions,
                              is_published: test.is_published,
                            }}
                            isPublished={test.is_published}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border bg-muted/30 px-6 py-3">
              <span className="text-sm text-muted-foreground">
                {total} test{total !== 1 ? 's' : ''} total
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
