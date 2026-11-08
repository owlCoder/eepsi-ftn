"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { accessInput, membershipInput, userInput, passwordResetInput, userIdentityInput } from "@/application/validation";
import { requirePermission } from "@/application/authorization";
import { db } from "@/infrastructure/db/prisma";

export async function createUserAction(data: FormData) {
  const actor = await requirePermission("users.manage");
  const input = userInput.parse({
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    password: String(data.get("password") ?? ""),
    role: String(data.get("role") ?? ""),
  });
  const duplicate = await db.user.findUnique({ where: { email: input.email }, select: { id: true } });
  if (duplicate) redirect("/admin/korisnici?error=duplicate");
  const passwordHash = await hash(input.password, 12);
  try {
    await db.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { name: input.name, email: input.email, passwordHash, role: input.role },
      });
      await tx.auditLog.create({ data: { actorId: actor.id, action: "user.create", subjectType: "User", subjectId: created.id } });
    });
  } catch (error) {
    // The email can be claimed after the preflight lookup by another request.
    const prismaError = error as { code?: unknown; meta?: { target?: unknown } } | null;
    const target = prismaError?.meta?.target;
    if (prismaError?.code === "P2002" && Array.isArray(target) && target.includes("email")) {
      redirect("/admin/korisnici?error=duplicate");
    }
    throw error;
  }
  revalidatePath("/admin/korisnici");
  redirect("/admin/korisnici?created=1");
}

export async function assignCourseMemberAction(data: FormData) {
  const actor = await requirePermission("users.manage");
  const returnToCourse = data.get("returnToCourse") === "1";
  // The global users screen identifies courses by their unique code rather than
  // silently limiting the course selector to the first 200 records.
  const rawCourseId = String(data.get("courseId") ?? "");
  const rawCode = String(data.get("courseCode") ?? "").trim().toUpperCase();
  let courseId = rawCourseId;
  if (!courseId && /^[A-Z0-9-]{2,30}$/.test(rawCode)) {
    const course = await db.course.findUnique({ where: { code: rawCode }, select: { id: true } });
    if (!course) redirect(returnToCourse ? "/admin/predmeti?error=course" : "/admin/korisnici?error=course");
    courseId = course.id;
  }
  if (!courseId) redirect(returnToCourse ? "/admin/predmeti?error=course" : "/admin/korisnici?error=course");
  const input = membershipInput.parse({
    courseId,
    email: String(data.get("email") ?? ""),
    role: String(data.get("role") ?? ""),
  });
  // A course ID submitted directly (rather than looked up by code) may be
  // stale or fabricated. Report a form error instead of a foreign-key failure.
  const courseExists = await db.course.findUnique({
    where: { id: input.courseId },
    select: { id: true },
  });
  if (!courseExists) {
    redirect(returnToCourse
      ? "/admin/predmeti?error=course"
      : "/admin/korisnici?error=course");
  }
  const user = await db.user.findUnique({
    where: { email: input.email },
    select: { id: true, role: true, active: true },
  });
  if (!user || !user.active || user.role !== input.role) {
    const destination = returnToCourse
      ? "/admin/predmeti/" + input.courseId + "?error=member"
      : "/admin/korisnici?error=member";
    redirect(destination);
  }
  let assigned: "conflict" | "unchanged" | "assigned";
  try {
    assigned = await db.$transaction(async (tx) => {
    const current = await tx.user.findUnique({ where: { id: user.id }, select: { role: true, active: true } });
    if (!current?.active || current.role !== input.role) return "conflict" as const;
    const existing = await tx.courseMembership.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: input.courseId } },
      select: { role: true },
    });
    if (existing?.role === input.role) return "unchanged" as const;
    // Claim the user's current role/status atomically before granting access.
    // A concurrent deactivation or role change must not leave a new membership.
    const claimed = await tx.user.updateMany({
      where: { id: user.id, role: input.role, active: true },
      data: { sessionVersion: { increment: 1 } },
    });
    if (claimed.count !== 1) return "conflict" as const;
    await tx.courseMembership.upsert({
      where: { userId_courseId: { userId: user.id, courseId: input.courseId } },
      create: { userId: user.id, courseId: input.courseId, role: input.role },
      update: { role: input.role },
    });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "membership.assign", subjectType: "Course", subjectId: input.courseId } });
    return "assigned" as const;
    });
  } catch (error) {
    // The course can be deleted after the preflight check. Only translate a
    // foreign-key failure when the course is actually gone.
    const prismaError = error as { code?: unknown } | null;
    if (prismaError?.code === "P2003") {
      const course = await db.course.findUnique({ where: { id: input.courseId }, select: { id: true } });
      if (!course) {
        redirect(returnToCourse
          ? "/admin/predmeti?error=course"
          : "/admin/korisnici?error=course");
      }
    }
    throw error;
  }
  // The course may be removed after the membership transaction (including
  // unchanged/conflict outcomes). Avoid redirecting to a missing detail page.
  if (returnToCourse) {
    const course = await db.course.findUnique({ where: { id: input.courseId }, select: { id: true } });
    if (!course) redirect("/admin/predmeti?error=course");
  }
  if (assigned === "conflict") {
    redirect(returnToCourse
      ? "/admin/predmeti/" + input.courseId + "?error=member"
      : "/admin/korisnici?error=member");
  }
  if (assigned === "unchanged") {
    redirect(returnToCourse
      ? "/admin/predmeti/" + input.courseId + "?team=unchanged"
      : "/admin/korisnici?unchanged=1");
  }
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/[slug]", "page");
  revalidatePath("/nastavnici");
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin/predmeti/" + input.courseId);
  redirect(returnToCourse ? "/admin/predmeti/" + input.courseId + "?team=updated" : "/admin/korisnici?assigned=1");
}

