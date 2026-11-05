import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type NewsPreview = {
  id: string; slug: string; title: string; summary: string; publishedAt: Date | null;
};
export type CoursePreview = {
  id: string; slug: string; code: string; title: string; semester: number; studyLevel: string; description: string;
  _count?: { materials: number };
};

export function NewsCard({ item }: { item: NewsPreview }) {
  return (
    <article className="border-b border-[#dce3e9] last:border-b-0">
      <Link href={"/novosti/" + item.slug} className="group grid gap-1.5 px-4 py-3.5 hover:bg-[#f1f5f9] sm:grid-cols-[104px_minmax(0,1fr)_20px] sm:gap-4">
        <time className="text-xs font-semibold text-[#556777]" dateTime={item.publishedAt?.toISOString()}>{item.publishedAt ? item.publishedAt.toLocaleDateString("sr-RS") : "Obaveštenje"}</time>
        <div className="min-w-0">
          <h2 className="text-base font-bold leading-snug text-[#173b63] group-hover:underline">{item.title}</h2>
          <p className="mt-1 line-clamp-1 text-sm text-[#556777]">{item.summary}</p>
        </div>
        <ArrowRight size={16} className="hidden text-[#173b63] sm:block" aria-hidden="true"/>
      </Link>
    </article>
  );
}

export function CourseCard({ item }: { item: CoursePreview }) {
  return (
    <article className="grid items-center gap-2 border-b border-[#dce3e9] px-4 py-3.5 last:border-b-0 hover:bg-[#f1f5f9] sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold text-[#556777]">{item.code} · {item.studyLevel} · {item.semester}. semestar</p>
        <h2 className="text-base font-bold leading-snug">
          <Link href={"/predmeti/" + item.slug} className="text-[#173b63] underline-offset-4 hover:underline">{item.title}</Link>
        </h2>
      </div>
      <Link href={"/predmeti/" + item.slug + "#materijali"} className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#173b63] underline sm:shrink-0">
        Materijali{item._count ? ` (${item._count.materials})` : ""} <ArrowRight size={15} aria-hidden="true"/>
      </Link>
    </article>
  );
}
