export function readPage(value: string | undefined): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1;
}
