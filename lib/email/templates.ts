import 'server-only';

/**
 * Email templates for transactional and content notifications.
 *
 * Each template returns { subject, html, text }. Plain-text bodies
 * are required for spam-filter scoring and accessibility — never
 * skip them.
 *
 * Copy is in Mongolian to match the product UI.
 */

export type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

// ─── Shared layout ──────────────────────────────────────────────────────────

function layout(opts: {
  title: string;
  greeting: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
}): string {
  const cta =
    opts.ctaLabel && opts.ctaHref
      ? `<p style="margin:24px 0;">
           <a href="${opts.ctaHref}"
              style="background:#7c3aed;color:#fff;padding:12px 24px;
                     text-decoration:none;border-radius:6px;
                     display:inline-block;font-weight:600;">
             ${opts.ctaLabel}
           </a>
         </p>`
      : '';

  const footer = opts.footerNote
    ? `<p style="color:#6b7280;font-size:12px;margin-top:32px;">
         ${opts.footerNote}
       </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="utf-8" />
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:
             -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;padding:32px;
                      max-width:560px;">
          <tr><td>
            <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">
              ${opts.title}
            </h1>
            <p style="margin:0 0 16px;color:#374151;">${opts.greeting}</p>
            ${opts.bodyHtml}
            ${cta}
            ${footer}
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              Union — зурхай ба сэтгэл судлалын платформ.
            </p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function formatMongolianDate(iso: string): string {
  // 2026-06-12T... → "2026 оны 6 сарын 12"
  const d = new Date(iso);
  return `${d.getFullYear()} оны ${d.getMonth() + 1} сарын ${d.getDate()}`;
}

// ─── Payment approved ───────────────────────────────────────────────────────

export function paymentApprovedTemplate(opts: {
  fullName: string | null;
  siteUrl: string;
  expiresAt: string;
}): EmailTemplate {
  const greeting = opts.fullName ? `Сайн уу ${opts.fullName},` : 'Сайн уу,';
  const expiresHuman = formatMongolianDate(opts.expiresAt);

  return {
    subject: 'Таны төлбөр төлөлт амжилттай боллоо',
    html: layout({
      title: 'Төлбөр баталгаажлаа',
      greeting,
      bodyHtml: `
        <p style="margin:0 0 16px;color:#374151;">
          Таны төлбөр төлөлт амжилттай боллоо — таны эрх идэвхжсэн байна.
          Багцын хүчинтэй хугацаа: <strong>${expiresHuman}</strong> хүртэл.
        </p>
        <p style="margin:0 0 16px;color:#374151;">
          Та одоо бүх төлбөртэй хичээл, сэтгэл зүйн тест болон
          зурхайн номын санг ашиглах боломжтой.
        </p>
      `,
      ctaLabel: 'Хяналтын самбар руу орох',
      ctaHref: `${opts.siteUrl}/dashboard`,
    }),
    text:
      `${greeting}\n\n` +
      `Таны төлбөр төлөлт амжилттай боллоо. Таны эрх идэвхжсэн.\n` +
      `Хүчинтэй хугацаа: ${expiresHuman} хүртэл.\n\n` +
      `Хяналтын самбар: ${opts.siteUrl}/dashboard\n\n` +
      `— Union`,
  };
}

// ─── Payment denied ─────────────────────────────────────────────────────────

export function paymentDeniedTemplate(opts: {
  fullName: string | null;
  siteUrl: string;
  adminNote: string | null;
}): EmailTemplate {
  const greeting = opts.fullName ? `Сайн уу ${opts.fullName},` : 'Сайн уу,';
  const noteBlock = opts.adminNote
    ? `<p style="margin:0 0 16px;color:#374151;">
         <strong>Админы тайлбар:</strong><br />
         <span style="white-space:pre-wrap;">${escapeHtml(opts.adminNote)}</span>
       </p>`
    : '';

  return {
    subject: 'Таны төлбөрийг дахин шалгах шаардлагатай байна',
    html: layout({
      title: 'Төлбөр батлагдаагүй',
      greeting,
      bodyHtml: `
        <p style="margin:0 0 16px;color:#374151;">
          Уучлаарай, таны сүүлийн төлбөр төлөлтийг батлах боломжгүй боллоо.
          Та өөрийн дансны хуудаснаас шинэ баримтыг дахин илгээх боломжтой.
        </p>
        ${noteBlock}
      `,
      ctaLabel: 'Төлбөрөө дахин илгээх',
      ctaHref: `${opts.siteUrl}/status/denied`,
    }),
    text:
      `${greeting}\n\n` +
      `Таны сүүлийн төлбөр төлөлтийг батлах боломжгүй боллоо. ` +
      `Та шинэ баримтыг дансны хуудаснаас дахин илгээнэ үү.\n\n` +
      (opts.adminNote ? `Админы тайлбар:\n${opts.adminNote}\n\n` : '') +
      `Дахин илгээх: ${opts.siteUrl}/status/denied\n\n` +
      `— Union`,
  };
}

// ─── Subscription expiring (3-day & 1-day warnings) ─────────────────────────

export function subscriptionExpiringTemplate(opts: {
  fullName: string | null;
  siteUrl: string;
  expiresAt: string;
  daysLeft: 1 | 3;
}): EmailTemplate {
  const greeting = opts.fullName ? `Сайн уу ${opts.fullName},` : 'Сайн уу,';
  const expiresHuman = formatMongolianDate(opts.expiresAt);
  const lead =
    opts.daysLeft === 1
      ? 'Таны эрхийн хугацаа маргааш дуусах гэж байна.'
      : `Таны эрхийн хугацаа дуусахад ${opts.daysLeft} хоног үлдлээ.`;

  return {
    subject: 'Таны эрхийн хугацаа дуусаж байна',
    html: layout({
      title: 'Эрхийн хугацаа дуусах гэж байна',
      greeting,
      bodyHtml: `
        <p style="margin:0 0 16px;color:#374151;">
          ${lead} Багцын хүчинтэй хугацаа: <strong>${expiresHuman}</strong> хүртэл.
        </p>
        <p style="margin:0 0 16px;color:#374151;">
          Үргэлжлүүлэн ашиглахын тулд төлбөрөө сунгана уу. Эрх дуусмагц
          төлбөртэй хичээл, тест болон бусад агуулга түр хаагдана.
        </p>
      `,
      ctaLabel: 'Эрхээ сунгах',
      ctaHref: `${opts.siteUrl}/dashboard`,
      footerNote:
        'Энэхүү сануулга нь идэвхтэй багцтай хэрэглэгчдэд илгээгддэг. ' +
        'Профайл тохиргооноосоо имэйл сануулгыг хаах боломжтой.',
    }),
    text:
      `${greeting}\n\n` +
      `${lead}\nХүчинтэй хугацаа: ${expiresHuman} хүртэл.\n\n` +
      `Эрхээ сунгах: ${opts.siteUrl}/dashboard\n\n` +
      `— Union`,
  };
}

// ─── New lesson published ───────────────────────────────────────────────────

export function lessonPublishedTemplate(opts: {
  fullName: string | null;
  siteUrl: string;
  lessonTitle: string;
  lessonSlug: string;
  lessonDescription: string | null;
}): EmailTemplate {
  const greeting = opts.fullName ? `Сайн уу ${opts.fullName},` : 'Сайн уу,';
  const desc = opts.lessonDescription
    ? `<p style="margin:0 0 16px;color:#374151;">
         ${escapeHtml(opts.lessonDescription)}
       </p>`
    : '';

  return {
    subject: `Шинэ хичээл орлоо: ${opts.lessonTitle}`,
    html: layout({
      title: 'Шинэ хичээл орлоо',
      greeting,
      bodyHtml: `
        <p style="margin:0 0 16px;color:#374151;">
          Таны хичээлийн санд шинэ хичээл нэмэгдлээ:
        </p>
        <p style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:600;">
          ${escapeHtml(opts.lessonTitle)}
        </p>
        ${desc}
      `,
      ctaLabel: 'Хичээлийг үзэх',
      ctaHref: `${opts.siteUrl}/dashboard/lessons/${opts.lessonSlug}`,
      footerNote:
        'Та идэвхтэй багцтай тул энэ мэдэгдлийг хүлээн авч байна. ' +
        'Профайл тохиргооноосоо контент имэйлийг хаах боломжтой.',
    }),
    text:
      `${greeting}\n\n` +
      `Шинэ хичээл орлоо: ${opts.lessonTitle}\n\n` +
      (opts.lessonDescription ? `${opts.lessonDescription}\n\n` : '') +
      `Хичээлийг үзэх: ${opts.siteUrl}/dashboard/lessons/${opts.lessonSlug}\n\n` +
      `— Union\n` +
      `Профайлаас контент имэйлийг хаах боломжтой.`,
  };
}

// ─── New tarot reading (special-case of lesson with category=Tarot) ─────────

export function tarotReadingPublishedTemplate(opts: {
  fullName: string | null;
  siteUrl: string;
  lessonTitle: string;
  lessonSlug: string;
  lessonDescription: string | null;
}): EmailTemplate {
  const greeting = opts.fullName ? `Сайн уу ${opts.fullName},` : 'Сайн уу,';
  const desc = opts.lessonDescription
    ? `<p style="margin:0 0 16px;color:#374151;">
         ${escapeHtml(opts.lessonDescription)}
       </p>`
    : '';

  return {
    subject: `Тарот уншлага орлоо: ${opts.lessonTitle}`,
    html: layout({
      title: 'Тарот уншлага орлоо',
      greeting,
      bodyHtml: `
        <p style="margin:0 0 16px;color:#374151;">
          7 хоног бүрийн collective тарот уншлага шинэчлэгдлээ:
        </p>
        <p style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:600;">
          ${escapeHtml(opts.lessonTitle)}
        </p>
        ${desc}
      `,
      ctaLabel: 'Уншлагыг үзэх',
      ctaHref: `${opts.siteUrl}/dashboard/lessons/${opts.lessonSlug}`,
      footerNote:
        'Та идэвхтэй багцтай тул энэ мэдэгдлийг хүлээн авч байна. ' +
        'Профайл тохиргооноосоо контент имэйлийг хаах боломжтой.',
    }),
    text:
      `${greeting}\n\n` +
      `Шинэ тарот уншлага: ${opts.lessonTitle}\n\n` +
      (opts.lessonDescription ? `${opts.lessonDescription}\n\n` : '') +
      `Үзэх: ${opts.siteUrl}/dashboard/lessons/${opts.lessonSlug}\n\n` +
      `— Union`,
  };
}

// ─── New psychology test published ──────────────────────────────────────────

export function psychologyTestPublishedTemplate(opts: {
  fullName: string | null;
  siteUrl: string;
  testTitle: string;
  testSlug: string;
  testDescription: string | null;
}): EmailTemplate {
  const greeting = opts.fullName ? `Сайн уу ${opts.fullName},` : 'Сайн уу,';
  const desc = opts.testDescription
    ? `<p style="margin:0 0 16px;color:#374151;">
         ${escapeHtml(opts.testDescription)}
       </p>`
    : '';

  return {
    subject: `Шинэ тэст орлоо: ${opts.testTitle}`,
    html: layout({
      title: 'Шинэ тэст орлоо',
      greeting,
      bodyHtml: `
        <p style="margin:0 0 16px;color:#374151;">
          Сэтгэл зүйн шинэ тест нэмэгдлээ:
        </p>
        <p style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:600;">
          ${escapeHtml(opts.testTitle)}
        </p>
        ${desc}
      `,
      ctaLabel: 'Тестийг үзэх',
      ctaHref: `${opts.siteUrl}/dashboard/tests/${opts.testSlug}`,
      footerNote:
        'Та идэвхтэй багцтай тул энэ мэдэгдлийг хүлээн авч байна. ' +
        'Профайл тохиргооноосоо контент имэйлийг хаах боломжтой.',
    }),
    text:
      `${greeting}\n\n` +
      `Шинэ тэст орлоо: ${opts.testTitle}\n\n` +
      (opts.testDescription ? `${opts.testDescription}\n\n` : '') +
      `Тестийг үзэх: ${opts.siteUrl}/dashboard/tests/${opts.testSlug}\n\n` +
      `— Union`,
  };
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Treats both "Tarot" (English) and "Тарот" (Mongolian) as the tarot category. */
export function isTarotCategory(category: string | null | undefined): boolean {
  if (!category) return false;
  return /^\s*(tarot|тарот)\s*$/i.test(category);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
