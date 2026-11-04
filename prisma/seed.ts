import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  throw new Error("Postavi BOOTSTRAP_ADMIN_EMAIL i BOOTSTRAP_ADMIN_PASSWORD (najmanje 12 karaktera).");
}
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || "3306"),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 3,
});
const db = new PrismaClient({ adapter });
try {
  await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: process.env.BOOTSTRAP_ADMIN_NAME || "Administrator",
      passwordHash: await hash(password, 12),
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin nalog je spreman:", email);
} finally {
  await db.$disconnect();
}
