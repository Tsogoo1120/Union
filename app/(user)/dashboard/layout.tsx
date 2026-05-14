import { UserNav } from '@/components/UserNav';
import { UserBottomNav } from '@/components/UserBottomNav';
import { UserFooter } from '@/components/UserFooter';
import { PageTransition } from '@/components/PageTransition';
import { UserMobileTopNav } from '@/components/UserMobileTopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="flex min-h-screen flex-col">
        <UserMobileTopNav />
        <UserNav />
        <div className="flex-grow">
          <PageTransition>{children}</PageTransition>
        </div>
        <UserFooter />
        <UserBottomNav />
      </div>
    </div>
  );
}
