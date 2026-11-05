import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, MapPin, Search, UsersRound } from "lucide-react";
import { CourseCard } from "@/components/content-cards";
import { latestNews, featuredCourses } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export default async function Home() {
  const [news, courses] = await Promise.all([latestNews(4), featuredCourses(6)]);

  return (
    <>
      <section className="portal-hero" aria-labelledby="home-title">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)] lg:gap-14">
          <div className="min-w-0">
            <p className="hero-kicker">EEPSI / PORTAL KATEDRE</p>
            <h1 id="home-title" className="hero-heading">Predmeti i materijali.<br/><span>Bez lutanja.</span></h1>
            <p className="hero-description">Pronađi svoj predmet, otvori materijale i proveri obaveštenja. Sve najvažnije informacije su javno dostupne, bez prijave.</p>
            <form action="/predmeti" role="search" className="mt-7">
              <label htmlFor="home-course-search" className="mb-2 block text-xs font-bold text-[#d5def5]">Naziv ili šifra predmeta</label>
              <div className="hero-search !mt-0">
                <input id="home-course-search" name="q" type="search" maxLength={80} placeholder="Unesi naziv ili šifru predmeta"/>
                <button type="submit"><Search size={19} aria-hidden="true"/> Pretraži</button>
              </div>
            </form>
            <nav aria-label="Najvažnije informacije" className="hero-access">
              <Link href="/predmeti">Svi predmeti <ArrowUpRight size={13} className="inline" aria-hidden="true"/></Link>
              <Link href="/novosti">Sva obaveštenja <ArrowUpRight size={13} className="inline" aria-hidden="true"/></Link>
              <Link href="/nastavnici">Nastavno osoblje</Link>
            </nav>
          </div>
          <section className="hero-news" aria-labelledby="home-news-heading">
            <div className="hero-news-header">
              <div><p className="section-kicker !mb-1">AKTUELNO</p><h2 id="home-news-heading">Najnovija obaveštenja</h2></div>
              <Link href="/novosti" className="whitespace-nowrap">Sva <ArrowRight size={14} className="inline" aria-hidden="true"/></Link>
            </div>
            {news.length ? <div>
              {news.map(item => <Link key={item.id} href={"/novosti/" + item.slug} className="hero-news-item">
                <time dateTime={item.publishedAt?.toISOString()}>{item.publishedAt?.toLocaleDateString("sr-RS") ?? "Obaveštenje"}</time>
                <strong>{item.title}</strong>
              </Link>)}
            </div> : <p className="px-5 py-8 text-sm text-[#68768d]">Trenutno nema objavljenih obaveštenja.</p>}
          </section>
        </div>
      </section>

      <section className="home-section container-page" aria-labelledby="home-courses-heading">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="section-kicker">NASTAVA / PREDMETI</p>
            <h2 id="home-courses-heading" className="home-section-title">Pronađi svoj predmet.</h2>
            <p className="mt-2 text-sm text-[#65728a]">Otvori stranicu predmeta ili idi pravo na materijale.</p>
          </div>
          <Link href="/predmeti" className="section-action">Kompletan katalog <ArrowRight size={18} aria-hidden="true"/></Link>
        </div>
        {courses.length
          ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{courses.map(item => <CourseCard key={item.id} item={item}/>)}</div>
          : <p className="empty-state">Predmeti će se pojaviti kada budu dodati u katalog.</p>}
      </section>

      <section className="border-t border-[#e4e8f0] bg-white">
        <div className="container-page py-11 md:py-14">
          <div className="mb-6">
            <p className="section-kicker">JOŠ INFORMACIJA</p>
            <h2 className="home-section-title !text-[clamp(24px,2.7vw,33px)]">Sve ostalo, na dva klika.</h2>
          </div>
          <nav aria-label="Dodatne informacije" className="grid gap-3 md:grid-cols-3">
            <Link href="/nastavnici" className="home-shortcut">
              <span><strong>Nastavno osoblje</strong><small>Ko drži nastavu i na kom predmetu</small></span>
              <UsersRound size={23} aria-hidden="true"/>
            </Link>
            <Link href="/kontakt" className="home-shortcut">
              <span><strong>Kontakt</strong><small>Adresa, telefon i email katedre</small></span>
              <MapPin size={23} aria-hidden="true"/>
            </Link>
            <Link href="/o-katedri" className="home-shortcut">
              <span><strong>O katedri</strong><small>Nastava, istraživanje i saradnja</small></span>
              <BookOpen size={23} aria-hidden="true"/>
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
