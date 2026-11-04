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
  const news = await db.news.create({
    data: {
      ...input,
      slug: toSlug(input.title) + "-" + randomUUID().slice(0, 7),
      authorId: actor.id,
      status: publish ? "PUBLISHED" : "DRAFT",
      publishedAt: publish ? new Date() : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/novosti");
  redirect("/admin/novosti/" + news.id);
}

export async function updateNewsAction(data: FormData) {
  await requirePermission("news.write");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan ID novosti.");
  const input = newsInput.parse(fields(data));
  const news = await db.news.update({ where: { id }, data: input });
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  redirect("/admin/novosti/" + news.id + "?saved=1");
}

export async function togglePublishNewsAction(data: FormData) {
  await requirePermission("news.publish");
  const id = String(data.get("id") ?? "");
  if (!id || id.length > 40) throw new Error("Neispravan ID novosti.");
  const news = await db.news.findUnique({ where: { id }, select: { status: true, slug: true } });
  if (!news) throw new Error("Novost nije pronađena.");
  const publish = news.status !== "PUBLISHED";
  await db.news.update({
    where: { id },
    data: {
      status: publish ? "PUBLISHED" : "DRAFT",
      publishedAt: publish ? new Date() : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/novosti/" + news.slug);
  redirect("/admin/novosti");
}
