'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { createTest, updateTest } from '@/app/actions/tests';

type PsychologyTest = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  questions: unknown;
  is_published: boolean;
};

const EXAMPLE_QUESTIONS = `[
  {
    "text": "How do you recharge after a long day?",
    "options": ["Time alone", "Socializing with friends", "Creative activity", "Physical exercise"]
  },
  {
    "text": "When making decisions, you rely more on…",
    "options": ["Logic and analysis", "Gut feeling", "Others' opinions", "Past experience"]
  }
]`;

export function TestDialog({
  mode = 'create',
  test,
  variant = 'primary',
}: {
  mode?: 'create' | 'edit';
  test?: PsychologyTest;
  variant?: 'primary' | 'icon';
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const questionsDefault =
    mode === 'edit'
      ? JSON.stringify(test?.questions ?? [], null, 2)
      : EXAMPLE_QUESTIONS;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result =
        mode === 'edit' && test ? await updateTest(test.id, formData) : await createTest(formData);
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
            title={mode === 'edit' ? 'Edit test' : 'New test'}
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
            {mode === 'edit' ? 'Edit' : 'New Test'}
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-card shadow-xl max-h-[90vh]">
          <div className="p-5">
            <Dialog.Title className="text-base font-semibold text-foreground">
              {mode === 'edit' ? 'Edit Psychology Test' : 'New Psychology Test'}
            </Dialog.Title>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Personality Archetype Assessment"
                  defaultValue={test?.title ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Slug <span className="text-xs font-normal text-muted-foreground">(auto-generated if blank)</span>
                </label>
                <input
                  name="slug"
                  placeholder="e.g. personality-archetype"
                  defaultValue={test?.slug ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Brief description shown to users before they start the test…"
                  defaultValue={test?.description ?? ''}
                  className="mt-2 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Questions (JSON) <span className="text-destructive">*</span>
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                  Array of objects with &quot;text&quot; and &quot;options&quot; (string array).
                </p>
                <textarea
                  name="questions"
                  rows={10}
                  required
                  defaultValue={questionsDefault}
                  className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <input type="hidden" name="is_published" value="false" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    value="true"
                    defaultChecked={test?.is_published ?? false}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">Publish immediately</span>
                </label>
              </div>

              {error && (
                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

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
                  {isPending ? (mode === 'edit' ? 'Saving…' : 'Creating…') : mode === 'edit' ? 'Save Changes' : 'Create Test'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
