import { db } from "@/infrastructure/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  if (!process.env.DATABASE_URL) {
    return Response.json({ status: "unavailable" }, { status: 503, headers });
  }
  try {
    await db.$queryRaw`SELECT 1 AS ok`;
    return Response.json({ status: "ok" }, { status: 200, headers });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers });
  }
}
