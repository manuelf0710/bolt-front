import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarToggleService {
  public sideStatus: boolean = false;
  public collapseAll: boolean = false;

  constructor() {}

  openSide() {
    let innerArrow = document.querySelector('#arrowSide');
    let sidebar_container = document.querySelector('#aside-content');
    let sidebar = document.querySelector('#sidebar');
    let separator = document.querySelector('#separatorsidebar');
    this.sideStatus = false;
    this.collapseAll = true;

    sessionStorage.setItem('sidebarStatus', 'open');
    sidebar.setAttribute('style', 'width: 267px !important');
    sidebar_container.setAttribute('style', 'width: 267px !important');
    innerArrow.setAttribute('style', 'transform: rotate(180deg)');
    separator.setAttribute('style', 'width: 85% !important');
  }

  closeSide() {
    let innerArrow = document.querySelector('#arrowSide');
    let sidebar_container = document.querySelector('#aside-content');
    let sidebar = document.querySelector('#sidebar');
    let separator = document.querySelector('#separatorsidebar');
    let panel = document.querySelector('.mat-menu-panel');
    this.sideStatus = true;
    this.collapseAll = false;

    sessionStorage.setItem('sidebarStatus', 'close');
    sidebar.setAttribute('style', 'width: 80px !important');
    sidebar_container.setAttribute('style', 'width: 80px !important');
    innerArrow.setAttribute('style', 'transform: rotate(0deg) ');
    separator.setAttribute('style', 'width: 65% !important');

    if (panel) {
      panel.setAttribute('style', 'display:none');
    }
  }
}
