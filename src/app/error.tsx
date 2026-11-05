"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("EEPSI route error", error.digest ?? "unknown"); }, [error]);
  return (
    <div className="container-page py-16 md:py-24">
      <div className="max-w-[650px]">
        <p className="eyebrow mb-3">Greška pri učitavanju</p>
        <h1 className="page-title">Stranica trenutno nije dostupna</h1>
        <p className="section-copy mt-4">Došlo je do problema pri učitavanju. Pokušajte ponovo ili se vratite na početnu stranu.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button className="btn btn-primary" type="button" onClick={reset}>Pokušaj ponovo</button>
          <Link href="/" className="btn btn-light">Početna strana</Link>
        </div>
      </div>
    </div>
  );
}
