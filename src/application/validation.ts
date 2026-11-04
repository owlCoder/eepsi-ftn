import { z } from "zod";
import { materialKinds } from "../domain/content/material-kinds";

export const newsInput = z.object({
  title: z.string().trim().min(5).max(180),
  summary: z.string().trim().min(10).max(300),
  body: z.string().trim().min(20).max(30000),
});

export const courseInput = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{2,30}$/),
  title: z.string().trim().min(5).max(180),
  description: z.string().trim().min(15).max(5000),
  semester: z.coerce.number().int().min(1).max(8),
  studyLevel: z.enum(["OAS", "MAS", "DAS"]),
});

const secureMaterialUrl = z.url().max(1500).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}, "Dozvoljeni su samo HTTPS linkovi bez korisničkih podataka.");

export const materialInput = z.object({
  courseId: z.string().min(5).max(40),
  title: z.string().trim().min(3).max(180),
  url: secureMaterialUrl,
  kind: z.enum(materialKinds).default("OTHER"),
});

export const materialEditInput = materialInput.omit({ courseId: true }).extend({
  materialId: z.string().min(5).max(40),
});

export const userInput = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.email().max(191).transform((email) => email.trim().toLowerCase()),
  password: z.string().min(12).max(200),
  role: z.enum(["EDITOR", "PROFESSOR", "ASSISTANT", "STUDENT"]),
});

export const membershipInput = z.object({
  courseId: z.string().min(5).max(40),
  email: z.email().transform((email) => email.trim().toLowerCase()),
  role: z.enum(["PROFESSOR", "ASSISTANT"]),
});

export const accessInput = z.object({
  id: z.string().min(5).max(40),
  role: z.enum(["EDITOR", "PROFESSOR", "ASSISTANT", "STUDENT"]),
  active: z.enum(["true", "false"]),
});

export const profileInput = z.object({
  name: z.string().trim().min(3).max(120),
});

export const passwordChangeInput = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(200),
  confirmPassword: z.string().min(12).max(200),
}).refine((value) => value.newPassword === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Nove lozinke se ne poklapaju.",
}).refine((value) => value.newPassword !== value.currentPassword, {
  path: ["newPassword"],
  message: "Nova lozinka mora biti različita od prethodne.",
});
