import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
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
        <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-500">{news.publishedAt && <span className="flex items-center gap-2"><CalendarDays size={16}/>{new Date(news.publishedAt).toLocaleDateString("sr-RS")}</span>}<span>{news.author.name}</span></div>
      </div></div>
      <article className="container-page py-16"><div className="card-surface mx-auto max-w-4xl p-7 md:p-13"><p className="mb-9 border-l-4 border-teal-500 pl-5 text-xl font-semibold leading-8 text-[#254b5d]">{news.summary}</p><div className="prose-copy">{news.body}</div></div></article>
    </>
  );
}
