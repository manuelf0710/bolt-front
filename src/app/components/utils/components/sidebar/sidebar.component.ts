import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AppList } from 'src/app/model/AppList';
import { AppsService } from 'src/app/services/apps.service';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public favList: AppList[] = [];
  public prop: any[] = [];
  public appsData: any[] = [];

  public arrowType: string = 'arrow_forward_ios';
  public lang: string;
  public sideMemory: string;
  public userId: string = '';

  public checked: boolean = false;
  public isAdmin: boolean = false;
  public isAuth: boolean = false;
  public sideStatus: boolean = false;
  public collapseAll: boolean = false;

  constructor(
    private router: Router,
    private ui: UiService,
    public dialog: MatDialog,
    private authService: AuthService,
    private favoriteService: FavoritesService,
    private projectService: ProjectsService,
    private appService: AppsService
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.userId = localStorage.getItem('userId');
    this.isAdmin = this.authService.isAdministrator();
    this.isAuth = this.authService.isAuthenticated();
    this.sideMemory = sessionStorage.getItem('sidebarStatus') || 'open';

    if (this.sideMemory == 'close') {
      this.sideStatus = false;
      this.closeSide();
    } else {
      this.sideStatus = true;
      this.openSide();
    }
    this.getData();
  }

  getData() {
    let favSubs = this.favoriteService.getObservableData(this.userId);
    let appsSubs = this.appService.getObservableData();
    let projSubs = this.projectService.getProjectsAssignByUserRol();

    forkJoin({
      projects: projSubs,
      favorites: favSubs,
      apps: appsSubs,
    }).subscribe((res: any) => {
      this.favList = res.favorites.body;
      this.prop = res.projects;
      this.appsData = res.apps.body.items;
    });
  }

  menuOpened(item) {
    let menu = document.getElementById(item);
    let division = document.getElementById('bg-' + item);
    let overlay = document.getElementsByClassName(
      'cdk-overlay-connected-position-bounding-box'
    );

    division.classList.add('background-black');
    menu.classList.add('highlight-item');
    overlay[0].setAttribute(
      'style',
      'transform: translateX(211px) translateY(-40px) ;left: 0 !important;'
    );
  }

  menuClosed(item) {
    let menu = document.getElementById(item);
    let division = document.getElementById('bg-' + item);
    division.classList.remove('background-black');
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

  openSide() {
    let innerArrow = document.querySelector('#arrowSide');
    let sidebar = document.querySelector('#sidebar');
    let separator = document.querySelector('#separatorsidebar');
    this.sideStatus = false;
    this.collapseAll = true;

    sessionStorage.setItem('sidebarStatus', 'open');
    sidebar.setAttribute('style', 'width: 267px !important');
    innerArrow.setAttribute('style', 'transform: rotate(180deg)');
    separator.setAttribute('style', 'width: 85% !important');
  }

  receiveDataChild(event: boolean) {
    this.collapseAll = event;
    this.sideStatus = !event;
  }

  closeSide() {
    let innerArrow = document.querySelector('#arrowSide');
    let sidebar = document.querySelector('#sidebar');
    let separator = document.querySelector('#separatorsidebar');
    let panel = document.querySelector('.mat-menu-panel');
    this.sideStatus = true;
    this.collapseAll = false;

    sessionStorage.setItem('sidebarStatus', 'close');
    sidebar.setAttribute('style', 'width: 80px !important');
    innerArrow.setAttribute('style', 'transform: rotate(0deg) ');
    separator.setAttribute('style', 'width: 65% !important');

    if (panel) {
      panel.setAttribute('style', 'display:none');
    }
  }

  showConfirmation(event, element, origin?) {
    if (this.favList.length < 6) {
      if (event) {
        let favData = {
          app_id: element.id,
          user_id: this.userId,
        };
        this.favoriteService.postData(element, favData);
      }
    } else {
      if (event) {
        this.ui.createSnackbar(
          this.lang == 'Esp'
            ? 'Excedió el número de favoritos, para poder asignar un nuevo tablero debes eliminar uno de los que tienes en la sección'
            : 'Exceeded the number of favorites, in order to assign a new board you must remove one of those you have in the section',
          'x',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snack-alert',
          }
        );
      }
    }
    if (!event) {
      // match the id of app selected with app in fav list to deleted from the service
      let app_table_id;
      if (this.favList.length > 0) {
        this.favList.forEach((fav) => {
          if (origin) {
            if (fav.app_id == element.app_id) {
              app_table_id = fav;
            }
          } else {
            if (fav.app_id == element.id) {
              app_table_id = fav;
            }
          }
        });
      }
      this.favoriteService.delete(app_table_id);
    }
  }

  getClassName(Id: string) {
    let className = '';
    this.appsData.forEach((app) => {
      if (app.id == Id) {
        className = app.type.name.split(' ')[0].toLowerCase();
      }
    });
    return className;
  }

  openApp(dashboard: string) {
    this.collapseEvent();
    this.closeSide();
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    });
  }

  adminRedirect(route: string) {
    this.collapseEvent();
    this.closeSide();
    this.router.navigate([`admin/${route}`], {
      queryParamsHandling: 'preserve',
    });
  }

  collapseEvent() {
    this.accordion.multi = true;
    this.accordion.closeAll();
    setTimeout(() => {
      this.accordion.multi = false;
    }, 100);
  }
}
