import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { Injectable } from '@angular/core';

/**
 * HttpInterceptor which adds an access token to outgoing HTTP requests.
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oktaAuth: OktaAuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    // Only add an access token to whitelisted origins. TODO: add production URL eventually
    const allowedOrigins = ['http://localhost'];
    if (allowedOrigins.some((url) => request.urlWithParams.includes(url))) {
      const accessToken = await this.oktaAuth.getAccessToken();
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return next.handle(request).toPromise();
  }
}
