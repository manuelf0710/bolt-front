import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component'
import { HttpService } from './http.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class AppsService {
  public lang: string

  private _apps: any[] = []
  private _appsSbj = new Subject<any[]>()
  public apps$ = this._appsSbj.asObservable()

  constructor(private httpService: HttpService, private ui: UiService) {}

  getObservableData(): Observable<any> {
    return this.httpService.get(
      environment.serverUrl + environment.apps.get + '?limit=10000',
    )
  }

  getData(page?: number) {
    if (!page) {
      page = 1
    }
    this.httpService
      .get(environment.serverUrl + environment.apps.get + '?page=' + page)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status == 200) {
            this.ui.dismissLoading()
            this._apps = response.body.items

            this._appsSbj.next(this._apps)
          } else {
            // TODO :: logic for error
            this.ui.dismissLoading()
          }
        },
        (error) => {
          // TODO :: logic for error
          this.ui.dismissLoading()
        },
      )
  }

  postData(appData: any, fun: any) {
    this.httpService
      .post(environment.serverUrl + environment.apps.post, appData)
      .subscribe(
        (response: any) => {
          if (response.status == 201) {
            fun
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              '',
              'backdrop',
              {
                message_es: `La aplicación de nombre ${appData.name_es} fue creada con éxito`,
                message_en: `The ${appData.name_en} app was successfully created`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        },
        (e) => {},
      )
  }

  updateData(target: any, appData: any, msg_es: string, msg_en: string, fun) {
    this.httpService
      .put(
        environment.serverUrl + environment.apps.putById + target.id,
        appData,
      )
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            fun
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el submenú ${target.name_es}`,
                message_en: `Successfully ${msg_en} the submenu ${target.name_en}`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }

  updateStatus(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(
        environment.serverUrl + environment.apps.updateStatusById + target.id,
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
                message_es: `Se ${msg_es} con éxito la aplicación ${target.name_es}`,
                message_en: `Successfully ${msg_en} the app ${target.name_en}`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        },
        (err) => {
          window.location.reload()
        },
      )
  }

  delete(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .delete(environment.serverUrl + environment.apps.deleteById + target.id)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status == 200) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito la aplicación ${target.name_es}`,
                message_en: `Successfully ${msg_en} the app ${target.name_en}`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }
}
