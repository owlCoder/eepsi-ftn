"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import { BrandGlyph } from "@/components/energy-network";

const links = [
  { href: "/", label: "Početna" },
  { href: "/predmeti", label: "Predmeti" },
  { href: "/nastavnici", label: "Nastavni tim" },
  { href: "/novosti", label: "Novosti" },
] as const;
const aboutLinks = [
  { href: "/o-katedri", label: "O katedri" },
  { href: "/istrazivanje", label: "Istraživanje" },
  { href: "/laboratorija", label: "Smart Grid laboratorija" },
  { href: "/saradnja", label: "Saradnja sa privredom" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const aboutActive = aboutLinks.some(link => active(link.href));
  const closeMobile = () => { if (mobileMenu.current) mobileMenu.current.open = false; };

  return <header className="site-header">
    <div className="site-institution">
      <div className="container-page flex min-h-7 items-center justify-between gap-2 py-1 text-[10px] font-semibold uppercase tracking-[.12em]">
        <span>Univerzitet u Novom Sadu / Fakultet tehničkih nauka</span><span className="hidden sm:inline">Katedra EEPSI</span>
      </div>
    </div>
    <div className="container-page flex min-h-[76px] items-center justify-between gap-4">
      <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="EEPSI — početna">
        <span className="brand-mark"><BrandGlyph/></span>
        <span className="min-w-0 leading-tight">
          <strong className="block text-[20px] font-extrabold tracking-[-.045em] text-[#1a2c31]">EEPSI <span className="text-[#b34b2c]">/ FTN</span></strong>
          <small className="block text-[10px] font-semibold uppercase tracking-[.09em] text-[#5a6b6d]">Elektroenergetika i softver</small>
        </span>
      </Link>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Glavna navigacija">
        {links.map(link => <Link key={link.href} href={link.href} className={"nav-link " + (active(link.href) ? "nav-link-active" : "")} aria-current={active(link.href) ? "page" : undefined}>{link.label}</Link>)}
        <details className="nav-menu">
          <summary className={"nav-link list-none " + (aboutActive ? "nav-link-active" : "")}>Katedra <ChevronDown size={14}/></summary>
          <div className="nav-menu-content">{aboutLinks.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined}>{link.label}<ArrowUpRight size={15}/></Link>)}</div>
        </details>
      </nav>
      <div className="hidden items-center gap-2 lg:flex">
        <Link href="/prijava" className="btn btn-light">Prijava</Link>
        <Link href="/admin" className="btn btn-dark">Moj portal <ArrowUpRight size={16}/></Link>
      </div>
      <details ref={mobileMenu} className="group relative lg:hidden">
        <summary className="flex h-11 w-11 list-none items-center justify-center border border-[#abb7b2] bg-[#fffefa] text-[#1a2c31]" aria-label="Otvori meni"><Menu size={22}/></summary>
        <nav className="mobile-menu" aria-label="Mobilna navigacija">
          {[...links, ...aboutLinks].map(link => <Link key={link.href} href={link.href} onClick={closeMobile} aria-current={active(link.href) ? "page" : undefined} className={"mobile-menu-link " + (active(link.href) ? "mobile-menu-link-active" : "")}>{link.label}</Link>)}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/prijava" onClick={closeMobile} className="btn btn-light">Prijava</Link>
            <Link href="/admin" onClick={closeMobile} className="btn btn-dark">Moj portal</Link>
          </div>
        </nav>
      </details>
    </div>
  </header>;
}
