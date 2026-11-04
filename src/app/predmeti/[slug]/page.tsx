import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, FileText, GraduationCap, Users } from "lucide-react";
import { courseBySlug } from "@/infrastructure/repositories/content";
import { CourseMaterials } from "@/components/course-materials";
import { ShareButton } from "@/components/share-button";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseBySlug(slug);
  return { title: course?.title || "Predmet" };
}

export default async function CourseDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await courseBySlug(slug);
  if (!course) notFound();
  return (
    <>
      <div className="page-banner"><div className="container-page">
        <Link href="/predmeti" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft size={16}/> Nazad na predmete</Link>
        <div><span className="pill">{course.code}</span></div>
        <h1 className="page-title mt-5 max-w-4xl">{course.title}</h1>
        <p className="mt-5 flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-500"><span className="flex items-center gap-2"><GraduationCap size={17}/>{course.studyLevel}</span><span className="flex items-center gap-2"><BookOpen size={17}/>{course.semester}. semestar</span></p><div className="mt-5"><ShareButton/></div>
      </div></div>
      <div className="container-page grid gap-7 py-16 lg:grid-cols-[1fr_350px]">
        <div className="space-y-7">
          <section className="card-surface p-8"><h2 className="text-2xl font-extrabold tracking-tight">O predmetu</h2><p className="prose-copy mt-6">{course.description}</p></section>
          <section className="card-surface p-6 sm:p-8" aria-labelledby="course-materials">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="course-materials" className="flex items-center gap-3 text-2xl font-extrabold tracking-tight"><FileText className="text-teal-700"/> Nastavni materijali</h2>
              <span className="pill pill-neutral">{course.materials.length} materijala</span>
            </div>
            {course.materials.length ? <CourseMaterials materials={course.materials.map(({ id, title, url, kind }) => ({ id, title, url, kind }))}/>
              : <p className="mt-5 text-sm leading-7 text-slate-500">Nema dodatih materijala za ovaj predmet.</p>}
          </section>
        </div>
        <aside className="card-surface h-fit p-6 sm:p-8 lg:sticky lg:top-28"><h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight"><Users size={20} className="text-teal-700"/> Nastavni tim</h2>
          {course.memberships.length ? <div className="mt-6 space-y-5">{course.memberships.map((member) =>
            <div key={member.user.id} className="flex gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">{member.user.name.slice(0,1).toUpperCase()}</div><div><strong className="text-sm">{member.user.name}</strong><p className="mt-1 text-xs text-slate-500">{member.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</p></div></div>)}</div>
            : <p className="mt-5 text-sm text-slate-500">Nastavni tim će uskoro biti dodat.</p>}
        <div className="mt-7 border-t border-slate-100 pt-5"><Link href="/nastavnici" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700">Kompletan nastavni tim <ArrowUpRight size={16}/></Link></div></aside>
      </div>
    </>
  );
}
