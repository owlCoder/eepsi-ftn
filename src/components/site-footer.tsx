import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="footer mt-auto">
      <div className="container-page footer-main">
        <div className="footer-identity">
          <Link href="/" className="footer-logo" aria-label="EEPSI — početna">FTN <span>/ EEPSI</span></Link>
          <p>Katedra za elektroenergetiku i primenjeno softversko inženjerstvo</p>
        </div>
        <div>
          <h2 className="footer-heading">BRZE VEZE</h2>
          <nav aria-label="Navigacija u podnožju" className="footer-links">
            <Link href="/predmeti">Predmeti</Link>
            <Link href="/novosti">Obaveštenja</Link>
            <Link href="/nastavnici">Nastavno osoblje</Link>
            <Link href="/admin">Pristup portalu</Link>
          </nav>
        </div>
        <div>
          <h2 className="footer-heading">INFORMACIJE</h2>
          <nav aria-label="Informacije o katedri" className="footer-links">
            <Link href="/o-katedri">O katedri</Link>
            <Link href="/laboratorija">Laboratorija</Link>
            <Link href="/istrazivanje">Istraživanje</Link>
            <Link href="/saradnja">Saradnja</Link>
          </nav>
        </div>
        <div>
          <h2 className="footer-heading">KONTAKT</h2>
          <address className="footer-contact">
            <span><MapPin size={16} aria-hidden="true"/> Fruškogorska 11, NTP<br/>Novi Sad</span>
            <a href="mailto:eespsi@uns.ac.rs"><Mail size={16} aria-hidden="true"/> eespsi@uns.ac.rs</a>
            <a href="tel:+381214854533"><Phone size={16} aria-hidden="true"/> 021/485-4533</a>
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-page footer-bottom-inner">
          <span>© {new Date().getFullYear()} EEPSI · Fakultet tehničkih nauka, Univerzitet u Novom Sadu</span>
          <span>
            Fotografija FTN: <a href="https://commons.wikimedia.org/wiki/File:Fakultet_tehni%C4%8Dkih_nauka_Univerziteta_u_Novom_Sadu_04.jpg" target="_blank" rel="noopener noreferrer">Nikolina Šepić / Wikimedia Commons</a>
            {" · "}<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a> (kadrirano)
          </span>
        </div>
      </div>
    </footer>
  );
}
