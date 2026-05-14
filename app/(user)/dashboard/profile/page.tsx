import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { PageShell } from '@/components/ui/page-shell';
import { PageHeader } from '@/components/ui/page-header';
import { LogoutButton } from './LogoutButton';

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  return (
    <PageShell className="max-w-2xl pb-24 md:pb-10">
      <div className="space-y-8">
        <PageHeader title="Профайл" description="Таны бүртгэлийн мэдээлэл." />

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="divide-y divide-border">
            <div className="px-6 py-5 md:px-8 md:py-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Нэр
              </p>
              <p className="mt-1 text-sm text-foreground">{profile.full_name ?? '—'}</p>
            </div>

            <div className="px-6 py-5 md:px-8 md:py-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Имэйл
              </p>
              <p className="mt-1 text-sm text-foreground">{profile.email}</p>
            </div>

            <div className="px-6 py-5 md:px-8 md:py-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Эрх
              </p>
              <p className="mt-1 text-sm capitalize text-foreground">
                {profile.subscription_status}
              </p>
              {profile.subscription_expires_at && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Дуусах хугацаа:{' '}
                  {new Date(profile.subscription_expires_at).toLocaleDateString('mn-MN')}
                </p>
              )}
            </div>

            <div className="px-6 py-5 md:px-8 md:py-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Гишүүнчлэл эхэлсэн
              </p>
              <p className="mt-1 text-sm text-foreground">
                {new Date(profile.created_at).toLocaleDateString('mn-MN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div>
          <LogoutButton />
        </div>
      </div>
    </PageShell>
  );
}
