import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="footer mt-auto">
      <div className="container-page footer-main">
        <div className="footer-identity">
          <Link href="/" className="footer-logo" aria-label="EEPSI — početna">EEPSI<span>.</span></Link>
          <p>Katedra za elektroenergetiku i primenjeno softversko inženjerstvo</p>
          <span className="footer-institution">Fakultet tehničkih nauka · Univerzitet u Novom Sadu</span>
        </div>
        <div>
          <h2 className="footer-heading">ZA STUDENTE</h2>
          <nav aria-label="Navigacija u podnožju" className="footer-links">
            <Link href="/predmeti">Predmeti <ArrowUpRight size={15} aria-hidden="true"/></Link>
            <Link href="/novosti">Obaveštenja <ArrowUpRight size={15} aria-hidden="true"/></Link>
            <Link href="/nastavnici">Nastavno osoblje <ArrowUpRight size={15} aria-hidden="true"/></Link>
            <Link href="/admin">Moj portal <ArrowUpRight size={15} aria-hidden="true"/></Link>
          </nav>
        </div>
        <div>
          <h2 className="footer-heading">KATEDRA</h2>
          <nav aria-label="Informacije o katedri" className="footer-links">
            <Link href="/o-katedri">O katedri</Link>
            <Link href="/istrazivanje">Istraživanje</Link>
            <Link href="/laboratorija">Smart Grid laboratorija</Link>
            <Link href="/saradnja">Saradnja sa privredom</Link>
          </nav>
        </div>
        <div>
          <h2 className="footer-heading">KONTAKT</h2>
          <address className="footer-contact">
            <span><MapPin size={17} aria-hidden="true"/> Fruškogorska 11, NTP, 2. sprat<br/>21000 Novi Sad</span>
            <a href="mailto:eespsi@uns.ac.rs"><Mail size={17} aria-hidden="true"/> eespsi@uns.ac.rs</a>
          </address>
          <Link href="/kontakt" className="footer-contact-link">Sve kontakt-informacije <ArrowUpRight size={15} aria-hidden="true"/></Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-page flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} EEPSI · Fakultet tehničkih nauka</span>
          <span>Univerzitet u Novom Sadu</span>
        </div>
      </div>
    </footer>
  );
}
