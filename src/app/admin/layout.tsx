import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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
      <aside className="admin-sidebar h-fit p-4 lg:sticky lg:top-[112px]">
        <div className="border-b border-[#dce3e9] px-2 pb-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#556777]">EEPSI / Portal</p>
          <h2 className="mt-2 text-lg font-bold">Radni prostor</h2>
          <p className="mt-4 break-words text-sm font-semibold">{actor.name}</p>
          <p className="mt-1 text-xs text-[#556777]">{roleLabels[actor.role]}</p>
        </div>
        <div className="py-4"><AdminNavigation canNews={canNews} canUsers={canUsers} isStudent={actor.role === "STUDENT"}/></div>
        <div className="border-t border-[#dce3e9] px-2 pt-4">
          <Link href="/" className="mb-3 inline-block text-xs font-semibold text-[#173b63] underline">← Javni sajt</Link>
          <SignOutButton/>
        </div>
      </aside>
      <section className="admin-pane min-w-0">{children}</section>
    </div>
  );
}
