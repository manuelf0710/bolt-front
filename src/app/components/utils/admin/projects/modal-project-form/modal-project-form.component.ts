import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UiService } from 'src/app/services/ui.service'

import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModalNotificationComponent } from '../../../pop up/modal-notification/modal-notification.component'
import { HttpService } from 'src/app/services/http.service'
import { environment } from 'src/environments/environment'
import { ProjectsService } from 'src/app/services/projects.service'
export interface DialogData {
  project: object
}
@Component({
  selector: 'app-modal-project-form',
  templateUrl: './modal-project-form.component.html',
  styleUrls: ['./modal-project-form.component.scss'],
})
export class ModalProjectFormComponent implements OnInit {
  public createProjectForm: FormGroup
  public hide: boolean
  public password: string
  public lang: string
  public operation_es: string = 'creado'
  public operation_en: string = 'created'

  public icons = [
    'assessment',
    'emoji_objects',
    'pie_chart',
    'business',
    'apartment',
    'table_view',
    'theaters',
    'mediation',
    'anchor',
    'data_exploration',
    'maps_home_work',
    'science',
    'whatshot',
    'deck',
    'view_compact',
    'dashboard',
    'storefront',
    'fitness_center',
    'spa',
    'business_center',
    'meeting_room',
    'ac_unit',
    'airport_shuttle',
    'sports_bar',
    'casino',
    'pets',
    'code',
    'explore',
    'view_in_ar',
    'dns',
    'space_dashboard',
    'sticky_note_2',
    'track_changes',
    'card_membership',
    'integration_instructions',
    'tour',
    'request_page',
    'payment',
    'account_balance',
    'savings',
    'account_balance_wallet',
    'receipt',
  ]

  private errorMessage: any = {
    es: {
      project_name_es: 'Ingrese un nombre de proyecto en español',
      project_name_en: 'Ingrese un nombre de proyecto en inglés',
      description_es: 'Ingrese una descripción en español',
      description_en: 'Ingrese una descripción en inglés',
      icon: 'Seleccione un icono',
    },
    en: {
      project_name_es: 'Enter a project name in spanish',
      project_name_en: 'Enter a project name in english',
      description_es: 'Enter a description in spanish',
      description_en: 'Enter a description in english',
      icon: 'Select a icon',
    },
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public httpService: HttpService,
    public projectService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.initforms()
    this.loadProject()
  }
  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.createProjectForm = this.formBuilder.group({
      project_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      project_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      description_es: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(100),
      ]),
      description_en: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(100),
      ]),
      icon: new FormControl('', [Validators.required]),
    })
  }

  saveProject(): void {
    if (this.createProjectForm.invalid) {
      ;(<any>Object)
        .values(this.createProjectForm.controls)
        .forEach((control) => {
          control.markAsTouched()
        })
      return
    } else {
      let projectData = {
        icon: this.createProjectForm.controls.icon.value,
        name_es: this.createProjectForm.controls.project_name_es.value,
        name_en: this.createProjectForm.controls.project_name_en.value,
        description_es: this.createProjectForm.controls.description_es.value,
        description_en: this.createProjectForm.controls.description_en.value,
        status: 1,
      }

      if (!this.data) {
        // if neither data was received a new project is created
        this.projectService.postData(projectData, this.showNotification())
      } else {
        // if data was received the current project will be updated
        let project_id = this.data.project['id']
        this.operation_es = 'actualizado'
        this.operation_en = 'updated'
        projectData.status = this.data.project['status']
        this.projectService.updateData(
          project_id,
          projectData,
          this.showNotification(),
        )
      }
    }
  }
  showNotification() {
    this.closeModal()
    this.ui.showModal(
      ModalNotificationComponent,
      '500px',
      'auto',
      '',
      'backdrop',
      {
        message_es: `El proyecto de nombre ${this.createProjectForm.controls.project_name_es.value} fue ${this.operation_es} con éxito`,
        message_en: `The ${this.createProjectForm.controls.project_name_en.value} project was successfully ${this.operation_en}`,
      },
    )

    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.createProjectForm.get(controlName)
    if (control.touched && control.errors) {
      if (this.lang == 'Esp') {
        error = this.errorMessage['es'][controlName]
      }
      if (this.lang == 'Eng') {
        error = this.errorMessage['en'][controlName]
      }
    }
    return error
  }

  closeModal() {
    this.ui.dismissModal(ModalProjectFormComponent)
  }

  loadProject() {
    if (this.data) {
      this.createProjectForm.patchValue({
        project_name_es: this.data.project['name_es'],
        project_name_en: this.data.project['name_en'],
        description_es: this.data.project['description_es'],
        description_en: this.data.project['description_en'],
        icon: this.data.project['icon'],
      })
    }
  }
}
