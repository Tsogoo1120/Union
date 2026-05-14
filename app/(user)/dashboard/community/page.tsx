import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/ui/page-shell';
import { PageHeader } from '@/components/ui/page-header';
import { PostComposer } from './PostComposer';
import { PostCard, Post } from './PostCard';

export default async function CommunityPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('community_posts')
    .select(`
      id, content, created_at, user_id,
      author:profiles!user_id ( full_name, email ),
      comments ( id, content, created_at, user_id, author:profiles!user_id ( full_name ) )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <PageShell className="pb-24 md:pb-10">
      <div className="space-y-8">
        <PageHeader
          title="Community"
          description="Өөрийнхөө түүхийг хуваалцах болон асуумаар байгаа асуултуудаа нэгнээсээ асуух сурч мэдсэнээ нэгэнтэйгээ хуваалцах хэсэг."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Feed column */}
          <div className="flex flex-col gap-6 lg:col-span-8">

            <PostComposer userId={profile.id} userFullName={profile.full_name} />

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Сүүлийн нийтлэл
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {(posts ?? []).length === 0 && (
              <p className="rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                Одоогоор нийтлэл байхгүй. Эхлээд та ойлголтоо хуваалцаарай.
              </p>
            )}

            {(posts ?? []).map((post) => (
              <PostCard
                key={post.id}
                post={post as unknown as Post}
                currentUserId={profile.id}
              />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="hidden flex-col gap-4 lg:col-span-4 lg:flex">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                 дүрэм
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined mt-0.5 text-[16px] text-primary">
                    check
                  </span>
                 Бусдыгаа хүндлэх.
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined mt-0.5 text-[16px] text-primary">
                    check
                  </span>
                  Үзэл бодлыг хүндлэх.
                </li>

              </ul>
            </div>
          </aside>

        </div>
      </div>
    </PageShell>
  );
}
