"use client";

import { useActionState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { changePasswordAction } from "@/app/actions/profile";

type PasswordState = { status: "idle" | "error" | "success"; message: string };

const initialState: PasswordState = { status: "idle", message: "" };

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      void signOut({ callbackUrl: "/prijava?changed=1" });
    }
  }, [state.status]);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="form-label" htmlFor="current-password">Trenutna lozinka</label>
        <input className="input-field" id="current-password" name="currentPassword" type="password" autoComplete="current-password" required maxLength={200}/>
      </div>
      <div className="form-grid">
        <div>
          <label className="form-label" htmlFor="new-password">Nova lozinka</label>
          <input className="input-field" id="new-password" name="newPassword" type="password" aria-describedby="password-requirements" minLength={12} maxLength={200} autoComplete="new-password" required/>
        </div>
        <div>
          <label className="form-label" htmlFor="confirm-password">Ponovite novu lozinku</label>
          <input className="input-field" id="confirm-password" name="confirmPassword" type="password" aria-describedby="password-requirements" minLength={12} maxLength={200} autoComplete="new-password" required/>
        </div>
      </div>
      <p id="password-requirements" className="text-xs leading-6 text-slate-500">Koristite jedinstvenu lozinku sa najmanje 12 karaktera. Posle promene, sve prethodne sesije biće opozvane.</p>
      {state.message && <p role={state.status === "error" ? "alert" : "status"} className={"rounded-xl p-4 text-sm font-semibold " + (state.status === "success" ? "bg-teal-50 text-teal-800" : "bg-rose-50 text-rose-700")}>{state.message}</p>}
      <button type="submit" disabled={pending || state.status === "success"} className="btn btn-primary disabled:opacity-50">
        {pending ? <LoaderCircle className="animate-spin" size={17}/> : <LockKeyhole size={17}/>}
        {pending ? "Menjanje lozinke…" : "Promeni lozinku"}
      </button>
    </form>
  );
}
