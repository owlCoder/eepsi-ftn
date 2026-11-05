import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Smart Grid laboratorija",
  description: "Simulacija, emulacija i testiranje elektroenergetskih sistema na Katedri EEPSI.",
};

export default function LaboratoryPage() {
  return (
    <>
      <header className="portal-page-hero"><div className="container-page">
        <nav aria-label="Putanja" className="breadcrumbs"><Link href="/" className="hover:underline">Početna</Link> / <Link href="/istrazivanje" className="hover:underline">Istraživanje</Link> / Laboratorija</nav>
        <p className="section-kicker !mb-2">KATEDRA / LABORATORIJA</p>
        <h1>Smart Grid laboratorija</h1>
        <p className="section-copy mt-3 max-w-3xl">Laboratorijski rad u oblastima simulacije, emulacije, vođenja i zaštite elektroenergetskih sistema.</p>
      </div></header>
      <div className="container-page grid gap-10 py-11 md:py-15 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-labelledby="lab-work">
          <h2 id="lab-work" className="section-heading">Oblasti laboratorijskog rada</h2>
          <p className="section-copy mt-3 max-w-2xl">Laboratorija služi za analizu i ispitivanje pristupa koji se primenjuju u savremenim elektroenergetskim mrežama.</p>
          <div className="mt-6 academic-info-list">
            <div className="academic-info-item"><h3 className="font-bold">Simulacija i emulacija</h3><p className="mt-2 text-sm leading-7 text-[#586983]">Ispitivanje ponašanja elektroenergetskih sistema u kontrolisanim uslovima.</p></div>
            <div className="academic-info-item"><h3 className="font-bold">Vođenje i kontrola</h3><p className="mt-2 text-sm leading-7 text-[#586983]">Provera pristupa upravljanju mrežama i energetskim resursima.</p></div>
            <div className="academic-info-item"><h3 className="font-bold">Zaštita i testiranje</h3><p className="mt-2 text-sm leading-7 text-[#586983]">Analiza radnih scenarija i provera zaštitnih funkcija.</p></div>
          </div>
        </section>
        <aside className="h-fit detail-aside">
          <h2 className="text-lg font-bold">Dodatne informacije</h2>
          <p className="mt-3 text-sm leading-7 text-[#586983]">Fotografije i izvorne informacije o laboratoriji dostupne su na prezentaciji katedre.</p>
          <a href="https://www.eepsi.ftn.uns.ac.rs/smart-grid-lab" target="_blank" rel="noopener noreferrer" className="btn btn-light mt-5 w-full">Zvanična stranica <ExternalLink size={16}/></a>
          <Link href="/istrazivanje" className="mt-5 flex items-center justify-between gap-2 text-sm font-semibold text-[#12396c]">Istraživačke oblasti <ArrowRight size={16}/></Link>
        </aside>
      </div>
    </>
  );
}
