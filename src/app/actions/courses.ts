"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { courseInput, materialInput } from "@/application/validation";
import { requirePermission } from "@/application/authorization";
import { toSlug } from "@/domain/content/slug";
import { db } from "@/infrastructure/db/prisma";

function courseFields(data: FormData) {
  return {
    title: String(data.get("title") ?? ""),
    code: String(data.get("code") ?? ""),
    description: String(data.get("description") ?? ""),
    semester: String(data.get("semester") ?? ""),
    studyLevel: String(data.get("studyLevel") ?? ""),
  };
}

export async function createCourseAction(data: FormData) {
  const actor = await requirePermission("courses.create");
  const input = courseInput.parse(courseFields(data));
  const course = await db.$transaction(async (tx) => {
    const created = await tx.course.create({
      data: { ...input, slug: toSlug(input.title) + "-" + randomUUID().slice(0, 7) },
    });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "course.create", subjectType: "Course", subjectId: created.id } });
    return created;
  });
  revalidatePath("/");
  revalidatePath("/predmeti");
  redirect("/admin/predmeti/" + course.id);
}

export async function updateCourseAction(data: FormData) {
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan predmet.");
  const actor = await requirePermission("courses.edit", id);
  const input = courseInput.parse(courseFields(data));
  const course = await db.$transaction(async (tx) => {
    const updated = await tx.course.update({ where: { id }, data: input });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "course.update", subjectType: "Course", subjectId: updated.id } });
    return updated;
  });
  revalidatePath("/");
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/" + course.slug);
  redirect("/admin/predmeti/" + id + "?saved=1");
}

export async function createMaterialAction(data: FormData) {
  const input = materialInput.parse({
    courseId: String(data.get("courseId") ?? ""),
    title: String(data.get("title") ?? ""),
    url: String(data.get("url") ?? ""),
  });
  const actor = await requirePermission("materials.create", input.courseId);
  const course = await db.course.findUnique({
    where: { id: input.courseId },
    select: { id: true, slug: true },
  });
  if (!course) throw new Error("Predmet ne postoji.");
  await db.$transaction(async (tx) => {
    const material = await tx.material.create({ data: input });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "material.create", subjectType: "Material", subjectId: material.id } });
  });
  revalidatePath("/predmeti/" + course.slug);
  redirect("/admin/predmeti/" + course.id + "?material=added");
}

export async function deleteMaterialAction(data: FormData) {
  const materialId = String(data.get("materialId") ?? "");
  if (!materialId || materialId.length > 40) throw new Error("Neispravan materijal.");
  const material = await db.material.findUnique({
    where: { id: materialId },
    select: { id: true, courseId: true, course: { select: { slug: true } } },
  });
  if (!material) throw new Error("Materijal nije pronađen.");
  const actor = await requirePermission("materials.delete", material.courseId);
  await db.$transaction(async (tx) => {
    const result = await tx.material.deleteMany({ where: { id: material.id, courseId: material.courseId } });
    if (result.count !== 1) throw new Error("Materijal je već uklonjen.");
    await tx.auditLog.create({ data: { actorId: actor.id, action: "material.delete", subjectType: "Material", subjectId: material.id } });
  });
  revalidatePath("/predmeti/" + material.course.slug);
  redirect("/admin/predmeti/" + material.courseId + "?material=deleted");
}
