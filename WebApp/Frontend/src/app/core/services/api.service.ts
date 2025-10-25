import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl.replace(/\/$/, '');

  get<T>(url: string, params?: Record<string, any>) {
    const httpParams = new HttpParams({ fromObject: params ?? {} });
    return this.http.get<T>(`${this.base}${url}`, { params: httpParams, withCredentials: true });
  }

  post<T>(url: string, body: unknown) {
    return this.http.post<T>(`${this.base}${url}`, body, { withCredentials: true });
  }

  put<T>(url: string, body: unknown) {
    return this.http.put<T>(`${this.base}${url}`, body, { withCredentials: true });
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${this.base}${url}`, { withCredentials: true });
  }
}