"use client";

import type { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { pendingText?: string };

/** Visible feedback and duplicate-submit prevention for native server-action forms. */
export function SubmitButton({ children, className = "btn btn-primary", pendingText = "Čuvanje…", disabled, ...props }: Props) {
  const { pending } = useFormStatus();
  return <button {...props} type="submit" className={className} disabled={pending || disabled} aria-busy={pending}>
    {pending ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true"/> {pendingText}</> : children}
  </button>;
}
