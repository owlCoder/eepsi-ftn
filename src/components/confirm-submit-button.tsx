"use client";

import { useId, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

type Props = {
  message: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">;

/** Keyboard-accessible confirmation for destructive server actions. */
export function ConfirmSubmitButton({ message, children, className = "btn btn-danger", disabled, ...props }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();
  const { pending } = useFormStatus();
  return <>
    <button {...props} type="button" disabled={pending || disabled} className={className}
      onClick={() => dialogRef.current?.showModal()}>{children}</button>
    <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={messageId}
      className="confirm-dialog" onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}>
      <div className="confirm-dialog-panel">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
            <AlertTriangle size={25} aria-hidden="true"/>
          </span>
          <button type="button" aria-label="Zatvori" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            onClick={() => dialogRef.current?.close()}><X size={20}/></button>
        </div>
        <h2 id={titleId} className="!mb-2 text-xl font-extrabold text-slate-900">Potvrdite brisanje</h2>
        <p id={messageId} className="text-sm leading-7 text-slate-600">{message}</p>
        <p className="mt-3 text-xs font-semibold text-rose-700">Ovu radnju nije moguće poništiti.</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-light" onClick={() => dialogRef.current?.close()}>Odustani</button>
          <button type="submit" className="btn btn-danger" disabled={pending} aria-busy={pending}
            onClick={() => dialogRef.current?.close()}>
            {pending ? "Brisanje…" : "Potvrdi brisanje"}
          </button>
        </div>
      </div>
    </dialog>
  </>;
}
