import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { AdminSidebar } from '@/components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) redirect('/login');

  if (profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0 bg-background overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
