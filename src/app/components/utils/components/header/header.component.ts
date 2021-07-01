import { AfterContentChecked, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service'

type ProfileType = {
  givenName?: string
  surname?: string
  userPrincipalName?: string
  id?: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public lang: string
  public userName: string
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      this.userName = userData.name
    } else {
      this.userName = ''
    }
    this.lang = localStorage.getItem('lang') || 'Esp'
  }

  changeLang(event) {
    // read the local storage to set a language
    localStorage.setItem('lang', event.value)
    window.location.reload()
  }

  routerHome() {
    this.router.navigate(['home'])
  }

  logout() {
    this.authService.logout()
  }
}
