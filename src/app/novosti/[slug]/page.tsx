import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ArrowUpRight } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { newsBySlug } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  return { title: news?.title || "Novost", description: news?.summary };
}

export default async function NewsDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await newsBySlug(slug);
  if (!news) notFound();
  return (
    <>
      <div className="page-banner"><div className="container-page">
        <Link href="/novosti" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16}/> Sve novosti</Link>
        <p className="eyebrow mb-4">Aktuelnosti katedre</p>
        <h1 className="page-title max-w-4xl">{news.title}</h1>
        <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-slate-500">{news.publishedAt && <span className="flex items-center gap-2"><CalendarDays size={16}/>{new Date(news.publishedAt).toLocaleDateString("sr-RS")}</span>}<span>{news.author.name}</span><ShareButton/></div>
      </div></div>
      <article className="container-page py-12 md:py-16"><div className="card-surface mx-auto max-w-4xl p-6 sm:p-9 md:p-13"><p className="mb-9 border-l-4 border-teal-500 pl-5 text-xl font-semibold leading-8 text-[#254b5d]">{news.summary}</p><div className="prose-copy text-[15px] leading-8 sm:text-[17px]">{news.body}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-7"><Link href="/novosti" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16}/> Sve novosti</Link><ShareButton/></div></div></article>
    </>
  );
}
