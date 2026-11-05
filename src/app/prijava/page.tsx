import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { currentUser } from "@/application/authorization";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Prijava", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ changed?: string }> }) {
  if (await currentUser()) redirect("/admin");
  const { changed } = await searchParams;
  return (
    <div className="container-page flex min-h-[68vh] items-center justify-center py-20">
      <div className="card-surface w-full max-w-[460px] p-8 md:p-11">
        <div className="feature-icon mb-6"><ShieldCheck size={28}/></div>
        <p className="eyebrow mb-3">EEPSI portal</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Dobrodošli nazad.</h1>
        <p className="mb-8 mt-3 text-sm leading-7 text-slate-500">Prijavite se za pristup studentskim materijalima, nastavničkim alatima i uredničkom delu portala.</p>
        {changed && <p role="status" className="mb-5 rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-800">Lozinka je promenjena. Prijavite se ponovo.</p>}
        <LoginForm/>
        <div className="mt-7 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs leading-6 text-slate-500">Nemate nalog ili ste zaboravili lozinku?</p>
          <a href="mailto:eespsi@uns.ac.rs?subject=EEPSI%20portal%20-%20pomo%C4%87%20oko%20naloga"
            className="mt-1 inline-flex min-h-10 items-center justify-center text-sm font-bold text-teal-700 hover:underline">Kontaktirajte administraciju katedre</a>
        </div>
      </div>
    </div>
  );
}
