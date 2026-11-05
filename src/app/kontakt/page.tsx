import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt i lokacija Katedre EEPSI, Fakultet tehničkih nauka, Novi Sad.",
};

export default function ContactPage() {
  return (
    <>
      <header className="portal-page-hero">
        <div className="container-page">
          <nav aria-label="Putanja" className="breadcrumbs"><Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Kontakt</span></nav>
          <p className="section-kicker !mb-2">KATEDRA / KONTAKT</p>
          <h1>Kontakt</h1>
          <p>Tu smo za vas. Adresa, telefon i email Katedre za elektroenergetiku i primenjeno softversko inženjerstvo.</p>
        </div>
      </header>
      <div className="container-page py-9 md:py-14">
        <section aria-labelledby="contact-details">
          <h2 id="contact-details" className="home-section-title !text-[clamp(25px,3vw,36px)]">Kontakt-informacije</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="card-surface p-6">
              <span className="feature-icon mb-5"><MapPin size={22} aria-hidden="true"/></span>
              <h3 className="text-lg font-extrabold">Adresa</h3>
              <address className="mt-3 not-italic text-sm leading-7 text-[#52627b]">
                Fakultet tehničkih nauka<br/>Fruškogorska 11, 21000 Novi Sad<br/>Naučno-tehnološki park<br/>2. sprat, kancelarija 223
              </address>
            </article>
            <article className="card-surface p-6">
              <span className="feature-icon mb-5"><Mail size={22} aria-hidden="true"/></span>
              <h3 className="text-lg font-extrabold">Email</h3>
              <p className="mt-3 break-words text-sm leading-7"><a href="mailto:eespsi@uns.ac.rs" className="font-bold text-[#284cdb] underline">eespsi@uns.ac.rs</a></p>
            </article>
            <article className="card-surface p-6">
              <span className="feature-icon mb-5"><Phone size={22} aria-hidden="true"/></span>
              <h3 className="text-lg font-extrabold">Telefon</h3>
              <p className="mt-3 text-sm leading-7"><a href="tel:+381214854533" className="font-bold text-[#284cdb] underline">021/485-4533</a></p>
            </article>
          </div>
        </section>

        <section aria-labelledby="other-content" className="mt-12 rounded-[20px] bg-[#172642] p-6 text-white md:p-9">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#9cb0ff]">INFORMACIJE ZA STUDENTE</p>
              <h2 id="other-content" className="mt-3 text-2xl font-extrabold tracking-tight">Tražite nešto konkretno?</h2>
              <p className="mt-2 text-sm leading-6 text-[#c7d3e8]">Nastavni materijali, obaveštenja i podaci o nastavnom osoblju dostupni su direktno na portalu.</p>
            </div>
          </div>
          <nav aria-label="Korisne stranice" className="mt-6 grid gap-3 sm:grid-cols-3">
            {[{ href: "/predmeti", text: "Predmeti" }, { href: "/novosti", text: "Obaveštenja" }, { href: "/nastavnici", text: "Nastavno osoblje" }].map(item =>
              <Link key={item.href} href={item.href} className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20">
                {item.text}<ArrowRight size={17} aria-hidden="true"/>
              </Link>
            )}
          </nav>
        </section>
      </div>
    </>
  );
}
