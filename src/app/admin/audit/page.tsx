import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock3, Search, ShieldCheck } from "lucide-react";
import { can } from "@/application/authorization";
import { db } from "@/infrastructure/db/prisma";
import { readPage } from "@/lib/pagination";
import Link from "next/link";

export const metadata: Metadata = { title: "Audit log", robots: { index: false, follow: false } };

const eventLabels: Record<string, string> = {
  "news.create": "Novost: kreirana",
  "news.update": "Novost: uređena",
  "news.publish": "Novost: objavljena",
  "news.unpublish": "Novost: povučena",
  "news.delete": "Novost: obrisana",
  "course.create": "Predmet: kreiran",
  "course.update": "Predmet: uređen",
  "course.delete": "Predmet: obrisan",
  "material.create": "Materijal: dodat",
  "material.update": "Materijal: uređen",
  "material.delete": "Materijal: uklonjen",
  "user.create": "Nalog: kreiran",
  "user.identity.update": "Nalog: ispravljeni ime ili email",
  "user.profile.update": "Nalog: izmenjen profil",
  "user.password.change": "Nalog: promenjena lozinka",
  "user.password.reset": "Nalog: administrator resetovao lozinku",
  "user.access.update": "Nalog: promenjena prava",
  "membership.assign": "Predmet: dodeljeno angažovanje",
  "membership.revoke": "Predmet: uklonjeno angažovanje",
};

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ p?: string; q?: string; type?: string }> }) {
  if (!(await can("users.manage"))) notFound();
  const { p, q: rawQ, type: rawType } = await searchParams;
  const page = readPage(p);
  const q = (typeof rawQ === "string" ? rawQ : "").trim().slice(0, 80);
  const type = ["News", "Course", "Material", "User"].includes(rawType ?? "") ? rawType : "";
  const filters = {
    ...(type ? { subjectType: type } : {}),
    ...(q ? {
      OR: [
        { action: { contains: q } },
        { subjectId: { contains: q } },
        { actor: { is: { name: { contains: q } } } },
      ],
    } : {}),
  };
  const logs = await db.auditLog.findMany({
    where: filters,
    select: { id: true, action: true, subjectType: true, subjectId: true, occurredAt: true,
      actor: { select: { name: true } } },
    orderBy: { occurredAt: "desc" },
    skip: (page - 1) * 50,
    take: 51,
  });
  const hasNext = logs.length > 50;
  const pageItems = logs.slice(0, 50);
  const href = (nextPage: number) => "/admin/audit?" + new URLSearchParams({
    ...(q ? { q } : {}),
    ...(type ? { type } : {}),
    p: String(nextPage),
  }).toString();
  return <div className="space-y-7">
    <div><p className="eyebrow mb-3"><ShieldCheck size={14}/> Evidencija izmena</p><h1 className="text-4xl font-extrabold tracking-tight">Audit log</h1>
      <p className="mt-3 text-sm leading-7 text-slate-500">Poslednje privilegovane izmene sadržaja i prava pristupa. Nema lozinki niti kompletnog sadržaja u zapisima.</p></div>
    <div className="admin-panel">
      <form className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px_auto]" role="search">
        <div>
          <label className="sr-only" htmlFor="audit-q">Pretraga audit loga</label>
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"/>
            <input id="audit-q" name="q" defaultValue={q} type="search" maxLength={80}
              className="input-field !pl-11" placeholder="Korisnik, akcija ili ID resursa…"/>
          </div>
        </div>
        <div>
          <label className="sr-only" htmlFor="audit-type">Tip resursa</label>
          <select id="audit-type" name="type" defaultValue={type || ""} className="input-field">
            <option value="">Svi resursi</option>
            <option value="News">Novosti</option>
            <option value="Course">Predmeti</option>
            <option value="Material">Materijali</option>
            <option value="User">Korisnici</option>
          </select>
        </div>
        <button className="btn btn-primary">Prikaži</button>
      </form>
      {(q || type) && <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">Filtrirani audit događaji</p>
        <Link href="/admin/audit" className="text-sm font-bold text-teal-700 hover:underline">Očisti filtere</Link>
      </div>}
      {pageItems.length ? <div className="table-wrap"><table className="data-table stacked-table">
        <thead><tr><th>Vreme</th><th>Korisnik</th><th>Događaj</th><th>Resurs</th></tr></thead>
        <tbody>{pageItems.map((entry) => <tr key={entry.id}>
          <td data-label="Vreme" className="whitespace-nowrap"><span className="flex items-center gap-2"><Clock3 size={15}/>{entry.occurredAt.toLocaleString("sr-RS", { timeZone: "Europe/Belgrade" })}</span></td>
          <td data-label="Korisnik" className="font-semibold">{entry.actor?.name ?? "Obrisan nalog"}</td>
          <td data-label="Događaj">{eventLabels[entry.action] ?? entry.action}</td>
          <td data-label="Resurs" className="max-w-64 break-all text-xs text-slate-500">{entry.subjectType}: {entry.subjectId}</td>
        </tr>)}</tbody>
      </table></div> : <div className="py-8 text-center text-sm text-slate-500">
        <p className="mb-3">Nema događaja za zadate kriterijume.</p>
        {(q || type) && <Link href="/admin/audit" className="font-bold text-teal-700 underline">Prikaži sve događaje</Link>}
      </div>}
    </div>
    <nav className="flex items-center justify-between" aria-label="Stranice audit loga">
      {page > 1 ? <Link href={href(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
      {hasNext && <Link href={href(page + 1)} className="btn btn-light">Sledeća →</Link>}
    </nav>
  </div>;
}
