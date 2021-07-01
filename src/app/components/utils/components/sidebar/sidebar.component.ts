import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MockProjects } from 'src/app/mocks/projects-mock';
import { AppList } from 'src/app/model/AppList';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { UiService } from 'src/app/services/ui.service';
import { environment } from 'src/environments/environment';
import { ModalConfirmationComponent } from '../../pop up/modal-confirmation/modal-confirmation.component';
import { ModalNotificationComponent } from '../../pop up/modal-notification/modal-notification.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public favList: AppList[] = [];
  //public prop = MockProjects
  public prop: any[] = [];

  public arrowType: string = 'arrow_forward_ios';
  public lang: string;
  public sideMemory: string;
  public userId: string = '';

  public checked: boolean = false;
  public isAdmin: boolean = false;
  public isAuth: boolean = false;
  public sideStatus: boolean = false;
  public collapseAll: boolean = false;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      console.log('clicked inside');
    } else {
      if (this.collapseAll == true) {
        let innerArrow = document.querySelector('#arrowSide');
        let sidebar = document.querySelector('#sidebar');
        let separator = document.querySelector('#separatorsidebar');

        this.sideStatus = !this.sideStatus;
        this.collapseAll = false;
        sessionStorage.setItem('sidebarStatus', 'close');
        sidebar.setAttribute('style', 'width: 80px !important');
        innerArrow.setAttribute('style', 'transform: rotate(0deg) ');
        separator.setAttribute('style', 'width: 65% !important');
      }
    }
  }
  constructor(
    private router: Router,
    private ui: UiService,
    public dialog: MatDialog,
    private authService: AuthService,
    private favoriteService: FavoritesService,
    private projectService: ProjectsService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.userId = localStorage.getItem('userId');
    this.isAdmin = this.authService.isAdministrator();
    this.isAuth = this.authService.isAuthenticated();
    this.sideMemory = sessionStorage.getItem('sidebarStatus') || 'open';

    if (this.sideMemory == 'close') {
      this.sideStatus = false;
    } else {
      this.sideStatus = true;
    }
    this.getData();
    this.getDataByUser();
  }

  getDataByUser() {
    this.projectService.getProjectsAssignByUserRol().subscribe(
      (res: any[]) => {
        this.prop = res;
        //console.log('la res', res);
        //this.prop = MockProjects;
        if (!this.prop.length) {
          //this.prop = MockProjects;
        }
        console.log('res in sidebarcomponent ', res);
      },
      (error: any) => {
        console.log('ha ocurrido un error ');
        console.log('error ', error);
      },
      () => {}
    );
  }

  getData() {
    let favSubs = this.favoriteService.getObservableData(this.userId);
    let projSubs = this.projectService.getObservableData();

    // this.ui.showLoading()
    forkJoin({ projects: projSubs, favorites: favSubs }).subscribe(
      (res: any) => {
        // this.ui.dismissLoading()
        this.favList = res.favorites.body;

        let projects = res.projects.body.items;

        this.openSidebar();
      }
    );
  }

  openSidebar() {
    let innerArrow = document.querySelector('#arrowSide');
    let sidebar = document.querySelector('#sidebar');
    let separator = document.querySelector('#separatorsidebar');

    this.sideStatus = !this.sideStatus;
    if (this.sideStatus) {
      this.collapseAll = false;

      sessionStorage.setItem('sidebarStatus', 'close');

      sidebar.setAttribute('style', 'width: 80px !important');

      innerArrow.setAttribute('style', 'transform: rotate(0deg) ');
      separator.setAttribute('style', 'width: 65% !important');
    } else {
      this.collapseAll = true;
      sessionStorage.setItem('sidebarStatus', 'open');
      sidebar.setAttribute('style', 'width: 267px !important');
      innerArrow.setAttribute('style', 'transform: rotate(180deg)');
      separator.setAttribute('style', 'width: 85% !important');
    }
  }

  menuOpened(item) {
    let menu = document.getElementById(item);
    let overlay = document.getElementsByClassName(
      'cdk-overlay-connected-position-bounding-box'
    );
    menu.classList.add('highlight-item');
    overlay[0].setAttribute(
      'style',
      'transform: translateX(211px) translateY(-36px) ;left: 0 !important;'
    );
  }

  menuClosed(item) {
    let menu = document.getElementById(item);
    menu.classList.remove('highlight-item');
  }

  arrowRotate(state: boolean, id?: number | string) {
    let actArrow = document.getElementById('arrowH' + id);
    let extArrow = document.getElementById('arrowE' + id);

    let actHeader = document.getElementById('panel' + id);
    let extHeader = document.getElementById('ext' + id);

    let actIcon = document.getElementById('iconH' + id);
    let extIcon = document.getElementById('iconE' + id);

    if (typeof id == 'string') {
      if (state) {
        extArrow.classList.add('arrowDown');
        extArrow.classList.remove('arrowUp');
        extHeader.classList.add('bg-black-panel');
        extIcon.classList.remove('menu-icon');
      } else {
        extArrow.classList.add('arrowUp');
        extArrow.classList.remove('arrowDown');
        extHeader.classList.remove('bg-black-panel');
        extIcon.classList.add('menu-icon');
      }
    } else {
      if (state) {
        actArrow.classList.add('arrowDown');
        actArrow.classList.remove('arrowUp');
        actHeader.classList.add('bg-black-panel');
        actIcon.classList.remove('menu-icon');
      } else {
        actArrow.classList.add('arrowUp');
        actArrow.classList.remove('arrowDown');
        actHeader.classList.remove('bg-black-panel');
        actIcon.classList.add('menu-icon');
      }
    }
  }

  showConfirmation(event, element) {
    let message_action_es;
    let message_action_en;

    if (this.favList.length < 6) {
      if (event) {
        message_action_es = 'agregar';
        message_action_en = 'add';
      } else {
        message_action_es = 'eliminar';
        message_action_en = 'delete';
      }
      /*
      const duplicado = this.favList.some((item)=> {
        return item.app_id == element.id;
      })

      if(duplicado == true){
        this.ui.createSnackbar(
          'La aplicación ya se encuentra como favorita',
          'x',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snack-alert',
          }
        );        
      } */

      const confDialog = this.dialog.open(ModalConfirmationComponent, {
        id: ModalConfirmationComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: {
          fav_name: this.lang == 'Esp' ? element.name_es : element.name_en,
          message_action_es: message_action_es,
          message_action_en: message_action_en,
        },
      });

      confDialog.afterClosed().subscribe((result) => {
        if (result) {
          let favData = {
            app_id: element.id,
            user_id: this.userId,
          };
          if (event) {
            this.favoriteService.postData(element, favData);
          } else {
            this.favoriteService.delete(element);
          }
        } else {
          window.location.reload();
        }
      });
    } else {
      if (event) {
        this.ui.createSnackbar(
          'Excedió el número de favoritos para poder asignar un nuevo tablero debe eliminar uno de los que tienes en la sección ',
          'x',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snack-alert',
          }
        );
      }
    }
  }

  openApp(dashboard: string) {
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    });
  }

  adminRedirect(route: string) {
    this.router.navigate([`admin/${route}`], {
      queryParamsHandling: 'preserve',
    });
  }
}
