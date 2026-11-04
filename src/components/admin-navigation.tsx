"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Newspaper, Users, ScrollText, UserRound } from "lucide-react";

export function AdminNavigation({ canNews, canUsers }: { canNews: boolean; canUsers: boolean }) {
  const path = usePathname();
  const links = [
    { href: "/admin", label: "Pregled", icon: LayoutDashboard },
    ...(canNews ? [{ href: "/admin/novosti", label: "Novosti", icon: Newspaper }] : []),
    { href: "/admin/predmeti", label: "Predmeti", icon: BookOpen },
    { href: "/admin/profil", label: "Moj profil", icon: UserRound },
    ...(canUsers ? [
      { href: "/admin/korisnici", label: "Korisnici / RBAC", icon: Users },
      { href: "/admin/audit", label: "Audit log", icon: ScrollText },
    ] : []),
  ];
  return <nav className="admin-nav" aria-label="Administracija">
    {links.map(({ href, label, icon: Icon }) => {
      const selected = href === "/admin" ? path === href : path.startsWith(href);
      return <Link key={href} href={href} aria-current={selected ? "page" : undefined} className={"admin-nav-link " + (selected ? "admin-nav-link-active" : "")}>
        <Icon size={18} aria-hidden="true"/><span>{label}</span>
      </Link>;
    })}
  </nav>;
}
