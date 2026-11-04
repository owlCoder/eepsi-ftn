import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { SubmitButton } from "@/components/submit-button";
import { can } from "@/application/authorization";
import { updateNewsAction, togglePublishNewsAction, deleteNewsAction } from "@/app/actions/news";
import { db } from "@/infrastructure/db/prisma";

export default async function EditNews({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  if (!(await can("news.write"))) notFound();
  const { id } = await params;
  const item = await db.news.findUnique({ where: { id } });
  if (!item) notFound();
  const { saved } = await searchParams;
  return <div className="space-y-7"><Link href="/admin/novosti" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={17}/> Sve novosti</Link>
    <div><p className="eyebrow mb-2">Uređivanje</p><h1 className="text-3xl font-extrabold tracking-tight">{item.title}</h1>
      {item.status === "PUBLISHED" && <Link className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-teal-700" href={"/novosti/" + item.slug} target="_blank">Pogledaj objavu <ExternalLink size={16}/></Link>}
    </div>
    {saved && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Izmene su sačuvane.</p>}
    <div className="admin-panel"><form action={updateNewsAction} className="space-y-5">
      <input type="hidden" name="id" value={item.id}/>
      <div><label htmlFor="news-title" className="form-label">Naslov</label><input id="news-title" name="title" className="input-field" required minLength={5} maxLength={180} defaultValue={item.title}/></div>
      <div><label htmlFor="news-summary" className="form-label">Opis</label><textarea id="news-summary" name="summary" className="input-field" required minLength={10} maxLength={300} rows={3} defaultValue={item.summary}/></div>
      <div><label htmlFor="news-body" className="form-label">Sadržaj</label><textarea id="news-body" name="body" className="input-field" required minLength={20} rows={11} defaultValue={item.body}/></div>
      <SubmitButton>Sačuvaj izmene</SubmitButton>
    </form></div>
    <div className="admin-panel"><div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-sm font-semibold">Status: <span className={item.status === "PUBLISHED" ? "pill" : "pill pill-neutral"}>{item.status === "PUBLISHED" ? "Objavljeno" : "Nacrt"}</span></p>
        <p className="mt-2 text-xs text-slate-500">Objavljivanje određuje dostupnost novosti na javnom portalu.</p></div>
      <form action={togglePublishNewsAction}><input name="id" type="hidden" value={item.id}/><SubmitButton className="btn btn-light" pendingText="Ažuriranje…">{item.status === "PUBLISHED" ? "Povuci objavu" : "Objavi sada"}</SubmitButton></form>
    </div></div>
    <div className="admin-panel border-rose-100 bg-rose-50/30">
      <h2 className="!mb-2 text-rose-900">Ukloni novost</h2>
      <p className="mb-5 text-sm leading-7 text-slate-600">Brisanje je trajno i uklanja novost i sa javnog sajta. Za privremeno sakrivanje koristite „Povuci objavu“.</p>
      <form action={deleteNewsAction}><input type="hidden" name="id" value={item.id}/>
        <ConfirmSubmitButton message={"Trajno obrisati novost „" + item.title + "“?"} className="btn btn-danger"><Trash2 size={16}/> Trajno obriši</ConfirmSubmitButton>
      </form>
    </div>
  </div>;
}
