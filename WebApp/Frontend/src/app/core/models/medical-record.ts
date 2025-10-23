import { Attachment } from './common';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  record_number: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  attachments?: Attachment[];
  signed_by?: string; // doctor name or id reference (MVP: name)
  signed_at?: string; // ISO datetime
  created_at: string;
  updated_at: string;
}