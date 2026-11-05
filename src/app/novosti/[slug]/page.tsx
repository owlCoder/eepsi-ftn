import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { newsBySlug } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  return {
    title: news?.title || "Novost",
    description: news?.summary,
    ...(news ? { openGraph: { title: news.title, description: news.summary, type: "article" as const } } : {}),
  };
}

export default async function NewsDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  if (!news) notFound();
  return <>
    <header className="page-banner"><div className="container-page">
      <Link href="/novosti" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#8b371d]"><ArrowLeft size={16}/> Sve novosti</Link>
      <p className="eyebrow mb-5">Novosti / Katedra EEPSI</p>
      <h1 className="page-title max-w-5xl">{news.title}</h1>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#abb7b2] pt-5">
        {news.publishedAt && <time dateTime={new Date(news.publishedAt).toISOString()} className="meta-label">{new Date(news.publishedAt).toLocaleDateString("sr-RS")}</time>}
        <span className="meta-label">{news.author.name}</span>
        <ShareButton/>
      </div>
    </div></header>
    <article className="container-page py-13 md:py-19">
      <div className="mx-auto max-w-[820px]">
        <p className="display-serif border-l-[3px] border-[#b34b2c] pl-6 text-[clamp(22px,2.6vw,30px)] leading-[1.45] text-[#344a4e]">{news.summary}</p>
        <div className="prose-copy mt-12 border-t border-[#d3d6ce] pt-10">{news.body}</div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-[#abb7b2] pt-6">
          <Link href="/novosti" className="inline-flex items-center gap-2 text-sm font-bold text-[#8b371d]"><ArrowLeft size={16}/> Sve novosti</Link>
          <ShareButton/>
        </div>
      </div>
    </article>
  </>;
}
