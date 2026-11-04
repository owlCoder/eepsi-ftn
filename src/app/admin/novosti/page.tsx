import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { can } from "@/application/authorization";
import { createNewsAction, togglePublishNewsAction } from "@/app/actions/news";
import { db } from "@/infrastructure/db/prisma";

export default async function AdminNews() {
  if (!(await can("news.write"))) notFound();
  const news = await db.news.findMany({
    select: { id: true, title: true, status: true, updatedAt: true },
    take: 50,
    orderBy: { updatedAt: "desc" },
  });
  return (
    <div className="space-y-7">
      <div><p className="eyebrow mb-3">Uredništvo</p><h1 className="text-4xl font-extrabold tracking-tight">Novosti</h1><p className="mt-3 text-sm text-slate-500">Kreirajte nacrt ili odmah objavite novu informaciju.</p></div>
      <div className="admin-panel">
        <h2>Nova novost</h2>
        <form action={createNewsAction} className="space-y-5">
          <div><label className="form-label" htmlFor="news-title">Naslov</label><input className="input-field" id="news-title" name="title" required minLength={5} maxLength={180}/></div>
          <div><label className="form-label" htmlFor="news-summary">Kratak opis</label><textarea className="input-field" id="news-summary" name="summary" rows={3} required minLength={10} maxLength={300}/></div>
          <div><label className="form-label" htmlFor="news-body">Tekst novosti</label><textarea className="input-field" id="news-body" name="body" rows={7} required minLength={20}/></div>
          <div className="flex flex-wrap gap-3"><button type="submit" name="publish" value="false" className="btn btn-light">Sačuvaj nacrt</button><button type="submit" name="publish" value="true" className="btn btn-primary">Objavi novost</button></div>
        </form>
      </div>
      <div className="admin-panel">
        <h2>Postojeće novosti</h2>
        {news.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Naslov</th><th>Status</th><th>Izmena</th><th>Akcija</th></tr></thead><tbody>
          {news.map((item) => <tr key={item.id}><td className="font-semibold"><Link href={"/admin/novosti/" + item.id} className="hover:text-teal-700">{item.title} <ArrowUpRight className="inline" size={14}/></Link></td><td><span className={item.status === "PUBLISHED" ? "pill" : "pill pill-neutral"}>{item.status === "PUBLISHED" ? "Objavljeno" : "Nacrt"}</span></td><td className="whitespace-nowrap">{item.updatedAt.toLocaleDateString("sr-RS")}</td><td><form action={togglePublishNewsAction}><input type="hidden" name="id" value={item.id}/><button className="text-sm font-bold text-teal-700 underline">{item.status === "PUBLISHED" ? "Povuci" : "Objavi"}</button></form></td></tr>)}
        </tbody></table></div> : <p className="text-sm text-slate-500">Nema dodatih novosti.</p>}
      </div>
    </div>
  );
}
