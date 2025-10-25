import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Optional: graceful shutdown (when used via node-like signals)
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
