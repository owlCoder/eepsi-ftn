import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/content-cards";
import { listNews } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export const revalidate = 300;
export const metadata: Metadata = { title: "Obaveštenja", description: "Obaveštenja i vesti Katedre EEPSI na Fakultetu tehničkih nauka." };

export default async function News({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { q: rawQ, p } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const page = readPage(p);
  const results = await listNews(q, page);
  const hasNext = results.length > 12;
  const items = results.slice(0, 12);
  const pageHref = (next: number) => "/novosti?" + new URLSearchParams({ ...(q ? { q } : {}), p: String(next) }).toString();
  return (
    <>
      <header className="page-banner"><div className="container-page">
        <nav aria-label="Putanja" className="mb-4 text-xs text-[#556777]"><Link href="/" className="hover:underline">Početna</Link> / Obaveštenja</nav>
        <h1 className="page-title">Obaveštenja</h1>
        <p className="section-copy mt-3 max-w-2xl">Najnovije objave i informacije o nastavi, događajima i aktivnostima katedre, poređane od najnovijih.</p>
      </div></header>
      <div className="container-page py-9 md:py-12">
        <form action="/novosti" role="search" className="flex flex-wrap items-end gap-3 rounded-lg border border-[#dce3e9] bg-white p-5">
          <div className="min-w-[200px] flex-1"><label htmlFor="news-search" className="form-label">Pretraga obaveštenja</label>
            <input id="news-search" name="q" type="search" maxLength={80} className="input-field" placeholder="Naslov ili opis obaveštenja" defaultValue={q}/>
          </div>
          <button className="btn btn-primary" type="submit">Pretraži</button>
          {q && <Link href="/novosti" className="btn btn-light">Očisti</Link>}
        </form>
        <section className="mt-9" aria-label="Lista obaveštenja">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl font-bold">Objavljena obaveštenja</h2>
            <p role="status" className="text-sm text-[#556777]">{q ? `Rezultati za „${q}“ · ` : ""}strana {page}</p>
          </div>
          {items.length ? <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">{items.map(item => <NewsCard key={item.id} item={item}/>)}</div>
            : <div className="empty-state"><p>{page > 1 ? "Na ovoj stranici nema obaveštenja." : q ? "Nema obaveštenja za zadatu pretragu." : "Trenutno nema objavljenih obaveštenja."}</p>
              {q && <Link href="/novosti" className="mt-3 inline-block font-semibold text-[#173b63] underline">Prikaži sva obaveštenja</Link>}</div>}
          <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Stranice">
            {page > 1 ? <Link href={pageHref(page-1)} className="btn btn-light">← Prethodna</Link> : <span/>}
            {hasNext && <Link href={pageHref(page+1)} className="btn btn-light">Sledeća →</Link>}
          </nav>
        </section>
      </div>
    </>
  );
}
