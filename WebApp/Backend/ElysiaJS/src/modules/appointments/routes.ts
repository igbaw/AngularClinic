import { Elysia, t } from "elysia";
import { sessionMiddleware } from "../../auth/middleware";
import { appointmentService } from "./service";

export const appointmentRoutes = new Elysia({ prefix: "/appointments" })
  .use(sessionMiddleware)
  .get(
    "/",
    async ({ query }) => {
      return await appointmentService.getAll({
        patientId: query.patientId,
        doctorId: query.doctorId,
        status: query.status,
        from: query.from ? new Date(query.from) : undefined,
        to: query.to ? new Date(query.to) : undefined,
        skip: query.skip ? parseInt(query.skip) : undefined,
        take: query.take ? parseInt(query.take) : undefined,
      });
    },
    {
      query: t.Object({
        patientId: t.Optional(t.String()),
        doctorId: t.Optional(t.String()),
        status: t.Optional(t.String()),
        from: t.Optional(t.String()),
        to: t.Optional(t.String()),
        skip: t.Optional(t.String()),
        take: t.Optional(t.String()),
      }),
    }
  )
  .get("/:id", async ({ params }) => {
    return await appointmentService.getById(params.id);
  })
  .post(
    "/",
    async ({ body }) => {
      return await appointmentService.create(body);
    },
    {
      body: t.Object({
        patientId: t.String(),
        doctorId: t.String(),
        appointmentDate: t.String(),
        status: t.Union([
          t.Literal("Pending"),
          t.Literal("Confirmed"),
          t.Literal("Cancelled"),
          t.Literal("Completed"),
        ]),
        notes: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      return await appointmentService.update(params.id, body);
    }
  )
  .delete("/:id", async ({ params }) => {
    await appointmentService.delete(params.id);
    return { message: "Appointment deleted successfully" };
  });
