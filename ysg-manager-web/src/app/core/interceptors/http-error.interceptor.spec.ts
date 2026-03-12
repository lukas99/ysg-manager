import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let httpHandler: HttpHandler;
  let translateService: TranslateService;
  let oidcSecurityService: OidcSecurityService;
  let dialog: any;
  let httpError500: HttpErrorResponse;
  let httpError401: HttpErrorResponse;

  beforeEach(() => {
    httpError500 = new HttpErrorResponse({
      status: 500,
      url: 'localhost:8080/api/teams'
    });
    httpError401 = new HttpErrorResponse({
      status: 401,
      url: 'localhost:8080/api/teams'
    });

    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    oidcSecurityService = <any>{
      authorize: jest.fn()
    };
    dialog = <any>{ open: jest.fn() };
    interceptor = new HttpErrorInterceptor(
      translateService,
      oidcSecurityService,
      dialog
    );
  });

  it('should redirect to login page in case of a 401 unauthorized response', fakeAsync(() => {
    httpHandler = <HttpHandler>{
      handle: jest.fn(() => throwError(() => httpError401))
    };
    let thrownError = false;

    const request = <HttpRequest<any>>{ headers: new HttpHeaders() };
    interceptor.intercept(request, httpHandler).subscribe(
      () => {},
      (error) => (thrownError = error)
    );
    tick();

    expect(oidcSecurityService.authorize).toHaveBeenCalled();
    expect(thrownError).toBe(httpError401);
  }));

  it('should show a dialog when a HttpErrorResponse occurs', fakeAsync(() => {
    httpHandler = <HttpHandler>{
      handle: jest.fn(() => throwError(() => httpError500))
    };
    let thrownError = false;

    const request = <HttpRequest<any>>{ headers: new HttpHeaders() };
    interceptor.intercept(request, httpHandler).subscribe(
      () => {},
      (error) => (thrownError = error)
    );
    tick();

    expect(dialog.open).toHaveBeenCalled();
    expect(thrownError).toBe(httpError500);
  }));
});
