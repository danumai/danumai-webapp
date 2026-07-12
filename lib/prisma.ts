import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 connects through a driver adapter rather than reading DATABASE_URL
// itself. We hand the pg adapter the same connection settings the old raw pool
// used — including the permissive SSL that managed Postgres providers expect
// (self-signed certs), toggled off with PGSSL=false for local Postgres.
declare global {
  var __prisma: PrismaClient | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaPg({
    connectionString,
    ssl: process.env.PGSSL === "false" ? undefined : { rejectUnauthorized: false },
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = global.__prisma ?? createClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
