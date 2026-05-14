import { redirect, notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { TestRunner } from './TestRunner';

export default async function TestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();
  const [{ data: test }, { data: latestResult }] = await Promise.all([
    supabase
      .from('psychology_tests')
      .select('id, title, description, questions')
      .eq('id', params.id)
      .single(),
    supabase
      .from('test_results')
      .select('id')
      .eq('test_id', params.id)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!test) notFound();

  const questions: { text: string; options: string[] }[] = Array.isArray(test.questions)
    ? test.questions
    : [];

  return (
    <TestRunner
      testId={test.id}
      testTitle={test.title}
      questions={questions}
      userId={profile.id}
      latestResultId={latestResult?.id ?? null}
    />
  );
}
