import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { latestNews, featuredCourses } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export default async function Home() {
  const [news, courses] = await Promise.all([latestNews(5), featuredCourses(6)]);

  return (
    <>
      <section className="border-b border-[#dce3e9] bg-white">
        <div className="container-page py-6 md:py-9">
          <p className="mb-2 text-xs font-semibold text-[#556777]">EEPSI · Fakultet tehničkih nauka, Novi Sad</p>
          <h1 className="text-[clamp(27px,3.2vw,38px)] font-bold leading-tight tracking-tight text-[#182b3c]">Predmeti i obaveštenja</h1>
          <p className="mt-2 text-sm text-[#556777]">Informacije o nastavi dostupne su svima, bez prijave na portal.</p>
          <form action="/predmeti" role="search" className="mt-5 max-w-3xl">
            <label htmlFor="home-course-search" className="form-label">Naziv ili šifra predmeta</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="home-course-search" name="q" type="search" maxLength={80}
                className="input-field flex-1 !min-h-12 !text-base" placeholder="Pretražite predmet po nazivu ili šifri"/>
              <button className="btn btn-primary !min-h-12 sm:shrink-0" type="submit">
                <Search size={18} aria-hidden="true"/> Pretraži predmete
              </button>
            </div>
          </form>
          <nav aria-label="Najvažnije informacije" className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link href="/predmeti" className="text-[#173b63] underline">Svi predmeti</Link>
            <Link href="/novosti" className="text-[#173b63] underline">Sva obaveštenja</Link>
            <Link href="/nastavnici" className="text-[#173b63] underline">Nastavno osoblje</Link>
          </nav>
        </div>
      </section>

      <div className="container-page grid gap-7 py-7 md:py-9 lg:grid-cols-2 lg:gap-9">
        <section aria-labelledby="home-news-heading" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 id="home-news-heading" className="text-xl font-bold">Najnovija obaveštenja</h2>
            <Link href="/novosti" className="inline-flex items-center gap-1 text-sm font-semibold text-[#173b63] underline">Cela lista <ArrowRight size={15} aria-hidden="true"/></Link>
          </div>
          {news.length ? (
            <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">
              <ul className="divide-y divide-[#dce3e9]">
                {news.map((item) => (
                  <li key={item.id}>
                    <Link href={"/novosti/" + item.slug} className="group block px-4 py-3.5 hover:bg-[#f1f5f9] focus-visible:bg-[#f1f5f9]">
                      <time dateTime={item.publishedAt?.toISOString()} className="text-xs font-medium text-[#556777]">{item.publishedAt?.toLocaleDateString("sr-RS") ?? "Obaveštenje"}</time>
                      <span className="mt-1 block font-semibold leading-snug text-[#173b63] group-hover:underline">{item.title}</span>
                      <span className="mt-1 block line-clamp-1 text-sm text-[#556777]">{item.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : <p className="empty-state !text-left">Trenutno nema objavljenih obaveštenja.</p>}
        </section>

        <section aria-labelledby="home-courses-heading" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 id="home-courses-heading" className="text-xl font-bold">Predmeti</h2>
            <Link href="/predmeti" className="inline-flex items-center gap-1 text-sm font-semibold text-[#173b63] underline">Ceo katalog <ArrowRight size={15} aria-hidden="true"/></Link>
          </div>
          {courses.length ? (
            <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">
              <ul className="divide-y divide-[#dce3e9]">
                {courses.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f1f5f9]">
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs text-[#556777]">{item.code} · {item.studyLevel} · {item.semester}. semestar</span>
                      <Link href={"/predmeti/" + item.slug} className="mt-1 inline-block font-semibold leading-snug text-[#173b63] underline-offset-4 hover:underline">{item.title}</Link>
                    </div>
                    <Link href={"/predmeti/" + item.slug + "#materijali"} className="shrink-0 text-xs font-semibold text-[#173b63] underline">Materijali</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : <p className="empty-state !text-left">Predmeti će biti prikazani kada budu uneti u katalog.</p>}
        </section>
      </div>

      <section className="border-t border-[#dce3e9] bg-white">
        <div className="container-page grid gap-6 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:py-9">
          <div>
            <h2 className="text-lg font-bold">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo</h2>
            <p className="mt-2 text-sm leading-6 text-[#556777]">Informacije o nastavnom osoblju, istraživanju i radu katedre na Fakultetu tehničkih nauka.</p>
          </div>
          <nav aria-label="Ostale informacije" className="grid gap-2 text-sm font-semibold sm:grid-cols-2">
            <Link href="/nastavnici" className="text-[#173b63] underline">Nastavno osoblje</Link>
            <Link href="/kontakt" className="text-[#173b63] underline">Kontakt</Link>
            <Link href="/istrazivanje" className="text-[#173b63] underline">Istraživanje</Link>
            <Link href="/o-katedri" className="text-[#173b63] underline">O katedri</Link>
          </nav>
        </div>
      </section>
    </>
  );
}
