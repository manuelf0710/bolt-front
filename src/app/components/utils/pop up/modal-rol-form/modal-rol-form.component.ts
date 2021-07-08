import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { UiService } from 'src/app/services/ui.service';
import { environment } from 'src/environments/environment';
import { ModalNotificationComponent } from '../modal-notification/modal-notification.component';

@Component({
  selector: 'app-modal-rol-form',
  templateUrl: './modal-rol-form.component.html',
  styleUrls: ['./modal-rol-form.component.scss'],
})
export class ModalRolFormComponent implements OnInit {
  public userData: any;
  public userRolForm: FormGroup;
  public captchaStatus: boolean;
  public restartCaptcha: boolean;
  public hide: boolean;
  public password: string;
  public lang: string;
  public projects: any = [];
  private errorMessage: any = {
    es: {
      user: 'usuario inválido',
      id: 'id inválido',
      project: 'Seleccione un proyecto',
      country: 'Seleccione un país',
    },
    en: {
      user: 'invalid user',
      id: 'invalid id',
      project: 'Select a project',
      country: 'Select  a country',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    public ui: UiService,
    public httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userData'));

    this.httpService
      .get(environment.serverUrl + environment.projects.get)
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this.projects = response.body.items;
          } else {
            console.log('Error');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.initforms();
    this.loadUser();
  }
  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.userRolForm = this.formBuilder.group({
      user: new FormControl(
        {
          value: '',
          disabled: true,
        },
        []
      ),
      id: new FormControl(
        {
          value: '',
          disabled: true,
        },
        []
      ),
      project: new FormControl('', [Validators.required]),

      country: new FormControl('', [Validators.required]),
    });
  }
  loginUser(): void {
    if (this.userRolForm.invalid) {
      (<any>Object).values(this.userRolForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    // TO DO :: create endpoint and aim it
    let requestData = {
      user: this.userRolForm.controls.user.value,
      id: this.userRolForm.controls.id.value,
      project: this.userRolForm.controls.project.value,
      country: this.userRolForm.controls.country.value,
    };
    console.log(requestData);

    this.httpService
      .post(environment.serverUrl + environment.users, requestData)
      .subscribe(
        (response: any) => {
          this.ui.showLoading();
          if (response.status >= 200 && response.status < 300) {
            this.closeModal();
            this.ui.dismissLoading();
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              '',
              'backdrop',
              {
                message_es:
                  'Su solicitud fue enviada con éxito en el momento en el que se genere el rol será notificado por medio de su correo',
                message_en:
                  'Your request was sent successfully at the time the role is generated will be notified by mail',
              }
            );
          }
        },
        (err) => {
          this.ui.dismissLoading();
        }
      );
  }

  public getMessageform(controlName: any): string {
    let error = '';
    const control = this.userRolForm.get(controlName);
    if (control.touched && control.errors) {
      if (this.lang == 'Esp') {
        error = this.errorMessage['es'][controlName];
      }
      if (this.lang == 'Eng') {
        error = this.errorMessage['en'][controlName];
      }
    }
    return error;
  }

  loadUser() {
    if (this.userData) {
      this.userRolForm.patchValue({
        user: this.userData['name'] + ' ' + this.userData['last_name'],
        id: this.userData['employee_code'],
      });
    }
  }

  closeModal() {
    this.ui.dismissModal(ModalRolFormComponent);
  }
}
