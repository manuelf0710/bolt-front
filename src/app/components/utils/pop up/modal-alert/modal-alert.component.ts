import { Component, OnInit } from '@angular/core'
import { UiService } from 'src/app/services/ui.service'
import { ModalRolFormComponent } from '../modal-rol-form/modal-rol-form.component'

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss'],
})
export class ModalAlertComponent implements OnInit {
  public lang: string
  constructor(public ui: UiService) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
  }

  closeModal() {
    this.ui.dismissModal(ModalAlertComponent)
  }
  openForm() {
    this.closeModal()
    this.ui.showModal(ModalRolFormComponent, '500px', 'auto', '', 'backdrop')
  }
}
