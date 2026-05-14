/**
 * Public email API. All functions here are best-effort:
 * they log on failure but never throw — an email outage must
 * not break a payment approval, lesson publish, or cron run.
 *
 * Callers should NOT wrap these in try/catch; that's already done.
 */
import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { EMAIL_FROM, SITE_URL, getResendClient } from './client';
import {
  isTarotCategory,
  lessonPublishedTemplate,
  paymentApprovedTemplate,
  paymentDeniedTemplate,
  psychologyTestPublishedTemplate,
  subscriptionExpiringTemplate,
  tarotReadingPublishedTemplate,
  type EmailTemplate,
} from './templates';

// ─── Low-level sender ───────────────────────────────────────────────────────

async function sendOne(opts: {
  to: string;
  template: EmailTemplate;
}): Promise<void> {
  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: opts.to,
      subject: opts.template.subject,
      html: opts.template.html,
      text: opts.template.text,
    });
    if (error) {
      console.error('[email] Resend returned error:', error);
    }
  } catch (err) {
    // Includes the "missing RESEND_API_KEY" case — surface it in logs
    // so the developer notices, but don't fail the calling action.
    console.error('[email] sendOne failed:', err);
  }
}

// ─── Fan-out helper (used by content notifications) ─────────────────────────

type Recipient = { email: string; full_name: string | null };

async function fanOut(
  recipients: Recipient[],
  buildTemplate: (r: Recipient) => EmailTemplate,
): Promise<void> {
  const BATCH = 8; // stay under Resend's 10 rps cap
  for (let i = 0; i < recipients.length; i += BATCH) {
    const slice = recipients.slice(i, i + BATCH);
    await Promise.allSettled(
      slice.map((r) => sendOne({ to: r.email, template: buildTemplate(r) })),
    );
    if (i + BATCH < recipients.length) {
      await new Promise((r) => setTimeout(r, 1100));
    }
  }
}

async function fetchActiveSubscribers(): Promise<Recipient[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('profiles')
    .select('email, full_name')
    .eq('subscription_status', 'active')
    .eq('email_notifications', true);
  return (data ?? []).filter((r): r is Recipient => !!r?.email);
}

// ─── Payment approved ───────────────────────────────────────────────────────

export async function sendPaymentApprovedEmail(opts: {
  userId: string;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('email, full_name, subscription_expires_at')
      .eq('id', opts.userId)
      .single();

    if (!profile?.email || !profile.subscription_expires_at) {
      console.warn(
        '[email] sendPaymentApprovedEmail: missing profile fields for',
        opts.userId,
      );
      return;
    }

    // Transactional — bypass the email_notifications opt-out, since the
    // user explicitly submitted a payment and is expecting a decision.
    await sendOne({
      to: profile.email,
      template: paymentApprovedTemplate({
        fullName: profile.full_name,
        siteUrl: SITE_URL,
        expiresAt: profile.subscription_expires_at,
      }),
    });
  } catch (err) {
    console.error('[email] sendPaymentApprovedEmail failed:', err);
  }
}

// ─── Payment denied ─────────────────────────────────────────────────────────

export async function sendPaymentDeniedEmail(opts: {
  userId: string;
  adminNote: string | null;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('email, full_name')
      .eq('id', opts.userId)
      .single();

    if (!profile?.email) {
      console.warn(
        '[email] sendPaymentDeniedEmail: missing email for',
        opts.userId,
      );
      return;
    }

    await sendOne({
      to: profile.email,
      template: paymentDeniedTemplate({
        fullName: profile.full_name,
        siteUrl: SITE_URL,
        adminNote: opts.adminNote,
      }),
    });
  } catch (err) {
    console.error('[email] sendPaymentDeniedEmail failed:', err);
  }
}

// ─── New lesson / tarot reading published ───────────────────────────────────

/**
 * Fans out a "new lesson" or "new tarot reading" email to active
 * subscribers, depending on the lesson's category. The dispatcher lives
 * here so callers (createLesson / updateLesson / toggleLessonPublished)
 * never have to think about which template to use.
 *
 * Respects email_notifications opt-out.
 */
export async function sendLessonPublishedEmail(opts: {
  lessonId: string;
}): Promise<void> {
  try {
    const admin = createAdminClient();

    const { data: lesson } = await admin
      .from('lessons')
      .select('id, title, slug, description, category, is_published')
      .eq('id', opts.lessonId)
      .single();

    if (!lesson || !lesson.is_published) {
      console.warn(
        '[email] sendLessonPublishedEmail: lesson missing or not published',
        opts.lessonId,
      );
      return;
    }

    const recipients = await fetchActiveSubscribers();
    if (recipients.length === 0) return;

    const tarot = isTarotCategory(
      (lesson as { category?: string | null }).category ?? null,
    );

    await fanOut(recipients, (r) => {
      const common = {
        fullName: r.full_name,
        siteUrl: SITE_URL,
        lessonTitle: lesson.title,
        lessonSlug: lesson.slug,
        lessonDescription:
          (lesson as { description?: string | null }).description ?? null,
      };
      return tarot
        ? tarotReadingPublishedTemplate(common)
        : lessonPublishedTemplate(common);
    });
  } catch (err) {
    console.error('[email] sendLessonPublishedEmail failed:', err);
  }
}

