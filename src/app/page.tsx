import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, FlaskConical, Mail, Search, UsersRound } from "lucide-react";
import { FeaturedCourseRow, NewsCard } from "@/components/content-cards";
import { featuredCourses, latestNews } from "@/infrastructure/repositories/content";

// Keep tracking/query variants of the homepage pointing to the same indexable URL.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export const revalidate = 300;

const shortcuts = [
  { href: "/predmeti", title: "Katalog predmeta", description: "Svi predmeti i materijali", icon: BookOpen },
  { href: "/novosti", title: "Obaveštenja", description: "Aktuelne informacije", icon: CalendarDays },
  { href: "/nastavnici", title: "Nastavno osoblje", description: "Nastavnici i saradnici", icon: UsersRound },
  { href: "/laboratorija", title: "Laboratorija", description: "Smart Grid laboratorija", icon: FlaskConical },
  { href: "/kontakt", title: "Kontakt", description: "Podaci o katedri", icon: Mail },
] as const;

export default async function Home() {
  const [news, courses] = await Promise.all([latestNews(3), featuredCourses(4)]);

  return (
    <div className="container-page academic-home">
      <section className="academic-hero" aria-labelledby="home-title">
        <div className="academic-hero-inner">
          <p className="academic-hero-eyebrow">FAKULTET TEHNIČKIH NAUKA · NOVI SAD</p>
          <h1 id="home-title">EEPSI — Studentski portal</h1>
          <p>Predmeti, obaveštenja, nastavni materijali i informacije o nastavnom osoblju Katedre za elektroenergetiku i primenjeno softversko inženjerstvo.</p>
          <form action="/predmeti" role="search" className="academic-home-search">
            <label htmlFor="home-course-search" className="sr-only">Naziv ili šifra predmeta</label>
            <Search size={21} aria-hidden="true" className="academic-search-icon"/>
            <input id="home-course-search" name="q" type="search" maxLength={80}
              placeholder="Pretraži predmete (naziv ili šifra)"/>
            <button type="submit">Pretraži</button>
          </form>
        </div>
      </section>

      <nav className="academic-shortcuts" aria-label="Brzi pristup informacijama">
        {shortcuts.map(shortcut => {
          const Icon = shortcut.icon;
          return (
            <Link key={shortcut.href} href={shortcut.href} className="academic-shortcut">
              <span className="academic-shortcut-icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true"/></span>
              <span className="academic-shortcut-copy"><strong>{shortcut.title}</strong><small>{shortcut.description}</small></span>
              <ArrowRight size={16} strokeWidth={1.7} aria-hidden="true" className="academic-shortcut-arrow"/>
            </Link>
          );
        })}
      </nav>

      <div className="academic-home-columns">
        <section aria-labelledby="home-news-heading" className="academic-home-section">
          <div className="academic-section-heading">
            <h2 id="home-news-heading">Najnovija obaveštenja</h2>
            <Link href="/novosti">Sva obaveštenja <ArrowRight size={15} aria-hidden="true"/></Link>
          </div>
          {news.length ? (
            <div className="academic-news-list">{news.map(item => <NewsCard key={item.id} item={item}/>)}</div>
          ) : <p className="academic-empty">Trenutno nema objavljenih obaveštenja.</p>}
        </section>

        <section aria-labelledby="home-courses-heading" className="academic-home-section">
          <div className="academic-section-heading">
            <h2 id="home-courses-heading">Izdvojeni predmeti</h2>
            <Link href="/predmeti">Svi predmeti <ArrowRight size={15} aria-hidden="true"/></Link>
          </div>
          {courses.length ? (
            <ul className="academic-featured-list">{courses.map(item => <FeaturedCourseRow key={item.id} item={item}/>)}</ul>
          ) : <p className="academic-empty">Predmeti će biti prikazani kada budu dodati u katalog.</p>}
        </section>

        <aside aria-labelledby="home-links-heading" className="academic-help">
          <h2 id="home-links-heading">Brze informacije</h2>
          <nav aria-label="Korisne informacije">
            <Link href="/predmeti"><BookOpen size={19} aria-hidden="true"/> Nastavni materijali <ArrowRight size={16} aria-hidden="true"/></Link>
            <Link href="/nastavnici"><UsersRound size={19} aria-hidden="true"/> Nastavno osoblje <ArrowRight size={16} aria-hidden="true"/></Link>
            <Link href="/laboratorija"><FlaskConical size={19} aria-hidden="true"/> Smart Grid laboratorija <ArrowRight size={16} aria-hidden="true"/></Link>
            <Link href="/kontakt"><Mail size={19} aria-hidden="true"/> Kontakt katedre <ArrowRight size={16} aria-hidden="true"/></Link>
          </nav>
        </aside>
      </div>
    </div>
  );
}
