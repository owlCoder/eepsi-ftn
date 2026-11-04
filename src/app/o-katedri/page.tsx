import type { Metadata } from "next";
import { ArrowUpRight, Cpu, GraduationCap, Network, Zap } from "lucide-react";

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
        <div className="mt-16 rounded-3xl bg-[#e5f3f0] p-8 md:p-12"><p className="eyebrow mb-5">Kontakt</p><h2 className="text-3xl font-extrabold tracking-tight">Posetite nas ili nam pišite.</h2><p className="mt-5 leading-8 text-slate-600">Fruškogorska 11, 21000 Novi Sad<br/>Naučno-tehnološki park, 2. sprat, kancelarija 223</p><a className="mt-7 inline-flex items-center gap-2 font-bold text-teal-700" href="mailto:eespsi@uns.ac.rs">eespsi@uns.ac.rs <ArrowUpRight size={17}/></a></div>
      </div>
    </>
  );
}
