import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FilePlus2 } from "lucide-react";
import { can } from "@/application/authorization";
import { createMaterialAction, updateCourseAction } from "@/app/actions/courses";
import { db } from "@/infrastructure/db/prisma";

export default async function EditCourse({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; material?: string }> }) {
  const { id } = await params;
  const [mayEdit, mayUpload] = await Promise.all([can("courses.edit", id), can("materials.create", id)]);
  if (!mayEdit && !mayUpload) notFound();
  const course = await db.course.findUnique({ where: { id }, include: { materials: { orderBy: { createdAt: "desc" }, take: 100 }, memberships: { include: { user: { select: { name: true } } } } } });
  if (!course) notFound();
  const { saved, material } = await searchParams;
  return <div className="space-y-7">
    <Link href="/admin/predmeti" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={17}/> Moji predmeti</Link>
    <div><p className="eyebrow mb-2">{course.code}</p><h1 className="text-3xl font-extrabold tracking-tight">{course.title}</h1><Link href={"/predmeti/"+course.slug} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Otvori javnu stranicu <ArrowUpRight size={16}/></Link></div>
    {(saved || material) && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Izmene su uspešno sačuvane.</p>}
    {mayEdit && <div className="admin-panel"><h2>Podaci o predmetu</h2><form action={updateCourseAction} className="space-y-5">
      <input type="hidden" name="id" value={course.id}/>
      <div className="form-grid"><div><label htmlFor="code" className="form-label">Šifra</label><input id="code" name="code" className="input-field" defaultValue={course.code} required/></div><div><label htmlFor="title" className="form-label">Naziv</label><input id="title" name="title" className="input-field" defaultValue={course.title} required minLength={5}/></div></div>
      <div className="form-grid"><div><label htmlFor="level" className="form-label">Nivo studija</label><select id="level" name="studyLevel" className="input-field" defaultValue={course.studyLevel}><option value="OAS">OAS</option><option value="MAS">MAS</option><option value="DAS">DAS</option></select></div><div><label htmlFor="semester" className="form-label">Semestar</label><select id="semester" name="semester" className="input-field" defaultValue={course.semester}>{Array.from({length:8},(_,i)=><option key={i} value={i+1}>{i+1}.</option>)}</select></div></div>
      <div><label htmlFor="description" className="form-label">Opis</label><textarea id="description" name="description" className="input-field" rows={6} required minLength={15} defaultValue={course.description}/></div>
      <button className="btn btn-primary">Sačuvaj izmene</button>
    </form></div>}
    {mayUpload && <div className="admin-panel"><h2 className="flex items-center gap-3"><FilePlus2 className="text-teal-700"/> Dodaj materijal</h2>
      <form action={createMaterialAction} className="space-y-5"><input name="courseId" type="hidden" value={course.id}/>
        <div><label htmlFor="material-title" className="form-label">Naziv materijala</label><input id="material-title" name="title" required minLength={3} className="input-field" placeholder="Vežba 1 — prezentacija"/></div>
        <div><label htmlFor="material-url" className="form-label">HTTPS adresa dokumenta</label><input id="material-url" name="url" type="url" pattern="https://.*" required className="input-field" placeholder="https://..."/></div>
        <button className="btn btn-primary">Dodaj materijal</button>
      </form>
      <div className="mt-8 border-t border-slate-100 pt-6"><h3 className="font-bold">Objavljeni materijali</h3><div className="mt-4 space-y-3">{course.materials.length ? course.materials.map((item) =>
        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-semibold text-teal-700 hover:bg-teal-50">{item.title}<ArrowUpRight size={17}/></a>) : <p className="text-sm text-slate-500">Nema materijala.</p>}</div></div>
    </div>}
    <div className="admin-panel"><h2>Nastavni tim</h2>{course.memberships.length ? <div className="space-y-3">{course.memberships.map((entry) =>
      <p key={entry.userId} className="text-sm"><strong>{entry.user.name}</strong> <span className="text-slate-500">— {entry.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</span></p>)}</div> : <p className="text-sm text-slate-500">Nije dodeljen nastavni tim. Administrator može da dodeli nastavnike i saradnike.</p>}</div>
  </div>;
}
