import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Atom, Cpu, GraduationCap, Handshake, Network, Zap } from "lucide-react";

export const metadata: Metadata = { title: "O katedri" };

export default function About() {
  return (
    <>
      <div className="page-banner"><div className="container-page"><p className="eyebrow mb-4">Upoznajte nas</p><h1 className="page-title max-w-4xl">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo</h1><p className="section-copy mt-6 max-w-2xl">Fakultet tehničkih nauka Univerziteta u Novom Sadu.</p></div></div>
      <div className="container-page py-16 md:py-22">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div><p className="eyebrow mb-5">Naša oblast</p><h2 className="section-heading">Inženjerstvo okrenuto budućnosti.</h2><p className="section-copy mt-6">Katedra povezuje obrazovanje, naučno-istraživački rad i saradnju sa privredom u oblastima elektroenergetike, informacionih tehnologija i primenjenog softverskog inženjerstva.</p><p className="section-copy mt-5">Ovaj portal je centralno mesto za informacije o predmetima, novostima i materijalima koje nastavnici i saradnici dele sa studentima.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{[
            { icon: Zap, label: "Elektroenergetika" },
            { icon: Cpu, label: "Softverski sistemi" },
            { icon: Network, label: "Pametne mreže" },
            { icon: GraduationCap, label: "Nastava i razvoj" },
          ].map((v) => <div className="card-surface p-7" key={v.label}><div className="feature-icon"><v.icon size={24}/></div><strong className="mt-5 block text-lg tracking-tight">{v.label}</strong></div>)}</div>
        </div>
        <section className="mt-16">
          <p className="eyebrow mb-4">Oblasti i aktivnosti</p>
          <h2 className="section-heading mb-7">Istražite rad Katedre</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { href: "/istrazivanje", icon: Atom, label: "Naučno-istraživački rad", copy: "Istraživanja i izabrani naučni radovi." },
              { href: "/saradnja", icon: Handshake, label: "Saradnja sa privredom", copy: "Povezivanje akademskog i industrijskog rada." },
              { href: "/laboratorija", icon: Network, label: "Smart Grid laboratorija", copy: "Simulacija, emulacija i testiranje sistema." },
            ].map((item) => <Link href={item.href} key={item.href} className="card-surface card-interactive group block p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="feature-icon"><item.icon size={25}/></span>
                <ArrowUpRight size={19} className="text-slate-400 group-hover:text-teal-700"/>
              </div>
              <h3 className="mt-5 text-lg font-extrabold">{item.label}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.copy}</p>
            </Link>)}
          </div>
        </section>
        <div className="mt-16 rounded-3xl bg-[#e5f3f0] p-8 md:p-12"><p className="eyebrow mb-5">Kontakt</p><h2 className="text-3xl font-extrabold tracking-tight">Posetite nas ili nam pišite.</h2><p className="mt-5 leading-8 text-slate-600">Fakultet tehničkih nauka<br/>Fruškogorska 11, 21000 Novi Sad<br/>Naučno-tehnološki park, 2. sprat, kancelarija 223</p><a className="mt-7 inline-flex items-center gap-2 font-bold text-teal-700" href="mailto:eespsi@uns.ac.rs">eespsi@uns.ac.rs <ArrowUpRight size={17}/></a></div>
      </div>
    </>
  );
}
