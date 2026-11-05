import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "O katedri" };

const fields = [
  { number: "01", name: "Elektroenergetski sistemi", detail: "Modelovanje, vođenje i analiza energetskih mreža." },
  { number: "02", name: "Primenjeno softversko inženjerstvo", detail: "Softverski i informacioni sistemi za složene tehničke procese." },
  { number: "03", name: "Pametne mreže", detail: "Digitalizacija elektroenergetike i integracija savremenih tehnologija." },
  { number: "04", name: "Nastava i razvoj", detail: "Akademski predmeti, istraživanje i saradnja." },
];
const pages = [
  { number: "01", href: "/istrazivanje", title: "Istraživanje", description: "Elektroenergetski sistemi, algoritmi, primena softvera." },
  { number: "02", href: "/laboratorija", title: "Smart Grid laboratorija", description: "Simulacija, emulacija i ispitivanje." },
  { number: "03", href: "/saradnja", title: "Saradnja sa privredom", description: "Povezanost stručnog rada i prakse." },
];

export default function About() {
  return <>
    <header className="page-banner">
      <div className="container-page">
        <p className="eyebrow mb-5">O katedri / EEPSI</p>
        <h1 className="page-title">Elektroenergetika.<br/>Softver.<br/>Inženjerstvo.</h1>
        <p className="section-copy mt-6 max-w-2xl">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo pri Fakultetu tehničkih nauka Univerziteta u Novom Sadu.</p>
      </div>
    </header>
    <div className="container-page py-15 md:py-21">
      <section className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
        <div>
          <div className="section-index"><span>01 / O nama</span><span>Fokus</span></div>
          <h2 className="section-heading max-w-lg">Tehnika koja povezuje discipline.</h2>
          <p className="section-copy mt-6">Katedra povezuje obrazovanje, naučno-istraživački rad i saradnju sa privredom u oblastima elektroenergetike, informacionih tehnologija i primenjenog softverskog inženjerstva.</p>
          <p className="section-copy mt-4">Portal pruža pristup informacijama o predmetima, nastavnom timu, novostima i materijalima koje nastavnici i saradnici dele sa studentima.</p>
        </div>
        <div>
          <div className="section-index"><span>02 / Oblasti</span><span>Četiri povezana polja</span></div>
          <div className="divide-y divide-[#d3d6ce] border-b border-[#d3d6ce]">
            {fields.map((item) => <div key={item.number} className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 py-5">
              <span className="num-marker pt-1">{item.number}</span>
              <div><h3 className="text-lg font-semibold tracking-tight">{item.name}</h3><p className="mt-1 text-sm leading-7 text-[#5a6b6d]">{item.detail}</p></div>
            </div>)}
          </div>
        </div>
      </section>
      <section className="mt-20 md:mt-28">
        <div className="section-index"><span>03 / Istražite</span><span>Naš rad</span></div>
        <div className="grid gap-10 lg:grid-cols-[.7fr_1fr]">
          <div><h2 className="section-heading">Upoznajte rad katedre.</h2><p className="section-copy mt-5">Saznajte više o istraživačkim oblastima, laboratoriji i saradnji sa privredom.</p></div>
          <div className="home-ways">
            {pages.map(item => <Link key={item.href} href={item.href} className="home-way group">
              <span className="num-marker pt-2">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
              <ArrowUpRight className="mt-2 text-[#b34b2c]" size={20}/>
            </Link>)}
          </div>
        </div>
      </section>
    </div>
    <section className="editorial-strip py-13 md:py-17">
      <div className="container-page grid items-center gap-7 md:grid-cols-[1fr_1fr]">
        <div><p className="eyebrow mb-4">04 / Gde smo</p><h2 className="section-heading">Kontakt i lokacija.</h2></div>
        <div className="border-l-2 border-[#b34b2c] pl-6">
          <p className="text-sm leading-8 text-[#344a4e]">Fakultet tehničkih nauka<br/>Fruškogorska 11, 21000 Novi Sad<br/>Naučno-tehnološki park, 2. sprat, kancelarija 223</p>
          <a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8b371d] underline" href="mailto:eespsi@uns.ac.rs">eespsi@uns.ac.rs <ArrowUpRight size={15}/></a>
        </div>
      </div>
    </section>
  </>;
}
