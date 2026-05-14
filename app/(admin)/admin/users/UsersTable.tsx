'use client';

import { useMemo, useState } from 'react';
import { getEffectiveStatus } from '@/lib/subscription';

export type AdminProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  created_at: string | null;
};

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-primary text-primary-foreground',
  expired: 'border border-border bg-muted text-muted-foreground',
  pending: 'border border-border bg-muted text-muted-foreground',
  denied: 'border border-destructive/20 bg-destructive/10 text-destructive',
  inactive: 'border border-border bg-muted text-muted-foreground',
};

type Props = {
  profiles: AdminProfileRow[];
};

export function UsersTable({ profiles }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => {
      const name = (p.full_name ?? '').toLowerCase();
      const email = (p.email ?? '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [profiles, search]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Users</h1>
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-muted-foreground">
              search
            </span>
            <input
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Search by name or email..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search users by name or email"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-border bg-muted/30 px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div>User</div>
            <div>Status</div>
            <div>Joined</div>
            <div>Expires</div>
            <div className="text-right">Role</div>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {filtered.map((profile) => {
              const effectiveStatus = getEffectiveStatus(
                profile as {
                  role: 'user' | 'admin';
                  subscription_status:
                    | 'inactive'
                    | 'pending'
                    | 'active'
                    | 'denied'
                    | 'expired';
                  subscription_expires_at: string | null;
                },
              );
              const badgeClass = STATUS_BADGE[effectiveStatus] ?? STATUS_BADGE.inactive;
              const isExpired =
                profile.subscription_expires_at &&
                new Date(profile.subscription_expires_at) < new Date();

              return (
                <div
                  key={profile.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-foreground">
                      {getInitials(profile.full_name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        {profile.full_name ?? '—'}
                        {profile.role === 'admin' && (
                          <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            title="Admin"
                          >
                            shield_person
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{profile.email}</div>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeClass}`}
                    >
                      {effectiveStatus}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>

                  <div
                    className={`text-sm ${
                      isExpired ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                  >
                    {profile.subscription_expires_at
                      ? new Date(profile.subscription_expires_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>

                  <div className="text-right">
                    {profile.role === 'admin' && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        admin
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
            <span className="text-sm text-muted-foreground">
              {filtered.length === profiles.length
                ? `${profiles.length} users total`
                : `${filtered.length} of ${profiles.length} users`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
