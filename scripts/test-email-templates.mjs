// Exercises every app email template against the live Resend API.
// Sends to altancog@gmail.com (the only deliverable address in sandbox).
//
// Run: node --env-file=.env.local scripts/test-email-templates.mjs [which]
//   which = "payment" | "lesson" | "tarot" | "test" | "expiring" | "denied" | "all"
//   default: "all"

import { Resend } from 'resend';

const which = process.argv[2] ?? 'all';
const TO = 'altancog@gmail.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const FROM = process.env.EMAIL_FROM ?? 'Union <onboarding@resend.dev>';

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error('RESEND_API_KEY missing');
  process.exit(1);
}
const resend = new Resend(key);

// ── inlined Mongolian templates (mirrors lib/email/templates.ts) ───────────
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()} оны ${d.getMonth() + 1} сарын ${d.getDate()}`;
}
function layout(o) {
  const cta = o.ctaLabel && o.ctaHref
    ? `<p style="margin:24px 0;"><a href="${o.ctaHref}" style="background:#7c3aed;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:600;">${o.ctaLabel}</a></p>` : '';
  const footer = o.footerNote ? `<p style="color:#6b7280;font-size:12px;margin-top:32px;">${o.footerNote}</p>` : '';
  return `<!DOCTYPE html><html lang="mn"><head><meta charset="utf-8"/><title>${o.title}</title></head><body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:32px;max-width:560px;"><tr><td><h1 style="margin:0 0 16px;font-size:22px;color:#111827;">${o.title}</h1><p style="margin:0 0 16px;color:#374151;">${o.greeting}</p>${o.bodyHtml}${cta}${footer}<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/><p style="color:#9ca3af;font-size:12px;margin:0;">Union — зурхай ба сэтгэл судлалын платформ.</p></td></tr></table></td></tr></table></body></html>`;
}

function paymentApproved({ fullName, siteUrl, expiresAt }) {
  const greeting = fullName ? `Сайн уу ${fullName},` : 'Сайн уу,';
  const exp = fmtDate(expiresAt);
  return {
    subject: 'Таны төлбөр төлөлт амжилттай боллоо',
    html: layout({
      title: 'Төлбөр баталгаажлаа', greeting,
      bodyHtml: `<p style="margin:0 0 16px;color:#374151;">Таны төлбөр төлөлт амжилттай боллоо — таны эрх идэвхжсэн байна. Багцын хүчинтэй хугацаа: <strong>${exp}</strong> хүртэл.</p><p style="margin:0 0 16px;color:#374151;">Та одоо бүх төлбөртэй хичээл, сэтгэл зүйн тест болон зурхайн номын санг ашиглах боломжтой.</p>`,
      ctaLabel: 'Хяналтын самбар руу орох', ctaHref: `${siteUrl}/dashboard`,
    }),
    text: `${greeting}\n\nТаны төлбөр төлөлт амжилттай боллоо.\nХүчинтэй хугацаа: ${exp} хүртэл.\n\n${siteUrl}/dashboard\n\n— Union`,
  };
}

function paymentDenied({ fullName, siteUrl, adminNote }) {
  const greeting = fullName ? `Сайн уу ${fullName},` : 'Сайн уу,';
  const note = adminNote ? `<p style="margin:0 0 16px;color:#374151;"><strong>Админы тайлбар:</strong><br/><span style="white-space:pre-wrap;">${escapeHtml(adminNote)}</span></p>` : '';
  return {
    subject: 'Таны төлбөрийг дахин шалгах шаардлагатай байна',
    html: layout({
      title: 'Төлбөр батлагдаагүй', greeting,
      bodyHtml: `<p style="margin:0 0 16px;color:#374151;">Уучлаарай, таны сүүлийн төлбөр төлөлтийг батлах боломжгүй боллоо.</p>${note}`,
      ctaLabel: 'Төлбөрөө дахин илгээх', ctaHref: `${siteUrl}/status/denied`,
    }),
    text: `${greeting}\n\nТаны төлбөрийг батлах боломжгүй боллоо.\n${adminNote ? 'Шалтгаан:\n' + adminNote + '\n\n' : ''}${siteUrl}/status/denied\n\n— Union`,
  };
}

function expiring({ fullName, siteUrl, expiresAt, daysLeft }) {
  const greeting = fullName ? `Сайн уу ${fullName},` : 'Сайн уу,';
  const exp = fmtDate(expiresAt);
  const lead = daysLeft === 1 ? 'Таны эрхийн хугацаа маргааш дуусах гэж байна.' : `Таны эрхийн хугацаа дуусахад ${daysLeft} хоног үлдлээ.`;
  return {
    subject: 'Таны эрхийн хугацаа дуусаж байна',
    html: layout({
      title: 'Эрхийн хугацаа дуусах гэж байна', greeting,
      bodyHtml: `<p style="margin:0 0 16px;color:#374151;">${lead} Багцын хүчинтэй хугацаа: <strong>${exp}</strong> хүртэл.</p><p style="margin:0 0 16px;color:#374151;">Үргэлжлүүлэн ашиглахын тулд төлбөрөө сунгана уу.</p>`,
      ctaLabel: 'Эрхээ сунгах', ctaHref: `${siteUrl}/dashboard`,
    }),
    text: `${greeting}\n\n${lead}\nХүчинтэй хугацаа: ${exp} хүртэл.\n${siteUrl}/dashboard\n\n— Union`,
  };
}

