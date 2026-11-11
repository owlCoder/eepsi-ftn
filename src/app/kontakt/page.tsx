import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt i lokacija Katedre EEPSI, Fakultet tehničkih nauka, Novi Sad.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <div className="container-page academic-inner-page">
      <nav aria-label="Putanja" className="breadcrumbs">
        <Link href="/">Početna</Link><span aria-hidden="true">/</span><span>Kontakt</span>
      </nav>
      <header className="academic-page-heading">
        <h1>Kontakt</h1>
        <p>Katedra za elektroenergetiku i primenjeno softversko inženjerstvo, Fakultet tehničkih nauka u Novom Sadu.</p>
      </header>

      <div className="academic-contact-grid">
        <section aria-labelledby="contact-details" className="academic-contact-details">
          <h2 id="contact-details">Kontakt-informacije</h2>
          <dl className="academic-contact-list">
            <div>
              <dt>Adresa</dt>
              <dd><address>
                Fakultet tehničkih nauka<br/>
                Fruškogorska 11, 21000 Novi Sad<br/>
                Naučno-tehnološki park, 2. sprat<br/>
                Kancelarija 223
              </address></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href="mailto:eespsi@uns.ac.rs">eespsi@uns.ac.rs</a></dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd><a href="tel:+381214854533">021/485-4533</a></dd>
            </div>
          </dl>
        </section>
        <aside aria-labelledby="contact-student-heading" className="academic-contact-related">
          <h2 id="contact-student-heading">Informacije za studente</h2>
          <p>Predmeti, materijali i objavljena obaveštenja dostupni su javno, bez prijave.</p>
          <nav aria-label="Korisne stranice" className="academic-contact-links">
            <Link href="/predmeti">Katalog predmeta <ArrowRight size={17} aria-hidden="true"/></Link>
            <Link href="/novosti">Obaveštenja <ArrowRight size={17} aria-hidden="true"/></Link>
            <Link href="/nastavnici">Nastavno osoblje <ArrowRight size={17} aria-hidden="true"/></Link>
          </nav>
        </aside>
      </div>
    </div>
  );
}
