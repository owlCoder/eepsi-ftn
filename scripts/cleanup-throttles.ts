import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_NAME || !process.env.DATABASE_USER) {
  throw new Error("Nedostaje MySQL konfiguracija u environment varijablama.");
}

const db = new PrismaClient({ adapter: new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || "3306"),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 2,
}) });

try {
  const result = await db.loginThrottle.deleteMany({ where: { resetAt: { lt: new Date() } } });
  console.log("Removed expired account throttle entries:", result.count);
} finally {
  await db.$disconnect();
}
