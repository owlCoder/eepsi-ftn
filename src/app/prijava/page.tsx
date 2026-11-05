import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { currentUser } from "@/application/authorization";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Prijava", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ changed?: string }> }) {
  if (await currentUser()) redirect("/admin");
  const { changed } = await searchParams;
  return (
    <div className="container-page grid items-start gap-8 py-9 md:py-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <aside className="hidden min-h-[470px] flex-col justify-between rounded-[24px] bg-[#152341] p-10 text-white lg:flex">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-[#9cb0ff]"><LockKeyhole size={16}/> EEPSI / PORTAL</span>
          <h2 className="mt-9 max-w-[380px] text-[clamp(32px,3vw,46px)] font-extrabold leading-tight tracking-[-.055em]">Za nastavu ne moraš da se prijavljuješ.</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#c5cee2]">Predmeti, nastavni materijali i objavljena obaveštenja dostupni su direktno iz javnog dela portala.</p>
        </div>
        <nav aria-label="Javno dostupne informacije" className="mt-10 grid gap-3 border-t border-white/20 pt-6">
          <Link href="/predmeti" className="flex items-center justify-between gap-3 font-bold text-white hover:text-[#c3ceff]">Katalog predmeta <ArrowRight size={18}/></Link>
          <Link href="/novosti" className="flex items-center justify-between gap-3 font-bold text-white hover:text-[#c3ceff]">Obaveštenja <ArrowRight size={18}/></Link>
        </nav>
      </aside>
      <div className="min-w-0 lg:py-3">
        <nav aria-label="Putanja" className="breadcrumbs"><Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Prijava</span></nav>
        <p className="section-kicker !mb-3">KORISNIČKI PRISTUP</p>
        <h1 className="page-title">Prijava na portal</h1>
        <p className="section-copy mt-3">Za nastavnike, saradnike, studente i uredništvo katedre.</p>
        <section className="detail-panel mt-7 !p-6 sm:!p-8">
          <h2 className="mb-6 text-lg font-extrabold">Pristup nalogu</h2>
          {changed && <p role="status" className="mb-5 rounded-xl border border-[#b6dbc8] bg-[#edf8f2] p-4 text-sm font-semibold text-[#235942]">Lozinka je promenjena. Prijavite se ponovo.</p>}
          <LoginForm/>
          <div className="mt-7 border-t border-[#e4e8f0] pt-5">
            <p className="text-sm text-[#65728a]">Nemate nalog ili ste zaboravili lozinku?</p>
            <a href="mailto:eespsi@uns.ac.rs?subject=EEPSI%20portal%20-%20pomo%C4%87%20oko%20naloga"
              className="mt-2 inline-block text-sm font-bold text-[#284cdb] underline">Kontaktirajte administraciju katedre</a>
          </div>
        </section>
        <p className="mt-5 text-sm text-[#65728a] lg:hidden">Javni predmeti i obaveštenja su dostupni <Link href="/predmeti" className="font-bold text-[#284cdb] underline">bez prijave</Link>.</p>
      </div>
    </div>
  );
}
