import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="footer mt-auto">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3"><BookOpenCheck className="text-emerald-300" size={26}/><strong className="text-xl text-white">EEPSI FTN</strong></div>
          <p className="max-w-sm text-sm leading-7 text-slate-300">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo — znanje, tehnologija i inovacije na jednom mestu.</p>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">Navigacija</h3>
          <div className="grid gap-3 text-sm">
            <Link href="/predmeti">Predmeti</Link>
            <Link href="/nastavnici">Nastavni tim</Link>
            <Link href="/novosti">Novosti i obaveštenja</Link>
            <Link href="/o-katedri">O katedri</Link>
            <Link href="/istrazivanje">Istraživanje</Link>
            <Link href="/saradnja">Saradnja sa privredom</Link>
            <Link href="/laboratorija">Smart Grid laboratorija</Link>
            <Link href="/prijava">Prijava</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">Kontakt</h3>
          <div className="grid gap-4 text-sm">
            <span className="flex gap-3"><MapPin size={17} className="shrink-0 text-teal-300"/> Fruškogorska 11, NTP, 2. sprat, kanc. 223</span>
            <a href="mailto:eespsi@uns.ac.rs" className="flex gap-3"><Mail size={17} className="shrink-0 text-teal-300"/> eespsi@uns.ac.rs <ArrowUpRight size={13}/></a>
            <a href="tel:+381214854533" className="flex gap-3"><Phone size={17} className="shrink-0 text-teal-300"/> 021/485-4533</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-wrap justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} EEPSI • Fakultet tehničkih nauka</span>
          <span>Za studente, nastavnike i saradnike</span>
        </div>
      </div>
    </footer>
  );
}
