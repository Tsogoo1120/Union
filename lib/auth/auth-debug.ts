/** Dev-only structured logs — never pass emails, tokens, or codes. */

export function authDebug(event: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== 'development') return;
  console.debug(`[auth] ${event}`, payload);
}
