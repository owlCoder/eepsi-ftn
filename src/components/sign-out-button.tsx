"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="mt-2 flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-[#344b5e] hover:bg-[#eaf1f8] hover:text-[#173b63]"><LogOut size={17}/> Odjavi se</button>;
}
