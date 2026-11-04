import type { MetadataRoute } from "next";
import { publicSitemapSlugs } from "@/infrastructure/repositories/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
  const { courses, news } = await publicSitemapSlugs();
  return [
    { url: new URL("/", origin).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/o-katedri", origin).toString(), changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/predmeti", origin).toString(), changeFrequency: "weekly", priority: 0.9 },
    { url: new URL("/nastavnici", origin).toString(), changeFrequency: "weekly", priority: 0.7 },
    { url: new URL("/novosti", origin).toString(), changeFrequency: "daily", priority: 0.8 },
    ...courses.map(({ slug }) => ({
      url: new URL("/predmeti/" + encodeURIComponent(slug), origin).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...news.map(({ slug }) => ({
      url: new URL("/novosti/" + encodeURIComponent(slug), origin).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
