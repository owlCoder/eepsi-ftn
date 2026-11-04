import "server-only";
import { cache } from "react";
import { db } from "@/infrastructure/db/prisma";
import type { CourseFilters } from "@/domain/courses/filters";

export async function featuredCourses(limit = 3) {
  if (!process.env.DATABASE_URL) return [];
  return db.course.findMany({
    select: { id: true, title: true, slug: true, code: true, semester: true, studyLevel: true, description: true },
    orderBy: [{ semester: "asc" }, { title: "asc" }],
    take: Math.max(1, Math.min(limit, 6)),
  });
}

export async function publicSitemapSlugs() {
  if (!process.env.DATABASE_URL) return { courses: [] as { slug: string }[], news: [] as { slug: string }[] };
  const [courses, news] = await Promise.all([
    db.course.findMany({ select: { slug: true }, orderBy: { createdAt: "desc" }, take: 5000 }),
    db.news.findMany({ where: { status: "PUBLISHED" }, select: { slug: true }, orderBy: { publishedAt: "desc" }, take: 5000 }),
  ]);
  return { courses, news };
}

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

export async function listCourses(q = "", page = 1, filters?: CourseFilters) {
  if (!process.env.DATABASE_URL) return [];
  return db.course.findMany({
    where: {
      ...(q ? { OR: [{ title: { contains: q } }, { code: { contains: q } }] } : {}),
      ...(filters?.level ? { studyLevel: filters.level } : {}),
      ...(filters?.semester ? { semester: filters.semester } : {}),
    },
    select: { id: true, title: true, slug: true, code: true, semester: true, studyLevel: true, description: true },
    orderBy: [{ semester: "asc" }, { title: "asc" }],
    skip: (page - 1) * 18,
    take: 18,
  });
}

export const courseBySlug = cache(async (slug: string) => {
  if (!process.env.DATABASE_URL) return null;
  return db.course.findUnique({
    where: { slug },
    include: {
      materials: { orderBy: { createdAt: "desc" }, take: 100 },
      memberships: {
        where: { user: { active: true } },
        select: { role: true, user: { select: { id: true, name: true } } },
        orderBy: { role: "desc" },
      },
    },
  });
});

export const newsBySlug = cache(async (slug: string) => {
  if (!process.env.DATABASE_URL) return null;
  return db.news.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, summary: true, body: true, publishedAt: true, author: { select: { name: true } } },
  });
});
