import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookOpen, LayoutDashboard, Newspaper, ShieldCheck, Users, ScrollText } from "lucide-react";
import { currentUser } from "@/application/authorization";
import { roleLabels } from "@/domain/authorization/permissions";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await currentUser();
  if (!actor) redirect("/prijava");
  if (actor.role === "STUDENT") notFound();
  const canNews = actor.role === "EDITOR" || actor.role === "SUPER_ADMIN";
  const canUsers = actor.role === "SUPER_ADMIN";
  return (
    <div className="container-page admin-shell">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-[110px]">
        <div className="mb-5 border-b border-slate-100 px-3 pb-5">
          <span className="eyebrow"><ShieldCheck size={14}/> Sigurna zona</span>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight">Moj portal</h2>
          <p className="mt-1 text-sm font-semibold text-slate-700">{actor.name}</p>
          <p className="mt-1 text-xs text-slate-500">{roleLabels[actor.role]}</p>
        </div>
        <nav className="admin-nav" aria-label="Administracija">
          <Link href="/admin" className="flex items-center gap-2"><LayoutDashboard size={17}/> Pregled</Link>
          {canNews && <Link href="/admin/novosti" className="flex items-center gap-2"><Newspaper size={17}/> Novosti</Link>}
          <Link href="/admin/predmeti" className="flex items-center gap-2"><BookOpen size={17}/> Predmeti</Link>
          {canUsers && <Link href="/admin/korisnici" className="flex items-center gap-2"><Users size={17}/> Korisnici / RBAC</Link>}
          {canUsers && <Link href="/admin/audit" className="flex items-center gap-2"><ScrollText size={17}/> Audit log</Link>}
        </nav>
        <div className="mt-5 border-t border-slate-100 pt-3"><SignOutButton/></div>
      </aside>
      <section className="admin-pane">{children}</section>
    </div>
  );
}
