import { prisma } from "../../db/prisma";
import { err } from "../../utils/errors";
import { convertKeysToCamelCase } from "../../utils/case-converter";

export const doctorService = {
  async getAll(params?: { search?: string; skip?: number; take?: number }) {
    const where = params?.search
      ? {
          OR: [
            { fullName: { contains: params.search, mode: "insensitive" as const } },
            { specialization: { contains: params.search, mode: "insensitive" as const } },
            { email: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 50,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, fullName: true, role: true } } },
      }),
      prisma.doctor.count({ where }),
    ]);

    return { items: convertKeysToCamelCase(doctors), total };
  },

  async getById(id: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, fullName: true, role: true } },
        appointments: {
          include: { patient: true },
          orderBy: { appointmentDate: "desc" },
          take: 10,
        },
      },
    });

    if (!doctor) {
      throw err("DOCTOR_NOT_FOUND", "Doctor not found", 404);
    }

    return convertKeysToCamelCase(doctor);
  },

  async create(data: {
    fullName: string;
    specialization?: string;
    licenseNumber: string;
    sip: string;
    contactNumber?: string;
    email?: string;
    availability?: string;
    userId?: string;
  }) {
    const doctor = await prisma.doctor.create({
      data: {
        fullName: data.fullName,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        sip: data.sip,
        contactNumber: data.contactNumber,
        email: data.email,
        availability: data.availability,
        userId: data.userId,
      },
    });
    return convertKeysToCamelCase(doctor);
  },

  async update(
    id: string,
    data: {
      fullName?: string;
      specialization?: string;
      licenseNumber?: string;
      sip?: string;
      contactNumber?: string;
      email?: string;
      availability?: string;
      userId?: string;
    }
  ) {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw err("DOCTOR_NOT_FOUND", "Doctor not found", 404);
    }

    const updateData: any = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.specialization !== undefined) updateData.specialization = data.specialization;
    if (data.licenseNumber !== undefined) updateData.licenseNumber = data.licenseNumber;
    if (data.sip !== undefined) updateData.sip = data.sip;
    if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.availability !== undefined) updateData.availability = data.availability;
    if (data.userId !== undefined) updateData.userId = data.userId;

    const updated = await prisma.doctor.update({ where: { id }, data: updateData });
    return convertKeysToCamelCase(updated);
  },

  async delete(id: string) {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw err("DOCTOR_NOT_FOUND", "Doctor not found", 404);
    }

    await prisma.doctor.delete({ where: { id } });
  },
};
