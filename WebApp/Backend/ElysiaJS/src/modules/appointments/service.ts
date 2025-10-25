import { prisma } from "../../db/prisma";
import { err } from "../../utils/errors";
import { convertKeysToCamelCase } from "../../utils/case-converter";

export const appointmentService = {
  async getAll(params?: {
    patientId?: string;
    doctorId?: string;
    status?: string;
    from?: Date;
    to?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (params?.patientId) where.patientId = params.patientId;
    if (params?.doctorId) where.doctorId = params.doctorId;
    if (params?.status) where.status = params.status;
    if (params?.from || params?.to) {
      where.appointmentDate = {};
      if (params.from) where.appointmentDate.gte = params.from;
      if (params.to) where.appointmentDate.lte = params.to;
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 50,
        orderBy: { appointmentDate: "desc" },
        include: { patient: true, doctor: true },
      }),
      prisma.appointment.count({ where }),
    ]);

    return { items: convertKeysToCamelCase(appointments), total };
  },

  async getById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true, prescription: true },
    });

    if (!appointment) {
      throw err("APPOINTMENT_NOT_FOUND", "Appointment not found", 404);
    }

    return convertKeysToCamelCase(appointment);
  },

  async create(data: {
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    status: string;
    notes?: string;
  }) {
    // Validate patient and doctor exist
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { id: data.patientId } }),
      prisma.doctor.findUnique({ where: { id: data.doctorId } }),
    ]);

    if (!patient) {
      throw err("PATIENT_NOT_FOUND", "Patient not found", 404);
    }
    if (!doctor) {
      throw err("DOCTOR_NOT_FOUND", "Doctor not found", 404);
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentDate: new Date(data.appointmentDate),
        status: data.status,
        notes: data.notes,
      },
      include: { patient: true, doctor: true },
    });
    return convertKeysToCamelCase(appointment);
  },

  async update(
    id: string,
    data: {
      patientId?: string;
      doctorId?: string;
      appointmentDate?: string;
      status?: string;
      notes?: string;
    }
  ) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw err("APPOINTMENT_NOT_FOUND", "Appointment not found", 404);
    }

    const updateData: any = {};
    if (data.patientId !== undefined) updateData.patientId = data.patientId;
    if (data.doctorId !== undefined) updateData.doctorId = data.doctorId;
    if (data.appointmentDate !== undefined) updateData.appointmentDate = new Date(data.appointmentDate);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: { patient: true, doctor: true },
    });
    return convertKeysToCamelCase(updated);
  },

  async delete(id: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw err("APPOINTMENT_NOT_FOUND", "Appointment not found", 404);
    }

    await prisma.appointment.delete({ where: { id } });
  },
};
