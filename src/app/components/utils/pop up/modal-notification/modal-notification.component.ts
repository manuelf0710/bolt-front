import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UiService } from 'src/app/services/ui.service'

export interface DialogData {
  message_es: string
  message_en: string
}
@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.component.html',
  styleUrls: ['./modal-notification.component.scss'],
})
export class ModalNotificationComponent implements OnInit {
  public lang: string
  constructor(
    public ui: UiService,
    public dialogRef: MatDialogRef<ModalNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
  }
  closeModal() {
    this.ui.dismissModal(ModalNotificationComponent)
  }
}
