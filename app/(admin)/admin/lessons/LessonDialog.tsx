'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { createLesson, updateLesson } from '@/app/actions/lessons';

type Lesson = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  is_published: boolean;
};

export function LessonDialog({
  mode = 'create',
  lesson,
  variant = 'primary',
}: {
  mode?: 'create' | 'edit';
  lesson?: Lesson;
  variant?: 'primary' | 'icon';
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result =
        mode === 'edit' && lesson
          ? await updateLesson(lesson.id, formData)
          : await createLesson(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {variant === 'icon' ? (
          <button
            type="button"
            title={mode === 'edit' ? 'Edit lesson' : 'New lesson'}
            className="p-1 rounded border border-border bg-background text-muted-foreground hover:bg-accent transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mode === 'edit' ? 'edit' : 'add'}
            </span>
          </button>
        ) : (
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <span className="material-symbols-outlined text-[18px]">
              {mode === 'edit' ? 'edit' : 'add'}
            </span>
            {mode === 'edit' ? 'Edit' : 'New Lesson'}
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-card shadow-xl max-h-[90vh]">
          <div className="p-5">
            <Dialog.Title className="text-base font-semibold text-foreground">
              {mode === 'edit' ? 'Edit Lesson' : 'New Lesson'}
            </Dialog.Title>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Introduction to Jungian Archetypes"
                  defaultValue={lesson?.title ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Slug <span className="text-xs font-normal text-muted-foreground">(auto-generated if blank)</span>
                </label>
                <input
                  name="slug"
                  placeholder="e.g. intro-jungian-archetypes"
                  defaultValue={lesson?.slug ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground">Category</label>
                <input
                  name="category"
                  placeholder="e.g. Psychology, Tarot, Astrology"
                  defaultValue={lesson?.category ?? 'General'}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Brief overview shown on the lesson card…"
                  defaultValue={lesson?.description ?? ''}
                  className="mt-2 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-foreground">Video URL</label>
                <input
                  name="video_url"
                  type="url"
                  placeholder="https://www.youtube.com/embed/…"
                  defaultValue={lesson?.video_url ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm font-medium text-foreground">Thumbnail URL</label>
                <input
                  name="thumbnail_url"
                  type="url"
                  placeholder="https://…/thumbnail.jpg"
                  defaultValue={lesson?.thumbnail_url ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground">Duration (minutes)</label>
                <input
                  name="duration_minutes"
                  type="number"
                  min="1"
                  placeholder="e.g. 45"
                  defaultValue={lesson?.duration_minutes?.toString() ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Publish toggle */}
              <div className="flex items-center gap-3">
                <input type="hidden" name="is_published" value="false" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    value="true"
                    defaultChecked={lesson?.is_published ?? false}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">Publish immediately</span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? (mode === 'edit' ? 'Saving…' : 'Creating…') : mode === 'edit' ? 'Save Changes' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
