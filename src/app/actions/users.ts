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
  await db.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { name: input.name, email: input.email, passwordHash, role: input.role },
    });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "user.create", subjectType: "User", subjectId: created.id } });
  });
  revalidatePath("/admin/korisnici");
  redirect("/admin/korisnici?created=1");
}

export async function assignCourseMemberAction(data: FormData) {
  const actor = await requirePermission("users.manage");
  const returnToCourse = data.get("returnToCourse") === "1";
  const input = membershipInput.parse({
    courseId: String(data.get("courseId") ?? ""),
    email: String(data.get("email") ?? ""),
    role: String(data.get("role") ?? ""),
  });
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
  const assigned = await db.$transaction(async (tx) => {
    const current = await tx.user.findUnique({ where: { id: user.id }, select: { role: true, active: true } });
    if (!current?.active || current.role !== input.role) throw new Error("Korisnička uloga je promenjena.");
    const existing = await tx.courseMembership.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: input.courseId } },
      select: { role: true },
    });
    if (existing?.role === input.role) return false;
    await tx.courseMembership.upsert({
      where: { userId_courseId: { userId: user.id, courseId: input.courseId } },
      create: { userId: user.id, courseId: input.courseId, role: input.role },
      update: { role: input.role },
    });
    // Re-authenticate after the scope of access changes.
    await tx.user.update({
      where: { id: user.id },
      data: { sessionVersion: { increment: 1 } },
    });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "membership.assign", subjectType: "Course", subjectId: input.courseId } });
    return true;
  });
  if (!assigned) {
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
  await db.$transaction(async (tx) => {
    const removed = await tx.courseMembership.deleteMany({ where: { userId, courseId } });
    if (removed.count) {
      await tx.user.updateMany({
        where: { id: userId },
        data: { sessionVersion: { increment: 1 } },
      });
      await tx.auditLog.create({ data: { actorId: actor.id, action: "membership.revoke", subjectType: "Course", subjectId: courseId } });
    }
  });
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/[slug]", "page");
  revalidatePath("/nastavnici");
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin/predmeti/" + courseId);
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
  if (target.role === input.role && target.active === active) {
    redirect("/admin/korisnici?unchanged=1");
  }
  await db.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: { id: input.id, role: target.role, active: target.active },
      data: { role: input.role, active, sessionVersion: { increment: 1 } },
    });
    if (updated.count !== 1) throw new Error("Korisnička uloga ili status je u međuvremenu promenjen.");
    // Stare dodele predmeta nikada ne preživljavaju promenu uloge ili deaktivaciju.
    if (target.role !== input.role || !active) {
      await tx.courseMembership.deleteMany({ where: { userId: input.id } });
    }
    await tx.auditLog.create({ data: { actorId: actor.id, action: "user.access.update", subjectType: "User", subjectId: input.id } });
  });
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
  const passwordHash = await hash(input.password, 12);
  await db.$transaction(async (tx) => {
    const result = await tx.user.updateMany({
      // Another super admin cannot be reset from the general users table.
      where: { id: input.id, role: { not: "SUPER_ADMIN" } },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
    if (result.count !== 1) throw new Error("Nalog nije pronađen ili je zaštićen.");
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "user.password.reset", subjectType: "User", subjectId: input.id },
    });
  });
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
  if (target.name === input.name && target.email === input.email) {
    redirect("/admin/korisnici?unchanged=1");
  }
  if (target.email !== input.email) {
    const duplicate = await db.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (duplicate) redirect("/admin/korisnici?error=duplicate");
  }

  await db.$transaction(async (tx) => {
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
    if (result.count !== 1) throw new Error("Nalog je u međuvremenu izmenjen.");
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "user.identity.update", subjectType: "User", subjectId: input.id },
    });
  });
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin");
  revalidatePath("/nastavnici");
  revalidatePath("/predmeti/[slug]", "page");
  redirect("/admin/korisnici?details=1");
}
