import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { NewsCard } from "@/components/content-cards";
import { listNews } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export const revalidate = 300;
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }): Promise<Metadata> {
  // Any query string creates an alternate URL for this listing, including
  // unknown tracking parameters that do not change its content.
  const hasListingParams = Object.keys(await searchParams).length > 0;
  return {
    title: "Obaveštenja",
    description: "Obaveštenja i vesti Katedre EEPSI na Fakultetu tehničkih nauka.",
    ...(hasListingParams ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function News({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { q: rawQ, p } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const page = readPage(p);
  const results = await listNews(q, page);
  const hasNext = results.length > 12;
  const items = results.slice(0, 12);
  const pageHref = (next: number) => "/novosti?" + new URLSearchParams({ ...(q ? { q } : {}), p: String(next) }).toString();

  return (
    <div className="container-page academic-inner-page">
      <nav aria-label="Putanja" className="breadcrumbs"><Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Obaveštenja</span></nav>
      <div className="academic-page-heading">
        <h1>Obaveštenja</h1>
        <p>Aktuelne informacije o nastavi, predmetima i radu katedre.</p>
      </div>
      <form action="/novosti" role="search" aria-label="Pretraga obaveštenja" className="academic-filters academic-news-filters">
        <div className="academic-filter-search">
          <label htmlFor="news-search" className="form-label">Pretraga obaveštenja</label>
          <div className="academic-search-field">
            <Search size={18} aria-hidden="true"/>
            <input id="news-search" name="q" type="search" maxLength={80} placeholder="Pretraži naslov ili opis…" defaultValue={q}/>
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Pretraži</button>
        {q && <Link href="/novosti" className="academic-filter-clear">Očisti</Link>}
      </form>

      <section className="academic-results" aria-label="Lista obaveštenja">
        <div className="academic-results-heading">
          <h2>Objavljena obaveštenja</h2>
          <p role="status">{q ? `Rezultati za „${q}“ · ` : ""}strana {page}</p>
        </div>
        {items.length ? <div className="academic-news-list academic-news-archive">
          {items.map(item => <NewsCard key={item.id} item={item}/>)}
        </div> : <div className="empty-state">
          <p>{page > 1 ? "Na ovoj stranici nema obaveštenja." : q ? "Nema obaveštenja za zadatu pretragu." : "Trenutno nema objavljenih obaveštenja."}</p>
          {q && <Link href="/novosti" className="mt-3 inline-block font-semibold text-[var(--primary)] underline">Prikaži sva obaveštenja</Link>}
        </div>}
        <nav className="academic-pagination" aria-label="Stranice">
          {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
          {hasNext && <Link href={pageHref(page + 1)} className="btn btn-light">Sledeća →</Link>}
        </nav>
      </section>
    </div>
  );
}