function lessonPublished({ fullName, siteUrl, lessonTitle, lessonSlug, lessonDescription }) {
  const greeting = fullName ? `Сайн уу ${fullName},` : 'Сайн уу,';
  const desc = lessonDescription ? `<p style="margin:0 0 16px;color:#374151;">${escapeHtml(lessonDescription)}</p>` : '';
  return {
    subject: `Шинэ хичээл орлоо: ${lessonTitle}`,
    html: layout({
      title: 'Шинэ хичээл орлоо', greeting,
      bodyHtml: `<p style="margin:0 0 16px;color:#374151;">Таны хичээлийн санд шинэ хичээл нэмэгдлээ:</p><p style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:600;">${escapeHtml(lessonTitle)}</p>${desc}`,
      ctaLabel: 'Хичээлийг үзэх', ctaHref: `${siteUrl}/dashboard/lessons/${lessonSlug}`,
    }),
    text: `${greeting}\n\nШинэ хичээл орлоо: ${lessonTitle}\n${siteUrl}/dashboard/lessons/${lessonSlug}\n\n— Union`,
  };
}

function tarotReading({ fullName, siteUrl, lessonTitle, lessonSlug, lessonDescription }) {
  const greeting = fullName ? `Сайн уу ${fullName},` : 'Сайн уу,';
  const desc = lessonDescription ? `<p style="margin:0 0 16px;color:#374151;">${escapeHtml(lessonDescription)}</p>` : '';
  return {
    subject: `Тарот уншлага орлоо: ${lessonTitle}`,
    html: layout({
      title: 'Тарот уншлага орлоо', greeting,
      bodyHtml: `<p style="margin:0 0 16px;color:#374151;">7 хоног бүрийн collective тарот уншлага шинэчлэгдлээ:</p><p style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:600;">${escapeHtml(lessonTitle)}</p>${desc}`,
      ctaLabel: 'Уншлагыг үзэх', ctaHref: `${siteUrl}/dashboard/lessons/${lessonSlug}`,
    }),
    text: `${greeting}\n\nТарот уншлага орлоо: ${lessonTitle}\n${siteUrl}/dashboard/lessons/${lessonSlug}\n\n— Union`,
  };
}

function psychTest({ fullName, siteUrl, testTitle, testSlug, testDescription }) {
  const greeting = fullName ? `Сайн уу ${fullName},` : 'Сайн уу,';
  const desc = testDescription ? `<p style="margin:0 0 16px;color:#374151;">${escapeHtml(testDescription)}</p>` : '';
  return {
    subject: `Шинэ тэст орлоо: ${testTitle}`,
    html: layout({
      title: 'Шинэ тэст орлоо', greeting,
      bodyHtml: `<p style="margin:0 0 16px;color:#374151;">Сэтгэл зүйн шинэ тест нэмэгдлээ:</p><p style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:600;">${escapeHtml(testTitle)}</p>${desc}`,
      ctaLabel: 'Тестийг үзэх', ctaHref: `${siteUrl}/dashboard/tests/${testSlug}`,
    }),
    text: `${greeting}\n\nШинэ тэст орлоо: ${testTitle}\n${siteUrl}/dashboard/tests/${testSlug}\n\n— Union`,
  };
}

async function send(label, tpl) {
  console.log(`\n[${label}] sending to ${TO}...`);
  const r = await resend.emails.send({ from: FROM, to: TO, subject: tpl.subject, html: tpl.html, text: tpl.text });
  if (r.error) {
    console.error(`[${label}] FAILED:`, r.error);
  } else {
    console.log(`[${label}] OK  id=${r.data?.id}`);
  }
  await new Promise((r) => setTimeout(r, 350)); // pace under 5 req/s
}

const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
const expiresSoon = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString();

if (which === 'payment' || which === 'all') {
  await send('paymentApproved', paymentApproved({ fullName: 'Алтан', siteUrl: SITE_URL, expiresAt }));
}
if (which === 'denied' || which === 'all') {
  await send('paymentDenied', paymentDenied({ fullName: 'Алтан', siteUrl: SITE_URL, adminNote: 'Гүйлгээний дүн тохирохгүй байна. Шинэ скриншот илгээнэ үү.' }));
}
if (which === 'expiring' || which === 'all') {
  await send('expiring-3d', expiring({ fullName: 'Алтан', siteUrl: SITE_URL, expiresAt: expiresSoon, daysLeft: 3 }));
  await send('expiring-1d', expiring({ fullName: 'Алтан', siteUrl: SITE_URL, expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), daysLeft: 1 }));
}
if (which === 'lesson' || which === 'all') {
  await send('lessonPublished', lessonPublished({ fullName: 'Алтан', siteUrl: SITE_URL, lessonTitle: 'Сатурны зөгнөл — Лекц 1', lessonSlug: 'saturn-1', lessonDescription: 'Сатурны хэв шинж, амьдралд үзүүлэх нөлөө.' }));
}
if (which === 'tarot' || which === 'all') {
  await send('tarotReading', tarotReading({ fullName: 'Алтан', siteUrl: SITE_URL, lessonTitle: 'Энэ долоо хоногийн тарот', lessonSlug: 'tarot-week-20', lessonDescription: '12 ордны collective тайлбар.' }));
}
if (which === 'test' || which === 'all') {
  await send('psychTest', psychTest({ fullName: 'Алтан', siteUrl: SITE_URL, testTitle: 'MBTI хувийн шинжийн тест', testSlug: 'mbti', testDescription: '16 төрлийн хувийн шинжийг тодорхойлох тест.' }));
}
