import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export type NewsPreview = {
  id: string; slug: string; title: string; summary: string; publishedAt: Date | null;
};
export type CoursePreview = {
  id: string; slug: string; code: string; title: string; semester: number; studyLevel: string; description: string;
  _count?: { materials: number };
};

export function NewsCard({ item }: { item: NewsPreview }) {
  const date = item.publishedAt;
  return (
    <article>
      <Link href={"/novosti/" + item.slug} className="news-row group">
        <time className="news-date" dateTime={date?.toISOString()}>
          {date ? <>
            <strong>{date.toLocaleDateString("sr-RS", { day: "2-digit" })}</strong>
            <span>{date.toLocaleDateString("sr-RS", { month: "short", year: "numeric" })}</span>
          </> : <span>OBAVEŠTENJE</span>}
        </time>
        <div className="min-w-0">
          <h2>{item.title}</h2>
          <p className="line-clamp-2">{item.summary}</p>
        </div>
        <ArrowUpRight className="news-row-arrow" size={21} aria-hidden="true"/>
      </Link>
    </article>
  );
}

export function CourseCard({ item }: { item: CoursePreview }) {
  return (
    <article className="course-tile">
      <span className="course-tile-code">{item.code}</span>
      <h2><Link href={"/predmeti/" + item.slug}>{item.title}</Link></h2>
      <p className="course-tile-meta">{item.studyLevel} <span aria-hidden="true">·</span> {item.semester}. semestar</p>
      <div className="course-tile-footer !mt-6">
        <span>{item._count ? item._count.materials + " materijala" : "Nastavni materijali"}</span>
        <Link href={"/predmeti/" + item.slug + "#materijali"}>
          Materijali{item._count ? ` (${item._count.materials})` : ""} <ArrowRight size={17} aria-hidden="true"/>
        </Link>
      </div>
    </article>
  );
}
