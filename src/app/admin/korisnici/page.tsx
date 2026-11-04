import { notFound } from "next/navigation";
import Link from "next/link";
import { readPage } from "@/lib/pagination";
import { ShieldCheck, UserPlus, Users, KeyRound } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { can } from "@/application/authorization";
import { assignCourseMemberAction, createUserAction, revokeCourseMemberAction, updateUserAccessAction, resetUserPasswordAction } from "@/app/actions/users";
import { roleLabels } from "@/domain/authorization/permissions";
import { db } from "@/infrastructure/db/prisma";

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ created?: string; assigned?: string; revoked?: string; updated?: string; reset?: string; q?: string; p?: string; mp?: string }> }) {
  if (!(await can("users.manage"))) notFound();
  const query = await searchParams;
  const q = (query.q || "").trim().slice(0, 80);
  const page = readPage(query.p);
  const memberPage = readPage(query.mp);
  const [users, courses, members] = await Promise.all([
    db.user.findMany({
      where: q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {},
      select: { id: true, name: true, email: true, role: true, active: true },
      orderBy: { name: "asc" },
      skip: (page - 1) * 30,
      take: 30,
    }),
    db.course.findMany({ select: { id: true, title: true, code: true }, orderBy: { title: "asc" }, take: 200 }),
    db.courseMembership.findMany({
      include: { user: { select: { name: true } }, course: { select: { title: true } } },
      skip: (memberPage - 1) * 30,
      take: 30,
      orderBy: { courseId: "asc" },
    }),
  ]);
  return <div className="space-y-7">
    <div><p className="eyebrow mb-3"><ShieldCheck size={15}/> Upravljanje pristupom</p><h1 className="text-4xl font-extrabold tracking-tight">Korisnici i RBAC</h1><p className="mt-3 text-sm leading-7 text-slate-500">Globalne uloge i članstva na predmetima su odvojeni. Sve izmene proveravaju se na serveru.</p></div>
    {(query.created || query.assigned || query.revoked || query.updated || query.reset) && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Izmena je sačuvana.</p>}
    <div className="admin-panel"><h2 className="flex items-center gap-3"><UserPlus className="text-teal-700"/> Dodaj nalog</h2>
      <form action={createUserAction} className="space-y-5">
        <div className="form-grid"><div><label htmlFor="name" className="form-label">Ime i prezime</label><input id="name" name="name" className="input-field" required minLength={3}/></div><div><label htmlFor="email" className="form-label">Email</label><input id="email" name="email" type="email" className="input-field" required/></div></div>
        <div className="form-grid"><div><label htmlFor="role" className="form-label">Uloga</label><select id="role" name="role" className="input-field"><option value="STUDENT">Student</option><option value="ASSISTANT">Saradnik</option><option value="PROFESSOR">Nastavnik</option><option value="EDITOR">Urednik</option></select></div><div><label htmlFor="password" className="form-label">Inicijalna lozinka (min. 12 znakova)</label><input id="password" name="password" type="password" autoComplete="new-password" className="input-field" minLength={12} required/></div></div>
        <SubmitButton pendingText="Kreiranje…">Kreiraj nalog</SubmitButton>
      </form>
    </div>
    <div className="admin-panel"><h2>Angažovanje na predmetu</h2><p className="mb-5 text-sm leading-7 text-slate-500">Nalog mora prvo imati odgovarajuću globalnu ulogu PROFESSOR ili ASSISTANT.</p>
      <form action={assignCourseMemberAction} className="space-y-4">
        <div><label htmlFor="user-email" className="form-label">Email nastavnika / saradnika</label><input id="user-email" name="email" type="email" required className="input-field"/></div>
        <div className="form-grid"><div><label htmlFor="course" className="form-label">Predmet</label><select id="course" name="courseId" className="input-field" required>{courses.map((course)=><option key={course.id} value={course.id}>{course.code} — {course.title}</option>)}</select></div><div><label htmlFor="member-role" className="form-label">Uloga na predmetu</label><select id="member-role" name="role" className="input-field"><option value="PROFESSOR">Nastavnik</option><option value="ASSISTANT">Saradnik</option></select></div></div>
        <SubmitButton pendingText="Dodeljivanje…" disabled={!courses.length}>Dodeli predmet</SubmitButton>
      </form>
      <h3 className="mt-8 border-t border-slate-100 pt-6 font-extrabold">Dodeljena članstva — strana {memberPage}</h3>
      {members.length ? <div className="table-wrap mt-4"><table className="data-table"><thead><tr><th>Osoba</th><th>Predmet</th><th>Uloga</th><th>Akcija</th></tr></thead><tbody>{members.map((m)=>
        <tr key={m.userId + m.courseId}><td>{m.user.name}</td><td>{m.course.title}</td><td>{m.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</td><td><form action={revokeCourseMemberAction}><input type="hidden" name="courseId" value={m.courseId}/><input type="hidden" name="userId" value={m.userId}/><button className="font-bold text-rose-700 underline">Ukloni</button></form></td></tr>)}</tbody></table></div>
        : <p className="mt-3 text-sm text-slate-500">Nema dodeljenih članstava.</p>}
      <nav className="mt-6 flex justify-between gap-3" aria-label="Stranice angažovanja">
        {memberPage > 1 ? <Link href={"/admin/korisnici?mp=" + (memberPage - 1) + "&p=" + page + "&q=" + encodeURIComponent(q)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {members.length === 30 && <Link href={"/admin/korisnici?mp=" + (memberPage + 1) + "&p=" + page + "&q=" + encodeURIComponent(q)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
    <div className="admin-panel"><h2 className="flex items-center gap-3"><Users className="text-teal-700"/> Nalozi — strana {page}</h2>
      <form className="mb-5 flex flex-wrap gap-3" role="search">
        <input type="search" name="q" defaultValue={q} aria-label="Pretraga naloga" placeholder="Ime ili email" className="input-field flex-1"/>
        <button className="btn btn-primary">Pretraži</button>
      </form>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Ime</th><th>Email</th><th>Uloga</th><th>Status</th><th>Upravljanje</th></tr></thead><tbody>{users.map((user)=>
        <tr key={user.id}>
          <td className="font-semibold">{user.name}</td>
          <td>{user.email}</td>
          <td>{roleLabels[user.role]}</td>
          <td>{user.active ? "Aktivan" : "Neaktivan"}</td>
          <td>{user.role === "SUPER_ADMIN" ? <span className="text-xs font-bold text-slate-500">Zaštićen nalog</span> :
            <div className="space-y-3">
              <form action={updateUserAccessAction} className="flex min-w-80 items-center gap-2">
                <input type="hidden" name="id" value={user.id}/>
                <select name="role" defaultValue={user.role} className="input-field !w-33" aria-label={"Uloga za "+user.name}>
                  <option value="STUDENT">Student</option>
                  <option value="ASSISTANT">Saradnik</option>
                  <option value="PROFESSOR">Nastavnik</option>
                  <option value="EDITOR">Urednik</option>
                </select>
                <select name="active" defaultValue={String(user.active)} className="input-field !w-29" aria-label={"Status za "+user.name}>
                  <option value="true">Aktivan</option>
                  <option value="false">Neaktivan</option>
                </select>
                <SubmitButton className="btn btn-light whitespace-nowrap">Sačuvaj</SubmitButton>
              </form>
              <details className="max-w-md rounded-xl border border-slate-200 p-3">
                <summary className="flex items-center gap-2 text-xs font-bold text-slate-600"><KeyRound size={15}/> Resetuj lozinku</summary>
                <form action={resetUserPasswordAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={user.id}/>
                  <label htmlFor={"reset-" + user.id} className="form-label">Nova privremena lozinka (min. 12 znakova)</label>
                  <input id={"reset-" + user.id} className="input-field" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={200} required/>
                  <p className="text-xs leading-5 text-slate-500">Prethodne sesije ovog korisnika biće opozvane. Lozinku prenesite korisniku bezbednim kanalom.</p>
                  <SubmitButton className="btn btn-light" pendingText="Resetovanje…">Postavi novu lozinku</SubmitButton>
                </form>
              </details>
            </div>}
          </td>
        </tr>)}</tbody></table></div>
      <nav className="mt-6 flex justify-between gap-3" aria-label="Stranice naloga">
        {page > 1 ? <Link href={"/admin/korisnici?p=" + (page - 1) + "&q=" + encodeURIComponent(q)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {users.length === 30 && <Link href={"/admin/korisnici?p=" + (page + 1) + "&q=" + encodeURIComponent(q)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
  </div>;
}
