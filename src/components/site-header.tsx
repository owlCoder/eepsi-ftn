"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

const sections = [
  { href: "/predmeti", label: "Predmeti" },
  { href: "/novosti", label: "Obaveštenja" },
  { href: "/nastavnici", label: "Nastavno osoblje" },
  { href: "/istrazivanje", label: "Istraživanje" },
  { href: "/o-katedri", label: "O katedri" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

// These pages are linked in the footer but must also be reachable from the mobile menu.
const mobileExtraSections = [
  { href: "/laboratorija", label: "Smart Grid laboratorija" },
  { href: "/saradnja", label: "Saradnja sa privredom" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
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
        <div className="container-page flex items-center justify-between gap-2">
          <span>UNIVERZITET U NOVOM SADU <span aria-hidden="true" className="mx-2 opacity-40">/</span> FAKULTET TEHNIČKIH NAUKA</span>
          <span className="hidden sm:block">NOVI SAD, SRBIJA</span>
        </div>
      </div>
      <div className="container-page flex min-h-[76px] items-center gap-4 lg:gap-8">
        <Link href="/" className="brand flex min-w-0 shrink-0 items-center gap-3" aria-label="EEPSI — početna">
          <span className="brand-mark" aria-hidden="true">E<span className="brand-mark-dot"/></span>
          <span className="brand-wordmark">
            <strong>EEPSI<span className="brand-wordmark-dot">.</span></strong>
            <small>FTN · NOVI SAD</small>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 xl:flex" aria-label="Glavna navigacija">
          {sections.map(link => (
            <Link href={link.href} key={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={"nav-link " + (isActive(link.href) ? "nav-link-active" : "")}>{link.label}</Link>
          ))}
        </nav>
        <Link href="/admin" className="header-login hidden shrink-0 items-center gap-1.5 xl:inline-flex">
          Moj portal <ArrowUpRight size={15} aria-hidden="true"/>
        </Link>
        <details ref={menu} className="group relative ml-auto xl:hidden"
          onToggle={event => setMenuOpen(event.currentTarget.open)}>
          <summary className="menu-toggle flex h-11 w-11 items-center justify-center" aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}>
            <Menu size={22} className="group-open:hidden" aria-hidden="true"/>
            <X size={22} className="hidden group-open:block" aria-hidden="true"/>
          </summary>
          <nav className="mobile-menu" aria-label="Mobilna navigacija">
            <p className="menu-caption">MENI / NAVIGACIJA</p>
            {sections.map(link => <Link key={link.href} href={link.href} onClick={closeMenu}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={"mobile-menu-link " + (isActive(link.href) ? "mobile-menu-link-active" : "")}>{link.label}</Link>)}
            {mobileExtraSections.map(link => <Link key={link.href} href={link.href} onClick={closeMenu}
              className="mobile-menu-link">{link.label}</Link>)}
            <div className="mt-3 border-t border-[#e4e8f0] pt-3">
              <Link href="/admin" className="btn btn-primary w-full" onClick={closeMenu}>Moj portal / prijava</Link>
            </div>
          </nav>
        </details>
      </div>
      <nav aria-label="Brzi pristup studentima" className="container-page student-header-nav flex gap-2 pb-3 xl:hidden">
        <Link href="/predmeti" aria-current={isActive("/predmeti") ? "page" : undefined}
          className={"student-header-link " + (isActive("/predmeti") ? "student-header-link-active" : "")}>Predmeti</Link>
        <Link href="/novosti" aria-current={isActive("/novosti") ? "page" : undefined}
          className={"student-header-link " + (isActive("/novosti") ? "student-header-link-active" : "")}>Obaveštenja</Link>
      </nav>
    </header>
  );
}
