import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/content-cards";
import { listCourses } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";
import { parseCourseFilters } from "@/domain/courses/filters";

export const revalidate = 300;

export const metadata: Metadata = { title: "Predmeti", description: "Pregled predmeta Katedre EEPSI na FTN-u." };

export default async function Courses({ searchParams }: { searchParams: Promise<{ q?: string; p?: string; level?: string; semester?: string }> }) {
  const { q: rawQ, p, level: rawLevel, semester: rawSemester } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const page = readPage(p);
  const filters = parseCourseFilters({ level: rawLevel, semester: rawSemester });
  const results = await listCourses(q, page, filters);
  const hasNext = results.length > 18;
  const items = results.slice(0, 18);
  const filtered = Boolean(q || filters.level || filters.semester);
  function pageHref(nextPage: number) {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (filters.level) query.set("level", filters.level);
    if (filters.semester) query.set("semester", String(filters.semester));
    query.set("p", String(nextPage));
    return "/predmeti?" + query.toString();
  }
  return (
    <>
      <div className="page-banner"><div className="container-page"><p className="eyebrow mb-4">Studijski program</p><h1 className="page-title">Katalog predmeta</h1><p className="section-copy mt-5 max-w-2xl">Svi predmeti, osnovne informacije, nastavno osoblje i dostupni materijali.</p></div></div>
      <div className="container-page py-14 md:py-20">
        <form className="card-surface mb-9 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_170px_160px_auto]" role="search">
          <div>
            <label htmlFor="course-search" className="form-label">Pretraga</label>
            <input id="course-search" className="input-field" name="q" type="search" placeholder="Naziv ili šifra predmeta…" defaultValue={q}/>
          </div>
          <div>
            <label htmlFor="course-level" className="form-label">Nivo studija</label>
            <select id="course-level" name="level" className="input-field" defaultValue={filters.level ?? ""}>
              <option value="">Svi nivoi</option>
              <option value="OAS">OAS</option>
              <option value="MAS">MAS</option>
              <option value="DAS">DAS</option>
            </select>
          </div>
          <div>
            <label htmlFor="course-semester" className="form-label">Semestar</label>
            <select id="course-semester" name="semester" className="input-field" defaultValue={filters.semester ? String(filters.semester) : ""}>
              <option value="">Svi semestri</option>
              {Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}. semestar</option>)}
            </select>
          </div>
          <div className="flex items-end"><button className="btn btn-primary w-full" type="submit">Prikaži</button></div>
        </form>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-500">Prikazano predmeta na ovoj strani: {items.length}</p>
          {filtered && <Link href="/predmeti" className="text-sm font-bold text-teal-700 underline">Očisti sve filtere</Link>}
        </div>
        {items.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <CourseCard key={item.id} item={item}/>)}</div>
          : <div className="empty-state">{page > 1 ? "Nema predmeta na ovoj stranici. Vratite se na prethodnu stranicu." : "Nema predmeta za zadatu pretragu."} {filtered && <Link href="/predmeti" className="font-bold text-teal-700 underline">Obriši filtere</Link>}</div>}
        <nav className="mt-10 flex items-center justify-between" aria-label="Stranice">
          {page > 1 ? <Link className="btn btn-light" href={pageHref(page - 1)}>← Prethodna</Link> : <span/>}
          {hasNext && <Link className="btn btn-light" href={pageHref(page + 1)}>Sledeća →</Link>}
        </nav>
      </div>
    </>
  );
}
