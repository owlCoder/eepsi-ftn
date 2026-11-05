import type { Metadata } from "next";
import Link from "next/link";
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
      <header className="page-banner"><div className="container-page">
        <nav aria-label="Putanja" className="mb-4 text-xs text-[#556777]"><Link href="/" className="hover:underline">Početna</Link> / Nastavno osoblje</nav>
        <h1 className="page-title">Nastavno osoblje</h1>
        <p className="section-copy mt-3 max-w-2xl">Pregled aktivnih nastavnika i saradnika sa predmetima na kojima su angažovani.</p>
      </div></header>
      <div className="container-page py-9 md:py-12">
        <form action="/nastavnici" role="search" className="flex flex-wrap items-end gap-3 rounded-lg border border-[#dce3e9] bg-white p-5">
          <div className="min-w-[200px] flex-1"><label htmlFor="teacher-search" className="form-label">Ime nastavnika ili naziv predmeta</label>
            <input id="teacher-search" name="q" type="search" maxLength={80} defaultValue={q} className="input-field" placeholder="Ime, prezime, naziv ili šifra predmeta"/>
          </div>
          <button className="btn btn-primary" type="submit">Pretraži</button>
          {q && <Link href="/nastavnici" className="btn btn-light">Očisti</Link>}
        </form>
        {q && <p role="status" className="mt-5 text-sm text-[#556777]">Rezultati za „{q}“ · strana {page}</p>}
        {staff.length ? <div className="mt-9 space-y-10">
          {groups.filter(group => group.entries.length > 0).map(group => (
            <section key={group.role} aria-labelledby={"group-" + group.role}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <h2 id={"group-" + group.role} className="text-xl font-bold">{group.heading}</h2>
                <span className="text-sm text-[#556777]">{group.entries.length} na ovoj strani</span>
              </div>
              <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">
                {group.entries.map(person => (
                  <article key={person.id} className="grid gap-4 border-b border-[#dce3e9] p-5 last:border-b-0 md:grid-cols-[minmax(190px,.75fr)_minmax(0,1.25fr)] md:gap-8">
                    <div><h3 className="text-base font-bold">{person.name}</h3><p className="mt-1 text-xs text-[#556777]">{person.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</p></div>
                    <div><h4 className="mb-2 text-xs font-semibold text-[#556777]">Predmeti</h4>
                      <ul className="space-y-1">{person.memberships.map(entry => <li key={entry.course.slug}>
                        <Link href={"/predmeti/" + entry.course.slug} className="inline-block py-1 text-sm font-semibold text-[#173b63] hover:underline">{entry.course.title} <span className="font-normal text-[#556777]">({entry.course.code})</span></Link>
                      </li>)}</ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div> : <div className="empty-state mt-8"><p>{page > 1 ? "Na ovoj stranici nema rezultata." : q ? "Nema nastavnog osoblja za zadatu pretragu." : "Nastavno osoblje još nije objavljeno."}</p>
          {q && <Link href="/nastavnici" className="mt-3 inline-block font-semibold text-[#173b63] underline">Prikaži kompletan tim</Link>}</div>}
        <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Stranice nastavnog tima">
          {page > 1 ? <Link href={pageHref(page-1)} className="btn btn-light">← Prethodna</Link> : <span/>}
          {hasNext && <Link href={pageHref(page+1)} className="btn btn-light">Sledeća →</Link>}
        </nav>
      </div>
    </>
  );
}
