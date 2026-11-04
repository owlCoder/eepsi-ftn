import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/content-cards";
import { listCourses } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export const metadata: Metadata = { title: "Predmeti", description: "Pregled predmeta Katedre EEPSI na FTN-u." };

export default async function Courses({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { q: rawQ, p } = await searchParams;
  const q = (rawQ || "").trim().slice(0, 80);
  const page = readPage(p);
  const items = await listCourses(q, page);
  return (
    <>
      <div className="page-banner"><div className="container-page"><p className="eyebrow mb-4">Studijski program</p><h1 className="page-title">Katalog predmeta</h1><p className="section-copy mt-5 max-w-2xl">Svi predmeti, osnovne informacije, nastavno osoblje i dostupni materijali.</p></div></div>
      <div className="container-page py-14 md:py-20">
        <form className="mb-9 flex flex-wrap gap-3" role="search">
          <input className="input-field max-w-lg flex-1" name="q" type="search" aria-label="Pretraga predmeta" placeholder="Pretraži po nazivu ili šifri predmeta…" defaultValue={q}/>
          <button className="btn btn-primary" type="submit">Pretraži</button>
        </form>
        {items.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <CourseCard key={item.id} item={item}/>)}</div>
          : <div className="empty-state">Nema predmeta za zadatu pretragu. {q && <Link href="/predmeti" className="font-bold text-teal-700 underline">Obriši filter</Link>}</div>}
        <nav className="mt-10 flex items-center justify-between" aria-label="Stranice">
          {page > 1 ? <Link className="btn btn-light" href={"/predmeti?q=" + encodeURIComponent(q) + "&p=" + (page-1)}>← Prethodna</Link> : <span/>}
          {items.length === 18 && <Link className="btn btn-light" href={"/predmeti?q=" + encodeURIComponent(q) + "&p=" + (page+1)}>Sledeća →</Link>}
        </nav>
      </div>
    </>
  );
}
