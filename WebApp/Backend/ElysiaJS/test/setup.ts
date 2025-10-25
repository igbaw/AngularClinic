process.env.PRISMA_PROVIDER = process.env.PRISMA_PROVIDER ?? "sqlite";
const pidSuffix = typeof process !== "undefined" ? process.pid : Math.floor(Math.random()*1e6);
process.env.DATABASE_URL = process.env.DATABASE_URL ?? `file:./tmp/test-${pidSuffix}.db`;
process.env.PORT = process.env.PORT ?? "0"; // avoid binding a fixed port if server starts
