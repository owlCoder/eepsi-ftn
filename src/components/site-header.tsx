"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, UserRound, X } from "lucide-react";

const sections = [
  { href: "/", label: "Početna" },
  { href: "/predmeti", label: "Predmeti" },
  { href: "/novosti", label: "Obaveštenja" },
  { href: "/nastavnici", label: "Nastavno osoblje" },
  { href: "/istrazivanje", label: "Istraživanje" },
  { href: "/o-katedri", label: "O katedri" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

const mobileExtraSections = [
  { href: "/laboratorija", label: "Smart Grid laboratorija" },
  { href: "/saradnja", label: "Saradnja sa privredom" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  const closeMenu = useCallback(() => { if (menu.current) menu.current.open = false; }, []);

  useEffect(() => { closeMenu(); }, [pathname, closeMenu]);
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) closeMenu();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menu.current?.open) return;
      const focusWasInside = menu.current.contains(document.activeElement);
      closeMenu();
      if (focusWasInside) menu.current.querySelector("summary")?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu]);

  return (
    <header className="site-header">
      <div className="site-institution">
        <div className="container-page header-main">
          <Link href="/" className="institution-brand" aria-label="EEPSI — početna">
            <strong>FTN</strong>
            <span className="institution-brand-long">UNIVERZITET U NOVOM SADU<br/>FAKULTET TEHNIČKIH NAUKA</span>
            <span className="institution-brand-mobile">EEPSI</span>
          </Link>
          <div className="institution-department">
            Katedra za elektroenergetiku<br/>i primenjeno softversko inženjerstvo
          </div>
          <div className="header-actions">
            <Link href="/predmeti" className="header-search" aria-label="Pretraga predmeta"><Search size={19} aria-hidden="true"/></Link>
            <Link href="/admin" className="header-login"><UserRound size={17} aria-hidden="true"/> Prijava</Link>
          </div>
          <details ref={menu} className="group relative ml-auto xl:hidden" onToggle={event => setMenuOpen(event.currentTarget.open)}>
            <summary className="menu-toggle flex h-11 w-11 items-center justify-center" aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}>
              <Menu size={23} className="group-open:hidden" aria-hidden="true"/>
              <X size={23} className="hidden group-open:block" aria-hidden="true"/>
            </summary>
            <nav className="mobile-menu" aria-label="Mobilna navigacija">
              <p className="menu-caption">NAVIGACIJA</p>
              {sections.map(link => <Link href={link.href} key={link.href} onClick={closeMenu}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={"mobile-menu-link " + (isActive(link.href) ? "mobile-menu-link-active" : "")}>{link.label}</Link>)}
              {mobileExtraSections.map(link => <Link key={link.href} href={link.href} onClick={closeMenu}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={"mobile-menu-link " + (isActive(link.href) ? "mobile-menu-link-active" : "")}>{link.label}</Link>)}
              <div className="mt-3 border-t border-[#dce3ee] pt-3">
                <Link href="/admin" className="btn btn-primary w-full" onClick={closeMenu}>Prijava na portal</Link>
              </div>
            </nav>
          </details>
        </div>
      </div>
      <nav className="container-page header-desktop-nav hidden xl:flex" aria-label="Glavna navigacija">
        {sections.map(link => <Link key={link.href} href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={"nav-link " + (isActive(link.href) ? "nav-link-active" : "")}>{link.label}</Link>)}
      </nav>
      <nav aria-label="Brzi pristup studentima" className="container-page student-header-nav flex gap-2 xl:hidden">
        <Link href="/predmeti" aria-current={isActive("/predmeti") ? "page" : undefined}
          className={"student-header-link " + (isActive("/predmeti") ? "student-header-link-active" : "")}>Predmeti</Link>
        <Link href="/novosti" aria-current={isActive("/novosti") ? "page" : undefined}
          className={"student-header-link " + (isActive("/novosti") ? "student-header-link-active" : "")}>Obaveštenja</Link>
      </nav>
    </header>
  );
}
