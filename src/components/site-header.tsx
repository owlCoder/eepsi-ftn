"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpenCheck, Menu } from "lucide-react";

const links = [
  { href: "/", label: "Početna" },
  { href: "/o-katedri", label: "O katedri" },
  { href: "/predmeti", label: "Predmeti" },
  { href: "/nastavnici", label: "Nastavni tim" },
  { href: "/novosti", label: "Novosti" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container-page flex h-[76px] items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="EEPSI — početna">
          <span className="brand-mark"><BookOpenCheck size={25} strokeWidth={2.1}/></span>
          <span className="min-w-0 leading-tight">
            <strong className="block text-[20px] tracking-[-.06em] text-[#173448]">EEPSI <span className="text-[#087c71]">FTN</span></strong>
            <small className="hidden text-[10px] font-bold tracking-[.06em] text-slate-500 sm:block">KATEDRA • NOVI SAD</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Glavna navigacija">
          {links.map((link) => <Link key={link.href} href={link.href} className={"nav-link " + (active(link.href) ? "nav-link-active" : "")} aria-current={active(link.href) ? "page" : undefined}>{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/prijava" className="btn btn-light">Prijava</Link>
          <Link href="/admin" className="btn btn-primary">Moj portal <ArrowUpRight size={16}/></Link>
        </div>
        <details ref={mobileMenu} className="group relative lg:hidden">
          <summary className="flex h-11 w-11 list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-teal-50" aria-label="Otvori meni"><Menu size={22}/></summary>
          <nav className="mobile-menu absolute right-0 top-14 z-50 w-[min(88vw,310px)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl" aria-label="Mobilna navigacija">
            {links.map((link) =>
              <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined} onClick={() => { if (mobileMenu.current) mobileMenu.current.open = false; }} className={"mobile-menu-link " + (active(link.href) ? "mobile-menu-link-active" : "")}>{link.label}</Link>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <Link href="/prijava" onClick={() => { if (mobileMenu.current) mobileMenu.current.open = false; }} className="btn btn-light !px-3">Prijava</Link>
              <Link href="/admin" onClick={() => { if (mobileMenu.current) mobileMenu.current.open = false; }} className="btn btn-primary !px-3">Moj portal</Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
