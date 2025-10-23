export interface Doctor {
  id: string;
  full_name: string;
  specialization?: string;
  license_number: string;
  sip: string; // Surat Izin Praktik
  contact_number?: string;
  email?: string;
  availability?: any; // JSON weekly schedule (kept flexible for MVP)
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}