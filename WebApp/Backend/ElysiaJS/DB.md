# Database & Prisma Schema (Draft)

- Dev: SQLite (file:./dev.db)
- Prod: PostgreSQL
- IDs: UUID (cuid2/uuid); timestamps with default now()
- Doctor.availability: JSON

Prisma models (illustrative)
```prisma path=null start=null
// enums
enum Role { ADMIN DOCTOR RECEPTIONIST }

datasource db {
  provider = env("PRISMA_PROVIDER") // "sqlite" or "postgresql"
  url      = env("DATABASE_URL")
}

generator client { provider = "prisma-client-js" }

model User {
  id                 String   @id @default(uuid()) @db.Uuid
  email              String   @unique
  passwordHash       String
  fullName           String
  role               Role
  active             Boolean  @default(true)
  mustChangePassword Boolean  @default(false)
  lastLoginAt        DateTime?
  doctor             Doctor?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Patient {
  id            String   @id @default(uuid()) @db.Uuid
  fullName      String
  dateOfBirth   DateTime
  gender        String
  contactNumber String?
  email         String?
  address       String?
  insuranceId   String?
  medicalRecords MedicalRecord[]
  appointments   Appointment[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Doctor {
  id            String   @id @default(uuid()) @db.Uuid
  fullName      String
  specialization String?
  licenseNumber String
  sip           String
  contactNumber String?
  email         String?
  availability  Json?
  userId        String?  @unique @db.Uuid
  user          User?    @relation(fields: [userId], references: [id])
  appointments  Appointment[]
  medicalRecords MedicalRecord[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Appointment {
  id              String   @id @default(uuid()) @db.Uuid
  patientId       String   @db.Uuid
  doctorId        String   @db.Uuid
  appointmentDate DateTime
  status          String   // Pending, Confirmed, Cancelled
  notes           String?
  patient         Patient  @relation(fields: [patientId], references: [id])
  doctor          Doctor   @relation(fields: [doctorId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([doctorId, appointmentDate])
}

model MedicalRecord {
  id          String   @id @default(uuid()) @db.Uuid
  patientId   String   @db.Uuid
  doctorId    String   @db.Uuid
  recordNumber String
  subjective  String
  objective   String
  assessment  String
  plan        String
  attachments FileAsset[]
  patient     Patient  @relation(fields: [patientId], references: [id])
  doctor      Doctor   @relation(fields: [doctorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([recordNumber])
}

model FileAsset {
  id         String   @id @default(uuid()) @db.Uuid
  url        String
  fileName   String
  mimeType   String
  size       Int
  recordId   String?  @db.Uuid
  record     MedicalRecord? @relation(fields: [recordId], references: [id])
  createdAt  DateTime @default(now())
}

model InventoryItem {
  id           String   @id @default(uuid()) @db.Uuid
  name         String
  sku          String?
  batch        String?
  expiryDate   DateTime?
  quantity     Int
  buyPrice     Decimal? @db.Decimal(19,4)
  sellPrice    Decimal? @db.Decimal(19,4)
  movements    InventoryMovement[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model InventoryMovement {
  id           String   @id @default(uuid()) @db.Uuid
  itemId       String   @db.Uuid
  change       Int      // positive in, negative out
  reason       String?
  createdAt    DateTime @default(now())
  item         InventoryItem @relation(fields: [itemId], references: [id])
}

model Prescription {
  id            String   @id @default(uuid()) @db.Uuid
  patientId     String   @db.Uuid
  doctorId      String   @db.Uuid
  appointmentId String?  @db.Uuid
  items         PrescriptionItem[]
  patient       Patient  @relation(fields: [patientId], references: [id])
  doctor        Doctor   @relation(fields: [doctorId], references: [id])
  appointment   Appointment? @relation(fields: [appointmentId], references: [id])
  createdAt     DateTime @default(now())
}

model PrescriptionItem {
  id             String   @id @default(uuid()) @db.Uuid
  prescriptionId String   @db.Uuid
  inventoryItemId String? @db.Uuid
  name           String    // snapshot of item name
  dosage         String?
  frequency      String?
  duration       String?
  quantity       Int
  prescription   Prescription @relation(fields: [prescriptionId], references: [id])
  inventoryItem  InventoryItem? @relation(fields: [inventoryItemId], references: [id])
}
```

Notes
- Keep JSON-compatible types for SQLite and Postgres.
- Decimal fields are for prices; when on SQLite, Prisma emulates decimal; verify during migration.
- Doctor.userId links a user account for doctors (optional). Admin/Receptionist can be User without profile.
- Indices: appointments indexed by (doctorId, appointmentDate); recordNumber unique.
