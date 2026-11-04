import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, Menu } from "lucide-react";

const links = [
  { href: "/", label: "Početna" },
  { href: "/o-katedri", label: "O katedri" },
  { href: "/predmeti", label: "Predmeti" },
  { href: "/novosti", label: "Novosti" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container-page flex h-[80px] items-center justify-between gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="EEPSI — početna">
          <span className="brand-mark"><BookOpenCheck size={25} strokeWidth={2.1} /></span>
          <span className="min-w-0 leading-tight">
            <strong className="block text-[19px] tracking-[-.05em] text-[#173448]">EEPSI <span className="text-[#087c71]">FTN</span></strong>
            <small className="hidden text-[10px] font-semibold tracking-[.05em] text-slate-500 sm:block">KATEDRA • NOVI SAD</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Glavna navigacija">
          {links.map((link) => <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/prijava" className="btn btn-light">Prijava</Link>
          <Link href="/admin" className="btn btn-primary">Moj portal <ArrowUpRight size={16} /></Link>
        </div>
        <details className="group relative lg:hidden">
          <summary className="flex h-11 w-11 list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700" aria-label="Otvori meni"><Menu size={22}/></summary>
          <div className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            {[...links, { href: "/prijava", label: "Prijava" }, { href: "/admin", label: "Moj portal" }].map((link) =>
              <Link key={link.href} href={link.href} className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-teal-50">{link.label}</Link>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
