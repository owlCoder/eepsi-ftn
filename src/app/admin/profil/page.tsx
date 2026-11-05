import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockKeyhole, UserRound } from "lucide-react";
import { currentUser } from "@/application/authorization";
import { updateProfileAction } from "@/app/actions/profile";
import { PasswordChangeForm } from "@/components/password-change-form";
import { SubmitButton } from "@/components/submit-button";
import { roleLabels } from "@/domain/authorization/permissions";

export const metadata: Metadata = { title: "Moj profil", robots: { index: false, follow: false } };

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ updated?: string; unchanged?: string }> }) {
  const actor = await currentUser();
  if (!actor) redirect("/prijava");
  const { updated, unchanged } = await searchParams;

  return (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-3">Podešavanja naloga</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Moj profil</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">Uredite prikazano ime i zaštitite svoj nalog promenom lozinke.</p>
      </div>
      {updated && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-800">Profil je uspešno ažuriran.</p>}
      {unchanged && <p role="status" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">Ime je već sačuvano. Nisu potrebne dodatne izmene.</p>}
      <section className="admin-panel">
        <h2 className="flex items-center gap-3"><UserRound className="text-teal-700"/> Osnovni podaci</h2>
        <form action={updateProfileAction} className="space-y-5">
          <div><label className="form-label" htmlFor="profile-name">Ime i prezime</label><input className="input-field" id="profile-name" name="name" defaultValue={actor.name} minLength={3} maxLength={120} required/></div>
          <div><label className="form-label" htmlFor="profile-email">Email adresa</label><input className="input-field bg-slate-50" id="profile-email" value={actor.email} readOnly aria-describedby="email-note"/><p className="mt-2 text-xs text-slate-500" id="email-note">Za promenu email adrese obratite se administratoru.</p></div>
          <div><span className="form-label">Uloga</span><p className="pill">{roleLabels[actor.role]}</p></div>
          <SubmitButton pendingText="Čuvanje profila…">Sačuvaj profil</SubmitButton>
        </form>
      </section>
      <section className="admin-panel">
        <h2 className="flex items-center gap-3"><LockKeyhole className="text-teal-700"/> Bezbednost naloga</h2>
        <PasswordChangeForm/>
      </section>
    </div>
  );
}
