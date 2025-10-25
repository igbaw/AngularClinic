import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth interceptor for cookie-based authentication.
 * Cookies are automatically sent with withCredentials: true in ApiService.
 * No need to add Authorization header.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
