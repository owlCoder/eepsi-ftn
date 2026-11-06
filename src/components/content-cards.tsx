import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export type NewsPreview = {
  id: string; slug: string; title: string; summary: string; publishedAt: Date | null;
};
export type CoursePreview = {
  id: string; slug: string; code: string; title: string; semester: number; studyLevel: string; description?: string;
  _count?: { materials: number };
};

export function NewsCard({ item }: { item: NewsPreview }) {
  const date = item.publishedAt;
  return (
    <article className="academic-news-entry">
      <Link href={"/novosti/" + item.slug} className="academic-news-link">
        <time dateTime={date?.toISOString()} className="academic-date">
          {date ? <>
            <strong>{date.toLocaleDateString("sr-RS", { day: "2-digit" })}</strong>
            <span>{date.toLocaleDateString("sr-RS", { month: "short" })}</span>
          </> : <span>Novost</span>}
        </time>
        <div className="academic-news-copy">
          <h3 className="academic-news-title">{item.title}</h3>
          <p className="academic-news-summary">{item.summary}</p>
        </div>
        <ArrowRight size={17} aria-hidden="true" className="academic-list-arrow"/>
      </Link>
    </article>
  );
}

export function FeaturedCourseRow({ item }: { item: CoursePreview }) {
  return (
    <li className="academic-featured-row">
      <span className="academic-code">{item.code}</span>
      <Link href={"/predmeti/" + item.slug} className="academic-featured-title">{item.title}</Link>
      <Link href={"/predmeti/" + item.slug + "#materijali"}
        className="academic-featured-materials" aria-label={"Materijali predmeta " + item.title}>
        <FileText size={16} aria-hidden="true"/><span className="hidden sm:inline">Materijali</span>
      </Link>
    </li>
  );
}

export function CourseCard({ item }: { item: CoursePreview }) {
  return (
    <article className="academic-mobile-course">
      <div>
        <span className="academic-code">{item.code}</span>
        <Link href={"/predmeti/" + item.slug} className="academic-course-name">{item.title}</Link>
        <p>{item.studyLevel} · {item.semester}. semestar</p>
      </div>
      <Link href={"/predmeti/" + item.slug + "#materijali"} className="academic-materials-link">
        <FileText size={15} aria-hidden="true"/> Materijali{item._count ? ` (${item._count.materials})` : ""}
      </Link>
    </article>
  );
}
