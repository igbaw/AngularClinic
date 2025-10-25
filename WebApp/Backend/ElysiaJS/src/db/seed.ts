import { prisma } from "./prisma";
import argon2 from "argon2";

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminFullName = process.env.ADMIN_FULL_NAME ?? "Admin User";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminHash = await argon2.hash(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { fullName: adminFullName, role: "ADMIN", active: true, mustChangePassword: true },
    create: {
      email: adminEmail,
      fullName: adminFullName,
      role: "ADMIN",
      passwordHash: adminHash,
      active: true,
      mustChangePassword: true,
    },
  });
  console.log(`✓ Admin user: ${adminEmail}`);

  // Create doctor users
  const doctorHash = await argon2.hash("Doctor123!");
  const drSarah = await prisma.user.upsert({
    where: { email: "dr.sarah@clinic.com" },
    update: {},
    create: {
      email: "dr.sarah@clinic.com",
      fullName: "Dr. Sarah Johnson",
      role: "DOCTOR",
      passwordHash: doctorHash,
      active: true,
    },
  });

  const drMichael = await prisma.user.upsert({
    where: { email: "dr.michael@clinic.com" },
    update: {},
    create: {
      email: "dr.michael@clinic.com",
      fullName: "Dr. Michael Chen",
      role: "DOCTOR",
      passwordHash: doctorHash,
      active: true,
    },
  });
  console.log("✓ Doctor users created");

  // Create doctors
  const doctor1 = await prisma.doctor.upsert({
    where: { id: "doctor-1" },
    update: {},
    create: {
      id: "doctor-1",
      fullName: "Dr. Sarah Johnson",
      specialization: "ENT Specialist",
      licenseNumber: "LIC-2020-001",
      sip: "SIP-2020-001",
      contactNumber: "+62 812-3456-7890",
      email: "dr.sarah@clinic.com",
      userId: drSarah.id,
      availability: JSON.stringify({
        monday: { start: "08:00", end: "16:00" },
        tuesday: { start: "08:00", end: "16:00" },
        wednesday: { start: "08:00", end: "16:00" },
        thursday: { start: "08:00", end: "16:00" },
        friday: { start: "08:00", end: "12:00" },
      }),
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { id: "doctor-2" },
    update: {},
    create: {
      id: "doctor-2",
      fullName: "Dr. Michael Chen",
      specialization: "Pediatric ENT",
      licenseNumber: "LIC-2019-045",
      sip: "SIP-2019-045",
      contactNumber: "+62 813-9876-5432",
      email: "dr.michael@clinic.com",
      userId: drMichael.id,
      availability: JSON.stringify({
        monday: { start: "13:00", end: "20:00" },
        wednesday: { start: "13:00", end: "20:00" },
        friday: { start: "13:00", end: "20:00" },
        saturday: { start: "08:00", end: "14:00" },
      }),
    },
  });
  console.log("✓ Doctors created");

  // Create patients
  const patient1 = await prisma.patient.upsert({
    where: { id: "patient-1" },
    update: {},
    create: {
      id: "patient-1",
      fullName: "John Smith",
      dateOfBirth: new Date("1985-05-15"),
      gender: "Male",
      contactNumber: "+62 821-1111-2222",
      email: "john.smith@email.com",
      address: "Jl. Merdeka No. 123, Jakarta",
      insuranceId: "BPJS-123456789",
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { id: "patient-2" },
    update: {},
    create: {
      id: "patient-2",
      fullName: "Maria Rodriguez",
      dateOfBirth: new Date("1990-08-22"),
      gender: "Female",
      contactNumber: "+62 822-3333-4444",
      email: "maria.rodriguez@email.com",
      address: "Jl. Sudirman No. 456, Jakarta",
      insuranceId: "BPJS-987654321",
    },
  });

  const patient3 = await prisma.patient.upsert({
    where: { id: "patient-3" },
    update: {},
    create: {
      id: "patient-3",
      fullName: "Ahmad Rahman",
      dateOfBirth: new Date("2015-03-10"),
      gender: "Male",
      contactNumber: "+62 823-5555-6666",
      address: "Jl. Gatot Subroto No. 789, Jakarta",
      insuranceId: "BPJS-555666777",
    },
  });
  console.log("✓ Patients created");

  // Create appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.appointment.upsert({
    where: { id: "appt-1" },
    update: {},
    create: {
      id: "appt-1",
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentDate: tomorrow,
      status: "Confirmed",
      notes: "Follow-up for ear infection",
    },
  });

  await prisma.appointment.upsert({
    where: { id: "appt-2" },
    update: {},
    create: {
      id: "appt-2",
      patientId: patient2.id,
      doctorId: doctor1.id,
      appointmentDate: nextWeek,
      status: "Pending",
      notes: "First consultation for throat issue",
    },
  });

  await prisma.appointment.upsert({
    where: { id: "appt-3" },
    update: {},
    create: {
      id: "appt-3",
      patientId: patient3.id,
      doctorId: doctor2.id,
      appointmentDate: tomorrow,
      status: "Confirmed",
      notes: "Pediatric checkup",
    },
  });
  console.log("✓ Appointments created");

  // Create medical records
  await prisma.medicalRecord.upsert({
    where: { recordNumber: "MR-202501-0001" },
    update: {},
    create: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      recordNumber: "MR-202501-0001",
      subjective: "Patient complains of ear pain and reduced hearing in the left ear for 3 days",
      objective: "Temperature: 37.5°C, Left ear: inflamed tympanic membrane with fluid buildup",
      assessment: "Acute otitis media, left ear",
      plan: "Prescribed antibiotics (Amoxicillin 500mg 3x/day for 7 days), ear drops, follow-up in 1 week",
    },
  });

  await prisma.medicalRecord.upsert({
    where: { recordNumber: "MR-202501-0002" },
    update: {},
    create: {
      patientId: patient2.id,
      doctorId: doctor1.id,
      recordNumber: "MR-202501-0002",
      subjective: "Sore throat and difficulty swallowing for 5 days, mild fever",
      objective: "Temperature: 38.1°C, Throat: inflamed tonsils with white patches",
      assessment: "Acute tonsillitis, possibly bacterial",
      plan: "Prescribed antibiotics, pain relief medication, rest and hydration, follow-up if symptoms worsen",
    },
  });
  console.log("✓ Medical records created");

  console.log("\n✅ Database seeded successfully!");
  console.log("\nLogin credentials:");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`Doctor: dr.sarah@clinic.com / Doctor123!`);
  console.log(`Doctor: dr.michael@clinic.com / Doctor123!`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  });
