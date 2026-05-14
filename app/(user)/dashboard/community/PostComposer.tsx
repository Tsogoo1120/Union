'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function PostComposer({
  userId,
  userFullName,
}: {
  userId: string;
  userFullName: string | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!content.trim()) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('community_posts').insert({ user_id: userId, content: content.trim() });
      setContent('');
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-foreground">
          {getInitials(userFullName)}
        </div>
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[88px] w-full resize-none bg-transparent p-0 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            placeholder="Ойлголт эсвэл ажиглалтаа хуваалцаарай..."
          />
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div />
            <button
              onClick={handleSubmit}
              disabled={isPending || !content.trim()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Нийтэлж байна…' : 'Ойлголт нийтлэх'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