export async function revokeCourseMemberAction(data: FormData) {
  const actor = await requirePermission("users.manage");
  const userId = String(data.get("userId") ?? "");
  const courseId = String(data.get("courseId") ?? "");
  const returnToCourse = data.get("returnToCourse") === "1";
  if (!userId || userId.length > 40 || !courseId || courseId.length > 40) {
    throw new Error("Neispravan ID.");
  }
  const expectedVersion = Number(data.get("sessionVersion"));
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0 || String(expectedVersion) !== data.get("sessionVersion")) {
    throw new Error("Neispravna verzija angažovanja. Osvežite stranicu.");
  }
  const outcome = await db.$transaction(async (tx) => {
    const existing = await tx.courseMembership.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { role: true },
    });
    if (!existing) return "stale" as const;
    // Assignment and access changes increment sessionVersion. A form opened
    // before a revocation/reassignment must not revoke the new assignment.
    const claimed = await tx.user.updateMany({
      where: { id: userId, sessionVersion: expectedVersion },
      data: { sessionVersion: { increment: 1 } },
    });
    if (claimed.count !== 1) return "stale" as const;
    const removed = await tx.courseMembership.deleteMany({ where: { userId, courseId, role: existing.role } });
    if (removed.count !== 1) throw new Error("Angažovanje je promenjeno tokom opoziva.");
    await tx.auditLog.create({ data: { actorId: actor.id, action: "membership.revoke", subjectType: "Course", subjectId: courseId } });
    return "revoked" as const;
  });
  if (outcome === "stale") {
    // A course may have been deleted while the revocation form was open.
    // Return to the course list instead of a now-missing detail page.
    if (returnToCourse) {
      const course = await db.course.findUnique({ where: { id: courseId }, select: { id: true } });
      if (!course) redirect("/admin/predmeti?error=course");
    }
    redirect(returnToCourse ? "/admin/predmeti/" + courseId + "?error=stale" : "/admin/korisnici?error=stale");
  }
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/[slug]", "page");
  revalidatePath("/nastavnici");
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin/predmeti/" + courseId);
  // Another administrator may delete the course after the revocation commits.
  if (returnToCourse) {
    const course = await db.course.findUnique({ where: { id: courseId }, select: { id: true } });
    if (!course) redirect("/admin/predmeti?error=course");
  }
  redirect(returnToCourse ? "/admin/predmeti/" + courseId + "?team=updated" : "/admin/korisnici?revoked=1");
}

