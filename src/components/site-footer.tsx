import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer mt-auto">
      <div className="container-page grid gap-10 py-11 md:grid-cols-[1.35fr_1fr_1fr] md:gap-14 md:py-13">
        <div>
          <p className="text-xl font-bold tracking-tight text-white">EEPSI <span className="font-normal text-slate-300">/ FTN</span></p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[#d4e1ed]">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo, Fakultet tehničkih nauka, Univerzitet u Novom Sadu.</p>
          <Link href="/o-katedri" className="mt-5 inline-block text-sm font-semibold underline">Više o katedri</Link>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">Informacije</h2>
          <nav aria-label="Navigacija u podnožju" className="grid gap-2 text-sm">
            <Link href="/predmeti">Predmeti</Link>
            <Link href="/nastavnici">Nastavno osoblje</Link>
            <Link href="/novosti">Obaveštenja</Link>
            <Link href="/istrazivanje">Istraživanje</Link>
            <Link href="/laboratorija">Smart Grid laboratorija</Link>
            <Link href="/saradnja">Saradnja sa privredom</Link>
          </nav>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">Kontakt</h2>
          <address className="not-italic text-sm leading-7 text-[#d4e1ed]">
            Fruškogorska 11, NTP<br/>
            2. sprat, kancelarija 223<br/>
            21000 Novi Sad<br/>
            <a href="mailto:eespsi@uns.ac.rs" className="mt-2 inline-block underline">eespsi@uns.ac.rs</a><br/>
            <a href="tel:+381214854533" className="underline">021/485-4533</a>
          </address>
          <Link href="/kontakt" className="mt-3 inline-block text-sm font-semibold underline">Sve kontakt-informacije</Link>
        </div>
      </div>
      <div className="border-t border-[#36516a] py-4">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 text-xs text-[#d4e1ed]">
          <span>© {new Date().getFullYear()} EEPSI — Fakultet tehničkih nauka</span>
          <Link href="/admin">Pristup portalu</Link>
        </div>
      </div>
    </footer>
  );
}
