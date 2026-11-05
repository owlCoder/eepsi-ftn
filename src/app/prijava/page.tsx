import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/application/authorization";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Prijava", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ changed?: string }> }) {
  if (await currentUser()) redirect("/admin");
  const { changed } = await searchParams;
  return (
    <div className="container-page py-11 md:py-16">
      <div className="mx-auto max-w-[490px]">
        <nav aria-label="Putanja" className="mb-5 text-xs text-[#556777]"><Link href="/" className="hover:underline">Početna</Link> / Prijava</nav>
        <h1 className="page-title">Prijava na portal</h1>
        <p className="section-copy mt-3">Za nastavnike, saradnike, studente i uredništvo katedre.</p>
        <section className="mt-7 rounded-lg border border-[#dce3e9] bg-white p-6 sm:p-8">
          <h2 className="mb-5 text-lg font-bold">Prijavite se</h2>
          {changed && <p role="status" className="mb-5 rounded-md border border-[#b6dbc8] bg-[#edf8f2] p-4 text-sm font-semibold text-[#235942]">Lozinka je promenjena. Prijavite se ponovo.</p>}
          <LoginForm/>
          <div className="mt-7 border-t border-[#dce3e9] pt-5">
            <p className="text-sm text-[#556777]">Nemate nalog ili ste zaboravili lozinku?</p>
            <a href="mailto:eespsi@uns.ac.rs?subject=EEPSI%20portal%20-%20pomo%C4%87%20oko%20naloga" className="mt-2 inline-block text-sm font-semibold text-[#173b63] underline">Kontaktirajte administraciju katedre</a>
          </div>
        </section>
        <p className="mt-5 text-center text-xs text-[#556777]">Za pregled javnih informacija nije potrebna prijava.</p>
      </div>
    </div>
  );
}
