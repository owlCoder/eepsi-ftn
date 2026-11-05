import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { newsBySlug } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  return {
    title: news?.title || "Obaveštenje",
    ...(!news ? { robots: { index: false, follow: false } } : {}),
    description: news?.summary,
    ...(news ? { openGraph: { title: news.title, description: news.summary, type: "article" as const } } : {}),
  };
}

export default async function NewsDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  if (!news) notFound();

  return (
    <>
      <header className="portal-page-hero">
        <div className="container-page">
          <nav aria-label="Putanja" className="breadcrumbs">
            <Link href="/">Početna</Link><span aria-hidden="true">/</span>
            <Link href="/novosti">Obaveštenja</Link><span aria-hidden="true">/</span><span>Objava</span>
          </nav>
          <p className="section-kicker !mb-3">OBAVEŠTENJE / EEPSI</p>
          <h1 className="!max-w-[950px]">{news.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[#60718c]">
            {news.publishedAt && <time dateTime={news.publishedAt.toISOString()} className="inline-flex items-center gap-2">
              <CalendarDays size={16} aria-hidden="true"/> {news.publishedAt.toLocaleDateString("sr-RS")}
            </time>}
            <span className="inline-flex items-center gap-2"><UserRound size={16} aria-hidden="true"/> {news.author.name}</span>
            <ShareButton/>
          </div>
        </div>
      </header>
      <article className="container-page py-9 md:py-14">
        <div className="mx-auto max-w-[860px]">
          <div className="detail-panel !p-0">
            <div className="border-b border-[#e4e8f0] px-6 py-7 md:px-12 md:py-10">
              <p className="text-lg font-semibold leading-relaxed text-[#30405b] md:text-xl">{news.summary}</p>
            </div>
            <div className="prose-copy px-6 py-8 md:px-12 md:py-11">{news.body}</div>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <Link href="/novosti" className="section-action"><ArrowLeft size={17} aria-hidden="true"/> Sva obaveštenja</Link>
            <ShareButton/>
          </div>
        </div>
      </article>
    </>
  );
}
