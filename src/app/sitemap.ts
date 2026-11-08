import type { MetadataRoute } from "next";
import { publicSitemapSlugs } from "@/infrastructure/repositories/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
  const { courses, news } = await publicSitemapSlugs();
  return [
    { url: new URL("/", origin).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/o-katedri", origin).toString(), changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/kontakt", origin).toString(), changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/predmeti", origin).toString(), changeFrequency: "weekly", priority: 0.9 },
    { url: new URL("/istrazivanje", origin).toString(), changeFrequency: "monthly", priority: 0.6 },
    { url: new URL("/saradnja", origin).toString(), changeFrequency: "monthly", priority: 0.6 },
    { url: new URL("/laboratorija", origin).toString(), changeFrequency: "monthly", priority: 0.6 },
    { url: new URL("/nastavnici", origin).toString(), changeFrequency: "weekly", priority: 0.7 },
    { url: new URL("/novosti", origin).toString(), changeFrequency: "daily", priority: 0.8 },
    ...courses.map(({ slug, updatedAt }) => ({
      url: new URL("/predmeti/" + encodeURIComponent(slug), origin).toString(),
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...news.map(({ slug, updatedAt }) => ({
      url: new URL("/novosti/" + encodeURIComponent(slug), origin).toString(),
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
