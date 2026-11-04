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
  await requirePermission("courses.create");
  const input = courseInput.parse(courseFields(data));
  const course = await db.course.create({
    data: {
      ...input,
      slug: toSlug(input.title) + "-" + randomUUID().slice(0, 7),
    },
  });
  revalidatePath("/predmeti");
  redirect("/admin/predmeti/" + course.id);
}

export async function updateCourseAction(data: FormData) {
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan predmet.");
  await requirePermission("courses.edit", id);
  const input = courseInput.parse(courseFields(data));
  const course = await db.course.update({ where: { id }, data: input });
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
  await requirePermission("materials.create", input.courseId);
  const course = await db.course.findUnique({
    where: { id: input.courseId },
    select: { id: true, slug: true },
  });
  if (!course) throw new Error("Predmet ne postoji.");
  await db.material.create({ data: input });
  revalidatePath("/predmeti/" + course.slug);
  redirect("/admin/predmeti/" + course.id + "?material=added");
}
