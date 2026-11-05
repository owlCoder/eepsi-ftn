import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Newspaper, UserRound, Users } from "lucide-react";
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

  const metrics = [
    { label: isFaculty ? "Moji predmeti" : "Predmeti", value: coursesCount, href: isStudent ? "/predmeti" : "/admin/predmeti" },
    { label: canNews ? "Sve novosti" : "Objavljene novosti", value: newsCount, href: canNews ? "/admin/novosti" : "/novosti" },
    ...(usersCount === null ? [] : [{ label: "Korisnički nalozi", value: usersCount, href: "/admin/korisnici" }]),
  ];
  const actions = [
    ...(canNews ? [{ href: "/admin/novosti", label: "Napiši ili uredi novost", icon: Newspaper }] : []),
    { href: isStudent ? "/predmeti" : "/admin/predmeti", label: isStudent ? "Pretraži katalog predmeta" : isFaculty ? "Uredi moje predmete" : "Upravljaj predmetima", icon: BookOpen },
    ...(canManageUsers ? [{ href: "/admin/korisnici", label: "Upravljaj nalozima i pristupom", icon: Users }] : []),
    { href: "/admin/profil", label: "Profil i lozinka", icon: UserRound },
  ];
  return <div className="space-y-10">
    <header className="border-b border-[#abb7b2] pb-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-4">{isStudent ? "Studentski prostor" : "EEPSI / Radni prostor"}</p>
          <h1 className="display-serif text-4xl md:text-5xl">{isStudent ? "Moj portal" : "Pregled rada"}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#5a6b6d]">
            {isStudent ? "Pronađite predmete, materijale i obaveštenja katedre." :
              isFaculty ? "Brz pristup predmetima na kojima ste angažovani i nastavnim materijalima." :
                "Sadržaj portala, aktuelna obaveštenja i urednički zadaci."}
          </p>
        </div>
        <div className="border-l-2 border-[#b34b2c] pl-4">
          <span className="meta-label block">Prijavljen nalog</span>
          <strong className="mt-1 block text-sm">{actor.name}</strong>
          <span className="meta-label mt-1 block">{roleLabels[actor.role]}</span>
        </div>
      </div>
    </header>

    <section aria-labelledby="overview-counts">
      <div className="section-index"><span>01 / Stanje portala</span><span>Brojevi iz baze</span></div>
      <h2 id="overview-counts" className="sr-only">Pregled sadržaja</h2>
      <div className="grid border-l border-t border-[#d3d6ce] sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(item => <Link key={item.label} href={item.href} className="group flex min-h-32 flex-col justify-between gap-5 border-b border-r border-[#d3d6ce] bg-[#fffefa] p-5 hover:bg-[#f8eee1]">
          <div className="flex items-center justify-between gap-3"><span className="meta-label">{item.label}</span><ArrowUpRight className="text-[#b34b2c]" size={16}/></div>
          <strong className="font-mono text-4xl font-semibold tabular-nums tracking-tight">{item.value}</strong>
        </Link>)}
      </div>
    </section>

    <div className="grid items-start gap-10 xl:grid-cols-[1.08fr_.92fr]">
      <section>
        <div className="section-index"><span>02 / Brze akcije</span><span>Upravljanje</span></div>
        <h2 className="display-serif mb-6 text-2xl">Šta želite da uradite?</h2>
        <div className="divide-y divide-[#d3d6ce] border-t border-b border-[#d3d6ce]">
          {actions.map(({ href, label, icon: Icon }, i) => <Link href={href} key={href} className="group flex items-center gap-4 py-5 text-sm font-semibold text-[#1a2c31] hover:text-[#8b371d]">
            <span className="num-marker w-7 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <Icon size={19} className="shrink-0 text-[#205d57]" aria-hidden="true"/>
            <span className="flex-1">{label}</span>
            <ArrowRight size={17} className="text-[#b34b2c]" aria-hidden="true"/>
          </Link>)}
        </div>
      </section>
      <section>
        <div className="section-index"><span>03 / Aktuelnosti</span><span>Poslednje objave</span></div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="display-serif text-2xl">Novosti</h2>
          <Link href="/novosti" className="text-xs font-bold text-[#8b371d] underline">Sve novosti</Link>
        </div>
        {recentNews.length ? <div className="divide-y divide-[#d3d6ce] border-t border-[#d3d6ce]">{recentNews.map(item =>
          <Link key={item.id} href={"/novosti/" + item.slug} className="group flex items-start justify-between gap-4 py-4 text-sm font-semibold hover:text-[#8b371d]">
            <span>{item.title}<small className="meta-label mt-2 block">{item.publishedAt?.toLocaleDateString("sr-RS")}</small></span>
            <ArrowUpRight size={16} className="mt-1 shrink-0 text-[#b34b2c]"/>
          </Link>)}</div> :
          <p className="border-t border-[#d3d6ce] pt-5 text-sm leading-7 text-[#5a6b6d]">Trenutno nema objavljenih novosti.</p>}
      </section>
    </div>

    {isFaculty && <section>
      <div className="section-index"><span>04 / Angažovanja</span><span>Moji predmeti</span></div>
      <h2 className="display-serif mb-6 text-2xl">Predmeti na kojima ste angažovani</h2>
      {ownCourses.length ? <div className="grid gap-2 sm:grid-cols-2">{ownCourses.map(course =>
        <Link href={"/admin/predmeti/" + course.id} key={course.id} className="dashboard-action">
          <span className="min-w-0"><strong className="block break-words">{course.title}</strong><small className="meta-label mt-1 block">{course.code} / {course._count.materials} materijala</small></span><ArrowRight size={17} className="shrink-0"/>
        </Link>)}</div> : <p className="text-sm text-[#5a6b6d]">Još nemate dodeljene predmete. Administrator može da vam dodeli angažovanje.</p>}
    </section>}
  </div>;
}
