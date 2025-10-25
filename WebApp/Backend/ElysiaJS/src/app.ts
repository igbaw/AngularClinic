import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { config } from "./config/env";
import { registerRoutes } from "./routes";
import { AppError } from "./utils/errors";

export const createApp = () => {
  const app = new Elysia()
    .use(
      cors({
        origin: config.CORS_ORIGIN as any,
        credentials: true,
      })
    )
    .onError(({ error, set, code }) => {
      // Handle validation errors
      if (code === "VALIDATION") {
        set.status = 422;
        const validationError = error as any;
        const fieldErrors: Record<string, string> = {};

        // Extract field errors from Elysia's validation error
        if (validationError.all) {
          for (const err of validationError.all) {
            const field = err.path?.replace(/^\//, "") || err.property?.replace(/^\//, "");
            if (field) {
              fieldErrors[field] = err.message || err.summary;
            }
          }
        }

        return {
          code: "VALIDATION",
          message: "Validation failed",
          fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
          details: validationError.message,
        };
      }

      // Handle AppError instances
      const isApp = error instanceof AppError;
      const status = isApp ? (error as AppError).status : 500;
      set.status = status;

      // Log error for debugging
      if (!isApp) {
        console.error("Unhandled error:", error);
      }

      const body = {
        code: isApp ? (error as AppError).code : "INTERNAL",
        message: isApp ? error.message : "Internal Server Error",
        details: isApp ? (error as AppError).details : undefined,
        fieldErrors: isApp ? (error as AppError).fieldErrors : undefined,
      };
      return body;
    })
    .get("/api/health", () => ({ status: "ok" }));

  registerRoutes(app);
  return app;
};

if (import.meta.main) {
  const app = createApp();
  app.listen({ port: config.PORT, hostname: "0.0.0.0" });
  console.log(`Elysia listening on :${config.PORT}`);
}
