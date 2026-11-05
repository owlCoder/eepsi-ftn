import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Atom, Cpu, Network } from "lucide-react";

export const metadata: Metadata = {
  title: "Naučno-istraživački rad",
  description: "Elektroenergetski sistemi, pametne mreže i primenjeno softversko inženjerstvo na Katedri EEPSI.",
};

export default function ResearchPage() {
  return <>
    <div className="page-banner"><div className="container-page">
      <Link href="/o-katedri" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16}/> O katedri</Link>
      <p className="eyebrow mb-4"><Atom size={16}/> Nauka i razvoj</p>
      <h1 className="page-title">Naučno-istraživački rad</h1>
      <p className="section-copy mt-5 max-w-3xl">Katedra povezuje istraživanje elektroenergetskih sistema sa softverom potrebnim za njihovo vođenje, zaštitu i razvoj.</p>
    </div></div>
    <div className="container-page space-y-12 py-14 md:py-20">
      <section>
        <h2 className="section-heading mb-7">Oblasti istraživanja</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Network, title: "Elektroenergetski sistemi", copy: "Modelovanje, analiza i upravljanje prenosnim i distributivnim mrežama, uz integraciju obnovljivih izvora energije." },
            { icon: Cpu, title: "Primenjeno softversko inženjerstvo", copy: "Softverski alati, informacioni sistemi i automatizacija koji podržavaju složene infrastrukturne procese." },
            { icon: Atom, title: "Pametne mreže", copy: "Digitalizacija, simulacija i koordinacija savremenih elektroenergetskih sistema i distribuiranih resursa." },
          ].map((item) => <article className="card-surface p-7" key={item.title}>
            <span className="feature-icon"><item.icon size={25}/></span>
            <h3 className="mt-6 text-xl font-extrabold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
          </article>)}
        </div>
      </section>
      <section className="card-surface flex flex-col justify-between gap-7 p-7 sm:p-10 md:flex-row md:items-center">
        <div>
          <p className="eyebrow mb-3">Publikacije</p>
          <h2 className="text-2xl font-extrabold tracking-tight">Izabrani naučni radovi</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Zvanična prezentacija Katedre sadrži spiskove izabranih radova iz elektroenergetike i softverskog inženjerstva.</p>
        </div>
        <a className="btn btn-primary shrink-0" href="https://www.eepsi.ftn.uns.ac.rs/nau%C4%8Dno-istra%C5%BEiva%C4%8Dki-rad" target="_blank" rel="noopener noreferrer">
          Spisak radova <ArrowUpRight size={17}/>
        </a>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/laboratorija" className="dashboard-action">Smart Grid laboratorija <ArrowUpRight size={18}/></Link>
        <Link href="/saradnja" className="dashboard-action">Saradnja sa privredom <ArrowUpRight size={18}/></Link>
      </div>
    </div>
  </>;
}
