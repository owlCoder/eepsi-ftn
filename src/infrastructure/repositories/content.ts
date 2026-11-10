import "server-only";
import { cache } from "react";
import { db } from "@/infrastructure/db/prisma";
import type { CourseFilters } from "@/domain/courses/filters";

export async function publicTeachingStaff(q = "", page = 1) {
  if (!process.env.DATABASE_URL) return [];
  return db.user.findMany({
    where: {
      active: true,
      role: { in: ["PROFESSOR", "ASSISTANT"] },
      memberships: { some: {} },
      ...(q ? { OR: [
        { name: { contains: q } },
        { memberships: { some: { course: { OR: [
          { title: { contains: q } }, { code: { contains: q } },
        ] } } } },
      ] } : {}),
    },
    select: {
      id: true,
      name: true,
      role: true,
      memberships: {
        select: {
          course: { select: { slug: true, title: true } },
        },
        orderBy: [{ course: { title: "asc" } }, { courseId: "asc" }],

      },
    },
    orderBy: [{ name: "asc" }, { id: "asc" }],
    skip: (page - 1) * 20,
    take: 21,
  });
}

export async function featuredCourses(limit = 3) {
  if (!process.env.DATABASE_URL) return [];
  return db.course.findMany({
    select: { id: true, title: true, slug: true, code: true, semester: true, studyLevel: true },
    orderBy: [{ semester: "asc" }, { title: "asc" }, { id: "asc" }],
    take: Math.max(1, Math.min(limit, 6)),
  });
}

export async function publicSitemapSlugs() {
  if (!process.env.DATABASE_URL) return { courses: [] as { slug: string }[], news: [] as { slug: string; updatedAt: Date }[] };

  // Use ID keyset bounds rather than cursor references: if an administrator
  // deletes the last item of a batch, subsequent sitemap queries still work.
  // Leave room for static URLs under the 50,000-URL protocol limit.
  const pageSize = 1000;
  const maxPerType = 24000;
  const courses: { slug: string }[] = [];
  const news: { slug: string; updatedAt: Date }[] = [];
  let courseCursor: string | undefined;
  let newsCursor: string | undefined;

  while (courses.length < maxPerType) {
    const batch = await db.course.findMany({
      select: { id: true, slug: true },
      ...(courseCursor ? { where: { id: { gt: courseCursor } } } : {}),
      orderBy: { id: "asc" },
      take: Math.min(pageSize, maxPerType - courses.length),
    });
    courses.push(...batch.map(({ slug }) => ({ slug })));
    if (batch.length < pageSize) break;
    courseCursor = batch[batch.length - 1].id;
  }

  while (news.length < maxPerType) {
    const batch = await db.news.findMany({
      where: { status: "PUBLISHED", ...(newsCursor ? { id: { gt: newsCursor } } : {}) },
      select: { id: true, slug: true, updatedAt: true },
      orderBy: { id: "asc" },
      take: Math.min(pageSize, maxPerType - news.length),
    });
    news.push(...batch.map(({ slug, updatedAt }) => ({ slug, updatedAt })));
    if (batch.length < pageSize) break;
    newsCursor = batch[batch.length - 1].id;
  }

  return { courses, news };
}

export async function latestNews(limit = 4) {
  if (!process.env.DATABASE_URL) return [];
  return db.news.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true, summary: true, publishedAt: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: Math.min(limit, 20),
  });
}

export async function listNews(q: string, page: number) {
  if (!process.env.DATABASE_URL) return [];
  return db.news.findMany({
    where: { status: "PUBLISHED", ...(q ? { OR: [{ title: { contains: q } }, { summary: { contains: q } }] } : {}) },
    select: { id: true, slug: true, title: true, summary: true, publishedAt: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * 12,
    take: 13,
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
    select: { id: true, title: true, slug: true, code: true, semester: true, studyLevel: true, _count: { select: { materials: true } } },
    orderBy: [{ semester: "asc" }, { title: "asc" }, { id: "asc" }],
    skip: (page - 1) * 18,
    take: 19,
  });
}

export const courseBySlug = cache(async (slug: string) => {
  if (!process.env.DATABASE_URL) return null;
  return db.course.findUnique({
    where: { slug },
    select: {
      title: true,
      code: true,
      description: true,
      semester: true,
      studyLevel: true,
      materials: {
        select: { id: true, title: true, url: true, kind: true },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      },
      memberships: {
        where: { user: { active: true } },
        select: { role: true, user: { select: { id: true, name: true } } },
        orderBy: [{ role: "desc" }, { user: { name: "asc" } }, { userId: "asc" }],
      },
    },
  });
});

export const newsBySlug = cache(async (slug: string) => {
  if (!process.env.DATABASE_URL) return null;
  return db.news.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, summary: true, body: true, publishedAt: true, updatedAt: true, author: { select: { name: true } } },
  });
});
