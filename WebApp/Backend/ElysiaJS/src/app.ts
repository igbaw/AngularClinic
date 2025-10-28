import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { config } from "./config/env";
import { registerRoutes } from "./routes";
import { AppError } from "./utils/errors";

export const createApp = () => {
  console.log("Creating Elysia app...");
  
  const app = new Elysia()
    .use(
      cors({
        origin: config.CORS_ORIGIN as any,
        credentials: true,
      })
    )
    .onError(({ error, set, code }) => {
      console.error("Error handler triggered:", { code, error: error.message });
      
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
    .get("/api/health", () => {
      console.log("Health check called");
      return { status: "ok" };
    });

  console.log("Registering routes...");
  try {
    registerRoutes(app);
    console.log("Routes registered successfully");
  } catch (error) {
    console.error("Error registering routes:", error);
    throw error;
  }
  
  // Add catch-all route for debugging
  app.all("*", ({ request, set }) => {
    console.log(`Unmatched request: ${request.method} ${new URL(request.url).pathname}`);
    set.status = 404;
    return { error: "Not Found", method: request.method, path: new URL(request.url).pathname };
  });
  
  return app;
};

if (import.meta.main) {
  try {
    console.log("Starting application...");
    const app = createApp();
    console.log("App created, starting server...");
    
    // Add a small delay to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    app.listen({ port: config.PORT, hostname: "0.0.0.0" });
    console.log(`Elysia listening on :${config.PORT}`);
    console.log("Server is ready to accept connections");
  } catch (error) {
    console.error("Failed to start application:", error);
    console.error(error.stack);
    process.exit(1);
  }
}
