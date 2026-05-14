import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PaymentRowActions } from './PaymentRowActions';

type Tab = 'pending' | 'approved' | 'denied';

type PaymentWithProfile = {
  id: string;
  status: string;
  amount: number | null;
  submitted_at: string;
  reviewed_at: string | null;
  admin_note: string | null;
  bank_reference: string | null;
  screenshot_path: string | null;
  screenshotUrl: string | null;
  user: { id: string; full_name: string | null; email: string } | null;
};

function normalizePaymentUser(
  user: unknown,
): { id: string; full_name: string | null; email: string } | null {
  if (user == null) return null;
  if (Array.isArray(user)) {
    const first = user[0];
    if (first && typeof first === 'object' && 'id' in first) {
      return first as { id: string; full_name: string | null; email: string };
    }
    return null;
  }
  if (typeof user === 'object' && 'id' in user) {
    return user as { id: string; full_name: string | null; email: string };
  }
  return null;
}
const VALID_TABS: Tab[] = ['pending', 'approved', 'denied'];

function formatRelative(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const rawTab = searchParams.tab ?? 'pending';
  const activeTab: Tab = VALID_TABS.includes(rawTab as Tab)
    ? (rawTab as Tab)
    : 'pending';

  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from('payments')
    .select(
      `id, status, amount, submitted_at, reviewed_at, admin_note,
       bank_reference, screenshot_path,
       user:profiles!payments_user_id_fkey ( id, full_name, email )`
    )
    .eq('status', activeTab)
    .order('submitted_at', { ascending: activeTab !== 'pending' });

  const { count: pendingCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const adminStorage = createAdminClient();
  const paymentsWithUrls = await Promise.all(
    (payments ?? []).map(async (p) => {
      let screenshotUrl: string | null = null;
      if (p.screenshot_path) {
        const { data } = await adminStorage.storage
          .from('payment-screenshots')
          .createSignedUrl(p.screenshot_path, 3600);
        screenshotUrl = data?.signedUrl ?? null;
      }
      return { ...p, screenshotUrl };
    })
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'denied', label: 'Denied' },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and manage user payment submissions.
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-grow flex-col px-4 py-8 md:px-8">
        {/* Filter tabs */}
        <div className="mb-4 flex gap-4 border-b border-border">
          {tabs.map(({ key, label }) => {
            const isActive = key === activeTab;
            return (
              <Link
                key={key}
                href={`/admin/payments?tab=${key}`}
                className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
                {key === 'pending' && (pendingCount ?? 0) > 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load payments: {error.message}
          </p>
        )}

        {/* Empty state */}
        {!error && paymentsWithUrls.length === 0 && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No {activeTab} payments.</p>
          </div>
        )}

        {/* Table */}
        {paymentsWithUrls.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Amount</th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:table-cell">
                      {activeTab === 'pending' ? 'Submitted' : 'Reviewed'}
                    </th>
                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:table-cell">Screenshot</th>
                    {activeTab === 'denied' && (
                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Admin Note</th>
                    )}
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(paymentsWithUrls as unknown as PaymentWithProfile[]).map((payment) => {
                    const profile = normalizePaymentUser(payment.user);

                    const dateStr =
                      activeTab === 'pending'
                        ? payment.submitted_at
                        : (payment.reviewed_at ?? payment.submitted_at);

                    return (
                      <tr
                        key={payment.id}
                        className="transition-colors hover:bg-accent"
                      >
                        {/* User */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-foreground">
                              {getInitials(profile?.full_name ?? null)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {profile?.full_name ?? '—'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {profile?.email ?? '—'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-4 text-sm font-medium text-foreground">
                          {Number(payment.amount).toLocaleString('mn-MN')} MNT
                        </td>

                        {/* Date */}
                        <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                          <span title={formatDate(dateStr)}>
                            {formatRelative(dateStr)}
                          </span>
                        </td>

                        {/* Screenshot thumbnail */}
                        <td className="hidden px-4 py-3 lg:table-cell">
                          <div className="flex h-8 w-12 items-center justify-center overflow-hidden rounded border border-border bg-muted">
                            {payment.screenshotUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={payment.screenshotUrl}
                                alt="Receipt"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-[16px] text-muted-foreground">image</span>
                            )}
                          </div>
                        </td>

                        {/* Admin note (denied tab) */}
                        {activeTab === 'denied' && (
                          <td className="py-3 px-4 max-w-xs">
                            <p className="line-clamp-2 break-words text-sm text-muted-foreground">
                              {payment.admin_note ?? '—'}
                            </p>
                          </td>
                        )}

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <PaymentRowActions
                            paymentId={payment.id}
                            screenshotUrl={payment.screenshotUrl}
                            isPending={activeTab === 'pending'}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
