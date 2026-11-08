import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { newsBySlug } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  return {
    title: news?.title || "Obaveštenje",
    alternates: { canonical: "/novosti/" + encodeURIComponent(slug) },
    ...(!news ? { robots: { index: false, follow: false } } : {}),
    description: news?.summary,
    ...(news ? { openGraph: { title: news.title, description: news.summary, type: "article" as const, ...(news.publishedAt ? { publishedTime: news.publishedAt.toISOString() } : {}) } } : {}),
  };
}

export default async function NewsDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  if (!news) notFound();

  return (
    <div className="container-page academic-inner-page">
      <nav aria-label="Putanja" className="breadcrumbs">
        <Link href="/">Početna</Link><span aria-hidden="true">/</span>
        <Link href="/novosti">Obaveštenja</Link><span aria-hidden="true">/</span><span>Objava</span>
      </nav>
      <article className="academic-article">
        <header className="academic-article-heading">
          <p className="eyebrow">Obaveštenje katedre</p>
          <h1>{news.title}</h1>
          <div className="academic-article-meta">
            {news.publishedAt && <time dateTime={news.publishedAt.toISOString()}><CalendarDays size={16} aria-hidden="true"/> {news.publishedAt.toLocaleDateString("sr-RS")}</time>}
            <span><UserRound size={16} aria-hidden="true"/> {news.author.name}</span>
            <ShareButton/>
          </div>
        </header>
        <div className="academic-article-body">
          <p className="academic-article-summary">{news.summary}</p>
          <div className="prose-copy">{news.body}</div>
        </div>
        <footer className="academic-article-bottom">
          <Link href="/novosti" className="academic-text-link">← Sva obaveštenja</Link>
          <ShareButton/>
        </footer>
      </article>
    </div>
  );
}
