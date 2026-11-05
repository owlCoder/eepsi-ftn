import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
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
      <header className="portal-page-hero">
        <div className="container-page">
          <nav aria-label="Putanja" className="breadcrumbs">
            <Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Obaveštenja</span>
          </nav>
          <p className="section-kicker !mb-2">INFORMACIJE / AKTUELNO</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1>Obaveštenja</h1>
              <p>Najnovije informacije o nastavi, događajima i radu katedre — uvek na jednom mestu.</p>
            </div>
            <Link href="/predmeti" className="section-action">Katalog predmeta <ArrowRight size={18} aria-hidden="true"/></Link>
          </div>
        </div>
      </header>

      <div className="container-page py-7 md:py-11">
        <form action="/novosti" role="search" aria-label="Pretraga obaveštenja" className="filter-panel flex flex-wrap items-end gap-3">
          <div className="min-w-[175px] flex-1">
            <label htmlFor="news-search" className="form-label">Pretraga obaveštenja</label>
            <input id="news-search" name="q" type="search" maxLength={80} className="input-field"
              defaultValue={q} placeholder="Pretraži obaveštenja po naslovu ili opisu"/>
          </div>
          <button className="btn btn-primary" type="submit"><Search size={16} aria-hidden="true"/> Pretraži</button>
          {q && <Link href="/novosti" className="btn btn-light">Očisti</Link>}
        </form>

        <section aria-label="Lista obaveštenja" className="mt-9">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Sve objave</h2>
              <p role="status" className="result-meta mt-1">{q ? `Rezultati za „${q}“ · ` : ""}strana {page}</p>
            </div>
            {!q && <span className="result-meta">Najnovije prvo</span>}
          </div>
          {items.length ? (
            <div className="grid gap-3">{items.map(item => <NewsCard key={item.id} item={item}/>)}</div>
          ) : (
            <div className="empty-state">
              <p>{page > 1 ? "Na ovoj stranici nema obaveštenja." : q ? "Nema obaveštenja za zadatu pretragu." : "Trenutno nema objavljenih obaveštenja."}</p>
              {q && <Link href="/novosti" className="mt-3 inline-block font-semibold text-[#284cdb] underline">Prikaži sva obaveštenja</Link>}
            </div>
          )}
          <nav aria-label="Stranice" className="mt-7 flex items-center justify-between gap-3">
            {page > 1 ? <Link href={pageHref(page-1)} className="btn btn-light">← Prethodna</Link> : <span/>}
            {hasNext && <Link href={pageHref(page+1)} className="btn btn-light">Sledeća →</Link>}
          </nav>
        </section>
      </div>
    </>
  );
}
