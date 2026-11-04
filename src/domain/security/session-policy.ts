/** A session is valid only when its login-time revision matches current DB state. */
export function isSessionVersionCurrent(
  claimed: number | undefined,
  current: number,
): boolean {
  return Number.isSafeInteger(claimed) && claimed !== undefined && claimed >= 0 &&
    Number.isSafeInteger(current) && current >= 0 && claimed === current;
}
