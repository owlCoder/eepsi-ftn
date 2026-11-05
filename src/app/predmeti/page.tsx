import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
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
    <div className="container-page academic-inner-page">
      <nav aria-label="Putanja" className="breadcrumbs"><Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Predmeti</span></nav>
      <div className="academic-page-heading">
        <h1>Katalog predmeta</h1>
        <p>Pregled predmeta i nastavnih materijala. Pristup je slobodan, bez prijave.</p>
      </div>
      <form action="/predmeti" role="search" aria-label="Pretraga i filteri predmeta" className="academic-filters">
        <div>
          <label htmlFor="course-level" className="form-label">Nivo studija</label>
          <select id="course-level" name="level" className="input-field" defaultValue={filters.level ?? ""}>
            <option value="">Svi nivoi</option><option value="OAS">OAS</option><option value="MAS">MAS</option><option value="DAS">DAS</option>
          </select>
        </div>
        <div>
          <label htmlFor="course-semester" className="form-label">Semestar</label>
          <select id="course-semester" name="semester" className="input-field" defaultValue={filters.semester ? String(filters.semester) : ""}>
            <option value="">Svi semestri</option>{Array.from({ length: 8 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}. semestar</option>)}
          </select>
        </div>
        <div className="academic-filter-search">
          <label htmlFor="course-search" className="form-label">Naziv ili šifra predmeta</label>
          <div className="academic-search-field">
            <Search size={18} aria-hidden="true"/>
            <input id="course-search" name="q" type="search" maxLength={80} placeholder="Pretraži predmete…" defaultValue={q}/>
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Prikaži</button>
        {filtered && <Link href="/predmeti" className="academic-filter-clear">Očisti</Link>}
      </form>

      <section className="academic-results" aria-labelledby="catalog-heading">
        <div className="academic-results-heading">
          <h2 id="catalog-heading">Predmeti</h2>
          <p role="status">Prikazano {items.length} predmeta · strana {page}</p>
        </div>
        {items.length ? (
          <>
            <div className="academic-course-table-wrap">
              <table className="academic-course-table">
                <thead><tr>
                  <th scope="col">Šifra</th><th scope="col">Naziv predmeta</th><th scope="col">Nivo</th>
                  <th scope="col">Semestar</th><th scope="col">Materijali</th>
                </tr></thead>
                <tbody>{items.map(item => (
                  <tr key={item.id}>
                    <td><span className="academic-code">{item.code}</span></td>
                    <td><Link href={"/predmeti/" + item.slug} className="academic-course-name">{item.title}</Link></td>
                    <td>{item.studyLevel}</td>
                    <td>{item.semester}.</td>
                    <td><Link href={"/predmeti/" + item.slug + "#materijali"} className="academic-materials-link">
                      <FileText size={15} aria-hidden="true"/> Materijali{item._count ? ` (${item._count.materials})` : ""}
                    </Link></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="academic-course-mobile-list">
              {items.map(item => <CourseCard key={item.id} item={item}/>)}
            </div>
          </>
        ) : <div className="empty-state">
          <p>{page > 1 ? "Na ovoj stranici nema predmeta." : filtered ? "Nema predmeta koji odgovaraju filterima." : "Katalog još nema objavljenih predmeta."}</p>
          {filtered && <Link href="/predmeti" className="mt-3 inline-block font-semibold text-[var(--primary)] underline">Prikaži sve predmete</Link>}
        </div>}
        <nav aria-label="Stranice" className="academic-pagination">
          {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
          {hasNext && <Link href={pageHref(page + 1)} className="btn btn-light">Sledeća →</Link>}
        </nav>
      </section>
    </div>
  );
}
