export interface Doctor {
  id: string;
  fullName: string;
  specialization?: string;
  licenseNumber: string;
  sip: string; // Surat Izin Praktik
  contactNumber?: string;
  email?: string;
  availability?: any; // JSON weekly schedule (kept flexible for MVP)
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
