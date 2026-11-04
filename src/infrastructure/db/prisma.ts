import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalDb = globalThis as unknown as { epsiDb?: PrismaClient };

function createClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
  });
  return new PrismaClient({ adapter });
}

export const db = globalDb.epsiDb ?? createClient();
if (process.env.NODE_ENV !== "production") globalDb.epsiDb = db;
