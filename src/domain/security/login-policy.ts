export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const MAX_LOGIN_FAILURES = 5;

export function isLoginBlocked(failures: number, resetAt: Date, now: Date = new Date()): boolean {
  return failures >= MAX_LOGIN_FAILURES && resetAt.getTime() > now.getTime();
}
