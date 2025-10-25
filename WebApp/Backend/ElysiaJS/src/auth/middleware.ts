import { Elysia } from "elysia";
import { authService } from "./service";
import { err } from "../utils/errors";
import { config } from "../config/env";

export const sessionMiddleware = new Elysia().derive(async ({ cookie }) => {
  const sessionId = cookie[config.COOKIE_NAME]?.value || cookie[config.COOKIE_NAME];

  if (!sessionId) {
    throw err("UNAUTHORIZED", "Authentication required", 401);
  }

  try {
    const user = await authService.getUserById(sessionId as string);
    return { user };
  } catch (error) {
    throw err("UNAUTHORIZED", "Invalid or expired session", 401);
  }
});

export const roleMiddleware = (allowedRoles: string[]) => {
  return new Elysia().derive(({ user }: any) => {
    if (!user || !allowedRoles.includes(user.role)) {
      throw err("FORBIDDEN", "Insufficient permissions", 403);
    }
    return {};
  });
};
