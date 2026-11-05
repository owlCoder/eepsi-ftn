"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function ShareButton() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return <button type="button" onClick={copyLink}
    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#b8c6d2] bg-white px-3 py-2 text-xs font-semibold text-[#173b63] transition-colors hover:bg-[#eaf1f8]"
    aria-label="Kopiraj link stranice" title="Kopiraj link ove stranice">
    {status === "copied" ? <Check size={15}/> : status === "error" ? <Share2 size={15}/> : <Copy size={15}/>}
    <span aria-live="polite">{status === "copied" ? "Link kopiran" : status === "error" ? "Nije moguće kopirati" : "Podeli stranicu"}</span>
  </button>;
}
