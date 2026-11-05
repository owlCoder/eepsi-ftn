import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Naučno-istraživački rad",
  description: "Elektroenergetski sistemi, pametne mreže i primenjeno softversko inženjerstvo na Katedri EEPSI.",
};
const areas = [
  { number: "01", title: "Elektroenergetski sistemi", copy: "Modelovanje, analiza i upravljanje prenosnim i distributivnim mrežama, uz integraciju obnovljivih izvora energije." },
  { number: "02", title: "Primenjeno softversko inženjerstvo", copy: "Softverski alati, informacioni sistemi i automatizacija koji podržavaju složene infrastrukturne procese." },
  { number: "03", title: "Pametne mreže", copy: "Digitalizacija, simulacija i koordinacija savremenih elektroenergetskih sistema i distribuiranih resursa." },
];
export default function ResearchPage() {
  return <>
    <header className="page-banner"><div className="container-page">
      <Link href="/o-katedri" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#8b371d]"><ArrowLeft size={16}/> O katedri</Link>
      <p className="eyebrow mb-5">Oblast / Istraživanje</p>
      <h1 className="page-title">Naučno-istraživački rad</h1>
      <p className="section-copy mt-6 max-w-2xl">Elektroenergetski sistemi i softver potreban za njihovo vođenje, zaštitu i razvoj.</p>
    </div></header>
    <div className="container-page py-15 md:py-21">
      <div className="section-index"><span>01 / Fokus</span><span>Tri oblasti</span></div>
      <section className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <div><h2 className="section-heading">Od modela do sistema.</h2><p className="section-copy mt-6 max-w-sm">Istraživanje uključuje analizu energetskih mreža, digitalne alate i njihovu primenu u realnim tehničkim procesima.</p></div>
        <div className="divide-y divide-[#d3d6ce] border-t border-b border-[#d3d6ce]">
          {areas.map(item => <article key={item.number} className="grid gap-3 py-7 sm:grid-cols-[42px_minmax(0,1fr)] sm:gap-5">
            <span className="num-marker pt-2">{item.number}</span>
            <div><h3 className="text-xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#5a6b6d]">{item.copy}</p></div>
          </article>)}
        </div>
      </section>
      <section className="mt-18 border-t border-[#abb7b2] pt-9 md:mt-24">
        <div className="grid items-center gap-9 lg:grid-cols-[1fr_auto]">
          <div><p className="eyebrow mb-4">02 / Publikacije</p><h2 className="section-heading !text-[clamp(28px,3.3vw,40px)]">Izabrani naučni radovi</h2>
            <p className="section-copy mt-4 max-w-2xl">Zvanična prezentacija Katedre sadrži izabrane naučne radove. Aktuelne spiskove proverite u izvornom pregledu.</p></div>
          <a className="btn btn-primary" href="https://www.eepsi.ftn.uns.ac.rs/nau%C4%8Dno-istra%C5%BEiva%C4%8Dki-rad" target="_blank" rel="noopener noreferrer">Pregled radova <ArrowUpRight size={16}/></a>
        </div>
      </section>
      <nav className="mt-14 grid gap-3 sm:grid-cols-2" aria-label="Povezane oblasti">
        <Link href="/laboratorija" className="dashboard-action">Smart Grid laboratorija <ArrowUpRight size={17}/></Link>
        <Link href="/saradnja" className="dashboard-action">Saradnja sa privredom <ArrowUpRight size={17}/></Link>
      </nav>
    </div>
  </>;
}
