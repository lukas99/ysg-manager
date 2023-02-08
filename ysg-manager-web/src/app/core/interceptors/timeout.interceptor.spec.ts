import { TimeoutInterceptor } from './timeout.interceptor';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;
  let httpHandler: HttpHandler;
  let timeoutSpy: any;

  beforeEach(() => {
    interceptor = new TimeoutInterceptor();
    httpHandler = <HttpHandler>{
      handle: jest.fn(() => of(<HttpEvent<any>>{ body: '1234' }))
    };
    timeoutSpy = jest.spyOn(interceptor, 'getTimeout');
  });

  it('should overwrite the timeout in case request has not defined it', fakeAsync(() => {
    const request = <HttpRequest<any>>{ headers: new HttpHeaders() };

    let expectedBody = '';
    interceptor
      .intercept(request, httpHandler)
      .subscribe((value: any) => (expectedBody = value.body));
    tick();

    expect(timeoutSpy).toHaveBeenCalledWith(30000);
    expect(expectedBody).toBe('1234');
  }));

  it('should use the timeout defined by the request', fakeAsync(() => {
    const request = <HttpRequest<any>>{
      headers: new HttpHeaders({ timeout: '2000' })
    };

    let expectedBody = '';
    interceptor
      .intercept(request, httpHandler)
      .subscribe((value: any) => (expectedBody = value.body));
    tick();

    expect(timeoutSpy).toHaveBeenCalledWith(2000);
    expect(expectedBody).toBe('1234');
  }));
});
