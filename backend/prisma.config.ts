import "dotenv/config";
import { defineConfig, type PrismaConfig } from "prisma/config";

const config: PrismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node ./prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
};

export default defineConfig(config);
