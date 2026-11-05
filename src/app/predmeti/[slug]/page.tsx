import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FileText } from "lucide-react";
import { courseBySlug } from "@/infrastructure/repositories/content";
import { CourseMaterials } from "@/components/course-materials";
import { ShareButton } from "@/components/share-button";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseBySlug(slug);
  const description = course?.description.slice(0, 160) || "Nastavni plan, tim i materijali predmeta Katedre EEPSI.";
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
  return <>
    <header className="page-banner"><div className="container-page">
      <Link href="/predmeti" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#8b371d]"><ArrowLeft size={16}/> Katalog predmeta</Link>
      <p className="eyebrow mb-5">Studijski program / {course.code}</p>
      <h1 className="page-title">{course.title}</h1>
      <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-[#abb7b2] pt-5">
        <span className="pill">{course.code}</span><span className="meta-label">{course.studyLevel}</span><span className="meta-label">{course.semester}. semestar</span><ShareButton/>
      </div>
    </div></header>
    <div className="container-page grid items-start gap-10 py-13 md:py-19 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
      <div className="space-y-14">
        <section aria-labelledby="about-course">
          <div className="section-index"><span>01 / Opis predmeta</span><span>{course.code}</span></div>
          <h2 id="about-course" className="display-serif mb-6 text-3xl">O predmetu</h2>
          <p className="prose-copy">{course.description}</p>
        </section>
        <section aria-labelledby="course-materials">
          <div className="section-index"><span>02 / Nastavni materijali</span><span>{course.materials.length} ukupno</span></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="course-materials" className="display-serif flex items-center gap-3 text-3xl"><FileText size={23} className="text-[#b34b2c]"/> Materijali</h2>
            <span className="pill pill-neutral">{course.materials.length} materijala</span>
          </div>
          {course.materials.length ? <CourseMaterials materials={course.materials.map(({ id, title, url, kind }) => ({ id, title, url, kind }))}/>
            : <p className="mt-5 text-sm leading-7 text-[#5a6b6d]">Nema dodatih materijala za ovaj predmet.</p>}
        </section>
      </div>
      <aside className="border-t-[3px] border-[#1a2c31] bg-[#e9ece4] p-6 lg:sticky lg:top-30">
        <div className="section-index !border-0 !pt-0"><span>03 / Nastavni tim</span></div>
        <h2 className="display-serif mb-6 text-2xl">Angažovani nastavnici i saradnici</h2>
        {course.memberships.length ? <div className="divide-y divide-[#cad3cb]">{course.memberships.map(member =>
          <div key={member.user.id} className="py-4">
            <strong className="block text-sm font-bold">{member.user.name}</strong>
            <span className="meta-label mt-1 block">{member.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</span>
          </div>)}</div>
          : <p className="text-sm leading-7 text-[#5a6b6d]">Nastavni tim će biti dodat kada angažovanja budu potvrđena.</p>}
        <Link href="/nastavnici" className="mt-7 inline-flex items-center gap-2 border-b border-[#b34b2c] pb-1 text-sm font-bold text-[#8b371d]">Kompletan tim <ArrowUpRight size={16}/></Link>
      </aside>
    </div>
  </>;
}
