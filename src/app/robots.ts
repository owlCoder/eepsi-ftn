import type { MetadataRoute } from "next";
import { publicSitemapPageCount } from "@/infrastructure/repositories/content";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
  const count = await publicSitemapPageCount();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/api/", "/prijava"] }],
    sitemap: Array.from({ length: count }, (_, id) => new URL(`/sitemap/${id}.xml`, origin).toString()),
  };
}
