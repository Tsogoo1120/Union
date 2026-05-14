/**
 * Daily cron — sends 3-day and 1-day subscription-expiry reminders.
 *
 * Scheduling: configured in vercel.json (runs once per day).
 * Cadence: 3 days before expiry, then again 1 day before. Per-user
 * idempotency lives in profiles.expiry_reminder_stage, so this
 * endpoint is safe to hit manually or to retry.
 *
 * Security: protected by CRON_SECRET. Vercel Cron automatically sends
 *   Authorization: Bearer <CRON_SECRET>
 * when CRON_SECRET is set as an env var.
 */
import { NextResponse } from 'next/server';
import { sendExpiryReminders } from '@/lib/email/send';

// Force this route to run on the Node.js runtime (Resend SDK + admin
// Supabase client both require it).
export const runtime = 'nodejs';

// Don't try to statically render — this route is always dynamic.
export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('[cron] CRON_SECRET is not set — refusing to run');
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 500 },
    );
  }

  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const result = await sendExpiryReminders();
  console.info('[cron] subscription-expiring result:', result);
  return NextResponse.json({ ok: true, ...result });
}
