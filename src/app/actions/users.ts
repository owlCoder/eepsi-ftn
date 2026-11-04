"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { membershipInput, userInput } from "@/application/validation";
import { requirePermission } from "@/application/authorization";
import { db } from "@/infrastructure/db/prisma";

export async function createUserAction(data: FormData) {
  await requirePermission("users.manage");
  const input = userInput.parse({
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    password: String(data.get("password") ?? ""),
    role: String(data.get("role") ?? ""),
  });
  await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hash(input.password, 12),
      role: input.role,
    },
  });
  revalidatePath("/admin/korisnici");
  redirect("/admin/korisnici?created=1");
}

export async function assignCourseMemberAction(data: FormData) {
  await requirePermission("users.manage");
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
    throw new Error("Nalog ne postoji, nije aktivan ili njegova globalna uloga nije odgovarajuća.");
  }
  await db.courseMembership.upsert({
    where: { userId_courseId: { userId: user.id, courseId: input.courseId } },
    create: { userId: user.id, courseId: input.courseId, role: input.role },
    update: { role: input.role },
  });
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin/predmeti/" + input.courseId);
  redirect("/admin/korisnici?assigned=1");
}

export async function revokeCourseMemberAction(data: FormData) {
  await requirePermission("users.manage");
  const userId = String(data.get("userId") ?? "");
  const courseId = String(data.get("courseId") ?? "");
  if (!userId || userId.length > 40 || !courseId || courseId.length > 40) {
    throw new Error("Neispravan ID.");
  }
  await db.courseMembership.deleteMany({ where: { userId, courseId } });
  revalidatePath("/admin/korisnici");
  revalidatePath("/admin/predmeti/" + courseId);
  redirect("/admin/korisnici?revoked=1");
}
