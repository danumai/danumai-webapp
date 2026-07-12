// Prisma 7 moves the datasource connection URL out of schema.prisma and into
// this config file, where it's read for CLI commands like `prisma db push`,
// `prisma migrate`, and `prisma studio`. The runtime connection is configured
// separately via the driver adapter in lib/prisma.ts.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
