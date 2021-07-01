import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component';
import { AppList } from '../model/AppList';
import { HttpService } from './http.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private _favorites: any[] = [];
  private _favoritesSbj = new Subject<any[]>();
  public favorites$ = this._favoritesSbj.asObservable();

  constructor(private httpService: HttpService, private ui: UiService) {}

  getObservableData(user_id: string): Observable<any> {
    return this.httpService.get(
      environment.serverUrl + environment.favorites.getUserById + user_id
    );
  }

  getData() {
    this.httpService
      .get(environment.serverUrl + environment.favorites.getAll)
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this._favorites = response.body.items;

            this._favoritesSbj.next(this._favorites);
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        }
      );
  }

  postData(target: AppList, favData: any) {
    this.httpService
      .post(environment.serverUrl + environment.favorites.post, favData)
      .subscribe(
        (response: any) => {
          if (response.status == 201) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se agregó con éxito la aplicación ${target.name_es} a tu lista de favoritos`,
                message_en: `Successfully added the app ${target.name_en} in your favorite list`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
          }
        },
        (error) => {
          window.location.reload();
        }
      );
  }

  updateData(target: AppList) {
    this.httpService
      .put(
        environment.serverUrl + environment.favorites.putById + target.id,
        target
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
                message_es: `Se actualizó con éxito el app ${target.name_es}`,
                message_en: `Successfully updated the app ${target.name_en}`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
          }
        },
        (error) => {}
      );
  }

  delete(target: AppList) {
    this.httpService
      .delete(
        environment.serverUrl + environment.favorites.deleteById + target.id
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
                message_es: `Se eliminó con éxito el app ${target.name_es} de tu lista de favoritos`,
                message_en: `Successfully deleted the app ${target.name_en} of your favorites list`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        },
        (error) => {
          window.location.reload();
        }
      );
  }
}
