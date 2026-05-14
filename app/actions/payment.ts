'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { PAYMENT_INFO } from '@/lib/constants';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function submitPayment(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const file = formData.get('screenshot') as File | null;
  if (!file || file.size === 0) return { error: 'Please select a screenshot.' };

  if (!ALLOWED_TYPES.includes(file.type))
    return { error: 'Only JPEG, PNG, or WebP images are allowed.' };

  if (file.size > MAX_SIZE_BYTES)
    return { error: 'File must be under 5 MB.' };

  // Read amount from form; fall back to default if missing or invalid.
  const rawAmount = Number(formData.get('amount'));
  const amount =
    Number.isFinite(rawAmount) && rawAmount > 0 ? rawAmount : PAYMENT_INFO.amount;

  // Path scoped to user folder — satisfies bucket RLS policy.
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const storagePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('payment-screenshots')
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const bankReference =
    ((formData.get('bank_reference') as string) ?? '').trim() || null;

  const { error: insertError } = await supabase.from('payments').insert({
    user_id: user.id,
    screenshot_path: storagePath,
    amount,
    status: 'pending',
    bank_reference: bankReference,
  });

  if (insertError) {
    // Roll back the uploaded file so storage stays clean.
    await supabase.storage
      .from('payment-screenshots')
      .remove([storagePath]);
    return { error: `Could not save payment: ${insertError.message}` };
  }

  // If the user was in 'denied' state, move them to 'pending' so the middleware
  // routes them to /status/pending (payment under review) instead of /status/denied.
  // Uses the service-role admin client because the DB trigger blocks users from
  // changing their own subscription_status via the anon client.
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_status === 'denied') {
    const admin = createAdminClient();
    const { error: statusErr } = await admin
      .from('profiles')
      .update({ subscription_status: 'pending' })
      .eq('id', user.id);
    // Non-fatal: the payment row already exists so the admin can still approve.
    // Log the inconsistency so it can be investigated if it occurs.
    if (statusErr) {
      console.error('[submitPayment] denied→pending transition failed:', statusErr.message);
    }
  }

  revalidatePath('/payment');
  return {};
}
