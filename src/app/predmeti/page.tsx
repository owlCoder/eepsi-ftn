import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "@/components/content-cards";
import { listCourses } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";
import { parseCourseFilters } from "@/domain/courses/filters";

export const revalidate = 300;
export const metadata: Metadata = { title: "Predmeti", description: "Pretraga predmeta i nastavnih materijala Katedre EEPSI na FTN-u." };

export default async function Courses({ searchParams }: { searchParams: Promise<{ q?: string; p?: string; level?: string; semester?: string }> }) {
  const { q: rawQ, p, level: rawLevel, semester: rawSemester } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const page = readPage(p);
  const filters = parseCourseFilters({ level: rawLevel, semester: rawSemester });
  const results = await listCourses(q, page, filters);
  const hasNext = results.length > 18;
  const items = results.slice(0, 18);
  const filtered = Boolean(q || filters.level || filters.semester);
  function pageHref(next: number) {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (filters.level) query.set("level", filters.level);
    if (filters.semester) query.set("semester", String(filters.semester));
    query.set("p", String(next));
    return "/predmeti?" + query.toString();
  }

  return (
    <>
      <header className="portal-page-hero">
        <div className="container-page">
          <nav aria-label="Putanja" className="breadcrumbs">
            <Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Predmeti</span>
          </nav>
          <p className="section-kicker !mb-2">NASTAVA / KATALOG</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1>Katalog predmeta</h1>
              <p>Pronađi predmet i otvori nastavne materijale. Bez prijave.</p>
            </div>
            <Link href="/novosti" className="section-action">Obaveštenja <ArrowRight size={18} aria-hidden="true"/></Link>
          </div>
        </div>
      </header>
      <div className="container-page py-7 md:py-11">
        <section className="filter-panel" aria-labelledby="course-filters-heading">
          <div className="mb-4 flex items-center gap-2.5">
            <SlidersHorizontal size={17} className="text-[#284cdb]" aria-hidden="true"/>
            <h2 id="course-filters-heading" className="text-[15px] font-extrabold">Pretraga i filteri</h2>
          </div>
          <form action="/predmeti" role="search"
            className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_140px_140px_auto]">
            <div>
              <label htmlFor="course-search" className="form-label">Naziv ili šifra predmeta</label>
              <input id="course-search" name="q" type="search" className="input-field" maxLength={80}
                placeholder="Upiši naziv ili šifru" defaultValue={q}/>
            </div>
            <div>
              <label htmlFor="course-level" className="form-label">Nivo studija</label>
              <select id="course-level" name="level" className="input-field" defaultValue={filters.level ?? ""}>
                <option value="">Svi nivoi</option><option value="OAS">OAS</option><option value="MAS">MAS</option><option value="DAS">DAS</option>
              </select>
            </div>
            <div>
              <label htmlFor="course-semester" className="form-label">Semestar</label>
              <select id="course-semester" name="semester" className="input-field" defaultValue={filters.semester ? String(filters.semester) : ""}>
                <option value="">Svi semestri</option>
                {Array.from({ length: 8 }, (_, i) => <option key={i+1} value={i+1}>{i+1}. semestar</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Prikaži</button>
          </form>
        </section>

        <section aria-label="Rezultati pretrage" className="mt-9">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Predmeti</h2>
              <p role="status" className="result-meta mt-1">Prikazano {items.length} predmeta · strana {page}</p>
            </div>
            {filtered && <Link href="/predmeti" className="section-action !min-h-10">Očisti sve filtere</Link>}
          </div>
          {items.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(item => <CourseCard key={item.id} item={item}/>)}
            </div>
          ) : (
            <div className="empty-state">
              <p>{page > 1 ? "Na ovoj stranici nema predmeta." : filtered ? "Nema predmeta koji odgovaraju filterima." : "Katalog još nema objavljenih predmeta."}</p>
              {filtered && <Link href="/predmeti" className="mt-3 inline-block font-semibold text-[#284cdb] underline">Prikaži sve predmete</Link>}
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
