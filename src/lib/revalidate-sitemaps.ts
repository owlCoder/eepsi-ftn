import { revalidatePath } from "next/cache";
import { publicSitemapPageCount } from "@/infrastructure/repositories/content";

// A deletion shifts later offset-based sitemap pages, so refreshing only
// segment zero can leave stale URLs in other segments for up to an hour.
export async function revalidatePublicSitemaps() {
  const count = await publicSitemapPageCount();
  for (let id = 0; id < count; id++) {
    revalidatePath(`/sitemap/${id}.xml`);
  }
  revalidatePath("/robots.txt");
}
