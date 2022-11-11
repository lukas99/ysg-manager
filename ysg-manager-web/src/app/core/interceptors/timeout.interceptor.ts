import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

const DEFAULT_TIMEOUT = 5000;

/**
 * Overwrite default timeout in case it's not set individually for a request.
 *
 * To not wait in the PWA for the timeout to expire when device is not offline but ysg server is
 * not available.
 *
 * See: https://stackoverflow.com/questions/45938931/default-and-specific-request-timeout
 */
@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get('timeout') || DEFAULT_TIMEOUT;
    const timeoutValueNumeric = Number(timeoutValue);

    return next.handle(req).pipe(timeout(this.getTimeout(timeoutValueNumeric)));
  }

  getTimeout(timeoutValueNumeric: number) {
    // just for testing
    return timeoutValueNumeric;
  }
}
