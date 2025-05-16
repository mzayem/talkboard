import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // Optional: logs all queries in dev mode
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
