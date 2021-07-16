import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private isAuth: boolean = true;
  public userId: string;
  public isAdmin: boolean = false;
  private samlData: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private router: Router
  ) {}

  public isAuthenticated(): boolean {
    return this.isAuth;
  }
  public isAdministrator(): boolean {
    let userProfile = JSON.parse(localStorage.getItem('userData'));
    if (userProfile['profile'] != 'user') {
      this.isAdmin = true;
    }
    return this.isAdmin;
  }

  public getToken() {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  login() {
    this.document.location.href = environment.serverUrl + environment.auth.get;
  }

  setListenner() {
    this.authStatusListener.next(true);
  }

  registerLog(): Observable<any> {
    return this.http
      .get(environment.serverUrl + environment.auth.registerlogout)
      .pipe(
        map((lista: any) => {
          console.log('el valor de lista logout ', lista);
          const registerlog = lista.body;
          return registerlog;
        })
      );
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.samlData = localStorage.getItem('userDataSaml');
    this.clearAuthdata();
    this.userId = null;
    //this.router.navigate(['/']);
    //let encodeData = btoa(this.samlData);
    /*this.document.location.href =
              environment.serverUrl + environment.logout.get + '?params=' + encodeData;*/
    this.document.location.href = environment.logout.get;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      this.login();
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0 || expiresIn <= 0) {
      this.token = authInformation.token;
      this.isAuth = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
      this.router.navigate(['/home']);
    }
  }

  saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthdata() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('userDataSaml');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      //this.logout()
    }, duration * 1000);
  }
}
