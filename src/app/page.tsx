import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { latestNews, featuredCourses } from "@/infrastructure/repositories/content";

export const revalidate = 300;

const shortcuts = [
  { href: "/predmeti", title: "Predmeti i materijali", detail: "Katalog, plan nastave i materijali po predmetima" },
  { href: "/nastavnici", title: "Nastavno osoblje", detail: "Nastavnici, saradnici i angažovanja" },
  { href: "/novosti", title: "Obaveštenja", detail: "Najnovije informacije za studente i zaposlene" },
  { href: "/kontakt", title: "Kontakt", detail: "Adresa, telefon i elektronska pošta" },
] as const;

export default async function Home() {
  const [news, courses] = await Promise.all([latestNews(5), featuredCourses(6)]);
  return (
    <>
      <section className="hero">
        <div className="container-page grid gap-9 py-10 md:py-15 lg:grid-cols-[minmax(0,1.3fr)_minmax(310px,.7fr)] lg:gap-14">
          <div>
            <p className="eyebrow mb-4">Fakultet tehničkih nauka · Novi Sad</p>
            <h1 className="hero-title max-w-3xl">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo</h1>
            <p className="section-copy mt-5 max-w-2xl">Informacije o predmetima, nastavnom osoblju, obaveštenjima i istraživačkom radu katedre.</p>
          </div>
          <div className="self-center rounded-lg border border-[#dce3e9] bg-[#f5f7fa] p-5 md:p-6">
            <h2 className="text-lg font-bold">Pronađite predmet</h2>
            <p className="mt-1 text-sm text-[#556777]">Pretražite katalog prema nazivu ili šifri.</p>
            <form action="/predmeti" role="search" className="mt-5">
              <label htmlFor="home-course-search" className="form-label">Naziv ili šifra predmeta</label>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <input id="home-course-search" name="q" type="search" className="input-field flex-1" maxLength={80} placeholder="Unesite naziv ili šifru"/>
                <button className="btn btn-primary whitespace-nowrap" type="submit"><Search size={16} aria-hidden="true"/> Pretraži</button>
              </div>
            </form>
            <Link href="/predmeti" className="mt-4 inline-block text-sm font-semibold text-[#173b63] underline">Pregled svih predmeta</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-11 md:py-14" aria-labelledby="fast-access">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="eyebrow mb-2">Brzi pristup</p><h2 id="fast-access" className="section-heading">Najčešće tražene informacije</h2></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((item) => <Link key={item.href} href={item.href} className="card-surface card-interactive group flex min-h-[145px] flex-col justify-between p-5">
            <div><h3 className="text-base font-bold text-[#173b63]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#556777]">{item.detail}</p></div>
            <span className="mt-4 text-right text-sm font-semibold text-[#173b63]" aria-hidden="true">Otvori →</span>
          </Link>)}
        </div>
      </section>

      <section className="border-y border-[#dce3e9] bg-white py-11 md:py-15" aria-labelledby="latest-announcements">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(240px,.65fr)] lg:gap-16">
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div><p className="eyebrow mb-2">Aktuelno</p><h2 id="latest-announcements" className="section-heading">Najnovija obaveštenja</h2></div>
              <Link href="/novosti" className="text-sm font-bold text-[#173b63] underline">Sva obaveštenja</Link>
            </div>
            {news.length ? <div className="divide-y divide-[#dce3e9] border-t border-[#dce3e9]">
              {news.map((item) => <article key={item.id} className="grid gap-2 py-5 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5">
                <time className="text-xs font-semibold text-[#556777]" dateTime={item.publishedAt?.toISOString()}>{item.publishedAt?.toLocaleDateString("sr-RS") ?? "Obaveštenje"}</time>
                <div><h3 className="text-[17px] font-bold leading-6"><Link href={"/novosti/" + item.slug} className="text-[#173b63] hover:underline">{item.title}</Link></h3><p className="mt-1 line-clamp-2 text-sm leading-6 text-[#556777]">{item.summary}</p></div>
              </article>)}
            </div> : <p className="rounded-md border border-[#dce3e9] bg-[#f5f7fa] p-6 text-sm text-[#556777]">Trenutno nema objavljenih obaveštenja.</p>}
          </div>
          <aside className="lg:border-l lg:border-[#dce3e9] lg:pl-8">
            <h2 className="mb-5 text-lg font-bold">Za studente</h2>
            <p className="text-sm leading-7 text-[#556777]">Sve dostupne informacije o nastavi nalaze se na stranicama pojedinačnih predmeta.</p>
            <nav aria-label="Informacije za studente" className="mt-5 divide-y divide-[#dce3e9] border-y border-[#dce3e9]">
              <Link href="/predmeti" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Katalog predmeta <ArrowRight size={16}/></Link>
              <Link href="/nastavnici" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Nastavno osoblje <ArrowRight size={16}/></Link>
              <Link href="/prijava" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Prijava na portal <ArrowRight size={16}/></Link>
            </nav>
          </aside>
        </div>
      </section>

      <section className="container-page py-11 md:py-15" aria-labelledby="courses-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow mb-2">Nastava</p><h2 id="courses-title" className="section-heading">Predmeti</h2><p className="section-copy mt-2">Pregled dela kataloga predmeta katedre.</p></div>
          <Link href="/predmeti" className="btn btn-light">Kompletan katalog <ArrowRight size={16}/></Link>
        </div>
        {courses.length ? <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">
          <ul className="divide-y divide-[#dce3e9]">
            {courses.map((item) => <li key={item.id}>
              <Link href={"/predmeti/" + item.slug} className="group grid items-center gap-2 px-5 py-4 hover:bg-[#f5f8fb] sm:grid-cols-[105px_minmax(0,1fr)_150px_20px] sm:gap-5">
                <span className="text-xs font-bold text-[#556777]">{item.code}</span>
                <span className="font-semibold text-[#173b63] group-hover:underline">{item.title}</span>
                <span className="text-xs text-[#556777]">{item.studyLevel} · {item.semester}. semestar</span>
                <ArrowRight size={16} className="hidden text-[#173b63] sm:block" aria-hidden="true"/>
              </Link>
            </li>)}
          </ul>
        </div> : <p className="empty-state">Predmeti će biti prikazani kada budu uneti u katalog.</p>}
      </section>

      <section className="border-t border-[#dce3e9] bg-white py-11 md:py-15" aria-labelledby="about-home">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div><p className="eyebrow mb-2">O katedri</p><h2 id="about-home" className="section-heading">Obrazovanje i istraživanje</h2><p className="section-copy mt-4 max-w-xl">Katedra povezuje nastavu, istraživački rad i saradnju sa privredom u oblastima elektroenergetike i primenjenog softverskog inženjerstva.</p></div>
          <nav aria-label="Više o katedri" className="divide-y divide-[#dce3e9] border-y border-[#dce3e9]">
            <Link href="/o-katedri" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">O katedri <ArrowRight size={16}/></Link>
            <Link href="/istrazivanje" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Istraživačke oblasti <ArrowRight size={16}/></Link>
            <Link href="/laboratorija" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Smart Grid laboratorija <ArrowRight size={16}/></Link>
            <Link href="/saradnja" className="flex items-center justify-between gap-3 py-3 text-sm font-semibold text-[#173b63]">Saradnja sa privredom <ArrowRight size={16}/></Link>
          </nav>
        </div>
      </section>
    </>
  );
}
