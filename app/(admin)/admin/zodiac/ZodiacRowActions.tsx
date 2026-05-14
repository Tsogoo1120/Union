'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleZodiacPublished, deleteZodiac } from '@/app/actions/zodiac';
import { ZodiacDialog } from './ZodiacDialog';

interface Props {
  sign: {
    id: string;
    name: string;
    slug: string;
    date_range: string | null;
    image_url: string | null;
    content: string | null;
    is_published: boolean;
  };
  isPublished: boolean;
}

export function ZodiacRowActions({ sign, isPublished }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleZodiacPublished(sign.id, !isPublished);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm('Delete this zodiac sign? This cannot be undone.')) return;
    startTransition(async () => {
      await deleteZodiac(sign.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <ZodiacDialog mode="edit" sign={sign} variant="icon" />
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
        title="Delete sign"
        className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  );
}
