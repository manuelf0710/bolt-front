import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UiService } from 'src/app/services/ui.service'
export interface DialogData {
  project_name: string
  submenu_name: string
  app_name: string
  user_name: string
  role_name: string
  fav_name: string
  banner_name: string
  message_action_es: string
  message_action_en: string
  permission: boolean
  session: boolean
}

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss'],
})
export class ModalConfirmationComponent implements OnInit {
  public lang: string
  constructor(
    public ui: UiService,
    public dialogRef: MatDialogRef<ModalConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    this.data.permission = true
    this.lang = localStorage.getItem('lang') || 'Esp'
  }

  closeModal() {
    this.dialogRef.close()
  }
}
