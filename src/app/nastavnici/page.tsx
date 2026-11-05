import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search, Users } from "lucide-react";
import { publicTeachingStaff } from "@/infrastructure/repositories/content";
import { readPage } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Nastavni tim",
  description: "Aktivni nastavnici i saradnici angažovani na predmetima EEPSI katedre.",
};
export const revalidate = 300;

export default async function TeachingStaffPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { q: rawQ, p } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const page = readPage(p);
  const results = await publicTeachingStaff(q, page);
  const hasNext = results.length > 20;
  const staff = results.slice(0, 20);
  const pageHref = (next: number) => "/nastavnici?" + new URLSearchParams({
    ...(q ? { q } : {}), p: String(next),
  }).toString();
  const professors = staff.filter(person => person.role === "PROFESSOR");
  const assistants = staff.filter(person => person.role === "ASSISTANT");

  return <>
    <header className="page-banner"><div className="container-page">
      <p className="eyebrow mb-5">Ljudi / Nastava</p>
      <h1 className="page-title">Nastavni tim</h1>
      <p className="section-copy mt-5 max-w-2xl">Aktivni nastavnici i saradnici, sa pregledom predmeta na kojima su angažovani.</p>
    </div></header>
    <div className="container-page py-13 md:py-18">
      <div className="section-index"><span>01 / Pretraga</span><span>Osoblje i predmeti</span></div>
      <form action="/nastavnici" role="search" className="mb-10 flex flex-wrap items-end gap-3 border-b border-[#abb7b2] pb-8">
        <div className="min-w-52 flex-1">
          <label className="form-label" htmlFor="teacher-search">Pronađite nastavnika ili predmet</label>
          <div className="relative">
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6b6d]"/>
            <input id="teacher-search" name="q" type="search" maxLength={80} defaultValue={q} className="input-field !pl-11" placeholder="Ime, predmet ili šifra…"/>
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Pretraži</button>
        {q && <Link href="/nastavnici" className="btn btn-light">Očisti</Link>}
      </form>
      {q && <p className="meta-label mb-6">Rezultati za „{q}“ / strana {page}</p>}
      {staff.length ? [
        { heading: "Nastavnici", entries: professors, number: "02" },
        { heading: "Saradnici", entries: assistants, number: "03" },
      ].filter(group => group.entries.length).map(group =>
        <section className="mb-14" key={group.heading}>
          <div className="section-index"><span>{group.number} / {group.heading}</span><span>{group.entries.length} na ovoj strani</span></div>
          <h2 className="section-heading mb-7 !text-[clamp(28px,3.3vw,41px)]">{group.heading}</h2>
          <div className="border-t border-[#abb7b2]">
            {group.entries.map(person =>
              <article className="grid gap-5 border-b border-[#d3d6ce] py-7 md:grid-cols-[.8fr_1.2fr] md:gap-10" key={person.id}>
                <div className="flex items-start gap-4">
                  <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center border border-[#abb7b2] bg-[#e8eae2] text-lg font-bold text-[#344a4e]">{person.name.slice(0, 1).toUpperCase()}</span>
                  <div><h3 className="text-lg font-bold tracking-tight">{person.name}</h3><p className="meta-label mt-1">{person.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</p></div>
                </div>
                <div>
                  <p className="meta-label mb-2">Predmeti / {person.memberships.length}</p>
                  <div className="divide-y divide-[#d3d6ce]">{person.memberships.map(member =>
                    <Link key={member.course.slug} href={"/predmeti/" + member.course.slug} className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#205d57] hover:text-[#8b371d]">
                      <span className="min-w-0 break-words">{member.course.title}<span className="ml-2 text-xs font-normal text-[#5a6b6d]">[{member.course.code}]</span></span>
                      <ArrowUpRight size={16} className="shrink-0"/>
                    </Link>)}</div>
                </div>
              </article>)}
          </div>
        </section>)
        : <div className="empty-state"><Users size={27} className="mx-auto mb-3 text-[#205d57]"/>
          <p className="font-bold text-[#344a4e]">{page > 1 ? "Na ovoj stranici nema rezultata." : q ? "Nema rezultata za ovu pretragu." : "Nastavni tim još nije objavljen."}</p>
          <p className="mt-2 text-sm">{page > 1 ? "Vratite se na prethodnu stranicu." : q ? "Pokušajte sa drugim imenom ili predmetom." : "Osoblje će biti prikazano kada administrator dodeli angažovanja."}</p>
          {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light mt-5">Prethodna stranica</Link> : q && <Link href="/nastavnici" className="btn btn-light mt-5">Kompletan tim</Link>}
        </div>}
      <nav className="flex items-center justify-between gap-3 border-t border-[#d3d6ce] pt-7" aria-label="Stranice nastavnog tima">
        {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {hasNext && <Link href={pageHref(page + 1)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
  </>;
}
