"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { courseInput, materialInput, materialEditInput } from "@/application/validation";
import { requirePermission } from "@/application/authorization";
import { toSlug } from "@/domain/content/slug";
import { db } from "@/infrastructure/db/prisma";
import { materialKinds } from "@/domain/content/material-kinds";
import { readPage } from "@/lib/pagination";

function materialReturnUrl(courseId: string, data: FormData, status: string) {
  const q = String(data.get("returnMq") ?? "").trim().slice(0, 80);
  const kind = materialKinds.find((value) => value === data.get("returnMk"));
  const page = readPage(String(data.get("returnMp") ?? ""));
  const params = new URLSearchParams({
    material: status,
    ...(q ? { mq: q } : {}),
    ...(kind ? { mk: kind } : {}),
    mp: String(page),
  });
  return "/admin/predmeti/" + courseId + "?" + params + "#materijali-predmeta";
}

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
  const duplicate = await db.course.findUnique({ where: { code: input.code }, select: { id: true } });
  if (duplicate) redirect("/admin/predmeti?error=duplicate");
  // The preflight check is only advisory: another request can insert the same
  // code before this transaction commits. Handle the database constraint too.
  let course;
  try {
    course = await db.$transaction(async (tx) => {
      const created = await tx.course.create({
        data: { ...input, slug: toSlug(input.title) + "-" + randomUUID().slice(0, 7) },
      });
      await tx.auditLog.create({ data: { actorId: actor.id, action: "course.create", subjectType: "Course", subjectId: created.id } });
      return created;
    });
  } catch (error) {
    const prismaError = error as { code?: unknown; meta?: { target?: unknown } } | null;
    const target = prismaError?.meta?.target;
    if (prismaError?.code === "P2002" && Array.isArray(target) && target.includes("code")) {
      redirect("/admin/predmeti?error=duplicate");
    }
    throw error;
  }
  revalidatePath("/");
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/" + course.slug);
  revalidatePath("/sitemap.xml");
  redirect("/admin/predmeti/" + course.id);
}

export async function updateCourseAction(data: FormData) {
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan predmet.");
  const actor = await requirePermission("courses.edit", id);
  const input = courseInput.parse(courseFields(data));
  const duplicate = await db.course.findUnique({ where: { code: input.code }, select: { id: true } });
  if (duplicate && duplicate.id !== id) redirect("/admin/predmeti/" + id + "?error=duplicate");
  // A course has no updatedAt field. Compare all original editable values so
  // another teacher cannot silently overwrite a more recent update.
  const original = courseInput.safeParse({
    title: String(data.get("originalTitle") ?? ""),
    code: String(data.get("originalCode") ?? ""),
    // Base64 preserves line endings verbatim across browser form submission.
    description: Buffer.from(String(data.get("originalDescriptionBase64") ?? ""), "base64").toString("utf8"),
    semester: String(data.get("originalSemester") ?? ""),
    studyLevel: String(data.get("originalStudyLevel") ?? ""),
  });
  if (!original.success) throw new Error("Neispravna verzija predmeta. Osvežite stranicu.");
  let slug: string | null;
  try {
    slug = await db.$transaction(async (tx) => {
      const result = await tx.course.updateMany({
        where: { id, ...original.data },
        data: input,
      });
      if (result.count !== 1) return null;
      await tx.auditLog.create({
        data: { actorId: actor.id, action: "course.update", subjectType: "Course", subjectId: id },
      });
      const saved = await tx.course.findUnique({ where: { id }, select: { slug: true } });
      return saved?.slug ?? null;
    });
  } catch (error) {
    // A concurrent request may claim the new code after the preflight lookup.
    const prismaError = error as { code?: unknown; meta?: { target?: unknown } } | null;
    const target = prismaError?.meta?.target;
    if (prismaError?.code === "P2002" && Array.isArray(target) && target.includes("code")) {
      redirect("/admin/predmeti/" + id + "?error=duplicate");
    }
    throw error;
  }
  if (!slug) {
    // A stale form may refer to a course deleted by another administrator.
    const exists = await db.course.findUnique({ where: { id }, select: { id: true } });
    redirect(exists ? "/admin/predmeti/" + id + "?error=stale" : "/admin/predmeti?error=course");
  }
  revalidatePath("/");
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/" + slug);
  revalidatePath("/nastavnici");
  redirect("/admin/predmeti/" + id + "?saved=1");
}

