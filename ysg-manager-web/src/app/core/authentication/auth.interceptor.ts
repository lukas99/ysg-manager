import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, switchMap } from 'rxjs/operators';

/**
 * HttpInterceptor which adds an access token to outgoing HTTP requests.
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.oidcSecurityService.getAccessToken().pipe(
      map((accessToken) =>
        request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + accessToken
          }
        })
      ),
      switchMap((clonedRequest) => next.handle(clonedRequest))
    );
  }
}
