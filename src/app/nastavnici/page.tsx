import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, Search, Users } from "lucide-react";
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
    ...(q ? { q } : {}),
    p: String(next),
  }).toString();
  const professors = staff.filter((person) => person.role === "PROFESSOR");
  const assistants = staff.filter((person) => person.role === "ASSISTANT");

  return <>
    <div className="page-banner"><div className="container-page">
      <p className="eyebrow mb-4"><GraduationCap size={16}/> Ljudi i nastava</p>
      <h1 className="page-title">Nastavni tim</h1>
      <p className="section-copy mt-5 max-w-2xl">Pregled aktivnih nastavnika i saradnika sa predmetima na kojima su angažovani.</p>
    </div></div>
    <div className="container-page space-y-10 py-12 md:py-16">
      <form action="/nastavnici" role="search" className="card-surface flex flex-wrap items-end gap-3 p-4 sm:p-6">
        <div className="min-w-48 flex-1">
          <label className="form-label" htmlFor="teacher-search">Pronađite nastavnika ili predmet</label>
          <div className="relative">
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input id="teacher-search" name="q" type="search" maxLength={80}
              defaultValue={q} className="input-field !pl-11" placeholder="Ime, prezime, predmet ili šifra…"/>
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Pretraži</button>
        {q && <Link href="/nastavnici" className="btn btn-light">Očisti</Link>}
      </form>
      {q && <p className="text-sm font-semibold text-slate-500">Rezultati za „{q}“ · strana {page}</p>}
      {staff.length ? [
        { heading: "Nastavnici", entries: professors },
        { heading: "Saradnici", entries: assistants },
      ].filter((group) => group.entries.length).map((group) =>
        <section key={group.heading}>
          <h2 className="mb-7 flex items-center gap-3 text-2xl font-extrabold tracking-tight"><Users size={22} className="text-teal-700"/>{group.heading}<span className="pill pill-neutral">{group.entries.length}</span></h2>
          <div className="grid gap-5 md:grid-cols-2">
            {group.entries.map((person) =>
              <article className="card-surface p-6 sm:p-8" key={person.id}>
                <div className="mb-6 flex items-center gap-4">
                  <div aria-hidden className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-xl font-extrabold text-teal-800">{person.name.slice(0, 1).toUpperCase()}</div>
                  <div><h3 className="text-lg font-extrabold tracking-tight">{person.name}</h3>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">{person.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</span>
                  </div>
                </div>
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><BookOpen size={15}/> Predmeti</p>
                <div className="divide-y divide-slate-100">{person.memberships.map((membership) =>
                  <Link key={membership.course.slug} href={"/predmeti/" + membership.course.slug} className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-teal-800 hover:text-teal-600">
                    <span className="min-w-0 break-words">{membership.course.title}<span className="ml-2 text-xs text-slate-500">({membership.course.code})</span></span>
                    <ArrowUpRight size={17} className="shrink-0" aria-hidden/>
                  </Link>)}</div>
              </article>)}
          </div>
        </section>)
        : <div className="empty-state"><Users size={28} className="mx-auto mb-3 text-teal-700"/>
          <p className="font-bold text-slate-700">{q ? "Nema rezultata za ovu pretragu." : "Nastavni tim još nije objavljen."}</p>
          <p className="mt-2 text-sm">{q ? "Pokušajte sa drugim imenom ili nazivom predmeta." : "Nastavno osoblje će biti prikazano kada administrator dodeli angažovanja."}</p>
          {q && <Link href="/nastavnici" className="btn btn-light mt-5">Prikaži kompletan tim</Link>}
        </div>}
      <nav className="flex items-center justify-between gap-3" aria-label="Stranice nastavnog tima">
        {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {hasNext && <Link href={pageHref(page + 1)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
  </>;
}
