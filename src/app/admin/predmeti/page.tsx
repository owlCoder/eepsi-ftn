import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { can, currentUser } from "@/application/authorization";
import { createCourseAction } from "@/app/actions/courses";
import { db } from "@/infrastructure/db/prisma";
import { readPage } from "@/lib/pagination";
import { SubmitButton } from "@/components/submit-button";

export default async function AdminCourses({ searchParams }: { searchParams: Promise<{ q?: string; p?: string; deleted?: string; error?: string }> }) {
  const actor = await currentUser();
  if (!actor) return null;
  if (actor.role === "STUDENT") notFound();
  const canCreate = await can("courses.create");
  const { q: rawQ, p, deleted, error } = await searchParams;
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const page = readPage(p);
  const courses = await db.course.findMany({
    where: {
      ...(!canCreate ? { memberships: { some: { userId: actor.id } } } : {}),
      ...(q ? { OR: [{ title: { contains: q } }, { code: { contains: q } }] } : {}),
    },
    select: { id: true, title: true, code: true, semester: true, studyLevel: true, _count: { select: { materials: true } } },
    orderBy: [{ semester: "asc" }, { title: "asc" }, { id: "asc" }],
    skip: (page - 1) * 20,
    take: 21,
  });
  const hasNext = courses.length > 20;
  const pageItems = courses.slice(0, 20);
  return <div className="space-y-7">
    <div><p className="eyebrow mb-3">Upravljanje nastavom</p><h1 className="text-4xl font-extrabold tracking-tight">{canCreate ? "Upravljanje predmetima" : "Moji predmeti"}</h1><p className="mt-3 text-sm leading-7 text-slate-500">{canCreate ? "Kreirajte predmet i organizujte njegov nastavni sadržaj." : "Prikazani su samo predmeti na kojima ste angažovani."}</p></div>
    {error === "duplicate" && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">Šifra predmeta već postoji. Unesite drugu šifru ili izmenite postojeći predmet.</p>}
    {deleted && <p role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-[#173b63]">Predmet je trajno uklonjen, zajedno sa materijalima i angažovanjima.</p>}
    <div className="admin-panel" id="spisak-predmeta">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="!mb-0">Predmeti <span className="text-sm font-semibold text-slate-500">· strana {page}</span></h2>
        {canCreate && <a href="#novi-predmet" className="text-sm font-bold text-[#173b63] hover:underline">+ Novi predmet</a>}
      </div>
      <form role="search" className="mb-5 flex flex-wrap gap-3">
        <input type="search" name="q" aria-label="Pretraga predmeta" defaultValue={q} placeholder="Naziv ili šifra predmeta" className="input-field flex-1"/>
        <button className="btn btn-primary">Pretraži</button>
      </form>
      {pageItems.length ? <div className="table-wrap"><table className="data-table stacked-table"><thead><tr><th>Predmet</th><th>Šifra</th><th>Semestar</th><th>Materijali</th></tr></thead><tbody>{pageItems.map((item)=>
        <tr key={item.id}><td data-label="Predmet"><Link href={"/admin/predmeti/"+item.id} className="font-bold hover:text-[#173b63]">{item.title} <ArrowUpRight size={14} className="inline"/></Link></td><td data-label="Šifra">{item.code}</td><td data-label="Semestar">{item.semester}.</td><td data-label="Materijali">{item._count.materials}</td></tr>)}</tbody></table></div>
        : <p className="text-sm text-slate-500">Nema dostupnih predmeta.</p>}
      <nav aria-label="Stranice predmeta" className="mt-6 flex justify-between gap-3">
        {page > 1 ? <Link href={"/admin/predmeti?q=" + encodeURIComponent(q) + "&p=" + (page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {hasNext && <Link href={"/admin/predmeti?q=" + encodeURIComponent(q) + "&p=" + (page + 1)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
    {canCreate && <div className="admin-panel" id="novi-predmet">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="!mb-0">Novi predmet</h2>
        <a href="#spisak-predmeta" className="text-sm font-bold text-[#173b63] hover:underline">↑ Nazad na spisak</a>
      </div><form action={createCourseAction} className="space-y-5">
      <div className="form-grid"><div><label htmlFor="c-code" className="form-label">Šifra predmeta</label><input id="c-code" name="code" className="input-field" required minLength={2} maxLength={30} pattern="[A-Za-z0-9-]{2,30}" title="Samo latinična slova, brojevi i crtica" placeholder="EE-101"/></div><div><label htmlFor="c-title" className="form-label">Naziv predmeta</label><input id="c-title" name="title" className="input-field" required minLength={5} maxLength={180}/></div></div>
      <div className="form-grid"><div><label htmlFor="c-level" className="form-label">Nivo studija</label><select id="c-level" name="studyLevel" className="input-field"><option value="OAS">Osnovne akademske studije</option><option value="MAS">Master akademske studije</option><option value="DAS">Doktorske akademske studije</option></select></div><div><label htmlFor="c-sem" className="form-label">Semestar</label><select id="c-sem" name="semester" className="input-field">{Array.from({length:8},(_,i)=><option key={i} value={i+1}>{i+1}. semestar</option>)}</select></div></div>
      <div><label htmlFor="c-desc" className="form-label">Opis predmeta</label><textarea id="c-desc" name="description" className="input-field" required rows={6} minLength={15} maxLength={5000} placeholder="Kratak opis predmeta, ishodi učenja i druge važne informacije…"/></div>
      <SubmitButton pendingText="Kreiranje…">Kreiraj predmet</SubmitButton>
    </form></div>}
  </div>;
}
