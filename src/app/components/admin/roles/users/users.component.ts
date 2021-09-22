import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ModalUserFormComponent } from 'src/app/components/utils/admin/roles-and-users/modal-user-form/modal-user-form.component';
import { ModalConfirmationComponent } from 'src/app/components/utils/pop up/modal-confirmation/modal-confirmation.component';
import { RolFormComponent } from 'src/app/components/utils/admin/roles-and-users/rol-form/rol-form.component';
import { UiService } from 'src/app/services/ui.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/model/User.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private userSubs: Subscription;
  public lang: string;
  public pages: number;
  public users: User[] = [];
  public searchForm: FormGroup;
  public active_count = 1;
  public total_items: number;

  constructor(
    public activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public dialog: MatDialog,
    public userService: UsersService
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.getData(1);
    this.initforms();
  }

  getData(page: number) {
    this.ui.showLoading();
    this.userSubs = this.userService.users$.subscribe((users: any) => {
      this.ui.dismissLoading();
      this.pages = users.meta.totalPages;
      this.active_count = users.meta.currentPage;
      this.total_items = users.meta.totalItems;
      this.users = users.items;
    });
    this.userService.getFullData(page);
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.searchForm = this.formBuilder.group({
      user_name: new FormControl('', []),
      country: new FormControl('', []),
      user_id: new FormControl('', []),
    });
  }

  createUser(user?: any) {
    if (!user) {
      this.ui.showModal(ModalUserFormComponent, '500px', 'auto', null, null);
      /*const confDialog = this.dialog.open(ModalUserFormComponent, {
        id: ModalUserFormComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
      });*/
    } else {
      this.ui.showModal(ModalUserFormComponent, '500px', 'auto', null, null, {
        user: user,
      });
      /* 
      const confDialog = this.dialog.open(ModalUserFormComponent, {
        id: ModalUserFormComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: { user: user },
      });

      confDialog.afterClosed().subscribe((result) => {
        alert(result);
        if (result) {
          console.log('el resultado ', result);
        } else {
          console.log('el resultado else ', result);
        }
      });
      */
    }
  }

  searchUser() {
    let user_data = {
      id: this.searchForm.controls.user_id.value,
      name: this.searchForm.controls.user_name.value,
      country: this.searchForm.controls.country.value,
    };

    this.userSubs = this.userService.users$.subscribe((users: any) => {
      this.pages = users.meta.totalPages;
      this.active_count = users.meta.currentPage;
      this.users = users.items;
    });
    this.userService.searchUsers(user_data);
  }

  addNewRol(target: any): void {
    this.ui.showModal(RolFormComponent, '500px', 'auto', null, null, {
      user: target,
    });
  }

  updateUserStatus(target: User, event) {
    let message_action_es = 'habilitó';
    let message_action_en = 'enabled';

    if (event.checked == 'enable') {
      message_action_es = 'deshabilitó';
      message_action_en = 'disabled';
    }
    this.userService.updateStatus(target, message_action_es, message_action_en);
  }

  showConfirmation(target: any, message_es: string, message_en: string, event) {
    if (target.status == 1) {
      message_es = 'deshabilitar';
      message_en = 'disable';
    }

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        user_name: target.name + ' ' + target.last_name,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    });

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading();
        this.updateUserStatus(target, event);
      } else {
        window.location.reload();
      }
    });
  }

  updatePage(page: string) {
    if (page == 'start') {
      this.active_count = 0;
    }
    if (page == 'prev') {
      this.active_count--;
    }
    if (page == 'next') {
      this.active_count++;
    }
    if (page == 'last') {
      this.active_count = this.pages;
    }
    this.getData(this.active_count);
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }
}
