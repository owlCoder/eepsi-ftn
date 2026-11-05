import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AdminNavigation } from "@/components/admin-navigation";
import { currentUser } from "@/application/authorization";
import { roleLabels } from "@/domain/authorization/permissions";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await currentUser();
  if (!actor) redirect("/prijava");
  const canNews = actor.role === "EDITOR" || actor.role === "SUPER_ADMIN";
  const canUsers = actor.role === "SUPER_ADMIN";
  return (
    <div className="container-page admin-shell">
      <aside className="admin-sidebar h-fit rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-[102px]">
        <div className="mb-5 border-b border-slate-100 px-3 pb-5">
          <span className="eyebrow"><ShieldCheck size={14}/> EEPSI / Upravljački deo</span>
          <h2 className="mt-3 text-xl font-extrabold tracking-tight">Radni prostor</h2>
          <p className="mt-1 text-sm font-semibold text-slate-700">{actor.name}</p>
          <p className="meta-label mt-2">{roleLabels[actor.role]}</p>
        </div>
        <AdminNavigation canNews={canNews} canUsers={canUsers} isStudent={actor.role === "STUDENT"}/>
        <div className="mt-5 border-t border-slate-100 pt-3"><SignOutButton/></div>
      </aside>
      <section className="admin-pane">{children}</section>
    </div>
  );
}
