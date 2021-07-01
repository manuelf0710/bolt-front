import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

import { UiService } from 'src/app/services/ui.service'

import { DialogData } from '../../../pop up/modal-confirmation/modal-confirmation.component'
import { UsersService } from 'src/app/services/users.service'
import { Roles } from 'src/app/model/roles.model'
import { RolesService } from 'src/app/services/roles.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.scss'],
})
export class RolFormComponent implements OnInit, OnDestroy {
  private rolesSubs: Subscription
  public addNewRolForm: FormGroup
  public hide: boolean
  public password: string
  public lang: string
  public role_list: Roles[] = []

  private errorMessage: any = {
    es: {
      user_roles: 'Selecione como mínimo un rol',
    },
    en: {
      user_roles: 'Select at least one rol',
    },
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public roleService: RolesService,
    public userService: UsersService,
  ) {}

  ngOnInit(): void {
    this.initforms()
    this.getData()
  }

  getData() {
    this.ui.showLoading()
    this.rolesSubs = this.roleService.roles$.subscribe((roles: any) => {
      this.ui.dismissLoading()
      this.role_list = roles.items
      this.loadUser()
    })
    this.roleService.getData(1, 100)
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.addNewRolForm = this.formBuilder.group({
      user_name: new FormControl(
        {
          value: '',
          disabled: true,
        },
        [],
      ),
      user_id: new FormControl(
        {
          value: this.data.user_name,
          disabled: true,
        },
        [],
      ),
      user_country: new FormControl(
        {
          value: this.data.user_name,
          disabled: true,
        },
        [],
      ),
      user_roles: new FormControl('', [Validators.required]),
    })
  }

  saveRoles(): void {
    if (this.addNewRolForm.invalid) {
      ;(<any>Object).values(this.addNewRolForm.controls).forEach((control) => {
        control.markAsTouched()
      })
      return
    } else {
      let creator_id = localStorage.getItem('userId')
      let userRoles = []
      this.addNewRolForm.controls.user_roles.value.forEach((element) => {
        userRoles.push({
          user_id: this.data['user']['id'],
          rol_id: element,
        })
      })

      if (this.data['user']['roles'].lenght == 0) {
        this.userService.saveUserRoles(
          creator_id,
          this.data['user']['name'],
          userRoles,
          this.closeModal(),
        )
      } else {
        this.userService.updateUserRoles(
          creator_id,
          this.data['user']['name'],
          userRoles,
          this.closeModal(),
        )
      }
    }
  }

  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.addNewRolForm.get(controlName)
    if (control.touched && control.errors) {
      if (this.lang == 'Esp') {
        error = this.errorMessage['es'][controlName]
      }
      if (this.lang == 'Eng') {
        error = this.errorMessage['en'][controlName]
      }
    }
    return error
  }

  closeModal() {
    this.ui.dismissModal(RolFormComponent)
  }

  loadUser() {
    if (this.data) {
      let user_roles = []

      this.data['user']['roles'].forEach((role) => {
        user_roles.push(role.id)
      })

      this.addNewRolForm.patchValue({
        user_name:
          this.data['user']['name'] + ' ' + this.data['user']['last_name'],
        user_id: this.data['user']['employee_code'],
        user_country: this.data['user']['country'],
        user_roles: user_roles,
      })
    }
  }

  ngOnDestroy() {
    this.rolesSubs.unsubscribe()
  }
}
