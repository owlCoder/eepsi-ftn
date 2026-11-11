import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@/application/authorization";
import { db } from "@/infrastructure/db/prisma";

export default async function AdminDashboard() {
  const actor = await currentUser();
  if (!actor) return null;
  const isStudent = actor.role === "STUDENT";
  const isFaculty = actor.role === "PROFESSOR" || actor.role === "ASSISTANT";
  const canNews = actor.role === "SUPER_ADMIN" || actor.role === "EDITOR";
  const canManageUsers = actor.role === "SUPER_ADMIN";
  const [coursesCount, newsCount, usersCount, recentNews, ownCourses] = await Promise.all([
    db.course.count({ where: isFaculty ? { memberships: { some: { userId: actor.id } } } : {} }),
    db.news.count({ where: canNews ? {} : { status: "PUBLISHED" } }),
    canManageUsers ? db.user.count() : Promise.resolve(null),
    db.news.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, slug: true, publishedAt: true },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }], take: 4,
    }),
    isFaculty ? db.course.findMany({
      where: { memberships: { some: { userId: actor.id } } },
      select: { id: true, title: true, code: true, _count: { select: { materials: true } } },
      orderBy: { title: "asc" }, take: 6,
    }) : Promise.resolve([]),
  ]);
  const quickActions = [
    { href: isStudent ? "/predmeti" : "/admin/predmeti", title: isStudent ? "Katalog predmeta" : isFaculty ? "Moji predmeti" : "Upravljanje predmetima", description: isStudent ? "Pronađite predmete i materijale" : "Pregled predmeta i nastavnih materijala" },
    ...(canNews ? [{ href: "/admin/novosti", title: "Uređivanje obaveštenja", description: "Kreirajte, ažurirajte i objavite obaveštenja" }] : []),
    ...(canManageUsers ? [{ href: "/admin/korisnici", title: "Korisnički nalozi", description: "Uloge, pristup i angažovanja na predmetima" }] : []),
    { href: "/admin/profil", title: "Moj profil", description: "Lični podaci i promena lozinke" },
  ];
  return (
    <div className="space-y-9">
      <header>
        <p className="eyebrow mb-2">{isStudent ? "Studentski pristup" : "Administracija portala"}</p>
        <h1 className="page-title">Moj portal</h1>
        <p className="section-copy mt-3 max-w-2xl">{isStudent ? "Brz pristup predmetima, materijalima i obaveštenjima." : isFaculty ? "Rad sa predmetima i materijalima na kojima ste angažovani." : "Pregled sadržaja i dostupnih zadataka za vašu korisničku ulogu."}</p>
      </header>
      <section aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="mb-4 text-xl font-bold">Brze radnje</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {quickActions.map(item => <Link key={item.href} href={item.href} className="card-surface card-interactive flex min-h-[112px] items-start justify-between gap-5 p-5">
            <span><strong className="block text-base text-[#173b63]">{item.title}</strong><span className="mt-2 block text-sm leading-6 text-[#556777]">{item.description}</span></span>
            <ArrowRight size={18} className="mt-1 shrink-0 text-[#173b63]" aria-hidden="true"/>
          </Link>)}
        </div>
      </section>
      <section aria-labelledby="overview-title">
        <h2 id="overview-title" className="mb-4 text-xl font-bold">Pregled sadržaja</h2>
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg border border-[#dce3e9] bg-white p-5"><dt className="text-sm text-[#556777]">{isFaculty ? "Dodeljeni predmeti" : "Predmeti"}</dt><dd className="mt-2 text-2xl font-bold tabular-nums">{coursesCount}</dd></div>
          <div className="rounded-lg border border-[#dce3e9] bg-white p-5"><dt className="text-sm text-[#556777]">{canNews ? "Ukupno obaveštenja" : "Objavljena obaveštenja"}</dt><dd className="mt-2 text-2xl font-bold tabular-nums">{newsCount}</dd></div>
          {usersCount !== null && <div className="rounded-lg border border-[#dce3e9] bg-white p-5"><dt className="text-sm text-[#556777]">Korisnički nalozi</dt><dd className="mt-2 text-2xl font-bold tabular-nums">{usersCount}</dd></div>}
        </dl>
      </section>
      {isFaculty && <section aria-labelledby="assigned-courses">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4"><h2 id="assigned-courses" className="text-xl font-bold">Predmeti na kojima ste angažovani</h2><Link href="/admin/predmeti" className="text-sm font-semibold text-[#173b63] underline">Svi moji predmeti</Link></div>
        {ownCourses.length ? <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">{ownCourses.map(course =>
          <Link href={"/admin/predmeti/" + course.id} key={course.id} className="flex items-center justify-between gap-4 border-b border-[#dce3e9] px-5 py-4 last:border-b-0 hover:bg-[#f5f8fb]">
            <span><strong className="block text-sm text-[#173b63]">{course.title}</strong><span className="mt-1 block text-xs text-[#556777]">{course.code} · {course._count.materials} materijala</span></span><ArrowRight size={17} className="shrink-0 text-[#173b63]"/>
          </Link>)}</div> : <p className="empty-state">Trenutno nemate dodeljenih predmeta.</p>}
      </section>}
      <section aria-labelledby="portal-news">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4"><h2 id="portal-news" className="text-xl font-bold">Poslednja obaveštenja</h2><Link href="/novosti" className="text-sm font-semibold text-[#173b63] underline">Sva obaveštenja</Link></div>
        {recentNews.length ? <div className="overflow-hidden rounded-lg border border-[#dce3e9] bg-white">{recentNews.map(item =>
          <Link key={item.id} href={"/novosti/" + item.slug} className="grid gap-2 border-b border-[#dce3e9] px-5 py-4 last:border-b-0 hover:bg-[#f5f8fb] sm:grid-cols-[106px_minmax(0,1fr)_20px] sm:gap-4">
            <time className="text-xs text-[#556777]" dateTime={item.publishedAt?.toISOString()}>{item.publishedAt?.toLocaleDateString("sr-RS", { timeZone: "Europe/Belgrade" })}</time>
            <span className="text-sm font-semibold text-[#173b63]">{item.title}</span>
            <ArrowRight size={16} className="hidden text-[#173b63] sm:block"/>
          </Link>)}</div> : <p className="empty-state">Trenutno nema objavljenih obaveštenja.</p>}
      </section>
    </div>
  );
}
