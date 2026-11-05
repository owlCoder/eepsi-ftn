"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const sections = [
  { href: "/predmeti", label: "Predmeti" },
  { href: "/nastavnici", label: "Nastavno osoblje" },
  { href: "/novosti", label: "Obaveštenja" },
  { href: "/istrazivanje", label: "Istraživanje" },
  { href: "/o-katedri", label: "O katedri" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const closeMenu = () => { if (menu.current) menu.current.open = false; };

  return (
    <header className="site-header">
      <div className="site-institution">
        <div className="container-page flex min-h-8 items-center justify-between gap-3 py-1 text-[11px]">
          <span>Univerzitet u Novom Sadu <span className="px-1 text-slate-400">/</span> Fakultet tehničkih nauka</span>
          <span className="hidden text-slate-600 sm:inline">Novi Sad</span>
        </div>
      </div>
      <div className="container-page flex min-h-[78px] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 py-2" aria-label="EEPSI — početna">
          <span className="brand-mark" aria-hidden="true">E</span>
          <span className="min-w-0">
            <strong className="block text-[20px] font-extrabold leading-tight tracking-[-.03em] text-[#173b63]">EEPSI <span className="text-[13px] font-semibold text-slate-500">/ FTN</span></strong>
            <span className="hidden max-w-[320px] truncate text-[11px] leading-5 text-[#556777] sm:block">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-0 xl:flex" aria-label="Glavna navigacija">
          {sections.map((link) => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={"nav-link " + (isActive(link.href) ? "nav-link-active" : "")}>{link.label}</Link>)}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Link href="/admin" className="btn btn-primary">Moj portal</Link>
        </div>
        <details ref={menu} className="group relative ml-auto xl:hidden">
          <summary className="flex h-11 w-11 list-none items-center justify-center rounded-md border border-[#b8c6d2] bg-white text-[#173b63]" aria-label="Otvori meni">
            <Menu size={22} className="group-open:hidden" aria-hidden="true"/>
            <X size={21} className="hidden group-open:block" aria-hidden="true"/>
          </summary>
          <nav className="mobile-menu" aria-label="Mobilna navigacija">
            <p className="px-3 pb-2 pt-1 text-xs font-semibold text-[#556777]">Navigacija</p>
            {sections.map((link) => <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={isActive(link.href) ? "page" : undefined} className={"mobile-menu-link " + (isActive(link.href) ? "mobile-menu-link-active" : "")}>{link.label}</Link>)}
            <div className="mt-3 border-t border-[#dce3e9] px-2 pt-3">
              <Link href="/admin" onClick={closeMenu} className="btn btn-primary w-full">Moj portal / prijava</Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
