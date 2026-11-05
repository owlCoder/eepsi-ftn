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
      <header className="page-banner"><div className="container-page">
        <nav aria-label="Putanja" className="mb-5 text-xs text-[#556777]"><Link href="/" className="hover:underline">Početna</Link> / Kontakt</nav>
        <h1 className="page-title">Kontakt</h1>
        <p className="section-copy mt-3 max-w-2xl">Informacije o lokaciji i načinu kontaktiranja Katedre za elektroenergetiku i primenjeno softversko inženjerstvo.</p>
      </div></header>
      <div className="container-page grid gap-10 py-12 md:grid-cols-[minmax(0,1fr)_minmax(280px,.7fr)] md:py-16">
        <section aria-labelledby="contact-details">
          <h2 id="contact-details" className="section-heading mb-6">Podaci za kontakt</h2>
          <dl className="divide-y divide-[#dce3e9] overflow-hidden rounded-lg border border-[#dce3e9] bg-white">
            <div className="grid gap-3 p-5 sm:grid-cols-[145px_1fr] sm:gap-6"><dt className="flex items-center gap-2 text-sm font-semibold text-[#556777]"><MapPin size={16} aria-hidden="true"/> Adresa</dt><dd className="text-sm leading-7">Fakultet tehničkih nauka<br/>Fruškogorska 11, 21000 Novi Sad<br/>Naučno-tehnološki park, 2. sprat, kancelarija 223</dd></div>
            <div className="grid gap-3 p-5 sm:grid-cols-[145px_1fr] sm:gap-6"><dt className="flex items-center gap-2 text-sm font-semibold text-[#556777]"><Mail size={16} aria-hidden="true"/> Email</dt><dd><a href="mailto:eespsi@uns.ac.rs" className="font-semibold text-[#173b63] underline">eespsi@uns.ac.rs</a></dd></div>
            <div className="grid gap-3 p-5 sm:grid-cols-[145px_1fr] sm:gap-6"><dt className="flex items-center gap-2 text-sm font-semibold text-[#556777]"><Phone size={16} aria-hidden="true"/> Telefon</dt><dd><a href="tel:+381214854533" className="font-semibold text-[#173b63] underline">021/485-4533</a></dd></div>
          </dl>
        </section>
        <aside className="h-fit rounded-lg border border-[#dce3e9] bg-white p-6">
          <h2 className="text-lg font-bold">Tražite konkretnu informaciju?</h2>
          <p className="mt-2 text-sm leading-7 text-[#556777]">Informacije o predmetima, nastavnom osoblju i obaveštenjima dostupne su direktno na portalu.</p>
          <nav aria-label="Korisne stranice" className="mt-4 divide-y divide-[#dce3e9] border-y border-[#dce3e9]">
            <Link href="/predmeti" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Predmeti <ArrowRight size={16}/></Link>
            <Link href="/nastavnici" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Nastavno osoblje <ArrowRight size={16}/></Link>
            <Link href="/novosti" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Obaveštenja <ArrowRight size={16}/></Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
