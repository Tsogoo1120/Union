import { createClient } from '@/lib/supabase/server';
import { LessonDialog } from './LessonDialog';
import { LessonRowActions } from './LessonRowActions';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function AdminLessonsPage() {
  const supabase = await createClient();

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, slug, category, description, video_url, thumbnail_url, is_published, duration_minutes, created_at')
    .order('created_at', { ascending: false });

  const published = (lessons ?? []).filter((l) => l.is_published).length;
  const drafts = (lessons ?? []).length - published;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Content</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
            </p>
          </div>
          <LessonDialog mode="create" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
        {/* Error */}
        {error && (
          <p className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load lessons: {error.message}
          </p>
        )}

        {/* Empty state */}
        {!error && (lessons ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-muted-foreground">
              auto_stories
            </span>
            <p className="mb-2 text-sm text-muted-foreground">No lessons yet.</p>
            <p className="text-sm text-muted-foreground">
              Click &quot;New Lesson&quot; to add your first piece of content.
            </p>
          </div>
        )}

        {/* Lessons table */}
        {(lessons ?? []).length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Title
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">
                      Category
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">
                      Duration
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">
                      Status
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">
                      Created
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(lessons ?? []).map((lesson) => (
                    <tr
                      key={lesson.id}
                      className="transition-colors hover:bg-accent"
                    >
                      {/* Title */}
                      <td className="py-3 px-4">
                        <span className="line-clamp-1 text-sm font-medium text-foreground">
                          {lesson.title}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {lesson.category}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                        {lesson.duration_minutes ? `${lesson.duration_minutes} min` : '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            lesson.is_published
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border bg-muted text-muted-foreground'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {lesson.is_published ? 'public' : 'edit_note'}
                          </span>
                          {lesson.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                        {formatDate(lesson.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <LessonRowActions
                          lesson={{
                            id: lesson.id,
                            title: lesson.title,
                            slug: lesson.slug,
                            category: lesson.category,
                            description: lesson.description,
                            video_url: lesson.video_url,
                            thumbnail_url: lesson.thumbnail_url,
                            duration_minutes: lesson.duration_minutes,
                            is_published: lesson.is_published,
                          }}
                          isPublished={lesson.is_published}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div className="border-t border-border bg-muted/30 px-6 py-3">
              <span className="text-sm text-muted-foreground">
                {(lessons ?? []).length} lesson{(lessons ?? []).length !== 1 ? 's' : ''} total
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
