import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UiService } from 'src/app/services/ui.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalNotificationComponent } from '../../../pop up/modal-notification/modal-notification.component';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { UsersService } from 'src/app/services/users.service';
export interface DialogData {
  user: object;
}
@Component({
  selector: 'app-modal-user-form',
  templateUrl: './modal-user-form.component.html',
  styleUrls: ['./modal-user-form.component.scss'],
})
export class ModalUserFormComponent implements OnInit {
  public createUserForm: FormGroup;
  public hide: boolean;
  public password: string;
  public lang: string;
  public operation_es: string = 'creado';
  public operation_en: string = 'created';

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
  ];

  private errorMessage: any = {
    es: {
      email: 'Ingrese un correo',
      name: 'Ingrese el nombre',
      lastname: 'Ingrese el apellido',
      networkid: 'Ingrese el id de red',
      country: 'Ingrese el país',
      profile: 'ingrese el perfil',
    },
    en: {
      email: 'Enter email',
      name: 'Enter name',
      lastname: 'Enter last name',
      networkid: 'enter network id',
      country: 'Select a country',
      profile: 'Select a profile',
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public httpService: HttpService,
    public userService: UsersService
  ) {}

  ngOnInit(): void {
    this.initforms();
    this.loadUser();
  }
  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.createUserForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(150),
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]),
      networkid: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(45),
      ]),
      profile: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    });
  }

  saveUser(): void {
    if (this.createUserForm.invalid) {
      (<any>Object).values(this.createUserForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    } else {
      let userData = {
        email: this.createUserForm.controls.email.value,
        name: this.createUserForm.controls.name.value,
        last_name: this.createUserForm.controls.lastname.value,
        employee_code: this.createUserForm.controls.networkid.value,
        profile: this.createUserForm.controls.profile.value,
        country: this.createUserForm.controls.country.value,
        status: 1,
      };

      if (!this.data) {
        // if neither data was received a new project is created
        this.userService.postData(userData, this.showNotification());
      } else {
        // if data was received the current project will be updated
        let user_id = this.data.user['id'];
        userData.status = this.data.user['status'];
        this.operation_es = 'actualizado';
        this.operation_en = 'updated';
        this.userService.updateData(user_id, userData, this.showNotification());
      }
    }
  }
  showNotification() {
    this.closeModal();
    this.ui.showModal(
      ModalNotificationComponent,
      '500px',
      'auto',
      '',
      'backdrop',
      {
        message_es: `El usuario ${this.createUserForm.controls.name.value} fue ${this.operation_es} con éxito`,
        message_en: `The ${this.createUserForm.controls.name.value} user was successfully ${this.operation_en}`,
      }
    );

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  public getMessageform(controlName: any): string {
    let error = '';
    const control = this.createUserForm.get(controlName);
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

  closeModal() {
    this.ui.dismissModal(ModalUserFormComponent);
  }

  loadUser() {
    if (this.data) {
      this.createUserForm.patchValue({
        email: this.data.user['email'],
        name: this.data.user['name'],
        lastname: this.data.user['last_name'],
        networkid: this.data.user['employee_code'],
        profile: this.data.user['profile'],
        country: this.data.user['country'],
      });
      this.createUserForm.controls['networkid'].disable();
    }
  }
}
