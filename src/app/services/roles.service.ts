import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { UiService } from './ui.service';
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  public lang: string;

  private _roles: any[] = [];
  private _rolesSbj = new Subject<any[]>();
  public roles$ = this._rolesSbj.asObservable();

  constructor(private httpService: HttpService, private ui: UiService) {}

  getObservableData(page: number): Observable<any> {
    return this.httpService.get(
      environment.serverUrl + environment.roles.getAll + '?page=' + page
    );
  }

  getData(page?: number, limit?: number) {
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    this.httpService
      .get(
        environment.serverUrl +
          environment.roles.getAll +
          '?page=' +
          page +
          '&limit=' +
          limit
      )
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this._roles = response.body;
            this._rolesSbj.next(this._roles);
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        }
      );
  }

  postData(roleData: any) {
    this.httpService
      .post(
        environment.serverUrl + environment.roles.postWithProjects,
        roleData
      )
      .subscribe(
        (response: any) => {
          if (response.status == 201) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              '',
              'backdrop',
              {
                message_es: `El rol ${roleData.name_es} fue creado con éxito`,
                message_en: `The ${roleData.name_en} role was successfully created`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
          }
        },
        (err) => {}
      );
  }

  updateData(
    role_id: string,
    projectData: any,
    msg_es: string,
    msg_en: string
  ) {
    this.httpService
      .put(
        environment.serverUrl + environment.roles.putByIdWithProjects + role_id,
        projectData
      )
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el rol ${projectData.name_es}`,
                message_en: `Successfully ${msg_en} the role ${projectData.name_en}`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
          }
        },
        (err) => {}
      );
  }

  updateStatus(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(
        environment.serverUrl + environment.roles.updateStatusById + target.id
      )
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el rol ${target.name_es}`,
                message_en: `Successfully ${msg_en} the role ${target.name_en}`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        },
        (err) => {
          window.location.reload();
        }
      );
  }

  delete(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .delete(environment.serverUrl + environment.roles.deleteById + target.id)
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el rol ${target.name_es}`,
                message_en: `Successfully ${msg_en} the role ${target.name_en}`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        },
        (err) => {
          window.location.reload();
        }
      );
  }
}
