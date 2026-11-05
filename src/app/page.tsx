import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EnergyNetwork } from "@/components/energy-network";
import { CourseCard, NewsCard } from "@/components/content-cards";
import { latestNews, featuredCourses } from "@/infrastructure/repositories/content";

export const revalidate = 300;

const directions = [
  { number: "01", href: "/predmeti", title: "Nastava i predmeti", description: "Pregled predmeta, nastavnog tima i dostupnih materijala za studente." },
  { number: "02", href: "/istrazivanje", title: "Istraživanje", description: "Elektroenergetski sistemi, digitalizacija i primenjeno softversko inženjerstvo." },
  { number: "03", href: "/laboratorija", title: "Smart Grid laboratorija", description: "Simulacija, emulacija i testiranje savremenih elektroenergetskih sistema." },
  { number: "04", href: "/saradnja", title: "Saradnja sa privredom", description: "Povezivanje akademskog rada i konkretnih inženjerskih izazova." },
];

export default async function Home() {
  const [news, courses] = await Promise.all([latestNews(3), featuredCourses(3)]);
  return (
    <>
      <section className="hero py-12 md:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <p className="eyebrow mb-7">Fakultet tehničkih nauka / Novi Sad</p>
            <h1 className="hero-title">Elektroenergetika.<br/><em>Softver.</em><br/>Inženjerstvo.</h1>
            <p className="section-copy mt-7 max-w-xl">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo. Informacije o nastavi, istraživanju i radu katedre na jednom mestu.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/predmeti" className="btn btn-primary">Pronađi predmet <ArrowRight size={17}/></Link>
              <Link href="/o-katedri" className="btn btn-light">O katedri <ArrowUpRight size={17}/></Link>
            </div>
            <div className="hero-rule mt-12 flex flex-wrap gap-x-8 gap-y-3 pt-5">
              <span className="meta-label">Nastava</span><span className="meta-label">Istraživanje</span><span className="meta-label">Saradnja</span>
            </div>
          </div>
          <div className="hero-system">
            <div className="flex items-center justify-between border-b border-[#668b82] px-5 py-4">
              <span className="text-[11px] font-bold uppercase tracking-[.15em] text-[#d2e2d9]">EEPSI / Sistemski prikaz</span>
              <span className="text-[11px] font-mono text-[#d98a63]">FTN — NS</span>
            </div>
            <EnergyNetwork className="w-full"/>
            <div className="hero-system-caption"><span>Energetika × softverski sistemi</span><span>01—04</span></div>
          </div>
        </div>
      </section>
      <section className="container-page py-16 md:py-22">
        <div className="section-index"><span>01 / KATEDRA</span><span>OBLASTI RADA</span></div>
        <div className="grid gap-8 lg:grid-cols-[.65fr_1fr]">
          <div><h2 className="section-heading">Od teorije<br/>do primene.</h2><p className="section-copy mt-5 max-w-sm">Izaberite oblast i pronađite informacije koje su vam potrebne.</p></div>
          <div className="home-ways">
            {directions.map((item) => <Link href={item.href} key={item.number} className="home-way group">
              <span className="num-marker pt-2">{item.number}</span>
              <span><h3>{item.title}</h3><p>{item.description}</p></span>
              <ArrowUpRight size={20} className="mt-2 text-[#b34b2c] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
            </Link>)}
          </div>
        </div>
      </section>
      <section className="editorial-strip py-16 md:py-20">
        <div className="container-page">
          <div className="section-index"><span>02 / NASTAVA</span><span>KATALOG</span></div>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div><h2 className="section-heading">Predmeti katedre</h2><p className="section-copy mt-3">Pristup informacijama o predmetima i nastavnim materijalima.</p></div>
            <Link href="/predmeti" className="btn btn-light">Svi predmeti <ArrowUpRight size={17}/></Link>
          </div>
          {courses.length ? <div className="grid gap-4 md:grid-cols-3">{courses.map(item => <CourseCard key={item.id} item={item}/>)}</div>
            : <div className="empty-state">Predmeti još nisu objavljeni. <Link href="/predmeti" className="font-bold underline">Otvori katalog</Link></div>}
        </div>
      </section>
      <section className="container-page py-16 md:py-20">
        <div className="section-index"><span>03 / INFORMACIJE</span><span>AKTUELNOSTI</span></div>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div><h2 className="section-heading">Novosti i obaveštenja</h2><p className="section-copy mt-3">Poslednje informacije sa katedre.</p></div>
          <Link href="/novosti" className="btn btn-light">Sve novosti <ArrowUpRight size={17}/></Link>
        </div>
        {news.length ? <div className="grid gap-4 md:grid-cols-3">{news.map(item => <NewsCard key={item.id} item={item}/>)}</div>
          : <div className="empty-state">Trenutno nema objavljenih novosti.</div>}
      </section>
      <section className="contact-band">
        <div className="container-page flex flex-wrap items-center justify-between gap-7">
          <div><p className="eyebrow mb-3">Kontakt / EEPSI</p><h2 className="display-serif text-3xl md:text-4xl">Imate pitanje za katedru?</h2><p className="mt-3 text-sm text-[#d5dbd4]">Za informacije o nastavi, istraživanju i saradnji.</p></div>
          <a href="mailto:eespsi@uns.ac.rs" className="btn btn-primary">Pišite nam <ArrowUpRight size={17}/></a>
        </div>
      </section>
    </>
  );
}
