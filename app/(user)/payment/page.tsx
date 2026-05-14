import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { getCurrentProfile } from '@/lib/profile';
import { getEffectiveStatus } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { PaymentForm } from './PaymentForm';
import type { PaymentStatus } from '@/lib/types';

const PAYMENT_STATUS_BADGE: Record<PaymentStatus, string> = {
  pending: 'border border-border bg-muted text-muted-foreground',
  approved: 'bg-primary text-primary-foreground',
  denied: 'border border-destructive/20 bg-destructive/10 text-destructive',
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: 'хүлээгдэж буй',
  approved: 'зөвшөөрсөн',
  denied: 'татгалзсан',
};

export default async function PaymentPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (profile.role === 'admin') redirect('/admin/dashboard');

  const effectiveStatus = getEffectiveStatus(profile);
  const supabase = await createClient();
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const expiresAt = profile.subscription_expires_at
    ? new Date(profile.subscription_expires_at)
    : null;

  const isFullyActive =
    effectiveStatus === 'active' &&
    (!expiresAt || expiresAt > sevenDaysFromNow);
  if (isFullyActive) redirect('/dashboard');

  const isRenewWindow =
    effectiveStatus === 'active' &&
    expiresAt !== null &&
    expiresAt > now &&
    expiresAt <= sevenDaysFromNow;

  const { data: latestPayment } = await supabase
    .from('payments')
    .select('status, amount, submitted_at, bank_reference, screenshot_path')
    .eq('user_id', profile.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let screenshotUrl: string | null = null;
  if (latestPayment?.screenshot_path && latestPayment.status === 'pending') {
    const { data: signed } = await supabase.storage
      .from('payment-screenshots')
      .createSignedUrl(latestPayment.screenshot_path, 3600);
    screenshotUrl = signed?.signedUrl ?? null;
  }

  const hasPendingPayment = latestPayment?.status === 'pending';

  const showForm =
    !hasPendingPayment &&
    (['inactive', 'denied', 'expired'].includes(effectiveStatus) || isRenewWindow);

  let heading: string;
  let body: string;
  let badgeLabel: string;
  let badgeClass: string;

  if (hasPendingPayment) {
    heading = 'Төлбөр хянагдаж байна';
    body = 'Таны дэлгэцийн зургийг хүлээн авч хянаж байна. 24 цагийн дотор хандах эрх нээгдэнэ. Нэмэлт үйлдэл шаардлагагүй.';
    badgeLabel = 'хүлээгдэж буй';
    badgeClass = 'border border-border bg-muted text-muted-foreground';
  } else if (isRenewWindow) {
    heading = 'Эрхээ сунгах';
    body = `Таны эрх ${expiresAt!.toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}-нд дуусна. Хандах эрхээ сунгахын тулд шинэ төлбөр илгээнэ үү.`;
    badgeLabel = 'удахгүй дуусна';
    badgeClass = 'border border-border bg-muted text-muted-foreground';
  } else if (effectiveStatus === 'denied') {
    heading = 'Төлбөрөө дахин илгээх';
    body = 'Таны өмнөх төлбөр татгалзагдсан. Манай багийн тэмдэглэлийг харж, шинэ төлбөрийн дэлгэцийн зураг илгээнэ үү.';
    badgeLabel = 'татгалзсан';
    badgeClass = 'border border-destructive/20 bg-destructive/10 text-destructive';
  } else if (effectiveStatus === 'expired') {
    heading = 'Эрхийн хугацаа дууссан';
    body = 'Таны эрхийн хугацаа дууссан. Хандах эрхээ сэргээхийн тулд шинэ төлбөр илгээнэ үү.';
    badgeLabel = 'хугацаа дууссан';
    badgeClass = 'border border-border bg-muted text-muted-foreground';
  } else if (effectiveStatus === 'pending') {
    heading = 'Төлбөр хянагдаж байна';
    body = 'Таны төлбөр одоо хянагдаж байна. 24 цагийн дотор хандах эрх нээгдэнэ.';
    badgeLabel = 'хүлээгдэж буй';
    badgeClass = 'border border-border bg-muted text-muted-foreground';
  } else {
    heading = 'Хандах эрх авахын тулд бүртгүүлнэ үү';
    body = `Доорх дансанд ${(50_000).toLocaleString('mn-MN')}₮ шилжүүлж, төлбөрийн дэлгэцийн зургаа оруулна уу. Админ зөвшөөрснөөс хойш 24 цагийн дотор таны бүртгэл идэвхжинэ.`;
    badgeLabel = 'идэвхгүй';
    badgeClass = 'border border-border bg-muted text-muted-foreground';
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <div className="space-y-6">

          {/* Status badge + heading */}
          <div className="text-center">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
            {badgeLabel}
            </span>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{heading}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>

          {/* Account info */}
          <div className="overflow-hidden rounded-xl border border-border bg-card text-sm">
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Нэр</span>
                <span className="text-sm text-foreground">{profile.full_name ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Имэйл</span>
                <span className="text-sm text-foreground">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Screenshot preview when payment is pending */}
          {hasPendingPayment && screenshotUrl && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Илгээсэн дэлгэцийн зураг
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotUrl}
                alt="Төлбөрийн дэлгэцийн зураг"
                className="max-h-64 w-full object-contain"
              />
            </div>
          )}

          {/* Latest payment row */}
          {latestPayment && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Сүүлийн илгээлт
              </div>
              <div className="divide-y divide-border text-sm">
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Төлөв
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      PAYMENT_STATUS_BADGE[latestPayment.status as PaymentStatus]
                    }`}
                  >
                    {PAYMENT_STATUS_LABEL[latestPayment.status as PaymentStatus] ?? latestPayment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Дүн
                  </span>
                  <span className="text-sm text-foreground">
                    {Number(latestPayment.amount).toLocaleString('mn-MN')}₮
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Илгээсэн
                  </span>
                  <span className="text-sm text-foreground">
                    {new Date(latestPayment.submitted_at).toLocaleDateString('mn-MN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {latestPayment.bank_reference && (
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Лавлах дугаар
                    </span>
                    <span className="font-mono text-xs text-foreground">
                      {latestPayment.bank_reference}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload form */}
          {showForm && <PaymentForm />}

          {/* Sign out */}
          <div className="text-center">
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
