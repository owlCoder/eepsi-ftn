import "server-only";
import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/options";
import { db } from "@/infrastructure/db/prisma";
import { hasScopedPermission, type Permission } from "@/domain/authorization/permissions";
import { isSessionVersionCurrent } from "@/domain/security/session-policy";

export const currentUser = cache(async () => {
  if (!process.env.NEXTAUTH_SECRET || !process.env.DATABASE_URL) return null;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const claimedVersion = (session?.user as { sessionVersion?: number } | undefined)?.sessionVersion;
  if (!email || typeof claimedVersion !== "number") return null;
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true, active: true, sessionVersion: true },
  });
  return user?.active && isSessionVersionCurrent(claimedVersion, user.sessionVersion) ? user : null;
});

export async function can(permission: Permission, courseId?: string): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  let membershipRole: "PROFESSOR" | "ASSISTANT" | null = null;
  if (courseId) {
    const membership = await db.courseMembership.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { role: true },
    });
    membershipRole = membership?.role ?? null;
  }
  return hasScopedPermission(user.role, permission, membershipRole);
}

export async function requirePermission(permission: Permission, courseId?: string) {
  const actor = await currentUser();
  if (!actor || !(await can(permission, courseId))) {
    throw new Error("Nemate dozvolu za ovu akciju.");
  }
  return actor;
}
