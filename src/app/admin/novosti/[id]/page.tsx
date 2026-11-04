import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { can } from "@/application/authorization";
import { updateNewsAction, togglePublishNewsAction } from "@/app/actions/news";
import { db } from "@/infrastructure/db/prisma";

export default async function EditNews({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  if (!(await can("news.write"))) notFound();
  const { id } = await params;
  const item = await db.news.findUnique({ where: { id } });
  if (!item) notFound();
  const { saved } = await searchParams;
  return <div className="space-y-7"><Link href="/admin/novosti" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={17}/> Sve novosti</Link>
    <div><p className="eyebrow mb-2">Uređivanje</p><h1 className="text-3xl font-extrabold tracking-tight">{item.title}</h1></div>
    {saved && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Izmene su sačuvane.</p>}
    <div className="admin-panel"><form action={updateNewsAction} className="space-y-5">
      <input type="hidden" name="id" value={item.id}/>
      <div><label htmlFor="news-title" className="form-label">Naslov</label><input id="news-title" name="title" className="input-field" required minLength={5} maxLength={180} defaultValue={item.title}/></div>
      <div><label htmlFor="news-summary" className="form-label">Opis</label><textarea id="news-summary" name="summary" className="input-field" required minLength={10} maxLength={300} rows={3} defaultValue={item.summary}/></div>
      <div><label htmlFor="news-body" className="form-label">Sadržaj</label><textarea id="news-body" name="body" className="input-field" required minLength={20} rows={11} defaultValue={item.body}/></div>
      <button className="btn btn-primary">Sačuvaj izmene</button>
    </form></div>
    <div className="admin-panel"><div className="flex flex-wrap items-center justify-between gap-4"><p className="text-sm font-semibold">Status: {item.status === "PUBLISHED" ? "Objavljeno" : "Nacrt"}</p><form action={togglePublishNewsAction}><input name="id" type="hidden" value={item.id}/><button className="btn btn-light">{item.status === "PUBLISHED" ? "Povuci objavu" : "Objavi sada"}</button></form></div></div>
  </div>;
}
