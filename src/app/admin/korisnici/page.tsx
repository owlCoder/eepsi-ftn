import { notFound } from "next/navigation";
import Link from "next/link";
import { readPage } from "@/lib/pagination";
import { ShieldCheck, UserPlus, Users, KeyRound, Pencil } from "lucide-react";
import { UserAccessForm } from "@/components/user-access-form";
import { SubmitButton } from "@/components/submit-button";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { can } from "@/application/authorization";
import { assignCourseMemberAction, createUserAction, revokeCourseMemberAction, resetUserPasswordAction, updateUserIdentityAction } from "@/app/actions/users";
import { roleLabels, roles } from "@/domain/authorization/permissions";
import { db } from "@/infrastructure/db/prisma";

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ created?: string; assigned?: string; revoked?: string; updated?: string; reset?: string; details?: string; unchanged?: string; error?: string; q?: string; role?: string; active?: string; p?: string; mp?: string }> }) {
  if (!(await can("users.manage"))) notFound();
  const query = await searchParams;
  const q = (typeof query.q === "string" ? query.q : "").trim().slice(0, 80);
  const role = roles.find((item) => item === query.role);
  const active = query.active === "true" ? true : query.active === "false" ? false : undefined;
  const page = readPage(query.p);
  const memberPage = readPage(query.mp);
  const [users, members] = await Promise.all([
    db.user.findMany({
      where: {
        ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {}),
        ...(role ? { role } : {}),
        ...(active !== undefined ? { active } : {}),
      },
      select: { id: true, name: true, email: true, role: true, active: true },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      skip: (page - 1) * 30,
      take: 31,
    }),
    db.courseMembership.findMany({
      include: { user: { select: { name: true } }, course: { select: { title: true } } },
      skip: (memberPage - 1) * 30,
      take: 31,
      orderBy: [{ courseId: "asc" }, { userId: "asc" }],
    }),
  ]);
  const hasNextUsers = users.length > 30;
  const hasNextMembers = members.length > 30;
  const pageUsers = users.slice(0, 30);
  const pageMembers = members.slice(0, 30);
  function pageHref(nextPage: number, nextMemberPage = memberPage) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role) params.set("role", role);
    if (active !== undefined) params.set("active", String(active));
    params.set("p", String(nextPage));
    params.set("mp", String(nextMemberPage));
    return "/admin/korisnici?" + params.toString();
  }
  return <div className="space-y-7">
    <div>
      <p className="eyebrow mb-3"><ShieldCheck size={15}/> Upravljanje pristupom</p>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Korisnički nalozi</h1>
      <p className="mt-3 text-sm leading-7 text-slate-500">Pronađite korisnika, promenite ulogu ili status i upravljajte angažovanjima.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href="#spisak-naloga" className="btn btn-light">Pregled naloga</a>
        <a href="#novi-nalog" className="btn btn-primary"><UserPlus size={16}/> Dodaj nalog</a>
        <a href="#angazovanja" className="btn btn-light">Angažovanja na predmetima</a>
      </div>
    </div>
    {(query.created || query.assigned || query.revoked || query.updated || query.reset || query.details) && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-[#173b63]">Izmena je sačuvana.</p>}
    {query.unchanged && <p role="status" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">Nema izmena — podaci ili angažovanje su već bili sačuvani.</p>}
    {query.error === "duplicate" && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">Nalog sa tom email adresom već postoji. Koristite pretragu da biste ga pronašli.</p>}
    {query.error === "course" && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">Predmet sa unetom šifrom nije pronađen. Proverite šifru u katalogu predmeta.</p>}
    {query.error === "member" && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">Angažovanje nije sačuvano. Proverite email, aktivnost naloga i da li je njegova globalna uloga odgovarajuća.</p>}
    <div className="admin-panel" id="spisak-naloga">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="!mb-0 flex items-center gap-3"><Users className="text-[#173b63]"/> Nalozi <span className="text-sm font-semibold text-slate-500">· strana {page}</span></h2>
        <a href="#novi-nalog" className="text-sm font-bold text-[#173b63] hover:underline">+ Novi nalog</a>
      </div>
      <form className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_155px_140px_auto]" role="search">
        <label htmlFor="accounts-search" className="sr-only">Pretraga naloga</label>
        <input id="accounts-search" type="search" name="q" defaultValue={q} placeholder="Ime ili email korisnika…" className="input-field"/>
        <label htmlFor="accounts-role" className="sr-only">Filter uloge</label>
        <select id="accounts-role" name="role" defaultValue={role ?? ""} className="input-field">
          <option value="">Sve uloge</option>
          {roles.map((item) => <option key={item} value={item}>{roleLabels[item]}</option>)}
        </select>
        <label htmlFor="accounts-active" className="sr-only">Filter statusa</label>
        <select id="accounts-active" name="active" defaultValue={active === undefined ? "" : String(active)} className="input-field">
          <option value="">Svi statusi</option>
          <option value="true">Aktivni</option>
          <option value="false">Neaktivni</option>
        </select>
        <button className="btn btn-primary" type="submit">Prikaži</button>
      </form>
      {(q || role || active !== undefined) && <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">Prikazani su filtrirani nalozi.</p>
        <Link href="/admin/korisnici" className="text-sm font-bold text-[#173b63] hover:underline">Očisti filtere</Link>
      </div>}
      <div className="table-wrap"><table className="data-table stacked-table"><thead><tr><th>Ime</th><th>Email</th><th>Uloga</th><th>Status</th><th>Upravljanje</th></tr></thead><tbody>{pageUsers.map((user)=>
        <tr key={user.id}>
          <td data-label="Ime" className="font-semibold">{user.name}</td>
          <td data-label="Email">{user.email}</td>
          <td data-label="Uloga">{roleLabels[user.role]}</td>
          <td data-label="Status"><span className={user.active ? "pill" : "pill pill-neutral"}>{user.active ? "Aktivan" : "Neaktivan"}</span></td>
          <td data-label="Upravljanje">{user.role === "SUPER_ADMIN" ? <span className="text-xs font-bold text-slate-500">Zaštićen nalog</span> :
            <div className="space-y-3">
              <UserAccessForm id={user.id} name={user.name} initialRole={user.role} initialActive={user.active}/>
              <details className="max-w-md rounded-xl border border-slate-200 p-3">
                <summary className="flex items-center gap-2 text-xs font-bold text-slate-600"><Pencil size={15}/> Uredi osnovne podatke</summary>
                <form action={updateUserIdentityAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={user.id}/>
                  <div>
                    <label className="form-label" htmlFor={"edit-name-" + user.id}>Ime i prezime</label>
                    <input id={"edit-name-" + user.id} className="input-field" name="name"
                      defaultValue={user.name} minLength={3} maxLength={120} required/>
                  </div>
                  <div>
                    <label className="form-label" htmlFor={"edit-email-" + user.id}>Email za prijavu</label>
                    <input id={"edit-email-" + user.id} className="input-field" name="email" type="email"
                      defaultValue={user.email} maxLength={191} required/>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">Promena emaila zahteva ponovnu prijavu korisnika.</p>
                  <SubmitButton className="btn btn-light" pendingText="Čuvanje…">Sačuvaj podatke</SubmitButton>
                </form>
              </details>
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
        {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {hasNextUsers && <Link href={pageHref(page + 1)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
    <div className="admin-panel" id="novi-nalog"><h2 className="flex items-center gap-3"><UserPlus className="text-[#173b63]"/> Dodaj nalog</h2>
      <form action={createUserAction} className="space-y-5">
        <div className="form-grid"><div><label htmlFor="name" className="form-label">Ime i prezime</label><input id="name" name="name" className="input-field" required minLength={3}/></div><div><label htmlFor="email" className="form-label">Email</label><input id="email" name="email" type="email" className="input-field" required/></div></div>
        <div className="form-grid"><div><label htmlFor="role" className="form-label">Uloga</label><select id="role" name="role" className="input-field"><option value="STUDENT">Student</option><option value="ASSISTANT">Saradnik</option><option value="PROFESSOR">Nastavnik</option><option value="EDITOR">Urednik</option></select></div><div><label htmlFor="password" className="form-label">Inicijalna lozinka (min. 12 znakova)</label><input id="password" name="password" type="password" autoComplete="new-password" className="input-field" minLength={12} required/></div></div>
        <SubmitButton pendingText="Kreiranje…">Kreiraj nalog</SubmitButton>
      </form>
    </div>
    <div className="admin-panel" id="angazovanja"><h2>Angažovanje na predmetu</h2><p className="mb-5 text-sm leading-7 text-slate-500">Nalog mora prvo imati odgovarajuću globalnu ulogu PROFESSOR ili ASSISTANT.</p>
      <form action={assignCourseMemberAction} className="space-y-4">
        <div><label htmlFor="user-email" className="form-label">Email nastavnika / saradnika</label><input id="user-email" name="email" type="email" required className="input-field"/></div>
        <div className="form-grid"><div><label htmlFor="course" className="form-label">Šifra predmeta</label><input id="course" name="courseCode" className="input-field" required minLength={2} maxLength={30} pattern="[A-Za-z0-9-]{2,30}" placeholder="Unesite tačnu šifru predmeta" aria-describedby="course-code-help"/><p id="course-code-help" className="mt-2 text-xs text-slate-500">Šifru možete pronaći u <Link href="/predmeti" className="font-bold text-[#173b63] underline">katalogu predmeta</Link>. Dostupni su svi predmeti, bez ograničenja liste.</p></div><div><label htmlFor="member-role" className="form-label">Uloga na predmetu</label><select id="member-role" name="role" className="input-field"><option value="PROFESSOR">Nastavnik</option><option value="ASSISTANT">Saradnik</option></select></div></div>
        <SubmitButton pendingText="Dodeljivanje…">Dodeli predmet</SubmitButton>
      </form>
      <h3 className="mt-8 border-t border-slate-100 pt-6 font-extrabold">Dodeljena članstva — strana {memberPage}</h3>
      {pageMembers.length ? <div className="table-wrap mt-4"><table className="data-table stacked-table"><thead><tr><th>Osoba</th><th>Predmet</th><th>Uloga</th><th>Akcija</th></tr></thead><tbody>{pageMembers.map((m)=>
        <tr key={m.userId + m.courseId}><td data-label="Osoba">{m.user.name}</td><td data-label="Predmet">{m.course.title}</td><td data-label="Uloga">{m.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</td><td data-label="Akcija"><form action={revokeCourseMemberAction}><input type="hidden" name="courseId" value={m.courseId}/><input type="hidden" name="userId" value={m.userId}/><ConfirmSubmitButton message={"Ukloniti angažovanje osobe „" + m.user.name + "“ na predmetu „" + m.course.title + "“? Pristup predmetu biće odmah opozvan."} dialogTitle="Potvrdite uklanjanje angažovanja" confirmLabel="Ukloni angažovanje" warning="Osoba će izgubiti pristup predmetu. Angažovanje možete ponovo dodeliti." className="inline-flex min-h-10 items-center font-bold text-rose-700 underline">Ukloni</ConfirmSubmitButton></form></td></tr>)}</tbody></table></div>
        : <p className="mt-3 text-sm text-slate-500">Nema dodeljenih članstava.</p>}
      <nav className="mt-6 flex justify-between gap-3" aria-label="Stranice angažovanja">
        {memberPage > 1 ? <Link href={pageHref(page, memberPage - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
        {hasNextMembers && <Link href={pageHref(page, memberPage + 1)} className="btn btn-light">Sledeća →</Link>}
      </nav>
    </div>
  </div>;
}
