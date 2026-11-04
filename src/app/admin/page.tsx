import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, FileText, GraduationCap, Newspaper, ShieldCheck, Users, UserRound } from "lucide-react";
import { currentUser } from "@/application/authorization";
import { db } from "@/infrastructure/db/prisma";
import { roleLabels } from "@/domain/authorization/permissions";

export default async function AdminDashboard() {
  const actor = await currentUser();
  if (!actor) return null;
  const isStudent = actor.role === "STUDENT";
  const isFaculty = actor.role === "PROFESSOR" || actor.role === "ASSISTANT";
  const canNews = actor.role === "SUPER_ADMIN" || actor.role === "EDITOR";
  const canManageUsers = actor.role === "SUPER_ADMIN";
  const canManageCourses = canNews;
  const [coursesCount, newsCount, usersCount, recentNews, ownCourses] = await Promise.all([
    db.course.count({ where: isFaculty ? { memberships: { some: { userId: actor.id } } } : {} }),
    db.news.count({ where: canNews ? {} : { status: "PUBLISHED" } }),
    canManageUsers ? db.user.count() : Promise.resolve(null),
    db.news.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, slug: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
    isFaculty ? db.course.findMany({
      where: { memberships: { some: { userId: actor.id } } },
      select: { id: true, title: true, code: true, _count: { select: { materials: true } } },
      orderBy: { title: "asc" },
      take: 6,
    }) : Promise.resolve([]),
  ]);

  const cards = [
    { label: isFaculty ? "Moji predmeti" : "Predmeti", value: coursesCount, icon: BookOpen, href: isStudent ? "/predmeti" : "/admin/predmeti" },
    { label: canNews ? "Sve novosti" : "Objavljene novosti", value: newsCount, icon: Newspaper, href: canNews ? "/admin/novosti" : "/novosti" },
    ...(usersCount === null ? [] : [{ label: "Korisnički nalozi", value: usersCount, icon: Users, href: "/admin/korisnici" }]),
  ];
  return <div className="space-y-8">
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="eyebrow mb-3">{isStudent ? "Studentski prostor" : "Kontrolna tabla"}</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Dobrodošli, {actor.name.split(" ")[0]}.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {isStudent ? "Na jednom mestu pronađite predmete, materijale i najnovija obaveštenja katedre." :
            isFaculty ? "Vaši predmeti, materijali i aktuelne informacije — bez nepotrebnog traženja." :
              "Pregledajte sadržaj i brzo pristupite najvažnijim uredničkim zadacima."}
        </p>
      </div>
      <span className="pill"><ShieldCheck size={14}/>{roleLabels[actor.role]}</span>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, href }) =>
        <Link href={href} key={label} className="card-surface card-interactive group flex items-center justify-between gap-4 p-6">
          <div><p className="text-sm font-semibold text-slate-500">{label}</p><strong className="mt-3 block text-3xl font-extrabold tabular-nums">{value}</strong></div>
          <span className="feature-icon"><Icon size={24}/></span>
          <ArrowUpRight className="text-slate-400 group-hover:text-teal-700" size={17}/>
        </Link>)}
    </div>

    <div className="grid items-start gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <section className="admin-panel">
        <h2 className="flex items-center gap-3"><FileText size={20} className="text-teal-700"/> Brze akcije</h2>
        <div className="grid gap-3">
          {canNews && <Link href="/admin/novosti" className="dashboard-action"><span className="flex items-center gap-3"><Newspaper size={18} className="text-teal-700"/> Piši i uređuj novosti</span><ArrowRight size={17}/></Link>}
          <Link href={isStudent ? "/predmeti" : "/admin/predmeti"} className="dashboard-action"><span className="flex items-center gap-3"><BookOpen size={18} className="text-teal-700"/>{isStudent ? "Pretraži katalog predmeta" : isFaculty ? "Upravljaj svojim predmetima" : "Upravljaj predmetima"}</span><ArrowRight size={17}/></Link>
          {(isStudent || isFaculty) && <Link href="/nastavnici" className="dashboard-action"><span className="flex items-center gap-3"><GraduationCap size={18} className="text-teal-700"/> Nastavni tim</span><ArrowRight size={17}/></Link>}
          {canManageUsers && <Link href="/admin/korisnici" className="dashboard-action"><span className="flex items-center gap-3"><Users size={18} className="text-teal-700"/> Korisnici i dozvole</span><ArrowRight size={17}/></Link>}
          <Link href="/admin/profil" className="dashboard-action"><span className="flex items-center gap-3"><UserRound size={18} className="text-teal-700"/> Moj profil i bezbednost</span><ArrowRight size={17}/></Link>
        </div>
      </section>
      <section className="admin-panel">
        <div className="mb-5 flex items-center justify-between gap-3"><h2 className="!mb-0 flex items-center gap-3"><CalendarDays size={20} className="text-teal-700"/> Aktuelnosti</h2><Link href="/novosti" className="text-xs font-bold text-teal-700 hover:underline">Sve novosti</Link></div>
        {recentNews.length ? <div className="divide-y divide-slate-100">{recentNews.map((item) =>
          <Link key={item.id} href={"/novosti/" + item.slug} className="group flex items-start justify-between gap-3 py-4 text-sm font-semibold text-slate-700 hover:text-teal-700">
            <span>{item.title}<small className="mt-1 block text-xs font-normal text-slate-500">{item.publishedAt?.toLocaleDateString("sr-RS")}</small></span><ArrowUpRight size={16} className="mt-1 shrink-0"/>
          </Link>)}</div> : <p className="text-sm leading-7 text-slate-500">Trenutno nema objavljenih novosti. Kada budu dostupne, pojaviće se ovde.</p>}
      </section>
    </div>
    {isFaculty && <section className="admin-panel">
      <h2>Predmeti na kojima ste angažovani</h2>
      {ownCourses.length ? <div className="grid gap-3 sm:grid-cols-2">{ownCourses.map((course) =>
        <Link href={"/admin/predmeti/" + course.id} key={course.id} className="dashboard-action">
          <span className="min-w-0"><strong className="block break-words">{course.title}</strong><small className="mt-1 block font-normal text-slate-500">{course.code} • {course._count.materials} materijala</small></span><ArrowRight size={17} className="shrink-0"/>
        </Link>)}</div> : <p className="text-sm text-slate-500">Još nemate dodeljene predmete. Administrator može da vam dodeli angažovanje.</p>}
    </section>}
    {canManageCourses && <p className="text-xs text-slate-500">Podaci se čitaju iz baze; prikaz dostupnih akcija prati ulogu vašeg naloga.</p>}
  </div>;
}
