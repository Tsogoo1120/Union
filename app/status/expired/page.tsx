import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/profile';
import { getEffectiveStatus } from '@/lib/subscription';
import { logout } from '@/app/actions/auth';

export default async function ExpiredPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  if (getEffectiveStatus(profile) === 'active') redirect('/dashboard');

  const expiresAt = profile.subscription_expires_at
    ? new Date(profile.subscription_expires_at)
    : null;

  const expiryLabel = expiresAt
    ? expiresAt.toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-10 text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="rounded-full border border-border bg-muted p-4">
            <span
              className="material-symbols-outlined text-[32px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Таны эрхийн хугацаа дууслаа
            </h1>
            {expiryLabel ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Таны эрх <span className="font-medium text-foreground">{expiryLabel}</span>-нд дууссан.{' '}
                Хандах эрхээ сэргээхийн тулд одоо сунгана уу.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Таны эрх идэвхгүй болсон. Хандах эрхээ сэргээхийн тулд одоо сунгана уу.
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/payment"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Одоо сунгах
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Гарах
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
