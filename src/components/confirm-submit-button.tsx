"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function ConfirmSubmitButton({
  message, children, className = "btn btn-danger", ...props
}: { message: string; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">) {
  const { pending } = useFormStatus();
  return <button {...props} type="submit" className={className} disabled={pending || props.disabled} aria-busy={pending}
    onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>
    {pending ? "Brisanje…" : children}
  </button>;
}
