import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { OKTA_AUTH } from '@okta/okta-angular';
import { Inject, Injectable } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';

/**
 * HttpInterceptor which adds an access token to outgoing HTTP requests.
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

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
    // only add an access token to whitelisted origins
    const allowedOrigins = [
      'http://localhost',
      'https://youngstargames.zapto.org'
    ];
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
