import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  // Middleware: auto-retry on connection errors (Neon cold start)
  client.$use(async (params, next) => {
    const MAX_RETRIES = 3;
    let retries = 0;
    while (true) {
      try {
        return await next(params);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const isConnectionError =
          message.includes("Can't reach database server") ||
          message.includes("Connection timed out") ||
          message.includes("connect ETIMEDOUT") ||
          message.includes("Connection refused");

        if (isConnectionError && retries < MAX_RETRIES) {
          retries++;
          console.warn(`[Prisma] DB connection retry ${retries}/${MAX_RETRIES}...`);
          await new Promise((r) => setTimeout(r, 1000 * retries));
          continue;
        }
        throw error;
      }
    }
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
