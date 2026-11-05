import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/application/authorization";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Prijava", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ changed?: string }> }) {
  if (await currentUser()) redirect("/admin");
  const { changed } = await searchParams;
  return <div className="container-page grid min-h-[68vh] items-center gap-0 py-13 md:grid-cols-[.85fr_1.15fr] md:py-19">
    <div className="flex h-full flex-col justify-between bg-[#1a2c31] p-8 text-[#f4f2ec] md:p-11">
      <div>
        <span className="meta-label !text-[#d49b78]">EEPSI / FTN</span>
        <h1 className="display-serif mt-12 text-4xl leading-[1.15] md:text-5xl">Pristup portalu katedre.</h1>
        <p className="mt-6 max-w-sm text-sm leading-8 text-[#cedad2]">Prostor za nastavnike, saradnike, studente i uredništvo. Pristup je moguć samo uz dodeljen nalog.</p>
      </div>
      <div className="mt-12 border-t border-[#536b63] pt-5"><span className="meta-label !text-[#b9c8c2]">Autorizovani pristup / EEPSI</span></div>
    </div>
    <section className="border border-[#d3d6ce] bg-[#fffefa] p-8 md:p-12">
      <p className="eyebrow mb-4">Prijava / Nalog</p>
      <h2 className="display-serif text-3xl">Prijavite se</h2>
      <p className="mb-8 mt-4 text-sm leading-7 text-[#5a6b6d]">Unesite email adresu i lozinku dobijenu od administratora katedre.</p>
      {changed && <p role="status" className="mb-5 border-l-2 border-[#205d57] bg-[#e4f2e9] p-4 text-sm font-semibold text-[#164840]">Lozinka je promenjena. Prijavite se ponovo.</p>}
      <LoginForm/>
      <div className="mt-8 border-t border-[#d3d6ce] pt-6">
        <p className="text-xs text-[#5a6b6d]">Nemate nalog ili ste zaboravili lozinku?</p>
        <a href="mailto:eespsi@uns.ac.rs?subject=EEPSI%20portal%20-%20pomo%C4%87%20oko%20naloga" className="mt-2 inline-flex min-h-10 items-center text-sm font-bold text-[#8b371d] underline">Kontaktirajte administraciju katedre</a>
      </div>
    </section>
  </div>;
}
