'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendLessonPublishedEmail } from '@/lib/email/send';
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

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createLesson(formData: FormData): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const title = (formData.get('title') as string | null)?.trim() ?? '';
    if (!title) return { error: 'Title is required.' };

    const rawSlug = (formData.get('slug') as string | null)?.trim();
    const slug = rawSlug ? slugify(rawSlug) : slugify(title);
    if (!slug) return { error: 'Invalid slug.' };

    const category = (formData.get('category') as string | null)?.trim() ?? 'General';
    const description = (formData.get('description') as string | null)?.trim() || null;
    const video_url = (formData.get('video_url') as string | null)?.trim() || null;
    const thumbnail_url = (formData.get('thumbnail_url') as string | null)?.trim() || null;
    const durationRaw = formData.get('duration_minutes');
    const duration_minutes = durationRaw ? parseInt(durationRaw as string, 10) || null : null;
    const is_published = formData.getAll('is_published').includes('true');

    const { data: inserted, error } = await admin
      .from('lessons')
      .insert({
        title,
        slug,
        body: '',
        category,
        description,
        video_url,
        thumbnail_url,
        duration_minutes,
        is_published,
      })
      .select('id')
      .single();

    if (error) return { error: error.message };

    // Only email subscribers if the lesson is published right away.
    if (is_published && inserted?.id) {
      await sendLessonPublishedEmail({ lessonId: inserted.id });
    }

    revalidatePath('/admin/lessons');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function updateLesson(
  lessonId: string,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const title = (formData.get('title') as string | null)?.trim() ?? '';
    if (!title) return { error: 'Title is required.' };

    const rawSlug = (formData.get('slug') as string | null)?.trim();
    const slug = rawSlug ? slugify(rawSlug) : slugify(title);
    if (!slug) return { error: 'Invalid slug.' };

    const category = (formData.get('category') as string | null)?.trim() ?? 'General';
    const description = (formData.get('description') as string | null)?.trim() || null;
    const video_url = (formData.get('video_url') as string | null)?.trim() || null;
    const thumbnail_url = (formData.get('thumbnail_url') as string | null)?.trim() || null;
    const durationRaw = formData.get('duration_minutes');
    const duration_minutes = durationRaw ? parseInt(durationRaw as string, 10) || null : null;
    const is_published = formData.getAll('is_published').includes('true');

    const payload = {
      title,
      slug,
      category,
      description,
      video_url,
      thumbnail_url,
      duration_minutes,
      is_published,
    };

    if (is_published) {
      const { data: updated, error } = await admin
        .from('lessons')
        .update(payload)
        .eq('id', lessonId)
        .eq('is_published', false)
        .select('id')
        .single();

      if (error && error.code !== 'PGRST116') return { error: error.message };

      if (updated) {
        await sendLessonPublishedEmail({ lessonId });
      } else {
        const { error: err2 } = await admin.from('lessons').update(payload).eq('id', lessonId);
        if (err2) return { error: err2.message };
      }
    } else {
      const { error } = await admin.from('lessons').update(payload).eq('id', lessonId);
      if (error) return { error: error.message };
    }

    revalidatePath('/admin/lessons');
    revalidatePath('/dashboard/lessons');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function toggleLessonPublished(
  lessonId: string,
  isPublished: boolean
): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    if (isPublished) {
      const { data: updated, error } = await admin
        .from('lessons')
        .update({ is_published: true })
        .eq('id', lessonId)
        .eq('is_published', false)
        .select('id')
        .single();

      if (error && error.code !== 'PGRST116') return { error: error.message };

      if (updated) {
        await sendLessonPublishedEmail({ lessonId });
      }
    } else {
      const { error } = await admin
        .from('lessons')
        .update({ is_published: false })
        .eq('id', lessonId);

      if (error) return { error: error.message };
    }

    revalidatePath('/admin/lessons');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function deleteLesson(lessonId: string): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const { data: row } = await admin
      .from('lessons')
      .select('thumbnail_url, video_url')
      .eq('id', lessonId)
      .single();

    const thumbPath = extractStoragePath(row?.thumbnail_url ?? null, 'lesson-thumbnails');
    if (thumbPath) {
      const { error: rmErr } = await admin.storage.from('lesson-thumbnails').remove([thumbPath]);
      if (rmErr) console.error('[deleteLesson] lesson-thumbnails remove:', rmErr.message);
    }
    const vidPath = extractStoragePath(row?.video_url ?? null, 'lesson-videos');
    if (vidPath) {
      const { error: rmErr } = await admin.storage.from('lesson-videos').remove([vidPath]);
      if (rmErr) console.error('[deleteLesson] lesson-videos remove:', rmErr.message);
    }

    const { error } = await admin.from('lessons').delete().eq('id', lessonId);

    if (error) return { error: error.message };

    revalidatePath('/admin/lessons');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}
