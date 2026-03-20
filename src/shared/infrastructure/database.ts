import { PrismaClient } from "../../../generated/prisma/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaRepository } from "./prisma.repository.js";

export function initializeDatabase(): void {
  const adapter = new PrismaBetterSqlite3({
    url: "file:./dev.db",
  });

  const prisma = new PrismaClient({ adapter });

  PrismaRepository.setPrismaClient(prisma);
}
