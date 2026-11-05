import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      <header className="page-banner"><div className="container-page">
        <nav aria-label="Putanja" className="mb-5 text-xs text-[#556777]">
          <Link href="/" className="hover:underline">Početna</Link> / <Link href="/novosti" className="hover:underline">Obaveštenja</Link> / Objava
        </nav>
        <p className="eyebrow mb-3">Obaveštenje katedre</p>
        <h1 className="page-title max-w-4xl">{news.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#556777]">
          {news.publishedAt && <time dateTime={news.publishedAt.toISOString()}>{news.publishedAt.toLocaleDateString("sr-RS")}</time>}
          <span>{news.author.name}</span>
          <ShareButton/>
        </div>
      </div></header>
      <article className="container-page py-11 md:py-15">
        <div className="mx-auto max-w-[760px]">
          <p className="mb-9 text-lg font-semibold leading-8 text-[#344b5e]">{news.summary}</p>
          <div className="prose-copy border-t border-[#dce3e9] pt-8">{news.body}</div>
          <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-[#dce3e9] pt-5">
            <Link href="/novosti" className="text-sm font-semibold text-[#173b63] underline">← Sva obaveštenja</Link>
            <ShareButton/>
          </div>
        </div>
      </article>
    </>
  );
}
