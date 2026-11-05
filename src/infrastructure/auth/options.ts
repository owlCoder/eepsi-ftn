import "server-only";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { compare, hashSync } from "bcryptjs";
import { z } from "zod";
import { db } from "@/infrastructure/db/prisma";
import { clearLoginFailures, isLoginThrottled, recordLoginFailure } from "@/infrastructure/auth/login-throttle";

// Precomputed once to avoid distinguishing unknown accounts by a cheap code path.
const DUMMY_HASH = hashSync("eepsi-invalid-account", 12);

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(191)),
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
        if (!parsed.success || !process.env.DATABASE_URL || !process.env.NEXTAUTH_SECRET) return null;
        const secret = process.env.NEXTAUTH_SECRET;
        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, passwordHash: true, active: true, sessionVersion: true },
        });
        // Only existing, active accounts generate DB throttle entries.
        // Unknown email spam must not create an unbounded number of database rows.
        if (user?.active && await isLoginThrottled(parsed.data.email, secret)) return null;
        const passwordValid = await compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
        if (!user?.active || !passwordValid) {
          if (user?.active) await recordLoginFailure(parsed.data.email, secret);
          return null;
        }
        await clearLoginFailures(parsed.data.email, secret);
        return { id: user.id, name: user.name, email: user.email, sessionVersion: user.sessionVersion };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      // Store only a revocation counter, NEVER a role or permission list.
      if (user) token.sessionVersion = (user as typeof user & { sessionVersion: number }).sessionVersion;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { sessionVersion: number }).sessionVersion =
          typeof token.sessionVersion === "number" ? token.sessionVersion : -1;
      }
      return session;
    },
  },
  pages: { signIn: "/prijava" },
  secret: process.env.NEXTAUTH_SECRET,
};
