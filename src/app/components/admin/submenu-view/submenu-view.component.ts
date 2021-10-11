import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppList } from 'src/app/model/AppList';
import { SubMenu } from 'src/app/model/SubMenu.model';
import { AppsService } from 'src/app/services/apps.service';
import { SubmenusService } from 'src/app/services/submenus.service';
import { UiService } from 'src/app/services/ui.service';
import { ModalAppAssoccComponent } from '../../utils/admin/projects/modal-app-assocc/modal-app-assocc.component';
import { ModalConfirmationComponent } from '../../utils/pop up/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-submenu-view',
  templateUrl: './submenu-view.component.html',
  styleUrls: ['./submenu-view.component.scss'],
})
export class SubmenuViewComponent implements OnInit {
  public lang: string;
  public submenu_data: any;
  public submenu_data_name: string;
  public submenu_id: any;
  public submenu_apps: SubMenu[] = [];
  public app_list: AppList[] = [];
  public createSubmenuForm: FormGroup;
  public pages: number;
  public active_count = 1;

  private errorMessage: any = {
    es: {
      submenu_name_es: 'Ingrese un nombre de sub menú en español',
      submenu_name_en: 'Ingrese un nombre de sub menú en inglés',
    },
    en: {
      submenu_name_es: 'Enter a sub menu name in spanish',
      submenu_name_en: 'Enter a sub menu name in english',
    },
  };
  constructor(
    public activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ui: UiService,
    public dialog: MatDialog,
    private submenuService: SubmenusService,
    private appService: AppsService
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.submenu_id = this.activeRoute.snapshot.params.id;
    this.initforms();
    this.getData();
  }

  getData() {
    let appSubs = this.appService.getObservableData();
    let subSubs = this.submenuService.getObservableData(this.submenu_id);
    this.ui.showLoading();

    forkJoin({ submenus: subSubs, apps: appSubs }).subscribe((res: any) => {
      this.ui.dismissLoading();
      let submenu = res.submenus.body;
      this.submenu_data = submenu;
      this.submenu_data_name =
        this.lang == 'Esp' ? submenu.name_es : submenu.name_en;
      this.submenu_apps = submenu.apps;

      let apps = res.apps.body.items;

      apps.forEach((app) => {
        this.submenu_apps.forEach((appsAssoc) => {
          if (app.id == appsAssoc.id) {
            this.app_list = [...this.app_list, app];
          }
        });
      });
      this.loadProject();
    });
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.createSubmenuForm = this.formBuilder.group({
      submenu_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      submenu_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      created_by: new FormControl(
        {
          value: '',
          disabled: true,
        },
        []
      ),
      last_update: new FormControl(
        {
          value: '',
          disabled: true,
        },
        []
      ),
      icon: new FormControl('', [Validators.required]),
    });
  }

  updateSubmenu(target: any): void {
    let msg_es = 'actualizado';
    let msg_en = 'updated';
    let userId = localStorage.getItem('userId');
    let submenuData = {
      name_es: this.createSubmenuForm.controls.submenu_name_es.value,
      name_en: this.createSubmenuForm.controls.submenu_name_en.value,
      updated_by: userId,
    };
    this.submenuService.updateData(target, submenuData, msg_es, msg_en);
  }

  deletedSubmenu(target: any) {
    this.submenuService.delete(target, 'eliminó', 'deleted');
  }

  updateAppAssoc(app?: any) {
    if (!app) {
      this.ui.showModal(ModalAppAssoccComponent, '500px', 'auto', null, null, {
        submenu_id: this.submenu_data.id,
      });
    } else {
      this.ui.showModal(ModalAppAssoccComponent, '500px', 'auto', null, null, {
        app: app,
        submenu_id: this.submenu_data.id,
      });
    }
  }

  updateAppStatus(target: any) {
    this.appService.updateStatus(target, 'actualizó', 'updated');
  }

  deleteApp(app: any) {
    let message_es = 'eliminar';
    let message_en = 'delete';

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        project_name: this.lang == 'Esp' ? app.name_es : app.name_en,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    });

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        message_es = 'eliminó';
        message_en = 'deleted';
        this.appService.delete(app, message_es, message_en);
      }
    });
  }

  showConfirmation(
    target: any,
    operation: any,
    message_es: string,
    message_en: string
  ) {
    let submenuName;
    let appName;

    if (operation == 'updateAppStatus') {
      appName = this.lang == 'Esp' ? target.name_es : target.name_en;
      if (target.status == 1) {
        message_es = 'deshabilitar';
        message_en = 'disable';
      }
    } else {
      submenuName = this.lang == 'Esp' ? target.name_es : target.name_en;
    }

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        submenu_name: submenuName,
        app_name: appName,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    });

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading();
        if (operation == 'deletedSubmenu') {
          this.deletedSubmenu(target);
        } else if (operation == 'updateSubmenu') {
          if (
            (this.createSubmenuForm.controls.submenu_name_en.invalid ||
              this.createSubmenuForm.controls.submenu_name_es.invalid) &&
            this.createSubmenuForm.dirty
          ) {
            (<any>Object)
              .values(this.createSubmenuForm.controls)
              .forEach((control) => {
                control.markAsTouched();
              });
            return;
          } else {
            this.updateSubmenu(target);
          }
        } else if (operation == 'updateAppStatus') {
          this.updateAppStatus(target);
        }
      } else {
        if (operation == 'updateAppStatus') {
          window.location.reload();
        }
      }
    });
  }

  public getMessageform(controlName: any): string {
    let error = '';
    const control = this.createSubmenuForm.get(controlName);
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

  loadProject() {

    console.log(this.submenu_data);
    if (this.submenu_data) {
      let prep = this.lang == 'Esp' ? ' el ' : ' at ';
      this.createSubmenuForm.patchValue({
        submenu_name_es: this.submenu_data['name_es'],
        submenu_name_en: this.submenu_data['name_en'],
        created_by:
          this.submenu_data['user_created']['name'] +
          ' ' +
          this.submenu_data['user_created']['last_name'] +
          ' ID: ' +
          this.submenu_data['user_created']['employee_code'] +
          prep +
          new Date(this.submenu_data['created_at']).toLocaleDateString() +
          '-' +
          new Date(this.submenu_data['created_at']).toLocaleTimeString(),

        last_update:
          this.submenu_data['user_update']['name'] +
          ' ' +
          this.submenu_data['user_update']['last_name'] +
          ' ID: ' +
          this.submenu_data['user_update']['employee_code'] +
          prep +
          new Date(this.submenu_data['updated_at']).toLocaleDateString() +
          '-' +
          new Date(this.submenu_data['updated_at']).toLocaleTimeString(),
      });
    }
  }

  goBack() {
    window.history.back();
  }
}
