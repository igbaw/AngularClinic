import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => next(req).pipe(
  catchError((error: HttpErrorResponse) => {
    console.error('HTTP Error', error.status, error.message);
    if (error.status === 401 || error.status === 403) {
      // optional: redirect to login or show toast
    }
    return throwError(() => error);
  })
);
