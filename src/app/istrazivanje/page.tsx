import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Istraživanje",
  description: "Naučno-istraživačke oblasti Katedre EEPSI na Fakultetu tehničkih nauka.",
  alternates: { canonical: "/istrazivanje" },
};

const areas = [
  { title: "Elektroenergetski sistemi", detail: "Modelovanje, analiza i upravljanje elektroenergetskim mrežama, uključujući integraciju obnovljivih izvora energije." },
  { title: "Primenjeno softversko inženjerstvo", detail: "Softverski alati, informacioni sistemi i automatizacija kao podrška složenim infrastrukturnim procesima." },
  { title: "Pametne elektroenergetske mreže", detail: "Digitalizacija, simulacija i koordinacija savremenih energetskih sistema i distribuiranih resursa." },
] as const;

export default function ResearchPage() {
  return (
    <>
      <header className="portal-page-hero"><div className="container-page">
        <nav aria-label="Putanja" className="breadcrumbs"><Link href="/" className="hover:underline">Početna</Link> / Istraživanje</nav>
        <p className="section-kicker !mb-2">KATEDRA / ISTRAŽIVANJE</p>
        <h1>Istraživanje</h1>
        <p className="section-copy mt-3 max-w-3xl">Istraživanja na preseku elektroenergetskih sistema i primenjenog softverskog inženjerstva.</p>
      </div></header>
      <div className="container-page py-11 md:py-15">
        <section aria-labelledby="research-areas" className="max-w-4xl">
          <h2 id="research-areas" className="section-heading mb-5">Oblasti istraživanja</h2>
          <div className="academic-info-list">
            {areas.map((item) => <article key={item.title} className="academic-info-item">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#586983]">{item.detail}</p>
            </article>)}
          </div>
        </section>
        <section aria-labelledby="research-publications" className="mt-11 grid gap-8 border-t border-[#dce3ee] pt-9 lg:grid-cols-[minmax(0,1fr)_minmax(270px,.55fr)]">
          <div><h2 id="research-publications" className="text-xl font-bold">Naučni radovi i publikacije</h2>
            <p className="section-copy mt-3 max-w-2xl">Pregled izabranih naučnih radova objavljen je na prezentaciji katedre. Za spiskove publikacija i dodatne informacije koristite zvanični izvor.</p>
            <a href="https://www.eepsi.ftn.uns.ac.rs/nau%C4%8Dno-istra%C5%BEiva%C4%8Dki-rad" target="_blank" rel="noopener noreferrer" className="btn btn-light mt-5">Izabrani radovi <ExternalLink size={16}/></a>
          </div>
          <aside className="detail-aside">
            <h3 className="mb-4 font-bold">Povezane teme</h3>
            <nav aria-label="Povezane stranice" className="divide-y divide-[#dce3e9]">
              <Link href="/laboratorija" className="flex items-center justify-between gap-2 py-3 text-sm font-semibold text-[#12396c]">Smart Grid laboratorija <ArrowRight size={16}/></Link>
              <Link href="/saradnja" className="flex items-center justify-between gap-2 py-3 text-sm font-semibold text-[#12396c]">Saradnja sa privredom <ArrowRight size={16}/></Link>
            </nav>
          </aside>
        </section>
      </div>
    </>
  );
}
