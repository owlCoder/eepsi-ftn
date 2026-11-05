import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Files, UsersRound } from "lucide-react";
import { CourseMaterials } from "@/components/course-materials";
import { ShareButton } from "@/components/share-button";
import { courseBySlug } from "@/infrastructure/repositories/content";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseBySlug(slug);
  const description = course?.description.slice(0, 160) || "Opis, nastavni materijali i osoblje predmeta Katedre EEPSI.";
  return {
    title: course?.title || "Predmet",
    ...(!course ? { robots: { index: false, follow: false } } : {}),
    description,
    ...(course ? { openGraph: { title: course.title, description, type: "article" as const } } : {}),
  };
}

export default async function CourseDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await courseBySlug(slug);
  if (!course) notFound();

  return (
    <>
      <header className="detail-hero">
        <div className="container-page">
          <nav aria-label="Putanja" className="breadcrumbs">
            <Link href="/">Početna</Link><span aria-hidden="true">/</span>
            <Link href="/predmeti">Predmeti</Link><span aria-hidden="true">/</span><span>{course.code}</span>
          </nav>
          <p className="section-kicker !mb-3">PREDMET / {course.studyLevel}</p>
          <h1 className="page-title">{course.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="course-tile-code">{course.code}</span>
            <span className="pill pill-neutral">{course.studyLevel} · {course.semester}. semestar</span>
            <ShareButton/>
          </div>
        </div>
      </header>

      <div className="container-page grid items-start gap-6 py-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-7">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="course-materials" id="materijali" className="detail-panel">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="feature-icon" aria-hidden="true"><Files size={21}/></span>
                <h2 id="course-materials">Nastavni materijali</h2>
              </div>
              <span className="pill">{course.materials.length} materijala</span>
            </div>
            {course.materials.length ? (
              <CourseMaterials materials={course.materials.map(({ id, title, url, kind }) => ({ id, title, url, kind }))}/>
            ) : <p className="mt-5 text-sm text-[#5c6880]">Za ovaj predmet trenutno nema dostupnih materijala.</p>}
          </section>

          <section aria-labelledby="course-overview" id="opis-predmeta" className="detail-panel">
            <div className="mb-5 flex items-center gap-3">
              <span className="feature-icon" aria-hidden="true"><BookOpen size={21}/></span>
              <h2 id="course-overview">O predmetu</h2>
            </div>
            <p className="prose-copy">{course.description}</p>
          </section>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-32">
          <section className="detail-aside">
            <h2>Osnovni podaci</h2>
            <dl className="mt-5 divide-y divide-[#e4e8f0]">
              <div className="flex items-start justify-between gap-3 py-3 first:pt-0">
                <dt className="text-xs text-[#65728a]">Šifra predmeta</dt>
                <dd className="text-sm font-bold">{course.code}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 py-3">
                <dt className="text-xs text-[#65728a]">Nivo studija</dt>
                <dd className="text-sm font-bold">{course.studyLevel}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 py-3">
                <dt className="text-xs text-[#65728a]">Semestar</dt>
                <dd className="text-sm font-bold">{course.semester}.</dd>
              </div>
            </dl>
            <a href="#materijali" className="btn btn-primary mt-5 w-full">Otvori materijale</a>
          </section>
          <section className="detail-aside">
            <div className="flex items-center gap-2">
              <UsersRound size={18} className="text-[#284cdb]" aria-hidden="true"/>
              <h2>Nastavno osoblje</h2>
            </div>
            {course.memberships.length ? <ul className="mt-4 divide-y divide-[#e4e8f0]">
              {course.memberships.map(member => (
                <li key={member.user.id} className="py-3 first:pt-0 last:pb-0">
                  <strong className="block text-sm">{member.user.name}</strong>
                  <span className="mt-1 block text-xs text-[#65728a]">{member.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</span>
                </li>
              ))}
            </ul> : <p className="mt-4 text-sm text-[#65728a]">Nastavno osoblje trenutno nije navedeno.</p>}
            <Link href="/nastavnici" className="section-action mt-4 !min-h-8">Svo nastavno osoblje</Link>
          </section>
          <Link href="/predmeti" className="section-action"><ArrowLeft size={17} aria-hidden="true"/> Nazad na katalog</Link>
        </aside>
      </div>
    </>
  );
}
