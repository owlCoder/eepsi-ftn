import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Saradnja sa privredom",
  description: "Povezivanje nastave, istraživanja i industrijske prakse na Katedri EEPSI.",
};
const topics = [
  { number: "01", title: "Industrijski projekti", copy: "Primena inženjerskih metoda na problemima iz energetike i softverskih sistema." },
  { number: "02", title: "Stručno usavršavanje", copy: "Veza između akademskog obrazovanja, studentske prakse i profesionalnog razvoja." },
  { number: "03", title: "Prenos znanja", copy: "Razmena iskustava između istraživačkog i industrijskog rada." },
];
export default function CollaborationPage() {
  return <>
    <header className="page-banner"><div className="container-page">
      <Link href="/o-katedri" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#8b371d]"><ArrowLeft size={16}/> O katedri</Link>
      <p className="eyebrow mb-5">Oblast / Saradnja</p>
      <h1 className="page-title">Saradnja sa privredom</h1>
      <p className="section-copy mt-6 max-w-3xl">Povezivanje akademskih aktivnosti sa praktičnim izazovima u energetici, informacionim sistemima i softverskom inženjerstvu.</p>
    </div></header>
    <div className="container-page py-15 md:py-21">
      <div className="section-index"><span>01 / Oblasti saradnje</span><span>Znanje u praksi</span></div>
      <section className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <div><h2 className="section-heading">Od istraživanja do primene.</h2>
          <p className="section-copy mt-6 max-w-sm">Saradnja sa industrijom povezuje akademsko znanje, razvoj rešenja i potrebe privrede.</p></div>
        <div className="divide-y divide-[#d3d6ce] border-t border-b border-[#d3d6ce]">
          {topics.map(item => <article key={item.number} className="grid gap-3 py-7 sm:grid-cols-[42px_minmax(0,1fr)] sm:gap-5">
            <span className="num-marker pt-2">{item.number}</span>
            <div><h3 className="text-xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#5a6b6d]">{item.copy}</p></div>
          </article>)}
        </div>
      </section>
      <section className="mt-18 border-t border-[#abb7b2] pt-9 md:mt-24">
        <p className="eyebrow mb-4">02 / Primeri saradnje</p>
        <h2 className="section-heading !text-[clamp(28px,3.3vw,40px)]">Povezanost sa industrijom</h2>
        <p className="section-copy mt-5 max-w-3xl">Na zvaničnoj prezentaciji Katedre među primerima saradnje navode se Schneider Electric, ALBO Energy, Continental Automotive, Typhoon HIL i druge organizacije. Aktuelne podatke o partnerstvima i projektima proverite u zvaničnom izvoru.</p>
        <a href="https://www.eepsi.ftn.uns.ac.rs/saradnja-sa-privredom" target="_blank" rel="noopener noreferrer" className="btn btn-light mt-7">Zvanični pregled saradnje <ArrowUpRight size={16}/></a>
      </section>
    </div>
    <section className="editorial-strip py-13">
      <div className="container-page flex flex-wrap items-center justify-between gap-6">
        <div><p className="eyebrow mb-3">03 / Kontakt</p><h2 className="display-serif text-3xl">Predlog za saradnju?</h2><p className="section-copy mt-2 !text-sm">Za stručna pitanja i istraživačke teme obratite se Katedri.</p></div>
        <a className="btn btn-primary" href="mailto:eespsi@uns.ac.rs?subject=Saradnja%20sa%20Katedrom%20EEPSI">Pišite katedri <ArrowUpRight size={16}/></a>
      </div>
    </section>
  </>;
}
