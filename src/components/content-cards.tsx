import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, FileText } from "lucide-react";

export type NewsPreview = {
  id: string; slug: string; title: string; summary: string; publishedAt: Date | null;
};
export type CoursePreview = {
  id: string; slug: string; code: string; title: string; semester: number; studyLevel: string; description: string;
};

export function NewsCard({ item }: { item: NewsPreview }) {
  return (
    <article className="card-surface card-interactive h-full">
      <Link href={"/novosti/" + item.slug} className="news-card-link group">
        <div className="flex items-center justify-between gap-2">
          <span className="pill pill-blue"><CalendarDays size={12}/> {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("sr-RS") : "Novost"}</span>
          <ArrowUpRight size={20} className="text-slate-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-teal-700"/>
        </div>
        <h3>{item.title}</h3>
        <p className="line-clamp-3">{item.summary}</p>
        <div className="mt-8 text-sm font-bold text-teal-700">Pročitaj više <span aria-hidden>→</span></div>
      </Link>
    </article>
  );
}

export function CourseCard({ item }: { item: CoursePreview }) {
  return (
    <article className="card-surface card-interactive h-full">
      <Link href={"/predmeti/" + item.slug} className="course-card group">
        <div className="flex items-center justify-between gap-3">
          <span className="pill">{item.code}</span>
          <BookOpen size={21} className="text-teal-700"/>
        </div>
        <h3>{item.title}</h3>
        <p className="line-clamp-2">{item.description}</p>
        <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5 text-xs font-semibold text-slate-500">
          <span>{item.studyLevel} • {item.semester}. semestar</span>
          <span className="text-teal-700"><FileText size={18}/></span>
        </div>
      </Link>
    </article>
  );
}
