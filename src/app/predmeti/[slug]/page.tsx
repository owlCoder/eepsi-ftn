import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, FileText, GraduationCap, Users } from "lucide-react";
import { courseBySlug } from "@/infrastructure/repositories/content";

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
        <p className="mt-5 flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-500"><span className="flex items-center gap-2"><GraduationCap size={17}/>{course.studyLevel}</span><span className="flex items-center gap-2"><BookOpen size={17}/>{course.semester}. semestar</span></p>
      </div></div>
      <div className="container-page grid gap-7 py-16 lg:grid-cols-[1fr_350px]">
        <div className="space-y-7">
          <section className="card-surface p-8"><h2 className="text-2xl font-extrabold tracking-tight">O predmetu</h2><p className="prose-copy mt-6">{course.description}</p></section>
          <section className="card-surface p-8"><h2 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight"><FileText className="text-teal-700"/> Materijali</h2>
            {course.materials.length ? <div className="mt-7 divide-y divide-slate-100">{course.materials.map((material) =>
              <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 py-4 text-sm font-semibold text-[#164f58] hover:text-teal-700">{material.title}<ArrowUpRight size={18} className="shrink-0"/></a>)}</div>
              : <p className="mt-5 text-sm leading-7 text-slate-500">Nema dodatih materijala za ovaj predmet.</p>}
          </section>
        </div>
        <aside className="card-surface h-fit p-8"><h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight"><Users size={20} className="text-teal-700"/> Nastavni tim</h2>
          {course.memberships.length ? <div className="mt-6 space-y-5">{course.memberships.map((member) =>
            <div key={member.user.id} className="flex gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">{member.user.name.slice(0,1).toUpperCase()}</div><div><strong className="text-sm">{member.user.name}</strong><p className="mt-1 text-xs text-slate-500">{member.role === "PROFESSOR" ? "Nastavnik" : "Saradnik"}</p></div></div>)}</div>
            : <p className="mt-5 text-sm text-slate-500">Nastavni tim će uskoro biti dodat.</p>}
        </aside>
      </div>
    </>
  );
}
