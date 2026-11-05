import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { BrandGlyph } from "@/components/energy-network";

export function SiteFooter() {
  return (
    <footer className="footer mt-auto">
      <div className="container-page py-13 md:py-17">
        <div className="mb-11 flex flex-wrap items-start justify-between gap-7 border-b border-[#4b6661] pb-9">
          <div className="flex items-center gap-4">
            <span className="brand-mark !bg-[#f4f2ec] !text-[#1a2c31]"><BrandGlyph/></span>
            <div>
              <strong className="block text-xl font-extrabold tracking-[-.05em] text-[#f4f2ec]">EEPSI / FTN</strong>
              <span className="meta-label !text-[#a8b9b3]">Elektroenergetika i primenjeno softversko inženjerstvo</span>
            </div>
          </div>
          <span className="meta-label !text-[#a8b9b3]">Fakultet tehničkih nauka, Novi Sad</span>
        </div>
        <div className="grid gap-10 md:grid-cols-[1.2fr_.75fr_1.1fr]">
          <div>
            <h2 className="meta-label mb-4 !text-[#b9c8c2]">01 / Katedra</h2>
            <p className="max-w-sm text-base leading-8 text-[#d7ded7]">Obrazovanje, istraživanje i praktična primena elektroenergetike i softverskih sistema.</p>
            <Link href="/o-katedri" className="mt-5 inline-flex items-center gap-2 border-b border-[#d49b78] pb-1 text-sm font-semibold">O katedri <ArrowUpRight size={15}/></Link>
          </div>
          <div>
            <h2 className="meta-label mb-4 !text-[#b9c8c2]">02 / Sadržaj</h2>
            <div className="grid gap-2 text-sm">
              <Link href="/predmeti">Predmeti</Link>
              <Link href="/nastavnici">Nastavni tim</Link>
              <Link href="/novosti">Novosti</Link>
              <Link href="/istrazivanje">Istraživanje</Link>
              <Link href="/laboratorija">Smart Grid laboratorija</Link>
              <Link href="/saradnja">Saradnja sa privredom</Link>
            </div>
          </div>
          <div>
            <h2 className="meta-label mb-4 !text-[#b9c8c2]">03 / Kontakt</h2>
            <div className="grid gap-4 text-sm leading-7">
              <span className="flex gap-3"><MapPin size={17} className="mt-1 shrink-0 text-[#d49b78]"/> Fruškogorska 11, NTP, 2. sprat, kancelarija 223, Novi Sad</span>
              <a href="mailto:eespsi@uns.ac.rs" className="flex gap-3"><Mail size={17} className="mt-1 shrink-0 text-[#d49b78]"/> eespsi@uns.ac.rs <ArrowUpRight size={14}/></a>
              <a href="tel:+381214854533" className="flex gap-3"><Phone size={17} className="mt-1 shrink-0 text-[#d49b78]"/> 021/485-4533</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-rule py-4">
        <div className="container-page flex flex-wrap items-center justify-between gap-3">
          <span className="meta-label !text-[#a8b9b3]">© {new Date().getFullYear()} EEPSI · Fakultet tehničkih nauka</span>
          <Link href="/prijava" className="meta-label !text-[#a8b9b3]">Pristup portalu</Link>
        </div>
      </div>
    </footer>
  );
}
