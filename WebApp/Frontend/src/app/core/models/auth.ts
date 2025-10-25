export type UserRole = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}
