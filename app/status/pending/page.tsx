import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/profile';
import { logout } from '@/app/actions/auth';

export default async function PendingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-10 text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="rounded-full border border-border bg-muted p-4">
            <span
              className="material-symbols-outlined text-[32px] text-primary"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              schedule
            </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Таны төлбөр хянагдаж байна
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Таны төлбөр зөвшөөрөгдмөгц 24 цагийн дотор мэдэгдэнэ.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <a
              href="/status/pending"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Дахин шалгах
            </a>

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
