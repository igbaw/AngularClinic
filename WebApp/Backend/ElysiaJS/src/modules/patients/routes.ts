import { Elysia, t } from "elysia";
import { sessionMiddleware } from "../../auth/middleware";
import { patientService } from "./service";

export const patientRoutes = new Elysia({ prefix: "/patients" })
  .use(sessionMiddleware)
  .get(
    "/",
    async ({ query }) => {
      return await patientService.getAll({
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
    return await patientService.getById(params.id);
  })
  .post(
    "/",
    async ({ body }) => {
      return await patientService.create(body);
    },
    {
      body: t.Object({
        fullName: t.String(),
        dateOfBirth: t.String(),
        gender: t.Union([t.Literal("Male"), t.Literal("Female"), t.Literal("Other")]),
        contactNumber: t.Optional(t.String()),
        email: t.Optional(t.String({ format: "email" })),
        address: t.Optional(t.String()),
        insuranceId: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      return await patientService.update(params.id, body);
    }
  )
  .delete("/:id", async ({ params }) => {
    await patientService.delete(params.id);
    return { message: "Patient deleted successfully" };
  });
