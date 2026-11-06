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
  revalidatePath("/sitemap.xml");
  redirect("/admin/novosti/" + news.id);
}

export async function updateNewsAction(data: FormData) {
  const actor = await requirePermission("news.write");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan ID novosti.");
  const input = newsInput.parse(fields(data));
  const expectedUpdatedAt = new Date(String(data.get("updatedAt") ?? ""));
  if (Number.isNaN(expectedUpdatedAt.getTime())) {
    throw new Error("Neispravna verzija novosti. Osvežite stranicu.");
  }
  // Editing published content changes the public site, so it requires
  // publishing rights just like withdrawing or deleting a published post.
  const current = await db.news.findUnique({ where: { id }, select: { status: true } });
  if (!current) redirect("/admin/novosti/" + id + "?error=stale");
  if (current.status === "PUBLISHED") await requirePermission("news.publish");
  // Include the status in the compare-and-swap: a concurrent publication must
  // not let a draft-only editor change newly published content.
  const news = await db.$transaction(async (tx) => {
    const result = await tx.news.updateMany({
      where: { id, updatedAt: expectedUpdatedAt, status: current.status },
      data: input,
    });
    if (result.count !== 1) return null;
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "news.update", subjectType: "News", subjectId: id },
    });
    return tx.news.findUnique({ where: { id }, select: { slug: true } });
  });
  if (!news) redirect("/admin/novosti/" + id + "?error=stale");
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  redirect("/admin/novosti/" + id + "?saved=1");
}

export async function togglePublishNewsAction(data: FormData) {
  const actor = await requirePermission("news.publish");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan ID novosti.");
  const intent = data.get("publish");
  if (intent !== "true" && intent !== "false") throw new Error("Neispravna akcija za objavljivanje.");
  const expectedUpdatedAt = new Date(String(data.get("updatedAt") ?? ""));
  if (Number.isNaN(expectedUpdatedAt.getTime())) throw new Error("Neispravna verzija novosti. Osvežite stranicu.");
  const publish = intent === "true";
  const desiredStatus = publish ? "PUBLISHED" : "DRAFT";
  const news = await db.news.findUnique({ where: { id }, select: { status: true, slug: true, updatedAt: true } });
  if (!news) throw new Error("Novost nije pronađena.");
  // A stale editor must not publish or withdraw content changed in another tab.
  if (news.updatedAt.getTime() !== expectedUpdatedAt.getTime()) redirect("/admin/novosti?error=stale");
  if (news.status === desiredStatus) redirect("/admin/novosti?unchanged=1");
  const updated = await db.$transaction(async (tx) => {
    const result = await tx.news.updateMany({
      where: { id, status: news.status, updatedAt: expectedUpdatedAt },
      data: {
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: publish ? new Date() : null,
      },
    });
    if (result.count !== 1) return false;
    await tx.auditLog.create({
      data: { actorId: actor.id, action: publish ? "news.publish" : "news.unpublish", subjectType: "News", subjectId: id },
    });
    return true;
  });
  // A concurrent edit after the initial read is also a stale form, not a server error.
  if (!updated) redirect("/admin/novosti?error=stale");
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  revalidatePath("/sitemap.xml");
  redirect("/admin/novosti");
}

export async function deleteNewsAction(data: FormData) {
  const actor = await requirePermission("news.write");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravna novost.");
  const expectedUpdatedAt = new Date(String(data.get("updatedAt") ?? ""));
  if (Number.isNaN(expectedUpdatedAt.getTime())) throw new Error("Neispravna verzija novosti. Osvežite stranicu.");
  // Removing a published post also withdraws public content; editors without
  // publishing rights may only delete drafts.
  const current = await db.news.findUnique({ where: { id }, select: { status: true } });
  if (!current) redirect("/admin/novosti?error=stale");
  if (current.status === "PUBLISHED") await requirePermission("news.publish");
  const news = await db.$transaction(async (tx) => {
    const existing = await tx.news.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) return null;
    // A concurrent publish must not turn an authorized draft deletion into
    // deletion of public content.
    const result = await tx.news.deleteMany({ where: { id, updatedAt: expectedUpdatedAt, status: current.status } });
    if (result.count !== 1) return null;
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "news.delete", subjectType: "News", subjectId: id },
    });
    return existing;
  });
  if (!news) redirect("/admin/novosti?error=stale");
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  revalidatePath("/sitemap.xml");
  redirect("/admin/novosti?deleted=1");
}
