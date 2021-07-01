import { Component, OnInit } from '@angular/core'
import { UiService } from 'src/app/services/ui.service'
import { ModalRolFormComponent } from '../../pop up/modal-rol-form/modal-rol-form.component'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public lang: string
  constructor(public ui: UiService) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
  }
  openForm() {
    this.ui.showModal(ModalRolFormComponent, '500px', 'auto', '', 'backdrop')
  }
}
