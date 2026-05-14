// One-off smoke test: send a real email via Resend to verify the
// API key + EMAIL_FROM combo work before exercising the full app.
//
// Run with:   node --env-file=.env.local scripts/test-email.mjs
//
// Delete this file once you've confirmed delivery — it is not part
// of the production flow.

import { Resend } from 'resend';

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error('RESEND_API_KEY missing — did you load .env.local?');
  process.exit(1);
}

const resend = new Resend(key);

const result = await resend.emails.send({
  from: process.env.EMAIL_FROM ?? 'Union <onboarding@resend.dev>',
  to: 'altancog@gmail.com',
  subject: 'Union email setup — test',
  html: '<p>If you can read this, Resend is wired up correctly.</p>',
  text: 'If you can read this, Resend is wired up correctly.',
});

console.log(JSON.stringify(result, null, 2));
