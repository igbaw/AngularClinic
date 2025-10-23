export type UserRole = 'Admin' | 'Doctor';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}