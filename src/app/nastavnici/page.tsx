import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { publicTeachingStaff } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }): Promise<Metadata> {
  const { q, p } = await searchParams;
  const hasListingParams = q !== undefined || p !== undefined;
  return {
    title: "Nastavno osoblje",
    description: "Nastavnici i saradnici angažovani na predmetima Katedre EEPSI.",
    ...(hasListingParams ? { robots: { index: false, follow: true } } : {}),
  };
}
export const revalidate = 300;

export default async function TeachingStaffPage({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { q: rawQ, p } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const page = readPage(p);
  const results = await publicTeachingStaff(q, page);
  const hasNext = results.length > 20;
  const staff = results.slice(0, 20);
  const pageHref = (next: number) => "/nastavnici?" + new URLSearchParams({ ...(q ? { q } : {}), p: String(next) }).toString();
  const groups = [
    { heading: "Nastavnici", role: "PROFESSOR", entries: staff.filter(person => person.role === "PROFESSOR") },
    { heading: "Saradnici", role: "ASSISTANT", entries: staff.filter(person => person.role === "ASSISTANT") },
  ];

  return (
    <div className="container-page academic-inner-page">
      <nav aria-label="Putanja" className="breadcrumbs">
        <Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Nastavno osoblje</span>
      </nav>
      <header className="academic-page-heading">
        <h1>Nastavno osoblje</h1>
        <p>Nastavnici i saradnici angažovani na predmetima katedre.</p>
      </header>
      <form action="/nastavnici" role="search" aria-label="Pretraga nastavnog osoblja" className="academic-filters academic-news-filters">
        <div className="academic-filter-search">
          <label htmlFor="teacher-search" className="form-label">Ime nastavnika ili naziv predmeta</label>
          <div className="academic-search-field">
            <Search size={18} aria-hidden="true"/>
            <input id="teacher-search" name="q" type="search" maxLength={80} defaultValue={q}
              placeholder="Pretraži ime, predmet ili šifru"/>
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Pretraži</button>
        {q && <Link href="/nastavnici" className="academic-filter-clear">Očisti</Link>}
      </form>
      {q && <p role="status" className="result-meta mb-5">Rezultati za „{q}“ · strana {page}</p>}
      {staff.length ? (
        <div className="academic-directory">
          {groups.filter(group => group.entries.length > 0).map(group => (
            <section key={group.role} aria-labelledby={"group-" + group.role} className="academic-directory-section">
              <div className="academic-results-heading">
                <h2 id={"group-" + group.role}>{group.heading}</h2>
                <p>{group.entries.length} na ovoj strani</p>
              </div>
              <div className="academic-directory-list">
                {group.entries.map(person => (
                  <article key={person.id} className="academic-directory-person">
                    <div className="academic-directory-identity">
                      <h3>{person.name}</h3>
                      <p>{person.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</p>
                    </div>
                    <div className="academic-directory-courses">
                      <h4>Angažovan na predmetima</h4>
                      <ul>
                        {person.memberships.map(entry => (
                          <li key={entry.course.slug}>
                            <Link href={"/predmeti/" + entry.course.slug}>
                              <span>{entry.course.title}</span><ArrowRight size={16} aria-hidden="true"/>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : <div className="empty-state mt-8">
        <p>{page > 1 ? "Na ovoj stranici nema rezultata." : q ? "Nema nastavnog osoblja za zadatu pretragu." : "Nastavno osoblje još nije objavljeno."}</p>
        {q && <Link href="/nastavnici" className="academic-text-link mt-3">Prikaži kompletan tim</Link>}
      </div>}
      <nav className="academic-pagination" aria-label="Stranice nastavnog tima">
        {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {hasNext && <Link href={pageHref(page + 1)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
  );
}
