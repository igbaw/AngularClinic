export const config = {
  PORT: Number(process.env.PORT ?? 8080),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? ["http://localhost:4200", "http://localhost:9876"],
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  PRISMA_PROVIDER: process.env.PRISMA_PROVIDER ?? "sqlite",
  AUTH_SECRET: process.env.AUTH_SECRET ?? "change_me",
  COOKIE_NAME: process.env.COOKIE_NAME ?? "clinic_sess",
  COOKIE_SECURE: (process.env.COOKIE_SECURE ?? "false").toLowerCase() === "true",
  UPLOAD_MAX_MB: Number(process.env.UPLOAD_MAX_MB ?? 5),
};

export const limits = {
  uploadMaxBytes: (config.UPLOAD_MAX_MB || 5) * 1024 * 1024,
  allowedMimeTypes: ["image/", "application/pdf", "text/plain"],
};
