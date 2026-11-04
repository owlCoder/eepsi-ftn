"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50"><LogOut size={17}/> Odjavi se</button>;
}
