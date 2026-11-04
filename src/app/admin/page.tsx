import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Newspaper, ShieldCheck, Users } from "lucide-react";
import { currentUser, can } from "@/application/authorization";
import { db } from "@/infrastructure/db/prisma";
import { roleLabels } from "@/domain/authorization/permissions";

export default async function AdminDashboard() {
  const actor = await currentUser();
  if (!actor) return null;
  const [newsCount, coursesCount, usersCount, canNews, canCreateCourse, canManageUsers] = await Promise.all([
    db.news.count(),
    db.course.count(),
    actor.role === "SUPER_ADMIN" ? db.user.count() : Promise.resolve(null),
    can("news.write"),
    can("courses.create"),
    can("users.manage"),
  ]);
  return (
    <div>
      <div className="mb-8"><p className="eyebrow mb-3">Kontrolna tabla</p><h1 className="text-4xl font-extrabold tracking-tight">Zdravo, {actor.name.split(" ")[0]}.</h1><p className="mt-3 text-sm leading-7 text-slate-500">Vaša uloga: <strong className="text-slate-700">{roleLabels[actor.role]}</strong>. Vidite samo opcije koje su dostupne vašem nalogu.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[{ label: "Predmeti", value: coursesCount, icon: BookOpen }, { label: "Novosti", value: newsCount, icon: Newspaper }, ...(usersCount === null ? [] : [{ label: "Korisnici", value: usersCount, icon: Users }])].map((item) =>
          <div key={item.label} className="card-surface p-7"><item.icon className="text-teal-700" size={25}/><p className="mt-6 text-3xl font-extrabold">{item.value}</p><p className="mt-1 text-sm font-semibold text-slate-500">{item.label}</p></div>)}
      </div>
      <div className="admin-panel mt-7">
        <h2>Brze akcije</h2>
        <div className="grid gap-3">
          {canNews && <Link href="/admin/novosti" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-bold hover:bg-teal-50"><span className="flex items-center gap-3"><FileText size={18} className="text-teal-700"/> Objavi novost</span><ArrowRight size={17}/></Link>}
          <Link href="/admin/predmeti" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-bold hover:bg-teal-50"><span className="flex items-center gap-3"><BookOpen size={18} className="text-teal-700"/>{canCreateCourse ? "Upravljaj predmetima" : "Moji predmeti"}</span><ArrowRight size={17}/></Link>
          {canManageUsers && <Link href="/admin/korisnici" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-bold hover:bg-teal-50"><span className="flex items-center gap-3"><ShieldCheck size={18} className="text-teal-700"/> Uloge i prava pristupa</span><ArrowRight size={17}/></Link>}
          {!canNews && !canCreateCourse && <p className="mt-2 text-sm text-slate-500">Dozvole za izmene su ograničene na predmete na kojima ste angažovani.</p>}
        </div>
      </div>
    </div>
  );
}