export async function updateUserAccessAction(data: FormData) {
  const actor = await requirePermission("users.manage");
  const input = accessInput.parse({
    id: String(data.get("id") ?? ""),
    role: String(data.get("role") ?? ""),
    active: String(data.get("active") ?? ""),
  });
  const target = await db.user.findUnique({
    where: { id: input.id },
    select: { role: true, active: true },
  });
  if (!target || target.role === "SUPER_ADMIN") {
    throw new Error("Super administratorski nalog je zaštićen ili nalog ne postoji.");
  }
  const active = input.active === "true";
  const originalRole = String(data.get("originalRole") ?? "");
  const originalActive = String(data.get("originalActive") ?? "");
  if (!["STUDENT", "ASSISTANT", "PROFESSOR", "EDITOR"].includes(originalRole) ||
      !["true", "false"].includes(originalActive)) {
    throw new Error("Neispravna verzija naloga. Osvežite stranicu.");
  }
  if (target.role !== originalRole || target.active !== (originalActive === "true")) {
    redirect("/admin/korisnici?error=stale");
  }
  if (target.role === input.role && target.active === active) {
    redirect("/admin/korisnici?unchanged=1");
  }
  const saved = await db.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: { id: input.id, role: target.role, active: target.active },
      data: { role: input.role, active, sessionVersion: { increment: 1 } },
    });
    if (updated.count !== 1) return false;
    // Stare dodele predmeta nikada ne preživljavaju promenu uloge ili deaktivaciju.
    if (target.role !== input.role || !active) {
      await tx.courseMembership.deleteMany({ where: { userId: input.id } });
    }
    await tx.auditLog.create({ data: { actorId: actor.id, action: "user.access.update", subjectType: "User", subjectId: input.id } });
    return true;
  });
  if (!saved) redirect("/admin/korisnici?error=stale");
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin/predmeti");
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/[slug]", "page");
  revalidatePath("/nastavnici");
  redirect("/admin/korisnici?updated=1");
}

export async function resetUserPasswordAction(data: FormData) {
  const actor = await requirePermission("users.manage");
  const input = passwordResetInput.parse({
    id: String(data.get("id") ?? ""),
    password: String(data.get("password") ?? ""),
  });
  const expectedVersion = Number(data.get("sessionVersion"));
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 0 || String(expectedVersion) !== data.get("sessionVersion")) {
    throw new Error("Neispravna verzija naloga. Osvežite stranicu.");
  }
  const passwordHash = await hash(input.password, 12);
  const saved = await db.$transaction(async (tx) => {
    const result = await tx.user.updateMany({
      // Reject a stale reset after another password, access or session change.
      where: { id: input.id, role: { not: "SUPER_ADMIN" }, sessionVersion: expectedVersion },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
    if (result.count !== 1) return false;
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "user.password.reset", subjectType: "User", subjectId: input.id },
    });
    return true;
  });
  if (!saved) redirect("/admin/korisnici?error=stale");
  revalidatePath("/admin/korisnici");
  redirect("/admin/korisnici?reset=1");
}

export async function updateUserIdentityAction(data: FormData) {
  const actor = await requirePermission("users.manage");
  const input = userIdentityInput.parse({
    id: String(data.get("id") ?? ""),
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
  });
  const target = await db.user.findUnique({
    where: { id: input.id },
    select: { name: true, email: true, role: true, sessionVersion: true },
  });
  if (!target || target.role === "SUPER_ADMIN") {
    throw new Error("Super administratorski nalog je zaštićen ili nalog ne postoji.");
  }
  const original = userIdentityInput.safeParse({
    id: input.id,
    name: String(data.get("originalName") ?? ""),
    email: String(data.get("originalEmail") ?? ""),
  });
  if (!original.success) throw new Error("Neispravna verzija naloga. Osvežite stranicu.");
  if (target.name !== original.data.name || target.email !== original.data.email) {
    redirect("/admin/korisnici?error=stale");
  }
  if (target.name === input.name && target.email === input.email) {
    redirect("/admin/korisnici?unchanged=1");
  }
  if (target.email !== input.email) {
    const duplicate = await db.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (duplicate) redirect("/admin/korisnici?error=duplicate");
  }

  let saved: boolean;
  try {
    saved = await db.$transaction(async (tx) => {
      const result = await tx.user.updateMany({
        where: {
          id: input.id,
          role: { not: "SUPER_ADMIN" },
          name: target.name,
          email: target.email,
          sessionVersion: target.sessionVersion,
        },
        data: {
          name: input.name,
          email: input.email,
          ...(target.email !== input.email ? { sessionVersion: { increment: 1 } } : {}),
        },
      });
      if (result.count !== 1) return false;
      await tx.auditLog.create({
        data: { actorId: actor.id, action: "user.identity.update", subjectType: "User", subjectId: input.id },
      });
      return true;
    });
  } catch (error) {
    // Another administrator may claim the email after the duplicate lookup.
    const prismaError = error as { code?: unknown; meta?: { target?: unknown } } | null;
    const target = prismaError?.meta?.target;
    if (prismaError?.code === "P2002" && Array.isArray(target) && target.includes("email")) {
      redirect("/admin/korisnici?error=duplicate");
    }
    throw error;
  }
  if (!saved) redirect("/admin/korisnici?error=stale");
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin");
  revalidatePath("/nastavnici");
  revalidatePath("/predmeti/[slug]", "page");
  revalidatePath("/novosti/[slug]", "page");
  redirect("/admin/korisnici?details=1");
}
