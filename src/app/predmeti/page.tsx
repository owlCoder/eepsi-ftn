import type { Metadata } from "next";
import Link from "next/link";
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
      <header className="page-banner compact-banner"><div className="container-page">
        <nav aria-label="Putanja" className="mb-2 text-xs text-[#556777]"><Link href="/" className="hover:underline">Početna</Link> / Predmeti</nav>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="page-title">Katalog predmeta</h1><p className="mt-1 text-sm text-[#556777]">Pretraga predmeta i nastavnih materijala. Prijava nije potrebna.</p></div>
          <Link href="/novosti" className="text-sm font-semibold text-[#173b63] underline">Obaveštenja</Link>
        </div>
      </div></header>
      <div className="container-page py-5 md:py-7">
        <form action="/predmeti" role="search" aria-label="Pretraga i filteri predmeta"
          className="grid items-end gap-3 rounded-lg border border-[#dce3e9] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_135px_135px_auto]">
          <div><label htmlFor="course-search" className="form-label">Naziv ili šifra predmeta</label><input id="course-search" name="q" type="search" className="input-field" maxLength={80} placeholder="Pretražite katalog" defaultValue={q}/></div>
          <div><label htmlFor="course-level" className="form-label">Nivo studija</label><select id="course-level" name="level" className="input-field" defaultValue={filters.level ?? ""}>
            <option value="">Svi nivoi</option><option value="OAS">OAS</option><option value="MAS">MAS</option><option value="DAS">DAS</option>
          </select></div>
          <div><label htmlFor="course-semester" className="form-label">Semestar</label><select id="course-semester" name="semester" className="input-field" defaultValue={filters.semester ? String(filters.semester) : ""}>
            <option value="">Svi semestri</option>{Array.from({ length: 8 }, (_, i) => <option key={i+1} value={i+1}>{i+1}. semestar</option>)}
          </select></div>
          <button type="submit" className="btn btn-primary">Prikaži</button>
        </form>

        <section aria-label="Rezultati pretrage" className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-lg font-bold">Predmeti</h2><p role="status" className="text-xs text-[#556777]">Prikazano {items.length} predmeta · strana {page}</p></div>
            {filtered && <Link href="/predmeti" className="text-sm font-semibold text-[#173b63] underline">Očisti filtere</Link>}
          </div>
          {items.length ? <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">{items.map(item => <CourseCard key={item.id} item={item}/>)}</div>
            : <div className="empty-state"><p>{page > 1 ? "Na ovoj stranici nema predmeta." : filtered ? "Nema predmeta koji odgovaraju filterima." : "Katalog još nema objavljenih predmeta."}</p>
              {filtered && <Link href="/predmeti" className="mt-3 inline-block font-semibold text-[#173b63] underline">Prikaži sve predmete</Link>}</div>}
          <nav className="mt-5 flex items-center justify-between gap-3" aria-label="Stranice">
            {page > 1 ? <Link href={pageHref(page-1)} className="btn btn-light">← Prethodna</Link> : <span/>}
            {hasNext && <Link href={pageHref(page+1)} className="btn btn-light">Sledeća →</Link>}
          </nav>
        </section>
      </div>
    </>
  );
}
