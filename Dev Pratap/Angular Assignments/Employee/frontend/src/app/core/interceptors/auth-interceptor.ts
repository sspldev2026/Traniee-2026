import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ShareServices } from '../../shared/services/share-services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private shareService: ShareServices,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (
      req.url.includes('/auth/login') ||
      req.url.includes('/auth/refresh') ||
      req.url.includes('/auth/register')
    ) {
      return next.handle(req);
    }

    const accessToken = localStorage.getItem('accessToken');

    // Add Authorization header
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        // Access token expired
        if (error.status === 401 || error.status === 403) {

          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            this.logout();
            return throwError(() => error);
          }

          // Call refresh API
          return this.shareService
            .getNewAccessToken(refreshToken)
            .pipe(
              switchMap((res: any) => {
                console.log(res)

                localStorage.setItem(
                  'accessToken',
                  res.accessToken
                );

                localStorage.setItem(
                  'refreshToken',
                  res.refreshToken
                );

                this.shareService.assignUser(localStorage.getItem("accessToken"))
                this.shareService.getMyTask()

                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`
                  }
                });

                return next.handle(newReq);
              }),
              catchError((refreshError) => {
                this.logout();
                return throwError(() => refreshError);
              })
            );
        }

        return throwError(() => error);
      })
    );
  }

  private logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}