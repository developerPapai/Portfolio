import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  // Prepend API URL to requests if not an absolute URL
  const apiReq = req.clone({
    url: req.url.startsWith('http') ? req.url : `${environment.apiUrl}${req.url}`
  });

  return next(apiReq).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      throw error;
    })
  );
};
