import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/content-cards";
import { listNews } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export const revalidate = 300;

export const metadata: Metadata = { title: "Novosti", description: "Najnovija obaveštenja i vesti sa Katedre EEPSI." };

export default async function News({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { q: rawQ, p } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0,80);
  const page = readPage(p);
  const results = await listNews(q, page);
  const hasNext = results.length > 12;
  const items = results.slice(0, 12);
  return (
    <>
      <div className="page-banner"><div className="container-page"><p className="eyebrow mb-4">Budite u toku</p><h1 className="page-title">Novosti i obaveštenja</h1><p className="section-copy mt-5 max-w-2xl">Važne informacije o nastavi, projektima, događajima i radu katedre.</p></div></div>
      <div className="container-page py-14 md:py-20">
        <form className="card-surface mb-6 flex flex-wrap gap-3 p-4 sm:p-5" role="search">
          <label htmlFor="news-search" className="sr-only">Pretraga novosti</label>
          <input id="news-search" name="q" className="input-field min-w-48 flex-1" type="search" placeholder="Pretraži novosti po naslovu ili opisu…" defaultValue={q}/>
          <button className="btn btn-primary">Pretraži</button>
        </form>
        {q && <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-500">Rezultati za „{q}“</p>
          <Link href="/novosti" className="text-sm font-bold text-teal-700 underline">Očisti pretragu</Link>
        </div>}
        {items.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <NewsCard key={item.id} item={item}/>)}</div>
          : <div className="empty-state">
            <p className="mb-3 text-lg font-bold text-slate-700">Nema pronađenih novosti.</p>
            <p className="text-sm">Pokušajte sa drugim izrazom ili pogledajte sva obaveštenja.</p>
            {q && <Link href="/novosti" className="btn btn-light mt-5">Sve novosti</Link>}
          </div>}
        <nav className="mt-10 flex items-center justify-between" aria-label="Stranice">
          {page > 1 ? <Link href={"/novosti?q=" + encodeURIComponent(q) + "&p=" + (page-1)} className="btn btn-light">← Prethodna</Link> : <span/>}
          {hasNext && <Link href={"/novosti?q=" + encodeURIComponent(q) + "&p=" + (page+1)} className="btn btn-light">Sledeća →</Link>}
        </nav>
      </div>
    </>
  );
}
