import { Elysia } from "elysia";
import { authRoutes } from "./auth/routes";
import { patientRoutes } from "./modules/patients/routes";
import { doctorRoutes } from "./modules/doctors/routes";
import { appointmentRoutes } from "./modules/appointments/routes";
import { medicalRecordRoutes } from "./modules/medical-records/routes";

export const registerRoutes = (app: Elysia) => {
  return app.group("/api", (app) =>
    app
      .use(authRoutes)
      .use(patientRoutes)
      .use(doctorRoutes)
      .use(appointmentRoutes)
      .use(medicalRecordRoutes)
  );
};
