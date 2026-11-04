import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Prijava", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[68vh] items-center justify-center py-20">
      <div className="card-surface w-full max-w-[460px] p-8 md:p-11">
        <div className="feature-icon mb-6"><ShieldCheck size={28}/></div>
        <p className="eyebrow mb-3">EEPSI portal</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Dobrodošli nazad.</h1>
        <p className="mb-8 mt-3 text-sm leading-7 text-slate-500">Prijavite se svojim nalogom kako biste pristupili administratorskom i nastavničkom delu portala.</p>
        <LoginForm/>
        <p className="mt-7 text-center text-xs leading-6 text-slate-500">Nemate nalog? Obratite se administratoru katedre.</p>
      </div>
    </div>
  );
}
