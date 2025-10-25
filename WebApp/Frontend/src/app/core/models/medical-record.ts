import { Attachment } from './common';

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  recordNumber: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  attachments?: Attachment[];
  signedBy?: string; // doctor name or id reference (MVP: name)
  signedAt?: string; // ISO datetime
  createdAt: string;
  updatedAt: string;
}
