'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatRelative(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return 'дөнгөж сая';
  if (mins < 60) return `${mins} мин өмнө`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} цаг өмнө`;
  const days = Math.floor(hours / 24);
  return `${days} өдрийн өмнө`;
}

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author: { full_name: string | null } | null;
};

export type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author: { full_name: string | null; email: string } | null;
  comments: Comment[];
};

export function PostCard({
  post,
  currentUserId,
}: {
  post: Post;
  currentUserId: string;
}) {
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleComment() {
    if (!commentText.trim()) return;
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('comments').insert({
        post_id: post.id,
        user_id: currentUserId,
        content: commentText.trim(),
      });
      setCommentText('');
      router.refresh();
    });
  }

  const authorName = post.author?.full_name ?? post.author?.email ?? 'Нэргүй';
  const commentCount = post.comments?.length ?? 0;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Post header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-foreground">
          {getInitials(post.author?.full_name ?? null)}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{authorName}</p>
          <p className="text-xs text-muted-foreground">{formatRelative(post.created_at)}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 py-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{post.content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-border px-4 pb-4 pt-3">
        <button
          onClick={() => setShowComments(!showComments)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          {commentCount > 0
            ? `${commentCount} сэтгэгдэл`
            : 'Сэтгэгдэл'}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="space-y-4 border-t border-border bg-muted/30 px-4 py-4">
          {/* Existing comments */}
          {commentCount > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] font-medium text-muted-foreground">
                    {getInitials(comment.author?.full_name ?? null)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {comment.author?.full_name ?? 'Нэргүй'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment composer */}
          <div className="flex gap-3 border-t border-border pt-3">
            <div className="mt-1 h-7 w-7 shrink-0 rounded-full border border-border bg-background" />
            <div className="flex flex-grow items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
                placeholder="Сэтгэгдэл бичих…"
                className="h-9 flex-grow rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <button
                onClick={handleComment}
                disabled={isPending || !commentText.trim()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent disabled:opacity-40"
                title="Сэтгэгдэл нийтлэх"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
