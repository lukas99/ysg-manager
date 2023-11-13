import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from '../../shared/confirmation-dialog/confirmation-dialog.component';

/**
 * Shows an error dialog in case an HTTP error occurs.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private translateService: TranslateService,
    public dialog: MatDialog
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          this.showDialog(error);
        }
        return throwError(error);
      })
    );
  }

  private showDialog(error: HttpErrorResponse): void {
    const errorMessage = this.translateService.instant('HTTP_ERROR_MESSAGE', {
      errorCode: error.status,
      errorUrl: error.url
    });
    this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: 'ERROR',
        text: errorMessage,
        confirmButtonText: 'OK'
      }
    });
  }
}
