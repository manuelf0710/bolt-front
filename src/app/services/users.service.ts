import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component'
import { HttpService } from './http.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public lang: string

  private _users: any[] = []
  private _userSbj = new Subject<any[]>()
  public users$ = this._userSbj.asObservable()

  constructor(private httpService: HttpService, private ui: UiService) {}

  getUsers() {
    return this._users
  }

  getFullData(page?: number) {
    if (!page) {
      page = 1
    }
    this.httpService
      .get(environment.serverUrl + environment.users.getAll + '?page=' + page)
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this._users = response.body
            this._userSbj.next(this._users)
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        },
      )
  }

  searchUsers(user_data: any) {
    this.httpService
      .post(environment.serverUrl + environment.users.getAll, user_data)
      .subscribe(
        (response: any) => {
          if (response.status == 201) {
            this._users = response.body
            this._userSbj.next(this._users)
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        },
      )
  }

  updateStatus(user: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(environment.serverUrl + environment.users.updateStatusById + user.id)
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              '',
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el usuario ${user.name}`,
                message_en: `Successfully ${msg_en} the user ${user.name}`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } else {
            // TODO :: logic for error

            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        },
        (error) => {
          // TODO :: logic for error

          setTimeout(() => {
            window.location.reload()
          }, 2000)
        },
      )
  }

  saveUserRoles(creator_id: string, username: any, userRoles: any, fun: any) {
    this.httpService
      .post(
        environment.serverUrl + environment.userRoles.setRole + creator_id,
        userRoles,
      )
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
                message_es: `Los roles del usuario con nombre ${username} fueron actualizados con éxito`,
                message_en: `The roles of the user ${username} were updated successfully`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } else {
          }
        },
        (err) => {},
      )
  }

  updateUserRoles(creator_id: string, username: any, userRoles: any, fun: any) {
    this.httpService
      .put(
        environment.serverUrl + environment.userRoles.setRole + creator_id,
        userRoles,
      )
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            fun
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              '',
              'backdrop',
              {
                message_es: `Los roles del usuario con nombre ${username} fueron actualizados con éxito`,
                message_en: `The roles of the user ${username} were updated successfully`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } else {
          }
        },
        (err) => {},
      )
  }
}
