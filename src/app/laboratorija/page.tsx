import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Smart Grid laboratorija",
  description: "Laboratorija Katedre EEPSI za simulaciju, emulaciju i testiranje elektroenergetskih sistema.",
};
const items = [
  { number: "01", title: "Simulacija i emulacija", copy: "Ispitivanje ponašanja elektroenergetskih sistema u kontrolisanim uslovima." },
  { number: "02", title: "Vođenje i kontrola", copy: "Provera upravljačkih pristupa za savremene mreže i energetske resurse." },
  { number: "03", title: "Zaštita i testiranje", copy: "Provera zaštitnih funkcija i analiza složenih radnih scenarija." },
];
export default function LaboratoryPage() {
  return <>
    <header className="page-banner"><div className="container-page">
      <Link href="/o-katedri" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#8b371d]"><ArrowLeft size={16}/> O katedri</Link>
      <p className="eyebrow mb-5">Oblast / Laboratorija</p>
      <h1 className="page-title">Smart Grid laboratorija</h1>
      <p className="section-copy mt-6 max-w-3xl">Simulacija, emulacija i testiranje vođenja, zaštite i kontrole savremenih elektroenergetskih sistema.</p>
    </div></header>
    <div className="container-page py-15 md:py-21">
      <div className="section-index"><span>01 / Aktivnosti</span><span>Praktičan rad</span></div>
      <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <div><h2 className="section-heading">Provera ideja u kontrolisanim uslovima.</h2>
          <p className="section-copy mt-6 max-w-sm">Laboratorijski rad povezuje teorijske modele sa simulacijom i analizom ponašanja elektroenergetskih sistema.</p></div>
        <div className="divide-y divide-[#d3d6ce] border-t border-b border-[#d3d6ce]">
          {items.map(item => <article key={item.number} className="grid gap-3 py-7 sm:grid-cols-[42px_minmax(0,1fr)] sm:gap-5">
            <span className="num-marker pt-2">{item.number}</span>
            <div><h3 className="text-xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#5a6b6d]">{item.copy}</p></div>
          </article>)}
        </div>
      </div>
      <section className="mt-18 grid items-center gap-8 border-t border-[#abb7b2] pt-9 lg:mt-24 lg:grid-cols-[1fr_auto]">
        <div><p className="eyebrow mb-4">02 / Izvor</p><h2 className="section-heading !text-[clamp(28px,3.3vw,40px)]">Više o laboratoriji</h2>
          <p className="section-copy mt-4 max-w-2xl">Fotografije i dodatne informacije dostupne su na zvaničnoj prezentaciji Katedre.</p></div>
        <a href="https://www.eepsi.ftn.uns.ac.rs/smart-grid-lab" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Zvanična stranica <ArrowUpRight size={16}/></a>
      </section>
      <nav className="mt-14" aria-label="Povezane oblasti"><Link href="/istrazivanje" className="dashboard-action">Naučno-istraživački rad <ArrowUpRight size={17}/></Link></nav>
    </div>
  </>;
}
