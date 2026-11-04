import "server-only";
import { createHmac } from "node:crypto";
import { db } from "@/infrastructure/db/prisma";
import { isLoginBlocked, LOGIN_WINDOW_MS } from "@/domain/security/login-policy";

function keyFor(email: string, secret: string) {
  return createHmac("sha256", secret).update(email.trim().toLowerCase(), "utf8").digest("hex");
}

/** Account-scoped protection; supplement with IP/edge rate limiting for production. */
export async function isLoginThrottled(email: string, secret: string) {
  const row = await db.loginThrottle.findUnique({
    where: { key: keyFor(email, secret) },
    select: { failures: true, resetAt: true },
  });
  return Boolean(row && isLoginBlocked(row.failures, row.resetAt));
}

export async function recordLoginFailure(email: string, secret: string) {
  const key = keyFor(email, secret);
  const now = new Date();
  const resetAt = new Date(now.getTime() + LOGIN_WINDOW_MS);
  await db.loginThrottle.updateMany({
    where: { key, resetAt: { lte: now } },
    data: { failures: 0, resetAt },
  });
  await db.loginThrottle.upsert({
    where: { key },
    create: { key, failures: 1, resetAt },
    update: { failures: { increment: 1 } },
  });
}

export async function clearLoginFailures(email: string, secret: string) {
  await db.loginThrottle.deleteMany({ where: { key: keyFor(email, secret) } });
}
