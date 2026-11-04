"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("EEPSI route error", error.digest ?? "unknown"); }, [error]);
  return (
    <div className="container-page py-28 text-center">
      <AlertTriangle className="mx-auto text-amber-600" size={40}/>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Nije moguće učitati stranicu.</h1>
      <p className="section-copy mx-auto mt-4 max-w-lg">Došlo je do privremenog problema. Pokušajte ponovo ili se vratite na početnu stranicu.</p>
      <button className="btn btn-primary mt-8" onClick={() => reset()}><RotateCcw size={18}/> Pokušaj ponovo</button>
    </div>
  );
}
