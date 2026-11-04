import "server-only";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db } from "@/infrastructure/db/prisma";

const credentialsSchema = z.object({
  email: z.email().max(191).transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1).max(200),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email i lozinka",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success || !process.env.DATABASE_URL) return null;
        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, passwordHash: true, active: true },
        });
        if (!user || !user.active) return null;
        if (!(await compare(parsed.data.password, user.passwordHash))) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/prijava" },
  secret: process.env.NEXTAUTH_SECRET,
};
