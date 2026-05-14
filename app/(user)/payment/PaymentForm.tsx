'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitPayment } from '@/app/actions/payment';
import { PAYMENT_INFO } from '@/lib/constants';

export function PaymentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!fileRef.current?.files?.[0]) {
      setError('Төлбөр төлсөн баримтны Screenshot оруулна уу.');
      return;
    }

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitPayment(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        router.refresh();
      }
    });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card px-5 py-4 text-center shadow-sm">
        <span
          className="material-symbols-outlined mx-auto block text-[32px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <p className="mt-2 text-sm font-medium text-foreground">Төлбөр амжилттай илгээгдлээ.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Таны дэлгэцийн зургийг хянаж, 12 цагийн дотор бүртгэлийг идэвхжүүлнэ.
        </p>
      </div>
    );
  }

  const amountDisplay =
    PAYMENT_INFO.amount.toLocaleString('mn-MN') + '₮';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Bank transfer details */}
      <div className="overflow-hidden rounded-xl border border-border bg-card text-sm">
        <div className="border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Банкны шилжүүлгийн мэдээлэл
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Банк</span>
            <span className="text-sm text-foreground">{PAYMENT_INFO.bankName}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              IBAN
            </span>
            <span className="font-mono text-xs tracking-wide text-foreground">
              {PAYMENT_INFO.iban}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Дансны дугаар
            </span>
            <span className="font-mono text-xs tracking-wide text-foreground">
              {PAYMENT_INFO.accountNumber}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Данс эзэмшигч
            </span>
            <span className="text-sm text-foreground">{PAYMENT_INFO.accountName}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Дүн</span>
            <span className="text-sm font-medium text-foreground">{amountDisplay}</span>
          </div>
        </div>
      </div>

      {/* Amount field */}
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium text-foreground">
          Дүн (₮)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="1"
          step="1"
          defaultValue={PAYMENT_INFO.amount}
          required
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Bank reference */}
      <div className="space-y-2">
        <label htmlFor="bank_reference" className="text-sm font-medium text-foreground">
          Гүйлгээний лавлах{' '}
          <span className="font-normal text-muted-foreground">(заавал биш)</span>
        </label>
        <input
          id="bank_reference"
          name="bank_reference"
          type="text"
          placeholder="жнь. TXN-123456"
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Screenshot upload — styled as drag-drop zone */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Төлбөрийн дэлгэцийн зураг <span className="text-destructive">*</span>
        </label>
        <label
          htmlFor="screenshot"
          className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
        >
          <span
            className="material-symbols-outlined mb-2 text-[32px] text-muted-foreground transition-colors group-hover:text-foreground"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            upload_file
          </span>
          {fileName ? (
            <span className="text-sm font-medium text-foreground">{fileName}</span>
          ) : (
            <>
              <span className="text-sm font-medium text-foreground">
                Дэлгэцийн зураг оруулахын тулд дарна уу
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG эсвэл WebP — хамгийн ихдээ 5 MB
              </span>
            </>
          )}
          <input
            ref={fileRef}
            id="screenshot"
            name="screenshot"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            required
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Илгээж байна…' : 'Төлбөр илгээх'}
      </button>
    </form>
  );
}
