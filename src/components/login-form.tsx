"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      <div>
        <label htmlFor="password" className="form-label">Lozinka</label>
        <div className="relative">
          <input id="password" name="password" type={passwordVisible ? "text" : "password"}
            required autoComplete="current-password" className="input-field !pr-14" placeholder="Unesite lozinku"/>
          <button type="button" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-teal-50 hover:text-teal-800"
            aria-label={passwordVisible ? "Sakrij lozinku" : "Prikaži lozinku"}
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((value) => !value)}>
            {passwordVisible ? <EyeOff size={18} aria-hidden="true"/> : <Eye size={18} aria-hidden="true"/>}
          </button>
        </div>
      </div>
      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">{error}</p>}
      <button disabled={loading} className="btn btn-primary w-full disabled:opacity-60" type="submit">{loading ? <><LoaderCircle size={18} className="animate-spin"/> Provera…</> : <>Prijavi se <ArrowRight size={18}/></>}</button>
    </form>
  );
}
