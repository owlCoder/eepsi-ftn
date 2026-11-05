import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Activity, Cpu, Network, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Smart Grid laboratorija",
  description: "Laboratorija Katedre EEPSI za simulaciju, emulaciju i testiranje elektroenergetskih sistema.",
};

export default function LaboratoryPage() {
  return <>
    <div className="page-banner"><div className="container-page">
      <Link href="/o-katedri" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16}/> O katedri</Link>
      <p className="eyebrow mb-4"><Network size={16}/> Praktičan razvoj</p>
      <h1 className="page-title">Smart Grid laboratorija</h1>
      <p className="section-copy mt-5 max-w-3xl">Laboratorija Katedre za simulaciju, emulaciju i testiranje vođenja, zaštite i kontrole savremenih elektroenergetskih sistema.</p>
    </div></div>
    <div className="container-page space-y-12 py-14 md:py-20">
      <section className="grid gap-5 md:grid-cols-3">
        {[
          { icon: Activity, title: "Simulacija i emulacija", copy: "Ispitivanje ponašanja elektroenergetskih sistema u kontrolisanim uslovima." },
          { icon: Cpu, title: "Vođenje i kontrola", copy: "Provera upravljačkih pristupa za savremene mreže i energetske resurse." },
          { icon: ShieldCheck, title: "Zaštita i testiranje", copy: "Provera zaštitnih funkcija i analiza složenih radnih scenarija." },
        ].map((item) => <article className="card-surface p-7" key={item.title}>
          <div className="feature-icon"><item.icon size={26}/></div>
          <h2 className="mt-6 text-xl font-extrabold tracking-tight">{item.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
        </article>)}
      </section>
      <section className="card-surface flex flex-col justify-between gap-7 p-7 sm:p-10 md:flex-row md:items-center">
        <div>
          <p className="eyebrow mb-3">Zvanične informacije</p>
          <h2 className="text-2xl font-extrabold tracking-tight">Više o laboratoriji</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Fotografije i izvorne informacije o laboratoriji dostupne su na zvaničnoj prezentaciji Katedre.</p>
        </div>
        <a className="btn btn-primary shrink-0" href="https://www.eepsi.ftn.uns.ac.rs/smart-grid-lab" target="_blank" rel="noopener noreferrer">
          Pogledaj laboratoriju <ArrowUpRight size={17}/>
        </a>
      </section>
      <Link href="/istrazivanje" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:underline">
        Istraživački rad Katedre <ArrowUpRight size={17}/>
      </Link>
    </div>
  </>;
}
