'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendPsychologyTestPublishedEmail } from '@/lib/email/send';
import { revalidatePath } from 'next/cache';

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

export async function createTest(formData: FormData): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const title = (formData.get('title') as string | null)?.trim() ?? '';
    if (!title) return { error: 'Title is required.' };

    const rawSlug = (formData.get('slug') as string | null)?.trim();
    const slug = rawSlug ? slugify(rawSlug) : slugify(title);
    if (!slug) return { error: 'Invalid slug.' };

    const description = (formData.get('description') as string | null)?.trim() || null;
    const questionsRaw = (formData.get('questions') as string | null)?.trim() || '[]';
    const is_published = formData.getAll('is_published').includes('true');

    let questions;
    try {
      questions = JSON.parse(questionsRaw);
      if (!Array.isArray(questions)) return { error: 'Questions must be a JSON array.' };
    } catch {
      return { error: 'Invalid JSON in questions field.' };
    }

    const { data: inserted, error } = await admin
      .from('psychology_tests')
      .insert({
        title,
        slug,
        description,
        questions,
        is_published,
      })
      .select('id')
      .single();

    if (error) return { error: error.message };

    // Only email subscribers if the test is published immediately.
    if (is_published && inserted?.id) {
      await sendPsychologyTestPublishedEmail({ testId: inserted.id });
    }

    revalidatePath('/admin/tests');
    revalidatePath('/dashboard/tests');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function updateTest(id: string, formData: FormData): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const title = (formData.get('title') as string | null)?.trim() ?? '';
    if (!title) return { error: 'Title is required.' };

    const rawSlug = (formData.get('slug') as string | null)?.trim();
    const slug = rawSlug ? slugify(rawSlug) : slugify(title);

    const description = (formData.get('description') as string | null)?.trim() || null;
    const questionsRaw = (formData.get('questions') as string | null)?.trim() || '[]';
    const is_published = formData.getAll('is_published').includes('true');

    let questions;
    try {
      questions = JSON.parse(questionsRaw);
      if (!Array.isArray(questions)) return { error: 'Questions must be a JSON array.' };
    } catch {
      return { error: 'Invalid JSON in questions field.' };
    }

    if (is_published) {
      // Atomic transition: only matches rows currently un-published, so a
      // resave on an already-published test does not retrigger the email.
      const { data: updated, error } = await admin
        .from('psychology_tests')
        .update({ title, slug, description, questions, is_published })
        .eq('id', id)
        .eq('is_published', false)
        .select('id')
        .single();

      if (error && error.code !== 'PGRST116') return { error: error.message };

      if (updated) {
        await sendPsychologyTestPublishedEmail({ testId: id });
      } else {
        const { error: err2 } = await admin
          .from('psychology_tests')
          .update({ title, slug, description, questions, is_published })
          .eq('id', id);
        if (err2) return { error: err2.message };
      }
    } else {
      const { error } = await admin
        .from('psychology_tests')
        .update({ title, slug, description, questions, is_published })
        .eq('id', id);
      if (error) return { error: error.message };
    }

    revalidatePath('/admin/tests');
    revalidatePath('/dashboard/tests');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function deleteTest(id: string): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    const { error } = await admin.from('psychology_tests').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/admin/tests');
    revalidatePath('/dashboard/tests');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}

export async function toggleTestPublished(
  id: string,
  isPublished: boolean
): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    const admin = createAdminClient();

    if (isPublished) {
      // Atomic transition: only emails on false → true, not on re-toggle.
      const { data: updated, error } = await admin
        .from('psychology_tests')
        .update({ is_published: true })
        .eq('id', id)
        .eq('is_published', false)
        .select('id')
        .single();

      if (error && error.code !== 'PGRST116') return { error: error.message };

      if (updated) {
        await sendPsychologyTestPublishedEmail({ testId: id });
      }
    } else {
      const { error } = await admin
        .from('psychology_tests')
        .update({ is_published: false })
        .eq('id', id);
      if (error) return { error: error.message };
    }

    revalidatePath('/admin/tests');
    revalidatePath('/dashboard/tests');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unexpected error.' };
  }
}
