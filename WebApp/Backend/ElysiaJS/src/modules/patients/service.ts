import { prisma } from "../../db/prisma";
import { err } from "../../utils/errors";
import { convertKeysToCamelCase } from "../../utils/case-converter";

export const patientService = {
  async getAll(params?: { search?: string; skip?: number; take?: number }) {
    const where = params?.search
      ? {
          OR: [
            { fullName: { contains: params.search, mode: "insensitive" as const } },
            { email: { contains: params.search, mode: "insensitive" as const } },
            { contactNumber: { contains: params.search } },
          ],
        }
      : undefined;

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 50,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where }),
    ]);

    return { items: convertKeysToCamelCase(patients), total };
  },

  async getById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: { doctor: true },
          orderBy: { appointmentDate: "desc" },
          take: 10,
        },
        medicalRecords: {
          include: { doctor: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!patient) {
      throw err("PATIENT_NOT_FOUND", "Patient not found", 404);
    }

    return convertKeysToCamelCase(patient);
  },

  async create(data: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    contactNumber?: string;
    email?: string;
    address?: string;
    insuranceId?: string;
  }) {
    // Validate dateOfBirth
    if (!data.dateOfBirth || data.dateOfBirth.trim() === '') {
      throw err("VALIDATION_ERROR", "dateOfBirth is required", 400);
    }
    const dateOfBirth = new Date(data.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      throw err("VALIDATION_ERROR", "Invalid dateOfBirth format", 400);
    }

    const patient = await prisma.patient.create({
      data: {
        fullName: data.fullName,
        dateOfBirth,
        gender: data.gender,
        contactNumber: data.contactNumber,
        email: data.email,
        address: data.address,
        insuranceId: data.insuranceId,
      },
    });
    return convertKeysToCamelCase(patient);
  },

  async update(
    id: string,
    data: {
      fullName?: string;
      dateOfBirth?: string;
      gender?: string;
      contactNumber?: string;
      email?: string;
      address?: string;
      insuranceId?: string;
    }
  ) {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw err("PATIENT_NOT_FOUND", "Patient not found", 404);
    }

    const updateData: any = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.insuranceId !== undefined) updateData.insuranceId = data.insuranceId;

    const updated = await prisma.patient.update({
      where: { id },
      data: updateData,
    });
    return convertKeysToCamelCase(updated);
  },

  async delete(id: string) {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw err("PATIENT_NOT_FOUND", "Patient not found", 404);
    }

    await prisma.patient.delete({ where: { id } });
  },
};
