import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, GraduationCap, Handshake, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Saradnja sa privredom",
  description: "Povezivanje nastave, istraživanja i industrijske prakse na Katedri EEPSI.",
};

export default function CollaborationPage() {
  return <>
    <div className="page-banner"><div className="container-page">
      <Link href="/o-katedri" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16}/> O katedri</Link>
      <p className="eyebrow mb-4"><Handshake size={16}/> Znanje u praksi</p>
      <h1 className="page-title">Saradnja sa privredom</h1>
      <p className="section-copy mt-5 max-w-3xl">Povezivanje akademskih aktivnosti sa praktičnim izazovima u energetici, informacionim sistemima i softverskom inženjerstvu.</p>
    </div></div>
    <div className="container-page space-y-12 py-14 md:py-20">
      <section className="grid gap-5 md:grid-cols-3">
        {[
          { icon: Building2, title: "Industrijski projekti", copy: "Primena inženjerskih metoda na konkretnim problemima iz energetike i softverskih sistema." },
          { icon: GraduationCap, title: "Stručno usavršavanje", copy: "Veza između akademskog obrazovanja, studentske prakse i profesionalnog razvoja." },
          { icon: Lightbulb, title: "Prenos znanja", copy: "Razmena iskustava između istraživačkog i industrijskog rada, sa koristima za nastavu." },
        ].map((item) => <article className="card-surface p-7" key={item.title}>
          <div className="feature-icon"><item.icon size={25}/></div>
          <h2 className="mt-6 text-xl font-extrabold tracking-tight">{item.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
        </article>)}
      </section>
      <section className="card-surface p-7 sm:p-10">
        <p className="eyebrow mb-3">Primeri saradnje</p>
        <h2 className="text-2xl font-extrabold tracking-tight">Povezanost sa industrijom</h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
          Na zvaničnoj prezentaciji Katedre među primerima saradnje navode se Schneider Electric, ALBO Energy,
          Continental Automotive, Typhoon HIL i druge domaće i međunarodne organizacije. Za aktuelne informacije o partnerstvima i projektima pogledajte zvaničan izvor.
        </p>
        <a className="btn btn-primary mt-6" href="https://www.eepsi.ftn.uns.ac.rs/saradnja-sa-privredom" target="_blank" rel="noopener noreferrer">
          Zvanični pregled saradnje <ArrowUpRight size={17}/>
        </a>
      </section>
      <section className="rounded-3xl bg-[#e5f3f0] p-7 sm:p-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Zainteresovani za saradnju?</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">Za stručna pitanja, istraživačke teme ili saradnju kontaktirajte Katedru.</p>
        <a className="btn btn-light mt-6" href="mailto:eespsi@uns.ac.rs?subject=Saradnja%20sa%20Katedrom%20EEPSI">
          Pišite Katedri <ArrowUpRight size={17}/>
        </a>
      </section>
    </div>
  </>;
}
