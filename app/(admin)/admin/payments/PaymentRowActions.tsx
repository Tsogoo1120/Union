'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { approvePayment, denyPayment } from '@/app/actions/admin';

interface Props {
  paymentId: string;
  screenshotUrl: string | null;
  isPending: boolean;
}

export function PaymentRowActions({ paymentId, screenshotUrl, isPending }: Props) {
  const router = useRouter();
  const [isTransitioning, startTransition] = useTransition();
  const [denyOpen, setDenyOpen] = useState(false);
  const [denyNote, setDenyNote] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function handleApprove() {
    setMsg(null);
    startTransition(async () => {
      const result = await approvePayment(paymentId);
      if (result.error) {
        setMsg({ ok: false, text: result.error });
      } else {
        setMsg({ ok: true, text: 'Approved.' });
        router.refresh();
      }
    });
  }

  function handleDeny() {
    setMsg(null);
    startTransition(async () => {
      const result = await denyPayment(paymentId, denyNote);
      if (result.error) {
        setMsg({ ok: false, text: result.error });
      } else {
        setDenyOpen(false);
        setDenyNote('');
        setMsg({ ok: true, text: 'Denied.' });
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Screenshot lightbox */}
      {screenshotUrl && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="View screenshot"
            >
              <span className="material-symbols-outlined text-[20px]">image</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75" />
            <Dialog.Content
              className="fixed inset-4 z-50 flex flex-col items-center justify-center gap-4 outline-none"
              aria-describedby={undefined}
            >
              <Dialog.Title className="sr-only">Payment screenshot</Dialog.Title>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotUrl}
                alt="Payment screenshot (full size)"
                className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl"
              />
              <Dialog.Close className="rounded-md bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                Close
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* Approve / Deny (pending tab only) */}
      {isPending && (
        <>
          <button
            onClick={handleApprove}
            disabled={isTransitioning}
            className="rounded-md p-1 text-primary transition-colors hover:bg-accent disabled:opacity-50"
            title="Approve"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </button>

          <Dialog.Root open={denyOpen} onOpenChange={setDenyOpen}>
            <Dialog.Trigger asChild>
              <button
                disabled={isTransitioning}
                className="rounded-md p-1 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                title="Deny"
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 shadow-xl">
                <Dialog.Title className="text-base font-semibold text-foreground">Deny Payment</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  The user will be notified their payment was denied. Provide an optional reason below.
                </Dialog.Description>
                <textarea
                  value={denyNote}
                  onChange={(e) => setDenyNote(e.target.value)}
                  placeholder="e.g. Wrong amount transferred"
                  rows={3}
                  className="mt-4 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleDeny}
                    disabled={isTransitioning}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
                  >
                    {isTransitioning ? 'Denying…' : 'Confirm Deny'}
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {msg && (
            <p className={`text-xs ${msg.ok ? 'text-primary' : 'text-destructive'}`}>
              {msg.text}
            </p>
          )}
        </>
      )}
    </div>
  );
}
