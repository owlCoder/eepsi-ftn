import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { can } from "@/application/authorization";
import { createNewsAction, togglePublishNewsAction } from "@/app/actions/news";
import { db } from "@/infrastructure/db/prisma";
import { readPage } from "@/lib/pagination";
import { SubmitButton } from "@/components/submit-button";

export default async function AdminNews({ searchParams }: { searchParams: Promise<{ q?: string; p?: string; status?: string; deleted?: string }> }) {
  if (!(await can("news.write"))) notFound();
  const { q: rawQ, p, status: rawStatus, deleted } = await searchParams;
  const q = (rawQ || "").trim().slice(0, 80);
  const page = readPage(p);
  const status = rawStatus === "DRAFT" || rawStatus === "PUBLISHED" ? rawStatus : "";
  const news = await db.news.findMany({
    where: {
      ...(q ? { title: { contains: q } } : {}),
      ...(status ? { status } : {}),
    },
    select: { id: true, title: true, status: true, updatedAt: true },
    skip: (page - 1) * 30,
    take: 30,
    orderBy: { updatedAt: "desc" },
  });
  const pageHref = (nextPage: number) =>
    "/admin/novosti?" + new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), p: String(nextPage) }).toString();
  return (
    <div className="space-y-7">
      <div><p className="eyebrow mb-3">Uredništvo</p><h1 className="text-4xl font-extrabold tracking-tight">Novosti</h1><p className="mt-3 text-sm text-slate-500">Kreirajte nacrt ili odmah objavite novu informaciju.</p></div>
      {deleted && <p role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-teal-800">Novost je trajno uklonjena.</p>}
      <div className="admin-panel" id="nova-novost">
        <h2>Nova novost</h2>
        <p className="mb-5 text-sm leading-7 text-slate-500">Pripremite tekst kao nacrt, proverite sadržaj, pa ga objavite kada bude spreman.</p>
        <form action={createNewsAction} className="space-y-5">
          <div><label className="form-label" htmlFor="news-title">Naslov</label><input className="input-field" id="news-title" name="title" required minLength={5} maxLength={180}/></div>
          <div><label className="form-label" htmlFor="news-summary">Kratak opis</label><textarea className="input-field" id="news-summary" name="summary" rows={3} required minLength={10} maxLength={300}/></div>
          <div><label className="form-label" htmlFor="news-body">Tekst novosti</label><textarea className="input-field" id="news-body" name="body" rows={7} required minLength={20}/></div>
          <div className="flex flex-wrap gap-3"><SubmitButton name="publish" value="false" className="btn btn-light" pendingText="Čuvanje…">Sačuvaj nacrt</SubmitButton><SubmitButton name="publish" value="true" pendingText="Objavljivanje…">Objavi novost</SubmitButton></div>
        </form>
      </div>
      <div className="admin-panel">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="!mb-0">Postojeće novosti <span className="text-sm font-semibold text-slate-500">· strana {page}</span></h2>
          <a href="#nova-novost" className="text-sm font-bold text-teal-700 hover:underline">+ Nova novost</a>
        </div>
        <form className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px_auto]" role="search">
          <label className="sr-only" htmlFor="admin-news-q">Pretraga novosti</label>
          <input id="admin-news-q" type="search" name="q" defaultValue={q} placeholder="Pretraži naslov novosti…" className="input-field"/>
          <label className="sr-only" htmlFor="admin-news-status">Status novosti</label>
          <select id="admin-news-status" name="status" defaultValue={status} className="input-field">
            <option value="">Svi statusi</option><option value="DRAFT">Nacrti</option><option value="PUBLISHED">Objavljeno</option>
          </select>
          <button className="btn btn-primary">Prikaži</button>
        </form>
        {news.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Naslov</th><th>Status</th><th>Izmena</th><th>Akcija</th></tr></thead><tbody>
          {news.map((item) => <tr key={item.id}><td className="font-semibold"><Link href={"/admin/novosti/" + item.id} className="hover:text-teal-700">{item.title} <ArrowUpRight className="inline" size={14}/></Link></td><td><span className={item.status === "PUBLISHED" ? "pill" : "pill pill-neutral"}>{item.status === "PUBLISHED" ? "Objavljeno" : "Nacrt"}</span></td><td className="whitespace-nowrap">{item.updatedAt.toLocaleDateString("sr-RS")}</td><td><form action={togglePublishNewsAction}><input type="hidden" name="id" value={item.id}/><button className="text-sm font-bold text-teal-700 underline">{item.status === "PUBLISHED" ? "Povuci" : "Objavi"}</button></form></td></tr>)}
        </tbody></table></div> : <p className="text-sm text-slate-500">Nema novosti za zadatu pretragu. Promenite filter ili dodajte novu objavu.</p>}
        <nav aria-label="Stranice novosti" className="mt-6 flex justify-between gap-3">
          {page > 1 ? <Link href={pageHref(page - 1)} className="btn btn-light">← Prethodna</Link> : <span/>}
          {news.length === 30 && <Link href={pageHref(page + 1)} className="btn btn-light">Sledeća →</Link>}
        </nav>
      </div>
    </div>
  );
}
