"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function ConfirmSubmitButton({
  message, children, className = "btn btn-danger", ...props
}: { message: string; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">) {
  return <button {...props} type="submit" className={className}
    onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>
    {children}
  </button>;
}
