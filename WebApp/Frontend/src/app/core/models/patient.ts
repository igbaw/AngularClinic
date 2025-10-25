export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string; // ISO date (YYYY-MM-DD)
  gender: 'Male' | 'Female' | 'Other';
  contactNumber?: string;
  email?: string;
  address?: string;
  insuranceId?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
