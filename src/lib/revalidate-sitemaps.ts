import { revalidatePath } from "next/cache";
import { publicSitemapPageCount } from "@/infrastructure/repositories/content";

// A deletion shifts later offset-based sitemap pages. Invalidate one extra
// segment because removing the last record on a page boundary can shrink the
// count, leaving the former final segment cached.
export async function revalidatePublicSitemaps() {
  const count = await publicSitemapPageCount();
  for (let id = 0; id <= count; id++) {
    revalidatePath(`/sitemap/${id}.xml`);
  }
  revalidatePath("/robots.txt");
}
