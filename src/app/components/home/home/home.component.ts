import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalAlertComponent } from '../../utils/pop up/modal-alert/modal-alert.component';
import { UiService } from 'src/app/services/ui.service';
import { TutorialComponent } from '../../utils/components/tutorial/tutorial.component';
import { AuthService } from 'src/app/services/auth.service';
import { Banner } from 'src/app/model/banner.model';
import { BannersService } from 'src/app/services/banners.service';
import { forkJoin, Subscription } from 'rxjs';
import { FavoritesService } from 'src/app/services/favorites.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public projSubs: Subscription;
  public bannerSubs: Subscription;
  public user_id: string;
  public banners: Banner[] = [];
  public bannerList: any = [];
  public lang: string;
  public date = new Date().toLocaleDateString();
  public favList: any = [];
  public userId: string = '';
  public assetUrl: string;

  constructor(
    private router: Router,
    private ui: UiService,
    private authService: AuthService,
    private bannerService: BannersService,
    private favoriteService: FavoritesService
  ) {
    this.assetUrl = environment.serverUrl.split('/api')[0];
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.userId = localStorage.getItem('userId');
    this.authUser();
    this.getData();
  }

  authUser() {
    var token = localStorage.getItem('token');
    if (!token) {
      // get url data
      function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }
      var authData = getParameterByName('SamlReq');
      var decodedAuthData = JSON.parse(atob(authData));
      // create user auth data
      token = decodedAuthData.access_token;
      const userId = decodedAuthData.user.id;
      const expirationDate = new Date(
        new Date().getTime() + decodedAuthData.expiresIn * 1000
      );
      //save main user info
      localStorage.setItem('userData', JSON.stringify(decodedAuthData.user));
      localStorage.setItem('userDataSaml', JSON.stringify(decodedAuthData.req));

      // save auth data in local storage
      this.authService.saveAuthData(token, expirationDate, userId);
      // set session timer
      this.authService.setAuthTimer(decodedAuthData.expiresIn);
      // set true auth status listenner
      this.authService.setListenner();
      window.location.href = '/home';
    } else {
      this.ui.dismissLoading();
    }
  }

  getData() {
    let favSubs = this.favoriteService.getObservableData(this.userId);
    let bannerSubs = this.bannerService.getObservableData();
    this.user_id = localStorage.getItem('userId');

    this.ui.showLoading();
    forkJoin({ favorites: favSubs, banners: bannerSubs }).subscribe(
      (res: any) => {
        this.ui.dismissLoading();
        let favorites = res.favorites.body;
        // cambiar validacion de usuario a role de usuario
        if (this.user_id && this.user_id.length > 0) {
          this.favList = favorites;
        } else {
          this.openAlert();
        }

        let banners = res.banners.body.items;
        banners.forEach((singleBanner) => {
          if (singleBanner.status) {
            this.bannerList = [...this.bannerList, singleBanner];
          }
        });

        if (!localStorage.getItem('tutorial')) {
          this.openTutorial();
        }
      }
    );
  }

  openAlert() {
    this.ui.showModal(ModalAlertComponent, '500px', 'auto', '', 'backdrop');
  }

  openTutorial() {
    this.ui.showModal(
      TutorialComponent,
      '100%',
      'auto',
      'tutorial',
      'no-backdrop'
    );
  }

  redirectTo(slide: any) {
    console.log('open in new tab', slide);

    let extUrl = slide.url_redirect;
    if (slide.pdf != null) {
      extUrl = slide.pdf_info.full_path;
    }
    window.open(extUrl);
  }

  openApp(dashboard) {
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    });
  }
}