// ─── New psychology test published ──────────────────────────────────────────

export async function sendPsychologyTestPublishedEmail(opts: {
  testId: string;
}): Promise<void> {
  try {
    const admin = createAdminClient();

    const { data: test } = await admin
      .from('psychology_tests')
      .select('id, title, slug, description, is_published')
      .eq('id', opts.testId)
      .single();

    if (!test || !test.is_published) {
      console.warn(
        '[email] sendPsychologyTestPublishedEmail: test missing or not published',
        opts.testId,
      );
      return;
    }

    const recipients = await fetchActiveSubscribers();
    if (recipients.length === 0) return;

    await fanOut(recipients, (r) =>
      psychologyTestPublishedTemplate({
        fullName: r.full_name,
        siteUrl: SITE_URL,
        testTitle: test.title,
        testSlug: test.slug,
        testDescription:
          (test as { description?: string | null }).description ?? null,
      }),
    );
  } catch (err) {
    console.error('[email] sendPsychologyTestPublishedEmail failed:', err);
  }
}

// ─── Subscription expiring — used by the daily cron ─────────────────────────

/**
 * Fires both the 3-day and 1-day expiry reminders.
 *
 * Idempotency: profiles.expiry_reminder_stage tracks which reminder
 * each user has already received this cycle (reset to 0 when
 * approvePayment renews them). The cron can safely run multiple times
 * per day; a user will receive each reminder at most once per cycle.
 *
 * Returns counts so the cron route can report what it did.
 */
export async function sendExpiryReminders(): Promise<{
  sent3Day: number;
  sent1Day: number;
  errors: number;
}> {
  let sent3Day = 0;
  let sent1Day = 0;
  let errors = 0;

  try {
    const admin = createAdminClient();
    const now = new Date();
    const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // ─── 3-day reminders ────────────────────────────────────────────────
    // expiry in (now+1d, now+3d], stage = 0
    const { data: threeDay } = await admin
      .from('profiles')
      .select('id, email, full_name, subscription_expires_at')
      .eq('subscription_status', 'active')
      .eq('email_notifications', true)
      .eq('expiry_reminder_stage', 0)
      .gt('subscription_expires_at', in1Day.toISOString())
      .lte('subscription_expires_at', in3Days.toISOString());

    for (const u of threeDay ?? []) {
      if (!u.email || !u.subscription_expires_at) continue;
      try {
        await sendOne({
          to: u.email,
          template: subscriptionExpiringTemplate({
            fullName: u.full_name,
            siteUrl: SITE_URL,
            expiresAt: u.subscription_expires_at,
            daysLeft: 3,
          }),
        });
        await admin
          .from('profiles')
          .update({ expiry_reminder_stage: 1 })
          .eq('id', u.id);
        sent3Day += 1;
      } catch (err) {
        errors += 1;
        console.error('[email] 3-day reminder failed for', u.id, err);
      }
    }

    // ─── 1-day reminders ────────────────────────────────────────────────
    // expiry in (now, now+1d], stage <= 1 (catches users who skipped the 3-day
    // window entirely, e.g. subscribed for only 1 day)
    const { data: oneDay } = await admin
      .from('profiles')
      .select('id, email, full_name, subscription_expires_at')
      .eq('subscription_status', 'active')
      .eq('email_notifications', true)
      .lte('expiry_reminder_stage', 1)
      .gt('subscription_expires_at', now.toISOString())
      .lte('subscription_expires_at', in1Day.toISOString());

    for (const u of oneDay ?? []) {
      if (!u.email || !u.subscription_expires_at) continue;
      try {
        await sendOne({
          to: u.email,
          template: subscriptionExpiringTemplate({
            fullName: u.full_name,
            siteUrl: SITE_URL,
            expiresAt: u.subscription_expires_at,
            daysLeft: 1,
          }),
        });
        await admin
          .from('profiles')
          .update({ expiry_reminder_stage: 2 })
          .eq('id', u.id);
        sent1Day += 1;
      } catch (err) {
        errors += 1;
        console.error('[email] 1-day reminder failed for', u.id, err);
      }
    }
  } catch (err) {
    errors += 1;
    console.error('[email] sendExpiryReminders failed:', err);
  }

  return { sent3Day, sent1Day, errors };
}
