import { prisma } from "../../db/prisma";
import { err } from "../../utils/errors";

export const medicalRecordService = {
  async getAll(params?: { patientId?: string; doctorId?: string; skip?: number; take?: number }) {
    const where: any = {};
    if (params?.patientId) where.patientId = params.patientId;
    if (params?.doctorId) where.doctorId = params.doctorId;

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 50,
        orderBy: { createdAt: "desc" },
        include: {
          patient: true,
          doctor: true,
          attachments: true,
        },
      }),
      prisma.medicalRecord.count({ where }),
    ]);

    return { items: records, total };
  },

  async getById(id: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        attachments: true,
      },
    });

    if (!record) {
      throw err("RECORD_NOT_FOUND", "Medical record not found", 404);
    }

    return record;
  },

  async create(data: {
    patientId: string;
    doctorId: string;
    recordNumber: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
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

    // Check if record number is unique
    const existing = await prisma.medicalRecord.findUnique({
      where: { recordNumber: data.recordNumber },
    });

    if (existing) {
      throw err("DUPLICATE_RECORD_NUMBER", "Record number already exists", 400);
    }

    return await prisma.medicalRecord.create({
      data,
      include: { patient: true, doctor: true, attachments: true },
    });
  },

  async update(
    id: string,
    data: {
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
    }
  ) {
    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) {
      throw err("RECORD_NOT_FOUND", "Medical record not found", 404);
    }

    return await prisma.medicalRecord.update({
      where: { id },
      data,
      include: { patient: true, doctor: true, attachments: true },
    });
  },

  async delete(id: string) {
    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) {
      throw err("RECORD_NOT_FOUND", "Medical record not found", 404);
    }

    await prisma.medicalRecord.delete({ where: { id } });
  },

  async generateRecordNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const prefix = `MR-${year}${month}`;

    // Find the last record with this prefix
    const lastRecord = await prisma.medicalRecord.findFirst({
      where: { recordNumber: { startsWith: prefix } },
      orderBy: { recordNumber: "desc" },
    });

    let sequence = 1;
    if (lastRecord) {
      const lastSequence = parseInt(lastRecord.recordNumber.split("-").pop() || "0");
      sequence = lastSequence + 1;
    }

    return `${prefix}-${String(sequence).padStart(4, "0")}`;
  },
};
