import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, Atom, BookOpen, GraduationCap, Lightbulb, Network, Sparkles, Zap } from "lucide-react";
import { CourseCard, NewsCard } from "@/components/content-cards";
import { latestNews, featuredCourses } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export default async function Home() {
  const [news, courses] = await Promise.all([latestNews(3), featuredCourses(3)]);
  return (
    <>
      <section className="hero py-16 md:py-24">
        <div className="container-page grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="eyebrow mb-7"><span className="h-2 w-2 rounded-full bg-teal-500"/> Fakultet tehničkih nauka • Novi Sad</div>
            <h1 className="hero-title">Znanje koje <span>pokreće</span> budućnost energije.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Povezujemo elektroenergetiku, softversko inženjerstvo i moderne tehnologije. Istražite predmete, novosti i rad naše katedre.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/predmeti" className="btn btn-primary">Istraži predmete <ArrowRight size={18}/></Link>
              <Link href="/o-katedri" className="btn btn-light">Upoznaj katedru <ArrowUpRight size={17}/></Link>
              <Link href="/nastavnici" className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-bold text-teal-800 hover:underline">Nastavni tim <ArrowRight size={16}/></Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 border-t border-slate-200 pt-7 text-sm font-semibold text-slate-600">
              <span className="flex items-center gap-2"><GraduationCap size={18} className="text-teal-700"/> Obrazovanje</span>
              <span className="flex items-center gap-2"><Atom size={18} className="text-teal-700"/> Istraživanje</span>
              <span className="flex items-center gap-2"><Network size={18} className="text-teal-700"/> Inovacije</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Ilustracija mreže pametne energije" role="img">
            <div className="visual-core"><Zap className="text-[#126e68]" size={70} strokeWidth={1.35}/></div>
            <div className="float-panel left-[5%] top-[13%]"><small>Naša misija</small><strong>Pametna energija</strong></div>
            <div className="float-panel bottom-[12%] left-[8%]"><small>Inženjerstvo</small><strong>Od ideje do rešenja</strong></div>
            <div className="float-panel right-[5%] top-[26%]"><small>Fokus</small><strong>Softver + energetika</strong></div>
            <div className="absolute bottom-0 right-0 z-1 p-7 text-[10px] font-bold uppercase tracking-[.18em] text-white/50">Powering knowledge • EEPSI</div>
          </div>
        </div>
      </section>
      <section className="container-page py-20 md:py-26">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div><p className="eyebrow mb-4"><Sparkles size={14}/> Šta radimo</p><h2 className="section-heading">Tri oblasti. Jedna vizija.</h2></div>
          <p className="section-copy max-w-md">Spajamo teoriju sa praksom i pripremamo inženjere za izazove savremenih energetskih sistema.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: BookOpen, href: "/predmeti", title: "Nastava i učenje", desc: "Akademski predmeti, materijali i podrška studentima na jednom preglednom mestu." },
            { icon: Lightbulb, href: "/istrazivanje", title: "Istraživanje", desc: "Razvoj ideja iz oblasti elektroenergetike, digitalizacije i savremenih informacionih sistema." },
            { icon: Activity, href: "/saradnja", title: "Primena u praksi", desc: "Povezivanje istraživanja i privrede kroz konkretna inženjerska rešenja." },
          ].map((item) => <Link key={item.title} href={item.href} className="card-surface card-interactive group block p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="feature-icon"><item.icon size={26}/></div>
                <ArrowUpRight size={19} className="text-slate-400 group-hover:text-teal-700"/>
              </div>
              <h3 className="mt-7 text-xl font-extrabold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
            </Link>)}
        </div>
      </section>
      <section className="bg-[#ecf4f4] py-20 md:py-24">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div><p className="eyebrow mb-4">Akademski program</p><h2 className="section-heading">Predmeti katedre</h2></div>
            <Link href="/predmeti" className="btn btn-light">Svi predmeti <ArrowUpRight size={17}/></Link>
          </div>
          {courses.length ? <div className="grid gap-5 md:grid-cols-3">{courses.map((item) => <CourseCard key={item.id} item={item}/>)}</div>
            : <div className="empty-state">Predmeti će biti prikazani kada ih urednik doda u bazu. <Link href="/predmeti" className="font-bold text-teal-700 underline">Otvori katalog</Link></div>}
        </div>
      </section>
      <section className="container-page py-20 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div><p className="eyebrow mb-4">Aktuelnosti</p><h2 className="section-heading">Novosti i obaveštenja</h2></div>
          <Link href="/novosti" className="btn btn-light">Sve novosti <ArrowUpRight size={17}/></Link>
        </div>
        {news.length ? <div className="grid gap-5 md:grid-cols-3">{news.map((item) => <NewsCard key={item.id} item={item}/>)}</div>
          : <div className="empty-state">Trenutno nema objavljenih vesti. Novi sadržaj će se pojaviti ovde.</div>}
      </section>
      <section className="container-page pb-24">
        <div className="overflow-hidden rounded-[30px] bg-[#0c3b4a] px-8 py-12 text-white md:px-14 md:py-16">
          <div className="grid items-center gap-7 md:grid-cols-[1fr_auto]">
            <div><p className="eyebrow !text-emerald-300">Pitanja i saradnja</p><h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">Budimo u kontaktu.</h2><p className="mt-3 text-slate-300">Za informacije o katedri, nastavi i saradnji obratite nam se putem elektronske pošte.</p></div>
            <a href="mailto:eespsi@uns.ac.rs" className="btn btn-primary whitespace-nowrap">Kontaktirajte nas <ArrowUpRight size={18}/></a>
          </div>
        </div>
      </section>
    </>
  );
}
