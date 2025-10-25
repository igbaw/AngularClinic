export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string; // ISO datetime
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
