import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component';
import { HttpService } from './http.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  public lang: string;

  private _fullProjects: any[] = [];
  private _fullProjectsSbj = new Subject<any[]>();
  public fullProjects$ = this._fullProjectsSbj.asObservable();

  private _simpleProjects: any[] = [];
  private _simpleProjectsSbj = new Subject<any[]>();
  public simpleProjects$ = this._simpleProjectsSbj.asObservable();

  constructor(private httpService: HttpService, private ui: UiService) {}

  getObservableData(): Observable<any> {
    return this.httpService.get(
      environment.serverUrl + environment.projects.getAll + '?page=1&limit=1000'
    );
  }

  getActiveData(page?: number, limit?: number): Observable<any> {
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    return this.httpService.get(
      environment.serverUrl +
        environment.projects.getAll +
        '?status=1' +
        '&page=' +
        page +
        '&limit=' +
        limit
    );
  }

  getInactiveData(page?: number, limit?: number): Observable<any> {
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    return this.httpService.get(
      environment.serverUrl +
        environment.projects.getAll +
        '?status=0' +
        '&page=' +
        page +
        '&limit=' +
        limit
    );
  }

  getProjectsAssignByUserRol(): Observable<any> {
    return this.httpService
      .get(environment.serverUrl + environment.projects.menuByUser)
      .pipe(
        map((lista: any) => {
          const projectsAssignedToUser = lista.body;
          return projectsAssignedToUser;
        })
      );
  }

  getProjectsAssignByRol(rol: string) {
    return this.httpService
      .get(environment.serverUrl + environment.projects.menuByRole + '/' + rol)
      .pipe(
        map((lista: any) => {
          const projectsAssignedToRole = lista.body;
          return projectsAssignedToRole;
        })
      );
  }

  getSimpleData() {
    this.httpService
      .get(environment.serverUrl + environment.projects.get)
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this._simpleProjects = [];
            response.body.forEach((projects) => {
              this._simpleProjects.push(projects);
            });

            this._simpleProjectsSbj.next(this._simpleProjects);
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        }
      );
  }

  postData(projectData: any, fun: any) {
    this.httpService
      .post(environment.serverUrl + environment.projects.post, projectData)
      .subscribe((response: any) => {
        if (response.status == 201) {
          fun;
        } else {
        }
      });
  }

  updateData(project_id: string, projectData: any, fun: any) {
    this.httpService
      .put(
        environment.serverUrl + environment.projects.putById + project_id,
        projectData
      )
      .subscribe((response: any) => {
        if (response.status == 200) {
          fun;
        } else {
        }
      });
  }

  updateStatus(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(
        environment.serverUrl +
          environment.projects.updateStatusById +
          target.id
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
                message_es: `Se ${msg_es} con éxito el proyecto ${target.name_es}`,
                message_en: `Successfully ${msg_en} the project ${target.name_en}`,
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
      .delete(
        environment.serverUrl + environment.projects.deleteById + target.id
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
                message_es: `Se ${msg_es} con éxito el proyecto ${target.name_es}`,
                message_en: `Successfully ${msg_en} the project ${target.name_en}`,
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
