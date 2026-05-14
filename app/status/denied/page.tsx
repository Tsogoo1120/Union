import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/profile';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';

export default async function DeniedPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  const supabase = await createClient();
  const { data: deniedPayment } = await supabase
    .from('payments')
    .select('admin_note, reviewed_at')
    .eq('user_id', profile.id)
    .eq('status', 'denied')
    .order('reviewed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-10 text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="rounded-full border border-destructive/20 bg-destructive/10 p-4">
            <span
              className="material-symbols-outlined text-[32px] text-destructive"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cancel
            </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Таны төлбөр татгалзагдлаа
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Доорх тэмдэглэлийг уншиж, хандах эрх авахын тулд шинэ төлбөр илгээнэ үү.
            </p>
          </div>

          {deniedPayment?.admin_note && (
            <div className="rounded-xl border border-border bg-card px-5 py-4 text-left shadow-sm">
              <p className="text-sm font-medium text-foreground">Админы тэмдэглэл</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {deniedPayment.admin_note}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/payment"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Шинэ төлбөр илгээх
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Гарах
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
