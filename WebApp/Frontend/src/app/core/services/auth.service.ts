import { Injectable, computed, signal } from '@angular/core';
import { ApiService } from './api.service';
import { AuthUser, LoginRequest, LoginResponse, UserRole } from '../models/auth';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'authUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly _user = signal<AuthUser | null>(this.readUser());

  readonly isAuthenticated = computed(() => !!this._token());
  readonly user = computed(() => this._user());
  readonly role = computed<UserRole | null>(() => this._user()?.role ?? null);

  constructor(private api: ApiService) {}

  login(req: LoginRequest) {
    return this.api.post<LoginResponse>('/auth/login', req);
  }

  setSession(resp: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, resp.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(resp.user));
    this._token.set(resp.accessToken);
    this._user.set(resp.user);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  private readUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; } catch { return null; }
  }
}