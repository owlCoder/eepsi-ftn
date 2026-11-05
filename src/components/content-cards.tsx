import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type NewsPreview = {
  id: string; slug: string; title: string; summary: string; publishedAt: Date | null;
};
export type CoursePreview = {
  id: string; slug: string; code: string; title: string; semester: number; studyLevel: string; description: string;
};

export function NewsCard({ item }: { item: NewsPreview }) {
  return <article className="card-surface card-interactive h-full">
    <Link href={"/novosti/" + item.slug} className="news-card-link group">
      <div className="flex items-center justify-between gap-2">
        <time className="meta-label" dateTime={item.publishedAt ? new Date(item.publishedAt).toISOString() : undefined}>
          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("sr-RS") : "Novost"}
        </time>
        <ArrowUpRight size={17} className="text-[#b34b2c] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true"/>
      </div>
      <h3>{item.title}</h3>
      <p className="line-clamp-3">{item.summary}</p>
      <div className="mt-auto flex items-center gap-2 pt-8 text-xs font-bold uppercase tracking-[.08em] text-[#8b371d]">
        Otvori novost <span aria-hidden="true">→</span>
      </div>
    </Link>
  </article>;
}

export function CourseCard({ item }: { item: CoursePreview }) {
  return <article className="card-surface card-interactive h-full">
    <Link href={"/predmeti/" + item.slug} className="course-card group">
      <div className="flex items-center justify-between gap-3">
        <span className="meta-label !text-[#8b371d]">{item.code}</span>
        <ArrowUpRight size={17} className="text-[#b34b2c] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true"/>
      </div>
      <h3>{item.title}</h3>
      <p className="line-clamp-3">{item.description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#d3d6ce] pt-5 text-xs font-semibold text-[#5a6b6d]">
        <span>{item.studyLevel} <span className="mx-2 text-[#9baca4]">/</span> {item.semester}. semestar</span>
        <span className="text-[#8b371d]">Detalji →</span>
      </div>
    </Link>
  </article>;
}
