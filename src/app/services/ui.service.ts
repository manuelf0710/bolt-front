import { Injectable } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { LoadingComponent } from '../components/utils/components/loading/loading.component'

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public loading: any
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}

  showLoading() {
    try {
      this.loading = this.dialog.open(LoadingComponent, {
        disableClose: true,
        panelClass: 'loading-modal',
        backdropClass: 'backdrop',
      })
    } catch (e) {
      console.error('showLoading', e)
    }
  }

  dismissLoading() {
    try {
      if (this.loading) {
        this.loading.close()
      }
    } catch (e) {
      console.error('dismissLoading', e)
    }
  }

  showModal(refComponent, width, height, refClass?, backdropClass?, data?) {
    try {
      this.dialog.open(refComponent, {
        id: refComponent,
        disableClose: true,
        hasBackdrop: true,
        backdropClass: backdropClass,
        panelClass: refClass,
        width: width,
        height: height,
        data: data,
      })
    } catch (e) {
      console.error('showModal', e)
    }
  }

  dismissModal(reference: any) {
    try {
      if (reference) {
        this.dialog.getDialogById(reference).close()
      }
    } catch (e) {
      console.error('dismissModal', e)
    }
  }

  createSnackbar(message: string, action: string, config: object) {
    this.snackBar.open(message, action, config)
  }
}
