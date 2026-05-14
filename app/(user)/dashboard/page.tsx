import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { canAccessSubscriberContent } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { DashboardHome } from '@/components/dashboard/DashboardHome';

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (profile.role === 'admin') redirect('/admin/dashboard');
  if (!canAccessSubscriberContent(profile)) redirect('/payment');

  const supabase = await createClient();

  // Fetch recent lessons for carousel
  const { data: recentLessons } = await supabase
    .from('lessons')
    .select('id, title, description, thumbnail_url, duration_minutes')
    .order('created_at', { ascending: false })
    .limit(8);

  const firstName = profile.full_name?.split(' ')[0] ?? profile.email;

  return <DashboardHome firstName={firstName} recentLessons={recentLessons ?? []} />;
}
