import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="container-page academic-inner-page">
      <nav aria-label="Putanja" className="breadcrumbs">
        <Link href="/">Početna</Link><span aria-hidden="true">/</span>
        <Link href="/predmeti">Predmeti</Link><span aria-hidden="true">/</span><span>{course.code}</span>
      </nav>
      <header className="academic-course-heading">
        <span className="academic-code">{course.code}</span>
        <h1>{course.title}</h1>
        <p>{course.studyLevel} · {course.semester}. semestar</p>
      </header>

      <nav aria-label="Sadržaj predmeta" className="academic-course-tabs">
        <a href="#materijali">Materijali</a>
        <a href="#opis-predmeta">Osnovne informacije</a>
        <a href="#nastavni-tim">Nastavno osoblje</a>
      </nav>

      <div className="academic-course-grid">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="course-materials" id="materijali" className="academic-content-panel">
            <div className="academic-panel-heading">
              <h2 id="course-materials">Nastavni materijali</h2>
              <span>{course.materials.length} materijala</span>
            </div>
            {course.materials.length ? (
              <CourseMaterials materials={course.materials.map(({ id, title, url, kind }) => ({ id, title, url, kind }))}/>
            ) : <p className="academic-empty">Za ovaj predmet trenutno nema dostupnih materijala.</p>}
          </section>
          <section aria-labelledby="course-overview" id="opis-predmeta" className="academic-content-panel">
            <div className="academic-panel-heading"><h2 id="course-overview">O predmetu</h2></div>
            <p className="prose-copy">{course.description}</p>
          </section>
        </div>
        <aside className="academic-course-aside" aria-label="Informacije o predmetu">
          <section className="academic-aside-block">
            <h2>Osnovni podaci</h2>
            <dl>
              <div><dt>Šifra</dt><dd>{course.code}</dd></div>
              <div><dt>Nivo studija</dt><dd>{course.studyLevel}</dd></div>
              <div><dt>Semestar</dt><dd>{course.semester}.</dd></div>
            </dl>
          </section>
          <section id="nastavni-tim" className="academic-aside-block">
            <h2>Nastavno osoblje</h2>
            {course.memberships.length ? <ul className="academic-staff-list">
              {course.memberships.map(member => (
                <li key={member.user.id}>
                  <strong>{member.user.name}</strong>
                  <span>{member.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</span>
                </li>
              ))}
            </ul> : <p className="academic-empty">Nastavno osoblje trenutno nije navedeno.</p>}
            <Link href="/nastavnici" className="academic-text-link">Pregled nastavnog osoblja</Link>
          </section>
          <div className="academic-course-share"><ShareButton/></div>
          <Link href="/predmeti" className="academic-text-link">← Nazad na katalog</Link>
        </aside>
      </div>
    </div>
  );
}
