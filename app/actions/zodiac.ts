'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

function extractStoragePath(publicUrl: string | null, bucket: string): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = publicUrl.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(publicUrl.slice(i + marker.length));
}

async function verifyAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Not authorized.');

  return user.id;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createZodiac(formData: FormData): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const name = (formData.get('name') as string | null)?.trim() ?? '';
    if (!name) return { error: 'Name is required.' };

    const rawSlug = (formData.get('slug') as string | null)?.trim();
    const slug = rawSlug ? slugify(rawSlug) : slugify(name);
    if (!slug) return { error: 'Invalid slug.' };

    const date_range = (formData.get('date_range') as string | null)?.trim() || null;
    const image_url = (formData.get('image_url') as string | null)?.trim() || null;
    const content = (formData.get('content') as string | null)?.trim() || null;
    const is_published = formData.getAll('is_published').includes('true');

    const insertRow: Record<string, unknown> = {
      name,
      slug,
      date_range,
      image_url,
      content,
      description: content ?? '',
      is_published,
    };

    const { error } = await admin.from('zodiac_signs').insert(insertRow);

    if (error) return { error: error.message };

    revalidatePath('/admin/zodiac');
    revalidatePath('/dashboard/zodiac');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function updateZodiac(id: string, formData: FormData): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const name = (formData.get('name') as string | null)?.trim() ?? '';
    if (!name) return { error: 'Name is required.' };

    const rawSlug = (formData.get('slug') as string | null)?.trim();
    const slug = rawSlug ? slugify(rawSlug) : slugify(name);

    const date_range = (formData.get('date_range') as string | null)?.trim() || null;
    const image_url = (formData.get('image_url') as string | null)?.trim() || null;
    const content = (formData.get('content') as string | null)?.trim() || null;
    const is_published = formData.getAll('is_published').includes('true');

    const updates: Record<string, unknown> = {
      name,
      slug,
      date_range,
      image_url,
      content,
      description: content ?? '',
      is_published,
    };

    const { error } = await admin.from('zodiac_signs').update(updates).eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/zodiac');
    revalidatePath('/dashboard/zodiac');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function deleteZodiac(id: string): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const { data: row } = await admin
      .from('zodiac_signs')
      .select('image_url')
      .eq('id', id)
      .single();

    const imgPath = extractStoragePath(row?.image_url ?? null, 'zodiac-images');
    if (imgPath) {
      const { error: imgErr } = await admin.storage.from('zodiac-images').remove([imgPath]);
      if (imgErr) console.error('[deleteZodiac] zodiac-images remove:', imgErr.message);
    }

    const { error } = await admin.from('zodiac_signs').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/admin/zodiac');
    revalidatePath('/dashboard/zodiac');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function toggleZodiacPublished(
  id: string,
  isPublished: boolean
): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const { error } = await admin
      .from('zodiac_signs')
      .update({ is_published: isPublished })
      .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/zodiac');
    revalidatePath('/dashboard/zodiac');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}
