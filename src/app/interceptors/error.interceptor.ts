import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiService } from '../services/ui.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private ui: UiService, public dialog: MatDialog) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        let msg = errorResponse.error.message;
        if (msg == undefined) {
          msg = errorResponse.message;
        }
        if (errorResponse.error.statusCode != 401) {
          this.ui.createSnackbar(msg, 'x', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'snack-alert',
          });
        }
        this.ui.createSnackbar(msg, 'x', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'snack-alert',
        });
        return throwError(errorResponse);
      })
    );
  }
}
