export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string; // ISO datetime
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}