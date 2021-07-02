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
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmationComponent } from '../components/utils/pop up/modal-confirmation/modal-confirmation.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private ui: UiService,
    public dialog: MatDialog
  ) {}

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
        if (errorResponse.error.statusCode == 401) {
          const confDialog = this.dialog.open(ModalConfirmationComponent, {
            id: ModalConfirmationComponent.toString(),
            disableClose: true,
            hasBackdrop: true,
            width: '500px',
            height: 'auto',
            data: {
              session: true,
              message_action_es: 'iniciar sesión',
              message_action_en: 'log in',
            },
          });

          confDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.authService.login();
            }
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
