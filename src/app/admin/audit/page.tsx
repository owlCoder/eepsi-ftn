import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock3, ShieldCheck } from "lucide-react";
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
  "user.profile.update": "Nalog: izmenjen profil",
  "user.password.change": "Nalog: promenjena lozinka",
  "user.password.reset": "Nalog: administrator resetovao lozinku",
  "user.access.update": "Nalog: promenjena prava",
  "membership.assign": "Predmet: dodeljeno angažovanje",
  "membership.revoke": "Predmet: uklonjeno angažovanje",
};

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  if (!(await can("users.manage"))) notFound();
  const { p } = await searchParams;
  const page = readPage(p);
  const logs = await db.auditLog.findMany({
    select: { id: true, action: true, subjectType: true, subjectId: true, occurredAt: true,
      actor: { select: { name: true } } },
    orderBy: { occurredAt: "desc" },
    skip: (page - 1) * 50,
    take: 50,
  });
  return <div className="space-y-7">
    <div><p className="eyebrow mb-3"><ShieldCheck size={14}/> Evidencija izmena</p><h1 className="text-4xl font-extrabold tracking-tight">Audit log</h1>
      <p className="mt-3 text-sm leading-7 text-slate-500">Poslednje privilegovane izmene sadržaja i prava pristupa. Nema lozinki niti kompletnog sadržaja u zapisima.</p></div>
    <div className="admin-panel">
      {logs.length ? <div className="table-wrap"><table className="data-table">
        <thead><tr><th>Vreme</th><th>Korisnik</th><th>Događaj</th><th>Resurs</th></tr></thead>
        <tbody>{logs.map((entry) => <tr key={entry.id}>
          <td className="whitespace-nowrap"><span className="flex items-center gap-2"><Clock3 size={15}/>{entry.occurredAt.toLocaleString("sr-RS", { timeZone: "Europe/Belgrade" })}</span></td>
          <td className="font-semibold">{entry.actor?.name ?? "Obrisan nalog"}</td>
          <td>{eventLabels[entry.action] ?? entry.action}</td>
          <td className="max-w-64 break-all text-xs text-slate-500">{entry.subjectType}: {entry.subjectId}</td>
        </tr>)}</tbody>
      </table></div> : <p className="text-sm text-slate-500">Još nema audit događaja.</p>}
    </div>
    <nav className="flex items-center justify-between" aria-label="Stranice audit loga">
      {page > 1 ? <Link href={"/admin/audit?p=" + (page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
      {logs.length === 50 && <Link href={"/admin/audit?p=" + (page + 1)} className="btn btn-light">Sledeća →</Link>}
    </nav>
  </div>;
}
