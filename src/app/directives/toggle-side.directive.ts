import { Input } from '@angular/core';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appToggleSide]',
})
export class ToggleSideDirective implements OnInit {
  @Input() sideStatus: boolean;
  @Output() colapsable = new EventEmitter();
  public sideMemory: string;

  constructor(private _el: ElementRef) {}

  ngOnInit() {
    this.sideMemory = sessionStorage.getItem('sidebarStatus') || 'open';

    if (this.sideMemory == 'close') {
      this.sideStatus = false;
      this.closeSide();
    } else {
      this.sideStatus = true;
      this.openSide();
    }
  }

  @HostListener('click', ['$event']) onclick(event) {
    if (this._el.nativeElement.id == 'collapseSide') {
      if (this.sideStatus) {
        this.openSide();
      } else {
        this.closeSide();
      }
    } else {
      if (this.sideStatus) {
        this.openSide();
      }
    }
  }

  openSide() {
    let innerArrow = document.querySelector('#arrowSide');
    let sidebar = document.querySelector('#sidebar');
    let separator = document.querySelector('#separatorsidebar');
    this.sideStatus = false;
    this.colapsable.emit(true);
    sessionStorage.setItem('sidebarStatus', 'open');
    sidebar.setAttribute('style', 'width: 267px !important');
    innerArrow.setAttribute('style', 'transform: rotate(180deg)');
    separator.setAttribute('style', 'width: 85% !important');
  }

  closeSide() {
    let innerArrow = document.querySelector('#arrowSide');
    let sidebar = document.querySelector('#sidebar');
    let separator = document.querySelector('#separatorsidebar');
    let panel = document.querySelector('.mat-menu-panel');
    this.sideStatus = true;
    this.colapsable.emit(false);
    sessionStorage.setItem('sidebarStatus', 'close');
    sidebar.setAttribute('style', 'width: 80px !important');
    innerArrow.setAttribute('style', 'transform: rotate(0deg) ');
    separator.setAttribute('style', 'width: 65% !important');

    if (panel) {
      panel.setAttribute('style', 'display:none');
    }
  }
}
