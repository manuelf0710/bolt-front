import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component';
import { HttpService } from './http.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class BannersService {
  private _banners: any[] = [];
  private _bannersSbj = new Subject<any[]>();
  public banners$ = this._bannersSbj.asObservable();

  constructor(private httpService: HttpService, private ui: UiService) {}

  getObservableData(): Observable<any> {
    return this.httpService.get(
      environment.serverUrl + environment.banners.getAll + '?page=1&limit=100'
    );
  }

  getData() {
    this.httpService
      .get(environment.serverUrl + environment.banners.getAll)
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this._banners = [];
            response.body.items.forEach((banner) => {
              this._banners.push(banner);
            });
            this._bannersSbj.next(this._banners);
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        }
      );
  }

  postData(target: any) {
    this.httpService
      .postFormData(environment.serverUrl + environment.banners.post, target)
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
                message_es: `Se actualizó con éxito el banner ${target.name_es}`,
                message_en: `Successfully updated the banner ${target.name_en}`,
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

  updateData(target: any, id: string) {
    this.httpService
      .putFormData(
        environment.serverUrl + environment.banners.putById + id,
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
                message_es: `Se actualizó con éxito el banner ${target.name_es}`,
                message_en: `Successfully updated the banner ${target.name_en}`,
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

  delete(target: any) {
    this.httpService
      .delete(
        environment.serverUrl + environment.banners.deleteById + target.id
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
                message_es: `Se eliminó con éxito el banner ${target.name_es}`,
                message_en: `Successfully deleted the banner ${target.name_en}`,
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

  changeStatus(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(environment.serverUrl + environment.banners.upload + target.id)
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
                message_es: `Se ${msg_es} con éxito el banner ${target.name_es}`,
                message_en: `Successfully ${msg_en} the banner ${target.name_en}`,
              }
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            //  TO DO show http error
          }
        },
        (error) => {
          // TODO :: logic for error
        }
      );
  }
}
