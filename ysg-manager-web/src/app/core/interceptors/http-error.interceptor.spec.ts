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

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let httpHandler: HttpHandler;
  let translateService: TranslateService;
  let dialog: any;
  let httpError: HttpErrorResponse;

  beforeEach(() => {
    httpError = new HttpErrorResponse({
      status: 500,
      url: 'localhost:8080/api/teams'
    });

    translateService = <any>{
      instant: jest.fn().mockImplementation((translationKey) => translationKey)
    };
    dialog = <any>{ open: jest.fn() };
    interceptor = new HttpErrorInterceptor(translateService, dialog);
    httpHandler = <HttpHandler>{
      handle: jest.fn(() => {
        return throwError(httpError);
      })
    };
  });

  it('should show a dialog when a HttpErrorResponse occurs', fakeAsync(() => {
    let thrownError = false;

    const request = <HttpRequest<any>>{ headers: new HttpHeaders() };
    interceptor.intercept(request, httpHandler).subscribe(
      () => {},
      (error) => (thrownError = error)
    );
    tick();

    expect(dialog.open).toHaveBeenCalled();
    expect(thrownError).toBe(httpError);
  }));
});