export async function createMaterialAction(data: FormData) {
  const input = materialInput.parse({
    courseId: String(data.get("courseId") ?? ""),
    title: String(data.get("title") ?? ""),
    url: String(data.get("url") ?? ""),
    kind: String(data.get("kind") ?? "OTHER"),
  });
  const actor = await requirePermission("materials.create", input.courseId);
  const course = await db.course.findUnique({
    where: { id: input.courseId },
    select: { id: true, slug: true },
  });
  if (!course) redirect("/admin/predmeti?error=course");
  try {
    await db.$transaction(async (tx) => {
      const material = await tx.material.create({ data: input });
      await tx.auditLog.create({ data: { actorId: actor.id, action: "material.create", subjectType: "Material", subjectId: material.id } });
    });
  } catch (error) {
    // The course can be deleted after the initial lookup, before insertion.
    // Only treat a foreign-key failure as a missing course when confirmed.
    if ((error as { code?: unknown } | null)?.code === "P2003") {
      const exists = await db.course.findUnique({ where: { id: input.courseId }, select: { id: true } });
      if (!exists) redirect("/admin/predmeti?error=course");
    }
    throw error;
  }
  // The public catalog shows each course’s material count.
  revalidatePath("/predmeti");
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
  // Do not delete a material that another editor changed after this form loaded.
  const original = materialEditInput.safeParse({
    materialId,
    title: String(data.get("originalTitle") ?? ""),
    url: String(data.get("originalUrl") ?? ""),
    kind: String(data.get("originalKind") ?? ""),
  });
  if (!original.success) throw new Error("Neispravna verzija materijala. Osvežite stranicu.");
  const deleted = await db.$transaction(async (tx) => {
    const result = await tx.material.deleteMany({
      where: {
        id: material.id,
        courseId: material.courseId,
        title: original.data.title,
        url: original.data.url,
        kind: original.data.kind,
      },
    });
    if (result.count !== 1) return false;
    await tx.auditLog.create({ data: { actorId: actor.id, action: "material.delete", subjectType: "Material", subjectId: material.id } });
    return true;
  });
  if (!deleted) redirect(materialReturnUrl(material.courseId, data, "conflict"));
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/" + material.course.slug);
  redirect(materialReturnUrl(material.courseId, data, "deleted"));
}

export async function updateMaterialAction(data: FormData) {
  const input = materialEditInput.parse({
    materialId: String(data.get("materialId") ?? ""),
    title: String(data.get("title") ?? ""),
    url: String(data.get("url") ?? ""),
    kind: String(data.get("kind") ?? "OTHER"),
  });
  // Resolve the owning course on the server; never authorize using a form's course ID.
  const material = await db.material.findUnique({
    where: { id: input.materialId },
    select: { courseId: true, course: { select: { slug: true } } },
  });
  if (!material) throw new Error("Materijal nije pronađen.");
  const actor = await requirePermission("materials.edit", material.courseId);
  // The original values are a compare-and-swap token. They are not used for
  // authorization, only to avoid overwriting changes saved by another editor.
  const original = materialEditInput.safeParse({
    materialId: input.materialId,
    title: String(data.get("originalTitle") ?? ""),
    url: String(data.get("originalUrl") ?? ""),
    kind: String(data.get("originalKind") ?? ""),
  });
  if (!original.success) throw new Error("Neispravna verzija materijala. Osvežite stranicu.");
  const updated = await db.$transaction(async (tx) => {
    const result = await tx.material.updateMany({
      where: {
        id: input.materialId,
        courseId: material.courseId,
        title: original.data.title,
        url: original.data.url,
        kind: original.data.kind,
      },
      data: { title: input.title, url: input.url, kind: input.kind },
    });
    if (result.count !== 1) return false;
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "material.update", subjectType: "Material", subjectId: input.materialId },
    });
    return true;
  });
  if (!updated) redirect(materialReturnUrl(material.courseId, data, "conflict"));
  // Keep the public catalog cache consistent with material edits, as with creation/deletion.
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/" + material.course.slug);
  redirect(materialReturnUrl(material.courseId, data, "updated"));
}

export async function deleteCourseAction(data: FormData) {
  // Destructive course deletion is restricted to SUPER_ADMIN, not editors or faculty.
  const actor = await requirePermission("users.manage");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan predmet.");
  // Reject deletion from a form opened before another teacher edited the course.
  const original = courseInput.safeParse({
    title: String(data.get("originalTitle") ?? ""),
    code: String(data.get("originalCode") ?? ""),
    description: Buffer.from(String(data.get("originalDescriptionBase64") ?? ""), "base64").toString("utf8"),
    semester: String(data.get("originalSemester") ?? ""),
    studyLevel: String(data.get("originalStudyLevel") ?? ""),
  });
  if (!original.success) throw new Error("Neispravna verzija predmeta. Osvežite stranicu.");
  const deleted = await db.$transaction(async (tx) => {
    const existing = await tx.course.findUnique({
      where: { id },
      select: { slug: true, memberships: { select: { userId: true } } },
    });
    if (!existing) return null;
    const result = await tx.course.deleteMany({ where: { id, ...original.data } });
    if (result.count !== 1) return null;
    // Course memberships and materials cascade; revoke active faculty JWTs.
    const userIds = existing.memberships.map((entry) => entry.userId);
    if (userIds.length) {
      await tx.user.updateMany({
        where: { id: { in: userIds } },
        data: { sessionVersion: { increment: 1 } },
      });
    }
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "course.delete", subjectType: "Course", subjectId: id },
    });
    return existing;
  });
  if (!deleted) {
    // A deletion form may refer to a course already removed by another administrator.
    const exists = await db.course.findUnique({ where: { id }, select: { id: true } });
    redirect(exists ? "/admin/predmeti/" + id + "?error=stale" : "/admin/predmeti?error=course");
  }
  revalidatePath("/");
  revalidatePath("/predmeti");
  revalidatePath("/predmeti/" + deleted.slug);
  revalidatePath("/nastavnici");
  revalidatePath("/sitemap.xml");
  redirect("/admin/predmeti?deleted=1");
}
