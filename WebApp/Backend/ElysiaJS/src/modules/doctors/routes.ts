import { Elysia, t } from "elysia";
import { sessionMiddleware } from "../../auth/middleware";
import { doctorService } from "./service";

export const doctorRoutes = new Elysia({ prefix: "/doctors" })
  .use(sessionMiddleware)
  .get(
    "/",
    async ({ query }) => {
      return await doctorService.getAll({
        search: query.search,
        skip: query.skip ? parseInt(query.skip) : undefined,
        take: query.take ? parseInt(query.take) : undefined,
      });
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),
        skip: t.Optional(t.String()),
        take: t.Optional(t.String()),
      }),
    }
  )
  .get("/:id", async ({ params }) => {
    return await doctorService.getById(params.id);
  })
  .post(
    "/",
    async ({ body }) => {
      return await doctorService.create(body);
    },
    {
      body: t.Object({
        fullName: t.String(),
        specialization: t.Optional(t.String()),
        licenseNumber: t.String(),
        sip: t.String(),
        contactNumber: t.Optional(t.String()),
        email: t.Optional(t.String({ format: "email" })),
        availability: t.Optional(t.String()),
        userId: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      return await doctorService.update(params.id, body);
    }
  )
  .delete("/:id", async ({ params }) => {
    await doctorService.delete(params.id);
    return { message: "Doctor deleted successfully" };
  });
