'use client';

import { useMemo, useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { createZodiac, updateZodiac } from '@/app/actions/zodiac';
import { createClient } from '@/lib/supabase/client';

type ZodiacSign = {
  id: string;
  name: string;
  slug: string;
  date_range: string | null;
  image_url: string | null;
  content: string | null;
  is_published: boolean;
};

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB (matches bucket limit)

function safeFilename(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

function getExt(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext || ext.length > 8) return 'jpg';
  return ext;
}

export function ZodiacDialog({
  mode = 'create',
  sign,
  variant = 'primary',
}: {
  mode?: 'create' | 'edit';
  sign?: ZodiacSign;
  variant?: 'primary' | 'icon';
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const effectiveImageUrl = useMemo(() => {
    return uploadedUrl ?? sign?.image_url ?? null;
  }, [uploadedUrl, sign?.image_url]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setUploadError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result =
        mode === 'edit' && sign
          ? await updateZodiac(sign.id, formData)
          : await createZodiac(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        formRef.current?.reset();
        setUploadedUrl(null);
        router.refresh();
      }
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setUploadError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Only JPEG, PNG, WebP, or SVG images are allowed.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError('File must be under 10 MB.');
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = getExt(file.name);
      const base = safeFilename(sign?.slug || sign?.name || file.name);
      const storagePath = `zodiac/${base}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('zodiac-images')
        .upload(storagePath, file, { contentType: file.type, upsert: true });

      if (uploadErr) {
        setUploadError(`Upload failed: ${uploadErr.message}`);
        return;
      }

      const { data } = supabase.storage.from('zodiac-images').getPublicUrl(storagePath);
      const publicUrl = data?.publicUrl ?? null;
      if (!publicUrl) {
        setUploadError('Upload succeeded but could not generate a public URL.');
        return;
      }

      setUploadedUrl(publicUrl);

      // Sync into the form field so existing server action continues to work unchanged.
      const imageInput = formRef.current?.querySelector<HTMLInputElement>('input[name="image_url"]');
      if (imageInput) imageInput.value = publicUrl;
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Unexpected upload error.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {variant === 'icon' ? (
          <button
            type="button"
            title={mode === 'edit' ? 'Edit sign' : 'New sign'}
            className="p-1 rounded border border-border bg-background text-muted-foreground hover:bg-accent transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mode === 'edit' ? 'edit' : 'add'}
            </span>
          </button>
        ) : (
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <span className="material-symbols-outlined text-[18px]">
              {mode === 'edit' ? 'edit' : 'add'}
            </span>
            {mode === 'edit' ? 'Edit' : 'New Sign'}
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-card shadow-xl max-h-[90vh]">
          <div className="p-5">
            <Dialog.Title className="text-base font-semibold text-foreground">
              {mode === 'edit' ? 'Edit Zodiac Sign' : 'New Zodiac Sign'}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {mode === 'edit'
                ? 'Edit the zodiac sign details, upload an image, and update the collective reading.'
                : 'Create a new zodiac sign with name, date range, image, and collective reading.'}
            </Dialog.Description>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Aries"
                  defaultValue={sign?.name ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Slug <span className="text-xs font-normal text-muted-foreground">(auto-generated if blank)</span>
                </label>
                <input
                  name="slug"
                  placeholder="e.g. aries"
                  defaultValue={sign?.slug ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Date Range</label>
                <input
                  name="date_range"
                  placeholder="e.g. Mar 21 – Apr 19"
                  defaultValue={sign?.date_range ?? ''}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <input type="hidden" name="image_url" defaultValue={sign?.image_url ?? ''} />
                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex w-full flex-col gap-2 text-sm text-muted-foreground">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Upload image
                    </span>
                    <input
                      type="file"
                      accept={ALLOWED_TYPES.join(',')}
                      onChange={handleFileChange}
                      disabled={isUploading || isPending}
                      className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent disabled:opacity-60"
                    />
                  </label>
                </div>
                {effectiveImageUrl && (
                  <div className="mt-3 overflow-hidden rounded-md border border-border bg-muted/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={effectiveImageUrl}
                      alt="Zodiac image preview"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
                {isUploading && (
                  <p className="mt-2 text-xs text-muted-foreground">Uploading image…</p>
                )}
                {uploadError && (
                  <p className="mt-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {uploadError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Collective Reading</label>
                <textarea
                  name="content"
                  rows={5}
                  placeholder="Write the collective reading content for this sign…"
                  defaultValue={sign?.content ?? ''}
                  className="mt-2 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <input type="hidden" name="is_published" value="false" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    value="true"
                    defaultChecked={sign?.is_published ?? true}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">Publish immediately</span>
                </label>
              </div>

              {error && (
                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={isPending || isUploading}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? (mode === 'edit' ? 'Saving…' : 'Creating…') : mode === 'edit' ? 'Save Changes' : 'Create Sign'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
