import { afterAll, describe, expect, it } from "vitest";
import { createHash, randomUUID } from "node:crypto";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../src/generated/prisma/client";
import { isLoginBlocked, MAX_LOGIN_FAILURES } from "../../src/domain/security/login-policy";
import { isSessionVersionCurrent } from "../../src/domain/security/session-policy";

const db = new PrismaClient({ adapter: new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || "3306"),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 2,
}) });

afterAll(async () => { await db.$disconnect(); });

describe("versioned MySQL schema integration", () => {
  it("persists user, assigned course, material and immutable-style audit entry", async () => {
    const marker = randomUUID().replaceAll("-", "").slice(0, 16);
    const email = "ci-" + marker + "@example.invalid";
    const code = "T-" + marker.toUpperCase();
    const key = createHash("sha256").update("ci-login-" + marker).digest("hex");
    const user = await db.user.create({
      data: { name: "Test Automation", email, passwordHash: "synthetic-non-login-value", role: "ASSISTANT" },
    });
    let courseId: string | null = null;
    try {
      const course = await db.course.create({
        data: { title: "Integration Test Course", code, slug: "integration-" + marker, description: "Temporary CI-only test course", semester: 2, studyLevel: "OAS" },
      });
      courseId = course.id;
      await db.courseMembership.create({ data: { userId: user.id, courseId: course.id, role: "ASSISTANT" } });
      const material = await db.material.create({
        data: { courseId: course.id, title: "CI Material", url: "https://example.invalid/test" },
      });
      await db.auditLog.create({
        data: { actorId: user.id, action: "material.create", subjectType: "Material", subjectId: material.id },
      });
      const assigned = await db.courseMembership.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      });
      expect(assigned?.role).toBe("ASSISTANT");
      expect(isSessionVersionCurrent(0, user.sessionVersion)).toBe(true);
      const revised = await db.user.update({
        where: { id: user.id },
        data: { sessionVersion: { increment: 1 } },
        select: { sessionVersion: true },
      });
      expect(isSessionVersionCurrent(0, revised.sessionVersion)).toBe(false);
      expect(await db.auditLog.count({ where: { subjectId: material.id } })).toBe(1);
      await db.loginThrottle.upsert({
        where: { key },
        create: { key, failures: MAX_LOGIN_FAILURES, resetAt: new Date(Date.now() + 60_000) },
        update: { failures: MAX_LOGIN_FAILURES, resetAt: new Date(Date.now() + 60_000) },
      });
      const throttle = await db.loginThrottle.findUniqueOrThrow({ where: { key } });
      expect(isLoginBlocked(throttle.failures, throttle.resetAt)).toBe(true);
    } finally {
      await db.loginThrottle.deleteMany({ where: { key } });
      if (courseId) {
        const materials = await db.material.findMany({ where: { courseId }, select: { id: true } });
        await db.auditLog.deleteMany({ where: { subjectType: "Material", subjectId: { in: materials.map((m) => m.id) } } });
        await db.course.delete({ where: { id: courseId } }); // membership and materials cascade
      }
      await db.user.delete({ where: { id: user.id } });
    }
  });
});
