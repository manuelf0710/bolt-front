import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private ui: UiService,
  ) {}

  getHeaders() {
    if (this.authService.isAuthenticated()) {
      return {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
      }
    }

    return {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
    }
  }

  getHeadersFormData() {
    if (this.authService.isAuthenticated()) {
      return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
      }
    }

    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
    }
  }

  public get(url: string, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders()
    }

    return this.http.get(url, {
      headers: headersIn,
      observe: 'response',
    })
  }

  public post(url: string, body?: any, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders()
    }
    return this.http.post(url, body, {
      headers: headersIn,
      observe: 'response',
    })
  }

  public postFormData(
    url: string,
    body?: FormData,
    headersIn?: any,
  ): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeadersFormData()
    }

    return this.http.post(url, body, {
      headers: headersIn,
      observe: 'response',
    })
  }

  public put(url: string, body?: any, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders()
    }
    return this.http.put(url, body, {
      headers: headersIn,
      observe: 'response',
    })
  }

  public putFormData(
    url: string,
    body?: FormData,
    headersIn?: any,
  ): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeadersFormData()
    }

    return this.http.put(url, body, {
      headers: headersIn,
      observe: 'response',
    })
  }

  public patch(url: string, body?: any, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders()
    }
    return this.http.patch(url, body, {
      headers: headersIn,
      observe: 'response',
    })
  }

  public delete(url: string, headersIn?: any): Observable<object> {
    if (headersIn == null) {
      headersIn = this.getHeaders()
    }
    return this.http.delete(url, {
      headers: headersIn,
      observe: 'response',
    })
  }
}
