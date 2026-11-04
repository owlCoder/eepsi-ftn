import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/content-cards";
import { listNews } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export const revalidate = 300;

export const metadata: Metadata = { title: "Novosti", description: "Najnovija obaveštenja i vesti sa Katedre EEPSI." };

export default async function News({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { q: rawQ, p } = await searchParams;
  const q = (rawQ || "").trim().slice(0,80);
  const page = readPage(p);
  const items = await listNews(q, page);
  return (
    <>
      <div className="page-banner"><div className="container-page"><p className="eyebrow mb-4">Budite u toku</p><h1 className="page-title">Novosti i obaveštenja</h1><p className="section-copy mt-5 max-w-2xl">Važne informacije o nastavi, projektima, događajima i radu katedre.</p></div></div>
      <div className="container-page py-14 md:py-20">
        <form className="mb-9 flex flex-wrap gap-3" role="search"><input name="q" className="input-field max-w-lg flex-1" type="search" aria-label="Pretraga novosti" placeholder="Pretraži novosti…" defaultValue={q}/><button className="btn btn-primary">Pretraži</button></form>
        {items.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <NewsCard key={item.id} item={item}/>)}</div>
          : <div className="empty-state">Nema objavljenih novosti za zadatu pretragu.</div>}
        <nav className="mt-10 flex items-center justify-between" aria-label="Stranice">
          {page > 1 ? <Link href={"/novosti?q=" + encodeURIComponent(q) + "&p=" + (page-1)} className="btn btn-light">← Prethodna</Link> : <span/>}
          {items.length === 12 && <Link href={"/novosti?q=" + encodeURIComponent(q) + "&p=" + (page+1)} className="btn btn-light">Sledeća →</Link>}
        </nav>
      </div>
    </>
  );
}
