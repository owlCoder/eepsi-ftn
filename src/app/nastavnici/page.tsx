import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, Users } from "lucide-react";
import { publicTeachingStaff } from "@/infrastructure/repositories/content";

export const metadata: Metadata = {
  title: "Nastavni tim",
  description: "Aktivni nastavnici i saradnici angažovani na predmetima EEPSI katedre.",
};
export const revalidate = 300;

export default async function TeachingStaffPage() {
  const staff = await publicTeachingStaff();
  const professors = staff.filter((person) => person.role === "PROFESSOR");
  const assistants = staff.filter((person) => person.role === "ASSISTANT");

  return <>
    <div className="page-banner"><div className="container-page">
      <p className="eyebrow mb-4"><GraduationCap size={16}/> Ljudi i nastava</p>
      <h1 className="page-title">Nastavni tim</h1>
      <p className="section-copy mt-5 max-w-2xl">Pregled aktivnih nastavnika i saradnika sa predmetima na kojima su angažovani.</p>
    </div></div>
    <div className="container-page space-y-14 py-14 md:py-20">
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
        : <div className="empty-state"><Users size={28} className="mx-auto mb-3 text-teal-700"/> Nastavno osoblje će biti prikazano kada administrator dodeli angažovanja na predmetima.</div>}
    </div>
  </>;
}
