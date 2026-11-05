import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { publicTeachingStaff } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export const metadata: Metadata = { title: "Nastavno osoblje", description: "Nastavnici i saradnici angažovani na predmetima Katedre EEPSI." };
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
    <>
      <header className="portal-page-hero">
        <div className="container-page">
          <nav aria-label="Putanja" className="breadcrumbs">
            <Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Nastavno osoblje</span>
          </nav>
          <p className="section-kicker !mb-2">KATEDRA / LJUDI</p>
          <h1>Nastavno osoblje</h1>
          <p>Nastavnici i saradnici, sa predmetima na kojima su angažovani.</p>
        </div>
      </header>
      <div className="container-page py-7 md:py-11">
        <form action="/nastavnici" role="search" aria-label="Pretraga nastavnog osoblja" className="filter-panel flex flex-wrap items-end gap-3">
          <div className="min-w-[170px] flex-1">
            <label htmlFor="teacher-search" className="form-label">Ime nastavnika ili naziv predmeta</label>
            <input id="teacher-search" name="q" type="search" maxLength={80} defaultValue={q}
              className="input-field" placeholder="Pretraži ime, predmet ili šifru"/>
          </div>
          <button className="btn btn-primary" type="submit"><Search size={16} aria-hidden="true"/> Pretraži</button>
          {q && <Link href="/nastavnici" className="btn btn-light">Očisti</Link>}
        </form>
        {q && <p role="status" className="result-meta mt-4">Rezultati za „{q}“ · strana {page}</p>}
        {staff.length ? (
          <div className="mt-10 space-y-11">
            {groups.filter(group => group.entries.length > 0).map(group => (
              <section key={group.role} aria-labelledby={"group-" + group.role}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <h2 id={"group-" + group.role} className="home-section-title !text-[clamp(24px,3vw,32px)]">{group.heading}</h2>
                  <span className="result-meta">{group.entries.length} na ovoj strani</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {group.entries.map(person => (
                    <article key={person.id} className="card-surface min-w-0 p-6">
                      <div className="flex items-center gap-4">
                        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf1ff] text-sm font-extrabold text-[#284cdb]">
                          {person.name.split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="break-words text-[18px] font-extrabold tracking-tight">{person.name}</h3>
                          <p className="mt-1 text-xs font-semibold text-[#65728a]">{person.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</p>
                        </div>
                      </div>
                      <div className="mt-5 border-t border-[#e4e8f0] pt-4">
                        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#7a879a]">Predmeti</h4>
                        <ul className="flex flex-wrap gap-2">
                          {person.memberships.map(entry => (
                            <li key={entry.course.slug}>
                              <Link href={"/predmeti/" + entry.course.slug}
                                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#f2f4fa] px-3 py-2 text-xs font-bold text-[#284cdb] hover:bg-[#e6edff]">
                                {entry.course.title} <ArrowRight size={13} className="shrink-0" aria-hidden="true"/>
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
          {q && <Link href="/nastavnici" className="mt-3 inline-block font-semibold text-[#284cdb] underline">Prikaži kompletan tim</Link>}
        </div>}
        <nav className="mt-7 flex items-center justify-between gap-3" aria-label="Stranice nastavnog tima">
          {page > 1 ? <Link href={pageHref(page-1)} className="btn btn-light">← Prethodna</Link> : <span/>}
          {hasNext && <Link href={pageHref(page+1)} className="btn btn-light">Sledeća →</Link>}
        </nav>
      </div>
    </>
  );
}
