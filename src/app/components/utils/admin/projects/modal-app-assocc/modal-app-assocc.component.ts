import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppsService } from 'src/app/services/apps.service';
import { HttpService } from 'src/app/services/http.service';
import { UiService } from 'src/app/services/ui.service';
import { DialogData } from '../../../pop up/modal-confirmation/modal-confirmation.component';
import { environment } from 'src/environments/environment';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-modal-app-assocc',
  templateUrl: './modal-app-assocc.component.html',
  styleUrls: ['./modal-app-assocc.component.scss'],
})
export class ModalAppAssoccComponent implements OnInit {
  public updateAppAssocForm: FormGroup;
  public passwordsForm: FormGroup;
  public lang: string;
  public hide: boolean = false;
  public hide2: boolean = false;
  public checked: boolean = false;
  public selectedValue: string;
  public appTypes: any = [];

  matcher = new MyErrorStateMatcher();
  private errorMessage: any = {
    es: {
      item_name_es: 'Ingrese un nombre en español',
      item_name_en: 'Ingrese un nombre en inglés',
      icon: 'Seleccione un tipo de aplicación',
      url: 'Ingrese una url',
      user: 'Ingrese un usuario',
      password: 'Ingrese una contraseña',
      password_confirm: 'La contraseña reescrita no coincide con su contraseña',
    },
    en: {
      item_name_es: 'Enter a name in spanish',
      item_name_en: 'enter a name in english',
      icon: 'Select a type of application',
      url: 'Enter a url',
      user: 'Enter a username',
      password: 'Enter a password',
      password_confirm: 'The retyped password does not match your password',
    },
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private ui: UiService,
    private appService: AppsService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.initforms();
    this.getAppTypes();
    this.loadProject();
  }

  initforms() {
    this.updateAppAssocForm = this.formBuilder.group({
      item_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      item_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      url: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(350),
      ]),
      user: new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      icon: new FormControl('', [Validators.required]),
    });

    this.passwordsForm = this.formBuilder.group(
      {
        password: new FormControl('', [
          Validators.minLength(6),
          Validators.maxLength(30),
        ]),
        password_confirm: new FormControl(''),
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.password_confirm.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  closeModal() {
    this.ui.dismissModal(ModalAppAssoccComponent);
  }

  loadProject() {
    if (this.data['app']) {
      this.selectedValue = this.data['app']['type']['name'];

      this.updateAppAssocForm.patchValue({
        item_name_es: this.data['app']['name_es'],
        item_name_en: this.data['app']['name_en'],
        url: this.data['app']['url'],
        user: this.data['app']['username'],
        icon: this.data['app']['type']['name'],
      });
    }
  }

  uploadApp() {
    if (this.selectedValue == 'Power BI') {
      if (
        this.updateAppAssocForm.invalid ||
        this.passwordsForm.invalid ||
        !this.updateAppAssocForm.dirty
      ) {
        (<any>Object)
          .values(this.updateAppAssocForm.controls)
          .forEach((control) => {
            control.markAsTouched();
          });
        (<any>Object).values(this.passwordsForm.controls).forEach((control) => {
          control.markAsTouched();
        });
        return;
      }
    } else {
      if (this.updateAppAssocForm.invalid || !this.updateAppAssocForm.dirty) {
        (<any>Object)
          .values(this.updateAppAssocForm.controls)
          .forEach((control) => {
            control.markAsTouched();
          });

        return;
      }
    }

    this.ui.showLoading();

    let app_type_id;
    let user_id = localStorage.getItem('userId');

    this.appTypes.forEach((type) => {
      if (type.name == this.selectedValue) {
        app_type_id = type.id;
      }
    });

    let appData = {
      submenu_id: this.data['submenu_id'],
      type_id: app_type_id,
      url: this.updateAppAssocForm.controls.url.value,
      name_es: this.updateAppAssocForm.controls.item_name_es.value,
      name_en: this.updateAppAssocForm.controls.item_name_en.value,
      username: this.updateAppAssocForm.controls.user.value,
      password: this.passwordsForm.controls.password.value,
      created_by: user_id,
    };
    if (!this.data['app']) {
      this.appService.postData(appData, this.closeForm());
    } else {
      this.appService.updateData(
        this.data['app'],
        appData,
        'actualizó',
        'updated',
        this.closeForm()
      );
    }
  }

  getAppTypes() {
    this.http
      //.get('https://bolt-back.herokuapp.com/api/v1/types')
      .get(environment.serverUrl + environment.types.get)
      .subscribe((response: any) => {
        if (response.status >= 200 && response.status < 300) {
          this.appTypes = response.body.items;
        }
      });
  }

  changeType() {
    this.updateAppAssocForm.controls.user.reset();
    // clear error in the specific fields
    this.updateAppAssocForm.controls.user.clearValidators();
    this.passwordsForm.controls.password.clearValidators();
    this.passwordsForm.controls.password_confirm.clearValidators();
    // updale and validate for expecting errors
    this.updateAppAssocForm.controls.user.updateValueAndValidity();
    this.passwordsForm.controls.password.updateValueAndValidity();
    this.passwordsForm.controls.password_confirm.updateValueAndValidity();
  }

  public getMessageform(controlName: any): string {
    let error = '';
    const control = this.updateAppAssocForm.get(controlName);
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

  closeForm() {
    this.ui.dismissModal(ModalAppAssoccComponent);
  }
}
