import { Elysia, t } from "elysia";
import { authService } from "./service";
import { sessionMiddleware } from "./middleware";
import { config } from "../config/env";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/login",
    async ({ body, cookie, set }) => {
      const user = await authService.login(body.email, body.password);

      // Create session cookie
      cookie[config.COOKIE_NAME] = {
        value: user.id,
        httpOnly: true,
        secure: config.COOKIE_SECURE,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      };

      return { user };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String({ minLength: 1 }),
      }),
    }
  )
  .post("/logout", ({ cookie, set }) => {
    delete cookie[config.COOKIE_NAME];
    return { message: "Logged out successfully" };
  })
  .use(sessionMiddleware)
  .get("/me", ({ user }) => {
    return { user };
  })
  .post(
    "/change-password",
    async ({ user, body }) => {
      await authService.changePassword(user.id, body.oldPassword, body.newPassword);
      return { message: "Password changed successfully" };
    },
    {
      body: t.Object({
        oldPassword: t.String(),
        newPassword: t.String({ minLength: 6 }),
      }),
    }
  );
