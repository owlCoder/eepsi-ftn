import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@/application/authorization";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Prijava", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ changed?: string }> }) {
  if (await currentUser()) redirect("/admin");
  const { changed } = await searchParams;

  return (
    <div className="container-page academic-inner-page">
      <nav aria-label="Putanja" className="breadcrumbs">
        <Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Prijava</span>
      </nav>
      <div className="academic-login-layout">
        <div className="academic-login-intro">
          <p className="academic-login-kicker">EEPSI / KORISNIČKI PRISTUP</p>
          <h1>Prijava na portal</h1>
          <p>Pristup radnom prostoru za ovlašćene korisnike katedre.</p>
          <section className="academic-login-public" aria-labelledby="public-content-heading">
            <h2 id="public-content-heading">Za pregled nastavnog sadržaja nije potrebna prijava.</h2>
            <p>Predmeti, materijali i objavljena obaveštenja javno su dostupni.</p>
            <nav aria-label="Javno dostupne informacije">
              <Link href="/predmeti">Katalog predmeta <ArrowRight size={16} aria-hidden="true"/></Link>
              <Link href="/novosti">Obaveštenja <ArrowRight size={16} aria-hidden="true"/></Link>
            </nav>
          </section>
        </div>
        <section aria-labelledby="login-form-heading" className="academic-login-form">
          <h2 id="login-form-heading">Pristup nalogu</h2>
          <p>Unesite podatke povezane sa vašim nalogom.</p>
          {changed === "1" && <p role="status" className="mt-5 rounded-md border border-[#b6dbc8] bg-[#edf8f2] p-4 text-sm font-semibold text-[#235942]">
            Lozinka je promenjena. Prijavite se ponovo.
          </p>}
          <div className="mt-6"><LoginForm/></div>
          <div className="academic-login-help">
            <p>Nemate nalog ili ste zaboravili lozinku?</p>
            <a href="mailto:eespsi@uns.ac.rs?subject=EEPSI%20portal%20-%20pomo%C4%87%20oko%20naloga">
              Kontaktirajte administraciju katedre
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
