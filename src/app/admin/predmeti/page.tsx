import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { can, currentUser } from "@/application/authorization";
import { createCourseAction } from "@/app/actions/courses";
import { db } from "@/infrastructure/db/prisma";

export default async function AdminCourses() {
  const actor = await currentUser();
  if (!actor) return null;
  const canCreate = await can("courses.create");
  const courses = await db.course.findMany({
    where: canCreate ? {} : { memberships: { some: { userId: actor.id } } },
    select: { id: true, title: true, code: true, semester: true, studyLevel: true, _count: { select: { materials: true } } },
    orderBy: [{ semester: "asc" }, { title: "asc" }],
    take: 100,
  });
  return <div className="space-y-7">
    <div><p className="eyebrow mb-3">Akademski program</p><h1 className="text-4xl font-extrabold tracking-tight">{canCreate ? "Upravljanje predmetima" : "Moji predmeti"}</h1><p className="mt-3 text-sm leading-7 text-slate-500">{canCreate ? "Kreirajte predmet i organizujte njegov nastavni sadržaj." : "Prikazani su samo predmeti na kojima ste angažovani."}</p></div>
    {canCreate && <div className="admin-panel"><h2>Novi predmet</h2><form action={createCourseAction} className="space-y-5">
      <div className="form-grid"><div><label htmlFor="c-code" className="form-label">Šifra predmeta</label><input id="c-code" name="code" className="input-field" required minLength={2} maxLength={30} placeholder="EE-101"/></div><div><label htmlFor="c-title" className="form-label">Naziv predmeta</label><input id="c-title" name="title" className="input-field" required minLength={5} maxLength={180}/></div></div>
      <div className="form-grid"><div><label htmlFor="c-level" className="form-label">Nivo studija</label><select id="c-level" name="studyLevel" className="input-field"><option value="OAS">Osnovne akademske studije</option><option value="MAS">Master akademske studije</option><option value="DAS">Doktorske akademske studije</option></select></div><div><label htmlFor="c-sem" className="form-label">Semestar</label><select id="c-sem" name="semester" className="input-field">{Array.from({length:8},(_,i)=><option key={i} value={i+1}>{i+1}. semestar</option>)}</select></div></div>
      <div><label htmlFor="c-desc" className="form-label">Opis predmeta</label><textarea id="c-desc" name="description" className="input-field" required rows={5} minLength={15}/></div>
      <button className="btn btn-primary">Kreiraj predmet</button>
    </form></div>}
    <div className="admin-panel"><h2>Predmeti ({courses.length})</h2>
      {courses.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Predmet</th><th>Šifra</th><th>Semestar</th><th>Materijali</th></tr></thead><tbody>{courses.map((item)=>
        <tr key={item.id}><td><Link href={"/admin/predmeti/"+item.id} className="font-bold hover:text-teal-700">{item.title} <ArrowUpRight size={14} className="inline"/></Link></td><td>{item.code}</td><td>{item.semester}.</td><td>{item._count.materials}</td></tr>)}</tbody></table></div>
        : <p className="text-sm text-slate-500">Nema dostupnih predmeta.</p>}
    </div>
  </div>;
}
