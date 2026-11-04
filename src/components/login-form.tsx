"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const fields = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: String(fields.get("email") ?? ""),
        password: String(fields.get("password") ?? ""),
        redirect: false,
      });
      if (result?.error || !result?.ok) {
        setError("Pogrešna email adresa ili lozinka.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Prijava trenutno nije dostupna. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <div><label htmlFor="email" className="form-label">Email adresa</label><input id="email" name="email" type="email" required autoComplete="username" className="input-field" placeholder="ime@uns.ac.rs"/></div>
      <div><label htmlFor="password" className="form-label">Lozinka</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input-field" placeholder="Unesite lozinku"/></div>
      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">{error}</p>}
      <button disabled={loading} className="btn btn-primary w-full disabled:opacity-60" type="submit">{loading ? <><LoaderCircle size={18} className="animate-spin"/> Provera…</> : <>Prijavi se <ArrowRight size={18}/></>}</button>
    </form>
  );
}
