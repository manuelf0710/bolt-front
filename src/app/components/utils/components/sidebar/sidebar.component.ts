import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AppList } from 'src/app/model/AppList';
import { AppsService } from 'src/app/services/apps.service';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { SidebarToggleService } from 'src/app/services/sidebar-toggle.service';
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
    private appService: AppsService,
    public sideToggleService: SidebarToggleService
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.userId = localStorage.getItem('userId');
    this.isAdmin = this.authService.isAdministrator();
    this.isAuth = this.authService.isAuthenticated();
    this.sideMemory = sessionStorage.getItem('sidebarStatus') || 'open';

    if (this.sideMemory == 'close') {
      this.sideToggleService.sideStatus = false;
      this.sideToggleService.closeSide();
    } else {
      this.sideToggleService.sideStatus = true;
      this.sideToggleService.openSide();
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
      //this.prop = res.projects;
      const uniqueProj = this.filterUniqueProjects(res.projects);
      const dataProj = this.getAllProjectSubmenuApps(res.projects);
      this.prop = this.finalProjects(uniqueProj.uniques, dataProj);
      this.appsData = res.apps.body.items;
    });
  }

  finalProjects(arr, submenus){
      for (let i = 0; i < arr.length; i++) {
        arr[i].submenus= [];
        for (let j = 0; j < submenus.length; j++) {
          if(arr[i].id == submenus[j].project_id){
            arr[i].submenus.push(submenus[j]);
          }         
        }
      }
      return arr;
  }

  getAllProjectSubmenuApps(arr){
      let submenus = [];
      let apps = [];

      for(let i = 0; i < arr.length; i++){
          for (let j = 0; j < arr[i].submenus.length; j++) {
            submenus.push(arr[i].submenus[j]);  
          }
      }

      for(let k = 0; k < submenus.length; k++){
        for (let m = 0; m < submenus[k].apps.length; m++) {
          apps.push(submenus[k].apps[m]); 
          //submenus[k].apps = [] ;  
        }
    }   
    
    submenus = this.filterUniques(submenus);
    apps     = this.filterUniques(apps);

    for (let i = 0; i < submenus.length; i++) {
     submenus[i].apps = [];
    }

    for (let m = 0; m < submenus.length; m++) {
      for (let n = 0; n < apps.length; n++) {
        if(apps[n].submenu_id == submenus[m].id){
          submenus[m].apps.push(apps[n]);
        }
      }   
    } 
    return submenus;
  }

  

  filterUniqueProjects(arr){
    let uniques = [];
    let repeats = [];
    for(let i = 0; i < arr.length; i++ ){
         let found = 0;
        for(let j = 0; j < uniques.length; j++){
          if(arr[i].id == uniques[j].id){
            found = 1;
          }
        }
        if(found == 0){
          uniques.push(arr[i]);
        }else{
          repeats.push(arr[i]);
        }
    }
    return {uniques,repeats};
  }

  filterUniques(arr){
    let uniques = [];
    let repeats = [];
    for(let i = 0; i < arr.length; i++ ){
         let found = 0;
        for(let j = 0; j < uniques.length; j++){
          if(arr[i].id == uniques[j].id){
            found = 1;
          }
        }
        if(found == 0){
          uniques.push(arr[i]);
        }else{
          repeats.push(arr[i]);
        }
    }
    //const uniques = arr.filter((el, index) => arr.indexOf(el) === index)

    return uniques;
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
    this.sideToggleService.closeSide();
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    });
  }

  adminRedirect(route: string) {
    this.collapseEvent();
    this.sideToggleService.closeSide();
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
