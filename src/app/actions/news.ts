"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { newsInput } from "@/application/validation";
import { requirePermission } from "@/application/authorization";
import { toSlug } from "@/domain/content/slug";
import { db } from "@/infrastructure/db/prisma";

function fields(data: FormData) {
  return {
    title: String(data.get("title") ?? ""),
    summary: String(data.get("summary") ?? ""),
    body: String(data.get("body") ?? ""),
  };
}

export async function createNewsAction(data: FormData) {
  const actor = await requirePermission("news.write");
  const input = newsInput.parse(fields(data));
  const publish = data.get("publish") === "true";
  if (publish) await requirePermission("news.publish");
  const news = await db.$transaction(async (tx) => {
    const created = await tx.news.create({
      data: {
        ...input,
        slug: toSlug(input.title) + "-" + randomUUID().slice(0, 7),
        authorId: actor.id,
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: publish ? new Date() : null,
      },
    });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "news.create", subjectType: "News", subjectId: created.id } });
    return created;
  });
  revalidatePath("/");
  revalidatePath("/novosti");
  redirect("/admin/novosti/" + news.id);
}

export async function updateNewsAction(data: FormData) {
  const actor = await requirePermission("news.write");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan ID novosti.");
  const input = newsInput.parse(fields(data));
  const news = await db.$transaction(async (tx) => {
    const updated = await tx.news.update({ where: { id }, data: input });
    await tx.auditLog.create({ data: { actorId: actor.id, action: "news.update", subjectType: "News", subjectId: updated.id } });
    return updated;
  });
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  redirect("/admin/novosti/" + news.id + "?saved=1");
}

export async function togglePublishNewsAction(data: FormData) {
  const actor = await requirePermission("news.publish");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan ID novosti.");
  const news = await db.news.findUnique({ where: { id }, select: { status: true, slug: true } });
  if (!news) throw new Error("Novost nije pronađena.");
  const publish = news.status !== "PUBLISHED";
  await db.$transaction(async (tx) => {
    const result = await tx.news.updateMany({
      where: { id, status: news.status },
      data: {
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: publish ? new Date() : null,
      },
    });
    if (result.count !== 1) throw new Error("Status novosti je u međuvremenu promenjen.");
    await tx.auditLog.create({
      data: { actorId: actor.id, action: publish ? "news.publish" : "news.unpublish", subjectType: "News", subjectId: id },
    });
  });
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  redirect("/admin/novosti");
}

export async function deleteNewsAction(data: FormData) {
  const actor = await requirePermission("news.write");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravna novost.");
  const news = await db.$transaction(async (tx) => {
    const existing = await tx.news.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) throw new Error("Novost je već uklonjena.");
    await tx.news.delete({ where: { id } });
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "news.delete", subjectType: "News", subjectId: id },
    });
    return existing;
  });
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  revalidatePath("/sitemap.xml");
  redirect("/admin/novosti?deleted=1");
}
