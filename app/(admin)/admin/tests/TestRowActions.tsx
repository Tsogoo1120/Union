'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleTestPublished, deleteTest } from '@/app/actions/tests';
import { TestDialog } from './TestDialog';

interface Props {
  test: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    questions: unknown;
    is_published: boolean;
  };
  isPublished: boolean;
}

export function TestRowActions({ test, isPublished }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTestPublished(test.id, !isPublished);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm('Delete this test? This cannot be undone.')) return;
    startTransition(async () => {
      await deleteTest(test.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <TestDialog mode="edit" test={test} variant="icon" />
      <button
        onClick={handleToggle}
        disabled={isPending}
        title={isPublished ? 'Unpublish' : 'Publish'}
        className={`p-1 rounded transition-colors disabled:opacity-50 ${
          isPublished
            ? 'text-primary hover:bg-accent'
            : 'text-muted-foreground hover:bg-accent'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {isPublished ? 'visibility' : 'visibility_off'}
        </span>
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Delete test"
        className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  );
}
