import { Injectable, computed, signal } from '@angular/core';
import { ApiService } from './api.service';
import { AuthUser, LoginRequest, LoginResponse, UserRole } from '../models/auth';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<AuthUser | null>(null);

  readonly isAuthenticated = computed(() => !!this._user());
  readonly user = computed(() => this._user());
  readonly role = computed<UserRole | null>(() => this._user()?.role ?? null);

  constructor(private api: ApiService) {}

  /**
   * Bootstrap session by checking /auth/me
   * Call this on app init
   */
  initSession() {
    return this.api.get<LoginResponse>('/auth/me').pipe(
      tap(resp => this._user.set(resp.user))
    );
  }

  login(req: LoginRequest) {
    return this.api.post<LoginResponse>('/auth/login', req).pipe(
      tap(resp => this._user.set(resp.user))
    );
  }

  logout() {
    return this.api.post<{ message: string }>('/auth/logout', {}).pipe(
      tap(() => this._user.set(null))
    );
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.api.post<{ message: string }>('/auth/change-password', {
      oldPassword,
      newPassword
    });
  }
}
