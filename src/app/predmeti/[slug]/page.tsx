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
      <header className="page-banner"><div className="container-page">
        <nav aria-label="Putanja" className="mb-5 text-xs text-[#556777]">
          <Link href="/" className="hover:underline">Početna</Link> / <Link href="/predmeti" className="hover:underline">Predmeti</Link> / {course.code}
        </nav>
        <p className="eyebrow mb-3">Predmet · {course.studyLevel} · {course.semester}. semestar</p>
        <h1 className="page-title">{course.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="pill">{course.code}</span>
          <ShareButton/>
        </div>
      </div></header>

      <div className="container-page grid items-start gap-9 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_275px] lg:gap-12">
        <div className="min-w-0 space-y-11">
          <section aria-labelledby="course-overview" id="opis-predmeta">
            <h2 id="course-overview" className="mb-4 text-xl font-bold">Opis predmeta</h2>
            <p className="prose-copy">{course.description}</p>
          </section>

          <section aria-labelledby="course-materials" id="materijali">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-3 border-t border-[#dce3e9] pt-8">
              <h2 id="course-materials" className="text-xl font-bold">Nastavni materijali</h2>
              <span className="text-xs font-semibold text-[#556777]">{course.materials.length} materijala</span>
            </div>
            {course.materials.length
              ? <CourseMaterials materials={course.materials.map(({ id, title, url, kind }) => ({ id, title, url, kind }))}/>
              : <p className="mt-4 text-sm text-[#556777]">Za ovaj predmet trenutno nema dostupnih materijala.</p>}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-29">
          <section className="rounded-lg border border-[#dce3e9] bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">Informacije o predmetu</h2>
            <dl className="space-y-3 text-sm">
              <div className="border-b border-[#dce3e9] pb-3"><dt className="text-xs text-[#556777]">Šifra</dt><dd className="mt-1 font-semibold">{course.code}</dd></div>
              <div className="border-b border-[#dce3e9] pb-3"><dt className="text-xs text-[#556777]">Nivo studija</dt><dd className="mt-1 font-semibold">{course.studyLevel}</dd></div>
              <div><dt className="text-xs text-[#556777]">Semestar</dt><dd className="mt-1 font-semibold">{course.semester}. semestar</dd></div>
            </dl>
            <a href="#materijali" className="btn btn-light mt-5 w-full">Idi na materijale</a>
          </section>
          <section className="rounded-lg border border-[#dce3e9] bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">Nastavno osoblje</h2>
            {course.memberships.length ? <ul className="divide-y divide-[#dce3e9]">
              {course.memberships.map(member => <li key={member.user.id} className="py-3 first:pt-0 last:pb-0">
                <span className="block text-sm font-semibold">{member.user.name}</span>
                <span className="mt-1 block text-xs text-[#556777]">{member.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</span>
              </li>)}
            </ul> : <p className="text-sm text-[#556777]">Nastavno osoblje trenutno nije navedeno.</p>}
            <Link href="/nastavnici" className="mt-5 inline-block text-sm font-semibold text-[#173b63] underline">Pregled nastavnog osoblja</Link>
          </section>
        </aside>
      </div>
    </>
  );
}
