import { Component, OnInit } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { UiService } from 'src/app/services/ui.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit() {
    this.uiService.showLoading()
    this.authService.autoAuthUser()
  }
}
