import "server-only";
import { db } from "@/infrastructure/db/prisma";

export async function latestNews(limit = 4) {
  if (!process.env.DATABASE_URL) return [];
  return db.news.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true, summary: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    take: Math.min(limit, 20),
  });
}

export async function listNews(q: string, page: number) {
  if (!process.env.DATABASE_URL) return [];
  return db.news.findMany({
    where: { status: "PUBLISHED", ...(q ? { OR: [{ title: { contains: q } }, { summary: { contains: q } }] } : {}) },
    select: { id: true, slug: true, title: true, summary: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * 12,
    take: 12,
  });
}

export async function listCourses(q = "", page = 1) {
  if (!process.env.DATABASE_URL) return [];
  return db.course.findMany({
    where: q ? { OR: [{ title: { contains: q } }, { code: { contains: q } }] } : {},
    select: { id: true, title: true, slug: true, code: true, semester: true, studyLevel: true, description: true },
    orderBy: [{ semester: "asc" }, { title: "asc" }],
    skip: (page - 1) * 18,
    take: 18,
  });
}

export async function courseBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  return db.course.findUnique({
    where: { slug },
    include: {
      materials: { orderBy: { createdAt: "desc" }, take: 100 },
      memberships: {
        select: { role: true, user: { select: { id: true, name: true } } },
        orderBy: { role: "desc" },
      },
    },
  });
}

export async function newsBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  return db.news.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, summary: true, body: true, publishedAt: true, author: { select: { name: true } } },
  });
}
