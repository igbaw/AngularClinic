import { Elysia, t } from "elysia";
import { sessionMiddleware } from "../../auth/middleware";
import { medicalRecordService } from "./service";

export const medicalRecordRoutes = new Elysia({ prefix: "/medical-records" })
  .use(sessionMiddleware)
  .get(
    "/",
    async ({ query }) => {
      return await medicalRecordService.getAll({
        patientId: query.patientId,
        doctorId: query.doctorId,
        skip: query.skip ? parseInt(query.skip) : undefined,
        take: query.take ? parseInt(query.take) : undefined,
      });
    },
    {
      query: t.Object({
        patientId: t.Optional(t.String()),
        doctorId: t.Optional(t.String()),
        skip: t.Optional(t.String()),
        take: t.Optional(t.String()),
      }),
    }
  )
  .get("/generate-record-number", async () => {
    const recordNumber = await medicalRecordService.generateRecordNumber();
    return { recordNumber };
  })
  .get("/:id", async ({ params }) => {
    return await medicalRecordService.getById(params.id);
  })
  .post(
    "/",
    async ({ body }) => {
      return await medicalRecordService.create(body);
    },
    {
      body: t.Object({
        patientId: t.String(),
        doctorId: t.String(),
        recordNumber: t.String(),
        subjective: t.String(),
        objective: t.String(),
        assessment: t.String(),
        plan: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      return await medicalRecordService.update(params.id, body);
    },
    {
      body: t.Object({
        subjective: t.Optional(t.String()),
        objective: t.Optional(t.String()),
        assessment: t.Optional(t.String()),
        plan: t.Optional(t.String()),
      }),
    }
  )
  .delete("/:id", async ({ params }) => {
    await medicalRecordService.delete(params.id);
    return { message: "Medical record deleted successfully" };
  });
