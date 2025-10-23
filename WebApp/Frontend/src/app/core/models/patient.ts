export interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string; // ISO date
  gender: 'Male' | 'Female' | 'Other';
  contact_number?: string;
  email?: string;
  address?: string;
  insurance_id?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}