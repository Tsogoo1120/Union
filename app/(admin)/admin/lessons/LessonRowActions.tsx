'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleLessonPublished, deleteLesson } from '@/app/actions/lessons';
import { LessonDialog } from './LessonDialog';

interface Props {
  lesson: {
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
  isPublished: boolean;
}

export function LessonRowActions({ lesson, isPublished }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleLessonPublished(lesson.id, !isPublished);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm('Delete this lesson? This cannot be undone.')) return;
    startTransition(async () => {
      await deleteLesson(lesson.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <LessonDialog mode="edit" lesson={lesson} variant="icon" />
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
        title="Delete lesson"
        className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  );
}
