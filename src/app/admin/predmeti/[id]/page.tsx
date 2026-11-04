import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FilePlus2, Users, Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { SubmitButton } from "@/components/submit-button";
import { can } from "@/application/authorization";
import { createMaterialAction, deleteMaterialAction, deleteCourseAction, updateMaterialAction, updateCourseAction } from "@/app/actions/courses";
import { db } from "@/infrastructure/db/prisma";
import { materialKindLabels, materialKinds } from "@/domain/content/material-kinds";
import { assignCourseMemberAction, revokeCourseMemberAction } from "@/app/actions/users";

export default async function EditCourse({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; material?: string; team?: string; error?: string }> }) {
  const { id } = await params;
  const [mayEdit, mayUpload, canManageTeam] = await Promise.all([
    can("courses.edit", id),
    can("materials.create", id),
    can("users.manage"),
  ]);
  if (!mayEdit && !mayUpload && !canManageTeam) notFound();
  const course = await db.course.findUnique({
    where: { id },
    include: {
      materials: { orderBy: { createdAt: "desc" } },
      memberships: {
        orderBy: { role: "desc" },
        include: { user: { select: { name: true, email: true, active: true } } },
      },
    },
  });
  if (!course) notFound();
  const { saved, material, team, error } = await searchParams;
  return <div className="space-y-7">
    <Link href="/admin/predmeti" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={17}/> Moji predmeti</Link>
    <div><p className="eyebrow mb-2">{course.code}</p><h1 className="text-3xl font-extrabold tracking-tight">{course.title}</h1><Link href={"/predmeti/"+course.slug} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Otvori javnu stranicu <ArrowUpRight size={16}/></Link></div>
    {error === "duplicate" && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">Drugi predmet već koristi ovu šifru. Izaberite jedinstvenu šifru.</p>}
    {error === "member" && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">Nastavnik nije dodeljen. Nalog mora postojati, biti aktivan i imati odgovarajuću globalnu ulogu.</p>}
    {(saved || material || team) && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Izmene su uspešno sačuvane.</p>}
    {mayEdit && <div className="admin-panel"><h2>Podaci o predmetu</h2><form action={updateCourseAction} className="space-y-5">
      <input type="hidden" name="id" value={course.id}/>
      <div className="form-grid"><div><label htmlFor="code" className="form-label">Šifra</label><input id="code" name="code" className="input-field" defaultValue={course.code} required/></div><div><label htmlFor="title" className="form-label">Naziv</label><input id="title" name="title" className="input-field" defaultValue={course.title} required minLength={5}/></div></div>
      <div className="form-grid"><div><label htmlFor="level" className="form-label">Nivo studija</label><select id="level" name="studyLevel" className="input-field" defaultValue={course.studyLevel}><option value="OAS">OAS</option><option value="MAS">MAS</option><option value="DAS">DAS</option></select></div><div><label htmlFor="semester" className="form-label">Semestar</label><select id="semester" name="semester" className="input-field" defaultValue={course.semester}>{Array.from({length:8},(_,i)=><option key={i} value={i+1}>{i+1}.</option>)}</select></div></div>
      <div><label htmlFor="description" className="form-label">Opis</label><textarea id="description" name="description" className="input-field" rows={6} required minLength={15} defaultValue={course.description}/></div>
      <SubmitButton>Sačuvaj izmene</SubmitButton>
    </form></div>}
    {mayUpload && <div className="admin-panel"><h2 className="flex items-center gap-3"><FilePlus2 className="text-teal-700"/> Dodaj materijal</h2>
      <form action={createMaterialAction} className="space-y-5"><input name="courseId" type="hidden" value={course.id}/>
        <div><label htmlFor="material-title" className="form-label">Naziv materijala</label><input id="material-title" name="title" required minLength={3} className="input-field" placeholder="Vežba 1 — prezentacija"/></div>
        <div><label htmlFor="material-url" className="form-label">HTTPS adresa dokumenta</label><input id="material-url" name="url" type="url" pattern="https://.*" required className="input-field" placeholder="https://..."/></div>
        <div><label htmlFor="material-kind" className="form-label">Kategorija</label>
          <select id="material-kind" name="kind" className="input-field" defaultValue="OTHER">
            {materialKinds.map((kind) => <option key={kind} value={kind}>{materialKindLabels[kind]}</option>)}
          </select>
        </div>
        <SubmitButton pendingText="Dodavanje…">Dodaj materijal</SubmitButton>
      </form>
      <div className="mt-8 border-t border-slate-100 pt-6"><h3 className="font-bold">Objavljeni materijali</h3><div className="mt-4 space-y-3">{course.materials.length ? course.materials.map((item) =>
        <div key={item.id} className="rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <span className="pill pill-neutral">{materialKindLabels[item.kind]}</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2 break-all text-sm font-semibold text-teal-700 hover:underline">{item.title}<ArrowUpRight size={17}/></a>
            </div>
            <form action={deleteMaterialAction}><input type="hidden" name="materialId" value={item.id}/><ConfirmSubmitButton message={"Ukloniti materijal „" + item.title + "“?"} className="text-xs font-bold text-rose-700 underline">Ukloni</ConfirmSubmitButton></form>
          </div>
          <details className="mt-3">
            <summary className="text-xs font-bold text-slate-600 hover:text-teal-700">Uredi naziv ili link</summary>
            <form action={updateMaterialAction} className="mt-4 grid gap-4">
              <input type="hidden" name="materialId" value={item.id}/>
              <div><label htmlFor={"material-name-" + item.id} className="form-label">Naziv</label><input id={"material-name-" + item.id} name="title" className="input-field" defaultValue={item.title} minLength={3} maxLength={180} required/></div>
              <div><label htmlFor={"material-link-" + item.id} className="form-label">HTTPS link</label><input id={"material-link-" + item.id} name="url" className="input-field" type="url" pattern="https://.*" defaultValue={item.url} required/></div>
              <div><label htmlFor={"material-kind-" + item.id} className="form-label">Kategorija</label>
                <select id={"material-kind-" + item.id} name="kind" defaultValue={item.kind} className="input-field">
                  {materialKinds.map((kind) => <option key={kind} value={kind}>{materialKindLabels[kind]}</option>)}
                </select>
              </div>
              <SubmitButton className="btn btn-primary w-fit">Sačuvaj materijal</SubmitButton>
            </form>
          </details>
        </div>) : <p className="text-sm text-slate-500">Nema materijala.</p>}</div></div>
    </div>}
    <section className="admin-panel">
      <h2 className="flex items-center gap-3"><Users className="text-teal-700" size={23}/> Nastavni tim</h2>
      {course.memberships.length
        ? <div className="divide-y divide-slate-100">{course.memberships.map((entry) =>
          <div key={entry.userId} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <strong className="text-sm">{entry.user.name}</strong>
              <span className="ml-2 text-xs text-slate-500">{entry.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</span>
              {canManageTeam && <p className="mt-1 break-all text-xs text-slate-500">{entry.user.email}{!entry.user.active ? " · Neaktivan nalog" : ""}</p>}
            </div>
            {canManageTeam && <form action={revokeCourseMemberAction}>
              <input type="hidden" name="userId" value={entry.userId}/>
              <input type="hidden" name="courseId" value={course.id}/>
              <input type="hidden" name="returnToCourse" value="1"/>
              <button className="text-xs font-bold text-rose-700 underline" type="submit">Ukloni angažovanje</button>
            </form>}
          </div>)}</div>
        : <p className="text-sm text-slate-500">Nastavni tim još nije dodeljen.</p>}
      {canManageTeam && <div className="mt-6 border-t border-slate-100 pt-6">
        <h3 className="text-lg font-extrabold tracking-tight">Dodaj nastavnika ili saradnika</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">Nalog mora već postojati i imati odgovarajuću globalnu ulogu. Promena angažovanja zahteva novu prijavu tog korisnika.</p>
        <form action={assignCourseMemberAction} className="mt-5 space-y-4">
          <input type="hidden" name="courseId" value={course.id}/>
          <input type="hidden" name="returnToCourse" value="1"/>
          <div><label className="form-label" htmlFor="team-email">Email naloga</label>
            <input className="input-field" id="team-email" name="email" type="email" placeholder="ime@uns.ac.rs" required/>
          </div>
          <div><label className="form-label" htmlFor="team-role">Uloga na predmetu</label>
            <select className="input-field" id="team-role" name="role">
              <option value="PROFESSOR">Nastavnik</option>
              <option value="ASSISTANT">Saradnik</option>
            </select>
          </div>
          <SubmitButton pendingText="Dodeljivanje…">Dodeli predmet</SubmitButton>
        </form>
      </div>}
    </section>
    {canManageTeam && <section className="admin-panel border-rose-100 bg-rose-50/30">
      <h2 className="!mb-2 text-rose-900">Obriši predmet</h2>
      <p className="mb-5 text-sm leading-7 text-slate-600">Ova radnja trajno uklanja predmet, njegove nastavne materijale i angažovanja. Nastavnici će morati ponovo da se prijave. Akcija je dostupna samo super administratoru.</p>
      <form action={deleteCourseAction}><input type="hidden" name="id" value={course.id}/>
        <ConfirmSubmitButton message={"Trajno obrisati predmet „" + course.title + "“ i sve njegove materijale?"} className="btn btn-danger"><Trash2 size={16}/> Trajno obriši predmet</ConfirmSubmitButton>
      </form>
    </section>}
  </div>;
}
